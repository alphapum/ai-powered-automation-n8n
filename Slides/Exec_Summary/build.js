// ============================================================
// KU AI Direction — Executive Summary (5 slides)
// For senior management of Kasetsart University
// ============================================================

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.title = "AI สำหรับองค์กร — มหาวิทยาลัยเกษตรศาสตร์";
pres.author = "สำนักบริการคอมพิวเตอร์ × ฝ่ายเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์";

// ============================================================
// Brand palette
// ============================================================
const COLORS = {
  KUgreen: "006633",
  KUgreenDark: "004D26",
  KUgreenLight: "2E8B57",
  KUgreenSoft: "E8F5E9",
  KUgold: "C9A961",
  KUgoldSoft: "F5EDD6",
  KUcream: "FFFDF7",
  white: "FFFFFF",
  ink: "1A1A1A",
  inkSoft: "4A4A4A",
  gray: "6B6B6B",
  grayLight: "B0B0B0",
  bgSoft: "F8F9F7",
  bgWarm: "FAF6EE",
  red: "B83D3D",
};

const FONT_THAI = "TH Sarabun New";
const FONT_FALLBACK = "Sarabun";

// Helper: text with Thai-friendly font
function thaiText(text, opts) {
  return { ...opts, fontFace: FONT_THAI };
}

// ============================================================
// SLIDE 1 — Cover
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.KUgreenDark };

  // Left vertical gold accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.2, h: 5.625,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });

  // Top label
  s.addText("EXECUTIVE SUMMARY", {
    x: 0.7, y: 0.55, w: 6, h: 0.4,
    fontFace: "Calibri", fontSize: 14, charSpacing: 8,
    color: COLORS.KUgold, bold: true, margin: 0,
  });

  // Big title
  s.addText("AI สำหรับองค์กร", {
    x: 0.7, y: 1.1, w: 9, h: 1.4,
    fontFace: FONT_THAI, fontSize: 72, bold: true,
    color: COLORS.white, margin: 0,
  });

  // Subtitle
  s.addText("ทิศทางการนำ AI มาใช้ใน มหาวิทยาลัยเกษตรศาสตร์", {
    x: 0.7, y: 2.55, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 32,
    color: COLORS.white, margin: 0,
  });

  // Gold divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 3.5, w: 2, h: 0.05,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });

  // Decorative right-side number
  s.addText("5,000+", {
    x: 6.5, y: 1.0, w: 3.0, h: 1.2,
    fontFace: "Calibri", fontSize: 80, bold: true, italic: true,
    color: COLORS.KUgreen, align: "right",
    transparency: 70, margin: 0,
  });
  s.addText("บุคลากร มก. ที่สามารถใช้ AI ได้", {
    x: 6.5, y: 2.2, w: 3.0, h: 0.4,
    fontFace: FONT_THAI, fontSize: 16,
    color: COLORS.KUgold, align: "right", italic: true,
    transparency: 30, margin: 0,
  });

  // Body context
  s.addText([
    {
      text: "ภาพรวมโครงสร้างพื้นฐาน AI, โอกาส, และ Roadmap 18 เดือน\n",
      options: { fontSize: 18, color: COLORS.white, breakLine: true },
    },
    {
      text: "สำหรับผู้บริหารระดับสูงของมหาวิทยาลัยเกษตรศาสตร์",
      options: { fontSize: 18, color: COLORS.KUgold, italic: true },
    },
  ], {
    x: 0.7, y: 3.7, w: 9, h: 1.0, fontFace: FONT_THAI, margin: 0,
  });

  // Footer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.425,
    fill: { color: COLORS.KUgreen }, line: { type: "none" },
  });
  s.addText("สำนักบริการคอมพิวเตอร์  ×  ฝ่ายเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์   |   พฤษภาคม 2569", {
    x: 0.7, y: 5.2, w: 8.6, h: 0.425,
    fontFace: FONT_THAI, fontSize: 13, color: COLORS.white,
    valign: "middle", margin: 0,
  });
}

