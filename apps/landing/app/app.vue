<script setup lang="ts">
import { ref } from "vue";

const APP_URL = "https://app.sewantara.id";

const isMenuOpen = ref(false);
const yearly = ref(true);

let revealObserver: IntersectionObserver | null = null;
function getRevealObserver() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );
  }
  return revealObserver;
}

const vReveal = {
  mounted(el: HTMLElement, binding: { value?: number }) {
    el.classList.add("reveal");
    if (typeof binding.value === "number") {
      el.style.transitionDelay = `${binding.value}ms`;
    }
    getRevealObserver().observe(el);
  },
  unmounted(el: HTMLElement) {
    revealObserver?.unobserve(el);
  },
};

const iconPaths: Record<string, string> = {
  verified:
    '<path d="m9 12 2 2 4-4"/><path d="M12 2.5 15 4l3.3.5.5 3.3 1.5 3-1.5 3-.5 3.3-3.3.5-3 1.5-3-1.5-3.3-.5-.5-3.3-1.5-3 1.5-3 .5-3.3L9 4l3-1.5Z"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4"/>',
  box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7 8 4 8-4v10l-8 4-8-4Z"/><path d="M12 11v10"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  bolt: '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  trend: '<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
  inventory:
    '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V5a3 3 0 0 1 6 0v3M9 14l2 2 4-4"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  payment:
    '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h3"/>',
  staff:
    '<circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M4 10H2M22 10h-2M5 4 3.5 2.5M19 4l1.5-1.5"/>',
  branch:
    '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3h12V9M12 12v3"/>',
  report:
    '<path d="M6 2h9l4 4v16H6Z"/><path d="M14 2v5h5M9 17v-3M13 17v-6M17 17v-8"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  qr: '<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><path d="M15 15h2v2h-2zM19 15h2v6h-2M15 19h2v2h-2"/>',
  layers:
    '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wallet:
    '<path d="M3 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/><path d="M3 8V5a2 2 0 0 1 2-2h12v5M16 13h5"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M5 12h14M7 17h10M6 17v2M18 17v2"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/>',
  gamepad:
    '<path d="M8 6h8a6 6 0 0 1 5.7 7.9l-1 3a2.8 2.8 0 0 1-4.6 1.1l-1.5-1.4H9.4L7.9 18a2.8 2.8 0 0 1-4.6-1.1l-1-3A6 6 0 0 1 8 6Z"/><path d="M7 10v4M5 12h4M16 11h.01M18 13h.01"/>',
  camera:
    '<path d="M4 7h4l1.5-2h5L16 7h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>',
  building:
    '<path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h4M8 11h4M8 15h4M9 21v-3h2v3"/>',
  furniture:
    '<path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 19v2M19 19v2"/><path d="M4 10a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-2-2Z"/>',
  tent: '<path d="m3 20 9-16 9 16H3Z"/><path d="m12 4 3 16M9 20l3-6 3 6"/>',
  utensils:
    '<path d="M7 3v7M4 3v4a3 3 0 0 0 6 0V3M7 10v11M17 3v18M17 3c3 2 4 5 4 8h-4"/>',
  shirt:
    '<path d="m8 4-5 3 2 5 3-1v10h8V11l3 1 2-5-5-3a4 4 0 0 1-8 0Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
};

const problems = [
  {
    icon: "calendar",
    title: "Booking Bentrok",
    text: "Satu barang disewa dua orang di waktu yang sama? Reputasi bisnis Anda taruhannya.",
  },
  {
    icon: "box",
    title: "Sulit Cek Ketersediaan",
    text: "Harus bolak-balik cek gudang atau buku catatan hanya untuk menjawab pelanggan.",
  },
  {
    icon: "chart",
    title: "Laporan Tidak Akurat",
    text: "Pengeluaran atau denda lupa tercatat, membuat uang menguap tanpa jejak.",
  },
];

const benefits = [
  {
    icon: "bolt",
    title: "Otomatisasi Alur Kerja",
    text: "Invoice, pengingat denda, hingga notifikasi ketersediaan dikirim otomatis.",
  },
  {
    icon: "shield",
    title: "Keamanan Data Terjamin",
    text: "Data pelanggan dan riwayat transaksi aman tersimpan di cloud terenkripsi.",
  },
  {
    icon: "trend",
    title: "Keputusan Berbasis Data",
    text: "Ketahui barang terlaris dan periode tersibuk bisnis Anda secara akurat.",
  },
];

