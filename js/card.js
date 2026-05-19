(function () {
  const PIX = 36;
  const COLOR = "#6b7eff"; // change to your primary color hex if needed

  function initCard(card) {
    const canvas = card.querySelector(".svc-canvas");
    if (!canvas) return;

    let ctx, rows, cols, grid;
    let mouse = { x: -999, y: -999 };

    function setup() {
      const r = card.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      ctx = canvas.getContext("2d");
      rows = Math.ceil(r.height / PIX) + 1;
      cols = Math.ceil(r.width / PIX) + 1;
      grid = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => ({
          x: j * PIX,
          y: i * PIX,
          op: 0,
        })),
      );
    }

    card.addEventListener("mousemove", function (e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });

    card.addEventListener("mouseleave", function () {
      mouse.x = -999;
      mouse.y = -999;
    });

    function frame() {
      requestAnimationFrame(frame);
      if (!ctx || !grid) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hc = Math.floor(mouse.x / PIX);
      const hr = Math.floor(mouse.y / PIX);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = grid[i][j];
          const isHovered = i === hr && j === hc;

          cell.op = isHovered
            ? Math.min(1, cell.op + 0.1)
            : Math.max(0, cell.op - 0.03);

          if (cell.op > 0.008) {
            // fill
            ctx.globalAlpha = cell.op * 0.18;
            ctx.fillStyle = COLOR;
            ctx.fillRect(cell.x + 1, cell.y + 1, PIX - 2, PIX - 2);

            // border
            ctx.globalAlpha = cell.op * 0.25;
            ctx.strokeStyle = COLOR;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, PIX - 1, PIX - 1);

            ctx.globalAlpha = 1;
          }
        }
      }
    }

    setup();
    new ResizeObserver(setup).observe(card);
    frame();
  }

  // Run after DOM is ready
  function init() {
    document.querySelectorAll(".svc-card").forEach(initCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
