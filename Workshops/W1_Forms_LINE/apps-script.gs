/**
 * ============================================================
 * KU Workshop 1 — Apps Script: Google Form → n8n Webhook
 * ============================================================
 *
 * วิธีใช้:
 *   1. ในหน้า Google Form ของคุณ
 *      คลิก ⋮ (จุด 3 จุด ขวาบน) → "Script editor"
 *      หรือ Extensions → Apps Script
 *   2. ลบ code เดิมที่เห็น แล้ววาง code นี้ลงไปทั้งหมด
 *   3. แก้บรรทัด WEBHOOK_URL ให้เป็น Test URL จาก n8n
 *      (Step 2 ใน GUIDE.md — กด Listen for test event)
 *   4. กด 💾 Save (Ctrl+S)
 *   5. กดไอคอน ⏰ Triggers ทางซ้าย
 *      - กด + Add Trigger
 *      - Choose function: onFormSubmit
 *      - Event source: From form
 *      - Event type: On form submit
 *      - Save → Google ขอ permission → Allow
 *   6. ทดสอบ — submit form → ดู n8n ว่ามีข้อมูลเข้ามามั้ย
 *
 * Note:
 *   - ชื่อ field ใน responses[...] ต้องตรง EXACT กับคำถามใน Form
 *     (รวม spacing + ภาษาไทย)
 *   - ตอน Activate workflow แล้ว — แก้ WEBHOOK_URL เป็น Production URL
 *     (เอา "-test" ออกจาก path)
 * ============================================================
 */

function onFormSubmit(e) {
  // *** วาง Test URL จาก Step 2 ตรงนี้ ***
  const WEBHOOK_URL = "https://workflow.ku.ac.th/webhook-test/xxx";

  // ดึงคำตอบทั้งหมดจาก form
  const responses = e.namedValues;

  // จัด payload เป็น JSON ส่งไป n8n
  const payload = {
    timestamp:  new Date().toISOString(),
    name:       responses["ชื่อ-นามสกุล"]?.[0] || "",
    student_id: responses["รหัสนิสิต"]?.[0] || "",
    topic:      responses["เรื่องที่ขอ"]?.[0] || "",
    detail:     responses["รายละเอียด"]?.[0] || ""
  };

  // ส่ง HTTP POST ไปที่ n8n webhook
  UrlFetchApp.fetch(WEBHOOK_URL, {
    method:             "post",
    contentType:        "application/json",
    payload:            JSON.stringify(payload),
    muteHttpExceptions: true   // ไม่ throw error ถ้า n8n offline
  });
}
