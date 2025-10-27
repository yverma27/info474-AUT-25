// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let totalTime = 0;
  let elapsedTime = 0;
  let startTime = 0;
  let running = false;
  let brightness = 0;

  let buttons = [];
  let times = [15, 30, 45, 60]; // in minutes
  let buttonsContainer;
  

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(220);
    p.fill(100, 150, 240);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. A', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
