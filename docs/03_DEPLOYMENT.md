# Deployment

Satu host, Docker Compose, image dari GHCR. Server tidak pernah melakukan
build — ia menarik image yang sudah dibangun dan diuji CI, lalu menukar
container.

## Arsitektur

```
                        internet
                           │
                    TLS (Let's Encrypt)
                           │
          ┌────────────────▼─────────────────┐
          │   Nginx Proxy Manager / LB       │   host, di luar stack ini
          └──┬──────┬────────┬──────────┬────┘
             │      │        │          │
   api.  ────┘      │        │          └──── sewantara.id
   :8090            │        │                :3003  landing
                    │        └─────────────── *.sewantara.id
             app.sewantara.id                 :3000  tenant-web
             :3005  dashboard
──────────────────────────────────────────────────────────────────
  network: edge     api-web  dashboard  tenant-web  landing
──────────────────────────────────────────────────────────────────
  network: backend  api-web  api  api-queue  api-scheduler
                    api-reverb  postgres  redis
──────────────────────────────────────────────────────────────────
  volumes           postgres_data   redis_data   api_storage
```

| Service | Image | Peran |
| --- | --- | --- |
| `api-web` | `sewantara-api-web` | Pintu masuk HTTP API + proxy WebSocket ke Reverb |
| `api` | `sewantara-api` | PHP-FPM |
| `api-queue` | `sewantara-api` | `queue:work redis` |
| `api-scheduler` | `sewantara-api` | `schedule:work` |
| `api-reverb` | `sewantara-api` | Server WebSocket Reverb |
| `api-migrate` | `sewantara-api` | Sekali jalan: migration central + tenant + EngineSeeder |
| `dashboard` | `sewantara-dashboard` | Nuxt SPA |
| `tenant-web` | `sewantara-tenant-web` | Nuxt SSR + BFF |
| `landing` | `sewantara-landing` | Nuxt SSR |
| `postgres` | `postgres:17-alpine` | Database central + schema tiap tenant |
| `redis` | `redis:7.4-alpine` | Cache, session, queue, state Reverb |

Dua network memisahkan yang boleh dijangkau reverse proxy (`edge`) dari
penyimpanan (`backend`). Tiga app Nuxt hanya ada di `edge`, jadi secara
struktural tidak bisa menyentuh PostgreSQL atau Redis.

`api-migrate` memakai compose profile `tools`, sehingga `up -d` tidak pernah
menjalankannya. Hanya `deploy.sh` yang memanggilnya, lewat `compose run --rm`.

## Menyiapkan server

### 1. Host

- Docker Engine 24+ dan plugin Compose **2.24+** (`docker compose version --short`).
- User deploy anggota grup `docker`, tanpa `sudo` interaktif.
- Firewall: hanya port reverse proxy yang terbuka ke internet.

```bash
sudo usermod -aG docker deploy
```

### 2. DNS

| Record | Menuju |
| --- | --- |
| `api.sewantara.id` | IP server |
| `app.sewantara.id` | IP server |
| `sewantara.id` dan `www` | IP server |
| `*.sewantara.id` | IP server (domain tenant) |

Sertifikat TLS harus mencakup domain API, domain app, apex, dan wildcard
tenant.

### 3. Clone

```bash
sudo mkdir -p /srv/sewantara
sudo chown deploy:deploy /srv/sewantara
git clone https://github.com/<owner>/sewantara.git /srv/sewantara
cd /srv/sewantara
```

Path ini menjadi nilai secret `DEPLOY_PATH` di GitHub.

### 4. Konfigurasi

```bash
deploy/scripts/bootstrap.sh
```

Script membuat berkas berikut dari template dan tidak pernah menimpa yang
sudah ada:

| Berkas | Isi |
| --- | --- |
| `deploy/.env` | registry, port host, timezone, perilaku rollout |
| `deploy/.env.images` | tag image yang berjalan (setelah ini dikelola `deploy.sh`) |
| `deploy/env/api.env` | seluruh konfigurasi Laravel + kredensial PostgreSQL |
| `deploy/env/dashboard.env` | |
| `deploy/env/tenant-web.env` | |
| `deploy/env/landing.env` | |

