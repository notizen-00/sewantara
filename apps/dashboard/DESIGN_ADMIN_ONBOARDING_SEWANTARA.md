# Sewantara Admin Dashboard — Design Specification

## 1. Document Information

- **Product:** Sewantara
- **Surface:** Tenant / Mitra Web Dashboard
- **Primary viewport:** Desktop web
- **Primary module:** Tenant onboarding
- **Audience:** Product designer, frontend engineer, backend engineer, QA, and AI coding agent
- **Status:** Draft implementation reference

---

## 2. Design Objective

Onboarding harus membantu owner atau administrator tenant menyiapkan bisnis rental tanpa harus memahami struktur teknis Sewantara.

Alur harus dapat digunakan oleh berbagai jenis usaha, seperti:

- rental mobil atau motor dengan durasi harian;
- rental PlayStation, studio, lapangan, atau ruangan dengan durasi per jam;
- rental kamera, alat pesta, dan perlengkapan dengan jumlah stok;
- bisnis yang memiliki beberapa cabang;
- bisnis yang menerima booking online maupun transaksi langsung;
- bisnis yang menggunakan resource tertentu, misalnya unit kendaraan, meja, room, console, atau staf.

Prinsip utama onboarding:

1. **Progressive disclosure** — hanya tampilkan konfigurasi yang relevan dengan tipe bisnis.
2. **Save as draft** — tenant dapat keluar dan melanjutkan onboarding.
3. **Desktop-first** — form menggunakan ruang horizontal secara efisien.
4. **Non-technical language** — hindari istilah database atau arsitektur.
5. **Configuration preview** — tenant dapat melihat ringkasan sebelum aktivasi.
6. **Editable after onboarding** — seluruh konfigurasi dapat diubah dari menu Settings.

---

## 3. Desktop Layout

### 3.1 Shell

Gunakan layout onboarding khusus, bukan layout dashboard penuh.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sewantara Logo                                      Bantuan   Simpan & keluar │
├───────────────────────┬──────────────────────────────────────────────────────┤
│                       │                                                      │
│ Progress Navigation   │ Main Form Area                                       │
│                       │                                                      │
│ 1. Informasi Usaha    │ Page title                                           │
│ 2. Model Penyewaan    │ Supporting description                              │
│ 3. Cabang             │                                                      │
│ 4. Resource & Unit    │ Form card                                            │
│ 5. Jadwal Operasional │                                                      │
│ 6. Booking            │                                                      │
│ 7. Pembayaran         │                                                      │
│ 8. Tim                │                                                      │
│ 9. Review             │                                                      │
│                       │                                                      │
├───────────────────────┴──────────────────────────────────────────────────────┤
│                                      Kembali              Simpan & Lanjutkan │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Recommended Dimensions

- Minimum supported desktop width: `1024px`
- Optimal width: `1280px–1440px`
- Header height: `64px`
- Left progress panel: `260px–288px`
- Main content max width: `880px`
- Form content max width: `760px`
- Footer action bar height: `72px`
- Main page background: neutral light gray
- Form cards: white surface with subtle border and radius

### 3.3 Sticky Elements

- Header remains sticky.
- Left progress navigation remains sticky below header.
- Bottom action bar remains sticky.
- Main content area scrolls independently when needed.

---

## 4. Onboarding Information Architecture

```text
Onboarding
├── Welcome
├── Business Profile
├── Rental Model
├── Branch Setup
├── Resource & Inventory Setup
├── Operational Schedule
├── Booking Rules
├── Payment Setup
├── Team Setup
├── Public Booking Preview
└── Review & Activation
```

---

## 5. Onboarding Steps

## Step 0 — Welcome

### Purpose

Memberikan gambaran singkat mengenai proses konfigurasi dan estimasi data yang perlu disiapkan.

### Desktop composition

Gunakan two-column hero card:

- kiri: judul, manfaat, CTA;
- kanan: ilustrasi dashboard atau preview booking.

### Content

**Title:**

> Siapkan bisnis rental Anda

**Description:**

> Atur profil usaha, jenis penyewaan, unit, jadwal, dan metode booking agar operasional bisnis dapat langsung berjalan di Sewantara.

### Components