// ============================================================
// SLIDE 2 — Why AI Now (Vision)
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.white };

  // Header
  s.addText("ทำไม มก. ต้องลงทุน AI ตั้งแต่วันนี้", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 36, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("Why now — 3 มุมมองที่ผู้บริหาร มก. ควรพิจารณา", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontFace: FONT_THAI, fontSize: 16, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // Three columns
  const colW = 2.9, colH = 3.0, colY = 1.6;
  const cols = [
    {
      icon: "🌍",
      iconColor: COLORS.KUgreenLight,
      label: "01",
      title: "แนวโน้มโลก",
      body: "AI กระทบทุกอุตสาหกรรม\nมหาวิทยาลัยที่ไม่ปรับตัว\nจะเสียความสามารถ\nในการแข่งขัน 5 ปีข้างหน้า",
      stat: "70%",
      statLabel: "ของงาน admin\nจะเปลี่ยนรูปแบบ",
    },
    {
      icon: "🏛️",
      iconColor: COLORS.KUgold,
      label: "02",
      title: "ม.รัฐในไทย",
      body: "จุฬาฯ + มหิดล + ม.รังสิต\nลงทุน AI Center,\nLLM ของตัวเอง,\nและ workflow automation",
      stat: "3-5",
      statLabel: "มหาวิทยาลัยคู่แข่ง\nลงทุนแล้ว",
    },
    {
      icon: "⏰",
      iconColor: COLORS.KUgreen,
      label: "03",
      title: "โอกาสของ มก.",
      body: "ประหยัด ~200 ชม./ปี\nต่อบุคลากร 1 คน\n×  5,000 คน เป้าหมาย",
      stat: "1M+",
      statLabel: "ชั่วโมง/ปี\nที่ประหยัดได้",
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.5 + i * (colW + 0.1);

    // Card background
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH,
      fill: { color: COLORS.bgSoft },
      line: { color: c.iconColor, width: 0.5 },
    });

    // Top accent stripe
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: 0.12,
      fill: { color: c.iconColor }, line: { type: "none" },
    });

    // Big number label (01/02/03) in top-right
    s.addText(c.label, {
      x: x + colW - 0.9, y: colY + 0.25, w: 0.8, h: 0.5,
      fontFace: "Calibri", fontSize: 32, bold: true, italic: true,
      color: c.iconColor, align: "right", margin: 0,
      transparency: 60,
    });

    // Icon (emoji circle)
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: colY + 0.35, w: 0.7, h: 0.7,
      fill: { color: c.iconColor }, line: { type: "none" },
    });
    s.addText(c.icon, {
      x: x + 0.25, y: colY + 0.35, w: 0.7, h: 0.7,
      fontSize: 28, align: "center", valign: "middle",
      color: COLORS.white, margin: 0,
    });

    // Title
    s.addText(c.title, {
      x: x + 0.25, y: colY + 1.15, w: colW - 0.5, h: 0.4,
      fontFace: FONT_THAI, fontSize: 22, bold: true,
      color: COLORS.ink, margin: 0,
    });

    // Body
    s.addText(c.body, {
      x: x + 0.25, y: colY + 1.6, w: colW - 0.5, h: 0.9,
      fontFace: FONT_THAI, fontSize: 14,
      color: COLORS.inkSoft, margin: 0,
    });

    // Big stat
    s.addText(c.stat, {
      x: x + 0.25, y: colY + 2.3, w: colW - 0.5, h: 0.45,
      fontFace: "Calibri", fontSize: 36, bold: true,
      color: c.iconColor, margin: 0,
    });
    s.addText(c.statLabel, {
      x: x + 0.25, y: colY + 2.7, w: colW - 0.5, h: 0.3,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.gray, margin: 0,
    });
  });

  // Bottom callout — strong message
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.6,
    fill: { color: COLORS.KUgreenDark }, line: { type: "none" },
  });
  s.addText([
    { text: "การไม่ทำ ", options: { color: COLORS.KUgold, bold: true } },
    { text: "= ", options: { color: COLORS.white } },
    { text: "การถอยหลัง", options: { color: COLORS.KUgold, bold: true } },
    { text: "  —  ในขณะที่คู่แข่งเดินไปข้างหน้า", options: { color: COLORS.white } },
  ], {
    x: 0.5, y: 4.85, w: 9, h: 0.6,
    fontFace: FONT_THAI, fontSize: 20,
    align: "center", valign: "middle", margin: 0,
  });

  // Page indicator
  s.addText("02 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// SLIDE 3 — KU AI Stack (Architecture)
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.white };

  // Header
  s.addText("เรามีของพร้อมแล้ว — ไม่ต้องเริ่มจาก 0", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 36, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("KU AI Stack — โครงสร้างพื้นฐานที่มหาวิทยาลัยลงทุนไว้แล้ว", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontFace: FONT_THAI, fontSize: 16, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // Architecture layers (left side, 5 layers, top to bottom)
  const stackX = 0.5, stackW = 5.8, stackY = 1.6;
  const layerH = 0.6;
  const layers = [
    {
      label: "ผู้ใช้",
      title: "บุคลากร มก.",
      detail: "119 คน trained  →  5,000 คน เป้าหมาย",
      color: COLORS.KUgreenDark,
      tint: COLORS.KUgreenSoft,
    },
    {
      label: "Apps",
      title: "Workflows สำเร็จรูป",
      detail: "Forms→LINE  |  Gmail→Drive  |  Sheets+AI",
      color: COLORS.KUgreen,
      tint: COLORS.KUgreenSoft,
    },
    {
      label: "Orchestration",
      title: "n8n (workflow.ku.ac.th)",
      detail: "Visual automation engine • ไม่ต้องเขียน code",
      color: COLORS.KUgreenLight,
      tint: COLORS.KUgreenSoft,
    },
    {
      label: "AI Brain",
      title: "KU LLM Gateway (apigw.ku.ac.th)",
      detail: "Mistral-7B (chat) + BGE-M3 (embeddings)",
      color: COLORS.KUgold,
      tint: COLORS.KUgoldSoft,
    },
    {
      label: "Productivity",
      title: "Google Workspace",
      detail: "Forms • Sheets • Gmail • Drive (KU domain)",
      color: COLORS.KUgreen,
      tint: COLORS.KUgreenSoft,
    },
    {
      label: "Infra",
      title: "KU Cloud + Network",
      detail: "Data center มก. • Network backbone",
      color: COLORS.inkSoft,
      tint: COLORS.bgSoft,
    },
  ];

  layers.forEach((l, i) => {
    const y = stackY + i * (layerH + 0.05);

    // Layer rectangle (tinted)
    s.addShape(pres.shapes.RECTANGLE, {
      x: stackX, y, w: stackW, h: layerH,
      fill: { color: l.tint },
      line: { color: l.color, width: 0.5 },
    });

    // Left color band
    s.addShape(pres.shapes.RECTANGLE, {
      x: stackX, y, w: 0.15, h: layerH,
      fill: { color: l.color }, line: { type: "none" },
    });

    // Layer label (left vertical category)
    s.addText(l.label, {
      x: stackX + 0.25, y: y + 0.05, w: 1.3, h: 0.25,
      fontFace: "Calibri", fontSize: 9, charSpacing: 4, bold: true,
      color: l.color, margin: 0,
    });

    // Title
    s.addText(l.title, {
      x: stackX + 0.25, y: y + 0.22, w: stackW - 0.5, h: 0.3,
      fontFace: FONT_THAI, fontSize: 16, bold: true,
      color: COLORS.ink, margin: 0,
    });

    // Detail
    s.addText(l.detail, {
      x: stackX + 0.25, y: y + 0.4, w: stackW - 0.5, h: 0.2,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.inkSoft, margin: 0,
    });
  });

  // Right column — key benefits
  const rightX = 6.6, rightW = 3.0;

  s.addText("จุดเด่นของโครงสร้างนี้", {
    x: rightX, y: 1.6, w: rightW, h: 0.4,
    fontFace: FONT_THAI, fontSize: 18, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });

  const benefits = [
    { icon: "✓", title: "ฟรี!", body: "ใช้ของ มก. ทั้งหมด — ไม่ต้องเสียค่า OpenAI/Anthropic", color: COLORS.KUgreen },
    { icon: "🔒", title: "Privacy", body: "Data ทั้งหมดอยู่ใน มก. — ไม่ส่งออกนอกองค์กร", color: COLORS.KUgold },
    { icon: "⚡", title: "เร็ว", body: "Network ภายใน มก. — latency ต่ำ", color: COLORS.KUgreenLight },
    { icon: "🎓", title: "เหมาะกับการศึกษา", body: "ปรับ + ขยายตามความต้องการอาจารย์/บุคลากร", color: COLORS.KUgreenDark },
  ];

  benefits.forEach((b, i) => {
    const y = 2.1 + i * 0.75;

    // Icon circle
    s.addShape(pres.shapes.OVAL, {
      x: rightX, y, w: 0.45, h: 0.45,
      fill: { color: b.color }, line: { type: "none" },
    });
    s.addText(b.icon, {
      x: rightX, y, w: 0.45, h: 0.45,
      fontSize: 18, align: "center", valign: "middle",
      color: COLORS.white, bold: true, margin: 0,
    });

    // Title + body
    s.addText(b.title, {
      x: rightX + 0.55, y: y - 0.02, w: rightW - 0.55, h: 0.3,
      fontFace: FONT_THAI, fontSize: 15, bold: true,
      color: COLORS.ink, margin: 0,
    });
    s.addText(b.body, {
      x: rightX + 0.55, y: y + 0.27, w: rightW - 0.55, h: 0.5,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.gray, margin: 0,
    });
  });

  // Page indicator
  s.addText("03 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// SLIDE 4 — AI Agent Architecture (Single Agent)
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.white };

  // Header
  s.addText("สถาปัตยกรรม AI Agent", {
    x: 0.5, y: 0.3, w: 9, h: 0.55,
    fontFace: FONT_THAI, fontSize: 32, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("User สั่งงาน → Agent ใช้ Tools/Database + LLM → ทำ Action → Feedback Loop", {
    x: 0.5, y: 0.85, w: 9, h: 0.3,
    fontFace: FONT_THAI, fontSize: 13, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // ===========================================================
  // Diagram — Container box + components
  // ===========================================================
  const containerX = 1.5, containerY = 1.85;
  const containerW = 7.0, containerH = 2.95;

  // ---- USER (top, outside container) ----
  const userX = 4.5, userY = 1.3;
  s.addText("👥", {
    x: userX - 0.35, y: userY - 0.1, w: 0.6, h: 0.5,
    fontSize: 26, align: "center", valign: "middle", margin: 0,
  });
  s.addText("User", {
    x: userX + 0.25, y: userY, w: 0.8, h: 0.35,
    fontFace: FONT_THAI, fontSize: 14, bold: true,
    color: COLORS.KUgreen, valign: "middle", margin: 0,
  });

  // Bidirectional arrows User <-> Agent
  s.addShape(pres.shapes.LINE, {
    x: userX - 0.1, y: userY + 0.5, w: 0, h: 0.3,
    line: { color: COLORS.ink, width: 2, endArrowType: "triangle" },
  });
  s.addShape(pres.shapes.LINE, {
    x: userX + 0.1, y: userY + 0.5, w: 0, h: 0.3,
    line: { color: COLORS.ink, width: 2, beginArrowType: "triangle" },
  });

  // ---- Container box (thin border) ----
  s.addShape(pres.shapes.RECTANGLE, {
    x: containerX, y: containerY, w: containerW, h: containerH,
    fill: { color: COLORS.bgSoft },
    line: { color: COLORS.ink, width: 1.5 },
  });

  // ---- AI Agent (chip) — straddles top of container ----
  const agentX = userX - 0.4, agentY = 1.95, agentW = 0.8, agentH = 0.7;
  s.addShape(pres.shapes.RECTANGLE, {
    x: agentX, y: agentY, w: agentW, h: agentH,
    fill: { color: COLORS.white },
    line: { color: COLORS.KUgreen, width: 2.5 },
  });
  // Chip inner pattern (circuit-like)
  s.addShape(pres.shapes.RECTANGLE, {
    x: agentX + 0.1, y: agentY + 0.1, w: agentW - 0.2, h: agentH - 0.2,
    fill: { color: COLORS.KUgreenSoft },
    line: { color: COLORS.KUgreen, width: 0.5 },
  });
  // Pins (small lines on sides)
  for (let i = 0; i < 3; i++) {
    const py = agentY + 0.15 + i * 0.2;
    s.addShape(pres.shapes.LINE, { x: agentX - 0.08, y: py, w: 0.08, h: 0, line: { color: COLORS.KUgreen, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: agentX + agentW, y: py, w: 0.08, h: 0, line: { color: COLORS.KUgreen, width: 1.5 } });
  }
  s.addText("AI", {
    x: agentX, y: agentY + 0.05, w: agentW, h: 0.6,
    fontFace: "Calibri", fontSize: 22, bold: true, italic: true,
    color: COLORS.KUgreen, align: "center", valign: "middle", margin: 0,
  });
  s.addText("AI Agent", {
    x: agentX - 1.4, y: agentY + 0.15, w: 1.3, h: 0.35,
    fontFace: FONT_THAI, fontSize: 14, bold: true,
    color: COLORS.ink, align: "right", valign: "middle", margin: 0,
  });

  // ---- DATABASE (left top, inside container) ----
  const dbX = 1.8, dbY = 2.4;
  const dbW = 0.85, dbH = 0.65;
  // Cylinder approximation (oval top + rectangle + oval bottom)
  s.addShape(pres.shapes.OVAL, {
    x: dbX, y: dbY, w: dbW, h: 0.2,
    fill: { color: COLORS.KUgold }, line: { color: COLORS.KUgold, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: dbX, y: dbY + 0.1, w: dbW, h: dbH - 0.2,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });
  s.addShape(pres.shapes.OVAL, {
    x: dbX, y: dbY + dbH - 0.2, w: dbW, h: 0.2,
    fill: { color: COLORS.KUgoldSoft }, line: { color: COLORS.KUgold, width: 1 },
  });
  // Database "lines" pattern
  s.addShape(pres.shapes.LINE, {
    x: dbX + 0.1, y: dbY + 0.3, w: dbW - 0.2, h: 0, line: { color: COLORS.white, width: 0.5 },
  });
  s.addText("Database", {
    x: dbX - 0.3, y: dbY + dbH + 0.05, w: dbW + 0.6, h: 0.3,
    fontFace: FONT_THAI, fontSize: 12, bold: true,
    color: COLORS.ink, align: "center", margin: 0,
  });

  // ---- VECTOR DATABASE (left bottom, inside container) ----
  const vdbX = 1.8, vdbY = 3.75;
  s.addShape(pres.shapes.OVAL, {
    x: vdbX, y: vdbY, w: dbW, h: 0.2,
    fill: { color: COLORS.KUgreenLight }, line: { color: COLORS.KUgreen, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: vdbX, y: vdbY + 0.1, w: dbW, h: dbH - 0.2,
    fill: { color: COLORS.KUgreenLight }, line: { type: "none" },
  });
  s.addShape(pres.shapes.OVAL, {
    x: vdbX, y: vdbY + dbH - 0.2, w: dbW, h: 0.2,
    fill: { color: COLORS.KUgreenSoft }, line: { color: COLORS.KUgreen, width: 1 },
  });
  // Dots pattern (vector representation)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      s.addShape(pres.shapes.OVAL, {
        x: vdbX + 0.15 + i * 0.13, y: vdbY + 0.28 + j * 0.12, w: 0.04, h: 0.04,
        fill: { color: COLORS.white }, line: { type: "none" },
      });
    }
  }
  s.addText("Vector\nDatabase", {
    x: vdbX - 0.4, y: vdbY + dbH + 0.05, w: dbW + 0.8, h: 0.45,
    fontFace: FONT_THAI, fontSize: 12, bold: true,
    color: COLORS.ink, align: "center", margin: 0,
  });

  // ---- LLM (center) ----
  const llmX = 4.45, llmY = 3.2;
  const boxW = 0.9, boxH = 0.85;
  s.addShape(pres.shapes.RECTANGLE, {
    x: llmX, y: llmY, w: boxW, h: boxH,
    fill: { color: COLORS.white },
    line: { color: COLORS.KUgreen, width: 2 },
  });
  // Inner neural network icon (simple node graph)
  s.addText("🧠", {
    x: llmX, y: llmY, w: boxW, h: boxH,
    fontSize: 32, align: "center", valign: "middle", margin: 0,
  });
  s.addText("LLM", {
    x: llmX - 0.5, y: llmY + boxH + 0.05, w: boxW + 1.0, h: 0.3,
    fontFace: FONT_THAI, fontSize: 13, bold: true,
    color: COLORS.ink, align: "center", margin: 0,
  });

  // ---- ACTION (right) ----
  const actX = 6.7, actY = 3.2;
  s.addShape(pres.shapes.RECTANGLE, {
    x: actX, y: actY, w: boxW, h: boxH,
    fill: { color: COLORS.white },
    line: { color: COLORS.red, width: 2 },
  });
  s.addText("⚙️", {
    x: actX, y: actY, w: boxW, h: boxH,
    fontSize: 32, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Action", {
    x: actX - 0.5, y: actY + boxH + 0.05, w: boxW + 1.0, h: 0.3,
    fontFace: FONT_THAI, fontSize: 13, bold: true,
    color: COLORS.ink, align: "center", margin: 0,
  });

  // ===========================================================
  // Arrows inside container
  // ===========================================================
  // Agent -> Database (bidirectional)
  s.addShape(pres.shapes.LINE, {
    x: dbX + dbW + 0.05, y: dbY + 0.25, w: agentX - (dbX + dbW + 0.05) - 0.05, h: agentY + 0.4 - (dbY + 0.25),
    line: { color: COLORS.ink, width: 1.5, endArrowType: "triangle" },
  });
  s.addShape(pres.shapes.LINE, {
    x: dbX + dbW + 0.05, y: dbY + 0.45, w: agentX - (dbX + dbW + 0.05) - 0.05, h: agentY + 0.55 - (dbY + 0.45),
    line: { color: COLORS.ink, width: 1.5, beginArrowType: "triangle" },
  });

  // Agent -> Vector DB (bidirectional)
  s.addShape(pres.shapes.LINE, {
    x: vdbX + dbW + 0.05, y: vdbY + 0.25, w: agentX - (vdbX + dbW + 0.05) - 0.05, h: agentY + 0.4 - (vdbY + 0.25),
    line: { color: COLORS.ink, width: 1.5, endArrowType: "triangle" }, flipV: true,
  });
  s.addShape(pres.shapes.LINE, {
    x: vdbX + dbW + 0.05, y: vdbY + 0.45, w: agentX - (vdbX + dbW + 0.05) - 0.05, h: agentY + 0.6 - (vdbY + 0.45),
    line: { color: COLORS.ink, width: 1.5, beginArrowType: "triangle" }, flipV: true,
  });

  // Agent -> LLM (down)
  s.addShape(pres.shapes.LINE, {
    x: agentX + agentW / 2, y: agentY + agentH + 0.05, w: 0, h: llmY - (agentY + agentH) - 0.1,
    line: { color: COLORS.ink, width: 2, endArrowType: "triangle" },
  });

  // LLM -> Action (right)
  s.addShape(pres.shapes.LINE, {
    x: llmX + boxW + 0.05, y: llmY + boxH / 2, w: actX - (llmX + boxW) - 0.1, h: 0,
    line: { color: COLORS.ink, width: 2, endArrowType: "triangle" },
  });

  // ===========================================================
  // Feedback Loop (bottom, straddling container)
  // ===========================================================
  const fbX = 4.45, fbY = 4.55;
  s.addShape(pres.shapes.RECTANGLE, {
    x: fbX, y: fbY, w: boxW, h: 0.5,
    fill: { color: COLORS.white },
    line: { color: COLORS.KUgreen, width: 2 },
  });
  s.addText("🔄", {
    x: fbX, y: fbY, w: boxW, h: 0.5,
    fontSize: 22, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Feedback Loop", {
    x: fbX + boxW + 0.1, y: fbY + 0.1, w: 1.6, h: 0.3,
    fontFace: FONT_THAI, fontSize: 12, bold: true,
    color: COLORS.ink, valign: "middle", margin: 0,
  });

  // Circular feedback arrows below
  s.addText("↻", {
    x: fbX - 0.4, y: fbY + 0.55, w: 0.5, h: 0.3,
    fontSize: 16, color: COLORS.grayLight, align: "center", margin: 0,
  });
  s.addText("↺", {
    x: fbX + boxW - 0.1, y: fbY + 0.55, w: 0.5, h: 0.3,
    fontSize: 16, color: COLORS.grayLight, align: "center", margin: 0,
  });

  // Right side: KU example callout
  const rX = 8.7, rY = 1.95;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rX, y: rY, w: 1.2, h: 2.85,
    fill: { color: COLORS.KUgreenSoft },
    line: { color: COLORS.KUgreen, width: 0.5 },
  });
  s.addText("ตัวอย่าง\nใน มก.", {
    x: rX, y: rY + 0.1, w: 1.2, h: 0.55,
    fontFace: FONT_THAI, fontSize: 11, bold: true,
    color: COLORS.KUgreen, align: "center", margin: 0,
  });

  // KU mapping
  const kuMaps = [
    { label: "User", value: "นิสิต/อาจารย์" },
    { label: "LLM", value: "KU LLM" },
    { label: "DB", value: "ทะเบียน" },
    { label: "Vector", value: "BGE-M3" },
    { label: "Action", value: "ตอบ / Email" },
  ];
  kuMaps.forEach((k, i) => {
    const y = rY + 0.7 + i * 0.4;
    s.addText(k.label, {
      x: rX + 0.05, y, w: 1.1, h: 0.2,
      fontFace: "Calibri", fontSize: 8, bold: true, charSpacing: 1,
      color: COLORS.KUgreen, align: "center", margin: 0,
    });
    s.addText(k.value, {
      x: rX + 0.05, y: y + 0.15, w: 1.1, h: 0.22,
      fontFace: FONT_THAI, fontSize: 10,
      color: COLORS.ink, align: "center", margin: 0,
    });
  });

  // Bottom: Use case callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.1, w: 9, h: 0.4,
    fill: { color: COLORS.KUgreenDark }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.1, w: 0.12, h: 0.4,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });
  s.addText([
    { text: "Use case มก. :  ", options: { color: COLORS.KUgold, bold: true } },
    { text: "ผู้ช่วยอาจารย์ตอบคำถามนิสิต 24/7  —  ค้นจาก KU LLM + Vector DB (course materials) + ระบบทะเบียน", options: { color: COLORS.white } },
  ], {
    x: 0.75, y: 5.1, w: 9, h: 0.4,
    fontFace: FONT_THAI, fontSize: 12,
    valign: "middle", margin: 0,
  });

  // Page indicator
  s.addText("04 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// SLIDE 5 — Agentic AI Architecture (Multi-Agent)
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.white };

  // Header
  s.addText("สถาปัตยกรรม Agentic AI", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 36, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("Multi-Agent System  —  ทีม AI ที่ทำงานร่วมกัน (เหมาะกับงานซับซ้อน เช่น วิจัย วิเคราะห์ ตัดสินใจ)", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontFace: FONT_THAI, fontSize: 14, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // === LEFT SIDE — Multi-agent diagram ===
  // Background area
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 5.5, h: 3.6,
    fill: { color: COLORS.bgSoft }, line: { type: "none" },
  });

  // Orchestrator (top center)
  const orchX = 1.85, orchY = 1.75, orchW = 2.8, orchH = 0.7;
  s.addShape(pres.shapes.RECTANGLE, {
    x: orchX, y: orchY, w: orchW, h: orchH,
    fill: { color: COLORS.KUgreenDark }, line: { color: COLORS.KUgreen, width: 2 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.15 },
  });
  s.addText("🎭", {
    x: orchX + 0.1, y: orchY + 0.1, w: 0.5, h: 0.5,
    fontSize: 22, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Orchestrator", {
    x: orchX + 0.65, y: orchY + 0.05, w: orchW - 0.75, h: 0.3,
    fontFace: FONT_THAI, fontSize: 15, bold: true,
    color: COLORS.white, margin: 0,
  });
  s.addText("แบ่งงาน + รวบรวมผล", {
    x: orchX + 0.65, y: orchY + 0.35, w: orchW - 0.75, h: 0.3,
    fontFace: FONT_THAI, fontSize: 11,
    color: COLORS.KUgoldSoft, margin: 0,
  });

  // 4 Specialist agents (middle row)
  const agents = [
    { icon: "🔍", title: "Researcher", subtitle: "ค้นหา / รวบรวม", color: COLORS.KUgold },
    { icon: "📊", title: "Analyzer", subtitle: "วิเคราะห์ข้อมูล", color: COLORS.KUgreenLight },
    { icon: "✍️", title: "Writer", subtitle: "ร่างเนื้อหา", color: COLORS.KUgreen },
    { icon: "✅", title: "Reviewer", subtitle: "ตรวจคุณภาพ", color: COLORS.red },
  ];

  const agentY = 3.05, agentW = 1.18, agentH = 1.0, agentGap = 0.12;
  const agentsTotalW = agents.length * agentW + (agents.length - 1) * agentGap;
  const agentStartX = 0.5 + (5.5 - agentsTotalW) / 2;

  agents.forEach((a, i) => {
    const x = agentStartX + i * (agentW + agentGap);

    // Connection line from Orchestrator
    s.addShape(pres.shapes.LINE, {
      x: orchX + orchW / 2, y: orchY + orchH, w: (x + agentW / 2) - (orchX + orchW / 2), h: agentY - (orchY + orchH),
      flipH: (x + agentW / 2) < (orchX + orchW / 2),
      line: { color: COLORS.KUgreen, width: 1, dashType: "dash" },
    });

    // Agent card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: agentY, w: agentW, h: agentH,
      fill: { color: COLORS.white },
      line: { color: a.color, width: 1.5 },
    });
    // Top stripe
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: agentY, w: agentW, h: 0.08,
      fill: { color: a.color }, line: { type: "none" },
    });

    // Icon
    s.addText(a.icon, {
      x, y: agentY + 0.15, w: agentW, h: 0.4,
      fontSize: 22, align: "center", valign: "middle", margin: 0,
    });
    // Title
    s.addText(a.title, {
      x, y: agentY + 0.55, w: agentW, h: 0.25,
      fontFace: FONT_THAI, fontSize: 12, bold: true,
      color: COLORS.ink, align: "center", margin: 0,
    });
    // Subtitle
    s.addText(a.subtitle, {
      x, y: agentY + 0.78, w: agentW, h: 0.22,
      fontFace: FONT_THAI, fontSize: 10,
      color: COLORS.gray, align: "center", margin: 0,
    });
  });

  // Human-in-the-loop (bottom)
  const humanY = 4.4, humanW = 2.8, humanX = 1.85;
  s.addShape(pres.shapes.RECTANGLE, {
    x: humanX, y: humanY, w: humanW, h: 0.55,
    fill: { color: COLORS.KUgold }, line: { color: COLORS.KUgoldSoft, width: 0.5 },
  });
  s.addText("👤", {
    x: humanX + 0.1, y: humanY + 0.05, w: 0.4, h: 0.45,
    fontSize: 18, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Human-in-the-Loop", {
    x: humanX + 0.55, y: humanY, w: humanW - 0.6, h: 0.3,
    fontFace: FONT_THAI, fontSize: 13, bold: true,
    color: COLORS.white, valign: "middle", margin: 0,
  });
  s.addText("คนตรวจ + อนุมัติ", {
    x: humanX + 0.55, y: humanY + 0.27, w: humanW - 0.6, h: 0.25,
    fontFace: FONT_THAI, fontSize: 10,
    color: COLORS.white, margin: 0,
  });

  // Arrow from agents row to human
  s.addShape(pres.shapes.LINE, {
    x: humanX + humanW / 2, y: agentY + agentH, w: 0, h: humanY - (agentY + agentH),
    line: { color: COLORS.KUgreen, width: 1.5 },
  });

  // === RIGHT SIDE — Comparison + KU example ===
  const rX = 6.15, rW = 3.35;

  // Comparison table header
  s.addText("Agent vs Agentic AI — เมื่อไรใช้อะไร?", {
    x: rX, y: 1.55, w: rW, h: 0.35,
    fontFace: FONT_THAI, fontSize: 14, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });

  // Mini comparison
  const compRows = [
    { label: "Agents", agent: "1 ตัว", agentic: "หลายตัวเฉพาะทาง" },
    { label: "งาน", agent: "Q&A, lookup", agentic: "วิจัย, วิเคราะห์, ตัดสินใจ" },
    { label: "ความซับซ้อน", agent: "ต่ำ", agentic: "สูง" },
    { label: "ความเชื่อถือ", agent: "เร็ว แต่ผิดได้", agentic: "ตรวจซ้อนกัน เชื่อถือสูง" },
  ];

  // Headers
  const tblY = 1.95;
  const col1W = 0.9, col2W = 1.1, col3W = 1.35;

  s.addShape(pres.shapes.RECTANGLE, {
    x: rX, y: tblY, w: rW, h: 0.3,
    fill: { color: COLORS.KUgreen }, line: { type: "none" },
  });
  s.addText("", { x: rX, y: tblY, w: col1W, h: 0.3, margin: 0 });
  s.addText("AI Agent", {
    x: rX + col1W, y: tblY, w: col2W, h: 0.3,
    fontFace: FONT_THAI, fontSize: 11, bold: true,
    color: COLORS.white, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Agentic AI", {
    x: rX + col1W + col2W, y: tblY, w: col3W, h: 0.3,
    fontFace: FONT_THAI, fontSize: 11, bold: true,
    color: COLORS.KUgold, align: "center", valign: "middle", margin: 0,
  });

  compRows.forEach((r, i) => {
    const y = tblY + 0.3 + i * 0.32;
    const bg = i % 2 === 0 ? COLORS.bgSoft : COLORS.white;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rX, y, w: rW, h: 0.32,
      fill: { color: bg }, line: { color: COLORS.bgSoft, width: 0.5 },
    });
    s.addText(r.label, {
      x: rX + 0.1, y, w: col1W - 0.1, h: 0.32,
      fontFace: FONT_THAI, fontSize: 10, bold: true,
      color: COLORS.gray, valign: "middle", margin: 0,
    });
    s.addText(r.agent, {
      x: rX + col1W, y, w: col2W, h: 0.32,
      fontFace: FONT_THAI, fontSize: 10,
      color: COLORS.ink, align: "center", valign: "middle", margin: 0,
    });
    s.addText(r.agentic, {
      x: rX + col1W + col2W, y, w: col3W, h: 0.32,
      fontFace: FONT_THAI, fontSize: 10,
      color: COLORS.KUgreen, align: "center", valign: "middle", bold: true, margin: 0,
    });
  });

  // KU example callout in right column
  const exY = 3.65;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rX, y: exY, w: rW, h: 1.4,
    fill: { color: COLORS.KUgoldSoft },
    line: { color: COLORS.KUgold, width: 1 },
  });
  s.addText("ตัวอย่างใน มก.", {
    x: rX + 0.15, y: exY + 0.1, w: rW - 0.3, h: 0.28,
    fontFace: FONT_THAI, fontSize: 12, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("ระบบช่วยร่างข้อเสนอวิจัย", {
    x: rX + 0.15, y: exY + 0.35, w: rW - 0.3, h: 0.3,
    fontFace: FONT_THAI, fontSize: 14, bold: true,
    color: COLORS.ink, margin: 0,
  });
  s.addText([
    { text: "Researcher ", options: { bold: true, color: COLORS.KUgold } },
    { text: "ค้นวรรณกรรม", options: { color: COLORS.inkSoft } },
    { text: "  →  Analyzer ", options: { bold: true, color: COLORS.KUgreenLight, breakLine: false } },
  ], {
    x: rX + 0.15, y: exY + 0.65, w: rW - 0.3, h: 0.25,
    fontFace: FONT_THAI, fontSize: 10, margin: 0,
  });
  s.addText("Researcher → Analyzer → Writer → Reviewer → คนยืนยัน", {
    x: rX + 0.15, y: exY + 0.7, w: rW - 0.3, h: 0.28,
    fontFace: FONT_THAI, fontSize: 10,
    color: COLORS.inkSoft, margin: 0,
  });
  s.addText("ลดเวลาทำ research review จาก 2 สัปดาห์  →  1 วัน", {
    x: rX + 0.15, y: exY + 1.0, w: rW - 0.3, h: 0.3,
    fontFace: FONT_THAI, fontSize: 11, italic: true, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });

  // Bottom: callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.05, w: 9, h: 0.45,
    fill: { color: COLORS.KUgreenDark }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.05, w: 0.12, h: 0.45,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });
  s.addText([
    { text: "Roadmap:  ", options: { color: COLORS.KUgold, bold: true } },
    { text: "Foundation = AI Agents เดี่ยว (workflow.ku.ac.th)  →  ", options: { color: COLORS.white } },
    { text: "Applied = Agentic systems", options: { color: COLORS.KUgold, bold: true } },
    { text: "  (KU LLM + n8n + multi-agent orchestration)", options: { color: COLORS.white } },
  ], {
    x: 0.75, y: 5.05, w: 9, h: 0.45,
    fontFace: FONT_THAI, fontSize: 12,
    valign: "middle", margin: 0,
  });

  // Page indicator
  s.addText("05 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// SLIDE 6 — Quick Wins (Use Cases)
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.bgWarm };

  // Header
  s.addText("ทำได้แล้ววันนี้ — 5 Pattern ที่ขยายต่อได้ทันที", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 32, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("Quick Wins — Use cases ที่บุคลากร 119 คน ทดสอบแล้วใน Foundation Workshop", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontFace: FONT_THAI, fontSize: 14, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // 5 use case cards in horizontal-ish layout (2 rows: 3+2)
  // Actually do 2-col x 3-row but with one bigger summary cell at bottom
  // Better: 2x3 grid where last cell is summary
  const cards = [
    {
      no: "1",
      title: "คำร้องนิสิต",
      pattern: "Forms → LINE",
      detail: "นิสิตยื่นคำร้อง → แจ้งเจ้าหน้าที่ทันทีใน LINE\nลด lag time จาก 2 วัน → 5 วินาที",
      stat: "250",
      unit: "ชม./ปี",
      color: COLORS.KUgreen,
    },
    {
      no: "2",
      title: "รวบรวมเอกสาร",
      pattern: "Gmail → Drive",
      detail: "ใบเสร็จ/รายงานที่เข้ามาทาง email\nจัดเก็บอัตโนมัติใน Drive โฟลเดอร์ที่กำหนด",
      stat: "33",
      unit: "ชม./ปี",
      color: COLORS.KUgold,
    },
    {
      no: "3",
      title: "อวยพรอัตโนมัติ",
      pattern: "Schedule → LINE",
      detail: "ส่งข้อความวันเกิด/วันสำคัญ\nให้บุคลากรในหน่วยงานทุกเช้า",
      stat: "30",
      unit: "ชม./ปี",
      color: COLORS.KUgreenLight,
    },
    {
      no: "4",
      title: "เฝ้าระวังสต๊อก",
      pattern: "Sheets → Alert",
      detail: "ตรวจ stock ทุก 6 ชม. → ถ้าต่ำ\nแจ้งผู้รับผิดชอบทาง LINE/Email",
      stat: "-2",
      unit: "stockout/ปี",
      color: COLORS.KUgreenDark,
    },
    {
      no: "5",
      title: "สรุปเอกสาร + AI",
      pattern: "Sheets → KU LLM → Email",
      detail: "AI สรุปรายงานเบิกจ่ายรายเดือน\nส่ง executive ทางอีเมล",
      stat: "50",
      unit: "ชม./ปี",
      color: COLORS.red,
    },
  ];

  const cardW = 1.8, cardH = 2.7, cardY = 1.5;
  const cardSpacing = 0.05;
  const totalW = cardW * 5 + cardSpacing * 4;
  const startX = (10 - totalW) / 2;

  cards.forEach((c, i) => {
    const x = startX + i * (cardW + cardSpacing);

    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: COLORS.white },
      line: { color: c.color, width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.08 },
    });

    // Top color band
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: 0.12,
      fill: { color: c.color }, line: { type: "none" },
    });

    // Number badge
    s.addShape(pres.shapes.OVAL, {
      x: x + cardW - 0.5, y: cardY + 0.2, w: 0.35, h: 0.35,
      fill: { color: c.color }, line: { type: "none" },
    });
    s.addText(c.no, {
      x: x + cardW - 0.5, y: cardY + 0.2, w: 0.35, h: 0.35,
      fontFace: "Calibri", fontSize: 14, bold: true,
      color: COLORS.white, align: "center", valign: "middle", margin: 0,
    });

    // Title
    s.addText(c.title, {
      x: x + 0.15, y: cardY + 0.25, w: cardW - 0.7, h: 0.4,
      fontFace: FONT_THAI, fontSize: 18, bold: true,
      color: COLORS.ink, margin: 0,
    });

    // Pattern label
    s.addText(c.pattern, {
      x: x + 0.15, y: cardY + 0.7, w: cardW - 0.3, h: 0.25,
      fontFace: "Calibri", fontSize: 9, charSpacing: 2, bold: true,
      color: c.color, margin: 0,
    });

    // Detail
    s.addText(c.detail, {
      x: x + 0.15, y: cardY + 1.0, w: cardW - 0.3, h: 0.9,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.inkSoft, margin: 0,
    });

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: cardY + 1.95, w: cardW - 0.3, h: 0,
      line: { color: c.color, width: 0.5, dashType: "dash" },
    });

    // Stat
    s.addText(c.stat, {
      x: x + 0.15, y: cardY + 2.0, w: cardW - 0.3, h: 0.45,
      fontFace: "Calibri", fontSize: 28, bold: true,
      color: c.color, align: "center", margin: 0,
    });
    s.addText(c.unit, {
      x: x + 0.15, y: cardY + 2.42, w: cardW - 0.3, h: 0.25,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.gray, align: "center", margin: 0,
    });
  });

  // Bottom multiplier callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.55, w: 9, h: 0.85,
    fill: { color: COLORS.KUgreen }, line: { type: "none" },
  });
  s.addText([
    { text: "5 Pattern", options: { bold: true, color: COLORS.KUgold, fontSize: 22 } },
    { text: "  ×  33 ส่วนงาน  ×  4 วิทยาเขต  =  ", options: { color: COLORS.white, fontSize: 18 } },
    { text: "ROI หลักหมื่นชั่วโมง/ปี", options: { bold: true, color: COLORS.KUgold, fontSize: 22 } },
  ], {
    x: 0.5, y: 4.55, w: 9, h: 0.45,
    fontFace: FONT_THAI, align: "center", valign: "middle", margin: 0,
  });
  s.addText("ทุก pattern reuse ได้ในงานอื่น — บุคลากรปรับเองได้โดยไม่ต้องเขียน code", {
    x: 0.5, y: 4.95, w: 9, h: 0.4,
    fontFace: FONT_THAI, fontSize: 13, italic: true,
    color: COLORS.KUgoldSoft, align: "center", valign: "middle", margin: 0,
  });

  // Page indicator
  s.addText("06 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// SLIDE 7 — Roadmap + Call to Action
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: COLORS.white };

  // Header
  s.addText("Roadmap 18 เดือน + งบที่ขอ", {
    x: 0.5, y: 0.35, w: 9, h: 0.7,
    fontFace: FONT_THAI, fontSize: 36, bold: true,
    color: COLORS.KUgreen, margin: 0,
  });
  s.addText("จาก Foundation → KU-wide AI organization ภายใน 18 เดือน", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontFace: FONT_THAI, fontSize: 16, italic: true,
    color: COLORS.gray, margin: 0,
  });

  // Timeline — 4 phases horizontally
  const phases = [
    {
      tag: "Q1 / 2569",
      status: "DONE",
      title: "Foundation",
      detail: "Workshop 2 วัน\nบุคลากร 119 คน\n5 use cases",
      color: COLORS.KUgreenLight,
      bg: COLORS.KUgreenSoft,
    },
    {
      tag: "Q2-Q3 / 2569",
      status: "NOW",
      title: "Applied",
      detail: "Power users 50 คน\nงานจริงในส่วนงาน\nวัด KPI",
      color: COLORS.KUgreen,
      bg: COLORS.KUgreenSoft,
    },
    {
      tag: "Q4 / 2569",
      status: "PLANNED",
      title: "Faculty Pilot",
      detail: "5 ส่วนงาน นำร่อง\nสร้าง AI champion\nต่อหน่วยงาน",
      color: COLORS.KUgold,
      bg: COLORS.KUgoldSoft,
    },
    {
      tag: "2570",
      status: "VISION",
      title: "KU-wide",
      detail: "5,000 staff\nAI Center of Excellence\nResearch tie-up",
      color: COLORS.KUgreenDark,
      bg: COLORS.KUgreenSoft,
    },
  ];

  const phaseY = 1.55, phaseW = 2.2, phaseH = 1.85, phaseGap = 0.13;
  const phaseStartX = 0.5;

  // Timeline line (behind phases)
  s.addShape(pres.shapes.LINE, {
    x: 0.5, y: phaseY + phaseH + 0.15, w: 9.0, h: 0,
    line: { color: COLORS.KUgreen, width: 2 },
  });

  phases.forEach((p, i) => {
    const x = phaseStartX + i * (phaseW + phaseGap);

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: phaseY, w: phaseW, h: phaseH,
      fill: { color: p.bg },
      line: { color: p.color, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: phaseY, w: phaseW, h: 0.12,
      fill: { color: p.color }, line: { type: "none" },
    });

    // Time tag
    s.addText(p.tag, {
      x: x + 0.15, y: phaseY + 0.22, w: phaseW - 0.3, h: 0.25,
      fontFace: "Calibri", fontSize: 10, charSpacing: 2, bold: true,
      color: p.color, margin: 0,
    });

    // Status pill
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + phaseW - 0.95, y: phaseY + 0.22, w: 0.8, h: 0.28,
      fill: { color: p.color }, line: { type: "none" },
    });
    s.addText(p.status, {
      x: x + phaseW - 0.95, y: phaseY + 0.22, w: 0.8, h: 0.28,
      fontFace: "Calibri", fontSize: 8, charSpacing: 2, bold: true,
      color: COLORS.white, align: "center", valign: "middle", margin: 0,
    });

    // Title
    s.addText(p.title, {
      x: x + 0.15, y: phaseY + 0.55, w: phaseW - 0.3, h: 0.45,
      fontFace: FONT_THAI, fontSize: 22, bold: true,
      color: COLORS.ink, margin: 0,
    });

    // Detail
    s.addText(p.detail, {
      x: x + 0.15, y: phaseY + 1.05, w: phaseW - 0.3, h: 0.75,
      fontFace: FONT_THAI, fontSize: 12,
      color: COLORS.inkSoft, margin: 0,
    });

    // Timeline dot
    s.addShape(pres.shapes.OVAL, {
      x: x + phaseW / 2 - 0.1, y: phaseY + phaseH + 0.05, w: 0.2, h: 0.2,
      fill: { color: p.color }, line: { color: COLORS.white, width: 2 },
    });
  });

  // 3 commit boxes
  const boxY = 3.85, boxH = 0.95, boxW = 2.9, boxGap = 0.15;
  const boxStartX = 0.5;
  const commits = [
    { icon: "💰", title: "งบประมาณ", value: "TBD", detail: "Phase 2 — วิทยากร + workshop + infra" },
    { icon: "👥", title: "บุคลากรเฉพาะทาง", value: "2 FTE", detail: "AI / n8n specialist เต็มเวลา" },
    { icon: "📅", title: "ระยะเวลา", value: "18 เดือน", detail: "Foundation → KU-wide rollout" },
  ];

  commits.forEach((c, i) => {
    const x = boxStartX + i * (boxW + boxGap);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y: boxY, w: boxW, h: boxH,
      fill: { color: COLORS.bgWarm },
      line: { color: COLORS.KUgold, width: 0.5 },
    });

    // Icon
    s.addText(c.icon, {
      x: x + 0.15, y: boxY + 0.1, w: 0.6, h: 0.55,
      fontSize: 26, align: "center", valign: "middle", margin: 0,
    });

    // Title
    s.addText(c.title, {
      x: x + 0.8, y: boxY + 0.1, w: boxW - 0.95, h: 0.3,
      fontFace: FONT_THAI, fontSize: 13, bold: true,
      color: COLORS.gray, margin: 0,
    });

    // Value (big)
    s.addText(c.value, {
      x: x + 0.8, y: boxY + 0.35, w: boxW - 0.95, h: 0.4,
      fontFace: "Calibri", fontSize: 22, bold: true,
      color: COLORS.KUgreen, margin: 0,
    });

    // Detail
    s.addText(c.detail, {
      x: x + 0.15, y: boxY + 0.72, w: boxW - 0.3, h: 0.22,
      fontFace: FONT_THAI, fontSize: 11,
      color: COLORS.inkSoft, margin: 0,
    });
  });

  // Big CTA at bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.95, w: 9, h: 0.55,
    fill: { color: COLORS.KUgreenDark }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.95, w: 0.15, h: 0.55,
    fill: { color: COLORS.KUgold }, line: { type: "none" },
  });
  s.addText([
    { text: "ขออนุมัติ ", options: { color: COLORS.white } },
    { text: "Phase 2", options: { color: COLORS.KUgold, bold: true } },
    { text: " — ", options: { color: COLORS.white } },
    { text: "ภายใน Q2 / 2569", options: { color: COLORS.KUgold, bold: true } },
  ], {
    x: 0.8, y: 4.95, w: 8.7, h: 0.55,
    fontFace: FONT_THAI, fontSize: 22,
    valign: "middle", margin: 0,
  });

  // Page indicator
  s.addText("07 / 07", {
    x: 9.3, y: 5.3, w: 0.6, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: COLORS.grayLight,
    align: "right", margin: 0,
  });
}

// ============================================================
// Write file
// ============================================================
pres.writeFile({ fileName: "KU_AI_Direction.pptx" }).then((fileName) => {
  console.log(`Created: ${fileName}`);
});
