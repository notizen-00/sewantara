# 0004 — Dashboard SPA: konfigurasi dibakar saat build

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

`apps/dashboard/nuxt.config.ts` memakai `ssr: false`. Nuxt menghasilkan shell
SPA statis, dan `runtimeConfig.public` ikut dibakar ke dalam bundle pada saat
build — tidak ada proses server yang menyuntikkan nilai baru per request.

Akibatnya `NUXT_PUBLIC_API_BASE` **tidak** bisa diubah lewat environment
variable container. Menaruhnya di `env_file` tidak menghasilkan error; nilainya
diam-diam tidak terpakai, yang jauh lebih berbahaya daripada gagal keras.

Ini bertabrakan dengan pola yang dipakai tiga app lain: satu image, konfigurasi
runtime, bisa dipromosikan dari staging ke production tanpa rebuild.

## Keputusan

Terima sifat build-time itu, dan buat eksplisit di setiap tempat yang relevan:

1. `NUXT_PUBLIC_API_BASE` diambil dari repository variable GitHub dan
   diteruskan sebagai build arg oleh
   [`reusable-docker.yml`](../../.github/workflows/reusable-docker.yml).
2. `apps/dashboard/Dockerfile` mendeklarasikannya sebagai `ARG` dengan komentar
   yang menyatakan konsekuensinya.
3. `deploy/env/dashboard.env.example` menyatakan bahwa isinya hanya jaring
   pengaman, bukan sumber kebenaran.
4. Dokumentasi menyebut satu aturan operasional: **mengubah API base dashboard
   butuh rebuild image, bukan restart container.**

Konsekuensi yang diterima secara sadar: image dashboard spesifik per
environment. Kalau nanti dibutuhkan staging dengan API base berbeda, ia harus
dibangun terpisah — `reusable-docker.yml` sudah menyediakan input
`extra-build-args` dan `tags` untuk itu.

## Konsekuensi

Lebih mudah:

- Bundle dashboard tidak butuh request tambahan untuk mengetahui alamat API.
- Tidak ada perubahan yang perlu dilakukan pada `apps/dashboard` sekarang.

Lebih sulit:

- Image dashboard tidak bisa dipromosikan lintas environment. Ia satu-satunya
  komponen yang begitu, dan ketidakseragaman itu harus terus diingat.
- Mengubah alamat API adalah siklus CI penuh, bukan restart.
- Kalau URL API berubah, dashboard **harus** ikut dirilis. Melewatkannya
  menghasilkan dashboard yang gagal secara senyap di browser pengguna.

## Alternatif yang ditolak

**Nyalakan `ssr: true`.** Menyelesaikan masalah dengan benar: runtime config
akan bekerja dan satu image cukup untuk semua environment. Ditolak sekarang
karena mengubah model rendering dashboard bukan pekerjaan konfigurasi deploy —
ia menyentuh autentikasi, akses `window`, dan seluruh perilaku app. Ini
kandidat terbaik untuk menggantikan ADR ini nanti.

**Muat `/config.json` saat app boot.** Satu image untuk semua environment, dan
tidak butuh SSR. Ditolak untuk sekarang karena menambah request pemblokir
sebelum app bisa dirender, plus kode bootstrap baru — perubahan aplikasi, bukan
perubahan infrastruktur, jadi tidak pantas diselundupkan ke dalam PR setup
deploy.

**Path relatif `/api` dan proxy di edge.** Menghilangkan kebutuhan konfigurasi
sama sekali, tapi memaksa API dan dashboard berbagi origin, sehingga menambah
satu aturan reverse proxy dan mengaburkan batas antar app.

**Menulis ulang nilai di dalam bundle saat container start** (`sed` pada berkas
JS). Berfungsi, dan sering dipakai. Ditolak karena membuat isi image berubah
setelah build, sehingga digest tidak lagi menggambarkan apa yang berjalan —
tepat properti yang [0002](0002-build-di-ci-bukan-di-server.md) berusaha
dijaga.
