# 0006 — Rollback menukar image, tidak membalik migration

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

Rollout `apps/api` menjalankan tiga hal sebelum container ditukar: migration
central, `tenants:migrate` untuk seluruh tenant, dan `EngineSeeder`.

Kalau sebuah rilis ternyata bermasalah, ada dua hal yang bisa dibalik: kode
(image) dan schema (migration). Keduanya punya sifat risiko yang sangat
berbeda.

`migrate:rollback` otomatis di lingkungan multi tenant berarti menjalankan
method `down()` pada puluhan schema tenant yang berisi data pelanggan hidup.
Method `down()` adalah kode yang hampir tidak pernah diuji, dan kegagalan di
tengah jalan meninggalkan sebagian tenant pada schema lama dan sebagian pada
schema baru — keadaan yang tidak dipahami oleh versi kode mana pun.

## Keputusan

Rollback hanya menukar tag image. Migration tidak pernah dibalikkan secara
otomatis.

1. `deploy/scripts/rollback.sh` selalu memanggil `deploy.sh --no-migrate`.
2. Workflow `deploy-manual.yml` punya `run-migrations` dengan default `false`.
3. Sebagai imbalannya, ada satu kewajiban yang tidak bisa dinegosiasi:

   > **Migration harus kompatibel ke belakang.** Kolom nullable baru, tabel
   > baru, index baru — boleh. Menghapus kolom, mengganti nama kolom, atau
   > mempersempit tipe kolom yang masih dipakai rilis sebelumnya — tidak.

4. Perubahan destruktif dipecah menjadi dua rilis: rilis pertama berhenti
   memakai kolomnya, rilis kedua menghapusnya. Di antara keduanya harus ada
   jeda yang cukup untuk memastikan rilis pertama stabil.
5. Kalau rilis yang bermasalah memang membawa migration destruktif, jalurnya
   adalah restore dari backup, bukan rollback — prosedurnya di
   [../06_RUNBOOK.md](../06_RUNBOOK.md).

Urutan langkah di `deploy.sh` mendukung keputusan ini: migration dijalankan dari
image baru **sebelum** container aplikasi ditukar. Migration yang gagal berarti
belum ada satu pun container yang diganti, dan production tidak pernah
terganggu.

## Konsekuensi

Lebih mudah:

- Rollback cepat, deterministik, dan tidak berisiko: satu tag berubah.
- Tidak perlu memelihara method `down()` yang benar untuk data produksi.
- Migration gagal tidak menyebabkan downtime.

Lebih sulit:

- Setiap perubahan schema yang destruktif butuh dua rilis dan disiplin untuk
  menyelesaikan rilis kedua. Kolom yang seharusnya dihapus bisa tertinggal
  selamanya kalau tidak dilacak.
- Selama masa transisi, schema memuat kolom yang tidak dipakai — dan kode harus
  menoleransi keduanya.
- Reviewer harus benar-benar memeriksa kompatibilitas ke belakang setiap
  migration. Ini bagian dari checklist template PR, tapi tidak ada mekanisme
  otomatis yang memaksanya.

## Alternatif yang ditolak

**`migrate:rollback` otomatis saat rollback.** Terdengar simetris, tapi
menjalankan kode `down()` yang tidak teruji pada data tenant hidup, dan
kegagalan sebagian meninggalkan schema yang tidak konsisten antar tenant.
Risikonya lebih besar daripada masalah yang diselesaikan.

**Blue/green database.** Menghapus masalah ini sepenuhnya, tapi butuh dua
cluster database dan mekanisme sinkronisasi — jauh di luar model satu host
([0005](0005-single-host-compose.md)).

**Melarang migration dalam rilis yang sama dengan perubahan kode.** Membuat
setiap fitur butuh dua rilis, bahkan yang aditif. Biaya harian yang terlalu
besar untuk kasus yang jarang.

**Snapshot database otomatis sebelum setiap rollout.** Pernah dipertimbangkan
dan masih layak ditambahkan nanti sebagai pelengkap. Bukan pengganti: snapshot
mempercepat restore, tapi restore tetap berarti kehilangan data yang masuk
setelah snapshot — jadi kompatibilitas ke belakang tetap dibutuhkan.
