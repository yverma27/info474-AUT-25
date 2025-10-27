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
    let canvas = p.createCanvas(800, 800);
    canvas.parent('sketch-container-sk2');
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    // create time selection buttons
    buttonsContainer = p.createDiv('');
    buttonsContainer.parent('sketch-container-sk2');
    buttonsContainer.style('margin-top', '20px');

    times.forEach((min) => {
      let btn = p.createButton(min + ' min');
      btn.parent(buttonsContainer);
      btn.style('font-size', '16px');
      btn.style('margin', '5px');
      btn.style('padding', '10px 20px');
      btn.mousePressed(() => startTimer(min));
      buttons.push(btn);
    });
      
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
