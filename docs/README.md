# Dokumentasi Sewantara

Dua lapis dokumentasi, dibedakan berdasarkan siapa yang membutuhkannya.

## Lapis platform — repo, build, deploy

| Dokumen | Isi | Kapan dibuka |
| --- | --- | --- |
| [00_MONOREPO.md](00_MONOREPO.md) | Struktur repo, batas antar app, cara menambah app | Onboarding, saat menyentuh lebih dari satu app |
| [01_LOCAL_DEVELOPMENT.md](01_LOCAL_DEVELOPMENT.md) | Menjalankan tiap app di laptop (Laragon & Docker) | Hari pertama |
| [02_DOCKER_IMAGES.md](02_DOCKER_IMAGES.md) | Isi tiap image, stage, build arg vs runtime env | Menyentuh Dockerfile atau konfigurasi |
| [03_DEPLOYMENT.md](03_DEPLOYMENT.md) | Menyiapkan server, stack compose, alur rollout | Setup server, deploy manual |
| [04_CI_CD.md](04_CI_CD.md) | Workflow GitHub Actions, secret, variable | Mengubah pipeline, debug CI |
| [05_VERSIONING_RELEASE.md](05_VERSIONING_RELEASE.md) | Skema versi per app, cara merilis | Setiap rilis |
| [06_RUNBOOK.md](06_RUNBOOK.md) | Insiden production: gejala → tindakan | Saat production bermasalah |
| [07_SECRETS_AND_ENV.md](07_SECRETS_AND_ENV.md) | Seluruh environment variable & tempatnya | Menambah konfigurasi |
| [adr/](adr/) | Keputusan arsitektur beserta alasannya | Saat ingin mengubah keputusan lama |

## Lapis produk & domain

Dokumentasi fungsional (PRD, desain database, business rule, spesifikasi API,
multi tenancy, payment gateway) ada di:

- [`docs/docs/`](docs/) — salinan dokumentasi platform level produk
- [`apps/api/docs/`](../apps/api/docs/) — sumber utama dokumentasi backend

Dokumen yang paling sering dicari:

| Dokumen | Isi |
| --- | --- |
| [docs/04_A_MultiTenancy_ARCHITECTURE.md](docs/04_A_MultiTenancy_ARCHITECTURE.md) | Arsitektur multi tenant (schema per tenant) |
| [docs/07_API_SPECIFICATION.md](docs/07_API_SPECIFICATION.md) | Kontrak REST API |
| [docs/02_DATABASE_DESIGN.md](docs/02_DATABASE_DESIGN.md) | Desain database |
| [docs/06_BUSINESS_RULE.md](docs/06_BUSINESS_RULE.md) | Business rule |
| [docs/09_SECURITY_GUIDE.md](docs/09_SECURITY_GUIDE.md) | Panduan keamanan aplikasi |
| [docs/14_TenantOnboarding.md](docs/14_TenantOnboarding.md) | Alur onboarding tenant |

> **Catatan konsistensi.** `docs/docs/*` dan `apps/api/docs/*` saat ini berisi
> berkas yang sebagian identik, warisan dari empat repo yang digabung. Dua di
> antaranya sudah digantikan oleh lapis platform di atas:
> `docs/docs/15_DOCKER_DEPLOYMENT.md` dan `docs/docs/21_CI_CD_GITHUB_ACTIONS.md`
> menjelaskan alur lama (server melakukan `git pull` lalu `docker compose build`
> untuk API saja). Alur yang berlaku sekarang ada di
> [03_DEPLOYMENT.md](03_DEPLOYMENT.md) dan [04_CI_CD.md](04_CI_CD.md).
