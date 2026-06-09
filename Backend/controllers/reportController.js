const PDFDocument = require("pdfkit");
const User = require("../models/User");
const Progress = require("../models/Progress");

function calculateBodyStats(heightCm, weightKg, age = 25, gender = 'Female') {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const standardWeight = 22 * (heightM * heightM);
  
  let bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
  if (gender.toLowerCase() === 'male') bodyFat = (1.20 * bmi) + (0.23 * age) - 10.8 - 5.4;
  bodyFat = Math.max(5, Math.min(bodyFat, 50));
  
  const fatMass = weightKg * (bodyFat / 100);
  const leanBodyMass = weightKg - fatMass;
  
  const muscleMass = leanBodyMass * 0.45;
  const muscleRate = (muscleMass / weightKg) * 100;
  
  const moisture = leanBodyMass * 0.73;
  const protein = leanBodyMass * 0.20; 
  const proteinRate = (protein / weightKg) * 100;
  const boneMass = leanBodyMass * 0.05;
  
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  bmr = gender.toLowerCase() === 'male' ? bmr + 5 : bmr - 161;
  
  return {
    bmi: bmi.toFixed(1),
    standardWeight: standardWeight.toFixed(2),
    bodyFat: bodyFat.toFixed(1),
    fatMass: fatMass.toFixed(2),
    leanBodyMass: leanBodyMass.toFixed(2),
    muscleMass: muscleMass.toFixed(2),
    muscleRate: muscleRate.toFixed(1),
    moisture: moisture.toFixed(1),
    protein: protein.toFixed(2),
    proteinRate: proteinRate.toFixed(1),
    boneMass: boneMass.toFixed(1),
    bmr: Math.round(bmr)
  };
}

function drawRoundedRect(doc, x, y, width, height, radius, fillColor, strokeColor) {
  doc.roundedRect(x, y, width, height, radius);
  if (fillColor && strokeColor) {
    doc.lineWidth(1).fillAndStroke(fillColor, strokeColor);
  } else if (fillColor) {
    doc.fill(fillColor);
  } else if (strokeColor) {
    doc.lineWidth(1).stroke(strokeColor);
  }
}

const generateReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const progress = await Progress.find({ user: req.user.id }).sort({ createdAt: 1 });

    const height = user.height || 160;
    const currentWeight = progress.length > 0 ? progress[progress.length - 1].weight : (user.weight || 50);
    const prevWeight = progress.length > 1 ? progress[progress.length - 2].weight : currentWeight;
    const weightDiff = (currentWeight - prevWeight).toFixed(1);
    
    // Mock user details since gender/age aren't in standard model
    const gender = user.gender || "Female";
    const age = user.age || 24;
    
    const stats = calculateBodyStats(height, currentWeight, age, gender);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Body_Composition_Report.pdf");
    doc.pipe(res);

    // Default font
    doc.font('Helvetica');
    const primaryColor = '#10b981'; // emerald-500
    const textColor = '#334155';
    const lightGray = '#f8fafc'; // slate-50
    const borderColor = '#e2e8f0'; // slate-200

    // Title
    doc.fontSize(22).fillColor(textColor).text("Body composition analysis report", 0, 40, { align: 'center' });
    doc.fontSize(10).fillColor('#64748b').text(new Date().toLocaleString(), 0, 65, { align: 'center' });

    // User Info Header Card
    let currentY = 95;
    drawRoundedRect(doc, 30, currentY, 535, 40, 8, '#ffffff', borderColor);
    doc.fillColor(textColor).fontSize(11);
    doc.text(`Name: ${user.name}`, 80, currentY + 15);
    doc.text(`Gender: ${gender}`, 220, currentY + 15);
    doc.text(`Height: ${height}cm`, 350, currentY + 15);
    doc.text(`Age: ${age}`, 480, currentY + 15);
    
    currentY += 55;

    // --- ROW 1 ---
    const col1X = 30;
    const col2X = 305;
    const cardWidth = 260;
    const cardHeightRow1 = 180;

    // Card 1: Basic Data
    drawRoundedRect(doc, col1X, currentY, cardWidth, cardHeightRow1, 8, '#ffffff', borderColor);
    // Green accent line
    doc.rect(col1X + 10, currentY + 15, 3, 12).fill(primaryColor);
    doc.fillColor(textColor).fontSize(12).text("Basic data", col1X + 20, currentY + 14);
    
    // Large Weight
    doc.fontSize(40).text(currentWeight.toString(), col1X + 15, currentY + 40);
    doc.fontSize(12).text("kg", col1X + 105, currentY + 62);
    
    // Standard tag
    drawRoundedRect(doc, col1X + 130, currentY + 42, 50, 18, 4, primaryColor, null);
    doc.fillColor('#ffffff').fontSize(9).text("Standard", col1X + 135, currentY + 47);
    
    // Compared to last
    doc.fillColor('#64748b').fontSize(10).text(`${weightDiff >= 0 ? '↑' : '↓'} ${Math.abs(weightDiff)} Compared to last`, col1X + 130, currentY + 65);
    
    // Separator
    doc.moveTo(col1X + 15, currentY + 95).lineTo(col1X + cardWidth - 15, currentY + 95).lineWidth(1).stroke(borderColor);
    
    // Progress Bars (BMI, Body fat, Muscle rate)
    const drawBasicDataRow = (yPos, label, value, max, unit) => {
      doc.fillColor(textColor).fontSize(10).text(label, col1X + 15, yPos);
      
      // Track
      drawRoundedRect(doc, col1X + 80, yPos + 2, 80, 8, 4, lightGray, null);
      // Fill
      const fillW = Math.min((value / max) * 80, 80);
      drawRoundedRect(doc, col1X + 80, yPos + 2, fillW, 8, 4, primaryColor, null);
      
      doc.fillColor(textColor).text(`${value}${unit}`, col1X + 170, yPos);
      
      drawRoundedRect(doc, col1X + 210, yPos - 2, 40, 15, 2, primaryColor, null);
      doc.fillColor('#ffffff').fontSize(8).text("Standard", col1X + 213, yPos + 2);
    };
    
    drawBasicDataRow(currentY + 110, "BMI", stats.bmi, 30, "");
    drawBasicDataRow(currentY + 135, "Body fat", stats.bodyFat, 40, "%");
    drawBasicDataRow(currentY + 160, "Muscle rate", stats.muscleRate, 60, "%");


    // Card 2: Body composition analysis
    drawRoundedRect(doc, col2X, currentY, cardWidth, cardHeightRow1, 8, '#ffffff', borderColor);
    doc.rect(col2X + 10, currentY + 15, 3, 12).fill(primaryColor);
    doc.fillColor(textColor).fontSize(12).text("Body composition analysis", col2X + 20, currentY + 14);
    
    const drawCompRow = (yPos, label, value) => {
      drawRoundedRect(doc, col2X + 15, yPos - 5, 230, 25, 2, lightGray, null);
      doc.fillColor(textColor).fontSize(10).text(label, col2X + 25, yPos);
      doc.text(`${value}`, col2X + 130, yPos);
      drawRoundedRect(doc, col2X + 195, yPos - 3, 40, 18, 2, primaryColor, null);
      doc.fillColor('#ffffff').fontSize(8).text("Standard", col2X + 198, yPos + 2);
    };

    drawCompRow(currentY + 50, "Fat mass", `${stats.fatMass}kg`);
    drawCompRow(currentY + 80, "Moisture", `${stats.moisture}%`);
    drawCompRow(currentY + 110, "Protein", `${stats.protein}kg`);
    drawCompRow(currentY + 140, "Bone mass", `${stats.boneMass}kg`);

    currentY += cardHeightRow1 + 15;


    // --- ROW 2 ---
    const cardHeightRow2 = 200;
    
    // Card 3: Weight Control Table
    drawRoundedRect(doc, col1X, currentY, cardWidth, cardHeightRow2, 8, '#ffffff', borderColor);
    doc.rect(col1X + 10, currentY + 15, 3, 12).fill(primaryColor);
    doc.fillColor(textColor).fontSize(12).text("Weight control", col1X + 20, currentY + 14);
    
    const drawTableRow = (yPos, col1Text, col2Text, isHeader = false) => {
      if(isHeader) {
        drawRoundedRect(doc, col1X + 15, yPos - 5, cardWidth - 30, 20, 2, lightGray, null);
        doc.fillColor('#64748b').fontSize(10);
      } else {
        doc.fillColor(textColor).fontSize(10);
      }
      doc.text(col1Text, col1X + 25, yPos);
      doc.text(col2Text, col1X + 170, yPos);
    };

    drawTableRow(currentY + 45, "Index", "Measurements", true);
    drawTableRow(currentY + 75, "Current weight", `${currentWeight.toFixed(2)}kg`);
    drawTableRow(currentY + 100, "Standard weight", `${stats.standardWeight}kg`);
    drawTableRow(currentY + 125, "Muscle mass", `${stats.muscleMass}kg`);
    drawTableRow(currentY + 150, "Lean body mass", `${stats.leanBodyMass}kg`);
    drawTableRow(currentY + 175, "Weight control", `${(currentWeight - stats.standardWeight).toFixed(2)}kg`);


    // Card 4: Body Type Grid
    drawRoundedRect(doc, col2X, currentY, cardWidth, cardHeightRow2, 8, '#ffffff', borderColor);
    doc.rect(col2X + 10, currentY + 15, 3, 12).fill(primaryColor);
    doc.fillColor(textColor).fontSize(12).text("Body type", col2X + 20, currentY + 14);
    
    doc.fontSize(14).text("Standard", col2X, currentY + 40, { width: cardWidth, align: 'center' });
    
    // 3x3 Grid
    const gridX = col2X + 30;
    const gridY = currentY + 65;
    const boxW = 60;
    const boxH = 35;
    const gap = 5;
    
    const types = [
      "Recessive\nobesity", "Overweight", "Muscular\nOverweight",
      "Lack of\nexercise", "Standard", "Standard\nmuscular",
      "Thin", "Thin &\nmuscular", "Strong &\nmuscular"
    ];

    doc.fontSize(8);
    for(let row = 0; row < 3; row++) {
      for(let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        const bx = gridX + col * (boxW + gap);
        const by = gridY + row * (boxH + gap);
        
        if (index === 4) { // Standard is active
          drawRoundedRect(doc, bx, by, boxW, boxH, 4, primaryColor, null);
          doc.fillColor('#ffffff').text(types[index], bx, by + 10, { width: boxW, align: 'center' });
        } else {
          drawRoundedRect(doc, bx, by, boxW, boxH, 4, lightGray, null);
          doc.fillColor('#64748b').text(types[index], bx, by + 8, { width: boxW, align: 'center' });
        }
      }
    }
    
    // Axis lines
    doc.moveTo(gridX - 10, gridY + 120).lineTo(gridX + 200, gridY + 120).lineWidth(1).stroke(borderColor); // X axis
    doc.moveTo(gridX - 10, gridY - 10).lineTo(gridX - 10, gridY + 120).lineWidth(1).stroke(borderColor); // Y axis
    
    // Y-axis arrow head
    doc.moveTo(gridX - 10, gridY - 12).lineTo(gridX - 13, gridY - 5).lineTo(gridX - 7, gridY - 5).fill('#ef4444');
    
    // X-axis arrow head
    doc.moveTo(gridX + 203, gridY + 120).lineTo(gridX + 195, gridY + 117).lineTo(gridX + 195, gridY + 123).fill('#ef4444');

    doc.fillColor('#64748b').fontSize(7).text("Muscle rate", gridX + 70, gridY + 125);
    doc.text("Excellent", gridX + 160, gridY + 125);

    doc.text("High", gridX - 25, gridY - 10);
    const fatMassText = "F a t m a s s".split(' ');
    let fmY = gridY + 15;
    fatMassText.forEach(char => {
      doc.text(char, gridX - 20, fmY);
      fmY += 8;
    });

    currentY += cardHeightRow2 + 15;


    // --- ROW 3 ---
    // Card 5: Other Indicators
    const cardHeightRow3 = 110;
    drawRoundedRect(doc, col1X, currentY, 535, cardHeightRow3, 8, '#ffffff', borderColor);
    doc.rect(col1X + 10, currentY + 15, 3, 12).fill(primaryColor);
    doc.fillColor(textColor).fontSize(12).text("Other indicators", col1X + 20, currentY + 14);
    
    const tCol1 = col1X + 15;
    const tCol2 = col1X + 270;
    
    drawRoundedRect(doc, tCol1, currentY + 40, 240, 20, 2, lightGray, null);
    drawRoundedRect(doc, tCol2, currentY + 40, 240, 20, 2, lightGray, null);
    
    doc.fillColor('#64748b').fontSize(10);
    doc.text("Index", tCol1 + 10, currentY + 45);
    doc.text("Measurements", tCol1 + 90, currentY + 45);
    doc.text("Reference", tCol1 + 170, currentY + 45);
    
    doc.text("Index", tCol2 + 10, currentY + 45);
    doc.text("Measurements", tCol2 + 90, currentY + 45);
    doc.text("Reference", tCol2 + 170, currentY + 45);
    
    doc.fillColor(textColor);
    // Left side data
    doc.text("BMR", tCol1 + 10, currentY + 70);
    doc.text(`${stats.bmr} kcal`, tCol1 + 90, currentY + 70);
    doc.text("1104~1349", tCol1 + 170, currentY + 70);
    
    doc.text("Visceral fat index", tCol1 + 10, currentY + 90);
    doc.text(`4`, tCol1 + 90, currentY + 90); // Mocked safe value
    doc.text("<11", tCol1 + 170, currentY + 90);

    // Right side data
    doc.text("Body age", tCol2 + 10, currentY + 70);
    doc.text(`${age}`, tCol2 + 90, currentY + 70);
    doc.text(`${age-1}~${age+1}`, tCol2 + 170, currentY + 70);
    
    doc.text("Obesity rating", tCol2 + 10, currentY + 90);
    doc.text(`Standard`, tCol2 + 90, currentY + 90);
    doc.text("Standard", tCol2 + 170, currentY + 90);

    currentY += cardHeightRow3 + 15;

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };