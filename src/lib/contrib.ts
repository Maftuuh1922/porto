/**
 * Grafik kontribusi GitHub (kotak hijau) — diambil dari halaman kontribusi publik
 * github.com/users/<user>/contributions saat build. Kalau jaringan gagal, dipakai
 * salinan terakhir yang tersimpan di src/data/contrib.json.
 */
import { readFileSync } from 'node:fs';

export type ContribDay = { date: string; level: number; count: number };
export type Contrib = { days: ContribDay[]; total: number };

const ENDPOINT = 'https://github.com/users/Maftuuh1922/contributions';

function parse(html: string): Contrib | null {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^\s*(\d+)\s+contributions?\b/.exec(m[2]);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }

  const days: ContribDay[] = [];
  for (const m of html.matchAll(/<td[^>]*>/g)) {
    const tag = m[0];
    const date = /data-date="([^"]+)"/.exec(tag)?.[1];
    const level = /data-level="(\d)"/.exec(tag)?.[1];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    if (!date || level === undefined) continue;
    days.push({ date, level: Number(level), count: counts.get(id ?? '') ?? 0 });
  }
  if (days.length < 300) return null;

  /* HTML GitHub mengelompokkan sel per baris hari (semua Minggu, lalu Senin, ...),
     jadi disusun ulang per tanggal supaya kolom = minggu, baris = hari. */
  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const totalTag = /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/.exec(html);
  const total = totalTag
    ? Number(totalTag[1].replace(/,/g, ''))
    : days.reduce((a, d) => a + d.count, 0);
  return { days, total };
}

function cached(): Contrib {
  const path = new URL('../data/contrib.json', import.meta.url);
  return JSON.parse(readFileSync(path, 'utf8')) as Contrib;
}

export async function fetchContrib(): Promise<{ data: Contrib; live: boolean }> {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { 'user-agent': 'porto-maftuh-build', accept: 'text/html' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = parse(await res.text());
    if (!data) throw new Error('parse gagal');
    return { data, live: true };
  } catch (err) {
    console.warn('[contrib] memakai salinan tersimpan:', (err as Error).message);
    return { data: cached(), live: false };
  }
}