- onboarding illustration;
- checklist informasi yang dibutuhkan;
- primary CTA: `Mulai Pengaturan`;
- secondary CTA: `Lewati dan gunakan konfigurasi dasar`;

### Rules

- Opsi skip hanya diperbolehkan bila sistem memiliki default yang aman.
- Tenant yang skip harus melihat checklist konfigurasi belum lengkap di dashboard.

---

## Step 1 — Informasi Usaha

### Page title

> Ceritakan tentang usaha Anda

### Form sections

#### A. Identitas usaha

- Nama usaha
- Slug tenant
- Logo usaha
- Nomor telepon
- Email bisnis
- Deskripsi singkat

#### B. Kategori usaha

Gunakan selectable cards, bukan dropdown panjang.

Pilihan awal:

- Kendaraan
- Elektronik dan game
- Kamera dan multimedia
- Peralatan pesta
- Ruangan atau venue
- Olahraga
- Alat berat atau proyek
- Lainnya

Setiap card berisi:

- icon;
- nama kategori;
- contoh singkat.

#### C. Alamat utama

- Provinsi
- Kota atau kabupaten
- Kecamatan
- Alamat lengkap
- Kode pos
- Pin lokasi opsional

### Validation

- Nama usaha wajib.
- Kategori usaha wajib.
- Slug harus unik.
- Logo opsional saat onboarding.
- Nomor telepon menggunakan format Indonesia.

---

## Step 2 — Model Penyewaan

### Page title

> Bagaimana pelanggan menyewa produk atau layanan Anda?

### Core interaction

Gunakan multi-select cards. Satu tenant dapat memiliki lebih dari satu model penyewaan.

### Rental model options

#### 1. Per jam

Cocok untuk:

- PlayStation;
- studio;
- ruang meeting;
- lapangan;
- meja billiard.

Konfigurasi lanjutan:

- durasi slot dasar;
- minimum durasi;
- maksimum durasi;
- buffer antar-booking;
- kelipatan penambahan durasi.

#### 2. Per hari

Cocok untuk:

- mobil;
- motor;
- kamera;
- alat pesta.

Konfigurasi lanjutan:

- waktu check-in;
- waktu check-out;
- minimum hari;
- denda keterlambatan;
- tarif akhir pekan opsional.

#### 3. Per malam

Cocok untuk:

- penginapan;
- camping gear bundle;
- campervan.

#### 4. Per sesi

Cocok untuk:

- studio;
- layanan operator;
- paket event;
- paket penggunaan fasilitas.

#### 5. Berdasarkan tanggal dan jumlah

Cocok untuk:

- kursi;
- tenda;
- dekorasi;
- alat makan;
- perlengkapan event.

#### 6. Paket tetap

Cocok untuk produk dengan harga dan durasi yang telah ditentukan.

### Desktop UI pattern

```text
┌──────────────────────────┐ ┌──────────────────────────┐
│ [✓] Sewa per jam         │ │ [ ] Sewa per hari       │
│ PS, studio, lapangan     │ │ Mobil, motor, kamera     │
└──────────────────────────┘ └──────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Pengaturan sewa per jam                                  │
│ Durasi slot [60 menit]  Minimum [1 jam]  Buffer [10 mnt] │
└──────────────────────────────────────────────────────────┘
```

### Important behavior

- Form konfigurasi muncul setelah card dipilih.
- Tenant dapat menentukan model default.
- Produk dapat melakukan override model di level produk.

---

## Step 3 — Cabang

### Page title

> Di mana bisnis Anda beroperasi?

### Initial choice

Radio card:

- `Satu lokasi`
- `Beberapa cabang`
- `Tanpa lokasi fisik tetap`

### Single location

Gunakan alamat dari Step 1 dan izinkan edit.

### Multiple branches

Gunakan data table atau repeatable cards.

Kolom:

- Nama cabang
- Kode cabang
- Kota
- Alamat
- Nomor telepon
- Status
- Cabang utama

Actions:

- Tambah cabang
- Edit
- Hapus
- Jadikan cabang utama

### Branch switching implication

Dashboard setelah onboarding harus memiliki branch switcher di header.

```text
[ Cabang Jember ▼ ]
```

