/* Hero bintang neutron + fisika teks kesedot + drag per obyek.
   Dua kanvas: #bh-canvas (bintang neutronnya), #bh-rays (sinar cahaya yang ditekuk).
   Bedanya dengan lubang hitam: ada permukaan padat yang menyala, jadi sinar yang
   "tertangkap" di sini berarti menembus permukaan bintang. */

import { createScene } from './ns-render';

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
    // dibatasi 1,5× (1× di mode hemat): selisih ketajamannya tak terlihat, bebannya 1,8× lipat
    dpr = Math.min(devicePixelRatio || 1, low ? 1 : 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    if (rayCanvas) {
      rayCanvas.width = Math.round(W * dpr);
      rayCanvas.height = Math.round(H * dpr);
    }
    Rs = H * 0.155;
    g = 0.17 * H * 1.02;
    scene.resize(W, H, dpr, Rs, low);
    if (REDUCED) drawHole(14);
    rays = BS.map(trace);
    drawRays(null);
  };

  /* ---------- adegan (sprite, lihat ns-render.ts) ---------- */
  const scene = createScene(ctx);
  let low = false; // mode hemat: dipakai otomatis kalau frame terlalu lambat
  const isDark = () => document.documentElement.dataset.theme === 'dark';
  let darkMix = isDark() ? 1 : 0;
  const drag = { vx: 0, vy: 0, held: false };
  let pdx = 0, pdy = 0, ptime = performance.now();
  const drawHole = (t: number) => {
    // kecepatan seret dari --dx/--dy, dihaluskan
    const now = performance.now();
    const dx = parseFloat(obj.style.getPropertyValue('--dx')) || 0;
    const dy = parseFloat(obj.style.getPropertyValue('--dy')) || 0;
    const ddt = Math.max(0.008, (now - ptime) / 1000);
    drag.vx += ((dx - pdx) / ddt - drag.vx) * 0.18;
    drag.vy += ((dy - pdy) / ddt - drag.vy) * 0.18;
    pdx = dx; pdy = dy; ptime = now;
    drag.held = obj.classList.contains('dragging');
    darkMix += ((isDark() ? 1 : 0) - darkMix) * (REDUCED ? 1 : 0.08);
    scene.draw(t, darkMix, drag);
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
    rctx.strokeStyle = document.documentElement.dataset.theme === 'dark' ? 'rgba(255,240,236,0.16)' : 'rgba(60,14,20,0.18)';
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
      rctx.strokeStyle = '#d11a2a';
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

  /* ---------- loop utama ----------
     - prefers-reduced-motion: bintang digambar diam satu kali; loop hanya hidup
       selama ada yang diseret / kata yang sedang kembali.
     - laptop lemah: kalau rata-rata frame > 20 ms, pindah ke mode hemat
       (dpr 1, partikel separuh, tekstur lebih ringan) dan gambar di 30 fps. */
  let running = false;
  let visible = true;
  const t0 = performance.now();
  let ema = 16;
  let slowFrames = 0;
  let lastFrame = 0;
  let skip = false;
  let frameN = 0;
  const wordsBusy = () => words.some((w) => w.active);
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    if (!REDUCED) {
      const gap = lastFrame ? now - lastFrame : 16;
      lastFrame = now;
      if (!skip) {
        const s0 = performance.now();
        drawHole(t);
        const cost = performance.now() - s0;
        ema = ema * 0.92 + Math.max(cost, low ? 0 : gap * 0.5) * 0.08;
        if (!low && ema > 20) {
          if (++slowFrames > 45) {
            low = true;
            resize();
          }
        } else slowFrames = 0;
      }
      if (low) skip = !skip; // 30 fps
      if ((++frameN & 63) === 0) obj.dataset.q = `${low ? 'hemat' : 'penuh'} ${ema.toFixed(1)}ms`;
    }
    gravity(Math.min(0.032, 1 / 60));
    const keep = REDUCED ? obj.classList.contains('dragging') || wordsBusy() : true;
    running = visible && !document.hidden && keep;
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
  if (REDUCED) {
    obj.addEventListener('pointerdown', () => start());
    new MutationObserver(() => {
      darkMix = isDark() ? 1 : 0;
      drawHole(14);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible && !REDUCED) start();
  });

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
    if (visible && !REDUCED) start();
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

  if (!REDUCED) start();
}
