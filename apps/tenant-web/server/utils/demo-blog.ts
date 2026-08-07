import { createError } from 'h3'
import type { BlogSnippet, ImageAsset } from '#shared/types'
import { getDemoHome } from './demo-data'
import type { ResolvedTenantContext } from './tenant'

export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'quote'
  text?: string
  items?: string[]
}

export interface PublicBlogPost extends BlogSnippet {
  author: { name: string; role: string }
  content: BlogContentBlock[]
  seo: { title: string; description: string; ogImage: string }
}

const articleContent: Record<string, BlogContentBlock[]> = {
  'memilih-kamera-untuk-dokumentasi-event': [
    { type: 'paragraph', text: 'Kamera yang tepat membantu tim dokumentasi bekerja lebih percaya diri di tengah perubahan cahaya, pergerakan tamu, dan momen yang tidak bisa diulang.' },
    { type: 'heading', text: 'Mulai dari kebutuhan acara' },
    { type: 'paragraph', text: 'Pertimbangkan ukuran venue, kondisi cahaya, jenis hasil akhir, dan jumlah operator. Acara indoor malam hari biasanya memerlukan performa low-light dan lensa dengan bukaan besar, sedangkan acara luar ruang lebih terbantu oleh jangkauan focal length yang fleksibel.' },
    { type: 'list', items: ['Tentukan apakah hasil utama berupa foto, video, atau keduanya.', 'Catat durasi acara untuk memperkirakan baterai dan media penyimpanan.', 'Pastikan operator sudah familiar dengan sistem kamera yang dipilih.', 'Siapkan satu opsi cadangan untuk komponen yang paling kritis.'] },
    { type: 'heading', text: 'Pilih paket, bukan hanya body kamera' },
    { type: 'paragraph', text: 'Lensa, baterai, kartu memori, audio, dan stabilisasi sama pentingnya dengan body. Paket yang seimbang sering memberi hasil lebih konsisten daripada body kelas tinggi dengan perlengkapan pendukung yang terbatas.' },
    { type: 'quote', text: 'Cek seluruh perlengkapan dan lakukan uji singkat sebelum hari acara agar waktu produksi tidak habis untuk adaptasi.' },
  ],
  'panduan-lensa-untuk-foto-produk': [
    { type: 'paragraph', text: 'Foto produk yang rapi bergantung pada perspektif, jarak kerja, pencahayaan, dan kemampuan lensa menangkap detail secara konsisten.' },
    { type: 'heading', text: 'Focal length yang nyaman' },
    { type: 'paragraph', text: 'Rentang normal hingga tele pendek membantu menjaga bentuk produk tetap natural. Untuk produk kecil, lensa macro memberi jarak fokus dekat dan detail yang lebih baik.' },
    { type: 'list', items: ['Gunakan 50-85 mm untuk bentuk yang natural.', 'Pilih macro untuk perhiasan atau detail tekstur.', 'Gunakan tripod agar framing antarproduk konsisten.', 'Jaga latar dan temperatur warna tetap seragam.'] },
    { type: 'heading', text: 'Uji sebelum sesi utama' },
    { type: 'paragraph', text: 'Ambil beberapa frame percobaan dengan material yang paling reflektif. Dari sana Anda dapat menilai distorsi, highlight, dan kedalaman bidang sebelum seluruh produk dipotret.' },
  ],
  'checklist-sebelum-sewa-kamera': [
    { type: 'paragraph', text: 'Checklist singkat membantu proses pengambilan lebih cepat dan mengurangi risiko ada perlengkapan penting yang tertinggal.' },
    { type: 'heading', text: 'Sebelum datang ke lokasi pengambilan' },
    { type: 'list', items: ['Konfirmasi tanggal, durasi, dan identitas pemesan.', 'Bawa kartu identitas serta dokumen yang diminta tenant.', 'Siapkan daftar aksesori yang diperlukan.', 'Pastikan perangkat pribadi kompatibel dengan media dan konektor yang disewa.'] },
    { type: 'heading', text: 'Saat menerima unit' },
    { type: 'paragraph', text: 'Periksa kondisi fisik, nyalakan unit, tes fungsi utama, dan cocokkan jumlah aksesori bersama staf. Simpan kontak tenant agar bantuan mudah diperoleh selama masa sewa.' },
    { type: 'quote', text: 'Luangkan lima menit untuk uji fungsi; langkah kecil ini sering mencegah kendala besar di lapangan.' },
  ],
}

function fallbackContent(snippet: BlogSnippet): BlogContentBlock[] {
  return [
    { type: 'paragraph', text: snippet.excerpt },
    { type: 'heading', text: 'Rencanakan kebutuhan Anda' },
    { type: 'paragraph', text: 'Tentukan jadwal, hasil yang diharapkan, dan perlengkapan pendukung sebelum memilih produk. Tim tenant dapat membantu menyesuaikan pilihan dengan kebutuhan penggunaan.' },
  ]
}

export function getDemoBlogList(tenant: ResolvedTenantContext): BlogSnippet[] {
  return getDemoHome(tenant).blog
}

export function getDemoBlogPost(tenant: ResolvedTenantContext, slug: string): PublicBlogPost {
  const snippet = getDemoBlogList(tenant).find(item => item.slug === slug)
  if (!snippet) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
      message: 'Artikel tidak ditemukan.',
      data: { error: { code: 'ARTICLE_NOT_FOUND', message: 'Artikel tidak ditemukan.' } },
    })
  }

  const ogImage: ImageAsset = snippet.image
  return {
    ...snippet,
    author: { name: 'Tim Kamera Jember', role: 'Rental specialist' },
    content: articleContent[slug] || fallbackContent(snippet),
    seo: {
      title: snippet.title,
      description: snippet.excerpt,
      ogImage: ogImage.url,
    },
  }
}
