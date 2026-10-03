/* Semua demo "hidup" di halaman Work — pola sama: satu siklus, lalu berulang. */

type Line = { text?: string; html?: string; prefix?: string; pause?: number };

/** terminal yang mengetik sendiri */
export function typeLines(el: HTMLElement | null, lines: Line[], speed = 26): void {
  if (!el) return;
  let li = 0;
  let ci = 0;
  let buf = '';
  const render = () => {
    el.innerHTML = buf + '<span class="caret"></span>';
  };
  const tick = () => {
    if (li >= lines.length) {
      setTimeout(() => {
        buf = '';
        li = 0;
        ci = 0;
        render();
        tick();
      }, 2600);
      return;
    }
    const line = lines[li];
    if (line.html !== undefined) {
      buf += line.html;
      li += 1;
      render();
      setTimeout(tick, line.pause ?? 600);
      return;
    }
    const text = line.text ?? '';
    if (ci === 0 && line.prefix) buf += line.prefix;
    if (ci < text.length) {
      buf += text[ci];
      ci += 1;
      render();
      setTimeout(tick, speed);
    } else {
      buf += '\n';
      li += 1;
      ci = 0;
      render();
      setTimeout(tick, line.pause ?? 420);
    }
  };
  render();
  tick();
}

const $ = (id: string) => document.getElementById(id);

/** Nalar.Ai — pertanyaan + jawaban RAG bersitasi */
export function nalar(): void {
  typeLines($('nalar-term'), [
    { prefix: '<span class="p">? </span>', text: 'jelaskan fotosintesis untuk kelas 8', pause: 700 },
    { html: '<span class="dim">↳ retriever: 4 dokumen, skor 0.86–0.94</span>', pause: 900 },
    {
      html:
        '<span class="ok">✓</span> Fotosintesis adalah proses tumbuhan<br>' +
        '&nbsp;&nbsp;mengubah CO₂ + air menjadi glukosa<br>' +
        '&nbsp;&nbsp;memakai cahaya matahari.<br>' +
        '<span class="dim">sumber: [1] biologi_v3.pdf hal.42<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2] modul_semester.pdf hal.7</span>',
      pause: 2400,
    },
  ], 22);
}

/** Pagarnet — penghitung domain terblokir */
export function pagarnet(): void {
  const el = $('pg-count');
  const tags = $('pg-tags');
  if (!el || !tags) return;
  const domains = ['slot-gacor-hoki.xyz', 'togel-online88.click', 'judi-zeus.pro', 'maxwin-slot.live',
    'raja-judi.co', 'freechip-harian.top', 'bola-tangkas.net', 'gacor-max.live'];
  let n = 1284;
  let i = 0;
  const paint = () => {
    tags.innerHTML = domains.slice(i % 4, (i % 4) + 4)
      .map((d, k) => `<span class="tag ${k === 0 ? '' : 'g'}">${k === 0 ? '✕ ' : '✓ '}${d}</span>`)
      .join('');
    i += 1;
  };
  paint();
  setInterval(() => {
    n += Math.floor(Math.random() * 3) + 1;
    el.textContent = n.toLocaleString('id-ID');
  }, 1400);
  setInterval(paint, 2200);
}

/** BatikLens — pindai + keyakinan kelas */
export function batik(): void {
  const rows: [HTMLElement | null, HTMLElement | null, number][] = [
    [$('r1'), $('b1'), 87],
    [$('r2'), $('b2'), 9],
    [$('r3'), $('b3'), 4],
  ];
  const note = $('batik-note');
  const run = () => {
    if (note) note.textContent = 'memindai pola…';
    rows.forEach((r) => {
      if (r[0]) (r[0] as HTMLElement).style.width = '0%';
      if (r[1]) r[1].textContent = '0%';
    });
    setTimeout(() => {
      rows.forEach((r, k) =>
        setTimeout(() => {
          if (r[0]) (r[0] as HTMLElement).style.width = r[2] + '%';
          let v = 0;
          const t = setInterval(() => {
            v += Math.ceil(r[2] / 12);
            if (v >= r[2]) v = r[2];
            if (r[1]) r[1].textContent = v + '%';
            if (v >= r[2]) clearInterval(t);
          }, 70);
        }, k * 160),
      );
      setTimeout(() => {
        if (note) note.textContent = 'parang · keyakinan 87%';
      }, 1500);
    }, 2200);
  };
  run();
  setInterval(run, 9500);
}