Data berikut harus dapat bersifat branch-scoped:

- inventory;
- resource;
- booking;
- schedule;
- staff assignment;
- pickup location;
- reporting.

---

## Step 4 — Resource dan Unit

### Page title

> Apa yang dapat dipesan atau disewa pelanggan?

### Concept

Pisahkan definisi berikut agar onboarding mendukung banyak model bisnis:

- **Product / Service:** sesuatu yang ditawarkan kepada pelanggan.
- **Resource:** objek yang memiliki jadwal dan tidak boleh double-booked.
- **Inventory Unit:** unit fisik atau jumlah stok.

### Setup mode

Tenant memilih salah satu:

#### A. Resource-based

Cocok untuk:

- PS 1, PS 2, PS 3;
- Room A, Room B;
- Lapangan 1, Lapangan 2;
- Mobil dengan unit tertentu.

Fields:

- Nama resource
- Kode resource
- Jenis resource
- Cabang
- Kapasitas
- Status aktif

#### B. Quantity-based inventory

Cocok untuk:

- 100 kursi;
- 10 tenda;
- 20 kamera tipe tertentu.

Fields:

- Nama item
- SKU
- Total stok
- Stok minimum
- Cabang penyimpanan

#### C. Service-capacity based

Cocok untuk layanan yang ketersediaannya ditentukan oleh staf atau kapasitas harian.

Fields:

- Nama layanan
- Kapasitas per slot
- Staff required
- Durasi default

### Desktop pattern

Gunakan segmented control:

```text
[ Resource terjadwal ] [ Stok berdasarkan jumlah ] [ Kapasitas layanan ]
```

Di bawahnya gunakan editable table dengan drawer untuk input detail.

### Empty state

> Belum ada resource atau unit. Tambahkan minimal satu agar pelanggan dapat membuat booking.

Primary CTA: `Tambah resource pertama`

---

## Step 5 — Jadwal Operasional

### Page title

> Kapan bisnis Anda menerima booking?

### Components

#### Weekly schedule

```text
Senin   [Aktif]  08:00 — 22:00  [+ Tambah jam]
Selasa  [Aktif]  08:00 — 22:00  [+ Tambah jam]
Rabu    [Aktif]  08:00 — 22:00  [+ Tambah jam]
...
```

#### Schedule scope

Tenant memilih jadwal berlaku untuk:

- seluruh bisnis;
- per cabang;
- per resource.

#### Special dates

- Hari libur
- Jam operasional khusus
- Resource maintenance
- Blocked dates

### Rules

- Jadwal global menjadi default.
- Cabang dapat override jadwal global.
- Resource dapat override jadwal cabang.
- Sistem harus mencegah booking di luar availability.

---

## Step 6 — Pengaturan Booking

### Page title

> Atur bagaimana pelanggan melakukan booking

### Sections

#### A. Booking channel

Checkbox cards:

- Booking online melalui halaman publik
- Booking oleh admin dari dashboard
- Booking walk-in
- Booking melalui WhatsApp yang dicatat admin

#### B. Approval mode

Radio cards:

- `Otomatis dikonfirmasi`
- `Perlu persetujuan admin`
- `Terkonfirmasi setelah pembayaran`

#### C. Booking window

- Minimum waktu sebelum booking
- Maksimum hari ke depan
- Same-day booking
- Cut-off time

#### D. Queue behavior

Untuk bisnis seperti rental PS:

- Aktifkan waiting list
- Izinkan pelanggan masuk antrean ketika slot penuh
- Batas jumlah antrean
- Waktu respons pelanggan saat slot tersedia

#### E. Conflict handling

- Tolak otomatis bila resource tidak tersedia
- Tawarkan resource alternatif
- Tawarkan waktu alternatif

#### F. Customer requirements

- Nama
- Nomor WhatsApp
- Email
- Identitas
- Alamat
- Catatan
- Deposit

Gunakan field toggles:

```text
Nomor WhatsApp  [Wajib ▼]
Email           [Opsional ▼]
Identitas       [Tidak digunakan ▼]
```

---

## Step 7 — Harga dan Pembayaran

### Page title

> Tentukan cara pembayaran bisnis Anda

### Payment options

