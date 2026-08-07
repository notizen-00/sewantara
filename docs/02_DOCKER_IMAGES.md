# Image Docker

Lima image, empat app. Semuanya multi-stage, non-root di stage runtime, dan
hanya memuat artefak hasil build — bukan toolchain-nya.

| Komponen | App | Base runtime | Stage | Port | User |
| --- | --- | --- | --- | --- | --- |
| `sewantara-api` | `api` | `php:8.4-fpm-bookworm` | `app` | 9000 | root → `www-data` via entrypoint |
| `sewantara-api-web` | `api` | `nginx:1.27-alpine` | `web` | 80 | nginx default |
| `sewantara-dashboard` | `dashboard` | `node:22-alpine` | `runner` | 3005 | `node` |
| `sewantara-tenant-web` | `tenant-web` | `node:22-alpine` | `runtime` | 3000 | `node` |
| `sewantara-landing` | `landing` | `node:22-bookworm-slim` | `runner` | 3003 | `node` |

Registry: `ghcr.io/<owner>/<komponen>`. Build context selalu direktori app-nya,
sehingga tiap app bisa di-build tanpa file app lain sama sekali.

## Versi base image

Base image di-pin sampai **mayor**, bukan patch (`node:22-alpine`, bukan
`node:22.19.0-alpine`). Alasannya: build ulang harus otomatis mendapat patch
keamanan. Reproducibility tidak hilang karena yang menjadi artefak
immutable adalah image hasil build — diidentifikasi digest dan tag commit —
bukan resep build-nya.

Yang menjaga agar patch benar-benar masuk:

- Trivy memindai setiap image yang di-push (HIGH + CRITICAL, hasilnya masuk
  tab Security).
- Dependabot mengusulkan bump base image bulanan.
- Rilis apa pun membangun ulang dari base terbaru.

PostgreSQL adalah pengecualian: di-pin ke mayor (`postgres:17-alpine`) karena
format `PGDATA` tidak kompatibel antar mayor, jadi naik mayor harus jadi
keputusan sadar dengan dump & restore.

## `apps/api` — tiga stage, dua image

```
┌─ frontend (node:22-alpine) ────────────────────────────────┐
│ npm ci  →  vite build  →  public/build                     │
│ ARG VITE_* dibakar ke dalam bundle di sini                 │
└──────────────────────┬─────────────────────────────────────┘
                       │ COPY --from=frontend public/build
┌─ app (php:8.4-fpm) ──▼─────────────────────────────────────┐
│ ekstensi PHP, composer install --no-dev, dump-autoload -o  │
│ entrypoint: config:cache + view:cache, lalu gosu www-data  │
│ → image sewantara-api                                      │
└──────────────────────┬─────────────────────────────────────┘
                       │ COPY --from=app /var/www/html/public
┌─ web (nginx:1.27) ───▼─────────────────────────────────────┐
│ hanya public/ + docker/nginx/default.conf                  │
│ → image sewantara-api-web                                  │
└────────────────────────────────────────────────────────────┘
```

Satu image `sewantara-api` menjalankan lima peran, dibedakan hanya oleh
`command` di compose: `php-fpm`, `queue:work`, `schedule:work`,
`reverb:start`, dan `api-migrate`. Tidak ada image terpisah untuk worker —
worker yang tertinggal versi adalah salah satu bug production paling sulit
dilacak, dan satu image membuatnya mustahil.

`entrypoint.sh` menjalankan `config:cache` dan `view:cache` pada setiap start
(bisa dimatikan dengan `LARAVEL_CACHE_CONFIG=false`). Karena itu **perubahan
`api.env` butuh restart container**, bukan sekadar reload.

## Build arg vs runtime env

Ini pembedaan terpenting di seluruh setup, dan sumber kebingungan yang paling
sering.

| Komponen | Konfigurasi dibaca kapan | Ubah nilai → |
| --- | --- | --- |
| `api` / `api-web` | `VITE_*` saat **build**; sisanya saat **start** | `VITE_*`: rebuild. Lainnya: restart. |
| `dashboard` | `NUXT_PUBLIC_*` saat **build** | Rebuild image |
| `tenant-web` | seluruhnya saat **start** | Restart container |
| `landing` | seluruhnya saat **start** | Restart container |

