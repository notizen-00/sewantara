# CI/CD

## Peta workflow

```
                       ┌─────────────────────────────────────────┐
  pull request ──────► │ ci.yml                                  │
                       │  plan → api / node / image / deploy-lint│
                       │  build image TANPA push                 │
                       └─────────────────────────────────────────┘
                                        │ merge (squash)
                                        ▼
                       ┌─────────────────────────────────────────┐
  push ke main ──────► │ cd.yml                                  │
                       │  plan → image (push) → deploy staging*   │
                       │  tag: sha-<commit>, main, edge          │
                       └─────────────────────────────────────────┘
                                        │
                    git tag api-v1.4.0  │
                                        ▼
                       ┌─────────────────────────────────────────┐
                       │ release.yml                             │
                       │  plan (parse tag) → image (push)        │
                       │  tag: 1.4.0, 1.4, 1, latest             │
                       │  → deploy production (butuh approval)   │
                       │  → GitHub Release + notes               │
                       └─────────────────────────────────────────┘

  manual ───────────► deploy-manual.yml   rollback / re-deploy tag lama
                                          (verifikasi tag ada, tidak build)

  pull request ─────► pr-hygiene.yml      judul PR Conventional Commits
```

Dua workflow reusable dipakai bersama oleh semuanya:

| Workflow | Tugas |
| --- | --- |
| [`reusable-docker.yml`](../.github/workflows/reusable-docker.yml) | Build satu komponen: penamaan image, tag, label, cache, scan |
| [`reusable-deploy.yml`](../.github/workflows/reusable-deploy.yml) | Rollout satu set app ke satu host lewat SSH |

Karena keduanya reusable, aturan penamaan image dan prosedur rollout hanya ada
di satu tempat. Tidak ada `docker build` yang ditulis dua kali dengan opsi
berbeda.

## Build selektif

Inti dari monorepo ini: **perubahan pada satu app hanya membangun container app
itu.** Commit yang hanya menyentuh `apps/landing` tidak menyentuh image API.

Mekanismenya tiga berkas:

| Berkas | Peran |
| --- | --- |
| [`.github/filters.yml`](../.github/filters.yml) | Peta path → nama app, dibaca `dorny/paths-filter` |
| [`.github/components.json`](../.github/components.json) | Daftar resmi komponen: context, dockerfile, target, nama image |
| [`.github/actions/detect-components`](../.github/actions/detect-components/action.yml) | Menggabungkan keduanya menjadi matrix job |

Alurnya:

```
path yang berubah  →  paths-filter  →  ["api", "landing"]
                                            │
                     jq atas components.json ▼
        {"include":[{component:"api",     target:"app", …},
                    {component:"api-web", target:"web", …},
                    {component:"landing", target:"runner", …}]}
                                            │
                       strategy.matrix ─────┘
```

Perhatikan `api` menghasilkan **dua** entri matrix — `api` dan `api-web` —
karena satu Dockerfile menghasilkan dua image yang harus selalu seiring.

Filter `pipeline` di `filters.yml` sengaja disertakan ke setiap app: kalau
`.github/workflows/**` atau `deploy/compose*.yml` berubah, seluruh image
dibangun ulang. Perubahan pipeline harus dibuktikan pada semua app, bukan
hanya yang kebetulan ikut berubah.

## Job pada `ci.yml`

| Job | Kapan | Isi |
| --- | --- | --- |
| `plan` | selalu | Menentukan app & komponen yang berubah |
| `api (Laravel)` | jika `api` berubah | PHP 8.4, composer install, `pint --test`, `npm run build`, `php artisan test` |
| `node (Nuxt)` | per app Nuxt yang berubah | `npm ci`, lalu `lint` / `typecheck` / `test` dengan `--if-present`, dan `build` |
| `image` | per komponen yang berubah | Build lewat `reusable-docker.yml`, `push: false` |
| `deploy scripts` | selalu | `shellcheck deploy/scripts/*.sh` + `docker compose config` |
| `CI passed` | selalu | Gerbang tunggal untuk branch protection |

