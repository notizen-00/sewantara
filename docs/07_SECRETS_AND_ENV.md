# Secret dan environment variable

## Di mana konfigurasi hidup

Empat tempat, dengan tanggung jawab berbeda. Salah tempat = konfigurasi diam
tidak terbaca, atau lebih buruk, secret ikut ter-commit.

| Tempat | Isi | Masuk Git? |
| --- | --- | --- |
| `apps/<app>/.env*` | Konfigurasi **development lokal** | Hanya `*.example` |
| `deploy/.env` | Port host, registry, timezone, perilaku rollout | Hanya `.env.example` |
| `deploy/.env.images` | Tag image yang berjalan. Dikelola `deploy.sh`. | Hanya `.env.images.example` |
| `deploy/env/<app>.env` | Konfigurasi **runtime container** + seluruh secret | Hanya `*.env.example` |
| GitHub Secrets (per Environment) | Kredensial SSH ke server | Tidak |
| GitHub Variables (repository) | Nilai build-time yang dibakar ke bundle | Tidak (tapi tidak rahasia) |

Dua jebakan yang perlu diingat:

1. **`env_file` bukan sumber interpolasi.** Variable di `deploy/env/*.env`
   hanya menjadi environment di dalam container. Ia **tidak** bisa dipakai
   sebagai `${VAR}` di `compose.yml`. Yang bisa hanya `deploy/.env` dan
   `deploy/.env.images`.
2. **Nama runtime ≠ nama development untuk Nuxt bertingkat.** Lihat bagian
   `tenant-web` di bawah.

## `deploy/.env` — level host

Template: [`deploy/.env.example`](../deploy/.env.example)

| Variable | Default | Keterangan |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `sewantara` | Prefiks nama container & volume. Mengubahnya = kehilangan volume lama. |
| `REGISTRY` | `ghcr.io/sewantara` | Namespace GHCR, **huruf kecil**, sama dengan owner yang menjalankan workflow |
| `TZ` | `Asia/Jakarta` | |
| `API_HTTP_BIND` / `API_HTTP_PORT` | `0.0.0.0` / `8090` | Port host untuk `api-web` |
| `DASHBOARD_BIND` / `DASHBOARD_PORT` | `0.0.0.0` / `3005` | |
| `TENANT_WEB_BIND` / `TENANT_WEB_PORT` | `0.0.0.0` / `3000` | |
| `LANDING_BIND` / `LANDING_PORT` | `0.0.0.0` / `3003` | |
| `POSTGRES_BIND_IP` | `127.0.0.1` | `0.0.0.0` hanya bersama aturan firewall |
| `POSTGRES_PUBLIC_PORT` | `5432` | |
| `REDIS_MAXMEMORY` | `512mb` | Kebijakan `noeviction`; ukurannya harus di atas working set |
| `HEALTH_TIMEOUT` | `180` | Detik yang ditunggu `deploy.sh` sebelum menyatakan gagal |
| `AUTO_ROLLBACK` | `1` | `0` = biarkan rollout gagal tetap terpasang untuk diperiksa |

## `deploy/env/api.env` — Laravel

Template: [`apps/api/.env.production.example`](../apps/api/.env.production.example)
(disalin oleh `bootstrap.sh`, bukan diduplikasi di `deploy/`).

Wajib diisi sebelum rollout pertama:

| Variable | Cara membuat | Catatan |
| --- | --- | --- |
| `APP_KEY` | `openssl rand -base64 32` | Tulis sebagai `base64:<hasil>`. **Mengubahnya membuat seluruh data terenkripsi tidak bisa dibaca.** |
| `DB_PASSWORD` | `openssl rand -base64 24` | Harus **sama** dengan `POSTGRES_PASSWORD` |
| `POSTGRES_PASSWORD` | idem | Hanya dipakai saat volume PostgreSQL pertama kali dibuat |
| `REVERB_APP_KEY` | `openssl rand -hex 16` | Publik (dikirim ke browser) |
| `REVERB_APP_SECRET` | `openssl rand -hex 32` | Rahasia |
| `MIDTRANS_SERVER_KEY` / `CLIENT_KEY` | dashboard Midtrans | |
| `XENDIT_SECRET_KEY` / `WEBHOOK_TOKEN` | dashboard Xendit | |
| `DOKU_CLIENT_ID` / `SECRET_KEY` | dashboard DOKU | |
| `GOOGLE_CLIENT_ID` / `CLIENT_SECRET` | Google Cloud Console | |
| `MAIL_PASSWORD` atau `RESEND_API_KEY` | provider email | |
| `BFF_SERVICE_TOKEN_CURRENT` | `openssl rand -hex 32` | Token yang dipakai `tenant-web` untuk memanggil API |
| `INTERNAL_HEALTH_TOKEN` | `openssl rand -hex 16` | |

