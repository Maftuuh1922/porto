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
  /** versi English; teks Indonesia di atas tetap jadi sumber untuk /id */
  en?: { status: string; lead: string; imgAlt?: string; imgSrc?: string };
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
      'Studio kecil saya untuk situs dan aplikasi web. Situsnya sekaligus sistem pemesanan: klien memilih paket dan langsung membayar dengan QRIS lewat DOKU, status pembayaran terdeteksi otomatis tanpa admin, lalu invoice dan kwitansi dikirim lewat email. Pesanan bergerak dari dibayar sampai selesai, dan klien memantaunya di dasbornya sendiri.',
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
    lead: 'Kenali, pelajari, dan kreasikan motif batik Nusantara dari genggaman. Backend API terpisah, dengan model deteksi YOLOv8 dan generator LoRA dari akun Hugging Face saya.',
    stack: ['Next.js', 'TypeScript', 'YOLOv8', 'LoRA'],
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

/* ---- English ---- */
const EN: Record<string, NonNullable<Project['en']>> = {
  'neovarch-agent': {
    status: 'v1.4.8 · active',
    lead:
      'An AI agent that runs on your own PC (Windows, Linux) and is controlled from your Android phone. The desktop is the core — chat with tools, sessions, skills, memory, a Kanban board, data stored in ~/.neovarch — while the phone simply acts as a remote through QR pairing. It works with any model that speaks the /chat/completions API: OpenAI, OpenRouter, Groq, DeepSeek, Ollama, or a local server.',
    imgAlt: 'Home page of neovarchagent.web.id: the headline “An AI agent on your PC, controlled from your phone” with a red-striped mascot illustration',
    imgSrc: 'live site',
  },
  neovarchlabs: {
    status: 'in production',
    lead:
      'My small studio for websites and web apps. The site doubles as the ordering system: clients pick a package and pay right away with QRIS through DOKU, payment status is detected automatically with no admin involved, and the invoice and receipt go out by email. Orders move from paid to done, and clients follow them on their own dashboard.',
    imgAlt: 'Home page of neovarchlabs.web.id: pixel lettering “Neovarch Labs — We Make You See” on a dark background',
    imgSrc: 'live site',
  },
  'nalar-ai': {
    status: 'landing page live',
    lead:
      'An educational AI assistant with RAG and live document analysis: answers are referenced back to their source documents. TypeScript frontend, with a separate Python backend (Nalar.ai-be) for document indexing and search.',
    imgAlt: 'Nalar.Ai landing page: the large headline “Kecerdasan yang berevolusi untuk Anda” (“Intelligence that evolves for you”) on a blue background',
    imgSrc: 'live site',
  },
  boxtop: {
    status: 'v1.5 · Omarchy marketplace',
    lead:
      'A btop-style bar widget for Omarchy (Quickshell): CPU, memory, network, and processes in a liquid-glass panel. It has a ≥ 4.5:1 contrast guard, accents taken from the wallpaper, presets, and a built-in updater. Listed on the Omarchy plugin marketplace.',
    imgAlt: 'Omarchy desktop with the Boxtop panel on the right showing a CPU graph and a process list',
    imgSrc: 'README image',
  },
  'leave-no-trace': {
    status: 'open source',
    lead:
      'Snapshots the machine before a coding-agent session, compares it afterwards, then prints a “receipt” of every trace left outside the requested diff: junk files, global packages, dotfiles, agent config, processes and ports still running, cron/systemd. Every line comes with evidence, and lnt revert --apply rolls it back.',
    imgAlt: 'Leave No Trace banner: “Your AI agent made a mess. See every trace — and undo it.”',
    imgSrc: 'README image',
  },
  'not-mine': {
    status: 'open source',
    lead:
      'One ownership check before an agent kills a process, deletes a file, or deploys something that isn’t its own. An Agent Skill plus a single-file, zero-dependency Python CLI that runs in any agent that can execute shell commands.',
    imgAlt: 'not-mine banner: “Your agent is about to kill a process that isn’t its. Not Mine stops it.”',
    imgSrc: 'README image',
  },
  'catch-22': {
    status: 'open source',
    lead:
      'When the tests truly can’t pass, the agent should say so instead of deleting them. It detects contradictory specifications (issue vs. tests), gives line-by-line evidence and a repro script, then hands the decision to a human.',
    imgAlt: 'Catch-22 banner: “When the tests can’t pass, your agent should say so — not delete them.”',
    imgSrc: 'README image',
  },
  'omarchy-pocket': {
    status: 'early development',
    lead:
      'Control your real Omarchy desktop from an Android phone, no flashing required. The pocketd daemon forwards wayvnc over a TLS WebSocket (token + certificate pinning, LAN/Tailscale only), alongside a bar plugin and an Android app with its own RFB client.',
    imgAlt: 'Wireframes of five Omarchy Pocket Android screens: pairing, app drawer, workspace, terminal',
    imgSrc: 'wireframe from the repo',
  },
  'neovarch-glass': {
    status: 'open source',
    lead:
      'An Omarchy v4 theme: dark liquid-glass surfaces, vermilion red accents, white-mint text, no gradients. A halftone chrome star wallpaper in eight color variants.',
    imgAlt: 'Neovarch Glass theme preview: a red-and-black desktop with a glass terminal window',
    imgSrc: 'README image',
  },
  batiklens: {
    status: 'live',
    lead:
      'Recognizes batik motifs from the camera or a photo, then explains the philosophy behind them. In-browser classification with TensorFlow.js (MobileNet), a backend on Cloudflare Workers, plus a catalog, a 3D museum, and challenges.',
    imgAlt: 'BatikLens home page: the headline “Menyingkap Jiwa Batik” (“Unveiling the Soul of Batik”) with a Start Scan button',
    imgSrc: 'live site',
  },
  wastra: {
    status: 'live',
    lead:
      'Recognize, learn about, and create Indonesian (Nusantara) batik motifs right from your phone. A separate API backend, with a YOLOv8 detection model and a LoRA generator from my Hugging Face account.',
    imgAlt: 'Wastra.ai home page: “Kenali Motif Batik di Genggaman Anda” (“Recognize batik motifs in the palm of your hand”) with a photo of a batik artisan',
    imgSrc: 'live site',
  },
  pagarnet: {
    status: 'open source',
    lead:
      'A Chrome extension that blocks online gambling sites, hidden ads, and scams in real time. Its install guide is written step by step for non-technical users.',
  },
  pocong: {
    status: 'in development · unreleased',
    lead:
      'A co-op Roblox horror game for 1–6 players in a village at night: collect key fragments, switch on your flashlight, and run from the hopping pocong. Three rotating maps, a lobby with rooms, and the Dukun (shaman) and Peronda (night watch) roles.',
    imgAlt: 'Game thumbnail: three Roblox avatars running with flashlights down a foggy village road, chased by a pocong',
    imgSrc: 'game thumbnail',
  },
  'kisah-adab': {
    status: 'in development · private',
    lead:
      'A local tool for producing a children’s YouTube Shorts series about Islamic manners (adab): visual clips combined with its own TTS narration, music that automatically ducks under the narration, and loudness normalization. Every episode is still approved by a human.',
    imgAlt: 'Kisah Adab Studio app icon: an open book with a crescent moon and a star',
    imgSrc: 'app icon',
  },
  fotobooth: {
    status: 'live',
    lead: 'A vintage photobooth in the browser: take or upload a photo, pick from 56 frames and 83 stickers, then download the print.',
    imgAlt: 'fotobooth page: a wooden photo booth with “take a photo” and “upload photo” buttons',
    imgSrc: 'live site',
  },
  amoures: {
    status: 'live',
    lead: 'A tour operator website: tour packages, destinations, and B2B partnerships, with package search on the home page.',
    imgAlt: 'Amoures home page: “Jelajahi Dunia Bersama Amoures” (“Explore the world with Amoures”) over a photo of a lake and boats',
    imgSrc: 'live site',
  },
  eighteen: {
    status: 'live',
    lead: 'A cinematic 18th-birthday journey — personal wishes told in scrolling chapters.',
    imgAlt: 'One chapter of the Eighteen site: a white quote on a dark background',
    imgSrc: 'live site',
  },
  sales: {
    status: 'archived',
    lead: 'A sales management app: products, customers, transactions, and a sales summary dashboard.',
    imgAlt: 'Main menu screen of the sales-management app: Dashboard, Add, Update, Logout',
    imgSrc: 'README image',
  },
  berita: {
    status: 'archived',
    lead: 'A news portal client: categories, search, trending news, dark/light mode, with its own API backend.',
    imgAlt: 'Home screen of the news app: search field, trending news cards, latest news list',
    imgSrc: 'README image',
  },
  tunein: {
    status: 'MVP',
    lead: 'Music social media — every post is the song you’re listening to plus a caption. Friends can play a 30-second preview, like, comment, and follow.',
  },
};
for (const p of projects) p.en = EN[p.slug];

const LINK_EN: Record<string, string> = { Situs: 'Site', 'Studi kasus': 'Case study' };

/** proyek dalam bahasa yang diminta; tautan internal ikut diberi awalan /id */
export function localize(p: Project, lang: 'en' | 'id'): Project {
  const links = p.links.map((l) => ({
    label: lang === 'en' ? (LINK_EN[l.label] ?? l.label) : l.label,
    href: l.href.startsWith('/') && lang === 'id' ? `/id${l.href}` : l.href,
  }));
  if (lang === 'id' || !p.en) return { ...p, links };
  return { ...p, ...p.en, links };
}

export const featured = projects.filter((p) => p.featured);
