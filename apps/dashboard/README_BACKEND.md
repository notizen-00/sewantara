# Sewantara Backend

Panduan integrasi backend Laravel Sewantara dengan aplikasi Nuxt Sewantara
Mitra. Dokumen ini berfokus pada kontrak API, autentikasi tenant, Google OAuth,
konfigurasi production, dan pemeriksaan deployment.

Source backend tidak berada di repository ini. Jalankan perintah Laravel pada
repository backend Sewantara.

## Arsitektur production

| Layanan | URL |
| --- | --- |
| Backend Laravel | `https://api.sewantara.id` |
| Frontend Nuxt | `https://app.sewantara.id` |
| Prefix REST API | `/api` |
| Callback Google ke backend | `/api/central/auth/google/callback` |
| Callback backend ke frontend | `/auth/google/callback` |

Frontend hanya menyimpan origin API:

```dotenv
NUXT_PUBLIC_API_BASE=https://api.sewantara.id
```

API client Nuxt akan menambahkan prefix `/api` secara otomatis.

## Persiapan backend

Gunakan versi PHP dan database yang ditentukan oleh `composer.json` backend.
Alur setup Laravel pada umumnya:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan optimize:clear
php artisan serve
```

Sesuaikan koneksi database, cache, queue, mail, filesystem, dan konfigurasi
tenancy berdasarkan environment masing-masing. Jangan memasukkan `.env`, client
secret Google, atau token Sanctum ke Git.

## Environment production

Contoh konfigurasi minimum yang relevan dengan integrasi frontend:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sewantara.id

SESSION_DOMAIN=.sewantara.id
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://api.sewantara.id/api/central/auth/google/callback
GOOGLE_AUTH_FRONTEND_CALLBACK_URL=https://app.sewantara.id/auth/google/callback
GOOGLE_AUTH_EXCHANGE_TTL=60
```

`SESSION_DOMAIN`, cookie HTTPS, dan `SameSite=lax` penting karena backend
menyimpan OAuth state sebelum browser berpindah ke Google. Cookie tersebut harus
kembali ke `api.sewantara.id` ketika Google memanggil callback backend.

Setelah mengubah environment:

```bash
php artisan optimize:clear
php artisan config:cache
```

## Konfigurasi Google Cloud Console

Buat OAuth Client ID dengan tipe **Web application**.

Authorized redirect URI harus sama persis dengan callback backend:

```text
https://api.sewantara.id/api/central/auth/google/callback
```

Jangan mendaftarkan URL berikut sebagai Authorized redirect URI:

```text
https://api.sewantara.id/api/central/auth/google/redirect
https://app.sewantara.id/auth/google/callback
```

Endpoint `/redirect` hanya memulai autentikasi. Callback frontend hanya menerima
kode exchange sekali pakai dari backend, bukan authorization code langsung dari
Google.

Pastikan OAuth Client ID yang diedit di Google Console sama dengan nilai
`GOOGLE_CLIENT_ID` pada backend production.

## Alur Google OAuth

```text
Nuxt
  -> GET api.sewantara.id/api/central/auth/google/redirect
  -> Google OAuth
  -> GET api.sewantara.id/api/central/auth/google/callback
  -> app.sewantara.id/auth/google/callback?code=ONE_TIME_CODE
  -> POST api.sewantara.id/api/central/auth/google/exchange
  -> Bearer token dan data pengguna
  -> Dashboard Nuxt
```

Kode exchange berlaku selama 60 detik dan hanya dapat digunakan satu kali.
Bearer token tidak boleh diletakkan pada query string callback frontend.

### Memulai autentikasi

```http
GET /api/central/auth/google/redirect?device_name=nuxt-web
```

Respons yang diharapkan adalah `302` menuju Google. `device_name` bersifat
opsional dan digunakan sebagai nama token Sanctum.

### Callback Google

```http
GET /api/central/auth/google/callback
```

Endpoint ini dipanggil oleh Google. Setelah OAuth berhasil, backend membuat
kode exchange dan mengarahkan browser ke:

```text
https://app.sewantara.id/auth/google/callback?code=ONE_TIME_CODE
```

### Menukar kode

```http
POST /api/central/auth/google/exchange
Content-Type: application/json
Accept: application/json
```

```json
{
  "code": "ONE_TIME_CODE"
}
```

Contoh respons berhasil:

```json
{
  "success": true,
  "message": "Berhasil masuk dengan Google.",
  "data": {
    "token_type": "Bearer",
    "access_token": "1|sanctum-token",
    "user": {
      "id": 1,
      "tenant_id": "tenant-id",
      "name": "Nama Pengguna",
      "email": "user@example.com"
    }
  }
}
```

Contoh kode tidak valid, kedaluwarsa, atau sudah pernah digunakan:

```json
{
  "success": false,
  "error": {
    "code": "GOOGLE_AUTH_CODE_INVALID",
    "message": "Kode autentikasi Google tidak valid atau sudah kedaluwarsa.",
    "details": null
  }
}
```

