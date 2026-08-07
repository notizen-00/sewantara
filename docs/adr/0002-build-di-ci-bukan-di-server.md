# 0002 — Build di CI, server hanya menarik image

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

Alur deploy sebelumnya (masih terdokumentasi di
`docs/docs/15_DOCKER_DEPLOYMENT.md`) berjalan begini di server:

```bash
git reset --hard origin/master
docker compose build
docker compose up -d
```

Masalahnya bukan teoretis:

- **Yang di-deploy bukan yang diuji.** CI menguji satu build, server membangun
  build lain beberapa menit kemudian, dengan cache dan base image yang mungkin
  sudah berbeda.
- **Build memakan resource server production.** `npm ci` dan `composer install`
  bersamaan dengan trafik nyata, di host yang sama.
- **Rollback tidak deterministik.** Kembali ke commit lama berarti membangun
  ulang — dan hasilnya belum tentu sama dengan yang dulu berjalan.
- **Gagal build = downtime.** Kegagalan terjadi setelah container lama sudah
  dimatikan.
- **Server butuh toolchain lengkap** dan build secret.

## Keputusan

Server tidak pernah melakukan build.

1. CI membangun image dan mem-push ke GHCR dengan tag immutable
   `sha-<commit-sha>` (dan tag semver untuk rilis).
2. Server melakukan `docker compose pull` lalu `up -d`, memakai tag yang
   diminta.
3. `deploy/compose.yml` sama sekali tidak punya bagian `build:`. Definisi build
   ada di `deploy/compose.build.yml`, yang hanya untuk workstation.
4. Server tetap melakukan checkout commit yang di-deploy — tapi hanya untuk
   mendapat `deploy/` (compose file dan script) yang sesuai dengan image itu.

## Konsekuensi

Lebih mudah:

- Yang berjalan di production adalah image yang sama, byte per byte, dengan
  yang lolos CI.
- Rollback = mengganti satu tag. Cepat dan deterministik.
- Server hanya butuh Docker. Tidak ada PHP, Node, Composer, atau npm.
- Build memakai runner GitHub yang bisa paralel, dengan cache lintas commit.
- Gagal build tidak menyentuh production sama sekali — kegagalan terjadi jauh
  sebelum ada container yang diganti.

Lebih sulit:

- Butuh registry. GHCR dipilih karena sudah ada dan otentikasinya memakai
  `GITHUB_TOKEN`.
- Deploy bergantung pada registry bisa dijangkau. Kalau GHCR down, rollout
  berhenti — tapi yang sudah berjalan tidak terganggu.
- Tidak bisa lagi "cepat perbaiki di server". Itu memang tujuannya.
- Perubahan konfigurasi build-time (`NUXT_PUBLIC_*` dashboard, `VITE_*` API)
  butuh siklus CI penuh, tidak cukup restart. Lihat
  [0004](0004-dashboard-config-build-time.md).

## Alternatif yang ditolak

**`docker save`/`docker load` lewat SSH.** Menghilangkan kebutuhan registry,
tapi memindahkan puluhan MB per deploy, tanpa layer sharing, tanpa riwayat, dan
tanpa cara mudah menanyakan "image apa saja yang tersedia".

**Docker Hub.** Berfungsi, tapi menambah satu akun dan satu set kredensial di
luar GitHub. GHCR terintegrasi dengan permission repo dan `GITHUB_TOKEN`
berumur pendek.

**Build di server dengan `--pull` dan pinning ketat.** Mengurangi
ketidakpastian tapi tidak menghilangkannya, dan tetap membiarkan build memakan
resource production serta gagal setelah container lama mati.
