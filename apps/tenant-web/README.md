# Sewantara Tenant Web

Website publik SSR multi-tenant untuk customer tenant Sewantara: landing page, katalog, detail produk, pemesanan, checkout, pembayaran, tracking, kontak, dan artikel SEO.

Project ini membaca hostname request, menyelesaikan tenant di server, lalu membuat semua komunikasi browser melewati BFF same-origin `/api/*`. Browser tidak memanggil Laravel secara langsung dan tidak dapat memilih header tenant sendiri.

## Fitur yang sudah tersedia

- Branding, warna, logo, favicon, metadata, kontak, lokasi, dan metode pembayaran dinamis per tenant.
- Landing page lengkap: availability search, kategori, featured product, promosi, cara pesan, testimoni, FAQ, artikel, dan CTA.
- Katalog SSR dengan query URL, filter, sort, pagination, empty/error/loading state, serta progressive “Muat lebih banyak”.
- Detail produk dengan gallery, spesifikasi, add-on, kalender availability, aturan booking dinamis, related product, dan CTA mobile.
- Booking berdasarkan `bookingMode`/`bookingRules`, server quote, kupon, add-on, kuantitas, durasi, dan catatan.
- Checkout tervalidasi, agreement eksplisit, metode pembayaran tenant, dan submit dengan `Idempotency-Key`.
- State payment waiting/success/failed/expired serta tracking dengan verifier kontak/token.
- Halaman tentang, kontak, blog list/detail, robots, sitemap, JSON-LD, canonical, OG, dan Twitter meta per tenant.
- Accessible focus state, skip link, keyboard-safe drawer, reduced motion, responsive layout, dan mobile bottom navigation.
- Mode demo lengkap agar flow dapat dicoba tanpa Laravel.

## Persyaratan

- Docker Engine dengan Docker Compose v2.

Node.js `22.19.0` sudah disediakan oleh image, jadi Node dan npm tidak perlu dipasang di host.

## Menjalankan project

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

Untuk PowerShell, salin environment dengan `Copy-Item .env.example .env`.

Buka `http://localhost:3000`. Saat `NUXT_PUBLIC_DEMO_MODE=true`, tenant development menggunakan nilai `NUXT_PUBLIC_DEMO_TENANT` dan tidak membutuhkan backend.

Data demo berguna:

- Kupon: `JEMBER10`
- Tracking: `SWJ-DEMO24`
- Produk contoh: `/catalog/sony-a7-iv`

## Quality checks

```bash
docker compose --profile tools run --build --rm quality
```

Perintah tersebut menjalankan production build, typecheck, lint, dan unit test di dalam container. Deployment SSR menjalankan `.output/server/index.mjs`; `nuxt generate` bukan target deployment utama karena konten bergantung pada hostname dan API runtime.

## Arsitektur integrasi

```text
Browser
  -> Nuxt SSR / Nitro (same-origin BFF)
  -> resolver hostname + request-scoped tenant context
  -> endpoint /api/* eksplisit
  -> https://api.sewantara.id
  -> Laravel tenancy
```

Aturan boundary:

- `NUXT_API_BASE` berada di private runtime config.
- BFF menyisipkan `X-Tenant`, `X-Tenant-Host`, dan `X-Request-Id` dari context server.
- URL upstream memiliki origin tetap; path endpoint berasal dari environment, bukan input browser.
- Request GET publik boleh retry terbatas. Mutation booking tidak di-retry otomatis.
- Availability, quote, booking, checkout, payment, dan tracking memakai `private, no-store`.
- Harga, stok, kupon, pajak, fee, dan status pembayaran selalu authoritative di Laravel. Kalkulasi di `server/utils/demo-booking.ts` hanya aktif dalam mode demo.
- Booking/customer/payment state tidak disimpan sebagai business truth di Pinia. Store hanya menjaga draft non-sensitif untuk UX, sedangkan quote tetap memiliki ID dan expiry server.

Endpoint adapter Laravel dapat diganti lewat `.env` tanpa mengubah halaman:

```dotenv
NUXT_API_TENANT_ENDPOINT=/v1/public/tenant
NUXT_API_HOME_ENDPOINT=/v1/public/home
NUXT_API_CATALOG_ENDPOINT=/v1/public/catalog
NUXT_API_QUOTE_ENDPOINT=/v1/public/bookings/quote
NUXT_API_BOOKINGS_ENDPOINT=/v1/public/bookings
NUXT_API_TRACKING_ENDPOINT=/v1/public/bookings
NUXT_API_BLOG_ENDPOINT=/v1/public/blog
```

Kontrak utama berada di `shared/types/index.ts`. Saat kontrak Laravel final tersedia, sesuaikan response adapter di `server/api/**`; komponen dan halaman tidak perlu mengetahui origin API.

## Multi-tenant development

Di development, tenant fallback diambil dari:

```dotenv
NUXT_PUBLIC_DEMO_TENANT=kamerajember
```

Di production, resolver membaca hostname yang sudah dinormalisasi, misalnya `kamerajember.sewantara.id`. Pastikan Cloudflare/Nginx menimpa forwarded headers dan hanya reverse proxy terpercaya yang dapat mengirimkannya. Cache CDN wajib memasukkan hostname dalam key agar data tenant tidak bercampur.

## Operasional Docker Compose

```bash
# Pantau log
docker compose logs -f web

# Rebuild setelah source berubah
docker compose up --build -d

# Hentikan stack
docker compose down
```

Compose menyediakan health check di `/healthz`, restart policy, graceful shutdown, dan rotasi log dasar. `APP_PORT` mengatur port host, sedangkan `CONTAINER_PORT` mengatur port Nitro di dalam container.

Untuk production, set `NUXT_PUBLIC_DEMO_MODE=false`, isi kredensial API, lalu gunakan wildcard SSL dan arahkan `*.sewantara.id` ke service `web` melalui reverse proxy. Aktifkan `NUXT_TRUST_PROXY=true` hanya jika proxy terpercaya selalu menimpa forwarded headers.

## Catatan kontrak produksi

PRD belum menyertakan contoh payload Laravel, pilihan final Sanctum vs JWT, kebijakan guest checkout, serta detail provider payment. Implementasi memisahkan seluruh asumsi tersebut ke adapter/feature flag. Sebelum mematikan demo mode, finalkan minimal:

- schema tenant, catalog, availability, quote, booking, payment, dan tracking;
- enum booking/payment dan mapping error;
- auth/session berbasis secure HttpOnly cookie;
- verifier tracking serta signed payment return token;
- idempotency, quote expiry, stock hold, timezone, cancellation, tax/fee/deposit;
- callback/webhook provider yang dikonfirmasi Laravel—bukan dipercaya dari query return URL.
