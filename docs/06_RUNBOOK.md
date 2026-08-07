# Runbook production

Untuk dibaca saat production bermasalah. Urutannya: **kenali gejala →
kumpulkan fakta → tindakan**. Jangan mulai dengan menebak.

```bash
cd /srv/sewantara
make status          # tag, health, commit sha, 10 rollout terakhir
```

Satu perintah itu menjawab pertanyaan pertama yang selalu relevan: apakah ada
yang baru saja di-deploy?

## Langkah pertama, apa pun gejalanya

```bash
make status                       # apa yang berjalan, apakah sehat
make logs SVC=api-web             # Ctrl-C untuk keluar
docker stats --no-stream          # CPU / memori per container
df -h /                           # disk penuh menyebabkan gejala yang aneh
```

Kalau `make status` menunjukkan rollout beberapa menit lalu dan health sudah
merah: **rollback dulu, diagnosa setelahnya.**

```bash
make rollback APP=<app>
```

## Health check cepat

| Layanan | Perintah |
| --- | --- |
| API | `curl -fsS https://api.sewantara.id/up` |
| tenant-web | `curl -fsS https://<tenant>.sewantara.id/healthz` |
| landing | `curl -fsS https://sewantara.id/healthz` |
| dashboard | `curl -fsS https://app.sewantara.id/healthz` |
| PostgreSQL | `make artisan CMD="db:show"` |
| Redis | `docker compose --project-directory deploy -f deploy/compose.yml --env-file deploy/.env --env-file deploy/.env.images exec redis redis-cli ping` |

---

## Gejala: API 502 / 503

Reverse proxy hidup tapi tidak mendapat jawaban dari `api-web`.

```bash
make ps
make logs SVC=api-web
make logs SVC=api
```

| Temuan | Tindakan |
| --- | --- |
| `api` restart terus | Baca 100 baris pertama lognya. Biasanya `APP_KEY` kosong, DB tidak bisa dihubungi, atau config cache gagal dibangun. |
| `api` healthy, `api-web` unhealthy | Masalah di nginx. Cek `apps/api/docker/nginx/default.conf` pada commit yang di-deploy. |
| `postgres` unhealthy | Lihat bagian PostgreSQL di bawah. |
| Semua healthy tapi tetap 502 | Masalah di reverse proxy, bukan di stack ini. Cek `API_HTTP_PORT` di `deploy/.env` cocok dengan target proxy. |

```bash
# Uji dari dalam host, melewati reverse proxy sepenuhnya
curl -fsS -H 'Host: api.sewantara.id' http://127.0.0.1:8090/up
```

Kalau perintah itu berhasil sementara akses publik gagal, masalahnya di proxy
atau TLS.

## Gejala: tenant-web menampilkan tenant yang salah, atau 404 semua tenant

Tenant ditentukan dari header `Host`. Hampir selalu masalah proxy.

```bash
curl -fsS -H 'Host: kamerajember.sewantara.id' http://127.0.0.1:3000/healthz
make logs SVC=tenant-web
```

Yang harus diperiksa:

- Reverse proxy meneruskan `Host` asli, tidak menimpanya dengan `127.0.0.1`.
- `NUXT_PUBLIC_BASE_DOMAIN` di `deploy/env/tenant-web.env` = `sewantara.id`.
- `NUXT_TRUST_PROXY=true` **hanya** kalau proxy selalu menimpa header
  forwarded milik klien. Kalau tidak, klien bisa memalsukan tenant.
- DNS wildcard `*.sewantara.id` mengarah ke server.

## Gejala: queue tidak berjalan, job menumpuk

`api-queue` tidak punya healthcheck — worker tidak punya sinyal readiness
yang bermakna — jadi kegagalannya tidak terlihat dari `make status`.

```bash
make logs SVC=api-queue
make artisan CMD="queue:monitor redis:default"
make artisan CMD="queue:failed"
```

