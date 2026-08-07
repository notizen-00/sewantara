<script setup lang="ts">
const sections = [
  { title: 'Data yang diproses', paragraphs: ['Saat membuat pesanan, tenant dapat memproses nama, nomor WhatsApp, email, detail jadwal, produk, dan informasi pembayaran yang diperlukan untuk menyelesaikan transaksi.', 'Data kartu atau kredensial pembayaran tidak disimpan oleh website ini dan diproses oleh provider pembayaran yang dipilih tenant.'] },
  { title: 'Tujuan penggunaan', paragraphs: ['Data digunakan untuk membuat dan mengelola pesanan, mengirim notifikasi, memverifikasi pembayaran, menangani dukungan, serta memenuhi kewajiban operasional atau hukum yang berlaku.'] },
  { title: 'Penyimpanan dan keamanan', paragraphs: ['Token autentikasi produksi wajib berada pada cookie aman HttpOnly. Website tidak menaruh PII pelanggan dalam persisted Pinia atau localStorage.', 'Akses terhadap informasi tracking memerlukan kode pesanan dan verifier kontak atau token yang sah.'] },
  { title: 'Hak dan pertanyaan', paragraphs: ['Pelanggan dapat menghubungi tenant melalui halaman kontak untuk menanyakan, memperbarui, atau meminta penanganan data sesuai kebijakan dan hukum yang berlaku.'] },
]
</script>

<template><LegalPage title="Kebijakan privasi" description="Ringkasan cara data pelanggan diproses untuk kebutuhan pemesanan dan layanan." :sections="sections" /></template>
