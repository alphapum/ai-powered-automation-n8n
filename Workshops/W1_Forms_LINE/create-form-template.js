/**
 * ============================================================
 * KU Workshop 1 — สร้าง Google Form Template อัตโนมัติ
 * ============================================================
 *
 * วิธีใช้:
 *   1. ไปที่ https://script.google.com
 *   2. กด "New Project"
 *   3. ลบ code เดิม → วาง code นี้ลงไปทั้งหมด
 *   4. กด ▶ Run
 *   5. ครั้งแรก Google จะขอ permission → กด Allow
 *   6. ดู Log (View → Execution log) จะเห็น URL ของ Form ที่สร้างเสร็จ
 *
 * ผลลัพธ์:
 *   - Google Form "คำร้องนิสิต — KU Workshop n8n" พร้อม 4 คำถาม
 *   - อยู่ใน Google Drive ของคุณ
 *   - แชร์ link ให้ผู้เรียนได้เลย
 * ============================================================
 */

function createKUWorkshopForm() {
  // ==========================================
  // 1. สร้าง Form
  // ==========================================
  var form = FormApp.create('คำร้องนิสิต — KU Workshop n8n');

  form.setDescription(
    'ฟอร์มทดลองสำหรับ Workshop n8n\n' +
    'AI-Powered Automation ด้วย n8n — Foundation Workshop\n' +
    'มหาวิทยาลัยเกษตรศาสตร์\n\n' +
    'ส่งคำร้องของคุณ → จะได้รับแจ้งเตือนผ่าน LINE อัตโนมัติ'
  );

  // ไม่เก็บ email (ให้ test ง่าย)
  form.setCollectEmail(false);
  // ส่งได้หลายครั้ง
  form.setLimitOneResponsePerUser(false);
  // แสดง progress bar
  form.setProgressBar(false);
  // ข้อความหลังส่ง
  form.setConfirmationMessage(
    '✅ ส่งคำร้องสำเร็จ!\n\n' +
    'ถ้า n8n workflow ทำงานอยู่ → จะมีข้อความแจ้งเตือนเข้า LINE ภายใน 5 วินาที\n\n' +
    'กลับไปดูที่ n8n ว่า workflow ทำงานไหม'
  );

  // ==========================================
  // 2. คำถามที่ 1: ชื่อ-นามสกุล (บังคับ)
  // ==========================================
  var q1 = form.addTextItem();
  q1.setTitle('ชื่อ-นามสกุล');
  q1.setHelpText('ตัวอย่าง: สมชาย ใจดี');
  q1.setRequired(true);

  // ==========================================
  // 3. คำถามที่ 2: รหัสนิสิต (บังคับ + validation 7 หลัก)
  // ==========================================
  var q2 = form.addTextItem();
  q2.setTitle('รหัสนิสิต');
  q2.setHelpText('ใส่ตัวเลข 7 หลัก เช่น 6500000');
  q2.setRequired(true);

  // Validation: ต้องเป็นตัวเลข 7 หลัก
  var q2Validation = FormApp.createTextValidation()
    .setHelpText('กรุณาใส่รหัสนิสิต 7 หลัก (ตัวเลขเท่านั้น)')
    .requireTextMatchesPattern('^\\d{7}$')
    .build();
  q2.setValidation(q2Validation);

  // ==========================================
  // 4. คำถามที่ 3: เรื่องที่ขอ (บังคับ — Dropdown)
  // ==========================================
  var q3 = form.addListItem();
  q3.setTitle('เรื่องที่ขอ');
  q3.setHelpText('เลือกประเภทคำร้อง');
  q3.setRequired(true);
  q3.setChoices([
    q3.createChoice('ลาเรียน'),
    q3.createChoice('ขอใบรับรอง'),
    q3.createChoice('ขอเปลี่ยนสาขา'),
    q3.createChoice('ขอผ่อนผันค่าเทอม'),
    q3.createChoice('อื่นๆ')
  ]);

  // ==========================================
  // 5. คำถามที่ 4: รายละเอียด (ไม่บังคับ)
  // ==========================================
  var q4 = form.addParagraphTextItem();
  q4.setTitle('รายละเอียด');
  q4.setHelpText('อธิบายเหตุผล หรือข้อมูลเพิ่มเติม (ถ้ามี)');
  q4.setRequired(false);

  // ==========================================
  // 6. แสดงผลลัพธ์
  // ==========================================
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  Logger.log('========================================');
  Logger.log('✅ สร้าง Google Form สำเร็จ!');
  Logger.log('========================================');
  Logger.log('');
  Logger.log('📋 ชื่อ: คำร้องนิสิต — KU Workshop n8n');
  Logger.log('📝 คำถาม: 4 ข้อ');
  Logger.log('');
  Logger.log('🔗 URL สำหรับกรอก (แจกผู้เรียน):');
  Logger.log('   ' + formUrl);
  Logger.log('');
  Logger.log('✏️ URL สำหรับแก้ไข (สำหรับ TA):');
  Logger.log('   ' + editUrl);
  Logger.log('');
  Logger.log('========================================');
  Logger.log('ขั้นตอนถัดไป:');
  Logger.log('1. เปิด Form → ⋮ → Script editor');
  Logger.log('2. วาง onFormSubmit code จาก GUIDE.md Step 3.3');
  Logger.log('3. ตั้ง Trigger → On form submit');
  Logger.log('========================================');

  // แสดง popup ด้วย (ถ้ารันจาก editor)
  var ui;
  try {
    ui = FormApp.getUi();
    ui.alert(
      '✅ สร้าง Form สำเร็จ!',
      'URL: ' + formUrl + '\n\nดู Log สำหรับรายละเอียด',
      ui.ButtonSet.OK
    );
  } catch (e) {
    // ไม่มี UI (รันจาก script.google.com) — ดู Log แทน
  }

  return formUrl;
}
