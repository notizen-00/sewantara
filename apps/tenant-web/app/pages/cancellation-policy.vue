<script setup lang="ts">
const sections = [
  { title: 'Permintaan pembatalan', paragraphs: ['Hubungi tenant melalui kanal resmi dengan menyertakan kode pesanan. Pembatalan baru dianggap tercatat setelah tenant atau sistem mengonfirmasinya.'] },
  { title: 'Jadwal dan biaya', paragraphs: ['Batas waktu, potongan, atau biaya pembatalan dapat berbeda per produk dan jarak waktu ke jadwal penggunaan. Ketentuan yang berlaku harus tampil pada detail produk atau quote sebelum checkout.'] },
  { title: 'Pengembalian dana', paragraphs: ['Jika pengembalian dana disetujui, waktu pemrosesan bergantung pada metode pembayaran dan provider. Status refund dikonfirmasi oleh server, bukan hanya dari halaman return provider.'] },
  { title: 'Perubahan oleh tenant', paragraphs: ['Jika tenant tidak dapat memenuhi pesanan yang telah dikonfirmasi, tim akan menawarkan jadwal atau produk pengganti, atau menangani pengembalian dana sesuai kesepakatan.'] },
]
</script>

<template><LegalPage title="Kebijakan pembatalan" description="Informasi umum mengenai perubahan jadwal, pembatalan, dan pengembalian dana." :sections="sections" /></template>
