# Versioning dan rilis

## Satu versi per app

Setiap app punya jalur versi sendiri. Tidak ada versi tunggal untuk seluruh
platform.

```
api-v1.4.0          dashboard-v0.3.1
tenant-web-v2.0.0   landing-v1.1.0
release-v1.5.0      → keempat app sekaligus
```

Alasannya: versi bersama memaksa perbaikan typo di landing page menjadi rilis
API. Nomor yang bergerak tanpa perubahan tidak memberi informasi apa pun, dan
membuat pertanyaan "apa yang berubah di 1.4.1?" tidak bisa dijawab. Lihat
[adr/0003-versi-per-app.md](adr/0003-versi-per-app.md).

Format tag: `<app>-v<major>.<minor>.<patch>[-prerelease]`. Diverifikasi
`release.yml`; tag yang tidak cocok akan menggagalkan workflow, bukan
menghasilkan rilis yang aneh.

## Arti nomor

Semantic versioning, dengan definisi "publik" yang eksplisit per app.

| | `api` | app frontend |
| --- | --- | --- |
| **MAJOR** | Breaking change kontrak REST/WebSocket: endpoint dihapus, field wajib baru, arti response berubah. Juga: migration destruktif. | Perubahan yang butuh koordinasi — misal ketergantungan pada versi API baru. |
| **MINOR** | Endpoint atau field baru yang kompatibel ke belakang. Migration aditif. | Fitur baru. |
| **PATCH** | Perbaikan bug tanpa perubahan kontrak. | Perbaikan bug, perubahan copy, styling. |

Konsumen kontrak API adalah ketiga app frontend plus integrasi tenant. Yang
menentukan MAJOR bukan besarnya perubahan kode, tapi apakah konsumen harus
berubah.

## Merilis

```bash
make tag APP=api TAG=1.4.0
```

Setara dengan:

```bash
git tag -a api-v1.4.0 -m 'release api v1.4.0'
git push origin api-v1.4.0
```

Yang terjadi setelahnya:

1. `release.yml` mem-parse tag → app `api`, versi `1.4.0`.
2. Komponen `api` dan `api-web` di-build dan di-push dengan tag
   `1.4.0`, `1.4`, `1`, `latest`, dan `sha-<commit>`.
3. Job deploy menunggu **approval** di GitHub Environment `production`.
4. Setelah disetujui: SSH ke server, checkout tag `api-v1.4.0`,
   `deploy.sh --tag 1.4.0 api`.
5. Health endpoint dipanggil dari runner.
6. GitHub Release dibuat, notes dihasilkan dari commit sejak tag sebelumnya.

Tag `release-v<versi>` menjalankan hal yang sama untuk keempat app dengan satu
nomor versi. Gunakan hanya untuk perubahan yang benar-benar serentak (misal
rebranding domain); rilis normal sebaiknya per app.

## Sebelum memberi tag

```bash
git checkout main && git pull
make check-app APP=api          # sama dengan CI
git log --oneline $(git describe --tags --match 'api-v*' --abbrev=0)..HEAD -- apps/api
```

Perintah terakhir menampilkan tepat apa yang akan masuk ke rilis ini. Kalau
kosong, tidak ada yang perlu dirilis.

Beri tag hanya pada commit di `main` yang CI-nya hijau. Tag pada commit lain
akan tetap membangun image — tapi Anda kehilangan jaminan bahwa isinya sudah
lolos pemeriksaan.

## Prerelease

```bash
git tag -a api-v1.5.0-rc.1 -m 'release candidate'
git push origin api-v1.5.0-rc.1
```

Hanya mendapat tag image `1.5.0-rc.1`. Tidak menyentuh `latest`, `1.5`, atau
`1`, sehingga tidak bisa tanpa sengaja tersapu ke production oleh sesuatu yang
mengejar `latest`. GitHub Release ditandai prerelease.

## Rilis lintas app

Perubahan kontrak API yang dipakai frontend selalu dua rilis, dengan urutan
yang tidak boleh dibalik:

```
1. api-v1.5.0          endpoint baru, yang lama masih hidup
2. dashboard-v0.4.0    mulai memakai endpoint baru
3. api-v2.0.0          endpoint lama dihapus (setelah tidak ada pemakai)
```

Aturannya: **API selalu maju lebih dulu, dan mundur paling akhir.** Selama masa
transisi API harus mendukung dua bentuk. Itu biaya yang dibayar agar rollback
frontend selalu mungkin.

Tulis urutan ini di bagian "Catatan deploy" pada PR.

## Rollback

Rollback adalah mengganti tag image, bukan membalikkan commit.

```bash
# di server
make rollback APP=api                     # ke tag sebelumnya
deploy/scripts/rollback.sh --to 1.3.2 api  # ke versi tertentu

# dari GitHub
# Actions → Deploy (manual) → environment: production,
#   apps: api, image-tag: 1.3.2, run-migrations: off
```

Migration **tidak** dibalikkan, dan itu keputusan yang disengaja:
`migrate:rollback` otomatis pada data tenant yang hidup lebih berisiko daripada
menjalankan kode lama di atas schema yang lebih baru. Karena itu ada satu
kewajiban:

> Migration harus kompatibel ke belakang. Kolom nullable baru, tabel baru,
> index baru — boleh. Menghapus atau mengganti nama kolom yang masih dipakai
> rilis sebelumnya — tidak, pecah menjadi dua rilis.

Kalau rilis yang bermasalah memang membawa migration destruktif, rollback
container tidak akan menolong. Jalurnya adalah restore dari backup, lihat
[06_RUNBOOK.md](06_RUNBOOK.md).

Setelah rollback: perbaiki di `main`, lalu rilis versi PATCH baru. Jangan
memindahkan tag yang sudah dipakai — tag immutable adalah dasar dari seluruh
audit trail.

## Changelog

Tidak ada berkas `CHANGELOG.md` yang ditulis tangan. Sumbernya histori commit:

- Judul PR wajib Conventional Commits ber-scope
  ([`pr-hygiene.yml`](../.github/workflows/pr-hygiene.yml) memaksanya).
- Squash merge → satu commit rapi per PR di `main`.
- `release.yml` memanggil `gh release create --generate-notes`, yang
  mengelompokkan commit sejak tag sebelumnya.

Konsekuensinya: judul PR yang buruk = release notes yang buruk. Itu sengaja —
notes yang bagus dihasilkan saat menulis PR, bukan saat merilis.

## Menjawab "apa yang berjalan sekarang?"

```bash
make status                          # di server
git tag --list 'api-v*' --sort=-v:refname | head -5
gh release list
```

`make status` membaca container yang benar-benar hidup: tag dari
`deploy/.env.images`, health dari Docker, dan commit sha dari label OCI image.
Kalau ketiganya tidak sinkron, itu langsung terlihat.
