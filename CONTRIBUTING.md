# Panduan kontribusi

Dokumen ini soal **cara bekerja di repo ini**. Cara menjalankan app ada di
[docs/01_LOCAL_DEVELOPMENT.md](docs/01_LOCAL_DEVELOPMENT.md); aturan struktur
monorepo ada di [docs/00_MONOREPO.md](docs/00_MONOREPO.md).

## Aturan yang tidak bisa dinegosiasi

1. **`main` selalu bisa di-deploy.** Tidak ada push langsung ke `main`; semua
   lewat pull request dan CI hijau.
2. **Satu PR idealnya menyentuh satu app.** Kalau harus lintas app (misal
   endpoint API baru + pemakaiannya di dashboard), jelaskan urutan deploy-nya
   di bagian "Catatan deploy" pada template PR. API selalu di-deploy lebih
   dulu.
3. **Secret tidak pernah masuk Git.** Yang di-commit hanya file `*.env.example`
   dengan nilai placeholder.
4. **Environment variable baru = tiga perubahan dalam satu PR:** kode,
   file `*.env.example` terkait, dan tabel di
   [docs/07_SECRETS_AND_ENV.md](docs/07_SECRETS_AND_ENV.md). Variable yang
   hanya ada di kode akan menjadi outage saat deploy berikutnya.

## Branch

```
main                    satu-satunya branch panjang, selalu deployable
feat/<app>-<ringkas>    fitur      → feat/api-stock-transfer
fix/<app>-<ringkas>     perbaikan  → fix/tenant-web-quote-expiry
chore/<ringkas>         perawatan  → chore/bump-nuxt
```

## Commit dan judul PR

Judul PR wajib mengikuti [Conventional Commits](https://www.conventionalcommits.org/)
**dengan scope**, karena squash-merge menjadikan judul PR sebagai pesan commit
di `main` — dan histori itulah yang dipakai untuk menghasilkan release notes.
Aturan ini dipaksakan oleh workflow [`pr-hygiene.yml`](.github/workflows/pr-hygiene.yml).

```
<type>(<scope>): <subjek huruf kecil, tanpa titik>
```

| | Nilai yang diizinkan |
| --- | --- |
| `type` | `feat` `fix` `perf` `refactor` `docs` `test` `build` `ci` `chore` `revert` |
| `scope` | `api` `dashboard` `tenant-web` `landing` `deploy` `ci` `docs` `repo` |

```
feat(api): tambah endpoint stock transfer antar cabang
fix(tenant-web): perbaiki perhitungan expiry quote
chore(deploy): naikkan health timeout ke 240 detik
```

Breaking change: tulis `feat(api)!: ...` dan jelaskan dampaknya di deskripsi
PR. Itu memicu bump versi mayor saat rilis.

## Sebelum membuka PR

```bash
make check-app APP=<app>
```

Menjalankan rangkaian yang sama dengan CI: Pint + Pest untuk `api`, atau
lint + typecheck + test + build untuk app Nuxt. Kalau perubahan menyentuh
`deploy/` atau `.github/`:

```bash
make validate     # shellcheck + docker compose config
```

## Review

- [`CODEOWNERS`](.github/CODEOWNERS) menentukan reviewer otomatis. Perubahan di
  `deploy/`, `.github/`, atau `Dockerfile` butuh review dari platform karena
  bisa mengubah apa yang berjalan di production.
- Reviewer wajib menjalankan langkah verifikasi yang ditulis pengaju PR. Kalau
  bagian itu kosong, minta diisi dulu.

## Merge

**Squash merge saja.** Satu PR = satu commit di `main` = satu baris release
notes. Judul commit hasil squash harus sama dengan judul PR (default GitHub).

## Rilis

Merge ke `main` mem-publish image `sha-<commit>`, **tidak** menyentuh
production. Production hanya berubah lewat tag rilis:

```bash
make tag APP=api TAG=1.4.0     # membuat & push tag api-v1.4.0
```

Detail dan aturan penomoran ada di
[docs/05_VERSIONING_RELEASE.md](docs/05_VERSIONING_RELEASE.md).

## Menambah app baru ke monorepo

1. Buat `apps/<nama>/` beserta `Dockerfile` multi-stage dan `.dockerignore`.
2. Sediakan endpoint `/healthz` yang tidak bergantung pada layanan lain.
3. Daftarkan komponennya di [`.github/components.json`](.github/components.json).
4. Tambahkan filter path di [`.github/filters.yml`](.github/filters.yml).
5. Tambahkan service, port, dan template env di `deploy/`.
6. Tambahkan app tersebut ke `ALL_APPS` dan keempat fungsi map di
   [`deploy/scripts/lib.sh`](deploy/scripts/lib.sh).
7. Tambahkan entri Dependabot dan scope PR baru.

Langkah 3–6 adalah keseluruhan "pendaftaran" — tidak ada daftar app yang
tersebar di tempat lain. Kalau ada yang terlewat, CI gagal, bukan production.