const features = [
  {
    icon: "inventory",
    title: "Manajemen Inventaris",
    text: "Pantau status barang secara real-time di semua cabang.",
  },
  {
    icon: "calendar",
    title: "Smart Booking",
    text: "Kalender interaktif untuk jadwal sewa yang bebas bentrok.",
  },
  {
    icon: "users",
    title: "Database Pelanggan",
    text: "Simpan riwayat sewa dan blacklist pelanggan bermasalah.",
  },
  {
    icon: "payment",
    title: "Integrasi Pembayaran",
    text: "Terima pembayaran melalui transfer, e-wallet, atau VA.",
  },
  {
    icon: "staff",
    title: "Manajemen Staf",
    text: "Atur hak akses staf sesuai peran untuk keamanan operasional.",
  },
  {
    icon: "branch",
    title: "Dukungan Multi-Cabang",
    text: "Kelola seluruh lokasi rental melalui satu akun terpusat.",
  },
  {
    icon: "report",
    title: "Laporan Keuangan",
    text: "Laporan laba rugi instan yang dapat diunduh ke Excel/PDF.",
  },
  {
    icon: "bell",
    title: "Notifikasi Otomatis",
    text: "Pengingat WhatsApp otomatis untuk pengembalian barang.",
  },
];

const plans = [
  {
    name: "Starter",
    monthly: 99,
    description: "Cocok untuk bisnis rental yang baru memulai.",
    features: [
      "Maks. 50 item",
      "1 akun staf",
      "Website booking dasar",
      "Laporan keuangan",
    ],
    cta: "Pilih Starter",
  },
  {
    name: "Growth",
    monthly: 249,
    description: "Paket ideal untuk bisnis yang sedang berkembang.",
    features: [
      "Maks. 500 item",
      "5 akun staf",
      "Website booking premium",
      "Integrasi pembayaran VA",
    ],
    cta: "Pilih Growth",
    popular: true,
  },
  {
    name: "Business",
    monthly: 499,
    description: "Solusi lengkap untuk skala perusahaan.",
    features: [
      "Item tanpa batas",
      "Staf tanpa batas",
      "Multi-cabang terintegrasi",
      "Domain & branding kustom",
    ],
    cta: "Hubungi Sales",
  },
];

const faqs = [
  {
    q: "Apakah ada biaya tambahan per transaksi?",
    a: "Tidak ada biaya tersembunyi. Sewantara menggunakan sistem berlangganan bulanan. Biaya transaksi hanya berlaku bila Anda memakai payment gateway dari mitra pembayaran.",
  },
  {
    q: "Dapatkah saya migrasi data rental dari Excel?",
    a: "Bisa. Kami menyediakan template impor agar data inventaris dan pelanggan Anda dapat dipindahkan ke Sewantara dengan lebih cepat.",
  },
  {
    q: "Apakah Sewantara cocok untuk rental mobil dan alat?",
    a: "Ya. Sewantara mendukung inventaris berserial seperti mobil, motor, kamera, dan alat berat, serta inventaris berbasis jumlah seperti kursi, tenda, dan kostum.",
  },
  {
    q: "Apakah data pelanggan saya aman?",
    a: "Data bisnis disimpan secara aman dengan koneksi terenkripsi, kontrol akses staf, dan pencadangan berkala.",
  },
];

const priceFor = (monthly: number) =>
  yearly ? Math.round(monthly * 0.8) : monthly;

useSeoMeta({
  title: "Sewantara — Aplikasi Manajemen Rental Indonesia",
  description:
    "Sewantara adalah aplikasi manajemen rental Indonesia untuk mengelola inventaris, booking, pembayaran, pelanggan, laporan keuangan, dan multi-cabang dalam satu dashboard.",
  ogTitle: "Sewantara — Kelola Bisnis Rental Lebih Rapi",
  ogDescription:
    "Aplikasi manajemen rental all-in-one untuk inventaris, booking, pembayaran, laporan, dan multi-cabang.",
  ogType: "website",
  ogLocale: "id_ID",
  twitterCard: "summary_large_image",
  robots: "index, follow, max-image-preview:large",
});

