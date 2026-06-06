(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const COUNT = 70, LINK_DIST = 140, SPEED = 0.35;

  // Sage & Ivory palette
  const SAGE     = [74,  124,  89];
  const GOLD     = [201, 168,  76];
  const FERN     = [106, 176, 120];

  let mouse = { x: null, y: null, active: false };

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }

  function makeNode() {
    const r = Math.random();
    const col = r < 0.45 ? SAGE : r < 0.80 ? GOLD : FERN;
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * SPEED, vy: (Math.random() - .5) * SPEED,
      baseR: Math.random() * 1.8 + 0.8, r: 1,
      pulseSpeed: Math.random() * 0.025 + 0.008,
      pulseTime: Math.random() * Math.PI,
      col,
    };
  }

  function init() { resize(); nodes = Array.from({ length: COUNT }, makeNode) }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.pulseTime += n.pulseSpeed;
      n.r = n.baseR + Math.sin(n.pulseTime) * 0.55;

      if (mouse.active) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 200) { const f = (200 - d) / 200; n.x -= dx * f * 0.022; n.y -= dy * f * 0.022 }
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.28;
          const t = j / nodes.length;
          const r = Math.round(n.col[0] + (m.col[0] - n.col[0]) * t);
          const g = Math.round(n.col[1] + (m.col[1] - n.col[1]) * t);
          const b = Math.round(n.col[2] + (m.col[2] - n.col[2]) * t);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.55;
          ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }

      if (mouse.active) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 170) {
          const alpha = (1 - d / 170) * 0.38;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(74,124,89,${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},0.6)`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true });
  window.addEventListener('mouseleave', () => { mouse.active = false });
  window.addEventListener('touchmove', e => {
    if (e.touches.length > 0) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.active = true }
  });
  window.addEventListener('touchend', () => { mouse.active = false });

  init(); draw();
  window.addEventListener('resize', resize);
})();
