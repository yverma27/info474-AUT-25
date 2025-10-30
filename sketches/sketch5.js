// Example 2
registerSketch('sk5', function (p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let relationshipData = [];
  let colorScale;

  p.preload = function () {
    table = p.loadTable('Students Social Media Addiction.csv', 'csv', 'header');
  }
  

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
