# 0005 — Satu host dengan Docker Compose, bukan Kubernetes

**Status:** Accepted
**Tanggal:** 2026-08-07

## Konteks

Sewantara berjalan di satu VPS di belakang Nginx Proxy Manager. Skalanya:
sepuluh container, satu database PostgreSQL dengan satu schema per tenant, satu
Redis. Tim platformnya kecil.

Multi tenancy di sini bersifat *schema per tenant* dalam satu database, bukan
satu deployment per tenant. Menambah tenant tidak menambah container.

## Keputusan

Production dijalankan dengan Docker Compose di satu host, didefinisikan di
[`deploy/compose.yml`](../../deploy/compose.yml), dioperasikan lewat script di
`deploy/scripts/`.

Yang tetap dijaga meski memakai Compose:

- **Image immutable dari registry** — tidak ada build di server
  ([0002](0002-build-di-ci-bukan-di-server.md)).
- **Health gate pada setiap rollout**, dengan rollback otomatis.
- **Deploy tercatat**: `deploy/.deploy-history.log` plus riwayat GitHub
  Environment.
- **Pemisahan network**: `backend` (data store) dan `edge` (yang boleh
  dijangkau reverse proxy). Tiga app Nuxt hanya ada di `edge`, jadi secara
  struktural tidak bisa menyentuh PostgreSQL.
- **Migration dari image baru sebelum container ditukar**, sehingga migration
  yang gagal tidak menyentuh trafik.

Yang secara sadar tidak ada: penjadwalan multi-node, autoscaling, rolling update
tanpa downtime sama sekali, dan service mesh.

## Konsekuensi

Lebih mudah:

- Seluruh topologi production terbaca dalam satu berkas ~250 baris.
- Debug adalah `docker compose logs`, bukan menelusuri lapisan abstraksi.
- Tidak ada control plane yang perlu dirawat, di-upgrade, atau ikut mati.
- Prosedur operasional bisa dijalankan siapa pun yang bisa SSH.

Lebih sulit:

- **Host itu single point of failure.** Diterima secara sadar; yang mengurangi
  dampaknya adalah backup dan kemampuan restore, bukan redundansi.
- **Rollout punya jeda singkat.** `up -d` menukar container; permintaan yang
  sedang berjalan bisa terputus. Reverse proxy dan retry klien menutupinya
  untuk trafik normal.
- **Skala vertikal saja.** Menambah worker queue berarti `--scale`, bukan node
  baru.
- **Ada kerja manual saat setup**: DNS, TLS, firewall. Terdokumentasi di
  [../03_DEPLOYMENT.md](../03_DEPLOYMENT.md), tidak ada di kode.

## Kapan keputusan ini harus ditinjau ulang

Salah satu saja cukup:

- Satu host tidak lagi cukup untuk beban puncak setelah dinaikkan spesifiknya.
- Downtime rollout mulai berdampak nyata pada pengguna.
- Ada kebutuhan SLA yang menuntut failover otomatis.
- Jumlah service tumbuh melampaui yang bisa dipahami dalam satu berkas.

Yang sudah disiapkan untuk memudahkan perpindahan: image sudah immutable dan
ada di registry, konfigurasi sudah eksternal lewat env, dan setiap komponen
sudah punya healthcheck. Pindah ke orkestrator lain berarti mengganti
`compose.yml` dan `deploy/scripts/`, bukan mengubah aplikasinya.

## Alternatif yang ditolak

**Kubernetes (k3s/managed).** Menyelesaikan masalah yang belum dimiliki
Sewantara — multi-node, autoscaling, rolling update — dengan menambah control
plane yang harus dirawat dan model mental yang harus dikuasai seluruh tim.
Untuk sepuluh container di satu host, biayanya jauh melampaui manfaatnya.

**Docker Swarm.** Memberi rolling update dan multi-node dengan sintaks yang
mirip Compose. Ditolak karena pengembangannya efektif berhenti; mengadopsinya
berarti mengambil ketergantungan pada teknologi yang tidak lagi dikembangkan.

**PaaS (Fly.io, Railway, Render).** Menghilangkan pekerjaan operasional, tapi
tidak cocok dengan bentuk aplikasi ini: satu PostgreSQL dengan banyak schema
tenant, WebSocket berstatus, dan volume upload yang persisten. Selain itu
memindahkan model biaya dan lokasi data.

**Nomad.** Lebih sederhana dari Kubernetes dan cocok untuk satu host, tapi tetap
menambah satu scheduler yang harus dipahami, sementara Compose sudah memenuhi
kebutuhan saat ini.
