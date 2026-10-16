/* Isi studi kasus dalam dua bahasa. Fakta harus sama persis di kedua versi. */
type Side = {
  title: string;
  lead: string;
  imgAlt: string;
  facts: [string, string][];
  sections: [string, string][];
  actions: { label: string; href: string }[];
};
export type Case = { name: string; img: string; en: Side; id: Side };

export const neovarchlabs: Case = {
  name: 'NeovarchLabs',
  img: '/work/neovarchlabs.webp',
  en: {
    title: 'NeovarchLabs case study · Muhammad Maftuh',
    lead:
      'A small agency site whose job doesn’t stop at the home page: ordering, payment, invoices, and receipts have to run on their own, without any manual work.',
    imgAlt: 'Home page of neovarchlabs.web.id: pixel lettering “Neovarch Labs — We Make You See” on a dark background',
    facts: [
      ['Role', 'Founder · lead developer'],
      ['Stack', 'Next.js, Prisma, Turso'],
      ['Status', 'Production — neovarchlabs.web.id'],
      ['Payments', 'QRIS via DOKU, automatic status'],
    ],
    sections: [
      [
        'Problem',
        'A small studio loses time to clerical work: billing over chat, making invoices one by one, and recording payments that arrive through different channels. A single missed payment is felt right away.',
      ],
      [
        'Approach',
        'One system that closes the chain end to end. The client picks a package and goes straight to the payment page; a QRIS code for the exact amount is created through DOKU, and as soon as the payment comes in its status changes by itself. The order then moves through a single flow — awaiting payment, paid, confirmed, in progress, handover, done — which the client sees on their dashboard. The invoice is emailed before payment and the receipt after it (via Resend); Telegram is only for admin notifications. Revenue counts only payments that are actually settled.',
      ],
      [
        'What I did',
        'I lead its development together with co-founder Farrel Shaquille (FSThub): the data schema with Prisma on Turso, the DOKU payment integration and its webhooks, the order flow, transactional email, the admin and client dashboards, all the way to its liquid-glass look.',
      ],
      [
        'Result',
        'Bills go out and get paid without a spreadsheet: the client scans the QRIS, the system records it, the receipt is sent, and the admin simply works on the order. It all runs in production at neovarchlabs.web.id.',
      ],
    ],
    actions: [
      { label: 'Open the live site', href: 'https://www.neovarchlabs.web.id' },
      { label: 'My GitHub', href: 'https://github.com/Maftuuh1922' },
    ],
  },
  id: {
    title: 'Studi kasus NeovarchLabs · Muhammad Maftuh',
    lead:
      'Situs agensi kecil yang urusannya tidak berhenti di halaman depan: pemesanan, pembayaran, invoice, dan kwitansi harus jalan sendiri tanpa campur tangan manual.',
    imgAlt: 'Halaman depan neovarchlabs.web.id: tulisan piksel “Neovarch Labs — We Make You See” di latar gelap',
    facts: [
      ['Peran', 'Pendiri · lead developer'],
      ['Tumpukan', 'Next.js, Prisma, Turso'],
      ['Status', 'Produksi — neovarchlabs.web.id'],
      ['Pembayaran', 'QRIS via DOKU, status otomatis'],
    ],
    sections: [
      [
        'Masalah',
        'Studio kecil kehilangan waktu pada pekerjaan klerikal: menagih lewat chat, membuat invoice satu per satu, dan mencatat pembayaran yang masuk lewat kanal berbeda-beda. Satu pembayaran yang terlewat langsung terasa.',
      ],
      [
        'Pendekatan',
        'Satu sistem yang menutup rantainya dari ujung ke ujung. Klien memilih paket lalu langsung diarahkan ke halaman bayar; QRIS dibuat lewat DOKU sesuai nominal, dan begitu pembayaran masuk statusnya berubah sendiri. Pesanan lalu bergerak lewat satu alur — menunggu pembayaran, dibayar, dikonfirmasi, dikerjakan, serah terima, selesai — yang dilihat klien di dasbornya. Invoice dikirim sebelum bayar dan kwitansi sesudahnya lewat email (Resend); Telegram hanya untuk notifikasi admin. Omzet hanya menghitung pembayaran yang benar-benar lunas.',
      ],
      [
        'Yang saya kerjakan',
        'Saya memimpin pengembangannya bersama co-founder Farrel Shaquille (FSThub): skema data dengan Prisma di atas Turso, integrasi pembayaran DOKU dan webhook-nya, alur pesanan, email transaksi, dasbor admin dan klien, sampai tampilan liquid glass-nya.',
      ],
      [
        'Hasil',
        'Tagihan terkirim dan terbayar tanpa spreadsheet: klien memindai QRIS, sistem mencatat, kwitansi terkirim, dan admin cukup mengerjakan pesanannya. Semua berjalan di produksi pada neovarchlabs.web.id.',
      ],
    ],
    actions: [
      { label: 'Buka situs live', href: 'https://www.neovarchlabs.web.id' },
      { label: 'GitHub saya', href: 'https://github.com/Maftuuh1922' },
    ],
  },
};