## Autentikasi email dan tenant

Login email/password:

```http
POST /api/tenant/auth/login
Content-Type: application/json
```

```json
{
  "email": "owner@example.test",
  "password": "your-password",
  "device_name": "mitra-dashboard"
}
```

Setelah login, request tenant menggunakan bearer token dan branch aktif:

```http
Authorization: Bearer {access_token}
X-Branch-Id: 1
Accept: application/json
```

Endpoint session:

```http
GET /api/tenant/{tenant}/me
```

Endpoint logout:

```http
POST /api/tenant/{tenant}/auth/logout
```

Tenant ID diperoleh dari respons login dan disimpan bersama token pada auth
store frontend. `X-Branch-Id` wajib menunjuk cabang aktif yang dapat diakses
oleh pengguna.

## CORS

Backend harus mengizinkan origin frontend production:

```text
https://app.sewantara.id
```

Konfigurasi harus mencakup:

- path `api/*`;
- method `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, dan `OPTIONS` sesuai endpoint;
- header `Content-Type`, `Accept`, `Authorization`, dan `X-Branch-Id`;
- `supports_credentials=true` untuk alur yang membutuhkan cookie session;
- origin eksplisit, bukan `*`, ketika credentials diaktifkan.

Preflight endpoint exchange dapat diperiksa dengan:

```bash
curl -i -X OPTIONS \
  'https://api.sewantara.id/api/central/auth/google/exchange' \
  -H 'Origin: https://app.sewantara.id' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Respons yang diharapkan adalah `204` dengan header:

```text
Access-Control-Allow-Origin: https://app.sewantara.id
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
```

## Deployment production

Contoh urutan deployment Laravel:

```bash
git pull --ff-only
composer install --no-dev --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan queue:restart
```

Pastikan web server dapat menulis ke `storage` dan `bootstrap/cache`. Arahkan
document root ke folder `public`, aktifkan HTTPS, dan jangan mengekspos `.env`.

Route OAuth dan exchange tidak boleh di-cache oleh reverse proxy atau
Cloudflare. Callback Google harus mempertahankan query string `code` dan
`state`.

## Pemeriksaan setelah deployment

Pastikan route tersedia:

```bash
php artisan route:list --path=central/auth/google
```

Periksa redirect awal:

```bash
curl -I \
  'https://api.sewantara.id/api/central/auth/google/redirect?device_name=nuxt-web'
```

Hasil yang benar adalah `302` dengan lokasi `accounts.google.com`. Parameter
`redirect_uri` di URL Google harus bernilai:

```text
https://api.sewantara.id/api/central/auth/google/callback
```

Checklist akhir:

- OAuth Client bertipe Web application.
- Authorized redirect URI mengarah ke callback backend.
- `APP_URL` dan seluruh URL OAuth menggunakan HTTPS.
- `GOOGLE_AUTH_FRONTEND_CALLBACK_URL` mengarah ke callback Nuxt.
- Origin frontend diizinkan oleh CORS.
- Cookie session menggunakan domain dan atribut yang benar.
- Config cache dibuat ulang setelah `.env` diperbarui.
- Queue worker direstart apabila proses backend memakai queue.
- Endpoint exchange tidak dapat menggunakan kode yang sama dua kali.

## Troubleshooting

| Gejala | Kemungkinan penyebab | Pemeriksaan |
| --- | --- | --- |
| Google menampilkan `redirect_uri_mismatch` | URI Google Console berbeda | Cocokkan callback backend persis, termasuk HTTPS dan tanpa trailing slash |
| Callback backend menampilkan invalid state | Cookie session tidak kembali | Periksa `SESSION_DOMAIN`, HTTPS, `SameSite`, dan cache konfigurasi |
| Berhasil di Google tetapi tidak kembali ke Nuxt | URL frontend backend salah | Periksa `GOOGLE_AUTH_FRONTEND_CALLBACK_URL` |
| Callback Nuxt menampilkan kode kedaluwarsa | Exchange melewati TTL atau kode dipakai ulang | Periksa log backend dan nilai `GOOGLE_AUTH_EXCHANGE_TTL` |
| Browser memblokir request exchange | CORS tidak sesuai | Periksa preflight dan origin `https://app.sewantara.id` |
| Exchange berhasil tetapi endpoint `/me` mengembalikan `401` | Token atau tenant context tidak cocok | Periksa respons `access_token`, `tenant_id`, dan middleware Sanctum |
| Perubahan `.env` tidak berlaku | Config lama masih di-cache | Jalankan `optimize:clear` lalu `config:cache` |

Jangan menulis authorization code, bearer token, client secret, atau cookie
session secara lengkap ke application log.

## Dokumentasi API lanjutan

Kontrak endpoint registrasi, onboarding, cabang, produk, inventory, booking,
maintenance, dan private media tersedia di [backend_docs.md](./backend_docs.md).
