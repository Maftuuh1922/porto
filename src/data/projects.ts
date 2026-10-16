/* Semua proyek di situs ini — satu sumber data untuk beranda dan halaman Work.
   Aturannya: hanya fakta yang bisa dicek (repo, situs live, README).
   `img` selalu tangkapan layar / gambar asli dari repo; kalau belum ada, kosongkan
   dan kartu menampilkan placeholder polos — jangan pernah gambar karangan. */

export type Link = { label: string; href: string };
export type Project = {
  slug: string;
  name: string;
  tags: string[]; // web · ai · agent · linux · mobile · game · ext
  status: string;
  lead: string;
  stack: string[];
  links: Link[];
  img?: string;
  imgAlt?: string;
  imgSrc?: string; // asal gambar, ditulis kecil di kartu
  featured?: boolean;
};

const gh = (r: string): Link => ({ label: 'GitHub', href: `https://github.com/Maftuuh1922/${r}` });

export const projects: Project[] = [
  {
    slug: 'neovarch-agent',
    name: 'Neovarch Agent',
    tags: ['agent', 'ai', 'mobile'],
    status: 'v1.4.8 · aktif',
    lead:
      'Agen AI yang berjalan di PC sendiri (Windows, Linux) dan dikendalikan dari HP Android. Desktop jadi intinya — chat dengan tools, sesi, skill, memori, papan Kanban, data tersimpan di ~/.neovarch — sedangkan HP cukup jadi remote lewat pairing QR. Bisa memakai model apa pun yang bicara API /chat/completions: OpenAI, OpenRouter, Groq, DeepSeek, Ollama, atau server lokal.',
    stack: ['Electron', 'React', 'TypeScript', 'Python', 'Flutter'],
    links: [
      { label: 'Situs', href: 'https://www.neovarchagent.web.id' },
      gh('neovrach_Agent'),
    ],
    img: '/work/neovarch-agent.webp',
    imgAlt: 'Halaman depan neovarchagent.web.id: judul “An AI agent on your PC, controlled from your phone” dengan ilustrasi maskot bergaris merah',
    imgSrc: 'situs live',
    featured: true,
  },
  {
    slug: 'neovarchlabs',
    name: 'NeovarchLabs',
    tags: ['web'],
    status: 'produksi',
    lead:
      'Studio kecil saya untuk situs dan aplikasi web. Situsnya sekaligus sistem pemesanan: klien memilih paket, langsung membayar (QRIS, Virtual Account, Indomaret, Alfamart, Akulaku lewat DOKU), status pembayaran terdeteksi otomatis, lalu invoice dan kwitansi dikirim lewat email. Pesanan bisa dipantau klien di dasbornya sendiri.',
    stack: ['Next.js', 'Tailwind', 'Prisma', 'Turso', 'DOKU', 'Resend'],
    links: [{ label: 'Situs', href: 'https://www.neovarchlabs.web.id' }, { label: 'Studi kasus', href: '/work/neovarchlabs' }],
    img: '/work/neovarchlabs.webp',
    imgAlt: 'Halaman depan neovarchlabs.web.id: tulisan piksel “Neovarch Labs — We Make You See” di latar gelap',
    imgSrc: 'situs live',
    featured: true,
  },
  {
    slug: 'nalar-ai',
    name: 'Nalar.Ai',
    tags: ['ai', 'web'],
    status: 'landing live',
    lead:
      'Asisten AI edukasi dengan RAG dan analisis dokumen secara langsung: jawaban dirujuk ke dokumen sumbernya. Frontend TypeScript, backend Python terpisah (Nalar.ai-be) untuk indeks dan pencarian dokumen.',
    stack: ['TypeScript', 'Python', 'RAG'],
    links: [
      { label: 'Situs', href: 'https://landingpage-kappa-eight.vercel.app/' },
      gh('Nalar.Ai'),
      { label: 'Backend', href: 'https://github.com/Maftuuh1922/Nalar.ai-be' },
      { label: 'Studi kasus', href: '/work/nalar-ai' },
    ],
    img: '/work/nalar-ai.webp',
    imgAlt: 'Landing page Nalar.Ai: judul besar “Kecerdasan yang berevolusi untuk Anda” di latar biru',
    imgSrc: 'situs live',
    featured: true,
  },
  {
    slug: 'boxtop',
    name: 'Boxtop',
    tags: ['linux'],
    status: 'v1.5 · marketplace Omarchy',
    lead:
      'Widget bar bergaya btop untuk Omarchy (Quickshell): CPU, memori, jaringan, dan proses dalam panel liquid glass. Ada penjaga kontras ≥ 4,5:1, aksen dari wallpaper, preset, dan pembaru bawaan. Terdaftar di marketplace plugin Omarchy.',
    stack: ['QML', 'Quickshell', 'Python'],
    links: [gh('omarchy-boxtop'), { label: 'Marketplace', href: 'https://plugins.omarchy.org' }],
    img: '/work/boxtop.webp',
    imgAlt: 'Desktop Omarchy dengan panel Boxtop di sisi kanan menampilkan grafik CPU dan daftar proses',
    imgSrc: 'gambar README',
    featured: true,
  },
  {
    slug: 'leave-no-trace',
    name: 'Leave No Trace',
    tags: ['agent'],
    status: 'open source',
    lead:
      'Memotret mesin sebelum sesi coding agent, membandingkannya sesudahnya, lalu mencetak “struk” semua jejak di luar diff yang diminta: file sampah, paket global, dotfile, config agent, proses dan port yang masih jalan, cron/systemd. Tiap baris ada buktinya, dan lnt revert --apply mengembalikannya.',
    stack: ['Python', 'Agent Skill'],
    links: [gh('leave-no-trace')],
    img: '/work/leave-no-trace.webp',
    imgAlt: 'Banner Leave No Trace: “Your AI agent made a mess. See every trace — and undo it.”',
    imgSrc: 'gambar README',
  },
  {
    slug: 'not-mine',
    name: 'not-mine',
    tags: ['agent'],
    status: 'open source',
    lead:
      'Satu pengecekan kepemilikan sebelum agent mematikan proses, menghapus file, atau men-deploy sesuatu yang bukan miliknya. Agent Skill plus CLI Python satu file tanpa dependensi, jalan di agent mana pun yang bisa menjalankan perintah shell.',
    stack: ['Python', 'Agent Skill'],
    links: [gh('not-mine')],
    img: '/work/not-mine.webp',
    imgAlt: 'Banner not-mine: “Your agent is about to kill a process that isn’t its. Not Mine stops it.”',
    imgSrc: 'gambar README',
  },
  {
    slug: 'catch-22',
    name: 'catch-22-skill',
    tags: ['agent'],
    status: 'open source',
    lead:
      'Kalau tes memang mustahil lulus, agent harus bilang begitu, bukan menghapus tesnya. Mendeteksi spesifikasi yang saling bertentangan (issue vs tes), memberi bukti baris demi baris dan skrip repro, lalu menyerahkan pilihannya ke manusia.',
    stack: ['Python', 'Agent Skill', 'pytest · jest · vitest'],
    links: [gh('catch-22-skill')],
    img: '/work/catch-22.webp',
    imgAlt: 'Banner Catch-22: “When the tests can’t pass, your agent should say so — not delete them.”',
    imgSrc: 'gambar README',
  },
  {
    slug: 'omarchy-pocket',
    name: 'Omarchy Pocket',
    tags: ['linux', 'mobile'],
    status: 'awal pengembangan',
    lead:
      'Mengendalikan desktop Omarchy yang asli dari HP Android, tanpa flashing. Daemon pocketd meneruskan wayvnc lewat WebSocket TLS (token + pinning sertifikat, hanya LAN/Tailscale), ditambah plugin bar dan aplikasi Android dengan klien RFB sendiri.',
    stack: ['Python', 'Kotlin', 'Jetpack Compose', 'wayvnc'],
    links: [gh('omarchy-pocket-')],
    img: '/work/omarchy-pocket.webp',
    imgAlt: 'Wireframe lima layar aplikasi Android Omarchy Pocket: pairing, laci aplikasi, workspace, terminal',
    imgSrc: 'wireframe dari repo',
  },
  {
    slug: 'neovarch-glass',
    name: 'Neovarch Glass',
    tags: ['linux'],
    status: 'open source',
    lead:
      'Tema Omarchy v4: permukaan liquid glass gelap, aksen merah vermilion, teks putih-mint, tanpa gradien. Wallpaper bintang krom halftone dengan delapan varian warna.',
    stack: ['Omarchy', 'TOML'],
    links: [gh('omarchy-neovarch-glass-theme')],
    img: '/work/neovarch-glass.webp',
    imgAlt: 'Pratinjau tema Neovarch Glass: desktop bernuansa merah-hitam dengan jendela terminal kaca',
    imgSrc: 'gambar README',
  },
  {
    slug: 'batiklens',
    name: 'BatikLens',
    tags: ['ai', 'web'],
    status: 'live',
    lead:
      'Mengenali motif batik dari kamera atau foto, lalu menjelaskan filosofinya. Klasifikasi di peramban dengan TensorFlow.js (MobileNet), backend di Cloudflare Workers; ada katalog, museum 3D, dan tantangan.',
    stack: ['React', 'TypeScript', 'TensorFlow.js', 'Cloudflare Workers', 'Hono'],
    links: [
      { label: 'Situs', href: 'https://batiklens-ai-powered-heritage-explo.vercel.app' },
      gh('batiklens-ai-powered-heritage-explorer'),
    ],
    img: '/work/batiklens.webp',
    imgAlt: 'Halaman depan BatikLens: judul “Menyingkap Jiwa Batik” dengan tombol Mulai Pindai',
    imgSrc: 'situs live',
  },
  {
    slug: 'wastra',
    name: 'Wastra.ai',
    tags: ['ai', 'web'],
    status: 'live',
    lead: 'Kenali, pelajari, dan kreasikan motif batik Nusantara di genggaman — dengan backend API terpisah.',
    stack: ['Next.js', 'TypeScript'],
    links: [
      { label: 'Situs', href: 'https://wastra-plum.vercel.app' },
      gh('wastra'),
      { label: 'Backend', href: 'https://github.com/Maftuuh1922/wastra-backend' },
    ],
    img: '/work/wastra.webp',
    imgAlt: 'Halaman depan Wastra.ai: “Kenali Motif Batik di Genggaman Anda” dengan foto perajin batik',
    imgSrc: 'situs live',
  },
  {
    slug: 'pagarnet',
    name: 'Pagarnet',
    tags: ['ext'],
    status: 'open source',
    lead:
      'Ekstensi Chrome yang memblokir situs judi online, iklan tersembunyi, dan penipuan secara real-time. Panduan pasangnya ditulis langkah demi langkah untuk orang awam.',
    stack: ['JavaScript', 'HTML', 'Chrome Extension'],
    links: [gh('Pagarnet')],
  },
  {
    slug: 'pocong',
    name: 'Kabur dari Pocong',
    tags: ['game'],
    status: 'dalam pengembangan · belum terbit',
    lead:
      'Game horor co-op Roblox untuk 1–6 pemain di kampung malam hari: kumpulkan pecahan kunci, nyalakan senter, lari dari pocong yang melompat. Tiga peta bergilir, lobi dengan kamar, peran Dukun dan Peronda.',
    stack: ['Luau', 'Rojo', 'Roblox'],
    links: [],
    img: '/work/pocong.webp',
    imgAlt: 'Thumbnail game: tiga avatar Roblox berlari membawa senter di jalan kampung berkabut, dikejar pocong',
    imgSrc: 'thumbnail game',
  },
  {
    slug: 'kisah-adab',
    name: 'Kisah Adab Studio',
    tags: ['ai'],
    status: 'dalam pengembangan · privat',
    lead:
      'Perkakas lokal untuk memproduksi serial YouTube Shorts anak tentang adab Islami: klip visual digabung dengan suara narasi TTS sendiri, musik yang otomatis mengecil saat narasi, dan penyamaan loudness. Tiap episode tetap disetujui manusia.',
    stack: ['Python', 'FastAPI', 'ffmpeg'],
    links: [],
    img: '/work/kisah-adab.webp',
    imgAlt: 'Ikon aplikasi Kisah Adab Studio: buku terbuka dengan bulan sabit dan bintang',
    imgSrc: 'ikon aplikasi',
  },
  {
    slug: 'fotobooth',
    name: 'fotobooth',
    tags: ['web'],
    status: 'live',
    lead: 'Photobooth vintage di peramban: ambil atau unggah foto, pilih dari 56 bingkai dan 83 stiker, lalu unduh cetakannya.',
    stack: ['JavaScript', 'Python'],
    links: [{ label: 'Situs', href: 'https://fotobooth-one.vercel.app' }, gh('fotobooth')],
    img: '/work/fotobooth.webp',
    imgAlt: 'Halaman fotobooth: bilik foto kayu dengan tombol “take a photo” dan “upload photo”',
    imgSrc: 'situs live',
  },
  {
    slug: 'amoures',
    name: 'Amoures Tour Operator',
    tags: ['web'],
    status: 'live',
    lead: 'Situs operator wisata: paket tur, destinasi, dan kemitraan B2B, dengan pencarian paket di halaman depan.',
    stack: ['JavaScript'],
    links: [{ label: 'Situs', href: 'https://amoures-tour-oprator.vercel.app' }, gh('Amoures-tour-oprator')],
    img: '/work/amoures.webp',
    imgAlt: 'Halaman depan Amoures: “Jelajahi Dunia Bersama Amoures” di atas foto danau dan perahu',
    imgSrc: 'situs live',
  },
  {
    slug: 'eighteen',
    name: 'Eighteen',
    tags: ['web'],
    status: 'live',
    lead: 'Perjalanan ulang tahun ke-18 yang sinematik — ucapan personal dalam bab-bab bergulir.',
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Hono'],
    links: [
      { label: 'Situs', href: 'https://eighteen-a-cinematic-birthday-journ.vercel.app' },
      gh('eighteen-a-cinematic-birthday-journey'),
    ],
    img: '/work/eighteen.webp',
    imgAlt: 'Satu bab situs Eighteen: kutipan putih di latar gelap',
    imgSrc: 'situs live',
  },
  {
    slug: 'sales',
    name: 'sales-management',
    tags: ['mobile'],
    status: 'arsip',
    lead: 'Aplikasi manajemen penjualan: produk, pelanggan, transaksi, dan dasbor ringkasan penjualan.',
    stack: ['Flutter', 'Dart'],
    links: [gh('sales-management')],
    img: '/work/sales.webp',
    imgAlt: 'Layar menu utama aplikasi sales-management: Dashboard, Add, Update, Logout',
    imgSrc: 'gambar README',
  },
  {
    slug: 'berita',
    name: 'aplikasi_berita',
    tags: ['mobile'],
    status: 'arsip',
    lead: 'Klien portal berita: kategori, pencarian, berita trending, mode gelap/terang, dengan backend API sendiri.',
    stack: ['Flutter', 'Dart', 'Node.js'],
    links: [gh('aplikasi_berita'), { label: 'Backend', href: 'https://github.com/Maftuuh1922/backend__aplikasi_berita' }],
    img: '/work/berita.webp',
    imgAlt: 'Layar beranda aplikasi berita: kolom pencarian, kartu berita trending, daftar berita terbaru',
    imgSrc: 'gambar README',
  },
  {
    slug: 'tunein',
    name: 'Tunein',
    tags: ['mobile'],
    status: 'MVP',
    lead: 'Media sosial musik — tiap unggahan adalah lagu yang sedang didengar plus caption. Teman bisa memutar pratinjau 30 detik, menyukai, berkomentar, dan mengikuti.',
    stack: ['Flutter', 'Firebase', 'Deezer API'],
    links: [gh('Tunein')],
  },
];

export const featured = projects.filter((p) => p.featured);
