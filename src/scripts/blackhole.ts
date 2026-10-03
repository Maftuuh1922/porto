/* Hero bintang neutron + fisika teks kesedot + drag per obyek.
   Dua kanvas: #bh-canvas (bintang neutronnya), #bh-rays (sinar cahaya yang ditekuk).
   Bedanya dengan lubang hitam: ada permukaan padat yang menyala, jadi sinar yang
   "tertangkap" di sini berarti menembus permukaan bintang. */

const TAU = Math.PI * 2;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SHELL = 2.6; // parameter benturan kritis b_c (satuan r_s)

type Ray = { b: number; pts: [number, number][]; captured: boolean; defl: number };

/* ---- jejak sinar: ODE sederhana, tarikan ke pusat, kalau tembus r<1 = tertangkap ---- */
function trace(b: number): Ray {
  let x = -7;
  let y = b;
  let vx = 1;
  let vy = 0;
  const dt = 0.035;
  const pts: [number, number][] = [[x, y]];
  let captured = false;
  for (let i = 0; i < 1400; i++) {
    const r2 = x * x + y * y;
    if (r2 < 1) {
      captured = true;
      break;
    }
    const k = SHELL / 2; // b_c = 2k untuk v=1
    vx += (-k * x) / (r2 * Math.sqrt(r2)) * dt;
    vy += (-k * y) / (r2 * Math.sqrt(r2)) * dt;
    x += vx * dt;
    y += vy * dt;
    if (i % 4 === 0) pts.push([x, y]);
    if (x > 7 && vx > 0) break;
  }
  const defl = (Math.abs(Math.atan2(vy, vx)) * 180) / Math.PI;
  return { b, pts, captured, defl };
}

/* ---- lilitan teks jadi kata-kata .gw ---- */
function splitWords(root: HTMLElement): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(s) {
      const e = s.parentElement;
      if (!e || e.closest('.gw, .gw-keep, svg, script, style, .desk-object, img, .bh-readout'))
        return NodeFilter.FILTER_REJECT;
      return s.nodeValue && s.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    for (const part of (node.nodeValue || '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
      else {
        const s = document.createElement('span');
        s.className = 'gw';
        s.textContent = part;
        frag.appendChild(s);
      }
    }
    // gabungkan tanda baca yang menggantung di awal kata sebelumnya
    let prev = node.previousSibling;
    while (prev instanceof HTMLScriptElement || prev instanceof HTMLStyleElement) prev = prev.previousSibling;
    const first = frag.firstChild;
    if (prev instanceof HTMLElement && first instanceof HTMLElement && /^[,.;:!?’”)]/.test(first.textContent || '')) {
      const keep = document.createElement('span');
      keep.className = 'gw-keep';
      prev.replaceWith(keep);
      keep.append(prev, first);
    }
    node.parentNode?.replaceChild(frag, node);
  }
}