- Tunai
- Transfer bank manual
- QRIS manual
- Payment gateway
- Bayar di tempat
- Deposit atau uang muka

### Pricing configuration

- Harga termasuk pajak atau belum
- Pajak
- Service fee
- Deposit
- Denda keterlambatan
- Cancellation fee

### Deposit strategy

Radio options:

- Tanpa deposit
- Nominal tetap
- Persentase transaksi
- Ditentukan per produk

### Payment status flow

```text
UNPAID → PARTIALLY_PAID → PAID
                    ↘ REFUNDED
```

### Note

Payment gateway dapat ditandai sebagai setup opsional setelah onboarding agar tenant tidak terhambat masuk dashboard.

---

## Step 8 — Tim dan Hak Akses

### Page title

> Siapa yang akan mengelola bisnis ini?

### Default roles

- Owner
- Administrator
- Branch Manager
- Cashier
- Inventory Staff
- Operational Staff
- Driver
- Technician

### Invite form

- Nama
- Email atau nomor telepon
- Role
- Cabang

### Recommended onboarding behavior

- Owner otomatis menjadi anggota pertama.
- Undangan tim bersifat opsional.
- Role dapat diubah setelah onboarding.
- Driver dan staff operasional tetap merupakan tenant user, bukan central platform user.

---

## Step 9 — Preview Halaman Booking

### Page title

> Lihat pengalaman booking pelanggan

### Desktop layout

Gunakan split preview:

```text
┌─────────────────────────────┬──────────────────────────────────────┐
│ Preview settings            │ Browser-like live preview            │
│                             │                                      │
│ Brand color                 │  sewantara.id/tenant-slug            │
│ Logo                        │  Hero, product, date, resource, CTA  │
│ Banner                      │                                      │
│ Contact                     │                                      │
└─────────────────────────────┴──────────────────────────────────────┘
```

### Configurable fields

- Logo
- Cover image
- Brand color
- Short description
- Contact button
- Address visibility
- Booking button label

### Preview modes

- Desktop
- Tablet
- Mobile

---

## Step 10 — Review dan Aktivasi

### Page title

> Periksa kembali pengaturan bisnis Anda

### Summary cards

- Profil usaha
- Model rental
- Cabang
- Resource dan stok
- Jadwal
- Booking
- Pembayaran
- Tim
- Halaman publik

Each card:

- status icon;
- summary;
- edit action;
- warning when incomplete.

### Readiness checklist

Mandatory before activation:

- Nama usaha tersedia
- Minimal satu model rental
- Minimal satu cabang atau lokasi
- Minimal satu resource, inventory item, atau layanan
- Jadwal operasional tersedia
- Booking rule tersedia

Optional:

- Payment gateway
- Team invitation
- Logo
- Public custom domain

### Final CTA

Primary:

> Aktifkan Workspace

Secondary:

> Simpan sebagai draft

After activation redirect to:

```text
/dashboard?onboarding=completed
```

---

## 6. Dashboard After Onboarding

Setelah onboarding selesai, dashboard utama menggunakan struktur berikut:

```text
Sidebar
├── Dashboard
├── Calendar
├── Booking
├── Customers
├── Products & Services
├── Resources
├── Inventory
├── Branches
├── Payments
├── Reports
├── Team
└── Settings
    ├── Business Profile
    ├── Rental Configuration
    ├── Booking Rules
    ├── Operating Hours
    ├── Payment
    ├── Public Booking Page
    └── Subscription
```

### Header

- Branch switcher
- Global search
- Notifications
- Help
- User menu

---

## 7. Component Specification

## 7.1 Step Navigation

States:

- completed;
- current;
- incomplete;
- warning;
- locked, only when dependency is mandatory.

Behavior:

- completed steps can be opened directly;
- incomplete steps may be opened when dependencies are satisfied;
- current step is highlighted;
- show progress percentage at top.

## 7.2 Selectable Card

Use for:

- business category;
- rental model;
- location model;
- booking approval;
- payment methods.

States:

- default;
- hover;
- selected;
- disabled;
- error.

## 7.3 Form Card

- title;
- short description;
- form content;
- optional badge;
- contextual help.

## 7.4 Repeatable Table

Use for:

