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

  // break mode variables
  let breakMode = false;
  let breakStartTime = 0;
  let breakDuration = 5000; // ms
  let bookmarkY;

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
    const leftBaseX = cx - gap / 2;
    const rightBaseX = cx + gap / 2;

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
      p.noStroke();
      p.quad(
        x, cy - bookHeight / 2,
        x + 2, cy - bookHeight / 2 + 2,
        x + 2, cy + bookHeight / 2,
        x, cy + bookHeight / 2 - 2
      );
    }

    // draw right stack (pages yet to flip)
    for (let i = 0; i < rightCount; i++) {
      const jitter = (i % 3) * 0.6 - 0.6;
      const x = rightBaseX + i * pageThickness + jitter;
      p.fill(250, 249 - (i % 5), 245 - (i % 7) * 2);
      p.noStroke();
      p.quad(
        x, cy - bookHeight / 2,
        x + 2, cy - bookHeight / 2 + 2,
        x + 2, cy + bookHeight / 2,
        x, cy + bookHeight / 2 - 2
      );
    }

    // center crease
    p.stroke(60);
    p.strokeWeight(1);
    p.line(cx, cy - bookHeight / 2, cx, cy + bookHeight / 2);

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

    // ms hand
    p.push();
    p.translate(clockX, clockY);
    p.rotate(msProgress * p.TWO_PI - p.HALF_PI);
    p.stroke(220, 60, 60);
    p.strokeWeight(2);
    p.line(0, 0, clockR - 10, 0);
    p.pop();

    // check if a new flip should start (every full second)
    if (!flipping && msNow - lastFlipTime >= 1000) {
      if (rightCount > 0) {
        flipping = true;
        flipStart = msNow;
        flipPageIndex = rightCount - 1; // topmost page from right stack
      }
      lastFlipTime = msNow;
    }

    // draw flipping page if active
    if (flipping) {
      const tRaw = (msNow - flipStart) / flipDuration;
      const t = p.constrain(tRaw, 0, 1);
      const eased = easeInOutQuad(t);

      // start and end positions
      const startX = rightBaseX + flipPageIndex * pageThickness;
      const endX = leftBaseX - leftCount * pageThickness;
      const x = p.lerp(startX, endX, eased);

      // arc movement (upwards then down)
      const arcAmplitude = 50;
      const y = cy - Math.sin(eased * p.PI) * arcAmplitude;

      // rotation to simulate flipping edge (rotate around vertical axis -> mimic by scaling x)
      const flipAngle = p.lerp(0, p.PI, eased);
      const shear = p.sin(flipAngle) * 0.8;

      p.push();
      p.translate(x, y);
      // slight tilt for realism
      p.rotate(p.map(eased, 0, 1, -0.05, 0.05));
      // simulate 3D flip by skewing width via scaleX
      const pageW = pageThickness + 0.5;
      const pageH = bookHeight - 10;
      // fake 3D by changing width
      const visibleWidth = Math.max(0.6, Math.cos(flipAngle)) * (pageW * 8);
      p.noStroke();
      p.fill(255, 250, 245);
      p.rectMode(p.CENTER);
      p.rect(0, 0, visibleWidth, pageH, 1);
      p.pop();

      // finish flip
      if (t >= 1) {
        flipping = false;
        rightCount = Math.max(0, rightCount - 1);
        leftCount = Math.min(totalPages, leftCount + 1);
      }
    }


    // small labels
    p.noStroke();
    p.fill(190);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('pages left: ' + rightCount, rightBaseX + 30, cy + bookHeight / 2 + 18);
    p.text('pages flipped: ' + leftCount, leftBaseX - 30, cy + bookHeight / 2 + 18);
  };


  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});