Nilai yang tidak boleh ketinggalan diganti dari `example.com`:

```dotenv
APP_URL=https://api.sewantara.id
SESSION_DOMAIN=.sewantara.id
TENANT_BASE_DOMAIN=sewantara.id
CENTRAL_DOMAINS=api.sewantara.id
API_DOMAIN=api.sewantara.id
REVERB_ALLOWED_ORIGINS=https://sewantara.id,https://app.sewantara.id
CORS_ALLOWED_ORIGINS=https://sewantara.id,https://app.sewantara.id
REVERB_PUBLIC_HOST=api.sewantara.id
```

Nilai koneksi internal container — jangan diubah ke `localhost`:

```dotenv
DB_HOST=postgres
REDIS_HOST=redis
REVERB_HOST=reverb
REVERB_PORT=8080
REVERB_SCHEME=http
```

> **Kenapa `reverb`, bukan `api-reverb`.** Di `deploy/compose.yml` nama
> service-nya `api-reverb`, tapi ia punya network alias `reverb` — dan service
> `api` punya alias `app`. Dua alias itu ada karena
> `apps/api/docker/nginx/default.conf` menuliskan `server app:9000` dan
> `server reverb:8080` secara literal. Alias membuat konfigurasi nginx dan
> template env Laravel tetap berlaku apa adanya, sementara nama service di
> stack tetap berprefiks `api-` agar jelas milik app mana. Jangan mengubah
> `REVERB_HOST` menjadi `api-reverb`.

`bootstrap.sh` memperingatkan `APP_KEY` kosong, password yang masih template,
`DB_PASSWORD` ≠ `POSTGRES_PASSWORD`, dan sisa `example.com`.

## `deploy/env/dashboard.env`

Template: [`deploy/env/dashboard.env.example`](../deploy/env/dashboard.env.example)

| Variable | Dibaca kapan |
| --- | --- |
| `NUXT_PUBLIC_API_BASE` | **Build** — dibakar ke bundle SPA |
| `NUXT_PUBLIC_TENANT_BASE_DOMAIN` | **Build** |

Karena `ssr: false`, nilai di file ini hanya jaring pengaman. Yang benar-benar
berlaku adalah repository variable GitHub bernama sama, yang diteruskan sebagai
build arg. **Mengubah nilainya butuh rebuild image, bukan restart.**

## `deploy/env/tenant-web.env`

Template: [`deploy/env/tenant-web.env.example`](../deploy/env/tenant-web.env.example)

Seluruhnya runtime — mengubah nilai cukup `make restart APP=tenant-web`.

| Variable | Keterangan |
| --- | --- |
| `NUXT_API_BASE` | Base URL Laravel untuk pemanggilan sisi server |
| `NUXT_API_TOKEN` | Sama dengan `BFF_SERVICE_TOKEN_CURRENT` di `api.env` |
| `NUXT_PUBLIC_BASE_DOMAIN` | `sewantara.id` — dasar resolusi subdomain tenant |
| `NUXT_PUBLIC_BASE_URL` | URL publik kanonik |
| `NUXT_PUBLIC_DEMO_MODE` | `false` di production |
| `NUXT_TRUST_PROXY` | `true` hanya jika proxy selalu menimpa header forwarded |
| `NUXT_ALLOW_CUSTOM_DOMAINS` | Opt-in, default `false` |
| `NUXT_API_ENDPOINTS_*` | Path endpoint publik Laravel |

### Kenapa namanya `NUXT_API_ENDPOINTS_TENANT`

Nuxt menimpa `runtimeConfig` bertingkat dengan meratakan nama pakai underscore.

```ts
runtimeConfig: { apiEndpoints: { tenant: '…' } }   // nuxt.config.ts
NUXT_API_ENDPOINTS_TENANT=/v1/public/tenant        // nama runtime yang benar
NUXT_API_TENANT_ENDPOINT=…                         // HANYA default saat build
```

Nama kedua muncul di `apps/tenant-web/.env.example` karena `nuxt.config.ts`
membacanya lewat `process.env` saat build. Di container, hanya nama rata yang
berpengaruh. Menaruh nama yang salah tidak menghasilkan error — nilainya
diam-diam tidak terpakai.

## `deploy/env/landing.env`

Template: [`deploy/env/landing.env.example`](../deploy/env/landing.env.example).
Tanpa secret dan tanpa dependency backend.

## GitHub Secrets — per Environment

Buat di Settings → Environments → `production` (dan `staging` kalau dipakai).
Environment-scoped, bukan repository-scoped, supaya kredensial production tidak
bisa dipakai job yang menyasar staging.

