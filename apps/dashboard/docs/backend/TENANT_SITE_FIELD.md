# Requirement Backend — Field Domain Tenant pada `/me`

**Status:** Menunggu implementasi backend (`sewantara-api`)
**Konsumen:** Fitur "Cek situs" pada dashboard mitra (Nuxt)

---

## 1. Masalah

Fitur "Cek situs" menampilkan alamat landing page publik tenant
(`{subdomain}.sewantara.id`) dan menyediakan tombol untuk membukanya.

Saat ini frontend **tidak punya sumber data yang andal** untuk subdomain
tersebut setelah sesi berjalan:

- `POST /api/central/auth/register` mengembalikan `domain.domain` dan
  `domain.url`, tetapi nilai itu hanya ada di memori tepat setelah
  registrasi — hilang begitu halaman di-reload atau user login ulang.
- `GET /api/tenant/{tenant}/me` (`TenantSession`) **tidak mengirim**
  `domain` maupun `subdomain` sama sekali.
- `tenant.slug` tersedia, tetapi tidak dijamin identik dengan subdomain
  yang dipilih user saat registrasi, sehingga tidak aman dijadikan acuan.

## 2. Perubahan yang diminta

Tambahkan salah satu (idealnya keduanya) field berikut pada objek `tenant`
di response `GET /api/tenant/{tenant}/me`:

```json
{
  "success": true,
  "data": {
    "tenant": {
      "id": "...",
      "name": "...",
      "slug": "toko-uji",
      "status": "active",

      "domain": "toko-uji.sewantara.id",
      "subdomain": "toko-uji"
    }
  }
}
```

| Field       | Tipe             | Keterangan                                                   |
| ----------- | ---------------- | ------------------------------------------------------------ |
| `domain`    | `string \| null` | Host lengkap landing page, mis. `"toko-uji.sewantara.id"`.   |
| `subdomain` | `string \| null` | Label subdomain saja tanpa base domain, mis. `"toko-uji"`.   |

Cukup salah satu yang terisi; frontend memprioritaskan `domain` bila ada.

## 3. Perilaku frontend saat ini

Resolver ada di `app/domain/tenantSite.ts` dan sudah menangani ketiga kasus:

1. `tenant.domain` terisi → dipakai apa adanya (skema `https://` ditambahkan,
   `http(s)://` di depan dan trailing slash dibersihkan).
2. `tenant.domain` kosong, `tenant.subdomain` terisi → host disusun menjadi
   `{subdomain}.{NUXT_PUBLIC_TENANT_BASE_DOMAIN}`.
3. Keduanya kosong → jatuh ke `tenant.slug` sebagai cadangan terakhir.
4. Semua kosong → kartu menampilkan status "Alamat situs belum tersedia"
   (tidak menebak URL yang salah).

Karena field-nya opsional pada tipe `Tenant`, **tidak ada breaking change**:
begitu backend mulai mengirim `domain`/`subdomain`, kartu langsung akurat
tanpa perubahan frontend lebih lanjut.

## 4. Konfigurasi frontend terkait

```env
NUXT_PUBLIC_TENANT_BASE_DOMAIN=sewantara.id
```

Default-nya `sewantara.id`. Set ke domain lain untuk staging bila landing
page tenant dilayani dari base domain berbeda.

## 5. Catatan — cek reachability

Kartu ini hanya **menampilkan dan membuka** URL situs; ia tidak memeriksa
apakah situs benar-benar hidup. Pengecekan dari browser akan diblokir CORS
karena situs tenant berada pada origin berbeda.

Bila status hidup/mati memang dibutuhkan, backend perlu menyediakan endpoint
seperti `GET /api/tenant/{tenant}/site/health` yang melakukan pengecekan dari
sisi server dan mengembalikan status beserta waktu pengecekan terakhir.
