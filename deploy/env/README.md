# deploy/env — konfigurasi runtime per app

Satu file per app. Compose memuatnya lewat `env_file`, jadi isinya adalah
environment variable **di dalam container** — bukan variable untuk
interpolasi `${...}` di `compose.yml`. Nilai yang dipakai compose sendiri
(port, registry, tag) ada di [`deploy/.env`](../.env.example) dan
[`deploy/.env.images`](../.env.images.example).

| File | Sumber template | Dibaca oleh |
| --- | --- | --- |
| `api.env` | `apps/api/.env.production.example` | `api`, `api-migrate`, `api-queue`, `api-scheduler`, `api-reverb`, `postgres` |
| `dashboard.env` | `deploy/env/dashboard.env.example` | `dashboard` |
| `tenant-web.env` | `deploy/env/tenant-web.env.example` | `tenant-web` |
| `landing.env` | `deploy/env/landing.env.example` | `landing` |

`api.env` sengaja disalin dari template milik app-nya: Laravel yang memiliki
kontrak environment-nya sendiri, dan menduplikasi ~150 baris di sini hanya
akan menciptakan dua sumber kebenaran yang cepat menyimpang.

Tiga app Nuxt punya template sendiri di direktori ini karena nama variable
**runtime** container berbeda dari `.env.example` di direktori app-nya (lihat
catatan tentang `NUXT_API_ENDPOINTS_*` di `tenant-web.env.example`).

## Membuat file aktual

```bash
deploy/scripts/bootstrap.sh
```

Script itu menyalin setiap template yang belum punya file aktual dan tidak
pernah menimpa yang sudah ada. Setelah itu isi nilainya:

```bash
openssl rand -base64 32   # APP_KEY (tambahkan prefix base64:)
openssl rand -hex 32      # REVERB_APP_SECRET
openssl rand -hex 16      # REVERB_APP_KEY
```

## Aturan

- Tidak satu pun file `*.env` di direktori ini boleh masuk Git. Hanya
  `*.env.example` yang di-commit.
- `POSTGRES_PASSWORD` dan `DB_PASSWORD` di `api.env` harus bernilai sama —
  service `postgres` dan Laravel membaca file yang sama.
- Setiap variable baru wajib ikut ditambahkan ke template `.example`-nya di
  PR yang sama, plus dicatat di [docs/07_SECRETS_AND_ENV.md](../../docs/07_SECRETS_AND_ENV.md).
- Perubahan nilai pada app SSR (`api`, `tenant-web`, `landing`) cukup
  `deploy/scripts/deploy.sh --restart-only <app>`. Perubahan pada `dashboard`
  butuh rebuild image.
