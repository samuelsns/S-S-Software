/* ─── HERO CANVAS — Particle Network ─── */
(function () {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");

  let W,
    H,
    particles,
    mouse = { x: -999, y: -999 };

  const COLORS = ["rgba(0,229,255,", "rgba(124,58,237,", "rgba(16,185,129,"];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    const count = Math.floor((W * H) / 9000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const time = Date.now() * 0.001; // Current time in seconds
      const bobbing = Math.sin(time + i) * 0.1; // Tiny vertical adjustment
      p.y += bobbing;

      // Mouse repulsion
      const dx = p.x - mouse.x,
        dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.vx += (dx / dist) * force * 0.4;
        p.vy += (dy / dist) * force * 0.4;
      }

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + "0.7)";
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x,
          ey = p.y - q.y;
        const d2 = ex * ex + ey * ey;
        if (d2 < 14400) {
          // 120^2
          const alpha = 1 - d2 / 14400;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color + alpha * 0.15 + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => io.observe(el));
