(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const COUNT = 75, LINK_DIST = 145, SPEED = 0.4;
  const ROSE = [244, 63, 94], AMBER = [245, 158, 11];

  let mouse = { x: null, y: null, active: false };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    const baseR = Math.random() * 1.8 + 1;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * SPEED,
      vy: (Math.random() - .5) * SPEED,
      baseR: baseR,
      r: baseR,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseTime: Math.random() * Math.PI,
      col: Math.random() > .5 ? ROSE : AMBER,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: COUNT }, makeNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dynamic node positions & attraction to mouse
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;

      // Bounce off boundaries
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Pulse size
      n.pulseTime += n.pulseSpeed;
      n.r = n.baseR + Math.sin(n.pulseTime) * 0.6;

      // Mouse magnetism
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const magnet_dist = 180;
        if (d < magnet_dist) {
          const force = (magnet_dist - d) / magnet_dist;
          // Slowly pull node towards mouse
          n.x -= dx * force * 0.025;
          n.y -= dy * force * 0.025;
        }
      }

      // Draw lines between nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.35;
          const t = j / nodes.length;
          const r = Math.round(n.col[0] + (m.col[0] - n.col[0]) * t);
          const g = Math.round(n.col[1] + (m.col[1] - n.col[1]) * t);
          const b = Math.round(n.col[2] + (m.col[2] - n.col[2]) * t);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      // Draw lines to mouse
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const mouse_link_dist = 160;
        if (d < mouse_link_dist) {
          const alpha = (1 - d / mouse_link_dist) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw node itself
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},0.65)`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  // Mouse event listeners
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  });
  window.addEventListener('touchend', () => {
    mouse.active = false;
  });

  init();
  draw();
  window.addEventListener('resize', resize);
})();
