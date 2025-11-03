// HWK. 5 Narrative Visualization 
registerSketch('sk5', function (p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let relationshipData = [];
  let hoverInfo = null;
  let colorScale;

  const pieColors = [p.color("#ff6b6b"), p.color("#4dabf7")];
  //const bubbleColors = [p.color("#f94144"), p.color("#f3722c"), p.color("#90be6d")];
  //const relStatuses = ["Single", "In Relationship", "Complicated"];
  

  p.preload = function () {
    table = p.loadTable('Students Social Media Addiction.csv', 'csv', 'header');
  }
  

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');
    //p.noLoop();
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
    hoverInfo = null;
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
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Academic Performance Impact", 0, 180);
    p.pop();
    p.pop();

    // Section 2 - Bar Chart
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
    //p.pop();


    // Section 3 - Line Chart
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

    // Section dividers
    p.push();
    p.stroke(180);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([6, 6]);
    p.line(p.width * 0.33, 100, p.width * 0.33, p.height - 100);  // Divider 1
    p.line(p.width * 0.66, 100, p.width * 0.66, p.height - 100);  // Divider 2
    p.pop();



    // hover feature
    if (hoverInfo) {
      p.push();
      p.fill(255);
      p.stroke(0);
      p.rect(hoverInfo.x + 10, hoverInfo.y - 30, 180, 30, 6);
      p.noStroke();
      p.fill(0);
      p.textSize(13);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(hoverInfo.text, hoverInfo.x + 20, hoverInfo.y - 15);
      p.pop();
    }

  };

  //Pie Chart
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
    let localHover = null;

    for (let i = 0; i < values.length; i++) {
      const angle = (values[i] / total) * p.TWO_PI;
      const endAngle = startAngle + angle;

      // Check if hovering over this slice
      let isHovering = mouseDist <= radius && mouseAngle >= startAngle && mouseAngle <= endAngle;
      
      if (isHovering) {
        localHover = {
          text: `${labels[i]}: ${(values[i] / total * 100).toFixed(1)}%`
        };
        p.fill(pieColors[i]);
        p.stroke(0);
        p.strokeWeight(3);
      } else {
        p.fill(pieColors[i]);
        p.noStroke();
      }

      // Draw the slice
      p.arc(0, 0, radius*2, radius*2, startAngle, endAngle, p.PIE);
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

    // Tooltip (show above everything)
    if (localHover) {
      hoverInfo = {
        x: p.mouseX,
        y: p.mouseY,
        text: localHover.text
      };
    }

  }


  //Bar Chart
  function drawBarChart() {
    let maxSleep = Math.max(...avgSleepByAddiction.map(d => d.sleep));
    let barWidth = 20;

    p.stroke(200);
    p.strokeWeight(1);
    p.textAlign(p.RIGHT, p.CENTER);
    p.fill(0);
    p.textSize(10);

    for (let s = 0; s <= maxSleep; s++){
      let y = p.map(s, 0, maxSleep, 300, 0);
      p.line(0, y, avgSleepByAddiction.length * (barWidth + 8), y);
      p.noStroke();
      p.text(s.toFixed(0), -5, y);
      p.stroke(200);
    }


    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      let x = i * (barWidth + 8);
      let y = p.map(avgSleepByAddiction[i].sleep, 0, maxSleep, 300, 0);
      p.fill("#673ab7");
      p.noStroke();
      p.rect(x, y, barWidth, 300 - y);
    }

    p.fill(0);
    p.textSize(10);
    p.textAlign(p.CENTER);
    for (let i = 0; i < avgSleepByAddiction.length; i++) {
      p.text(avgSleepByAddiction[i].score, i * (barWidth + 8) + barWidth / 2, 320);
    }

    p.textSize(12);
    p.text("Addiction Score", 200, 350);

    p.push();
    p.translate(-40, 150);
    p.rotate(-p.HALF_PI);
    p.text("Average Sleep Hours", 0, 0);
    p.pop();
  }

  // Line chart
  function drawLineChart() {
    // Axis ranges
    let xMin = 0, xMax = 10;
    let yMin = 0, yMax = 10;

    // Chart area dimensions
    let chartW = 300;
    let chartH = 250;

    // Prep data
    let addictionMap = {}; // { score: [mentalHealthValues] }

    for (let r of table.rows) {
      let addiction = parseFloat(r.get("Addicted_Score"));
      let mental = parseFloat(r.get("Mental_Health_Score"));
      if (!isNaN(addiction) && !isNaN(mental)) {
        if (!addictionMap[addiction]) addictionMap[addiction] = [];
        addictionMap[addiction].push(mental);
      }
    }

    // Compute averages
    let points = [];
    for (let score in addictionMap) {
      let avgMental =
        addictionMap[score].reduce((a, b) => a + b, 0) / addictionMap[score].length;
      points.push({ score: parseFloat(score), mental: avgMental });
    }

    // Sort by addiction score
    points.sort((a, b) => a.score - b.score);

    // Draw gridlines
    p.stroke(230);
    p.strokeWeight(1);
    p.fill(80);
    p.textSize(10);

    // Horizontal gridlines + labels
    for (let i = 0; i <= 10; i++) {
      let y = p.map(i, yMin, yMax, chartH, 0);
      p.line(40, y, chartW + 40, y);
      p.noStroke();
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(i, 30, y);
      p.stroke(230);
    }

    // Vertical gridlines + labels
    for (let i = 0; i <= 10; i++) {
      let x = p.map(i, xMin, xMax, 40, chartW + 40);
      p.line(x, chartH, x, 0);
      p.noStroke();
      p.textAlign(p.CENTER, p.TOP);
      p.text(i, x, chartH + 5);
      p.stroke(230);
    }

    // Axis labels
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER);
    p.text("Addiction Score", chartW / 2 + 40, chartH + 30);
    p.push();
    p.translate(10, chartH / 2);
    p.rotate(-p.HALF_PI);
    p.text("Average Mental Health Score", 0, 0);
    p.pop();

    // Draw chart
    p.noFill();
    p.stroke("#6a4c93");
    p.strokeWeight(2);
    p.beginShape();
    for (let pt of points) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW + 40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);
      p.vertex(x, y);
    }
    p.endShape();

    // Draw points
    p.fill("#6a4c93");
    p.noStroke();
    for (let pt of points) {
      let x = p.map(pt.score, xMin, xMax, 40, chartW + 40);
      let y = p.map(pt.mental, yMin, yMax, chartH, 0);
      p.ellipse(x, y, 7, 7);
    }

    // Chart title
    p.fill("#000000");
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.pop();
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