export const nalar: Case = {
  name: 'Nalar.Ai',
  img: '/work/nalar-ai.webp',
  en: {
    title: 'Nalar.Ai case study · Muhammad Maftuh',
    lead:
      'An AI assistant for education that answers with citations, not guesses. Students’ questions are answered from documents that are actually referenced, complete with pointers to the source.',
    imgAlt: 'Nalar.Ai landing page: the large headline “Kecerdasan yang berevolusi untuk Anda” (“Intelligence that evolves for you”) on a blue background',
    facts: [
      ['Role', 'Designer & developer'],
      ['Stack', 'TypeScript, Next.js, RAG'],
      ['Status', 'Landing page live on Vercel'],
      ['Source', 'github.com/Maftuuh1922/Nalar.Ai'],
    ],
    sections: [
      [
        'Problem',
        'A language model’s answers about course material easily sound convincing even when they’re wrong, and teachers don’t have time to re-check every answer. What’s needed is an answer that shows where it came from.',
      ],
      [
        'Approach',
        'A RAG pipeline: documents are split and indexed, then the most relevant parts are selected for each question. Answers are composed only from chunks that pass a similarity threshold, and every claim is linked to its original file and page — four documents are cited for a single answer in the demo on the work page.',
      ],
      [
        'What I did',
        'Designing the retrieval pipeline, choosing the model, the chat interface, through to the promo page now running on Vercel. The codebase is written in TypeScript so the retrieval logic can be tested separately from the interface.',
      ],
      [
        'Result',
        'Short answers that can be double-checked in seconds: students see the source, and teachers don’t have to guess. The live demo page opens from the button below.',
      ],
    ],
    actions: [
      { label: 'Open the live site', href: 'https://landingpage-kappa-eight.vercel.app/' },
      { label: 'View the repository', href: 'https://github.com/Maftuuh1922/Nalar.Ai' },
    ],
  },
  id: {
    title: 'Studi kasus Nalar.Ai · Muhammad Maftuh',
    lead:
      'Asisten AI untuk edukasi yang menjawab dengan sitasi, bukan tebakan. Pertanyaan siswa dijawab dari dokumen yang benar-benar dirujuk, lengkap dengan penunjuk sumbernya.',
    imgAlt: 'Landing page Nalar.Ai: judul besar “Kecerdasan yang berevolusi untuk Anda” di latar biru',
    facts: [
      ['Peran', 'Perancang & pengembang'],
      ['Tumpukan', 'TypeScript, Next.js, RAG'],
      ['Status', 'Landing page live di Vercel'],
      ['Sumber', 'github.com/Maftuuh1922/Nalar.Ai'],
    ],
    sections: [
      [
        'Masalah',
        'Jawaban model bahasa untuk materi pelajaran mudah terdengar meyakinkan walau salah, dan guru tidak punya waktu memeriksa ulang setiap jawaban. Yang dibutuhkan adalah jawaban yang menunjukkan dari mana ia diambil.',
      ],
      [
        'Pendekatan',
        'Alur RAG: dokumen dipecah, diindeks, lalu bagian yang paling relevan dipilih untuk tiap pertanyaan. Jawaban disusun hanya dari potongan yang lolos ambang kemiripan, dan setiap klaim ditautkan ke berkas serta halaman aslinya — empat dokumen dirujuk untuk satu jawaban pada demo di halaman work.',
      ],
      [
        'Yang saya kerjakan',
        'Perancangan alur retrieval, pemilihan model, antarmuka percakapan, sampai halaman promosi yang kini berjalan di Vercel. Basis kode ditulis dalam TypeScript agar logika retrieval tetap bisa diuji terpisah dari antarmuka.',
      ],
      [
        'Hasil',
        'Jawaban singkat yang bisa diperiksa ulang dalam hitungan detik: siswa melihat sumbernya, guru tidak perlu menebak. Halaman demo langsungnya bisa dibuka lewat tombol di bawah.',
      ],
    ],
    actions: [
      { label: 'Buka situs live', href: 'https://landingpage-kappa-eight.vercel.app/' },
      { label: 'Lihat repositori', href: 'https://github.com/Maftuuh1922/Nalar.Ai' },
    ],
  },
};
