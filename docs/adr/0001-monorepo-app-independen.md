# 0001 — Monorepo dengan app yang tetap independen

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

Empat aplikasi Sewantara sebelumnya berada di repo terpisah. Semuanya
bergantung pada satu kontrak: REST API multi tenant milik Laravel.

Yang terjadi dalam praktik:

- Perubahan kontrak API butuh empat PR di empat repo, tanpa satu pun commit
  yang membuktikan keempatnya cocok.
- Tidak ada satu titik yang bisa menjawab "versi frontend mana yang cocok
  dengan versi API mana".
- Dokumentasi tersalin manual antar repo lalu menyimpang — jejaknya masih
  terlihat pada `docs/docs/` dan `apps/api/docs/` yang sebagian identik.

Sementara itu, keempat app punya toolchain yang benar-benar berbeda: satu
PHP/Composer, tiga Node dengan dependency Nuxt yang tidak identik.

## Keputusan

Satu repository berisi `apps/api`, `apps/dashboard`, `apps/tenant-web`,
`apps/landing`. Riwayat Git, issue, dan PR menjadi satu.

Yang **tidak** disatukan:

- **Dependency.** Setiap app punya `package.json` dan lockfile sendiri. Tidak
  ada npm workspace, tidak ada hoisting.
- **Build.** Build context tiap image adalah direktori app-nya, bukan root
  repo. `apps/api` tidak bisa menyentuh berkas `apps/landing` bahkan kalau
  mencoba.
- **CI.** Path filter memastikan hanya app yang berubah yang diperiksa dan
  di-build.
- **Rilis.** Tag versi per app, lihat [0003](0003-versi-per-app.md).

## Konsekuensi

Lebih mudah:

- Perubahan lintas app menjadi satu PR yang bisa direview sebagai satu
  kesatuan.
- Satu commit sha menggambarkan keadaan seluruh platform.
- Konfigurasi deploy, dokumentasi, dan pipeline punya satu rumah.
- Bump dependency lintas app bisa diusulkan Dependabot secara terkoordinasi.

Lebih sulit:

- Clone repo lebih besar, dan berisi kode yang mungkin tidak relevan bagi
  pekerjaan seseorang.
- CODEOWNERS menjadi satu-satunya mekanisme yang membatasi siapa mengubah apa —
  tidak ada lagi batas berupa "tidak punya akses ke repo itu".
- Kode bersama harus disalin atau diambil lewat HTTP. Tidak ada package
  internal, jadi tipe TypeScript tidak dibagi dan perubahan kontrak API tidak
  terdeteksi compiler frontend.
- Riwayat `git log` bercampur antar app. Ini yang membuat scope pada
  Conventional Commits menjadi wajib, bukan kosmetik.

## Alternatif yang ditolak

**Tetap empat repo.** Menyelesaikan sebagian masalah — batas hak akses jelas —
tapi tidak menyelesaikan masalah utamanya, yaitu tidak ada commit yang
membuktikan kontrak API dan pemakaiannya cocok.

**Monorepo dengan npm workspace + Turborepo/Nx.** Memberi cache build dan
dependency graph, tapi menghancurkan properti yang paling berharga: build
context yang self-contained per app. Lockfile yang di-hoist ke root membuat
setiap Dockerfile harus memakai root repo sebagai context, sehingga menyunting
landing page membatalkan cache build API. Untuk empat app dengan satu app PHP
yang tidak ikut ekosistem npm, biayanya lebih besar dari manfaatnya.

**Monorepo dengan package internal (`packages/shared-types`).** Menarik, dan
mungkin benar suatu saat nanti. Ditolak sekarang karena akan memaksa
workspace/hoisting demi satu package, sementara kontrak API sudah punya sumber
kebenaran berupa dokumentasi dan test. Kalau nanti dibutuhkan, itu keputusan
baru dan harus lewat ADR tersendiri.
