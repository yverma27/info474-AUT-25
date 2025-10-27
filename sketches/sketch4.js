// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let totalTime = 0;
  let timeLeft = 0;
  let timerRunning = false;
  let startButton;
  let startTime;
  let batteryWidth = 500;
  let batteryHeight = 180;


  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(200, 240, 200);
    p.fill(30, 120, 40);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. C', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
