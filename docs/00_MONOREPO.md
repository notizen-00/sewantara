# Struktur monorepo

## Mengapa satu repo

Empat aplikasi Sewantara berbagi satu kontrak: REST API multi tenant milik
Laravel. Sebelumnya keempatnya hidup di repo terpisah, dan konsekuensinya
selalu sama — perubahan kontrak API butuh empat PR di empat tempat, tanpa satu
pun commit yang bisa membuktikan keempatnya cocok.

Satu repo menghapus masalah itu: satu commit bisa mengubah endpoint sekaligus
pemakaiannya, dan CI menguji keduanya bersama.

Yang **tidak** dilakukan monorepo ini: menggabungkan dependency, build, atau
rilis. Keempat app tetap independen. Lihat
[adr/0001-monorepo-app-independen.md](adr/0001-monorepo-app-independen.md).

## Peta direktori

```
sewantara/
├── apps/
│   ├── api/              Laravel 13 — backend multi tenant
│   │   ├── Dockerfile        3 stage: frontend (vite) → app (php-fpm) → web (nginx)
│   │   ├── compose.yaml      stack dev satu app (BUKAN production)
│   │   ├── docker/           php.ini, opcache.ini, entrypoint, nginx conf
│   │   └── docs/             dokumentasi backend (sumber utama)
│   ├── dashboard/        Nuxt SPA (ssr:false) — dashboard mitra
│   ├── tenant-web/       Nuxt SSR — website publik tenant, sekaligus BFF
│   └── landing/          Nuxt SSR — landing page
│
├── deploy/               SEMUA yang berjalan di server production
│   ├── compose.yml           stack production, hanya pull image (tidak build)
│   ├── compose.build.yml     overlay build untuk stack lokal
│   ├── .env.example          port, registry, timezone, perilaku rollout
│   ├── .env.images.example   tag image yang berjalan (ditulis deploy.sh)
│   ├── env/                  konfigurasi runtime per app
│   └── scripts/              bootstrap, deploy, rollback, status, backup
│
├── docs/                 dokumentasi platform (folder ini) + docs/docs (domain)
│
├── .github/
│   ├── components.json       SATU-SATUNYA daftar komponen yang bisa di-build
│   ├── filters.yml           peta path → app
│   ├── actions/              composite action deteksi komponen berubah
│   └── workflows/            ci, cd, release, deploy-manual, reusable-*
│
├── Makefile              entry point perintah dev & ops
├── CONTRIBUTING.md
└── README.md
```

## App vs komponen

Dua istilah yang dipakai konsisten di seluruh repo dan pipeline:

- **App** — satu direktori di `apps/`. Unit rilis dan unit versi.
  Ada empat: `api`, `dashboard`, `tenant-web`, `landing`.
- **Komponen** — satu image Docker. Biasanya satu app = satu komponen,
  kecuali `api` yang menghasilkan dua image dari satu Dockerfile:

  | Komponen | Stage | Isi | Peran |
  | --- | --- | --- | --- |
  | `api` | `app` | PHP-FPM + kode Laravel | fpm, queue, scheduler, reverb, migrate |
  | `api-web` | `web` | nginx + `public/` hasil build | pintu masuk HTTP & proxy WebSocket |

Keduanya selalu di-build dan di-deploy bersama dengan tag yang sama, karena
`api-web` memuat aset yang dihasilkan dari commit yang sama.

Daftar resminya ada di [`.github/components.json`](../.github/components.json).
Semua workflow membaca file itu — tidak ada daftar app yang di-hardcode di
dalam YAML.

## Batas antar app

| Aturan | Alasan |
| --- | --- |
| Tidak ada `import` lintas `apps/*` | Tiap app punya `package.json`, lockfile, dan container sendiri. Impor lintas app akan bekerja di dev dan gagal di build. |
| Tidak ada npm workspace / hoisting | Setiap Dockerfile memakai direktori app-nya sebagai build context. Lockfile yang di-hoist ke root membuat context itu tidak lagi self-contained. |
| Kode bersama disalin, atau diambil dari API | Belum ada package internal. Kalau nanti benar-benar dibutuhkan, itu keputusan baru dan harus lewat ADR. |
| Frontend berkomunikasi lewat HTTP | Kontraknya `apps/api/docs/07_API_SPECIFICATION.md`, bukan tipe TypeScript bersama. |

Konsekuensi yang harus diterima: perubahan kontrak API tidak akan terdeteksi
oleh type checker frontend. Yang menjaganya adalah test dan review, bukan
compiler.

## Trackability — cara mengetahui apa yang berjalan

Enam lapis, dari kode sampai container:

| Pertanyaan | Jawabannya di |
| --- | --- |
| Perubahan apa yang masuk? | Histori commit `main`, satu commit per PR (Conventional Commits ber-scope) |
| Versi berapa yang dirilis? | Git tag per app: `api-v1.4.0` |
| Apa isi rilis itu? | GitHub Release, notes dibuat otomatis dari commit |
| Image mana yang dihasilkan? | Label OCI di image: `org.opencontainers.image.revision` = commit sha |
| Tag mana yang sekarang berjalan? | `deploy/.env.images` di server, plus `make status` |
| Siapa deploy apa dan kapan? | `deploy/.deploy-history.log` di server, plus riwayat GitHub Environment |

`make status` menyatukannya: tag dari file config, health dari container yang
berjalan, dan commit sha dari label image — sehingga ketidaksesuaian antara
"yang tercatat" dan "yang berjalan" langsung terlihat.

## Menambah app baru

Enam langkah, semuanya di tempat yang sudah ditentukan:

1. `apps/<nama>/` dengan `Dockerfile` multi-stage + `.dockerignore`.
2. Endpoint `/healthz` yang tidak memanggil layanan lain.
3. Entri baru di [`.github/components.json`](../.github/components.json).
4. Filter path baru di [`.github/filters.yml`](../.github/filters.yml).
5. Service, port, dan `deploy/env/<nama>.env.example` di `deploy/`.
6. `ALL_APPS` plus keempat fungsi map di
   [`deploy/scripts/lib.sh`](../deploy/scripts/lib.sh):
   `services_for`, `health_services_for`, `tag_var_for`, `images_for`,
   `env_file_for`, dan `is_known_app`.

Lupa salah satu langkah akan membuat CI atau `deploy.sh` gagal dengan pesan
`unknown app '<nama>'` — bukan diam-diam melewati app tersebut.