/** fotobooth — strip berkedip */
export function fotobooth(): void {
  const note = $('fb-note');
  const ph = document.querySelectorAll('#strip .ph');
  if (!ph.length) return;
  let k = 0;
  setInterval(() => {
    if (note) note.textContent = 'pose ' + ((k % 4) + 1) + '/4 · kilat!';
    (ph[k % 4] as HTMLElement).style.outline = '2px solid var(--accent)';
    if (k % 4 !== 0) (ph[(k - 1) % 4] as HTMLElement).style.outline = 'none';
    k += 1;
  }, 1500);
}

/** aplikasi_berita — isi feed */
export function berita(): void {
  const ul = document.getElementById('feed');
  if (!ul) return;
  const items: [string, string][] = [
    ['ai', 'Model terbaru unggul di Coding Agent Index'],
    ['dev', 'Next.js rilis peningkatan kecepatan build'],
    ['lokal', 'Bandung gelar pekan teknologi pelajar'],
    ['sains', 'Baterai solid-state memasuki tahap uji'],
    ['bisnis', 'Startup edukasi Indonesia raih pendanaan'],
    ['ai', 'RAG tekan halusinasi asisten kampus'],
    ['dev', 'Dart 4 membawa konfirmasi lebih cepat'],
    ['gadget', 'Ponsel lipat awet dua kali lipat'],
  ];
  const html = items.map(([k, t]) => `<li><i>${k}</i>${t}</li>`).join('');
  ul.innerHTML = html + html;
}

/** sales-management — grafik + omzet */
export function sales(): void {
  const bars = document.querySelectorAll<HTMLElement>('#chart i');
  const note = $('sales-note');
  const vals = [38, 64, 47, 82, 59, 96, 71];
  const run = () => {
    bars.forEach((b, k) => setTimeout(() => (b.style.height = vals[k] + '%'), k * 110));
    let s = 0;
    const t = setInterval(() => {
      s += 42000;
      if (s >= 184600000) s = 184600000;
      if (note) note.textContent = 'omzet minggu ini · Rp ' + (s / 1e6).toFixed(1).replace('.', ',') + ' jt';
      if (s >= 184600000) clearInterval(t);
    }, 40);
  };
  run();
  setInterval(run, 9500);
}

/** batang statistik bahasa */
export function bahasa(): void {
  setTimeout(
    () =>
      document.querySelectorAll<HTMLElement>('.lang').forEach((b, i) =>
        setTimeout(() => (b.style.width = b.dataset.v + '%'), i * 130)),
    600,
  );
}

/** boot log uvicorn */
export function backend(): void {
  typeLines($('be-term'), [
    { html: '<span class="dim">INFO</span> Started server process [2187]', pause: 500 },
    { html: '<span class="dim">INFO</span> Waiting for application startup.', pause: 500 },
    { html: '<span class="ok">INFO</span> Application startup complete.', pause: 700 },
    { html: '<span class="p">INFO</span> <span class="dim">127.0.0.1:8000</span> - POST <b>/rag/query</b> <span class="ok">200 OK</span>', pause: 900 },
    { html: '<span class="dim">index: 1.204 dokumen · 384 dimensi</span>', pause: 1600 },
  ], 18);
}

/** README profil */
export function readme(): void {
  typeLines($('readme-term'), [
    { prefix: '<span class="p">$ </span>', text: 'python3 stats.py --user Maftuuh1922', pause: 600 },
    { html: '<span class="ok">✓</span> repositori <b class="ok">48</b> &nbsp; followers <b class="ok">10</b>', pause: 900 },
    { html: '<span class="dim">TypeScript 15 · JavaScript 7 · Dart 5<br>Python 4 · PHP 3 · HTML 3 · C++ 1</span>', pause: 1800 },
  ], 26);
}

/** editor markdown */
export function markdown(): void {
  typeLines($('md-term'), [
    { prefix: '<span class="p"># </span>', text: 'Cara menulis pesan teknis', pause: 600 },
    { html: '<span class="dim">**ringkas** · `kode` · &gt; kutipan<br>- [x] judul jelas<br>- [x] satu ide per paragraf</span>', pause: 1900 },
  ], 24);
}

/** Hugging Face — model / space / dataset yang dihitung naik */
export function huggingface(): void {
  const items: [string, number][] = [
    ['hf-models', 8],
    ['hf-spaces', 5],
    ['hf-data', 1],
  ];
  for (const [id, target] of items) {
    const el = $(id);
    if (!el) continue;
    let v = 0;
    const step = Math.max(1, Math.round(target / 14));
    const t = setInterval(() => {
      v += step;
      if (v >= target) {
        v = target;
        clearInterval(t);
      }
      el.textContent = String(v);
    }, 70);
  }
}

export function startWorkDemos(): void {
  huggingface();
  nalar();
  pagarnet();
  batik();
  fotobooth();
  berita();
  sales();
  bahasa();
  backend();
  readme();
  markdown();
}
