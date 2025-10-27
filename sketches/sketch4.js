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
    let canvas = p.createCanvas(800, 800);
    canvas.parent('sketch-container-sk4');

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);

    startButton = p.createButton('Start Timer');
    startButton.parent('sketch-container-sk4');
    startButton.style('font-size', '16px');
    startButton.style('padding', '10px 20px');
    startButton.mousePressed(promptUser);
  };

  function promptUser() {
    let userInput = p.prompt("Enter your study session length (in minutes):");
    let minutes = parseFloat(userInput);

    if (!isNaN(minutes) && minutes > 0) {
      totalTime = minutes * 60; // convert to seconds
      timeLeft = totalTime;
      startTime = p.millis();
      timerRunning = true;
      startButton.hide();
    } else {
      p.alert("Please enter a valid number.");
    }
  }

  p.draw = function () {
    p.background(245);
    p.textSize(32);
    p.text("Battery Timer", p.width / 2, 80);

    if(timerRunning){
      let elapsed = (p.millis() - startTime) / 1000; // in seconds
      timeLeft = totalTime - elapsed;

      if(timeLeft <= 0){
        timeLeft = 0;
        timerRunning = false;
        p.alert("Time's up!");
        startButton.show();
      }
    }

    let batteryLevel = timeLeft / totalTime
    let batteryColor = getBatteryColor(batteryLevel);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