- branches;
- resources;
- inventory units;
- team members;
- special schedules.

Actions should open a side drawer on desktop, not a full new page.

## 7.5 Sticky Action Bar

Left section:

- autosave status;
- last saved timestamp.

Right section:

- back;
- save draft;
- save and continue.

---

## 8. Form and Interaction Rules

### Autosave

- Trigger after input idle.
- Show `Menyimpan...`, `Tersimpan`, or `Gagal menyimpan`.
- Never remove user input after network failure.

### Validation

- Inline validation below field.
- Validate on blur and submission.
- Scroll to first invalid field.
- Step navigation displays warning when a completed step becomes invalid.

### Confirmation

Require confirmation for:

- deleting a branch;
- deleting a resource with bookings;
- changing rental model when pricing already exists;
- disabling online booking;
- resetting onboarding configuration.

### Unsaved changes

Use browser leave guard only when autosave failed or pending.

---

## 9. Responsive Rules

Although onboarding is desktop-first, support tablet and mobile fallback.

### Tablet

- left progress navigation collapses into horizontal step header;
- form max width becomes full;
- table actions remain in drawer.

### Mobile

- progress becomes `Step X of Y`;
- one-column form;
- cards stack vertically;
- bottom action bar contains primary action and back icon;
- complex resource tables become cards.

---

## 10. Accessibility

- All fields must have visible labels.
- Selected cards must expose checked state.
- Keyboard navigation for cards and step navigation.
- Minimum clickable area `44px`.
- Avoid color-only status communication.
- Error summary uses screen-reader announcement.
- Modal and drawer must trap focus.
- Contrast target follows WCAG AA.

---

## 11. Suggested Design Tokens

```css
:root {
  --font-family-sans: "Inter", "Plus Jakarta Sans", sans-serif;

  --color-primary-50: #eefaf5;
  --color-primary-100: #d7f3e7;
  --color-primary-500: #1f9d6a;
  --color-primary-600: #16845a;
  --color-primary-700: #116a49;

  --color-neutral-0: #ffffff;
  --color-neutral-50: #f8faf9;
  --color-neutral-100: #eef2f0;
  --color-neutral-200: #dde4e0;
  --color-neutral-500: #66736c;
  --color-neutral-700: #34423b;
  --color-neutral-900: #18211d;

  --color-warning-500: #f59e0b;
  --color-danger-500: #dc2626;
  --color-info-500: #2563eb;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --shadow-card: 0 1px 3px rgba(16, 24, 20, 0.08);
}
```

Tokens should be adjusted to match the exact Stitch visual export when screenshots or generated source become available.

---

## 12. Frontend Route Mapping

```text
/onboarding
/onboarding/welcome
/onboarding/business-profile
/onboarding/rental-model
/onboarding/branches
/onboarding/resources
/onboarding/schedule
/onboarding/booking
/onboarding/payment
/onboarding/team
/onboarding/public-page
/onboarding/review
```

Route guard rules:

- authenticated central user required;
- tenant context required after tenant creation;
- redirect completed tenant to dashboard unless `?edit=true`;
- preserve onboarding step after logout or session expiration.

---

## 13. Suggested State Structure

```ts
interface OnboardingState {
  tenantId: string;
  currentStep: string;
  completedSteps: string[];
  skippedSteps: string[];
  completionPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastSavedAt: string | null;

  businessProfile: BusinessProfileDraft;
  rentalModels: RentalModelDraft[];
  branches: BranchDraft[];
  resources: ResourceDraft[];
  inventoryItems: InventoryDraft[];
  schedule: ScheduleDraft;
  bookingRules: BookingRuleDraft;
  paymentSettings: PaymentSettingDraft;
  teamInvites: TeamInviteDraft[];
  publicPage: PublicPageDraft;
}
```

---

## 14. Backend Capability Mapping

| Onboarding section | Main backend domain |
|---|---|
| Business Profile | Tenant Management |
| Rental Model | Rental Configuration |
| Branch | Branch Management |
| Resource | Resource Management |
| Quantity Inventory | Inventory Management |
| Schedule | Availability Management |
| Booking Rule | Booking Management |
| Payment | Payment Configuration |
| Team | Tenant User and Authorization |
| Public Page | Booking Website Configuration |
| Review | Onboarding Orchestrator |

