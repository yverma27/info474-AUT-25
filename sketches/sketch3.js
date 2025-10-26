// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let totalPages = 80;
  let leftCount = 0;
  let rightCount = totalPages;
  let pageThickness = 2.2; // visual thickness per page in px
  let gap = 120; // gap between left and right stacks
  let lastFlipTime = 0;
  let flipping = false;
  let flipStart = 0;
  let flipDuration = 420; // ms for a single page flip animation
  let flipPageIndex = 0;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Helvetica');
    lastFlipTime = p.millis();

  };

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  }

  p.draw = function () {
    p.background(32, 30, 28);

    const cx = p.width / 2;
    const cy = p.height * 0.65; // book located near bottom part of canvas
    const bookWidth = Math.min(p.width * 0.7, totalPages * pageThickness + 200);
    const bookHeight = 120; // visible "edge" height
    const stackCenterX = cx;
    const leftBaseX = stackCenterX - gap / 2;
    const rightBaseX = stackCenterX + gap / 2;

    // draw base shadow for book
    p.noStroke();
    p.fill(12, 10, 10, 180);
    p.ellipse(cx, cy + bookHeight / 2 + 22, bookWidth * 1.05, 40);

    // draw spine / cover underside
    p.fill(48, 40, 38);
    p.rectMode(p.CENTER);
    p.rect(cx, cy, bookWidth, bookHeight + 20, 8);

    // draw left stack (pages already flipped)
    for (let i = 0; i < leftCount; i++) {
      const jitter = (i % 3) * 0.6 - 0.6; // small regular jitter
      const x = leftBaseX - i * pageThickness + jitter;
      p.fill(245 - (i % 6) * 2, 244, 240);
      p.rect(x, cy, pageThickness + 0.5, bookHeight - Math.abs(jitter) * 4, 1);
    }

    // draw right stack (pages yet to flip)
    for (let i = 0; i < rightCount; i++) {
      const jitter = (i % 3) * 0.6 - 0.6;
      const x = rightBaseX + i * pageThickness + jitter;
      p.fill(250, 249 - (i % 5), 245 - (i % 7) * 2);
      p.rect(x, cy, pageThickness + 0.5, bookHeight - Math.abs(jitter) * 4, 1);
    }

    // compute ms hand progress (0..1) and draw small clock
    const msNow = p.millis();
    const msProgress = (msNow % 1000) / 1000;
    const clockR = 36;
    const clockX = p.width - 80;
    const clockY = 80;

     // clock background
    p.fill(18, 18, 18, 220);
    p.stroke(120);
    p.strokeWeight(1);
    p.ellipse(clockX, clockY, clockR * 2, clockR * 2);


    // ticks
    p.stroke(80);
    for (let a = 0; a < 12; a++) {
      const ang = a * p.TWO_PI / 12 - p.HALF_PI;
      const x1 = clockX + Math.cos(ang) * (clockR - 6);
      const y1 = clockY + Math.sin(ang) * (clockR - 6);
      const x2 = clockX + Math.cos(ang) * (clockR - 2);
      const y2 = clockY + Math.sin(ang) * (clockR - 2);
      p.line(x1, y1, x2, y2);
    }







  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
