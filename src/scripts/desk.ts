/* Seret benda di meja (halaman about) — bebas digeser dan MENEMPEL di tempat baru,
   tidak kembali ke posisi semula (seperti halaman about yuvich).
   Kelas .dragging / .just-dropped dipakai CSS untuk menampilkan pil keterangan. */

const pos = (el: HTMLElement): [number, number] => [
  parseFloat(el.style.getPropertyValue('--dx')) || 0,
  parseFloat(el.style.getPropertyValue('--dy')) || 0,
];

const setPos = (el: HTMLElement, x: number, y: number) => {
  el.style.setProperty('--dx', `${x}px`);
  el.style.setProperty('--dy', `${y}px`);
};

document.querySelectorAll<HTMLElement>('.desk-mat .desk-object').forEach((el) => {
  let sx = 0;
  let sy = 0;
  let ox = 0;
  let oy = 0;
  let box: DOMRect | null = null;
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
    /* tidak ada pegas: benda menempel di tempat barunya */
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
