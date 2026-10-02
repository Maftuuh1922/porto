/* Seret benda di meja (halaman about) — bebas digeser, dilepas: kembali ke tempatnya pakai pegas.
   Pola yang sama seperti halaman about yuvich: kelas .dragging / .just-dropped yang dipakai CSS
   untuk menampilkan pil keterangan di bawah benda. */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const K = 2 * Math.sqrt(60) * 0.62; // pegas: kaku tapi tidak terlalu keras

const pos = (el: HTMLElement): [number, number] => [
  parseFloat(el.style.getPropertyValue('--dx')) || 0,
  parseFloat(el.style.getPropertyValue('--dy')) || 0,
];

const setPos = (el: HTMLElement, x: number, y: number) => {
  el.style.setProperty('--dx', `${x}px`);
  el.style.setProperty('--dy', `${y}px`);
};

/* kembalikan ke (0,0) dengan pegas teredam */
const springBack = (el: HTMLElement) => {
  if (REDUCED) {
    setPos(el, 0, 0);
    return;
  }
  let [x, y] = pos(el);
  let vx = 0;
  let vy = 0;
  let last = performance.now();
  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    vx += (-60 * x - K * vx) * dt;
    vy += (-60 * y - K * vy) * dt;
    x += vx * dt;
    y += vy * dt;
    setPos(el, x, y);
    if (Math.hypot(x, y) > 0.3 || Math.hypot(vx, vy) > 2) requestAnimationFrame(step);
    else setPos(el, 0, 0);
  };
  requestAnimationFrame(step);
};

document.querySelectorAll<HTMLElement>('.desk-mat .desk-object').forEach((el) => {
  let sx = 0;
  let sy = 0;
  let ox = 0;
  let oy = 0;
  let box: DOMRect | null = null;
  let vx = 0;
  let vy = 0;
  let lx = 0;
  let ly = 0;
  let lastT = 0;
  let moved = false;
  let dragging = false;
  let dropTimer = 0;

  el.addEventListener('pointerdown', (e) => {
    const ev = e as PointerEvent;
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    dragging = true;
    moved = false;
    sx = ev.clientX;
    sy = ev.clientY;
    [ox, oy] = pos(el);
    box = el.getBoundingClientRect();
    vx = 0;
    vy = 0;
    lx = ev.clientX;
    ly = ev.clientY;
    lastT = performance.now();
    el.setPointerCapture(ev.pointerId);
    el.classList.add('dragging');
    document.body.style.userSelect = 'none';
  });

  el.addEventListener('pointermove', (e) => {
    const ev = e as PointerEvent;
    if (!dragging || !box) return;
    let dx = ev.clientX - sx;
    let dy = ev.clientY - sy;
    const vw = document.documentElement.clientWidth;
    dx = Math.min(Math.max(dx, 8 - box.left), vw - 8 - box.right);
    dy = Math.max(dy, -(box.top + window.scrollY));
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    const now = performance.now();
    const dt = Math.max(0.001, (now - lastT) / 1000);
    vx = vx * 0.6 + ((ev.clientX - lx) / dt) * 0.4;
    vy = vy * 0.6 + ((ev.clientY - ly) / dt) * 0.4;
    lx = ev.clientX;
    ly = ev.clientY;
    lastT = now;
    setPos(el, ox + dx, oy + dy);
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('dragging');
    el.classList.add('just-dropped');
    clearTimeout(dropTimer);
    dropTimer = window.setTimeout(() => el.classList.remove('just-dropped'), 1800);
    document.body.style.userSelect = '';
    if (performance.now() - lastT > 80) {
      vx = 0;
      vy = 0;
    }
    vx = Math.max(-2500, Math.min(2500, vx));
    vy = Math.max(-2500, Math.min(2500, vy));
    springBack(el);
  };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
  /* mencegah klik ikut terbaca setelah benda diseret */
  el.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
});
