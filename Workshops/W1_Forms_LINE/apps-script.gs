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
 * Note สำคัญ:
 *   - Code นี้รองรับทั้ง Form-bound และ Spreadsheet-bound triggers
 *     (auto-detect จาก event object)
 *   - ชื่อ field (key ใน responses) ต้องตรง EXACT กับคำถามใน Form
 *     (รวม spacing + ภาษาไทย — ห้ามมีช่องว่างเกินรอบ -)
 *   - ตอน Activate workflow แล้ว — แก้ WEBHOOK_URL เป็น Production URL
 *     (เอา "-test" ออกจาก path)
 *
 * Debug:
 *   - ถ้าไม่เห็นข้อมูลใน n8n → ไปดู Apps Script "⌛ Executions"
 *   - Error "Cannot read properties of undefined" = e.response/e.namedValues ไม่มี
 *     ตรวจว่า Trigger ตั้ง "Event type: On form submit" จริงๆ
 * ============================================================
 */

function onFormSubmit(e) {
  // *** วาง Test URL จาก Step 2 ตรงนี้ ***
  const WEBHOOK_URL = "https://workflow.ku.ac.th/webhook-test/xxx";

  // Auto-detect: Form-bound หรือ Spreadsheet-bound trigger
  const responses = extractResponses(e);

  // จัด payload ส่งไป n8n
  const payload = {
    timestamp:  new Date().toISOString(),
    name:       responses["ชื่อ-นามสกุล"] || "",
    student_id: responses["รหัสนิสิต"]    || "",
    topic:      responses["เรื่องที่ขอ"]   || "",
    detail:     responses["รายละเอียด"]   || ""
  };

  // ส่ง HTTP POST ไป n8n webhook
  UrlFetchApp.fetch(WEBHOOK_URL, {
    method:             "post",
    contentType:        "application/json",
    payload:            JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

/**
 * ดึงคำตอบจาก event object — รองรับทั้ง 2 แบบ
 *   - Form-bound trigger:        e.response (FormResponse object)
 *   - Spreadsheet-bound trigger: e.namedValues (key→array)
 */
function extractResponses(e) {
  const out = {};

  if (e && e.response && typeof e.response.getItemResponses === "function") {
    // Form-bound: ใช้ Forms API
    e.response.getItemResponses().forEach(ir => {
      out[ir.getItem().getTitle()] = ir.getResponse();
    });
  } else if (e && e.namedValues) {
    // Spreadsheet-bound: namedValues เป็น { key: [values] }
    Object.keys(e.namedValues).forEach(key => {
      out[key] = e.namedValues[key][0];
    });
  }

  return out;
}