Isi nilainya. Yang wajib diganti:

```bash
openssl rand -base64 32   # APP_KEY  → tulis sebagai base64:<hasil>
openssl rand -hex 32      # REVERB_APP_SECRET
openssl rand -hex 16      # REVERB_APP_KEY
openssl rand -base64 24   # DB_PASSWORD == POSTGRES_PASSWORD (harus sama)
```

Di `deploy/.env`, set `REGISTRY` ke namespace GHCR Anda (huruf kecil):

```dotenv
REGISTRY=ghcr.io/namaowner
```

Jalankan `bootstrap.sh` sekali lagi — ia akan memperingatkan placeholder yang
masih tertinggal (`example.com`, `change-this`, `APP_KEY` kosong,
`DB_PASSWORD` ≠ `POSTGRES_PASSWORD`). Daftar lengkap variable ada di
[07_SECRETS_AND_ENV.md](07_SECRETS_AND_ENV.md).

### 5. Rollout pertama

Tag `latest` hanya untuk bootstrap. Setelah ini selalu gunakan tag immutable.

```bash
export GHCR_USER=<github-username>
export GHCR_TOKEN=<PAT dengan scope read:packages>

deploy/scripts/deploy.sh --tag latest api dashboard tenant-web landing
deploy/scripts/status.sh
```

Setelah GitHub Actions terhubung, PAT ini tidak dibutuhkan lagi: workflow
meneruskan `GITHUB_TOKEN` berumur pendek pada setiap deploy, sehingga tidak ada
kredensial permanen tersimpan di server.

### 6. Reverse proxy

Arahkan tiap domain ke port host:

| Domain | Proxy ke | Catatan |
| --- | --- | --- |
| `api.sewantara.id` | `127.0.0.1:8090` | WebSocket harus diaktifkan (`/app/*`, `/apps/*`) |
| `app.sewantara.id` | `127.0.0.1:3005` | |
| `*.sewantara.id` | `127.0.0.1:3000` | Teruskan header `Host` apa adanya |
| `sewantara.id` | `127.0.0.1:3003` | |

Dua hal yang harus benar:

- **`Host` diteruskan utuh** ke `tenant-web` dan `api-web`. Keduanya
  menentukan tenant dari `Host`; kalau proxy menimpanya, semua request jatuh ke
  tenant yang salah atau ditolak.
- **`X-Forwarded-Proto`** di-set. Laravel membentuk URL absolut dari nilai ini,
  dan `NUXT_TRUST_PROXY=true` hanya aman jika proxy selalu menimpa header
  forwarded milik klien.

Kalau port `8090` bertabrakan dengan aplikasi lain di host, ubah
`API_HTTP_PORT` di `deploy/.env` — port di dalam container tidak berubah.

## Anatomi rollout

`deploy/scripts/deploy.sh` adalah satu-satunya jalur deploy, dipakai baik oleh
GitHub Actions maupun manual.

```
1  lock              → dua rollout paralel akan merusak .env.images
2  snapshot           .env.images → .env.images.previous
3  tulis tag baru     API_IMAGE_TAG=1.4.0
4  pull               gagal di sini = belum ada yang berubah
5  up -d postgres redis + tunggu healthy
6  migrate            compose run --rm api-migrate  (image BARU, container lama masih melayani)
7  up -d <services>   tukar container
8  health gate        tunggu semua healthcheck, default 180s
9  catat              .deploy-history.log
10 prune              docker image prune -f
```

Urutan langkah 6 dan 7 disengaja: migration dijalankan dari image baru
**sebelum** container aplikasi ditukar. Kalau migration gagal, belum ada satu
pun container yang diganti dan production tetap utuh.

Gagal di langkah 7 atau 8 memicu rollback otomatis: tag dikembalikan dari
`.env.images.previous` lalu `up -d` diulang. Untuk mematikannya (agar bisa
diperiksa), set `AUTO_ROLLBACK=0` di `deploy/.env`.

