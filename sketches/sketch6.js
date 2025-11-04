// HWK. 5 Narrative Visualization
registerSketch('sk6', function(p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let linePoints = [];
  let hoverInfo = null;

  const pieColors = [p.color("#ff6b6b"), p.color("#4dabf7")];

  p.preload = function () {
    table = p.loadTable('Students Social Media Addiction.csv', 'csv', 'header');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');
    processData();
  }

  function processData() {
    // Pie chart data
    let academicImpact = table.getColumn("Affects_Academic_Performance");
    yesCount = academicImpact.filter(v => v.toLowerCase() === "yes").length;
    noCount = academicImpact.filter(v => v.toLowerCase() === "no").length;

    // Bar chart data
    let addictionBins = {};
    for (let r of table.rows) {
      let score = parseInt(r.get("Addicted_Score"));
      let sleep = parseFloat(r.get("Sleep_Hours_Per_Night"));
      if (!isNaN(score) && !isNaN(sleep)) {
        if (!addictionBins[score]) addictionBins[score] = [];
        addictionBins[score].push(sleep);
      }
    }
    avgSleepByAddiction = [];
    for (let score in addictionBins) {
      let avgSleep = addictionBins[score].reduce((a, b) => a + b, 0) / addictionBins[score].length;
      avgSleepByAddiction.push({ score: parseInt(score), sleep: avgSleep });
    }
    avgSleepByAddiction.sort((a, b) => a.score - b.score);

    // Line chart data
    let addictionMap = {};
    for (let r of table.rows) {
      let addiction = parseFloat(r.get("Addicted_Score"));
      let mental = parseFloat(r.get("Mental_Health_Score"));
      if (!isNaN(addiction) && !isNaN(mental)) {
        if (!addictionMap[addiction]) addictionMap[addiction] = [];
        addictionMap[addiction].push(mental);
      }
    }
    linePoints = [];
    for (let score in addictionMap) {
      let avgMental = addictionMap[score].reduce((a, b) => a + b, 0) / addictionMap[score].length;
      linePoints.push({ score: parseFloat(score), mental: avgMental });
    }
    linePoints.sort((a, b) => a.score - b.score);
  }

  p.draw = function() {
    p.background(250);
    hoverInfo = null;

    // ---------------- Title ----------------
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.fill(0);
    p.text("Effects of Social Media on Students' Wellbeing", p.width / 2, p.height * 0.05);

    // ---------------- Bar Chart ----------------
    p.push();
    p.translate(p.width * 0.05, p.height * 0.1);
    drawBarChart();
    p.pop();

    p.push();
    p.textSize(14);
    p.textStyle(p.ITALIC);
    p.text("Sleep Hours vs Addiction Score", p.width * 0.5, p.height * 0.38);
    p.pop();

    // ---------------- Line Chart ----------------
    p.push();
    p.translate(p.width * 0.05, p.height * 0.45);
    drawLineChart();
    p.pop();

    p.push();
    p.textSize(14);
    p.textStyle(p.ITALIC);
    p.text("Addiction vs Mental Health Score", p.width * 0.5, p.height * 0.82);
    p.pop();

    // ---------------- Pie Chart ----------------
    p.push();
    p.translate(p.width * 0.8, p.height * 0.2);
    drawPieChart();
    p.pop();

    // ---------------- Tooltip ----------------
    if (hoverInfo) {
      p.push();
      p.fill(255);
      p.stroke(0);
      p.rect(hoverInfo.x + 10, hoverInfo.y - 30, 200, 30, 6);
      p.noStroke();
      p.fill(0);
      p.textSize(13);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(hoverInfo.text, hoverInfo.x + 20, hoverInfo.y - 15);
      p.pop();
    }
  }

  // ---------------- Pie Chart ----------------
  function drawPieChart() {
    let total = yesCount + noCount;
    const values = [yesCount, noCount];
    const labels = ["Yes", "No"];
    const radius = 90;

    let mx = p.mouseX - (p.width * 0.8);
    let my = p.mouseY - (p.height * 0.2);
    let mouseDist = Math.sqrt(mx*mx + my*my);
    let mouseAngle = Math.atan2(my, mx);
    if (mouseAngle < 0) mouseAngle += p.TWO_PI;

    let startAngle = 0;
    for (let i = 0; i < values.length; i++) {
      const angle = (values[i] / total) * p.TWO_PI;
      const endAngle = startAngle + angle;

      let isHovering = mouseDist <= radius && mouseAngle >= startAngle && mouseAngle <= endAngle;
      if (isHovering) {
        p.fill(pieColors[i]);
        p.stroke(0);
        p.strokeWeight(3);
        hoverInfo = {
          x: p.mouseX,
          y: p.mouseY,
          text: `${labels[i]}: ${(values[i]/total*100).toFixed(1)}%`
        };
      } else {
        p.fill(pieColors[i]);
        p.noStroke();
      }

      p.arc(0, 0, radius*2, radius*2, startAngle, endAngle, p.PIE);
      startAngle = endAngle;
    }
  }

  // ---------------- Bar Chart ----------------
  function drawBarChart() {
    let maxSleep = Math.max(...avgSleepByAddiction.map(d=>d.sleep));
    let barWidth = 30;
    let chartH = 300;

    // Gridlines
    for (let s = 0; s <= maxSleep; s++) {
      let y = p.map(s, 0, maxSleep, chartH, 0);
      p.stroke(200);
      p.line(0, y, avgSleepByAddiction.length*(barWidth+10), y);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(s.toFixed(0), -5, y);
    }

    // Bars
    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      let x = i*(barWidth+10);
      let y = p.map(avgSleepByAddiction[i].sleep, 0, maxSleep, chartH, 0);

      // Hover highlight
      let isHovering = p.mouseX >= x+p.width*0.05 && p.mouseX <= x+p.width*0.05+barWidth &&
                        p.mouseY >= y+p.height*0.1 && p.mouseY <= chartH+p.height*0.1;
      if (isHovering) {
        p.fill("#ffb347");
        hoverInfo = {
          x: p.mouseX,
          y: p.mouseY,
          text: `Addiction: ${avgSleepByAddiction[i].score}\nAvg Sleep: ${avgSleepByAddiction[i].sleep.toFixed(1)}`
        };
      } else {
        p.fill("#673ab7");
      }

      p.noStroke();
      p.rect(x, y, barWidth, chartH - y);
      p.fill(0);
      p.textAlign(p.CENTER);
      p.text(avgSleepByAddiction[i].score, x + barWidth/2, chartH + 10);
    }

    // Axis labels
    p.push();
    p.translate(-40, chartH/2);
    p.rotate(-p.HALF_PI);
    p.text("Average Sleep Hours", 0, 0);
    p.pop();
    p.textSize(12);
    p.text("Addiction Score", avgSleepByAddiction.length*(barWidth+10)/2, chartH + 30);
  }

  // ---------------- Line Chart ----------------
  function drawLineChart() {
    let xMin=0, xMax=10, yMin=0, yMax=10;
    let chartW=700, chartH=250;

    // Gridlines
    for (let i=0;i<=10;i++){
      let y = p.map(i, yMin, yMax, chartH, 0);
      p.stroke(230);
      p.line(40, y, chartW+40, y);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(i, 30, y);
    }
    for (let i=0;i<=10;i++){
      let x = p.map(i, xMin, xMax, 40, chartW+40);
      p.stroke(230);
      p.line(x, chartH, x, 0);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.text(i, x, chartH+5);
    }

    // Draw line
    p.noFill();
    p.stroke("#6a4c93");
    p.strokeWeight(2);
    p.beginShape();
    for (let pt of linePoints) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW+40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);
      p.vertex(x, y);
    }
    p.endShape();

    // Draw points with hover
    for (let pt of linePoints) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW+40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);

      let d = p.dist(p.mouseX-p.width*0.05, p.mouseY-p.height*0.45, x, y);
      if (d < 7) {
        p.fill("#f94144");
        hoverInfo = {
          x: p.mouseX,
          y: p.mouseY,
          text: `Addiction: ${pt.score}\nAvg Mental Health: ${pt.mental.toFixed(1)}`
        };
      } else {
        p.fill("#6a4c93");
      }

      p.noStroke();
      p.ellipse(x, y, 7, 7);
    }
  }

  // Resize canvas dynamically
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});

