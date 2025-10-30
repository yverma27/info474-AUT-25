// Example 2
registerSketch('sk5', function (p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let relationshipData = [];
  let hoverInfo = null;
  //let colorScale;

  const pieColors = [p.color("#ff6b6b"), p.color("#4dabf7")];
  const bubbleColors = [p.color("#f94144"), p.color("#f3722c"), p.color("#90be6d")];
  const relStatuses = ["Single", "In Relationship", "Complicated"];
  

  p.preload = function () {
    table = p.loadTable('Students Social Media Addiction.csv', 'csv', 'header');
  }
  

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');
    p.noLoop();
    colorScale = colorGradient("#ff4b5c", "#4caf50", 10);
    processData();
  };

  function processData() {
    let academicImpact = table.getColumn("Affects_Academic_Performance");
    yesCount = academicImpact.filter(v => v.toLowerCase() === "yes").length;
    noCount = academicImpact.filter(v => v.toLowerCase() === "no").length;

    // Section 1 - Bar Chart Data
    let addictionBins = {};
    for (let r of table.rows) {
      let score = parseInt(r.get("Addicted_Score"));
      let sleep = parseFloat(r.get("Sleep_Hours_Per_Night"));
      if (!isNaN(score) && !isNaN(sleep)) {
        if (!addictionBins[score]) addictionBins[score] = [];
        addictionBins[score].push(sleep);
      }
    }

    for (let score in addictionBins) {
      let avgSleeps = addictionBins[score].reduce((a, b) => a + b, 0) / addictionBins[score].length;
      avgSleepByAddiction.push({ score: parseInt(score), sleep: avgSleeps });
    }
    avgSleepByAddiction.sort((a, b) => a.score - b.score);

    // Section 3 - Bubble Chart Data
    let groups = {};
    for (let r of table.rows) {
      let relation = r.get("Relationship_Status");
      let conflicts = parseInt(r.get("Conflicts_Over_Social_Media"));
      let addiction = parseInt(r.get("Addicted_Score"));
      let mentalHealth = parseInt(r.get("Mental_Health_Score"));

      if (!groups[relation]) groups[relation] = { conflicts: [], addiction: [], mentalHealth: [] };
      groups[relation].conflicts.push(conflicts);
      groups[relation].addiction.push(addiction);
      groups[relation].mentalHealth.push(mentalHealth);
    }

    for (let k in groups) {
      let c = avg(groups[k].conflicts);
      let a = avg(groups[k].addiction);
      let m = avg(groups[k].mentalHealth);
      relationshipData.push({ relation: k, conflicts: c, addiction: a, mentalHealth: m });
    }
  }


  p.draw = function () {
    p.background(250);
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.fill(0);
    p.text("Effects of Social Media on Students' Wellbeing", p.width / 2, 40);

    // Section 1 - Pie Chart
    p.push();
    p.translate(p.width * 0.2, p.height / 2);
    drawPieChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text("Academic Performance Impact", 0, 160);
    p.pop();

    // Section 2 - Bar Chart
    p.push();
    p.translate(p.width * 0.5 - 200, 80);
    drawBarChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text("Sleep Hours vs Addiction Score", 250, 360);
    p.pop();

    // Section 3 - Bubble Chart
    p.push();
    p.translate(p.width * 0.8, p.height / 2);
    drawBubbleChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text("Conflicts & Wellbeing by Relationship Status", 0, 160);
    p.pop();

  };

  //Pie Chart
  function drawPieChart() {
    let total = yesCount + noCount;
    let yesAngle = (yesCount/total) * p.TWO_PI;
    p.fill("#2196f3");
    p.arc(0, 0, 180, 180, 0, yesAngle, p.PIE);
    p.fill("#cccccc");
    p.arc(0, 0, 180, 180, yesAngle, p.TWO_PI, p.PIE);
    p.fill(0);
    p.textSize(12);
    p.textAlign(p.LEFT);
    p.text(`Yes: ${p.nf((yesCount / total) * 100, 2, 1)}%`, 100, -30);
    p.text(`No: ${p.nf((noCount / total) * 100, 2, 1)}%`, 100, -10);
  }

  //Bar Chart
  function drawBarChart() {
    let maxSleep = Math.max(...avgSleepByAddiction.map(d => d.sleep));
    let barWidth = 20;
    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      let x = i * (barWidth + 8);
      let y = p.map(avgSleepByAddiction[i].sleep, 0, maxSleep, 300, 0);
      p.fill("#673ab7");
      p.rect(x, y, barWidth, 300 - y);
    }
    p.fill(0);
    p.textSize(10);
    p.textAlign(p.CENTER);
    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      p.text(avgSleepByAddiction[i].score, i * (barWidth + 8) + barWidth / 2, 320);
    }
    p.text("Addiction Score", 250, 340);
  }

  // Bubble Chart
  function drawBubbleChart() {
    for (let i = 0; i < relationshipData.length; i++) {
      let d = relationshipData[i];
      let x = p.map(i, 0, relationshipData.length - 1, -100, 100);
      let y = p.map(d.conflicts, 0, 10, 80, -80);
      let bubbleSize = p.map(d.addiction, 1, 10, 20, 60);
      let mentalHealthColor = colorScale[Math.floor(p.map(d.mentalHealth, 1, 10, 0, 9))];
      p.fill(mentalHealthColor);
      p.noStroke();
      p.ellipse(x, y, bubbleSize);
      p.fill(0);
      p.textAlign(p.CENTER);
      p.textSize(10);
      p.text(d.relation, x, y + bubbleSize / 2 + 12);
    }
  }

  // helpers
  function avg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function colorGradient(c1, c2, steps) {
    let gradient = [];
    for (let i = 0; i < steps; i++) {
      let inter = p.lerpColor(p.color(c1), p.color(c2), i / (steps - 1));
      gradient.push(inter);
    }
    return gradient;
  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
