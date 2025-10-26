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


  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