Kenapa `dashboard` berbeda: `nuxt.config.ts`-nya memakai `ssr: false`, jadi
Nuxt menghasilkan shell SPA statis dan `runtimeConfig.public` ikut dibakar ke
dalam bundle saat build. Tidak ada proses server yang bisa menyuntikkan nilai
baru saat request. Karena itu `NUXT_PUBLIC_API_BASE` diambil dari repository
variable GitHub dan diteruskan sebagai build arg. Konsekuensinya: image
dashboard **spesifik per environment** dan tidak bisa dipromosikan dari
staging ke production apa adanya. Lihat
[adr/0004-dashboard-config-build-time.md](adr/0004-dashboard-config-build-time.md).

`VITE_*` pada API punya sifat yang sama (aset Vite dibakar), tapi hanya
memengaruhi aset Blade internal, bukan API publik.

`tenant-web` dan `landing` adalah SSR: satu image untuk semua environment,
konfigurasi murni runtime. Ini bentuk yang ideal, dan patokan untuk app baru.

### Nama variable bertingkat di Nuxt

Nuxt menimpa `runtimeConfig` bertingkat dengan meratakan nama pakai underscore.
`runtimeConfig.apiEndpoints.tenant` **tidak** dibaca dari
`NUXT_API_TENANT_ENDPOINT`, melainkan dari `NUXT_API_ENDPOINTS_TENANT`.

Nama seperti `NUXT_API_TENANT_ENDPOINT` di `apps/tenant-web/.env.example` hanya
berlaku untuk nilai default di `nuxt.config.ts` saat build. Di container yang
berlaku adalah nama rata. Itulah sebabnya
[`deploy/env/tenant-web.env.example`](../deploy/env/tenant-web.env.example)
memakai daftar nama yang berbeda.

## Healthcheck

Setiap komponen punya healthcheck, dan `deploy.sh` menunggunya sebelum
menyatakan rollout berhasil.

| Komponen | Cara | Alasan |
| --- | --- | --- |
| `api` | `fsockopen` ke 127.0.0.1:9000 | PHP-FPM berbicara FastCGI, bukan HTTP. Cek TCP adalah cek paling jujur tanpa menambah dependency. |
| `api-web` | `wget --spider /up` | Endpoint health bawaan Laravel, melewati seluruh jalur nginx → fpm. |
| `api-reverb` | `fsockopen` ke 127.0.0.1:8080 | Idem, untuk server WebSocket. |
| `dashboard` `tenant-web` `landing` | `node -e fetch('/healthz')` | Tidak butuh `wget`/`curl`, jadi image tetap minimal. |
| `api-queue` `api-scheduler` | tidak ada | Worker tidak punya sinyal readiness yang bermakna. `deploy.sh` tidak menunggunya. |

Endpoint `/healthz` pada app Nuxt sengaja **tidak** memanggil API. Kalau
`/healthz` gagal ketika API mati, Docker akan membunuh container frontend yang
sebenarnya sehat, dan gangguan API berubah menjadi gangguan total.

## Yang tidak masuk image

`.dockerignore` tiap app mengecualikan `node_modules`, `vendor`, output build,
`.git`, semua `.env` (kecuali `*.example`), dokumentasi, `Dockerfile`, dan file
compose.

Dua alasan: rahasia tidak pernah ikut ke registry, dan menyunting README tidak
membatalkan cache build.

Pengecualian yang disengaja: `apps/tenant-web/.dockerignore` **tetap**
menyertakan `tests/`, karena `nuxt.config.ts` mengaktifkan
`typescript.typeCheck` sehingga build ikut memeriksa tipe di file test.

## Cara build lokal

```bash
# satu komponen, persis seperti CI
docker build -t sewantara-api:local --target app apps/api
docker build -t sewantara-api-web:local --target web apps/api
docker build -t sewantara-tenant-web:local --target runtime apps/tenant-web

# seluruh stack
make up-local
make build-local APP=dashboard
```

Perhatikan bahwa build context-nya `apps/api`, bukan root repo. Itu sengaja:
image API tidak boleh bisa menyentuh berkas app lain.

## Supply chain

Setiap image yang di-push disertai:

- **Provenance** (SLSA, `mode=max`) — mencatat workflow dan commit yang
  membangunnya.
- **SBOM** — daftar isi paket.
- **Label OCI** — `org.opencontainers.image.revision` berisi commit sha, jadi
  container yang berjalan selalu bisa dipetakan kembali ke satu commit:

```bash
docker inspect --format \
  '{{index .Config.Labels "org.opencontainers.image.revision"}}' <container>
```

`make status` sudah menampilkannya per app.