`--if-present` membuat matrix Nuxt tetap seragam meski tiap app mengadopsi
pemeriksaan pada waktunya sendiri: script yang tidak ada dilewati, script yang
gagal menggagalkan CI. Saat ini hanya `tenant-web` punya `lint`, `typecheck`,
dan `test`.

`CI passed` adalah satu-satunya status check yang perlu diwajibkan di branch
protection. Ia hijau kalau tidak ada job yang `failure` atau `cancelled` —
`skipped` dianggap sah, karena itu memang arti dari "app ini tidak berubah".

## Tag image

Dihasilkan `docker/metadata-action` di `reusable-docker.yml`:

| Tag | Kapan | Sifat |
| --- | --- | --- |
| `sha-<40 hex>` | setiap build | Immutable, inilah identitas sebenarnya |
| `pr-<nomor>` | pull request | Tidak di-push (PR hanya build) |
| `main` | push ke main | Bergerak |
| `edge` | push ke main | Bergerak, selalu main terbaru |
| `1.4.0` | tag rilis | Immutable |
| `1.4`, `1`, `latest` | tag rilis stabil | Bergerak |

Prerelease (`api-v1.5.0-rc.1`) hanya mendapat tag `1.5.0-rc.1`. Ia tidak boleh
menjadi `latest` atau membajak jalur `1.5`.

Staging memakai `sha-<commit>`, production memakai versi semver. Keduanya
immutable, jadi selalu bisa dijawab: "tepatnya commit mana yang berjalan?"

## Cache

`cache-from`/`cache-to: type=gha` dengan `scope` per komponen. Scope terpisah
penting: satu cache bersama membuat build API menghapus layer cache milik
Nuxt secara bergantian, dan cache hit menjadi nol.

## Keamanan supply chain

Setiap image yang di-push mendapat:

- **Trivy scan** — HIGH + CRITICAL, `ignore-unfixed`, hasil SARIF diunggah ke
  tab Security. Default tidak memblokir (`fail-on-vulnerabilities: false`)
  supaya CVE base image tanpa perbaikan tidak menghentikan rilis. Setel
  `fail-on-vulnerabilities: true` pada pemanggilan `reusable-docker.yml` kalau
  ingin memblokir.
- **Provenance SLSA** (`mode=max`) dan **SBOM**.
- **Label OCI** berisi commit sha.

Permission `GITHUB_TOKEN` diberikan per job, bukan per workflow: `contents:
read` di mana-mana, `packages: write` hanya di job build, `packages: read`
hanya di job deploy.

## Yang perlu dikonfigurasi di GitHub

### Secret — per GitHub Environment (`staging`, `production`)

| Secret | Contoh | Keterangan |
| --- | --- | --- |
| `SSH_HOST` | `203.0.113.10` | Alamat server |
| `SSH_USER` | `deploy` | Anggota grup `docker`, tanpa sudo interaktif |
| `SSH_PRIVATE_KEY` | isi file PEM | Pasangan dari public key di `~/.ssh/authorized_keys` |
| `SSH_PORT` | `22` | Opsional |
| `DEPLOY_PATH` | `/srv/sewantara` | Path clone di server |

Registry tidak butuh secret: workflow meneruskan `GITHUB_TOKEN` berumur pendek
ke server untuk `docker login ghcr.io`, dan `deploy.sh` menjalankan
`docker logout` setelah selesai.

### Repository variable

| Variable | Dipakai untuk | Wajib |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | Build arg `dashboard` (dibakar ke bundle) | ya |
| `VITE_REVERB_APP_KEY` | Build arg aset Vite pada API | ya kalau memakai Reverb |
| `VITE_REVERB_HOST` | Host publik Reverb, mis. `api.sewantara.id` | idem |
| `VITE_REVERB_PORT` | default `443` | tidak |
| `VITE_REVERB_SCHEME` | default `https` | tidak |
| `VITE_APP_NAME` | default `Sewantara` | tidak |
| `STAGING_ENABLED` | `true` untuk mengaktifkan auto-deploy staging dari main | tidak |