export function initBlackHole(): void {
  const obj = document.getElementById('bh-object') as HTMLElement | null;
  const canvas = document.getElementById('bh-canvas') as HTMLCanvasElement | null;
  const rayCanvas = document.getElementById('bh-rays') as HTMLCanvasElement | null;
  const readout = document.getElementById('bh-readout');
  if (!obj || !canvas || canvas.dataset.bhInit) return;
  canvas.dataset.bhInit = '1';

  const ctx = canvas.getContext('2d');
  const rctx = rayCanvas?.getContext('2d') || null;
  if (!ctx) {
    obj.hidden = true;
    return;
  }

  /* ---------- ukuran ---------- */
  let W = 560;
  let H = 347;
  let dpr = 1;
  let Rs = 54;
  const resize = () => {
    const r = obj.getBoundingClientRect();
    W = Math.max(240, r.width);
    H = Math.max(150, r.height || (W * 347) / 560);
    dpr = Math.min(devicePixelRatio || 1, 2) * 1.25;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    if (rayCanvas) {
      rayCanvas.width = Math.round(W * dpr);
      rayCanvas.height = Math.round(H * dpr);
    }
    Rs = H * 0.155;
    g = 0.17 * H * 1.02;
    buildDisk();
    rays = BS.map(trace);
    drawRays(null);
  };

  /* ---------- piringan akresi ---------- */
  const Ri = () => Rs * 1.75;
  const Ro = () => Rs * 4.6;
  let dashes: number[][] = [];
  const buildDisk = () => {
    dashes = [];
    for (let i = 0; i < 30; i++) {
      const pat: number[] = [];
      let s = i * 7.7 + 3.1;
      for (let k = 0; k < 8; k++) {
        s = (s * 9301 + 49297) % 233280;
        pat.push(9 + (s / 233280) * 46);
      }
      dashes.push(pat);
    }
  };

  const ROLL = -0.13; // miring piringan
  const KY = 0.2; // apitan elips (dilihat hampir dari pinggir)

  const ring = (r: number, alpha: number, front: boolean, glow: number, dashPhase: number, dash: number[]) => {
    const rx = r;
    const ry = r * KY;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(ROLL);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = glow;
    ctx.setLineDash(dash);
    ctx.lineDashOffset = -dashPhase;
    const a0 = front ? 0 : Math.PI;
    const a1 = front ? Math.PI : TAU;
    // Doppler: sisi yang mendekat lebih terang
    const g = ctx.createLinearGradient(-rx, 0, rx, 0);
    const inner = 1 - (r - Ri()) / (Ro() - Ri());
    g.addColorStop(0, `rgba(228,240,255,${alpha})`);
    g.addColorStop(0.45, `rgba(150,204,255,${alpha * 0.72})`);
    g.addColorStop(1, `rgba(56,104,214,${alpha * 0.3 * inner + 0.05})`);
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, a0, a1);
    ctx.stroke();
    ctx.restore();
  };

  const drawHole = (t: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const n = 30;
    const inner = Ri();
    const outer = Ro();

    // setengah belakang (melewati di balik lubang)
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const r = inner + (outer - inner) * Math.pow(f, 1.35);
      const fall = Math.pow(1 - f, 1.4);
      const alpha = 0.05 + 0.34 * fall;
      const kep = Math.pow(inner / r, 1.5);
      ring(r, alpha, false, ((outer - inner) / n) * 1.5, t * kep * 170, dashes[i]);
    }

    // pancaran pulsar di kedua sumbu rotasi — tanda bintang ini berputar cepat
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(ROLL + Math.PI / 2 + Math.sin(t * 0.35) * 0.05);
    ctx.globalCompositeOperation = 'lighter';
    const beamLen = Rs * 3.2;
    for (const dir of [1, -1]) {
      const bg = ctx.createLinearGradient(0, 0, 0, dir * beamLen);
      bg.addColorStop(0, 'rgba(232,242,255,0.5)');
      bg.addColorStop(0.35, 'rgba(150,192,255,0.18)');
      bg.addColorStop(1, 'rgba(90,130,255,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.moveTo(-Rs * 0.17, 0);
      ctx.lineTo(Rs * 0.17, 0);
      ctx.lineTo(Rs * 0.66, dir * beamLen);
      ctx.lineTo(-Rs * 0.66, dir * beamLen);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // pendar bintang neutron (denyut pelan)
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 0.85 + 0.15 * Math.sin(t * 2.1);
    const bloom = ctx.createRadialGradient(W / 2, H / 2, Rs * 0.55, W / 2, H / 2, Rs * 3.3);
    bloom.addColorStop(0, `rgba(224,238,255,${0.6 * pulse})`);
    bloom.addColorStop(0.3, `rgba(146,182,255,${0.22 * pulse})`);
    bloom.addColorStop(1, 'rgba(70,104,220,0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, Rs * 3.3, 0, TAU);
    ctx.fill();

    // halo pelensaan — cahaya di sekitar bintang yang dibengkokkan
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(150,186,255,${0.3 - k * 0.08})`;
      ctx.lineWidth = Rs * 0.16;
      ctx.arc(W / 2, H / 2, Rs * (1.14 + k * 0.2), Math.PI, TAU);
      ctx.stroke();
    }

    // permukaan padat bintang neutron: putih menyilaukan di pusat, biru di tepi
    ctx.globalCompositeOperation = 'source-over';
    const body = ctx.createRadialGradient(W / 2 - Rs * 0.28, H / 2 - Rs * 0.3, Rs * 0.08, W / 2, H / 2, Rs);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(0.42, '#f2f6ff');
    body.addColorStop(0.74, '#ccdbff');
    body.addColorStop(1, '#7fa0f2');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, Rs, 0, TAU);
    ctx.fill();

    // dua bintik panas mengorbit di permukaan (lihat putarannya)
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, Rs * 0.995, 0, TAU);
    ctx.clip();
    ctx.translate(W / 2, H / 2);

    // meridian + garis lintang: permukaan yang menyapu, putarannya jelas terlihat
    ctx.globalCompositeOperation = 'source-over';
    const spin = t * 1.35;
    for (let i = 0; i < 6; i++) {
      const ph = spin + (i * Math.PI) / 6;
      const f = Math.abs(Math.sin(ph));
      if (f < 0.07) continue;
      ctx.strokeStyle = `rgba(96,124,214,${0.1 + 0.17 * f})`;
      ctx.lineWidth = Math.max(1, Rs * (0.03 + 0.045 * f));
      ctx.beginPath();
      ctx.ellipse(0, 0, Rs * f, Rs * 0.985, 0, 0, TAU);
      ctx.stroke();
    }
    for (const lat of [0.34, 0.66]) {
      ctx.strokeStyle = 'rgba(110,140,225,0.14)';
      ctx.lineWidth = Math.max(1, Rs * 0.03);
      ctx.beginPath();
      ctx.ellipse(0, 0, Rs * Math.sqrt(1 - lat * lat), Rs * lat, 0, 0, TAU);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'lighter';
    for (const [phase, sp, size, w] of [
      [0.2, 2.3, 0.5, 0.9],
      [Math.PI + 0.6, 2.3, 0.42, 0.55],
    ] as const) {
      const a = phase + t * sp;
      const sx = Math.cos(a) * Rs * 0.5;
      const sy = Math.sin(a) * Rs * 0.32;
      const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, Rs * size);
      rg.addColorStop(0, `rgba(255,255,255,${w})`);
      rg.addColorStop(0.45, `rgba(255,244,224,${w * 0.42})`);
      rg.addColorStop(1, 'rgba(170,204,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(sx, sy, Rs * size, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    // limb: tepi bintang yang tajam (lihat dari jauh)
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(236,244,255,0.95)';
    ctx.lineWidth = Math.max(1.6, Rs * 0.05);
    ctx.arc(W / 2, H / 2, Rs * 1.01, 0, TAU);
    ctx.stroke();

    // dua simpul panas yang mengorbit di piringan — tanda "ini berputar"
    for (const [rad, phase, sp, w] of [
      [inner * 1.3, 0.4, 1.7, 0.5],
      [inner * 1.75, 2.5, 1.1, 0.38],
    ] as const) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(ROLL);
      ctx.globalCompositeOperation = 'lighter';
      const a = phase + t * sp;
      const grad = ctx.createLinearGradient(-rad, 0, rad, 0);
      grad.addColorStop(0, `rgba(255,255,255,${w})`);
      grad.addColorStop(1, `rgba(168,214,255,${w * 0.55})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(2, rad * KY * 1.7);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.ellipse(0, 0, rad, rad * KY, 0, a - 0.5, a + 0.5);
      ctx.stroke();
      ctx.restore();
    }

    // setengah depan (menutupi bayangan)
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const r = inner + (outer - inner) * Math.pow(f, 1.35);
      const fall = Math.pow(1 - f, 1.4);
      const alpha = 0.07 + 0.46 * fall;
      const kep = Math.pow(inner / r, 1.5);
      ring(r, alpha, true, ((outer - inner) / n) * 1.6, t * kep * 170, dashes[i]);
    }

    // cahaya yang lolos di tepi bayangan
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(120,150,255,0.35)';
    ctx.lineWidth = Rs * 0.5;
    ctx.arc(W / 2, H / 2, Rs * 1.3, 0, TAU);
    ctx.stroke();
  };

  /* ---------- kanvas sinar ---------- */
  const BS = [-6, -4.4, -3.1, -2.05, -1.1, 1.1, 2.05, 3.1, 4.4, 6];
  let rays: Ray[] = BS.map(trace);
  let hoverIdx = -1;

  const drawRays = (live: number | null) => {
    if (!rctx) return;
    rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rctx.clearRect(0, 0, W, H);
    rctx.lineWidth = 1;
    rctx.strokeStyle = 'rgba(27,26,31,0.16)';
    rays.forEach((ray, i) => {
      if (i === hoverIdx) return;
      rctx.beginPath();
      ray.pts.forEach(([x, y], k) => {
        const px = W / 2 + x * Rs;
        const py = H / 2 - y * Rs;
        k ? rctx!.lineTo(px, py) : rctx!.moveTo(px, py);
      });
      rctx.stroke();
    });
    if (hoverIdx >= 0 && rays[hoverIdx]) {
      const ray = rays[hoverIdx];
      rctx.lineWidth = 1.6;
      rctx.strokeStyle = '#6b46c1';
      rctx.beginPath();
      ray.pts.forEach(([x, y], k) => {
        const px = W / 2 + x * Rs;
        const py = H / 2 - y * Rs;
        k ? rctx!.lineTo(px, py) : rctx!.moveTo(px, py);
      });
      rctx.stroke();
      if (readout) {
        readout.classList.add('is-live');
        readout.textContent = ray.captured
          ? `b = ${Math.abs(ray.b).toFixed(2)} R < ${SHELL.toFixed(2)} R · menembus permukaan`
          : `b = ${Math.abs(ray.b).toFixed(2)} R · ditekuk ${ray.defl.toFixed(0)}°`;
      }
      void live;
    }
  };

  const idleReadout = () => {
    if (readout) {
      readout.classList.remove('is-live');
      readout.textContent = readout.dataset.idle || '';
    }
    hoverIdx = -1;
    drawRays(null);
  };

  /* ---------- drag (lubang hitam & benda di halaman about) ---------- */
  const dragged: HTMLElement[] = [];
  const springFor = (el: HTMLElement) => {
    let dx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
    let dy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
    let vx = 0;
    let vy = 0;
    let last = performance.now();
    let raf = 0;
    const set = (x: number, y: number) => {
      el.style.setProperty('--dx', `${x}px`);
      el.style.setProperty('--dy', `${y}px`);
    };
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vx += (-60 * dx - 9.6 * vx) * dt;
      vy += (-60 * dy - 9.6 * vy) * dt;
      dx += vx * dt;
      dy += vy * dt;
      set(dx, dy);
      if (Math.hypot(dx, dy) > 0.3 || Math.hypot(vx, vy) > 2) raf = requestAnimationFrame(step);
      else {
        set(0, 0);
        raf = 0;
      }
    };
    return {
      set,
      get: () => [dx, dy] as const,
      add: (x: number, y: number) => {
        dx += x;
        dy += y;
        set(dx, dy);
      },
      throwTo: (ax: number, ay: number) => {
        vx = ax;
        vy = ay;
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      },
      stop: () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      },
      reset: () => {
        dx = dy = vx = vy = 0;
        set(0, 0);
      },
    };
  };

  const initDrag = (el: HTMLElement) => {
    if (el.dataset.dragInit) return;
    el.dataset.dragInit = '1';
    const spring = springFor(el);
    dragged.push(el);
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;
    let rect: DOMRect | null = null;
    let lastPX = 0;
    let lastPY = 0;
    let lastT = 0;
    let vx = 0;
    let vy = 0;
    let moved = false;
    let timeout = 0;

    el.addEventListener('pointerdown', (e) => {
      const ev = e as PointerEvent;
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      spring.stop();
      startX = lastPX = ev.clientX;
      startY = lastPY = ev.clientY;
      lastT = performance.now();
      vx = vy = 0;
      const [bx, by] = spring.get();
      baseX = bx;
      baseY = by;
      rect = el.getBoundingClientRect();
      moved = false;
      el.setPointerCapture(ev.pointerId);
      el.classList.add('dragging');
      document.body.style.userSelect = 'none';
    });

    el.addEventListener('pointermove', (e) => {
      const ev = e as PointerEvent;
      if (!el.classList.contains('dragging') || !rect) return;
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;
      const vw = document.documentElement.clientWidth;
      dx = Math.min(Math.max(dx, 8 - rect.left), vw - 8 - rect.right);
      dy = Math.max(dy, -(rect.top + window.scrollY));
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      const now = performance.now();
      const dt = Math.max(0.001, (now - lastT) / 1000);
      vx = vx * 0.6 + ((ev.clientX - lastPX) / dt) * 0.4;
      vy = vy * 0.6 + ((ev.clientY - lastPY) / dt) * 0.4;
      lastPX = ev.clientX;
      lastPY = ev.clientY;
      lastT = now;
      spring.set(baseX + dx, baseY + dy);
      if (el === obj) idleReadout();
    });

    const end = () => {
      if (!el.classList.contains('dragging')) return;
      el.classList.remove('dragging');
      el.classList.add('just-dropped');
      clearTimeout(timeout);
      timeout = window.setTimeout(() => el.classList.remove('just-dropped'), 1800);
      document.body.style.userSelect = '';
      if (performance.now() - lastT > 80) {
        vx = 0;
        vy = 0;
      }
      // hanya benda bertanda data-return yang melenting kembali ke tempatnya
      if (el.dataset.return !== undefined) {
        if (REDUCED) spring.reset();
        else spring.throwTo(Math.max(-2500, Math.min(2500, vx)), Math.max(-2500, Math.min(2500, vy)));
      }
      measure();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  };

  /* ---------- fisika kata kesedot ---------- */
  type Word = { el: HTMLElement; cx: number; cy: number; x: number; y: number; vx: number; vy: number;
                rot: number; w: number; sx: number; op: number; captured: boolean; active: boolean };
  let words: Word[] = [];
  const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-gravity]'));
  let g = 60;

  const measure = () => {
    words.forEach((w) => {
      w.el.style.transform = '';
      w.el.style.opacity = '';
    });
    words = [];
    for (const zone of zones)
      zone.querySelectorAll<HTMLElement>('.gw').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        words.push({
          el,
          cx: r.left + r.width / 2 + window.scrollX,
          cy: r.top + r.height / 2 + window.scrollY,
          x: 0, y: 0, vx: 0, vy: 0, rot: 0, w: 0, sx: 1, op: 1,
          captured: false, active: false,
        });
      });
  };

  const gravity = (dt: number) => {
    const cr = canvas.getBoundingClientRect();
    const hx = cr.left + cr.width / 2 + window.scrollX;
    const hy = cr.top + cr.height / 2 + window.scrollY;
    const strength = g * g * 3000;
    for (const w of words) {
      const curX = w.cx + w.x;
      const curY = w.cy + w.y;
      const nx = hx - curX;
      const ny = hy - curY;
      const d = Math.hypot(nx, ny) || 0.001;
      if (w.captured) {
        if (d > g * 2.2) {
          w.captured = false;
          w.vx = w.vy = 0;
        } else {
          w.x = hx - w.cx;
          w.y = hy - w.cy;
          w.op += (0 - w.op) * 0.25;
          w.sx = Math.max(0.12, w.sx * 0.9);
        }
      } else {
        // gaya dipangkas mulus jadi nol di luar jangkauan, supaya kata yang
        // sudah lepas benar-benar kembali ke tempat aslinya
        const reach = 1 - Math.min(1, Math.max(0, (d - g * 1.4) / (g * 1.6)));
        const j = Math.max(d, g * 0.6);
        const F = (strength / (j * j)) * reach * reach;
        const fx = (F * nx) / d - 40 * w.x - 8 * w.vx;
        const fy = (F * ny) / d - 40 * w.y - 8 * w.vy;
        w.vx += fx * dt;
        w.vy += fy * dt;
        const sp = Math.hypot(w.vx, w.vy);
        if (sp > 2400) {
          w.vx *= 2400 / sp;
          w.vy *= 2400 / sp;
        }
        w.x += w.vx * dt;
        w.y += w.vy * dt;
        const torque = (nx * w.vy - ny * w.vx) / (d * d);
        w.w += (torque * 57.3 * 0.6 - w.w) * 0.1 - w.rot * 0.02;
        w.rot += w.w * dt;
        w.rot *= 0.995;
        const near = Math.min(1, Math.max(0, (d - g * 0.9) / (g * 0.8)));
        const target = 0.25 + 0.75 * near;
        w.sx += (target - w.sx) * 0.2;
        w.op += (near - w.op) * 0.2;
        if (d < g * 0.85) w.captured = true;
      }
      const idle = Math.abs(w.x) < 0.05 && Math.abs(w.y) < 0.05 && Math.abs(w.sx - 1) < 0.002 && Math.abs(w.rot) < 0.1;
      if (!idle) {
        w.el.style.transform = `translate(${w.x.toFixed(1)}px, ${w.y.toFixed(1)}px) rotate(${w.rot.toFixed(1)}deg) scale(${w.sx.toFixed(3)})`;
        w.el.style.opacity = w.op.toFixed(3);
        w.active = true;
      } else if (w.active) {
        w.el.style.transform = '';
        w.el.style.opacity = '';
        w.active = false;
      }
    }
  };

  /* ---------- loop utama ---------- */
  let running = false;
  let visible = true;
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    if (!REDUCED) drawHole(t);
    else drawHole(0);
    gravity(Math.min(0.032, 1 / 60));
    running = visible && !document.hidden;
    if (running) requestAnimationFrame(frame);
  };
  const start = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
  };

  document.querySelectorAll<HTMLElement>('.desk-object').forEach(initDrag);
  zones.forEach(splitWords);
  resize();
  measure();

  new ResizeObserver(() => {
    resize();
    measure();
  }).observe(obj);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(obj);

  obj.addEventListener('pointerdown', idleReadout);
  obj.addEventListener('pointerleave', idleReadout);
  obj.addEventListener('pointermove', (e) => {
    if (obj.classList.contains('dragging')) return;
    const r = canvas.getBoundingClientRect();
    const v = -((e.clientY - (r.top + r.height / 2)) / Rs);
    if (Math.abs(v) > 7.5) {
      idleReadout();
      return;
    }
    let best = -1;
    let bestD = 1e9;
    rays.forEach((ray, i) => {
      const dd = Math.abs(ray.b - v);
      if (dd < bestD) {
        bestD = dd;
        best = i;
      }
    });
    hoverIdx = best;
    drawRays(v);
  });

  addEventListener('resize', () => {
    resize();
    measure();
  });

  if (REDUCED) drawHole(0);
  else start();
}
