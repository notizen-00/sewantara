# Architecture Decision Records

Setiap berkas di sini mencatat satu keputusan: apa yang diputuskan, apa
konteksnya, dan **apa yang dikorbankan**. Bagian terakhir itu yang paling
berguna — enam bulan dari sekarang, orang yang ingin mengubah keputusan ini
perlu tahu harga yang sudah dibayar, bukan hanya kesimpulannya.

ADR bersifat append-only. Keputusan yang berubah tidak dihapus atau disunting;
buat ADR baru yang menyatakan `Supersedes 000X`, lalu ubah status ADR lama
menjadi `Superseded by 000Y`.

| # | Keputusan | Status |
| --- | --- | --- |
| [0001](0001-monorepo-app-independen.md) | Monorepo dengan app yang tetap independen | Accepted |
| [0002](0002-build-di-ci-bukan-di-server.md) | Build di CI, server hanya menarik image | Accepted |
| [0003](0003-versi-per-app.md) | Versi dan tag rilis per app | Accepted |
| [0004](0004-dashboard-config-build-time.md) | Dashboard SPA: konfigurasi build-time | Accepted |
| [0005](0005-single-host-compose.md) | Satu host, Docker Compose, bukan Kubernetes | Accepted |
| [0006](0006-rollback-image-bukan-migration.md) | Rollback menukar image, tidak membalik migration | Accepted |

## Format

```markdown
# 000X — Judul singkat

**Status:** Proposed | Accepted | Superseded by 000Y
**Tanggal:** YYYY-MM-DD

## Konteks
Keadaan yang memaksa keputusan ini. Fakta, bukan preferensi.

## Keputusan
Apa yang dipilih, dalam bentuk kalimat aktif.

## Konsekuensi
Yang menjadi lebih mudah, dan yang menjadi lebih sulit.

## Alternatif yang ditolak
Apa saja yang dipertimbangkan, dan kenapa tidak dipilih.
```
