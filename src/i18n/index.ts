/* Dua bahasa: English (default, di root) dan Indonesia (di /id/...).
   Semua teks antarmuka bersama ada di sini; isi panjang per halaman ada di src/views. */

export type Lang = 'en' | 'id';
export const LANGS: Lang[] = ['en', 'id'];
export const DEFAULT_LANG: Lang = 'en';

export const asLang = (v: string | undefined | null): Lang => (v === 'id' ? 'id' : 'en');

/** jalur tanpa awalan bahasa: "/id/work" → "/work", "/id" → "/" */
export function stripLang(path: string): string {
  const p = path.replace(/^\/id(?=\/|$)/, '');
  return p === '' ? '/' : p;
}

/** jalur untuk bahasa tertentu: ("id", "/work") → "/id/work" */
export function localePath(lang: Lang, path: string): string {
  const base = stripLang(path);
  if (lang === 'en') return base;
  return base === '/' ? '/id/' : `/id${base}`;
}

export const ui = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    desc:
      'Muhammad Maftuh — student and software builder from Bandung. Neovarch Agent, NeovarchLabs, tools for coding agents, Omarchy plugins, and other open-source projects.',
    ogAlt: 'Muhammad Maftuh — portfolio',
    nav: { index: 'Index', about: 'About', work: 'Work', now: 'Now', contact: 'Contact' },
    navLabel: 'Pages',
    themeToggle: 'Switch light / dark mode',
    langLabel: 'Language',
    langSwitch: 'Baca dalam Bahasa Indonesia',
    footHello: 'nice to meet you',
    clockLocale: 'en-GB',
    shelfPrev: 'Previous',
    shelfNext: 'Next',
    cv: '/cv-en.pdf',
  },
  id: {
    htmlLang: 'id',
    ogLocale: 'id_ID',
    desc:
      'Muhammad Maftuh — mahasiswa dan pembangun perangkat lunak dari Bandung. Neovarch Agent, NeovarchLabs, perkakas untuk coding agent, plugin Omarchy, dan proyek sumber terbuka lainnya.',
    ogAlt: 'Muhammad Maftuh — portofolio',
    nav: { index: 'Beranda', about: 'Tentang', work: 'Karya', now: 'Kini', contact: 'Kontak' },
    navLabel: 'Halaman',
    themeToggle: 'Ganti mode terang / gelap',
    langLabel: 'Bahasa',
    langSwitch: 'Read in English',
    footHello: 'salam kenal',
    clockLocale: 'id-ID',
    shelfPrev: 'Sebelumnya',
    shelfNext: 'Berikutnya',
    cv: '/cv-id.pdf',
  },
} as const;

export const t = (lang: Lang) => ui[lang];
