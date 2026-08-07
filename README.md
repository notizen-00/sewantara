# Sewantara

Platform SaaS multi tenant untuk penyewaan dan booking. Satu repository berisi
empat aplikasi yang di-build, diversikan, dan dirilis **secara terpisah**.

| Folder | Teknologi | Fungsi | Image | Port container |
| --- | --- | --- | --- | --- |
| [`apps/api`](apps/api/) | Laravel 13 · PHP 8.4 | Backend multi tenant, REST + WebSocket | `sewantara-api`, `sewantara-api-web` | 9000 (FPM), 80 (nginx) |
| [`apps/dashboard`](apps/dashboard/) | Nuxt 4 (SPA) | Dashboard mitra/tenant | `sewantara-dashboard` | 3005 |
| [`apps/tenant-web`](apps/tenant-web/) | Nuxt 4 (SSR) | Website publik tiap tenant | `sewantara-tenant-web` | 3000 |
| [`apps/landing`](apps/landing/) | Nuxt 4 (SSR) | Landing page Sewantara | `sewantara-landing` | 3003 |

Prinsipnya sederhana: **perubahan di satu app hanya membangun dan merilis
container app itu**. Commit yang hanya menyentuh `apps/landing` tidak akan
menyentuh image API sama sekali.

## Isi repository

```
apps/            empat aplikasi, masing-masing punya Dockerfile & dependency sendiri
deploy/          stack production (compose + script operasional + template env)
docs/            dokumentasi platform: monorepo, deploy, CI/CD, runbook, ADR
.github/         workflow CI/CD, registry komponen, template issue & PR
Makefile         entry point perintah dev dan ops
```

## Mulai dari mana

| Kebutuhan | Baca |
| --- | --- |
| Menjalankan app di laptop | [docs/01_LOCAL_DEVELOPMENT.md](docs/01_LOCAL_DEVELOPMENT.md) |
| Memahami struktur & aturan monorepo | [docs/00_MONOREPO.md](docs/00_MONOREPO.md) |
| Menyiapkan server production pertama kali | [docs/03_DEPLOYMENT.md](docs/03_DEPLOYMENT.md) |
| Memahami pipeline GitHub Actions | [docs/04_CI_CD.md](docs/04_CI_CD.md) |
| Merilis versi baru | [docs/05_VERSIONING_RELEASE.md](docs/05_VERSIONING_RELEASE.md) |
| Production bermasalah | [docs/06_RUNBOOK.md](docs/06_RUNBOOK.md) |
| Mencari nama environment variable | [docs/07_SECRETS_AND_ENV.md](docs/07_SECRETS_AND_ENV.md) |
| Alasan di balik keputusan arsitektur | [docs/adr/](docs/adr/) |

Dokumentasi domain (produk, database, business rule, spesifikasi API) ada di
[`docs/docs/`](docs/docs/) dan [`apps/api/docs/`](apps/api/docs/).

## Alur singkat

```
                    ┌──────────────── pull request ────────────────┐
                    │  CI: lint + test app yang berubah,           │
                    │      build image (tanpa push)                │
                    └──────────────────────┬───────────────────────┘
                                           │ merge
                                           ▼
              push ke main  ──►  image ter-push ke GHCR
                                 tag: sha-<commit>, edge
                                           │
                                           ├─► staging (opsional, otomatis)
                                           │
                    git tag api-v1.4.0 ────┘
                                           ▼
                       image tag: 1.4.0, 1.4, 1, latest
                                           ▼
                     production (butuh approval di GitHub Environment)
                                           ▼
                    deploy.sh: pull → migrate → recreate → health gate
                              gagal? rollback otomatis
```

Server **tidak pernah** melakukan build. Yang berjalan di production adalah
image yang sama persis dengan yang diuji CI, ditarik berdasarkan tag.

## Perintah yang paling sering dipakai

```bash
make help                          # daftar seluruh target

# Development
make dev-api                       # Laravel: serve + queue + vite
make dev-tenant-web                # Nuxt dev server
make check-app APP=tenant-web      # jalankan lint/typecheck/test/build satu app
make up-local                      # build & jalankan seluruh stack dari source

# Operasional server
make status                        # tag & health yang benar-benar berjalan
make deploy APP=api TAG=1.4.0      # roll out satu app
make rollback APP=api              # kembali ke tag sebelumnya
make logs SVC=api-queue
make backup
```

## Prasyarat

| Tool | Versi | Untuk |
| --- | --- | --- |
| PHP | 8.4 (min 8.3) | `apps/api` |
| Composer | 2.x | `apps/api` |
| Node.js | 22.x | keempat app |
| Docker Engine | 24+ | build & jalankan container |
| Docker Compose | **2.24+** | stack `deploy/` memakai multi `--env-file` |
| PostgreSQL | 17 | database central + schema tiap tenant |
| Redis | 7.4 | cache, session, queue, Reverb |

## Kontribusi

Baca [CONTRIBUTING.md](CONTRIBUTING.md). Ringkasnya: satu PR menyentuh satu
app kalau bisa, judul PR memakai Conventional Commits dengan scope nama app
(`feat(api): ...`), dan setiap environment variable baru wajib masuk ke file
`*.env.example` serta [docs/07_SECRETS_AND_ENV.md](docs/07_SECRETS_AND_ENV.md)
di PR yang sama.
