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

    

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
