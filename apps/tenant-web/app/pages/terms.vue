<script setup lang="ts">
const sections = [
  { title: 'Penggunaan layanan', paragraphs: ['Pelanggan bertanggung jawab memberikan informasi yang benar, memilih jadwal yang sesuai, dan memeriksa kembali ringkasan sebelum mengonfirmasi pesanan.', 'Ketersediaan dan harga final ditetapkan pada quote server yang memiliki batas waktu.'] },
  { title: 'Pemesanan dan pembayaran', paragraphs: ['Pemesanan dianggap diterima setelah sistem menerbitkan kode booking. Status pembayaran tetap mengikuti konfirmasi server atau provider pembayaran tenant.', 'Jangan melakukan pembayaran ke rekening atau tujuan di luar instruksi yang tampil pada pesanan resmi.'] },
  { title: 'Penggunaan produk', paragraphs: ['Pelanggan wajib menjaga produk selama periode sewa dan mengikuti petunjuk penggunaan serta proses serah-terima tenant.', 'Syarat identitas, deposit, keterlambatan, atau kerusakan dapat berbeda menurut produk dan akan diinformasikan sebelum transaksi.'] },
  { title: 'Bantuan dan perubahan', paragraphs: ['Permintaan perubahan jadwal atau detail pesanan perlu disampaikan melalui kanal kontak resmi tenant dan bergantung pada ketersediaan.'] },
]
</script>

<template><LegalPage title="Syarat & ketentuan" description="Ketentuan umum penggunaan website dan layanan pemesanan tenant." :sections="sections" /></template>