| Secret | Contoh | Keterangan |
| --- | --- | --- |
| `SSH_HOST` | `203.0.113.10` | |
| `SSH_USER` | `deploy` | Anggota grup `docker` |
| `SSH_PRIVATE_KEY` | isi file PEM | Buat dengan `ssh-keygen -t ed25519 -C sewantara-deploy` |
| `SSH_PORT` | `22` | Opsional |
| `DEPLOY_PATH` | `/srv/sewantara` | Path absolut clone di server |

Registry tidak butuh secret: `reusable-deploy.yml` meneruskan `GITHUB_TOKEN`
berumur pendek ke server untuk `docker login ghcr.io`, dan `deploy.sh`
menjalankan `docker logout` di akhir. Tidak ada kredensial registri permanen
yang tersimpan di host.

## GitHub Variables — repository

Bukan rahasia (semuanya berakhir di bundle publik), tapi harus benar.

| Variable | Contoh | Dipakai |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | `https://api.sewantara.id` | Build arg `dashboard` |
| `VITE_REVERB_APP_KEY` | sama dengan `REVERB_APP_KEY` | Build arg aset API |
| `VITE_REVERB_HOST` | `api.sewantara.id` | idem |
| `VITE_REVERB_PORT` | `443` | idem |
| `VITE_REVERB_SCHEME` | `https` | idem |
| `VITE_APP_NAME` | `Sewantara` | idem |
| `STAGING_ENABLED` | `true` | Mengaktifkan auto-deploy staging dari `main` |

## GitHub Variables — per Environment

Di-scope ke Environment (`production`, `staging`), dibaca langsung oleh
`reusable-deploy.yml`:

| Variable | Contoh | Dipakai |
| --- | --- | --- |
| `PUBLIC_URL` | `https://sewantara.id` | Tautan pada catatan deployment GitHub |
| `HEALTH_URL` | `https://api.sewantara.id/up` | Dipanggil runner setelah rollout; kosongkan untuk melewati |

## Menambah variable baru

Satu PR, tiga perubahan. Tanpa salah satunya, deploy berikutnya akan gagal atau
— lebih buruk — berhasil dengan nilai kosong.

1. Kode yang membacanya.
2. Template `.example` yang sesuai:
   - Laravel → `apps/api/.env.production.example` (dan `.env.example` untuk dev)
   - Nuxt runtime → `deploy/env/<app>.env.example`
   - Level host → `deploy/.env.example`
3. Tabel di dokumen ini.

Kalau variable-nya build-time (`NUXT_PUBLIC_*` untuk dashboard, `VITE_*` untuk
API), tambahkan juga di step **Collect build args** pada
[`reusable-docker.yml`](../.github/workflows/reusable-docker.yml) — build arg
tidak diteruskan otomatis.

Setelah merge, isi nilainya di server sebelum deploy:

```bash
vi deploy/env/api.env
make restart APP=api
```

## Rotasi kredensial

| Kredensial | Cara | Dampak |
| --- | --- | --- |
| `APP_KEY` | **Jangan diputar** kecuali terpaksa | Semua nilai terenkripsi di DB jadi tak terbaca. Perlu re-enkripsi terencana. |
| `DB_PASSWORD` | `ALTER USER` di PostgreSQL, lalu samakan kedua variable, `make restart APP=api` | Sesaat |
| `REVERB_APP_SECRET` | Ubah di `api.env`, `make restart APP=api` | Klien reconnect |
| `REVERB_APP_KEY` | Ubah di `api.env` **dan** repository variable, lalu **rebuild** aset API | Butuh rilis |
| `BFF_SERVICE_TOKEN_*` | Isi token baru di `CURRENT`, token lama di `PREVIOUS`, deploy, lalu kosongkan `PREVIOUS` di rilis berikutnya | Nol, karena ada dua slot |
| Kunci payment gateway | Ubah di `api.env`, `make restart APP=api` | Sesaat |
| `SSH_PRIVATE_KEY` | Tambahkan key baru ke `authorized_keys`, ganti secret, hapus key lama | Nol |

Pasangan `BFF_SERVICE_TOKEN_CURRENT`/`_PREVIOUS` memang dirancang untuk rotasi
tanpa downtime — pakai kedua slotnya, jangan menimpa `CURRENT` langsung.

## Kalau secret terlanjur ter-commit

1. **Anggap sudah bocor.** Riwayat Git bisa jadi sudah tersebar ke fork,
   cache CI, dan clone lokal orang lain.
2. Putar kredensialnya lebih dulu. Ini langkah paling penting dan paling sering
   ditunda.
3. Baru bersihkan riwayat (`git filter-repo`) kalau memang perlu — dan itu
   memaksa semua orang melakukan clone ulang.
4. Cari tahu kenapa `.gitignore` tidak menangkapnya, lalu perbaiki polanya.