useHead({
  htmlAttrs: { lang: "id" },
  link: [
    { rel: "canonical", href: "https://sewantara.id/" },
    { rel: "icon", type: "image/x-icon", href: "/favicon_io/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon_io/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon_io/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon_io/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/favicon_io/site.webmanifest" },
  ],
  meta: [
    {
      name: "keywords",
      content:
        "manajemen rental, aplikasi rental Indonesia, software rental, sistem booking rental, aplikasi sewa barang, manajemen inventaris rental, rental mobil, rental motor, rental alat, SaaS rental Indonesia",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Sewantara",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Aplikasi manajemen rental Indonesia untuk inventaris, booking, pembayaran, pelanggan, laporan, dan multi-cabang.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice: "99000",
          highPrice: "499000",
        },
        provider: {
          "@type": "Organization",
          name: "Sewantara",
          url: "https://sewantara.id/",
        },
      }),
    },
  ],
});
</script>

<template>
  <div class="site-shell">
    <header class="navbar">
      <div class="container nav-inner">
        <a class="brand" href="#beranda" aria-label="Sewantara - Beranda">
          <NuxtImg
            class="brand-icon"
            src="/favicon_io/android-chrome-192x192.png"
            alt=""
            width="34"
            height="34"
            format="webp"
            quality="80"
            densities="x1 x2"
            loading="eager"
          />
          <span>Sewantara</span>
        </a>
        <nav class="desktop-nav" aria-label="Navigasi utama">
          <a href="#fitur">Fitur</a>
          <a href="#manfaat">Manfaat</a>
          <a href="#solusi">Solusi</a>
          <a href="#harga">Harga</a>
        </nav>
        <div class="nav-actions">
          <a class="login-link" :href="APP_URL">Masuk</a>
          <a class="button button-primary button-small" :href="APP_URL"
            >Mulai Gratis</a
          >
          <button
            class="menu-button"
            :aria-expanded="isMenuOpen"
            aria-label="Buka menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              v-html="iconPaths[isMenuOpen ? 'close' : 'menu']"
            />
          </button>
        </div>
      </div>
      <nav v-if="isMenuOpen" class="mobile-nav" aria-label="Navigasi mobile">
        <a href="#fitur" @click="isMenuOpen = false">Fitur</a>
        <a href="#manfaat" @click="isMenuOpen = false">Manfaat</a>
        <a href="#solusi" @click="isMenuOpen = false">Solusi</a>
        <a href="#harga" @click="isMenuOpen = false">Harga</a>
      </nav>
    </header>

    <main>
      <section id="beranda" class="hero">
        <div class="hero-glow hero-glow-one" />
        <div class="hero-glow hero-glow-two" />
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                v-html="iconPaths.verified"
              />
              Platform Manajemen Rental All-in-One
            </div>
            <h1>
              Kelola Bisnis Rental Lebih <span>Rapi, Cepat,</span> dan
              <span>Profesional.</span>
            </h1>
            <p class="hero-lead">
              Satu dashboard untuk semua kebutuhan. Dari inventaris hingga
              penagihan otomatis, Sewantara dirancang khusus untuk pertumbuhan
              bisnis rental di Indonesia.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" :href="APP_URL">Mulai Gratis</a>
              <a class="button button-secondary" href="#fitur">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  v-html="iconPaths.play"
                />
                Lihat Cara Kerjanya
              </a>
            </div>
            <div class="social-proof">
              <div class="avatar-stack" aria-hidden="true"><i /><i /><i /></div>
              <p>
                <strong>500+</strong> pemilik bisnis rental berkembang bersama
                Sewantara
              </p>
            </div>
          </div>

          <div
            class="dashboard-wrap"
            aria-label="Ilustrasi ekosistem aplikasi rental Sewantara"
          >
            <div class="hero-banner-frame">
              <NuxtPicture
                src="/images/banner.png"
                alt="Ekosistem manajemen rental Sewantara untuk kendaraan, kamera, perlengkapan camping, dan berbagai aset sewa"
                width="1308"
                height="768"
                sizes="100vw md:720px lg:640px"
                format="avif,webp"
                legacy-format="png"
                quality="78"
                :preload="{ fetchPriority: 'high' }"
                :img-attrs="{
                  class: 'hero-banner',
                  loading: 'eager',
                  decoding: 'async',
                  fetchpriority: 'high',
                }"
              />
            </div>
            <div class="dashboard-window">
              <div class="window-bar">
                <div class="window-dots"><i /><i /><i /></div>
                <span>app.sewantara.id</span>
              </div>
              <div class="dashboard-head">
                <div>
                  <small>Ringkasan bisnis</small>
                  <strong>Selamat pagi, Andi!</strong>
                </div>
                <div class="date-pill">31 Juli 2026</div>
              </div>
              <div class="metric-grid">
                <article class="metric metric-accent">
                  <span>Pendapatan hari ini</span>
                  <strong>Rp4.500.000</strong>
                  <small>↗ 12,5% bulan ini</small>
                </article>
                <article class="metric">
                  <span>Booking aktif</span>
                  <strong>12 Unit</strong>
                  <small>4 kembali hari ini</small>
                </article>
                <article class="metric">
                  <span>Stok tersedia</span>
                  <strong>85%</strong>
                  <small>128 dari 150 item</small>
                </article>
              </div>
              <div class="dashboard-panels">
                <article class="chart-panel">
                  <div class="panel-title">
                    <strong>Grafik Mingguan</strong><span>7 hari</span>
                  </div>
                  <div
                    class="bar-chart"
                    aria-label="Grafik pendapatan mingguan"
                  >
                    <i style="--height: 38%" /><i style="--height: 58%" /><i
                      style="--height: 88%"
                    /><i style="--height: 51%" /><i style="--height: 72%" /><i
                      style="--height: 64%"
                    /><i style="--height: 94%" />
                  </div>
                  <div class="chart-labels">
                    <span>Sen</span><span>Sel</span><span>Rab</span
                    ><span>Kam</span><span>Jum</span><span>Sab</span
                    ><span>Min</span>
                  </div>
                </article>
                <article class="calendar-panel">
                  <div class="panel-title">
                    <strong>Kalender Booking</strong><span>Juli</span>
                  </div>
                  <div class="calendar-days">
                    <b>S</b><b>S</b><b>R</b><b>K</b><b>J</b><b>S</b><b>M</b
                    ><span>28</span><span>29</span><span>30</span><span>1</span
                    ><span class="booked">2</span><span>3</span><span>4</span
                    ><span>5</span><span>6</span><span>7</span
                    ><span class="soft-booked">8</span
                    ><span class="soft-booked">9</span><span>10</span
                    ><span>11</span>
                  </div>
                  <div class="calendar-note"><i /> 3 jadwal hari ini</div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="masalah" class="section problems-section">
        <div class="container">
          <div v-reveal class="section-heading centered">
            <span class="section-kicker">TANTANGAN BISNIS RENTAL</span>
            <h2>Masih Mengelola Rental dengan Cara Manual?</h2>
            <p>
              Hentikan kerugian akibat manajemen yang berantakan dan data yang
              tersebar.
            </p>
          </div>
          <div class="three-grid">
            <article
              v-for="(item, index) in problems"
              :key="item.title"
              v-reveal="index * 90"
              class="problem-card"
            >
              <span class="icon-box"
                ><svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  v-html="iconPaths[item.icon]"
              /></span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="manfaat" class="section benefits-section">
        <div class="container benefits-grid">
          <div v-reveal class="operations-visual">
            <div class="visual-top">
              <span class="visual-brand"><i>S</i> Sewantara Ops</span>
              <span class="online-pill"><i /> Online</span>
            </div>
            <div class="warehouse-illustration">
              <div class="shelf shelf-one"><i /><i /><i /></div>
              <div class="shelf shelf-two"><i /><i /><i /></div>
              <div class="operator">
                <div class="operator-head" />
                <div class="operator-body" />
                <div class="operator-tablet">S</div>
              </div>
            </div>
            <blockquote>
              “Sejak pakai Sewantara, saya bisa mengurus 3 cabang sekaligus dari
              rumah. Benar-benar menghemat waktu!”<cite
                >— Andi, Owner SewaMobil Pro</cite
              >
            </blockquote>
          </div>
          <div v-reveal="90" class="benefits-copy">
            <span class="section-kicker">OPERASIONAL LEBIH RINGAN</span>
            <h2>
              Lebih Sedikit Pekerjaan Manual, Lebih Banyak Waktu Mengembangkan
              Bisnis
            </h2>
            <p class="section-intro">
              Biarkan sistem menangani pekerjaan berulang, agar tim Anda fokus
              memberikan layanan terbaik kepada pelanggan.
            </p>
            <div class="benefit-list">
              <article
                v-for="(item, index) in benefits"
                :key="item.title"
                v-reveal="120 + index * 90"
              >
                <span class="icon-circle"
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths[item.icon]"
                /></span>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.text }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" class="section features-section">
        <div class="container">
          <div v-reveal class="section-heading centered">
            <span class="section-kicker">FITUR LENGKAP</span>
            <h2>Semua Alat untuk Bisnis Rental yang Skalabel</h2>
            <p>
              Apa pun yang Anda rentalkan, Sewantara punya alat untuk
              menyederhanakan operasionalnya.
            </p>
          </div>
          <div class="feature-grid">
            <article
              v-for="(item, index) in features"
              :key="item.title"
              v-reveal="(index % 4) * 80"
              class="feature-card"
            >
              <span class="feature-icon"
                ><svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  v-html="iconPaths[item.icon]"
              /></span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              <a href="#harga" :aria-label="`Pelajari ${item.title}`"
                >Pelajari <span>→</span></a
              >
            </article>
          </div>
        </div>
      </section>

      <section id="solusi" class="section inventory-section">
        <div class="container">
          <div v-reveal class="section-heading centered compact">
            <span class="section-kicker">FLEKSIBEL UNTUK SEMUA USAHA</span>
            <h2>Dukungan Berbagai Model Inventaris</h2>
          </div>
          <div class="inventory-grid">
            <article v-reveal class="inventory-card">
              <div class="inventory-title">
                <span class="icon-box"
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.qr"
                /></span>
                <div>
                  <small>UNIT DENGAN ID UNIK</small>
                  <h3>Inventaris Berserial</h3>
                </div>
              </div>
              <p>
                Setiap unit memiliki identitas unik seperti plat nomor, serial
                number, atau IMEI. Cocok untuk:
              </p>
              <div class="inventory-tags">
                <span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.car"
                  />Mobil / Motor</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.gamepad"
                  />PlayStation</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.camera"
                  />Kamera</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.building"
                  />Apartemen</span
                >
              </div>
            </article>
            <article v-reveal="110" class="inventory-card">
              <div class="inventory-title">
                <span class="icon-box"
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.layers"
                /></span>
                <div>
                  <small>STOK BERDASARKAN JUMLAH</small>
                  <h3>Inventaris Kuantitas</h3>
                </div>
              </div>
              <p>
                Dikelola berdasarkan jumlah stok massal tanpa identitas unik per
                unit. Cocok untuk:
              </p>
              <div class="inventory-tags">
                <span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.furniture"
                  />Kursi / Meja</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.tent"
                  />Tenda / Alat Camp</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.utensils"
                  />Alat Catering</span
                ><span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.shirt"
                  />Baju / Kostum</span
                >
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="digital-section">
        <div class="digital-shape" />
        <div class="container digital-grid">
          <div v-reveal class="digital-copy">
            <span class="light-kicker">WEBSITE RENTAL SIAP PAKAI</span>
            <h2>Go Digital dengan Website Booking & Payment Otomatis</h2>
            <p>
              Tingkatkan kredibilitas bisnis Anda. Pelanggan dapat memeriksa
              ketersediaan dan booking langsung melalui website profesional
              dengan domain kustom.
            </p>
            <div class="domain-box"><i /> namarental.sewantara.id</div>
            <div class="digital-benefits">
              <article>
                <span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.clock"
                /></span>
                <div>
                  <h3>Pesan Online 24/7</h3>
                  <p>Pelanggan booking kapan saja tanpa chat manual.</p>
                </div>
              </article>
              <article>
                <span
                  ><svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.wallet"
                /></span>
                <div>
                  <h3>Payment Gateway Terintegrasi</h3>
                  <p>Konfirmasi transfer, e-wallet, atau VA secara instan.</p>
                </div>
              </article>
            </div>
            <div class="digital-checks">
              <span>✓ SEO Optimized</span><span>✓ Mobile Friendly</span
              ><span>✓ Direct WhatsApp</span>
            </div>
          </div>
          <div v-reveal="120" class="storefront">
            <div class="store-browser">
              <i /><i /><i /><span>sewamobilku.id</span>
            </div>
            <div class="store-nav">
              <strong>SewaMobilku</strong>
              <div><i /><i /><button>Booking</button></div>
            </div>
            <div class="store-hero">
              <small>RENTAL TERPERCAYA</small
              ><strong>Perjalanan nyaman<br />dimulai di sini.</strong
              ><button>Lihat Kendaraan</button>
            </div>
            <div class="store-cards">
              <article>
                <div class="car-shape">◢</div>
                <b>Toyota Avanza</b><span>Rp350.000 / hari</span>
              </article>
              <article>
                <div class="car-shape">◢</div>
                <b>Honda Brio</b><span>Rp300.000 / hari</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="harga" class="section pricing-section">
        <div class="container">
          <div v-reveal class="section-heading centered compact">
            <span class="section-kicker">HARGA TRANSPARAN</span>
            <h2>Pilih Paket Sesuai Kebutuhan</h2>
            <p>
              Coba gratis tanpa kartu kredit. Upgrade kapan saja saat bisnis
              Anda bertumbuh.
            </p>
          </div>
          <div
            v-reveal="80"
            class="billing-toggle"
            role="group"
            aria-label="Periode pembayaran"
          >
            <button :class="{ active: !yearly }" @click="yearly = false">
              Bulanan
            </button>
            <button :class="{ active: yearly }" @click="yearly = true">
              Tahunan <span>Hemat 20%</span>
            </button>
          </div>
          <div class="pricing-grid">
            <article
              v-for="(plan, index) in plans"
              :key="plan.name"
              v-reveal="120 + index * 90"
              class="price-card"
              :class="{ popular: plan.popular }"
            >
              <span v-if="plan.popular" class="popular-badge"
                >PALING POPULER</span
              >
              <h3>{{ plan.name }}</h3>
              <div class="price">
                <span>Rp</span><strong>{{ priceFor(plan.monthly) }}rb</strong
                ><small>/bulan</small>
              </div>
              <p>{{ plan.description }}</p>
              <ul>
                <li v-for="feature in plan.features" :key="feature">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    v-html="iconPaths.check"
                  />{{ feature }}
                </li>
              </ul>
              <a
                class="button"
                :class="plan.popular ? 'button-primary' : 'button-outline'"
                href="#daftar"
                >{{ plan.cta }}</a
              >
              <small v-if="yearly" class="billing-note"
                >Ditagih tahunan · hemat 20%</small
              >
            </article>
          </div>
        </div>
      </section>

      <section id="faq" class="section faq-section">
        <div class="container faq-container">
          <div v-reveal class="section-heading centered compact">
            <span class="section-kicker">BANTUAN</span>
            <h2>Pertanyaan Umum</h2>
          </div>
          <div class="faq-list">
            <details
              v-for="(faq, index) in faqs"
              :key="faq.q"
              v-reveal="index * 70"
              :open="index === 0"
            >
              <summary>{{ faq.q }}<span>+</span></summary>
              <p>{{ faq.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <section id="daftar" class="final-cta">
        <div class="cta-orb cta-orb-one" />
        <div class="cta-orb cta-orb-two" />
        <div v-reveal class="container">
          <span class="light-kicker">MULAI HARI INI</span>
          <h2>Siap Membuat Bisnis Rental Anda Lebih Terorganisir?</h2>
          <p>
            Mulai perjalanan efisiensi Anda hari ini. Tidak perlu kartu kredit
            untuk mencoba.
          </p>
          <div class="cta-actions">
            <a
              class="button button-primary"
              :href="APP_URL"
              >Mulai Gratis Sekarang
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                v-html="iconPaths.arrow" /></a
            ><a
              class="button button-dark-outline"
              href="mailto:halo@sewantara.id?subject=Jadwalkan%20Demo%20Sewantara"
              >Jadwalkan Demo</a
            >
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a href="#beranda" aria-label="Sewantara - Beranda">
            <NuxtImg
              class="footer-logo"
              src="/sewantara-logo.png"
              alt="Sewantara"
              width="210"
              height="120"
              sizes="150px"
              format="webp"
              quality="80"
              densities="x1 x2"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p>
            Aplikasi manajemen bisnis rental Indonesia untuk membantu UMKM
            hingga perusahaan mengelola aset dengan lebih baik.
          </p>
        </div>
        <div>
          <h3>Produk</h3>
          <a href="#fitur">Fitur</a><a href="#harga">Harga</a
          ><a href="#solusi">Solusi</a>
        </div>
        <div>
          <h3>Perusahaan</h3>
          <a href="#beranda">Tentang Kami</a
          ><a href="mailto:halo@sewantara.id">Karier</a><a href="#faq">Blog</a>
        </div>
        <div>
          <h3>Bantuan</h3>
          <a href="#faq">Pusat Bantuan</a><a href="#faq">FAQ</a
          ><a href="mailto:halo@sewantara.id">Kontak</a>
        </div>
        <div>
          <h3>Legal</h3>
          <a href="#beranda">Privasi</a
          ><a href="#beranda">Syarat & Ketentuan</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© {{ new Date().getFullYear() }} Sewantara. Hak cipta dilindungi.</p>
        <p>Dibuat untuk kemajuan bisnis rental Indonesia.</p>
      </div>
    </footer>
  </div>
</template>
