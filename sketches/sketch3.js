// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let totalPages = 60;
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
  let breakDuration = 300000; // ms
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

    // Small shadow for realism
    p.noStroke();
    p.fill(0, 30);
    p.rect(cx, cy + bookHeight / 2 + 5, bookWidth, 4);

    // compute ms hand progress (0..1) and draw small clock
    const msNow = p.millis();
    const secondProgress = Math.floor((msNow % 60000) / 1000) / 60;
    const clockR = 36;
    const clockX = cx + bookWidth / 2 - 60;
    const clockY = cy - bookHeight * 1.5;

     // clock background
    //p.fill(18, 18, 18, 220);
    //p.stroke(120);
   // p.strokeWeight(1);
    p.noStroke();
    p.fill(255);
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
    p.rotate(secondProgress * p.TWO_PI - p.HALF_PI);
    p.stroke(220, 60, 60);
    p.strokeWeight(2);
    p.line(0, 0, clockR - 10, 0);
    p.pop();

    // bookmark during break mode
    if (breakMode) {
      // Draw a bookmark ribbon in the middle
      const bookmarkX = cx;
      bookmarkY = p.lerp(bookmarkY || cy - 120, cy + bookHeight / 2, 0.1);
      p.noStroke();
      p.fill(220, 40, 60);
      p.rect(bookmarkX, bookmarkY, 8, 140, 4);

      // calculate remaining break time
      const elapsed = p.millis() - breakStartTime;
      const remaining = Math.max(0, breakDuration - elapsed);
      const remainingSeconds = Math.ceil(remaining / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      // format time as MM:SS
      const formattedTime =
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;

      // Text message
      p.textAlign(p.CENTER);
      p.textSize(18);
      p.fill(255);
      p.text('Take a short break 📘', p.width / 2, cy - bookHeight - 40);
      p.textSize(28);
      p.text('Time remaining: ' + formattedTime, p.width / 2, cy - bookHeight - 25);

      // Resume after a few seconds
      if (p.millis() - breakStartTime > breakDuration) {
        breakMode = false;
        bookmarkY = cy - 120;
      }
    }


    // check if a new flip should start (every full second)
    if (!flipping && !breakMode && msNow - lastFlipTime >= 60000) {
      if (rightCount > 0) {
        flipping = true;
        flipStart = msNow;
        flipPageIndex = rightCount - 1; // topmost page from right stack

        // trigger a break after every 30 pages flipped
        if (leftCount > 0 && leftCount % 30 === 0) {
          breakMode = true;
          breakStartTime = msNow;
        }
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
      const lift = Math.sin(eased * p.PI) * 60; // lifted higher

      // rotation to simulate flipping edge (rotate around vertical axis -> mimic by scaling x)
      const flipAngle = p.lerp(0, p.PI, eased);

      p.push();
      p.translate(x, cy - lift);
      // slight tilt for realism
      p.rotate(p.map(eased, 0, 1, -0.1, 0.1));
      p.fill(255, 250, 245);
      p.noStroke();

      // simulate 3D flip by skewing width via scaleX
      const pageW = 120;
      const pageH = 160;
      const depth = Math.sin(flipAngle) * 80;

      p.quad(
        -pageW / 2, -pageH / 2,
        pageW / 2, -pageH / 2,
        pageW / 2 - depth, pageH / 2,
        -pageW / 2 - depth, pageH / 2
      );

      p.pop();

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