## Perintah operasional

```bash
make status                        # tag, health, commit sha, 10 rollout terakhir
make deploy APP=api TAG=1.4.0
make deploy-all TAG=1.4.0
make restart APP=tenant-web        # setelah mengubah deploy/env/tenant-web.env
make rollback APP=api
make logs SVC=api-queue
make artisan CMD="tenants:list"
make backup
make ps
```

Bentuk langsung, kalau lebih suka tanpa make:

```bash
deploy/scripts/deploy.sh --tag 1.4.0 api
deploy/scripts/deploy.sh --tag sha-9f3c… --no-migrate api dashboard
deploy/scripts/deploy.sh --restart-only landing
deploy/scripts/rollback.sh --to 1.3.2 api
deploy/scripts/status.sh --history 30
```

## Mengubah konfigurasi tanpa rilis

| Berubah | Tindakan |
| --- | --- |
| `deploy/env/api.env` | `make restart APP=api` — entrypoint membangun ulang config cache |
| `deploy/env/tenant-web.env` | `make restart APP=tenant-web` |
| `deploy/env/landing.env` | `make restart APP=landing` |
| `deploy/env/dashboard.env` (`NUXT_PUBLIC_*`) | **Butuh rebuild image**, bukan restart — lihat [02_DOCKER_IMAGES.md](02_DOCKER_IMAGES.md) |
| Port di `deploy/.env` | `make restart APP=<app>` |
| `deploy/compose.yml` | Commit → merge → deploy (server checkout commit yang di-deploy) |

## Migration tenant

`api-migrate` menjalankan tiga hal, berurutan:

```
php artisan migrate --force                          # schema central
php artisan tenants:migrate --force                  # semua tenant yang ada
php artisan db:seed --class=EngineSeeder --force      # katalog engine
```

`EngineSeeder` idempotent (`updateOrCreate` berdasarkan `code`), jadi aman
dijalankan setiap deploy. Tenant **baru** tidak butuh langkah ini: schema-nya
dibuat dan dimigrasikan otomatis lewat proses onboarding
([docs/14_TenantOnboarding.md](docs/14_TenantOnboarding.md)).

Aturan yang membuat rollback aman: **migration harus kompatibel ke belakang.**
Tambah kolom nullable, jangan menghapus atau mengganti nama kolom yang masih
dipakai versi sebelumnya. Perubahan destruktif dipecah menjadi dua rilis —
rilis pertama berhenti memakai kolomnya, rilis kedua menghapusnya. Tanpa
disiplin ini, rollback container tidak akan menyelamatkan apa pun karena
databasenya sudah maju.

## Backup

```bash
make backup                                  # → deploy/backups/
deploy/scripts/backup.sh --out /mnt/backup --keep 30
```

Menghasilkan dua berkas: dump PostgreSQL format custom (`pg_restore` bisa
selektif dan paralel) dan arsip volume `api_storage` (upload tenant, media
privat).

Backup di host yang sama dengan datanya bukan backup. Salin keluar (rclone,
restic, snapshot provider) dan uji restore-nya secara berkala —
[06_RUNBOOK.md](06_RUNBOOK.md) berisi prosedurnya.

## Akses PostgreSQL dari luar

Default `POSTGRES_BIND_IP=127.0.0.1` artinya hanya lewat SSH tunnel:

```bash
ssh -L 5432:127.0.0.1:5432 deploy@server
```

Kalau benar-benar harus dibuka, set `POSTGRES_BIND_IP=0.0.0.0` **dan** batasi
di firewall:

```bash
sudo ufw allow from <IP_ADMIN>/32 to any port 5432 proto tcp
sudo ufw deny 5432/tcp
```

Jangan pernah membuka 5432 tanpa pembatasan. Redis (6379), Reverb (8080), dan
PHP-FPM (9000) tidak dipublikasikan sama sekali dan harus tetap begitu.
