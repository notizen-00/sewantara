# Deployment VPS dengan Docker

Panduan ini menggunakan Docker Compose dan Nginx atau Nginx Proxy Manager
sebagai reverse proxy. Secara default port aplikasi di-bind ke `0.0.0.0`
supaya dapat dijangkau reverse proxy yang berjalan di container lain.

## 0. CI/CD (GitHub Actions)

Workflow `.github/workflows/ci-cd.yml` menjalankan dua job:

- **build** — pada setiap push dan pull request ke `master`: `npm ci` lalu
  `npm run build`, untuk memastikan kode tidak rusak sebelum di-merge.
- **deploy** — hanya pada push ke `master` (setelah job `build` sukses):
  SSH ke VPS lalu menjalankan `git pull --ff-only` dan
  `docker compose --env-file .env.production up -d --build`, persis seperti
  langkah manual "Update aplikasi" di bawah.

Job `deploy` menggunakan GitHub Environment bernama `production`. Aktifkan
*required reviewers* pada environment tersebut (Settings → Environments) jika
ingin ada persetujuan manual sebelum deploy jalan.

Tambahkan secrets berikut di **Settings → Secrets and variables → Actions**:

| Secret          | Keterangan                                              |
| --------------- | -------------------------------------------------------- |
| `VPS_HOST`      | IP atau hostname VPS                                     |
| `VPS_USER`      | User SSH (harus tergabung di group `docker`)              |
| `VPS_SSH_KEY`   | Private key SSH (format PEM, tanpa passphrase)            |
| `VPS_PORT`      | Port SSH, opsional (default `22`)                         |
| `VPS_APP_PATH`  | Path repo di VPS, mis. `/opt/sewantara-admin`              |

Pastikan `.env.production` sudah ada di `VPS_APP_PATH` pada VPS (lihat langkah
2 di bawah) sebelum workflow deploy pertama kali dijalankan — workflow tidak
membuat file ini secara otomatis.

## 1. Persiapan VPS

Contoh untuk Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
```

Keluar dan masuk kembali ke SSH agar group `docker` aktif. Pastikan DNS domain
admin sudah mengarah ke IP VPS.

## 2. Siapkan aplikasi

```bash
git clone <repository-url> /opt/sewantara-admin
cd /opt/sewantara-admin
cp .env.production.example .env.production
nano .env.production
```

Isi URL API publik:

```dotenv
NUXT_PUBLIC_API_BASE=https://api.domain-anda.com
APP_BIND_ADDRESS=0.0.0.0
APP_PORT=3005
TZ=Asia/Jakarta
```

`NUXT_PUBLIC_API_BASE` adalah origin API yang digunakan langsung oleh browser.
Client akan menambahkan prefix `/api` pada seluruh request. Jangan memakai nama
service Docker seperti `http://backend:8000` kecuali nama tersebut memang dapat
diakses dari perangkat pengguna.

## 3. Build dan jalankan container

```bash
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=100 admin
```

Tes dari VPS:

```bash
curl -I http://127.0.0.1:3005
```

## Nginx Proxy Manager

Apabila Nginx Proxy Manager berjalan di container Docker, jangan gunakan
`127.0.0.1` atau `localhost` sebagai Forward Hostname. Alamat tersebut menunjuk
ke container Nginx Proxy Manager sendiri.

Gunakan konfigurasi Proxy Host berikut:

```text
Scheme:           http
Forward Hostname: IP private/LAN VPS
Forward Port:     3005
Websockets:       aktif
Block Exploits:   aktif
```

Contoh Forward Hostname adalah `192.168.1.10` atau IP interface VPS yang dapat
dijangkau container Nginx Proxy Manager. Untuk mengetahui alamat host yang
terlihat dari jaringan Docker:

```bash
ip -4 addr show
docker exec <container-npm> sh -c "wget -S -O- http://IP_VPS:3005/"
```

Setelah mengubah binding port, recreate container aplikasi:

```bash
docker compose --env-file .env.production up -d --force-recreate
docker compose --env-file .env.production ps
sudo ss -lntp | grep 3005
```

Output `ss` harus menunjukkan `0.0.0.0:3005`, bukan hanya
`127.0.0.1:3005`.

Jika UFW aktif dan Nginx Proxy Manager berada pada server lain, izinkan port
3005 hanya dari IP server proxy:

```bash
sudo ufw allow from <IP_SERVER_NPM> to any port 3005 proto tcp
```

Jika Nginx Proxy Manager berada pada VPS yang sama, jangan membuka port 3005
secara umum di firewall publik.

## 4. Konfigurasi Nginx

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/sewantara-admin
sudo nano /etc/nginx/sites-available/sewantara-admin
sudo ln -s /etc/nginx/sites-available/sewantara-admin /etc/nginx/sites-enabled/sewantara-admin
sudo nginx -t
sudo systemctl reload nginx
```

Ganti `admin.example.com` dengan domain sebenarnya.

Aktifkan HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.domain-anda.com
```

Backend API harus mengizinkan origin domain admin pada konfigurasi CORS.

## 5. Update aplikasi

```bash
cd /opt/sewantara-admin
git pull --ff-only
docker compose --env-file .env.production up -d --build
docker image prune -f
```

## Operasional

```bash
# Melihat log
docker compose --env-file .env.production logs -f admin

# Restart
docker compose --env-file .env.production restart admin

# Menghentikan aplikasi
docker compose --env-file .env.production down
```

Data bisnis tidak disimpan di container frontend. Menghapus atau membangun
ulang container tidak menghapus data backend.
