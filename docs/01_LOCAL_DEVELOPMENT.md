# Development lokal

Ada dua cara kerja, dan keduanya sah:

1. **Native** (Laragon di Windows) — paling cepat untuk pekerjaan sehari-hari.
2. **Docker penuh** — untuk memverifikasi bahwa yang akan berjalan di
   production memang benar berjalan.

Pakai native untuk ngoding, pakai Docker sebelum membuka PR yang menyentuh
`Dockerfile` atau `deploy/`.

## Prasyarat

| Tool | Versi | Catatan |
| --- | --- | --- |
| PHP | 8.4 (min 8.3) | Ekstensi: `bcmath` `exif` `intl` `mbstring` `pcntl` `pdo_pgsql` `pdo_sqlite` `redis` `sockets` `zip` |
| Composer | 2.x | |
| Node.js | 22.x | `nvm use` di `apps/tenant-web` (ada `.nvmrc`) |
| PostgreSQL | 17 | Bisa via Docker saja, lihat di bawah |
| Redis | 7.4 | Idem |
| Docker Desktop | dengan Compose 2.24+ | Wajib untuk stack penuh |

Cek versi Compose — stack `deploy/` memakai lebih dari satu `--env-file`:

```bash
docker compose version --short   # harus >= 2.24.0
```

## Sekali di awal

```bash
# Dependency keempat app
make install

# Konfigurasi API untuk mode native
cd apps/api
cp .env.local.example .env.local
php artisan --env=local key:generate
```

Untuk PostgreSQL dan Redis tanpa memasangnya di Windows, jalankan keduanya
lewat stack dev API saja:

```bash
cd apps/api
docker compose --env-file .env.development up -d postgres redis
```

Lalu arahkan `.env.local` ke `127.0.0.1`.

## Menjalankan tiap app

| App | Perintah | URL |
| --- | --- | --- |
| `api` | `make dev-api` | http://localhost:8000 |
| `dashboard` | `make dev-dashboard` | http://localhost:3000 |
| `tenant-web` | `make dev-tenant-web` | http://localhost:3000 |
| `landing` | `make dev-landing` | http://localhost:3000 |

Nuxt memakai port 3000 secara default, jadi jalankan satu per satu atau
tentukan port sendiri:

```bash
cd apps/dashboard && npm run dev -- --port 3005
cd apps/tenant-web && npm run dev -- --port 3001
cd apps/landing && npm run dev -- --port 3003
```

`make dev-api` menjalankan `composer run dev`, yang menyalakan `artisan serve`,
`queue:listen`, dan Vite sekaligus.

### tenant-web butuh subdomain

`apps/tenant-web` menentukan tenant dari header `Host`. Di lokal, aktifkan
demo mode (default di `.env.example`) sehingga tenant contoh dipakai tanpa
backend:

```dotenv
NUXT_PUBLIC_DEMO_MODE=true
NUXT_PUBLIC_DEMO_TENANT=kamerajember
```

Untuk menguji resolusi tenant sungguhan, tambahkan entri di file `hosts`
Windows (`C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1  kamerajember.sewantara.test
127.0.0.1  sewantara.test
```

lalu akses `http://kamerajember.sewantara.test:3001`.

## Stack penuh lewat Docker

Menjalankan keempat app plus PostgreSQL dan Redis, semuanya di-build dari
source:

```bash
make bootstrap     # membuat deploy/.env, .env.images, deploy/env/*.env
make up-local      # build + up -d seluruh stack
make status
```

Sebelum `up-local`, sesuaikan `deploy/env/*.env` untuk lokal — minimal:

```dotenv
# deploy/env/api.env
APP_URL=http://localhost:8090
APP_DEBUG=true
SESSION_SECURE_COOKIE=false
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3003,http://localhost:3005

# deploy/env/tenant-web.env
NUXT_API_BASE=http://localhost:8090
NUXT_PUBLIC_DEMO_MODE=true
```

Setelah jalan:

| Layanan | URL |
| --- | --- |
| API | http://localhost:8090 |
| Health API | http://localhost:8090/up |
| tenant-web | http://localhost:3000/healthz |
| landing | http://localhost:3003/healthz |
| dashboard | http://localhost:3005/healthz |

Perintah harian:

```bash
make logs SVC=api-queue
make artisan CMD="tenants:list"
make shell SVC=api
make down            # stop, volume tetap
make nuke            # stop + hapus volume (data lokal hilang)
```

Build ulang satu app saja:

```bash
make build-local APP=tenant-web
```

> `make up-local` memakai `deploy/compose.build.yml`. File itu **tidak boleh**
> dipakai di server: production menarik image yang sudah diuji CI, bukan
> membangunnya sendiri.

## Menjalankan pemeriksaan yang sama dengan CI

```bash
make check-app APP=api          # Pint + Pest
make check-app APP=tenant-web   # lint + typecheck + test + build
make check                      # keempat app
make validate                   # shellcheck + docker compose config
```

Untuk perubahan di `deploy/` atau `.github/`, `make validate` adalah gerbang
yang sama dengan job `deploy scripts` di CI.

## Masalah yang sering muncul

**`npm ci` gagal karena lockfile tidak sinkron.** Lockfile per app di-commit.
Jangan `npm install` untuk memperbaiki; jalankan `npm ci` di direktori app
yang benar dan pastikan Node 22.

**Vite tidak jalan di `api`.** `apps/api/package.json` memakai Vite 8 dan
`laravel-vite-plugin`. Pastikan `npm ci` dijalankan di `apps/api`, bukan di
root — repo ini tidak punya `node_modules` di root.

**Health check container Nuxt gagal padahal app terbuka di browser.** Health
check memanggil `/healthz`. Kalau app baru dibuat, route
`server/routes/healthz.get.ts` mungkin belum ada.

**`docker compose` menolak dua `--env-file`.** Compose di bawah 2.24 tidak
mendukungnya. Update Docker Desktop / plugin compose.

**Container berhenti dengan `APP_KEY` kosong.** `make bootstrap` memperingatkan
hal ini. Isi `APP_KEY` di `deploy/env/api.env` dengan
`base64:$(openssl rand -base64 32)`.
