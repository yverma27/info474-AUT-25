// Example 2
registerSketch('sk5', function (p) {
  let table;
  let yesCount = 0, noCount = 0;
  let avgSleepByAddiction = [];
  let relationshipData = [];
  let hoverInfo = null;
  let colorScale;

  const pieColors = [p.color("#ff6b6b"), p.color("#4dabf7")];
  const bubbleColors = [p.color("#f94144"), p.color("#f3722c"), p.color("#90be6d")];
  const relStatuses = ["Single", "In Relationship", "Complicated"];
  

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
    p.text("Academic Performance Impact", 0, 200);
    p.pop();
    p.pop();

    // Section 2 - Bar Chart
    p.push();
    p.translate(p.width * 0.5 - 200, p.height / 2 - 200);
    drawBarChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Sleep Hours vs Addiction Score", 200, 380);
    p.pop();
    p.pop();

    // Section 3 - Bubble Chart
    p.push();
    p.translate(p.width * 0.8, p.height / 2);
    drawBubbleChart();
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.push();
    p.textStyle(p.ITALIC);
    p.text("Conflicts & Wellbeing by Relationship Status", 0, 200);
    p.pop();
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

    for (let i = 0; i < values.length; i++) {
      const angle = (values[i] / total) * p.TWO_PI;
      const endAngle = startAngle + angle;

      // Check if hovering over this slice
      let isHovering = false;
      if (mouseDist <= radius) {
        // Handle angle wrapping
        if (endAngle > p.TWO_PI) {
          // Slice crosses the 0/2π boundary
          isHovering = (mouseAngle >= startAngle && mouseAngle <= p.TWO_PI) || 
                       (mouseAngle >= 0 && mouseAngle <= (endAngle - p.TWO_PI));
        } else {
          // Normal case
          isHovering = mouseAngle >= startAngle && mouseAngle <= endAngle;
        }
      }

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
        p.stroke(255);
        p.strokeWeight(1);
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
      p.text(labels[i], legendX + 20, legendY + i * 22 + 7);
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
    for (let s = 0; s <= maxSleep; s++){
      let y = p.map(s, 0, maxSleep, 300, 0);
      p.line(0, y, avgSleepByAddiction.length * (barWidth + 8), y);
      p.noStroke();
      p.text(s, -5, y);
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

  // Bubble Chart
  function drawBubbleChart() {
    let yMin = -100;
    let yMax = 100;
    let xMin = -120;
    let xMax = 120;

    p.stroke(220);
    p.strokeWeight(1);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(10);
    p.fill(100);
    for (let i = 0; i <= 10; i += 2){
      let y = p.map(i, 0, 10, yMax, yMin);
      p.noStroke();
      p.text(i, xMin - 10, y);
      p.stroke(220);
      p.line(xMin, y, xMax, y);
    }

    /*for (let i = 0; i < relationshipData.length; i++) {
      let x = p.map(i, 0, relationshipData.length - 1, xMin, xMax);
      p.line(x, yMin, x, yMax);
    }*/

    let relationshipColors = {
      "Single": bubbleColors[0],
      "In Relationship": bubbleColors[1],
      "Complicated": bubbleColors[2]
    };

    for (let i = 0; i < relationshipData.length; i++) {
      let d = relationshipData[i];
      let x = p.map(i, 0, relationshipData.length - 1, xMin + 20, xMax - 20);
      let y = p.map(d.conflicts, 0, 10, yMax, yMin);
      let bubbleSize = p.map(d.addiction, 1, 10, 30, 70);

      //let mentalHealthColor = colorScale[Math.floor(p.map(d.mentalHealth, 1, 10, 0, 9))];

      let bubbleColor = relationshipColors[d.relation] || bubbleColors[0];
      p.fill(bubbleColor);
      p.noStroke();
      p.ellipse(x, y, bubbleSize);
      p.fill(0);
      p.textAlign(p.CENTER);
      p.textSize(11);
      p.text(d.relation, x, yMax + 20);
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
