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

  function startTimer(minutes) {
    totalTime = minutes * 60; // convert to seconds
    elapsedTime = 0;
    startTime = p.millis();
    running = true;
    brightness = 0;

    // hide buttons
    buttons.forEach(b => b.hide());
  }
  p.draw = function () {
    p.background(20);

    if (running) {
      elapsedTime = (p.millis() - startTime) / 1000; // in seconds
      brightness = p.map(elapsedTime, 0, totalTime, 0, 255, true);

      if (elaspedTime >= totalTime) {
        brightness = 255;
        running = false;
        // show buttons again
        buttons.forEach(b => b.show());
      }
    }

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