| Temuan | Tindakan |
| --- | --- |
| Container mati | `make restart APP=api` |
| Job gagal berulang | `make artisan CMD="queue:retry all"` setelah penyebabnya diperbaiki |
| Redis menolak write | Redis `noeviction` dan memori penuh. Naikkan `REDIS_MAXMEMORY` di `deploy/.env`, lalu `make restart APP=api`. |
| Worker jalan tapi memakai kode lama | Tidak mungkin terjadi: queue memakai image yang sama dengan `api` dan selalu ikut direkreasi. Kalau tampak begitu, `make status` akan menunjukkan tag berbeda. |

## Gejala: WebSocket (Reverb) tidak connect

```bash
make logs SVC=api-reverb
```

| Penyebab | Periksa |
| --- | --- |
| Proxy tidak meneruskan upgrade | `/app/*` dan `/apps/*` harus mengizinkan WebSocket di reverse proxy |
| Origin ditolak | `REVERB_ALLOWED_ORIGINS` di `deploy/env/api.env` |
| Aset frontend memakai host lama | `VITE_REVERB_*` dibakar saat build. Ubah repository variable, lalu **rebuild** image API. |
| Redis mati | Reverb memakai Redis untuk scaling |

## Gejala: PostgreSQL tidak sehat

```bash
make logs SVC=postgres
df -h /
```

| Temuan | Tindakan |
| --- | --- |
| `no space left on device` | Lihat bagian "Disk penuh" |
| Auth gagal dari Laravel | `DB_PASSWORD` ≠ `POSTGRES_PASSWORD` di `deploy/env/api.env`. Keduanya harus sama. Mengubah `POSTGRES_PASSWORD` **tidak** mengubah password di volume yang sudah ada — gunakan `ALTER USER`. |
| Terlalu banyak koneksi | Kurangi jumlah worker atau naikkan `max_connections` |
| Data corrupt | Stop stack, restore dari backup (di bawah) |

Mengubah password user PostgreSQL yang sudah ada:

```bash
docker compose --project-directory deploy -f deploy/compose.yml \
  --env-file deploy/.env --env-file deploy/.env.images \
  exec postgres psql -U sewantara -d sewantara_app \
  -c "ALTER USER sewantara WITH PASSWORD 'password-baru';"
# lalu samakan DB_PASSWORD dan POSTGRES_PASSWORD di deploy/env/api.env
make restart APP=api
```

## Gejala: disk penuh

```bash
df -h /
docker system df
du -sh /var/lib/docker/containers/* | sort -h | tail
```

Berurutan, dari yang paling aman:

```bash
docker image prune -f              # image dangling
docker image prune -a -f           # semua image tak terpakai — pull ulang saat deploy berikutnya
docker builder prune -f            # cache build (seharusnya kosong di server)
```

Log container dibatasi 10 MB × 3 per service lewat `x-logging` di
`compose.yml`, jadi log seharusnya bukan penyebab. Kalau ternyata besar,
berarti ada container yang berjalan di luar stack ini.

**Jangan** menjalankan `docker system prune --volumes`. Itu menghapus
`postgres_data` dan `api_storage`.

## Gejala: deploy gagal dan otomatis rollback

Pesannya `rollback complete — the previous version is serving traffic again`.
Production sudah aman; sekarang cari penyebabnya.

```bash
deploy/scripts/status.sh --history 20
make logs SVC=<service-yang-gagal>
```

Penyebab yang paling sering:

| Penyebab | Tanda |
| --- | --- |
| Variable environment baru belum diisi | App exit saat start, log menyebut konfigurasi kosong |
| Migration bertabrakan dengan data | Job gagal di langkah migrate — belum ada container yang ditukar, production tidak pernah terganggu |
| Health timeout terlalu pendek | Semua container sebenarnya sehat, hanya lambat. Naikkan `HEALTH_TIMEOUT` di `deploy/.env`. |
| Image tidak ada di GHCR | Gagal di langkah pull, sebelum ada perubahan apa pun |

Untuk mempertahankan kondisi gagal agar bisa diperiksa, set `AUTO_ROLLBACK=0`
di `deploy/.env`, lalu ulangi deploy-nya.

## Gejala: rollback gagal

