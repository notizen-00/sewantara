import { createError } from 'h3'
import type {
  AvailabilityDay,
  AvailabilityResponse,
  BlogSnippet,
  BookingRules,
  CatalogQuery,
  CatalogResponse,
  Category,
  ExtraService,
  FaqItem,
  HomePayload,
  ImageAsset,
  Money,
  PaymentMethod,
  Product,
  Promotion,
  Tenant,
  TenantLocation,
  Testimonial,
} from '#shared/types'
import { tenantOrigin, type ResolvedTenantContext } from './tenant'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function demoMoney(amount: number): Money {
  const safeAmount = Math.round(amount)
  return { amount: safeAmount, currency: 'IDR', formatted: rupiah.format(safeAmount) }
}

function image(id: string, url: string, alt: string, width = 1200, height = 800): ImageAsset {
  return { id, url, alt, width, height }
}

export const DEMO_LOCATIONS: TenantLocation[] = [
  {
    id: 'loc-jember-kota',
    name: 'Kamera Jember Studio',
    address: 'Jl. Karimata No. 48, Sumbersari',
    city: 'Jember',
    latitude: -8.1689,
    longitude: 113.7022,
    isPrimary: true,
  },
  {
    id: 'loc-kaliwates',
    name: 'Titik Ambil Kaliwates',
    address: 'Jl. Gajah Mada No. 186, Kaliwates',
    city: 'Jember',
    latitude: -8.1747,
    longitude: 113.6881,
    isPrimary: false,
  },
]

export const DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qris',
    type: 'qris',
    name: 'QRIS',
    description: 'Bayar instan melalui aplikasi bank atau dompet digital.',
    icon: 'solar:qr-code-bold-duotone',
    enabled: true,
    feeLabel: 'Tanpa biaya tambahan',
  },
  {
    id: 'bca-va',
    type: 'virtual_account',
    name: 'BCA Virtual Account',
    description: 'Nomor virtual account dibuat setelah booking dikonfirmasi.',
    icon: 'solar:card-bold-duotone',
    enabled: true,
    feeLabel: 'Biaya admin Rp4.000',
  },
  {
    id: 'cash-pickup',
    type: 'cash',
    name: 'Bayar di Tempat',
    description: 'Tersedia untuk pengambilan langsung dengan verifikasi admin.',
    icon: 'solar:wallet-money-bold-duotone',
    enabled: true,
    feeLabel: 'Perlu konfirmasi',
  },
]

