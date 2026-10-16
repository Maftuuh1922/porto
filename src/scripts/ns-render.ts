/* Penggambar bintang neutron — versi sprite.
   Semua yang mahal (tekstur piringan, pendar, pancaran, bayangan bola) digambar
   SEKALI ke kanvas di luar layar saat ukuran berubah. Tiap frame tinggal memutar
   dan menempel sprite itu (drawImage), jadi tetap mulus di laptop lemah
   (Celeron N4020, grafis terintegrasi, kanvas 2D tanpa GPU penuh).

   Isi adegan:
   - piringan plasma 3 cincin, berputar diferensial (Kepler: dalam lebih cepat)
   - relativistic beaming: sisi yang mendekat lebih terang & lebih putih
   - pendar lensa: bayangan sisi belakang piringan yang ditekuk melengkung di atas bola
   - pancaran pulsar: sumbu magnet miring dari sumbu putar → menyapu seperti mercusuar,
     kilat singkat tiap kali pancaran mengarah ke kita
   - partikel yang berspiral masuk + percikan di kutub
   Warna mengikuti identitas maskot: piringan putih-emas → merah tua, bintang putih kebiruan. */

const TAU = Math.PI * 2;

type RGB = [number, number, number];
const STOPS: [number, RGB][] = [
  [0, [92, 6, 30]],
  [0.18, [196, 22, 38]],
  [0.38, [255, 96, 58]],
  [0.6, [255, 196, 132]],
  [0.82, [255, 240, 214]],
  [1, [255, 255, 250]],
];
export function heat(t: number): RGB {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [b, cb] = STOPS[i];
    if (t <= b) {
      const [a, ca] = STOPS[i - 1];
      const f = (t - a) / (b - a);
      return [0, 1, 2].map((k) => Math.round(ca[k] + (cb[k] - ca[k]) * f)) as RGB;
    }
  }
  return STOPS[STOPS.length - 1][1];
}
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