### Environment variable — per GitHub Environment

Dua variable ini di-scope ke Environment, bukan repository, supaya tidak
mungkin salah arah antar environment:

| Variable | Contoh | Dipakai |
| --- | --- | --- |
| `PUBLIC_URL` | `https://sewantara.id` | Tautan pada catatan deployment GitHub |
| `HEALTH_URL` | `https://api.sewantara.id/up` | Dipanggil runner setelah rollout; kosongkan untuk melewati |

`reusable-deploy.yml` membaca keduanya langsung lewat `vars`, bukan lewat input.
Itu menghilangkan satu kelas bug: ekspresi ternary di pemanggil yang jatuh ke
URL staging ketika variable production kebetulan kosong.

### Environment

Buat `production` dengan **required reviewers**. Itulah gerbang approval
sebelum rilis menyentuh production; workflow tidak punya gerbang lain, dan
sengaja tidak punya.

`staging` hanya dibutuhkan jika `STAGING_ENABLED=true`.

### Branch protection pada `main`

- Wajib pull request, minimal satu approval.
- Wajib status check: **`CI passed`**.
- Wajib branch up to date sebelum merge.
- Hanya squash merge.
- Larang force push dan penghapusan branch.

## Concurrency

| Workflow | Group | Perilaku |
| --- | --- | --- |
| `ci.yml` | per ref | Batalkan run lama — hanya commit terbaru yang relevan |
| `cd.yml` | `cd-staging` | Antre, jangan batalkan — rollout separuh jalan lebih buruk daripada menunggu |
| `release.yml` | `release-production` | Idem |
| `deploy-manual.yml` | per environment | Idem |

Di sisi server, `deploy.sh` juga memegang `flock` di `deploy/.deploy.lock`,
sehingga deploy manual dan deploy dari CI tidak bisa saling menimpa.

## Debug

| Gejala | Penyebab & tindakan |
| --- | --- |
| Job Actions tidak jalan, pesan billing | Masalah level akun GitHub, bukan repo. Selesaikan di Settings → Billing, lalu **Re-run jobs**. |
| `image` job dilewati padahal app diubah | Periksa pola di `filters.yml`. Untuk push, paths-filter membandingkan dengan commit sebelumnya — force push bisa mengacaukannya. Jalankan `ci.yml` lewat `workflow_dispatch` dengan `all: true`. |
| Deploy: `pull failed — does <tag> exist` | Tag belum ada di GHCR. Rilis membangun sendiri, jadi ini biasanya berarti job `image` gagal lebih dulu di run yang sama. |
| SSH timeout | Runner GitHub memakai IP publik dinamis; firewall harus mengizinkan SSH dari internet, bukan hanya satu IP. |
| Health gate gagal lalu rollback | Cek log yang dicetak `deploy.sh` (40 baris terakhir per service), lanjut ke [06_RUNBOOK.md](06_RUNBOOK.md). |
| `unknown app '<nama>'` | App baru belum didaftarkan di `deploy/scripts/lib.sh`. Lihat daftar langkah di [00_MONOREPO.md](00_MONOREPO.md). |

Untuk mereproduksi job `deploy scripts` di lokal:

```bash
make validate
```

## Pin action ke SHA

Semua action saat ini dirujuk dengan tag mayor (`actions/checkout@v4`).
Praktik yang lebih ketat adalah mem-pin ke commit SHA agar tag yang dipindahkan
tidak bisa mengubah perilaku pipeline. Dependabot sudah dikonfigurasi untuk
ekosistem `github-actions`, jadi setelah di-pin ke SHA ia akan mengusulkan
pembaruannya.
