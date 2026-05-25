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
 *   - ใช้ partial match (findField) — ทนต่อ:
 *       * dash หลายแบบ (- vs – vs —, U+002D vs U+2013 vs U+2014)
 *       * space เกินใน field name
 *       * พิมพ์ผิดเล็กน้อย
 *   - Auto-detect Form-bound vs Spreadsheet-bound trigger
 *   - ตอน Activate workflow แล้ว — แก้ WEBHOOK_URL เป็น Production URL
 *     (เอา "-test" ออกจาก path)
 *
 * Debug:
 *   - ถ้าไม่เห็นข้อมูลใน n8n → ดู Apps Script "⌛ Executions"
 *   - ถ้าค่าใน n8n empty → ดู _debug_raw ใน body
 * ============================================================
 */

function onFormSubmit(e) {
  // *** วาง Test URL จาก Step 2 ตรงนี้ ***
  const WEBHOOK_URL = "https://workflow.ku.ac.th/webhook-test/xxx";

  // Auto-detect: Form-bound หรือ Spreadsheet-bound trigger
  const responses = extractResponses(e);

  // จัด payload ส่งไป n8n — ใช้ findField() เพื่อความทน
  const payload = {
    timestamp:  new Date().toISOString(),
    name:       findField(responses, "ชื่อ"),
    student_id: findField(responses, "รหัส"),
    topic:      findField(responses, "เรื่อง"),
    detail:     findField(responses, "รายละเอียด"),

    // ลบ 2 บรรทัดข้างล่างนี้ออกหลัง debug เสร็จ
    _debug_keys: Object.keys(responses),
    _debug_raw:  responses
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
 * ดึงคำตอบจาก event object — รองรับทั้ง 2 แบบ trigger
 *   - Form-bound:        e.response (FormResponse)
 *   - Spreadsheet-bound: e.namedValues (key→array)
 */
function extractResponses(e) {
  const out = {};

  if (e && e.response && typeof e.response.getItemResponses === "function") {
    e.response.getItemResponses().forEach(ir => {
      out[ir.getItem().getTitle()] = ir.getResponse();
    });
  } else if (e && e.namedValues) {
    Object.keys(e.namedValues).forEach(key => {
      out[key] = e.namedValues[key][0];
    });
  }

  return out;
}

/**
 * หา field โดย match บางส่วน (case-insensitive, ทนต่อ unicode dash/space)
 * Usage: findField(responses, "ชื่อ") → จะ match "ชื่อ-นามสกุล" หรือ "ชื่อ - นามสกุล"
 */
function findField(responses, keyword) {
  const key = Object.keys(responses).find(k => k.includes(keyword));
  return key ? responses[key] : "";
}
