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

    // background brightness based on bulb brightness
    let ambient = p.map(brightness, 0, 255, 20, 220);
    p.background(ambient, ambient * 0.95, ambient * 0.7);

    // glowing aura around bulb
    p.fill(255, 255, 150, brightness * 0.4);
    p.ellipse(p.width / 2, p.height / 2, 300 + brightness / 2);

    // bulb shape 
    p.fill(255, 255, 200, brightness);
    p.ellipse(p.width / 2, p.height / 2, 200, 260);

    // bulb base
    p.fill(100);
    p.rect(p.width / 2 - 50, p.height / 2 + 100, 100, 60, 10);

    // timer display
    p.fill(0);
    p.textSize(28);
    if (totalTime > 0) {
      let timeLeft = Math.max(0, totalTime - elapsedTime);
      let minutesLeft = Math.floor(timeLeft / 60);
      let secondsLeft = Math.floor(timeLeft % 60);
      p.text(
        p.nf(minutesLeft, 2) + ':' + p.nf(secondsLeft, 2),
        p.width / 2,
        p.height - 80
      );
    }

    // end state - full glowing bulb
    if (!running && totalTime > 0 && brightness === 255) {
      let glow = 200 + 55 * Math.sin(p.millis() / 200);
      p.fill(255, 255, 150, glow * 0.4);
      p.ellipse(p.width / 2, p.height / 2, 350 + glow / 10);
      p.fill(0);
      p.textSize(24);
      p.text('Session complete! Time to take a break 💡', p.width / 2, 100);
    }
  };


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
