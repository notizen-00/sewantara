# 0003 — Versi dan tag rilis per app

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

Setelah keempat app berada di satu repo, muncul pertanyaan: satu nomor versi
untuk seluruh platform, atau satu per app?

Kecepatan perubahan keempatnya sangat berbeda. `apps/landing` berubah saat ada
kebutuhan marketing; `apps/api` berubah hampir setiap hari. Keduanya tidak
punya alasan untuk berbagi nomor.

Pada saat yang sama, deploy per app adalah kebutuhan eksplisit: perubahan pada
satu app harus membangun dan merilis container app itu saja.

## Keputusan

Setiap app punya jalur versi sendiri, dinyatakan dengan git tag beranotasi:

```
api-v<semver>          dashboard-v<semver>
tenant-web-v<semver>   landing-v<semver>
release-v<semver>      → keempat app dengan satu nomor
```

`release.yml` mem-parse tag menjadi nama app dan versi, lalu membangun hanya
komponen milik app itu dan men-deploy hanya app itu. Tag yang tidak cocok
polanya menggagalkan workflow.

Definisi MAJOR/MINOR/PATCH dinyatakan per app di
[../05_VERSIONING_RELEASE.md](../05_VERSIONING_RELEASE.md). Untuk `api`, yang
menentukan MAJOR adalah breaking change pada kontrak REST/WebSocket — bukan
besarnya perubahan kode.

## Konsekuensi

Lebih mudah:

- Nomor versi membawa informasi. `api-v1.4.0` → `api-v1.5.0` berarti API
  benar-benar berubah.
- Rilis satu app tidak menyentuh app lain: tidak ada rebuild, tidak ada
  restart, tidak ada risiko.
- Rollback per app.
- Release notes tiap app hanya memuat commit yang menyentuh app itu.

Lebih sulit:

- Tidak ada satu nomor yang bisa dipakai menjawab "kita sedang di versi
  berapa". Jawabannya empat nomor, dan `make status` di server.
- Kombinasi versi yang kompatibel harus dijaga manual. Yang menggantikan versi
  bersama adalah aturan urutan deploy: **API selalu maju lebih dulu dan mundur
  paling akhir**, dengan masa transisi ketika API mendukung dua bentuk.
- Empat jalur tag membuat `git tag` lebih ramai. `--match 'api-v*'`
  menyelesaikannya.

## Alternatif yang ditolak

**Satu versi untuk seluruh platform (lockstep).** Perbaikan typo di landing
page menjadi rilis API. Nomor yang bergerak tanpa perubahan tidak memberi
informasi, dan membuat "apa yang berubah di 1.4.1?" tidak bisa dijawab. Juga
bertentangan dengan tujuan build selektif.

**Versi berbasis tanggal (`2026.08.07`).** Menghapus perdebatan MAJOR/MINOR,
tapi juga menghapus satu-satunya sinyal formal untuk breaking change API —
padahal justru itu yang paling perlu dikomunikasikan ke konsumen kontrak.

**Changesets / semantic-release otomatis.** Rilis otomatis dari commit menarik,
tapi menambah dependency Node di root repo (yang sengaja tidak punya
`node_modules`) dan mengambil alih keputusan yang saat ini disengaja manual:
kapan production berubah. Approval GitHub Environment adalah gerbang yang
diinginkan, dan rilis otomatis akan melewatinya.