export const DEMO_CATEGORIES: Category[] = [
  {
    id: 'cat-camera',
    slug: 'kamera',
    name: 'Kamera',
    description: 'Mirrorless andal untuk foto, acara, dan produksi komersial.',
    icon: 'solar:camera-bold-duotone',
    image: image('category-camera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=82', 'Kamera mirrorless profesional di atas meja'),
    productCount: 3,
  },
  {
    id: 'cat-lens',
    slug: 'lensa',
    name: 'Lensa',
    description: 'Pilihan focal length tajam untuk portrait hingga dokumentasi.',
    icon: 'solar:camera-rotate-bold-duotone',
    image: image('category-lens', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=900&q=82', 'Deretan lensa kamera profesional'),
    productCount: 1,
  },
  {
    id: 'cat-video',
    slug: 'video',
    name: 'Video & Cinema',
    description: 'Peralatan produksi video yang siap untuk kebutuhan profesional.',
    icon: 'solar:videocamera-record-bold-duotone',
    image: image('category-video', 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=82', 'Kamera video dalam proses produksi'),
    productCount: 1,
  },
  {
    id: 'cat-support',
    slug: 'support',
    name: 'Lighting & Support',
    description: 'Gimbal dan lampu untuk hasil produksi yang stabil dan konsisten.',
    icon: 'solar:lightbulb-bolt-bold-duotone',
    image: image('category-support', 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=900&q=82', 'Peralatan pencahayaan studio'),
    productCount: 2,
  },
  {
    id: 'cat-studio',
    slug: 'studio',
    name: 'Studio',
    description: 'Ruang siap pakai untuk podcast, live streaming, dan foto produk.',
    icon: 'solar:microphone-3-bold-duotone',
    image: image('category-studio', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=82', 'Studio podcast dengan mikrofon dan meja'),
    productCount: 1,
  },
]

const dailyRules: BookingRules = {
  mode: 'daily',
  requiredFields: ['startDate', 'endDate', 'quantity', 'extraServiceIds', 'notes'],
  minAdvanceMinutes: 120,
  maxAdvanceDays: 90,
  minDuration: 1,
  maxDuration: 14,
  durationStep: 1,
  durationUnit: 'day',
  minQuantity: 1,
  maxQuantity: 3,
  pickupBufferMinutes: 30,
  returnBufferMinutes: 30,
}

const hourlyRules: BookingRules = {
  mode: 'hourly',
  requiredFields: ['startDate', 'startTime', 'duration', 'quantity', 'extraServiceIds', 'notes'],
  minAdvanceMinutes: 180,
  maxAdvanceDays: 60,
  minDuration: 2,
  maxDuration: 8,
  durationStep: 1,
  durationUnit: 'hour',
  minQuantity: 1,
  maxQuantity: 1,
  slotIntervalMinutes: 60,
  allowedStartTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  pickupBufferMinutes: 15,
  returnBufferMinutes: 15,
}

const cameraExtras: ExtraService[] = [
  {
    id: 'extra-battery',
    name: 'Baterai Tambahan',
    description: 'Satu baterai penuh tambahan untuk setiap unit kamera.',
    price: demoMoney(35000),
    pricingUnit: 'quantity',
    enabled: true,
  },
  {
    id: 'extra-insurance',
    name: 'Proteksi Peralatan',
    description: 'Perlindungan kerusakan ringan selama periode sewa.',
    price: demoMoney(50000),
    pricingUnit: 'duration',
    enabled: true,
  },
  {
    id: 'extra-delivery',
    name: 'Antar Area Jember Kota',
    description: 'Pengantaran dan pengambilan dalam radius layanan.',
    price: demoMoney(70000),
    pricingUnit: 'booking',
    enabled: true,
  },
]

const studioExtras: ExtraService[] = [
  {
    id: 'extra-operator',
    name: 'Operator Rekaman',
    description: 'Operator membantu setup, monitoring, dan file transfer.',
    price: demoMoney(100000),
    pricingUnit: 'duration',
    enabled: true,
  },
  {
    id: 'extra-editing',
    name: 'Editing Highlight',
    description: 'Video highlight vertikal hingga 60 detik.',
    price: demoMoney(250000),
    pricingUnit: 'booking',
    enabled: true,
  },
]

type ProductSeed = Omit<Product, 'category' | 'locations' | 'availability' | 'seo'> & {
  categorySlug: string
}

function createProduct(seed: ProductSeed): Product {
  const { categorySlug, ...product } = seed
  const category = DEMO_CATEGORIES.find(item => item.slug === categorySlug)
  if (!category) throw new Error(`Unknown demo category: ${categorySlug}`)
  return {
    ...product,
    category: { id: category.id, slug: category.slug, name: category.name },
    locations: DEMO_LOCATIONS,
    availability: { status: 'available', label: 'Tersedia untuk dipesan' },
    seo: {
      title: `Sewa ${product.name} di Jember`,
      description: `${product.shortDescription} Booking online dengan harga transparan di Kamera Jember.`,
      ogImage: product.images[0]?.url ?? '',
    },
  }
}

export const DEMO_PRODUCTS: Product[] = [
  createProduct({
    id: 'prod-sony-a7iv',
    slug: 'sony-a7-iv',
    name: 'Sony A7 IV',
    shortDescription: 'Hybrid full-frame 33 MP untuk foto dan video 4K.',
    description: 'Sony A7 IV menawarkan autofocus cepat, warna natural, dan performa low-light yang stabil. Paket sudah termasuk body, baterai, charger, strap, serta memory card 64 GB.',
    categorySlug: 'kamera',
    images: [
      image('sony-a7iv-main', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1400&q=85', 'Kamera Sony mirrorless tampak depan'),
      image('sony-a7iv-detail', 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=1400&q=85', 'Detail kontrol kamera mirrorless'),
    ],
    price: { base: demoMoney(450000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(1000000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 2 },
    extraServices: cameraExtras,
    rating: { average: 4.9, count: 128 },
    badges: ['Paling diminati', 'Full-frame'],
    specifications: [
      { label: 'Sensor', value: 'Full-frame 33 MP' },
      { label: 'Video', value: '4K 60p 10-bit' },
      { label: 'Mount', value: 'Sony E' },
      { label: 'Berat', value: '658 g' },
    ],
    featured: true,
  }),
  createProduct({
    id: 'prod-canon-r6ii',
    slug: 'canon-eos-r6-mark-ii',
    name: 'Canon EOS R6 Mark II',
    shortDescription: 'Full-frame cepat dengan warna kulit khas Canon.',
    description: 'Pilihan tepat untuk wedding, event, dan portrait. Dual Pixel CMOS AF II menjaga subjek tetap tajam, termasuk pada kondisi cahaya rendah.',
    categorySlug: 'kamera',
    images: [image('canon-r6ii-main', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=85', 'Kamera Canon mirrorless dengan lensa')],
    price: { base: demoMoney(500000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(1000000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 2 },
    extraServices: cameraExtras,
    rating: { average: 4.9, count: 94 },
    badges: ['Wedding favorite'],
    specifications: [
      { label: 'Sensor', value: 'Full-frame 24,2 MP' },
      { label: 'Video', value: '4K 60p oversampled' },
      { label: 'Mount', value: 'Canon RF' },
      { label: 'Stabilisasi', value: 'IBIS hingga 8 stop' },
    ],
    featured: true,
  }),
  createProduct({
    id: 'prod-fuji-xt5',
    slug: 'fujifilm-x-t5',
    name: 'Fujifilm X-T5',
    shortDescription: 'Kamera ringkas 40 MP dengan warna film simulation.',
    description: 'Body ringan untuk perjalanan, prewedding, dan konten lifestyle. Film simulation memberi hasil menarik langsung dari kamera.',
    categorySlug: 'kamera',
    images: [image('fuji-xt5-main', 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1400&q=85', 'Kamera bergaya klasik untuk perjalanan')],
    price: { base: demoMoney(350000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(750000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 2 },
    extraServices: cameraExtras,
    rating: { average: 4.8, count: 73 },
    badges: ['Ringkas', '40 MP'],
    specifications: [
      { label: 'Sensor', value: 'APS-C 40,2 MP' },
      { label: 'Video', value: '6.2K 30p' },
      { label: 'Mount', value: 'Fujifilm X' },
      { label: 'Berat', value: '557 g' },
    ],
    featured: false,
  }),
  createProduct({
    id: 'prod-sony-fx3',
    slug: 'sony-fx3-cinema-line',
    name: 'Sony FX3 Cinema Line',
    shortDescription: 'Cinema camera compact untuk produksi video profesional.',
    description: 'Dynamic range luas, active cooling, dan workflow S-Cinetone membuat FX3 siap untuk iklan, company profile, maupun film pendek.',
    categorySlug: 'video',
    images: [image('sony-fx3-main', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85', 'Kamera cinema dalam setup produksi video')],
    price: { base: demoMoney(750000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(1500000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 1, maxDuration: 10 },
    extraServices: cameraExtras,
    rating: { average: 5, count: 41 },
    badges: ['Cinema Line', '4K 120p'],
    specifications: [
      { label: 'Sensor', value: 'Full-frame 12,1 MP' },
      { label: 'Video', value: '4K 120p 10-bit 4:2:2' },
      { label: 'Profil', value: 'S-Cinetone / S-Log3' },
      { label: 'Cooling', value: 'Active fan' },
    ],
    featured: true,
  }),
  createProduct({
    id: 'prod-sony-2470',
    slug: 'sony-fe-24-70mm-f28-gm-ii',
    name: 'Sony FE 24-70mm F2.8 GM II',
    shortDescription: 'Lensa zoom serbaguna, tajam, dan cepat untuk Sony E.',
    description: 'Rentang focal favorit untuk dokumentasi dan commercial shoot, dengan aperture konstan F2.8 serta autofocus yang cepat.',
    categorySlug: 'lensa',
    images: [image('sony-2470-main', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1400&q=85', 'Lensa zoom profesional di permukaan gelap')],
    price: { base: demoMoney(275000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(500000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 2 },
    extraServices: [cameraExtras[1]!, cameraExtras[2]!],
    rating: { average: 4.9, count: 68 },
    badges: ['G Master'],
    specifications: [
      { label: 'Mount', value: 'Sony E full-frame' },
      { label: 'Aperture', value: 'F2.8 konstan' },
      { label: 'Filter', value: '82 mm' },
      { label: 'Berat', value: '695 g' },
    ],
    featured: true,
  }),
  createProduct({
    id: 'prod-dji-rs3pro',
    slug: 'dji-rs-3-pro',
    name: 'DJI RS 3 Pro',
    shortDescription: 'Gimbal profesional untuk setup kamera hingga 4,5 kg.',
    description: 'Auto axis lock, transmisi nirkabel, dan balancing yang presisi untuk produksi bergerak yang lebih efisien.',
    categorySlug: 'support',
    images: [image('dji-rs3-main', 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1400&q=85', 'Kamera terpasang pada stabilizer produksi')],
    price: { base: demoMoney(250000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(500000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 2 },
    extraServices: [cameraExtras[1]!, cameraExtras[2]!],
    rating: { average: 4.8, count: 52 },
    badges: ['Payload 4,5 kg'],
    specifications: [
      { label: 'Payload', value: 'Maks. 4,5 kg' },
      { label: 'Material', value: 'Carbon fiber' },
      { label: 'Durasi baterai', value: 'Hingga 12 jam' },
      { label: 'Berat', value: '1,5 kg' },
    ],
    featured: false,
  }),
  createProduct({
    id: 'prod-godox-ad600',
    slug: 'godox-ad600-pro',
    name: 'Godox AD600 Pro',
    shortDescription: 'Flash outdoor 600 Ws dengan TTL dan HSS.',
    description: 'Output kuat dan konsisten untuk prewedding outdoor maupun studio. Termasuk trigger sesuai sistem kamera dan light stand.',
    categorySlug: 'support',
    images: [image('godox-ad600-main', 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=1400&q=85', 'Lampu studio profesional menyala')],
    price: { base: demoMoney(180000), unit: 'day', unitLabel: 'hari', deposit: demoMoney(350000) },
    bookingMode: 'daily',
    bookingRules: { ...dailyRules, maxQuantity: 4 },
    extraServices: [cameraExtras[1]!, cameraExtras[2]!],
    rating: { average: 4.7, count: 37 },
    badges: ['600 Ws', 'TTL/HSS'],
    specifications: [
      { label: 'Daya', value: '600 Ws' },
      { label: 'Mode', value: 'TTL / Manual / HSS' },
      { label: 'Recycle', value: '0,01-0,9 detik' },
      { label: 'Kapasitas', value: '±360 flash penuh' },
    ],
    featured: false,
  }),
  createProduct({
    id: 'prod-studio-podcast',
    slug: 'studio-podcast-4-orang',
    name: 'Studio Podcast 4 Orang',
    shortDescription: 'Studio kedap, empat mikrofon, dan multi-camera siap rekam.',
    description: 'Paket studio lengkap untuk podcast hingga empat orang. File hasil rekaman diserahkan setelah sesi, dengan operator opsional.',
    categorySlug: 'studio',
    images: [image('studio-podcast-main', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1400&q=85', 'Studio podcast dengan empat mikrofon')],
    price: { base: demoMoney(225000), unit: 'hour', unitLabel: 'jam' },
    bookingMode: 'hourly',
    bookingRules: hourlyRules,
    extraServices: studioExtras,
    rating: { average: 4.9, count: 86 },
    badges: ['Siap rekam', '4 orang'],
    specifications: [
      { label: 'Kapasitas', value: '4 pembicara' },
      { label: 'Kamera', value: '3 angle Full HD' },
      { label: 'Audio', value: '4 dynamic microphone' },
      { label: 'Output', value: 'File video dan audio mentah' },
    ],
    featured: true,
  }),
]

export function getDemoTenant(context: ResolvedTenantContext): Tenant {
  const baseUrl = tenantOrigin(context)
  return {
    id: 'tenant-kamera-jember',
    slug: context.slug,
    hostname: context.hostname,
    status: 'active',
    businessName: 'Kamera Jember',
    legalName: 'CV Kamera Kreatif Jember',
    tagline: 'Peralatan tepat untuk setiap cerita.',
    description: 'Rental kamera dan perlengkapan produksi tepercaya di Jember dengan booking online, harga transparan, dan dukungan tim berpengalaman.',
    timezone: 'Asia/Jakarta',
    locale: 'id-ID',
    currency: 'IDR',
    theme: {
      primary: '#ea580c',
      primaryForeground: '#ffffff',
      secondary: '#0f172a',
      secondaryForeground: '#ffffff',
      accent: '#fed7aa',
      background: '#fffaf5',
      foreground: '#1c1917',
      muted: '#78716c',
      fontFamily: 'Inter',
      logo: { url: '/favicon.ico', alt: 'Logo Kamera Jember', width: 64, height: 64 },
      favicon: '/favicon.ico',
      darkMode: true,
    },
    contact: {
      phone: '+62 331 487 221',
      whatsapp: '6281234567890',
      email: 'halo@kamerajember.id',
      address: DEMO_LOCATIONS[0]!.address,
      mapUrl: 'https://maps.google.com/?q=-8.1689,113.7022',
      instagram: 'https://instagram.com/kamerajember',
      facebook: 'https://facebook.com/kamerajember',
      tiktok: 'https://tiktok.com/@kamerajember',
    },
    businessHours: [
      { day: 'Senin-Jumat', open: '08:00', close: '20:00', label: '08.00-20.00 WIB' },
      { day: 'Sabtu', open: '08:00', close: '18:00', label: '08.00-18.00 WIB' },
      { day: 'Minggu', open: '09:00', close: '16:00', label: '09.00-16.00 WIB' },
    ],
    locations: DEMO_LOCATIONS,
    paymentMethods: DEMO_PAYMENT_METHODS,
    features: {
      customerLogin: false,
      guestBooking: true,
      wishlist: false,
      reviews: true,
      blog: true,
      darkMode: true,
    },
    seo: {
      title: 'Rental Kamera Jember — Booking Online Mudah',
      titleTemplate: '%s · Kamera Jember',
      description: 'Sewa kamera, lensa, lighting, gimbal, dan studio di Jember. Cek ketersediaan dan booking online dengan harga transparan.',
      canonicalUrl: baseUrl,
      ogImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=85',
      keywords: ['rental kamera jember', 'sewa kamera jember', 'sewa lensa jember', 'studio podcast jember'],
    },
    termsUrl: `${baseUrl}/terms`,
    privacyUrl: `${baseUrl}/privacy`,
    cancellationPolicyUrl: `${baseUrl}/cancellation-policy`,
    configVersion: 'demo-2026.08.1',
  }
}

function demoPromotion(now = new Date()): Promotion {
  const startsAt = new Date(now)
  startsAt.setUTCDate(startsAt.getUTCDate() - 30)
  const endsAt = new Date(now)
  endsAt.setUTCDate(endsAt.getUTCDate() + 60)
  return {
    id: 'promo-jember-10',
    title: 'Diskon 10% untuk Booking Pertama',
    description: 'Mulai produksi pertamamu bersama Kamera Jember dan hemat hingga Rp150.000.',
    badge: 'Khusus pelanggan baru',
    couponCode: 'JEMBER10',
    discountPercent: 10,
    image: image('promo-camera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=85', 'Kamera profesional untuk promo booking pertama'),
    action: { label: 'Lihat katalog', href: '/catalog' },
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  }
}

const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: 'review-ayu',
    customerName: 'Ayu Prameswari',
    rating: 5,
    quote: 'Proses booking jelas, kameranya bersih, dan tim membantu memilih lensa yang pas untuk acara kami.',
    productName: 'Sony A7 IV',
    createdAt: '2026-06-18T10:30:00.000Z',
  },
  {
    id: 'review-fajar',
    customerName: 'Fajar Mahendra',
    rating: 5,
    quote: 'Studio podcast sudah benar-benar siap rekam. Datang, briefing sebentar, lalu langsung produksi.',
    productName: 'Studio Podcast 4 Orang',
    createdAt: '2026-07-02T08:15:00.000Z',
  },
  {
    id: 'review-nadia',
    customerName: 'Nadia Kusuma',
    rating: 5,
    quote: 'Harga transparan sejak awal dan pengambilannya cepat. Hasil Canon R6 II untuk wedding sangat memuaskan.',
    productName: 'Canon EOS R6 Mark II',
    createdAt: '2026-07-21T12:05:00.000Z',
  },
]

const DEMO_FAQS: FaqItem[] = [
  {
    id: 'faq-requirements',
    question: 'Apa syarat untuk menyewa peralatan?',
    answer: 'Siapkan identitas resmi, nomor WhatsApp aktif, dan deposit sesuai produk. Tim kami akan melakukan verifikasi singkat sebelum pengambilan.',
  },
  {
    id: 'faq-pickup',
    question: 'Apakah peralatan bisa diantar?',
    answer: 'Bisa untuk area Jember Kota. Pilih layanan antar saat booking; biaya dan jangkauan akan terlihat pada ringkasan harga.',
  },
  {
    id: 'faq-cancel',
    question: 'Bagaimana jika jadwal perlu diubah?',
    answer: 'Hubungi kami minimal 24 jam sebelum waktu pengambilan. Perubahan mengikuti ketersediaan dan kebijakan pembatalan yang berlaku.',
  },
  {
    id: 'faq-check',
    question: 'Apakah alat sudah diperiksa sebelum disewa?',
    answer: 'Ya. Setiap unit melewati pemeriksaan fungsi, kebersihan, baterai, dan kelengkapan sebelum diserahkan kepada pelanggan.',
  },
]

const DEMO_BLOG: BlogSnippet[] = [
  {
    id: 'blog-camera-event',
    slug: 'memilih-kamera-untuk-dokumentasi-event',
    title: 'Memilih Kamera untuk Dokumentasi Event',
    excerpt: 'Panduan singkat menentukan body, lensa, dan baterai agar momen penting tidak terlewat.',
    image: image('blog-event', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=82', 'Fotografer mendokumentasikan sebuah event'),
    category: 'Panduan',
    publishedAt: '2026-07-28T02:00:00.000Z',
    readingTimeMinutes: 6,
  },
  {
    id: 'blog-video-checklist',
    slug: 'checklist-produksi-video-satu-hari',
    title: 'Checklist Produksi Video Satu Hari',
    excerpt: 'Mulai dari storage, audio, lighting, hingga backup: cek semuanya sebelum kamera mulai merekam.',
    image: image('blog-video', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=82', 'Tim melakukan produksi video'),
    category: 'Tips Produksi',
    publishedAt: '2026-07-14T02:00:00.000Z',
    readingTimeMinutes: 8,
  },
  {
    id: 'blog-podcast',
    slug: 'membuat-podcast-terdengar-profesional',
    title: 'Membuat Podcast Terdengar Profesional',
    excerpt: 'Posisi mikrofon, level suara, dan lingkungan rekaman memberi dampak lebih besar daripada yang sering dibayangkan.',
    image: image('blog-podcast', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=82', 'Mikrofon di dalam studio podcast'),
    category: 'Studio',
    publishedAt: '2026-06-30T02:00:00.000Z',
    readingTimeMinutes: 5,
  },
]

export function getDemoHome(context: ResolvedTenantContext): HomePayload {
  const tenant = getDemoTenant(context)
  return {
    tenant,
    hero: {
      eyebrow: 'Rental kamera tepercaya di Jember',
      title: 'Wujudkan setiap cerita dengan gear yang tepat.',
      description: 'Cek jadwal, pilih perlengkapan, dan booking online dalam beberapa menit. Tim kami siap membantu dari persiapan hingga produksi.',
      primaryAction: { label: 'Jelajahi katalog', href: '/catalog' },
      secondaryAction: { label: 'Chat tim kami', href: `https://wa.me/${tenant.contact.whatsapp}`, external: true },
      image: image('hero-kamera-jember', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=88', 'Kamera profesional siap disewa di Kamera Jember', 1800, 1200),
      trustPoints: ['Unit terawat', 'Harga transparan', 'Dukungan 7 hari'],
    },
    categories: DEMO_CATEGORIES,
    featuredProducts: DEMO_PRODUCTS.filter(product => product.featured),
    promotion: demoPromotion(),
    testimonials: DEMO_TESTIMONIALS,
    faqs: DEMO_FAQS,
    paymentMethods: DEMO_PAYMENT_METHODS,
    blog: DEMO_BLOG,
    stats: { products: 48, bookings: 3200, customers: 1800, averageRating: 4.9 },
  }
}

export function getDemoProduct(slug: string): Product {
  const product = DEMO_PRODUCTS.find(item => item.slug === slug)
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
      message: 'Produk tidak ditemukan.',
      data: { error: { code: 'PRODUCT_NOT_FOUND', message: 'Produk tidak ditemukan.' } },
    })
  }
  return product
}

export function getDemoCatalog(query: CatalogQuery): CatalogResponse {
  const search = query.search?.trim().toLocaleLowerCase('id-ID')
  let products = DEMO_PRODUCTS.filter((product) => {
    const searchMatch = !search
      || `${product.name} ${product.shortDescription} ${product.category.name}`.toLocaleLowerCase('id-ID').includes(search)
    const categoryMatch = !query.category || product.category.slug === query.category
    const locationMatch = !query.locationId || product.locations.some(location => location.id === query.locationId)
    return searchMatch && categoryMatch && locationMatch
  })

  products = [...products].sort((left, right) => {
    switch (query.sort) {
      case 'price_asc': return left.price.base.amount - right.price.base.amount
      case 'price_desc': return right.price.base.amount - left.price.base.amount
      case 'rating': return right.rating.average - left.rating.average || right.rating.count - left.rating.count
      case 'newest': return right.id.localeCompare(left.id)
      default: return Number(right.featured) - Number(left.featured) || right.rating.average - left.rating.average
    }
  })

  const perPage = Math.min(Math.max(query.perPage ?? 6, 1), 24)
  const total = products.length
  const totalPages = Math.max(Math.ceil(total / perPage), 1)
  const page = Math.min(Math.max(query.page ?? 1, 1), totalPages)
  const offset = (page - 1) * perPage

  return {
    products: products.slice(offset, offset + perPage),
    categories: DEMO_CATEGORIES,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    appliedFilters: { ...query, page, perPage },
  }
}

function dateInTimezone(timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

function addUtcDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

function deterministicRemaining(seed: string, maximum: number): number {
  let hash = 0
  for (const character of seed) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0
  return Math.abs(hash) % (maximum + 1)
}

export function getDemoAvailability(
  slug: string,
  from?: string,
  to?: string,
): AvailabilityResponse {
  const product = getDemoProduct(slug)
  const timezone = 'Asia/Jakarta'
  const firstDate = from ?? dateInTimezone(timezone)
  const lastDate = to ?? addUtcDays(firstDate, 13)
  const firstTimestamp = Date.parse(`${firstDate}T00:00:00.000Z`)
  const lastTimestamp = Date.parse(`${lastDate}T00:00:00.000Z`)
  const numberOfDays = Math.floor((lastTimestamp - firstTimestamp) / 86_400_000) + 1

  if (!Number.isFinite(numberOfDays) || numberOfDays < 1 || numberOfDays > 62) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid date range',
      message: 'Rentang tanggal availability harus antara 1 dan 62 hari.',
      data: { error: { code: 'INVALID_DATE_RANGE', message: 'Rentang tanggal tidak valid.' } },
    })
  }

  const days: AvailabilityDay[] = Array.from({ length: numberOfDays }, (_, index) => {
    const date = addUtcDays(firstDate, index)
    const remaining = deterministicRemaining(`${slug}:${date}`, product.bookingRules.maxQuantity)
    const isHourly = product.bookingMode === 'hourly' || product.bookingMode === 'time_slot'
    const slots = isHourly
      ? (product.bookingRules.allowedStartTimes ?? []).map((startTime, slotIndex) => {
          const slotRemaining = deterministicRemaining(`${slug}:${date}:${startTime}`, 1)
          const startHour = Number(startTime.slice(0, 2))
          const duration = product.bookingRules.minDuration
          return {
            id: `${date}-${slotIndex + 1}`,
            startTime,
            endTime: `${String(Math.min(startHour + duration, 23)).padStart(2, '0')}:${startTime.slice(3)}`,
            remaining: slotRemaining,
            available: slotRemaining > 0,
          }
        })
      : []
    const available = isHourly ? slots.some(slot => slot.available) : remaining > 0
    return { date, available, remaining: isHourly ? Number(available) : remaining, slots }
  })

  return {
    productId: product.id,
    productSlug: product.slug,
    timezone,
    from: firstDate,
    to: lastDate,
    days,
    generatedAt: new Date().toISOString(),
  }
}

export function getDemoSitemapEntries(): Array<{ path: string; lastmod?: string; priority: number }> {
  return [
    { path: '/', priority: 1 },
    { path: '/catalog', priority: 0.9 },
    ...DEMO_PRODUCTS.map(product => ({ path: `/catalog/${product.slug}`, priority: 0.8 })),
    { path: '/about', priority: 0.5 },
    { path: '/contact', priority: 0.5 },
    { path: '/blog', priority: 0.6 },
    ...DEMO_BLOG.map(post => ({ path: `/blog/${post.slug}`, lastmod: post.publishedAt, priority: 0.6 })),
  ]
}
