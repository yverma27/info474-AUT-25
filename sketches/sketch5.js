// HWK. 5 Narrative Visualization
registerSketch('sk5', function (p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let relationshipData = [];
  let linePoints = [];
  let hoverInfo = null;
  let colorScale;

  const pieColors = [p.color("#ff6b6b"), p.color("#4dabf7")];

  p.preload = function () {
    table = p.loadTable('Students Social Media Addiction.csv', 'csv', 'header');
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');
    colorScale = colorGradient("#ff4b5c", "#4caf50", 10);
    processData();
  };

  function processData() {
    let academicImpact = table.getColumn("Affects_Academic_Performance");
    yesCount = academicImpact.filter(v => v.toLowerCase() === "yes").length;
    noCount = academicImpact.filter(v => v.toLowerCase() === "no").length;

    // Bar Chart Data
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
      let avgSleeps = addictionBins[score].reduce((a, b) => a + b, 0) / addictionBins[score].length;
      avgSleepByAddiction.push({ score: parseInt(score), sleep: avgSleeps });
    }
    avgSleepByAddiction.sort((a, b) => a.score - b.score);

    // Line Chart Data
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

  p.draw = function () {
    p.background(250);
    hoverInfo = null;
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.fill(0);
    p.text("Effects of Social Media on Students' Wellbeing", p.width / 2, 40);

    // Pie Chart
    p.push();
    p.translate(p.width * 0.2, p.height / 2);
    drawPieChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Academic Performance Impact", 0, 180);
    p.pop();
    p.pop();

    // Bar Chart
    p.push();
    p.translate(p.width * 0.5 - 150, p.height / 2 - 200);
    drawBarChart();
    p.pop();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Sleep Hours vs Addiction Score", p.width * 0.5, p.height / 2 + 180);
    p.pop();

    // Line Chart
    p.push();
    p.translate(p.width * 0.8 - 150, p.height / 2 - 150);
    drawLineChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Addiction vs Mental Health Score", 200, 325);
    p.pop();
    p.pop();

    // Lines dividing sections
    p.push();
    p.stroke(180);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([6, 6]);
    p.line(p.width * 0.33, 100, p.width * 0.33, p.height - 100);  // Divider 1
    p.line(p.width * 0.66, 100, p.width * 0.66, p.height - 100);  // Divider 2
    p.pop();

    // Hovering tooltip
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
  };

  // Draw Pie Chart code
  function drawPieChart() {
    let total = yesCount + noCount;
    const values = [yesCount, noCount];
    const labels = ["Yes", "No"];
    const radius = 90;

    let mx = p.mouseX - (p.width * 0.2);
    let my = p.mouseY - (p.height / 2);
    let mouseDist = Math.sqrt(mx * mx + my * my);
    let mouseAngle = Math.atan2(my, mx);
    if (mouseAngle < 0) mouseAngle += p.TWO_PI;

    let startAngle = 0;

    for (let i = 0; i < values.length; i++) {
      const angle = (values[i] / total) * p.TWO_PI;
      const endAngle = startAngle + angle;

      let isHovering = mouseDist <= radius && mouseAngle >= startAngle && mouseAngle <= endAngle;
      if (isHovering) {
        hoverInfo = {
          x: p.mouseX,
          y: p.mouseY,
          text: `${labels[i]}: ${(values[i] / total * 100).toFixed(1)}%`
        };
        p.fill(pieColors[i]);
        p.stroke(0);
        p.strokeWeight(3);
      } else {
        p.fill(pieColors[i]);
        p.noStroke();
      }

      p.arc(0, 0, radius * 2, radius * 2, startAngle, endAngle, p.PIE);
      startAngle = endAngle;
    }

    const legendX = -radius;
    const legendY = radius + 20;
    for (let i = 0; i < labels.length; i++) {
      p.fill(pieColors[i]);
      p.noStroke();
      p.rect(legendX, legendY + i * 22, 14, 14);
      p.fill(0);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(12);
      p.text(labels[i], legendX + 20, legendY + i * 22 + 7);
    }
  }

  // Draw bar chart code
  function drawBarChart() {
    let maxSleep = Math.max(...avgSleepByAddiction.map(d => d.sleep));
    let barWidth = 20;

    let highestScore = Math.max(...avgSleepByAddiction.map(d => d.score));
    let highestBar = avgSleepByAddiction.find(d => d.score === highestScore);

    p.textSize(12);
    for (let s = 0; s <= maxSleep; s++) {
      let y = p.map(s, 0, maxSleep, 300, 0);
      p.stroke(200);
      p.line(0, y, avgSleepByAddiction.length * (barWidth + 8), y);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(s.toFixed(0), -5, y);
    }

    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      let x = i * (barWidth + 8);
      let y = p.map(avgSleepByAddiction[i].sleep, 0, maxSleep, 300, 0);

      let isHovering = p.mouseX >= x + p.width * 0.5 - 150 &&
                        p.mouseX <= x + p.width * 0.5 - 150 + barWidth &&
                        p.mouseY >= y + p.height / 2 - 200 &&
                        p.mouseY <= 300 + p.height / 2 - 200;
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
      p.rect(x, y, barWidth, 300 - y);

      p.fill(0);
      p.textAlign(p.CENTER);
      p.text(avgSleepByAddiction[i].score, x + barWidth / 2, 320);

      // Annotation for highest addiction score bar 
      if (avgSleepByAddiction[i].score === highestBar.score) {
        p.push();
        let noteX = x + 40;
        let noteY = y - 40;

        // Draw connector line
        p.stroke("#d32f2f");
        p.strokeWeight(1.5);
        p.line(x + barWidth / 2, y + 5, noteX, noteY + 25);

        // Draw annotation box
        p.noStroke();
        p.fill("#fff5f5");
        p.rect(noteX, noteY, 190, 40, 8);

        // Text inside annotation
        p.fill("#d32f2f");
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(11);
        p.text("Students with higher addiction\nscores tend to have lower sleep hours", noteX + 8, noteY + 6);
        p.pop();
      }
    }


    p.textSize(12);
    p.push();
    p.translate(-40, 150);
    p.rotate(-p.HALF_PI);
    p.text("Average Sleep Hours", 0, 0);
    p.pop();
    //p.textSize(12);
    p.text("Addiction Score", 200, 350);
  }

  // Draw line chart code
  function drawLineChart() {
    let xMin = 0, xMax = 10, yMin = 0, yMax = 10;
    let chartW = 300, chartH = 250;

    // Draw gridlines
    for (let i = 0; i <= 10; i++) {
      let y = p.map(i, yMin, yMax, chartH, 0);
      p.stroke(230);
      p.line(40, y, chartW + 40, y);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(i, 30, y);
    }

    for (let i = 0; i <= 10; i++) {
      let x = p.map(i, xMin, xMax, 40, chartW + 40);
      p.stroke(230);
      p.line(x, chartH, x, 0);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.text(i, x, chartH + 5);
    }

    p.noFill();
    p.stroke("#6a4c93");
    p.strokeWeight(2);
    p.beginShape();
    for (let pt of linePoints) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW + 40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);
      p.vertex(x, y);
    }
    p.endShape();

    for (let pt of linePoints) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW + 40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);

      let d = p.dist(p.mouseX - (p.width * 0.8 - 150), p.mouseY - (p.height / 2 - 150), x, y);
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

    // Axis labels
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER);
    p.text("Addiction Score", chartW / 2 + 40, chartH + 30);
    p.push();
    p.translate(0, chartH / 2);
    p.rotate(-p.HALF_PI);
    p.text("Average Mental Health Score", 0, 0);
    p.pop();

    // Annotation 
    let highest = linePoints.reduce((a, b) => a.mental > b.mental ? a : b);
    let lowest = linePoints.reduce((a, b) => a.mental < b.mental ? a : b);

    let xHigh = p.map(highest.score, xMin, xMax, 40, chartW + 40);
    let yHigh = p.map(highest.mental, yMin, yMax, chartH, 0);
    let xLow = p.map(lowest.score, xMin, xMax, 40, chartW + 40);
    let yLow = p.map(lowest.mental, yMin, yMax, chartH, 0);

    // Annotation lines
    p.stroke("#f94144");
    p.strokeWeight(1);
    p.line(xHigh, yHigh, xHigh + 60, yHigh - 25);
    p.line(xLow, yLow, xLow + 60, yLow + 25);

    // Annotation text
    p.noStroke();
    p.fill("#f94144");
    p.textSize(11);
    p.textAlign(p.LEFT);
    p.text("Lower addiction → Higher mental health", xHigh + 65, yHigh - 30);
    p.text("Higher addiction → \nLower mental health", xLow + 65, yLow + 30);

  }

  // Helper code
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