function mk(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

/* pengacak deterministik — tekstur sama tiap muat */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Ring = { c: HTMLCanvasElement; r1: number; speed: number; phase: number };
type P = { r: number; a: number; sp: number; life: number };
type Spark = { d: number; s: number; v: number; side: number; life: number };

export type Scene = {
  resize(W: number, H: number, dpr: number, Rs: number, low: boolean): void;
  draw(t: number, dark: number, drag: { vx: number; vy: number; held: boolean }): void;
};

export function createScene(ctx: CanvasRenderingContext2D): Scene {
  let W = 560, H = 347, dpr = 1, Rs = 54, low = false;
  let Ri = 0, Ro = 0;
  let rings: Ring[] = [];
  let layer: HTMLCanvasElement = mk(1, 1);
  let lctx = layer.getContext('2d')!;
  let lens: HTMLCanvasElement = mk(1, 1);
  let glowD: HTMLCanvasElement = mk(1, 1);
  let glowL: HTMLCanvasElement = mk(1, 1);
  let beamD: HTMLCanvasElement = mk(1, 1);
  let beamL: HTMLCanvasElement = mk(1, 1);
  let body: HTMLCanvasElement = mk(1, 1);
  let shade: HTMLCanvasElement = mk(1, 1);
  let parts: P[] = [];
  let sparks: Spark[] = [];
  const R = rng(20251016);

  /* ---------------- sprite ---------------- */
  const buildRing = (r0: number, r1: number, seed: number, strands: number): HTMLCanvasElement => {
    const s = dpr;
    const c = mk(r1 * 2 * s, r1 * 2 * s);
    const g = c.getContext('2d')!;
    g.translate(c.width / 2, c.height / 2);
    g.scale(s, s);
    const rnd = rng(seed);
    // emisi halus dasar
    const base = g.createRadialGradient(0, 0, r0, 0, 0, r1);
    const tIn = Math.pow(Ri / r0, 0.9);
    const tOut = Math.pow(Ri / r1, 0.9);
    base.addColorStop(0, rgba(heat(tIn * 0.95), 0));
    base.addColorStop(0.12, rgba(heat(tIn * 0.95), 0.42));
    base.addColorStop(0.55, rgba(heat((tIn + tOut) / 2), 0.32));
    base.addColorStop(1, rgba(heat(tOut * 0.8), 0));
    g.fillStyle = base;
    g.beginPath();
    g.arc(0, 0, r1, 0, TAU);
    g.arc(0, 0, r0, 0, TAU, true);
    g.fill();
    // serat turbulen: busur pendek dengan suhu menurut jari-jari
    g.lineCap = 'round';
    for (let i = 0; i < strands; i++) {
      const f = rnd();
      const r = r0 + (r1 - r0) * f;
      const edge = Math.sin(Math.PI * f); // pudar di tepi cincin biar sambungannya tak terlihat
      const temp = Math.pow(Ri / r, 0.85) * (0.8 + 0.35 * rnd());
      const a0 = rnd() * TAU;
      const len = 0.15 + rnd() * 1.1;
      g.strokeStyle = rgba(heat(temp), (0.12 + rnd() * 0.5) * edge);
      g.lineWidth = 0.5 + rnd() * rnd() * 2.6;
      g.beginPath();
      // sedikit spiral: jari-jari bergeser sepanjang busur
      const dr = (rnd() - 0.5) * (r1 - r0) * 0.12;
      const STEPS = 6;
      for (let k = 0; k <= STEPS; k++) {
        const u = k / STEPS;
        const rr = r + dr * u;
        const aa = a0 + len * u;
        k ? g.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : g.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
      }
      g.stroke();
    }
    // jalur gelap (debu) memotong cahaya
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < strands / 6; i++) {
      const r = r0 + (r1 - r0) * rnd();
      const a0 = rnd() * TAU;
      g.strokeStyle = `rgba(0,0,0,${0.25 + rnd() * 0.4})`;
      g.lineWidth = 0.6 + rnd() * 1.6;
      g.beginPath();
      g.arc(0, 0, r, a0, a0 + 0.3 + rnd() * 0.9);
      g.stroke();
    }
    // gumpalan panas
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 3; i++) {
      const r = r0 + (r1 - r0) * (0.3 + 0.4 * rnd());
      const a = rnd() * TAU;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      const bl = g.createRadialGradient(x, y, 0, x, y, (r1 - r0) * 0.45);
      bl.addColorStop(0, rgba(heat(Math.pow(Ri / r, 0.6) + 0.2), 0.55));
      bl.addColorStop(1, rgba(heat(0.5), 0));
      g.fillStyle = bl;
      g.fillRect(x - r1, y - r1, r1 * 2, r1 * 2);
    }
    return c;
  };

  const buildGlow = (dark: boolean) => {
    const rr = Rs * 3.6;
    const c = mk(rr * 2 * dpr, rr * 2 * dpr);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    const gr = g.createRadialGradient(rr, rr, Rs * 0.7, rr, rr, rr);
    if (dark) {
      gr.addColorStop(0, 'rgba(226,238,255,0.62)');
      gr.addColorStop(0.18, 'rgba(170,196,255,0.24)');
      gr.addColorStop(0.45, 'rgba(255,90,80,0.08)');
      gr.addColorStop(1, 'rgba(200,20,40,0)');
    } else {
      gr.addColorStop(0, 'rgba(120,150,230,0.34)');
      gr.addColorStop(0.2, 'rgba(210,90,90,0.16)');
      gr.addColorStop(0.5, 'rgba(230,120,100,0.06)');
      gr.addColorStop(1, 'rgba(230,120,100,0)');
    }
    g.fillStyle = gr;
    g.fillRect(0, 0, rr * 2, rr * 2);
    return c;
  };

  /* pancaran: kerucut sempit, panjang sprite = 1, digambar ke atas (y negatif) */
  const BEAM_L = () => Rs * 3.1;
  const buildBeam = (dark: boolean) => {
    const L = BEAM_L();
    const w = Rs * 1.1;
    const c = mk(w * 2 * dpr, L * dpr);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    const layers: [number, number][] = [
      [1, 0.16],
      [0.55, 0.26],
      [0.2, 0.55],
      [0.07, 0.8],
    ];
    for (const [wf, a] of layers) {
      const lg = g.createLinearGradient(0, L, 0, 0);
      if (dark) {
        lg.addColorStop(0, `rgba(236,244,255,${a})`);
        lg.addColorStop(0.35, `rgba(170,200,255,${a * 0.5})`);
        lg.addColorStop(1, 'rgba(120,150,255,0)');
      } else {
        lg.addColorStop(0, `rgba(70,90,190,${a * 0.75})`);
        lg.addColorStop(0.4, `rgba(176,30,52,${a * 0.35})`);
        lg.addColorStop(1, 'rgba(176,30,52,0)');
      }
      g.fillStyle = lg;
      g.beginPath();
      g.moveTo(w - Rs * 0.05, L);
      g.lineTo(w + Rs * 0.05, L);
      g.lineTo(w + w * wf, 0);
      g.lineTo(w - w * wf, 0);
      g.closePath();
      g.fill();
    }
    return c;
  };

  /* bayangan sisi belakang piringan yang ditekuk gravitasi → melengkung di atas bola */
  const buildLens = () => {
    const rr = Rs * 1.75;
    const c = mk(rr * 2 * dpr, rr * 2 * dpr);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    g.translate(rr, rr);
    const rnd = rng(77);
    g.lineCap = 'round';
    for (let i = 0; i < 60; i++) {
      const f = rnd();
      const r = Rs * (1.1 + 0.55 * f);
      const a0 = Math.PI + 0.08 + rnd() * (Math.PI - 0.6);
      const len = 0.2 + rnd() * 0.9;
      const mid = a0 + len / 2;
      const beam = 0.45 + 0.55 * (0.5 + 0.5 * Math.cos(mid)); // kanan = mendekat
      g.strokeStyle = rgba(heat(1 - f * 0.75), (0.1 + rnd() * 0.38) * beam * (1 - f * 0.6));
      g.lineWidth = 0.5 + rnd() * 1.5;
      g.beginPath();
      g.arc(0, 0, r, a0, Math.min(TAU - 0.05, a0 + len));
      g.stroke();
    }
    // cincin foton tipis
    g.strokeStyle = 'rgba(255,240,226,0.55)';
    g.lineWidth = 1.1;
    g.beginPath();
    g.arc(0, 0, Rs * 1.12, Math.PI + 0.05, TAU - 0.05);
    g.stroke();
    return c;
  };

  const buildBody = () => {
    const c = mk(Rs * 2 * dpr + 2, Rs * 2 * dpr + 2);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    g.translate(Rs + 0.5, Rs + 0.5);
    const b = g.createRadialGradient(-Rs * 0.3, -Rs * 0.34, Rs * 0.05, 0, 0, Rs);
    b.addColorStop(0, '#ffffff');
    b.addColorStop(0.4, '#f1f6ff');
    b.addColorStop(0.75, '#c9d8ff');
    b.addColorStop(1, '#8aa3ec');
    g.fillStyle = b;
    g.beginPath();
    g.arc(0, 0, Rs, 0, TAU);
    g.fill();
    return c;
  };
  const buildShade = () => {
    const c = mk(Rs * 2.2 * dpr, Rs * 2.2 * dpr);
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    g.translate(Rs * 1.1, Rs * 1.1);
    g.save();
    g.beginPath();
    g.arc(0, 0, Rs, 0, TAU);
    g.clip();
    const term = g.createLinearGradient(-Rs * 0.75, -Rs * 0.75, Rs * 0.95, Rs * 0.95);
    term.addColorStop(0, 'rgba(255,255,255,0)');
    term.addColorStop(0.5, 'rgba(40,60,150,0)');
    term.addColorStop(1, 'rgba(14,22,80,0.52)');
    g.fillStyle = term;
    g.fillRect(-Rs, -Rs, Rs * 2, Rs * 2);
    const limb = g.createRadialGradient(0, 0, Rs * 0.55, 0, 0, Rs);
    limb.addColorStop(0, 'rgba(46,70,176,0)');
    limb.addColorStop(0.8, 'rgba(46,70,176,0.14)');
    limb.addColorStop(1, 'rgba(30,50,150,0.55)');
    g.fillStyle = limb;
    g.fillRect(-Rs, -Rs, Rs * 2, Rs * 2);
    const spec = g.createRadialGradient(-Rs * 0.34, -Rs * 0.42, 0, -Rs * 0.34, -Rs * 0.42, Rs * 0.55);
    spec.addColorStop(0, 'rgba(255,255,255,0.75)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = spec;
    g.fillRect(-Rs, -Rs, Rs * 2, Rs * 2);
    g.restore();
    g.strokeStyle = 'rgba(240,247,255,0.92)';
    g.lineWidth = Math.max(1.2, Rs * 0.032);
    g.beginPath();
    g.arc(0, 0, Rs * 1.004, 0, TAU);
    g.stroke();
    return c;
  };

  const seedParticles = () => {
    const n = low ? 34 : 72;
    parts = [];
    for (let i = 0; i < n; i++) parts.push(newParticle(true));
    sparks = [];
  };
  const newParticle = (anywhere: boolean): P => ({
    r: anywhere ? Ri * 0.95 + (Ro - Ri * 0.95) * Math.pow(R(), 0.8) : Ro * (0.85 + 0.15 * R()),
    a: R() * TAU,
    sp: 0.75 + R() * 0.5,
    life: R(),
  });

  /* ---------------- ukuran ---------------- */
  const resize: Scene['resize'] = (w, h, d, rs, lo) => {
    W = w; H = h; dpr = d; Rs = rs; low = lo;
    Ri = Rs * 1.7;
    Ro = Rs * 4.7;
    const a = Ri, b = Ri + (Ro - Ri) * 0.3, c = Ri + (Ro - Ri) * 0.62;
    const k = low ? 0.55 : 1;
    rings = [
      { c: buildRing(a * 0.97, b * 1.05, 11, 220 * k), r1: b * 1.05, speed: 1.0, phase: 0 },
      { c: buildRing(b * 0.95, c * 1.05, 23, 260 * k), r1: c * 1.05, speed: 1.0 * Math.pow(a / ((b + c) / 2), 1.5) * 1.6, phase: 1.3 },
      { c: buildRing(c * 0.95, Ro, 37, 300 * k), r1: Ro, speed: 1.0 * Math.pow(a / ((c + Ro) / 2), 1.5) * 1.6, phase: 2.6 },
    ];
    layer = mk(W * dpr, H * dpr);
    lctx = layer.getContext('2d')!;
    lens = buildLens();
    glowD = buildGlow(true);
    glowL = buildGlow(false);
    beamD = buildBeam(true);
    beamL = buildBeam(false);
    body = buildBody();
    shade = buildShade();
    seedParticles();
  };

  /* ---------------- frame ---------------- */
  let lastT = 0;
  const draw: Scene['draw'] = (t, dark, drag) => {
    const dt = Math.min(0.05, Math.max(0, t - lastT));
    lastT = t;
    const cx = W / 2;
    const cy = H / 2;
    // seretan memiringkan piringan (pegas halus di pemanggil), dibatasi
    const roll = -0.13 + Math.max(-0.35, Math.min(0.35, drag.vx * 0.00022));
    const KY = Math.max(0.12, Math.min(0.34, 0.2 + drag.vy * 0.00009));
    const speed = Math.min(1, Math.hypot(drag.vx, drag.vy) / 1800);

    /* --- piringan ke layer terpisah, lalu diberi beaming --- */
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalCompositeOperation = 'source-over';
    lctx.clearRect(0, 0, layer.width, layer.height);
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.translate(cx, cy);
    lctx.rotate(roll);
    lctx.scale(1, KY);
    for (const ring of rings) {
      lctx.save();
      lctx.rotate(ring.phase + t * ring.speed * 0.55);
      lctx.drawImage(ring.c, -ring.r1, -ring.r1, ring.r1 * 2, ring.r1 * 2);
      lctx.restore();
    }
    // relativistic beaming: kanan bergerak ke arah kita → terang; kiri menjauh → redup & lebih merah
    lctx.globalCompositeOperation = 'destination-out';
    const dim = lctx.createLinearGradient(-Ro, 0, Ro, 0);
    dim.addColorStop(0, 'rgba(0,0,0,0.72)');
    dim.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    dim.addColorStop(1, 'rgba(0,0,0,0)');
    lctx.fillStyle = dim;
    lctx.fillRect(-Ro, -Ro, Ro * 2, Ro * 2);
    lctx.globalCompositeOperation = 'source-atop';
    const blue = lctx.createLinearGradient(-Ro, 0, Ro, 0);
    blue.addColorStop(0.45, 'rgba(255,250,244,0)');
    blue.addColorStop(1, 'rgba(255,250,244,0.32)');
    lctx.fillStyle = blue;
    lctx.fillRect(-Ro, -Ro, Ro * 2, Ro * 2);

    const ctxT = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxT();
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    const halfClip = (front: boolean) => {
      ctx.beginPath();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(roll);
      ctx.rect(-W, front ? 0 : -H * 2, W * 2, H * 2);
      ctx.restore();
      ctx.clip();
    };
    const blitLayer = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0);
      ctxT();
    };

    /* 1. pendar luas di belakang semuanya */
    const pulseBase = 0.88 + 0.08 * Math.sin(t * 2.1) + 0.04 * Math.sin(t * 5.3);

    /* pancaran pulsar: sumbu putar ≈ tegak (ikut roll), sumbu magnet miring α */
    const alpha = 0.42;
    const incl = 0.22;
    const phi = t * 1.35;
    // vektor pancaran di kerangka putar: x kanan, y atas, z ke arah penonton
    let bx = Math.sin(alpha) * Math.cos(phi);
    let by = Math.cos(alpha);
    let bz = Math.sin(alpha) * Math.sin(phi);
    // condongkan sumbu putar sedikit ke arah penonton
    const by2 = by * Math.cos(incl) - bz * Math.sin(incl);
    const bz2 = by * Math.sin(incl) + bz * Math.cos(incl);
    by = by2;
    bz = bz2;
    const flash = Math.pow(Math.max(0, bz), 6) * 0.9 + Math.pow(Math.max(0, -bz), 6) * 0.25;
    const pulse = pulseBase + flash * 0.6 + speed * 0.25;

    const drawGlow = (a: number) => {
      const rr = Rs * 3.6 * (1 + flash * 0.08);
      if (dark > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(1, a * dark);
        ctx.drawImage(glowD, cx - rr, cy - rr, rr * 2, rr * 2);
      }
      if (dark < 0.99) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = Math.min(1, a * (1 - dark));
        ctx.drawImage(glowL, cx - rr, cy - rr, rr * 2, rr * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };
    drawGlow(pulse);

    /* 2. setengah belakang piringan */
    ctx.save();
    halfClip(false);
    blitLayer();
    ctx.restore();

    /* 3. pancaran (dua arah) */
    const drawBeam = (sx: number, sy: number, sz: number) => {
      const proj = Math.hypot(sx, sy);
      if (proj < 0.04) return;
      const ang = Math.atan2(sx, sy) + roll; // 0 = ke atas
      const L = BEAM_L() * (0.25 + 0.75 * proj) * (1 + Math.max(0, sz) * 0.15);
      const w = Rs * 1.1;
      const a = (0.55 + 0.45 * proj) * (0.9 + 0.1 * Math.sin(t * 9.1));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      if (dark > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * dark;
        ctx.drawImage(beamD, -w, -L, w * 2, L);
      }
      if (dark < 0.99) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a * (1 - dark) * 0.85;
        ctx.drawImage(beamL, -w, -L, w * 2, L);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };
    drawBeam(bx, by, bz);
    drawBeam(-bx, -by, -bz);

    /* 4. pendar lensa (citra belakang piringan, melengkung di atas bola) */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(roll);
    const lr = Rs * 1.75;
    const shimmer = 0.85 + 0.15 * Math.sin(t * 3.3) + speed * 0.4;
    ctx.globalAlpha = Math.min(1, (dark > 0.5 ? 0.95 : 0.8) * shimmer);
    ctx.scale(1, 0.92 + (KY - 0.2) * 0.6);
    ctx.drawImage(lens, -lr, -lr, lr * 2, lr * 2);
    if (!low) {
      // citra kedua, lebih tipis, di bawah bola
      ctx.scale(0.96, -0.5);
      ctx.globalAlpha = 0.32 * shimmer;
      ctx.drawImage(lens, -lr, -lr, lr * 2, lr * 2);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    /* 5. bola bintang + gumpalan permukaan yang berputar */
    ctx.drawImage(body, cx - Rs - 0.5 / dpr, cy - Rs - 0.5 / dpr, Rs * 2 + 2 / dpr, Rs * 2 + 2 / dpr);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Rs * 0.995, 0, TAU);
    ctx.clip();
    const spin = t * 1.15;
    const feats: [number, number, number, boolean][] = low
      ? [[0, 0.42, 0.6, true], [2.9, 0.34, 0.5, false]]
      : [[0, 0.42, 0.6, true], [1.7, 0.3, 0.45, false], [2.9, 0.34, 0.52, true], [4.4, 0.28, 0.42, false]];
    for (const [ph, size, amp, hot] of feats) {
      const a = ph + spin;
      const ca = Math.cos(a);
      if (ca <= 0.06) continue;
      const x = cx + ca * Rs * 0.58;
      const y = cy + Math.sin(a) * Rs * 0.3 - Rs * 0.05;
      const al = Math.min(1, ca * 1.7) * amp;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.3 + 0.7 * ca, 1);
      const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, Rs * size);
      if (hot) {
        rg.addColorStop(0, `rgba(255,255,255,${al})`);
        rg.addColorStop(0.45, `rgba(255,240,226,${al * 0.5})`);
        rg.addColorStop(1, 'rgba(255,236,220,0)');
      } else {
        rg.addColorStop(0, `rgba(70,96,204,${al * 0.55})`);
        rg.addColorStop(1, 'rgba(140,170,240,0)');
      }
      ctx.fillStyle = rg;
      ctx.fillRect(-Rs * size, -Rs * size, Rs * size * 2, Rs * size * 2);
      ctx.restore();
    }
    // titik panas di kutub magnet (ikut sapuan pancaran)
    if (bz > -0.2) {
      const px = cx + Math.sin(Math.atan2(bx, by) + roll) * Rs * 0.62 * Math.hypot(bx, by);
      const py = cy - Math.cos(Math.atan2(bx, by) + roll) * Rs * 0.62 * Math.hypot(bx, by);
      const hs = ctx.createRadialGradient(px, py, 0, px, py, Rs * 0.32);
      hs.addColorStop(0, `rgba(255,255,255,${0.55 + flash * 0.4})`);
      hs.addColorStop(1, 'rgba(220,235,255,0)');
      ctx.fillStyle = hs;
      ctx.fillRect(px - Rs * 0.32, py - Rs * 0.32, Rs * 0.64, Rs * 0.64);
    }
    ctx.restore();
    const sr = Rs * 1.1;
    ctx.drawImage(shade, cx - sr, cy - sr, sr * 2, sr * 2);

    /* 6. setengah depan piringan */
    ctx.save();
    halfClip(true);
    blitLayer();
    ctx.restore();

    /* 7. partikel berspiral masuk (Kepler), tertinggal sedikit saat diseret */
    const cr = Math.cos(roll);
    const sn = Math.sin(roll);
    const lagX = -drag.vx * 0.012;
    const lagY = -drag.vy * 0.012;
    ctx.globalCompositeOperation = dark > 0.5 ? 'lighter' : 'source-over';
    for (const p of parts) {
      const w = 1.25 * Math.pow(Ri / p.r, 1.5) * p.sp;
      p.a += w * dt;
      p.r -= Rs * 0.05 * (Ri / p.r) * dt * (1 + speed * 2);
      p.life += dt * 0.2;
      if (p.r < Rs * 1.15) Object.assign(p, newParticle(false));
      const lx = Math.cos(p.a) * p.r;
      const ly = Math.sin(p.a) * p.r * KY;
      const front = ly > 0;
      const lagF = p.r / Ro;
      const x = cx + lx * cr - ly * sn + lagX * lagF;
      const y = cy + lx * sn + ly * cr + lagY * lagF;
      if (!front && Math.hypot(x - cx, y - cy) < Rs * 1.02) continue; // tertutup bola
      const temp = Math.pow(Ri / p.r, 0.8);
      const beam = 0.4 + 0.6 * (0.5 + 0.5 * Math.cos(p.a)); // cos(a)>0 = sisi kanan = mendekat
      const col = heat(dark > 0.5 ? temp : Math.min(0.55, temp * 0.7));
      const al = (front ? 0.9 : 0.5) * beam * (0.6 + 0.4 * Math.sin(p.life * 7));
      ctx.fillStyle = rgba(col, Math.max(0, al));
      const s = (front ? 1.7 : 1.2) * (0.7 + temp * 0.6);
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }

    /* 8. percikan di kutub, terbawa pancaran */
    if (!low && R() < dt * 9) {
      sparks.push({ d: Rs * 1.05, s: 0.6 + R() * 0.8, v: Rs * (1.4 + R() * 1.6), side: R() < 0.5 ? 1 : -1, life: 1 });
    }
    const ang0 = Math.atan2(bx, by) + roll;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.d += s.v * dt;
      s.life -= dt * 0.9;
      if (s.life <= 0 || s.d > BEAM_L()) {
        sparks.splice(i, 1);
        continue;
      }
      const a = ang0 + (s.side < 0 ? Math.PI : 0) + (s.s - 1) * 0.12;
      const x = cx + Math.sin(a) * s.d;
      const y = cy - Math.cos(a) * s.d;
      ctx.fillStyle = dark > 0.5 ? `rgba(220,232,255,${s.life * 0.8})` : `rgba(60,80,180,${s.life * 0.6})`;
      ctx.fillRect(x - 1, y - 1, 1.8, 1.8);
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  return { resize, draw };
}