Pesannya `ROLLBACK FAILED — manual intervention required`.

```bash
cat deploy/.env.images
cat deploy/.env.images.previous
```

Kembalikan manual:

```bash
cp deploy/.env.images.previous deploy/.env.images
deploy/scripts/deploy.sh --no-pull --no-migrate --tag "$(grep '^API_IMAGE_TAG=' deploy/.env.images | cut -d= -f2)" api
```

Kalau image lama sudah terhapus prune, tarik ulang dari GHCR (butuh
`GHCR_USER`/`GHCR_TOKEN` atau `docker login`).

---

## Restore dari backup

Ini prosedur destruktif. Baca seluruhnya sebelum menjalankan perintah pertama.

Semua perintah di bawah memakai alias ini:

```bash
COMPOSE="docker compose --project-directory deploy -f deploy/compose.yml \
  --env-file deploy/.env --env-file deploy/.env.images"
```

```bash
# 1. Hentikan semua yang menulis ke database (postgres tetap hidup)
$COMPOSE stop api api-queue api-scheduler api-reverb api-web

# 2. Restore database
$COMPOSE exec -T postgres psql -U sewantara -d postgres \
  -c "DROP DATABASE IF EXISTS sewantara_app_old;" \
  -c "ALTER DATABASE sewantara_app RENAME TO sewantara_app_old;" \
  -c "CREATE DATABASE sewantara_app OWNER sewantara;"

cat deploy/backups/postgres-sewantara_app-<STAMP>.dump \
  | $COMPOSE exec -T postgres pg_restore -U sewantara -d sewantara_app --no-owner

# 3. Restore upload (kalau perlu)
docker run --rm \
  -v sewantara_api_storage:/data \
  -v "$PWD/deploy/backups:/backup:ro" \
  alpine:3.21 sh -c 'rm -rf /data/* && tar -xzf /backup/api-storage-<STAMP>.tar.gz -C /data'

# 4. Nyalakan kembali
$COMPOSE up -d
deploy/scripts/status.sh
```

Database lama disimpan sebagai `sewantara_app_old`, bukan dihapus. Itu jaring
pengaman kalau restore-nya sendiri ternyata salah. Hapus setelah yakin.

Latih prosedur ini di host staging minimal sekali per kuartal. Backup yang
belum pernah direstore adalah kabar burung.

## Perawatan berkala

| Kapan | Tindakan |
| --- | --- |
| Harian | Backup otomatis (cron), verifikasi berkasnya ada dan ukurannya wajar |
| Mingguan | `make status`, review PR Dependabot, cek tab Security untuk temuan Trivy |
| Bulanan | Uji restore ke staging, review ruang disk, review log rollout |
| Kuartalan | Rotasi kredensial (lihat [07_SECRETS_AND_ENV.md](07_SECRETS_AND_ENV.md)), review base image mayor |

Contoh cron backup:

```cron
15 2 * * * cd /srv/sewantara && deploy/scripts/backup.sh --keep 14 >>/var/log/sewantara-backup.log 2>&1
```

## Eskalasi

Kumpulkan ini sebelum meminta bantuan — tanpanya, orang berikutnya akan
mengulang seluruh langkah di atas:

```bash
COMPOSE="docker compose --project-directory deploy -f deploy/compose.yml \
  --env-file deploy/.env --env-file deploy/.env.images"

{
  echo '=== status ==='   ; deploy/scripts/status.sh --history 30
  echo '=== ps ==='       ; $COMPOSE ps
  echo '=== disk ==='     ; df -h /; docker system df
  echo '=== logs ==='
  for s in api-web api api-queue api-reverb postgres redis tenant-web dashboard landing; do
    echo "--- $s"; $COMPOSE logs --no-color --tail=50 "$s" 2>&1
  done
} >/tmp/sewantara-incident-$(date -u +%Y%m%dT%H%M%SZ).txt
```

Perhatikan bahwa di sini dipakai `$COMPOSE logs`, bukan `make logs` — target
make memakai `-f` dan akan menggantung menunggu log baru.