### Recommended save approach

Each step should have its own idempotent endpoint.

```text
PUT /api/tenant/onboarding/business-profile
PUT /api/tenant/onboarding/rental-models
PUT /api/tenant/onboarding/branches
PUT /api/tenant/onboarding/resources
PUT /api/tenant/onboarding/schedule
PUT /api/tenant/onboarding/booking-rules
PUT /api/tenant/onboarding/payment-settings
PUT /api/tenant/onboarding/team
PUT /api/tenant/onboarding/public-page
POST /api/tenant/onboarding/complete
```

Provide a status endpoint:

```text
GET /api/tenant/onboarding
```

The response should include:

- current step;
- completion percentage;
- validation warnings;
- saved draft data;
- activation readiness.

---

## 15. Empty, Loading, and Error States

### Loading

- skeleton for form sections;
- disable submit while initial data loads;
- do not use full-page spinner after the shell is visible.

### Empty

Every repeatable section must contain:

- simple illustration or icon;
- explanation;
- one clear CTA.

### Error

#### Network error

> Perubahan belum tersimpan. Periksa koneksi dan coba lagi.

Actions:

- Coba lagi
- Salin data form, when appropriate

#### Conflict error

> Data telah diperbarui dari sesi lain. Muat ulang untuk melihat perubahan terbaru.

---

## 16. Analytics Events

```text
onboarding_started
onboarding_step_viewed
onboarding_step_saved
onboarding_step_skipped
onboarding_validation_failed
onboarding_resource_added
onboarding_branch_added
onboarding_preview_opened
onboarding_completed
onboarding_abandoned
```

Recommended properties:

- tenant_id;
- business_category;
- selected_rental_models;
- branch_count;
- resource_count;
- step_name;
- completion_percentage;
- error_type.

---

## 17. Acceptance Criteria

1. Tenant dapat menyelesaikan onboarding dari desktop tanpa membuka halaman Settings lain.
2. Tenant dapat memilih lebih dari satu model rental.
3. Rental per jam mendukung slot, buffer, availability, dan waiting list.
4. Rental harian mendukung check-in, check-out, dan denda keterlambatan.
5. Tenant dapat memilih satu atau beberapa cabang.
6. Resource tidak dapat mengalami double-booking pada waktu yang sama.
7. Inventory berbasis jumlah tidak dapat dipesan melebihi stok tersedia.
8. Seluruh step dapat disimpan sebagai draft.
9. Tenant dapat melanjutkan dari step terakhir.
10. Sistem menampilkan review dan warning sebelum aktivasi.
11. Payment gateway tidak wajib untuk menyelesaikan onboarding.
12. Setelah aktivasi, seluruh konfigurasi tersedia di Settings.
13. Branch switcher muncul untuk tenant multi-cabang.
14. Tampilan optimal pada desktop `1280px` dan tetap usable pada `1024px`.
15. Semua pesan error muncul di dekat field yang bermasalah.

---

## 18. Implementation Priority

### MVP

- Welcome
- Business Profile
- Rental Model
- Single or multi-branch
- Resource or quantity inventory
- Weekly schedule
- Booking rules
- Manual payment methods
- Review and activation

### Phase 2

- Waiting list
- Resource alternatives
- Staff-capacity scheduling
- Payment gateway connection
- Live booking page preview
- Team invitation

### Phase 3

- AI-assisted onboarding
- Import catalog from spreadsheet
- Suggested pricing
- Suggested operating hours
- Automated business category detection
- Marketplace publishing

---

## 19. Notes for AI Coding Agents

- Do not hard-code onboarding only for vehicle rental.
- Use configuration-driven fields based on selected rental model.
- Keep product, resource, and inventory concepts separate.
- Every query and mutation after tenant initialization must be tenant-scoped.
- Branch filtering must be explicit for branch-scoped modules.
- Use server-side validation as the source of truth.
- Preserve drafts even if a step is incomplete.
- Avoid one giant onboarding payload; save per step.
- Keep onboarding versioned so future fields do not break completed tenants.

Suggested field:

```text
onboarding_version = 1
```

