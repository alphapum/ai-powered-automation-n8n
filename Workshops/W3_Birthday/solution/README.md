# Workshop 3: Solution

## ไฟล์ในนี้

- **[workflow.json](workflow.json)** — เฉลยฉบับเต็ม ทำงานได้

## วิธี Import

1. ที่ n8n หน้า Workflows → กด **`+ Add workflow`** → ลูกศรลง → **`Import from file`**
2. เลือกไฟล์ `workflow.json` นี้
3. ตั้งชื่อเป็นของคุณ: เปลี่ยน `W3-อวยพรวันเกิด-Solution` → `W3-อวยพรวันเกิด-[ชื่อคุณ]`

## Import + ต้องแก้ 3 จุด

หลัง import — ต้องเปลี่ยน 3 ค่าเป็นของคุณเอง:

1. **Google Sheets credential** — node `Google Sheets: read staff` → เลือก credential ของคุณ (สร้างใน Step 3 ของ GUIDE)
2. **Google Sheet ID** — node `Google Sheets: read staff` → ช่อง `Document` → เลือก Sheet `staff-[ชื่อคุณ]` จาก list
3. **LINE Notify credential** — node `HTTP Request (LINE Notify)` → เลือก credential `LINE Notify - KU Workshop` (ของจาก W1 หรือสร้างใหม่)

## ทดสอบ

1. ใน Sheet ของคุณ — แก้ `birthday` ของ 1 row ให้ตรงวันนี้ (format `MM-DD`)
2. ที่ n8n — กด **Execute Workflow** (มุมขวาบน)
3. ดูทุก node ขึ้นเขียวเรียง:
   - Schedule → Google Sheets → IF (True branch) → Loop Over Items → HTTP Request
4. เช็ค LINE กลุ่ม → มีข้อความอวยพร

## โครงสร้าง Workflow

```
[Schedule]
   ↓ (ทุกวัน 9:00)
[Google Sheets: read staff]
   ↓ (อ่านทุก row)
[IF: birthday === today]
   ↓ True (มีคนเกิดวันนี้)        ↓ False (ปล่อยไว้)
[Loop Over Items]  ←──────┐
   ↓ loop branch          │
[HTTP Request (LINE)]  ───┘ (วน done กลับเข้า Loop จนครบทุกคน)
```

## ⚠️ ห้ามดูก่อนทำ

Workshop 3 ใช้ pattern ที่ใหม่ — Cron + Sheets + IF date + Loop เยอะ
- ลองทำเองให้สุด 45 นาที
- ถ้ายังไม่ผ่าน → เปิด solution + เทียบทีละ node
- ดู [troubleshooting.md](../troubleshooting.md) ก่อนเปิด solution

## หลัง workshop — ขยายต่อ

ลองปรับ workflow:

1. **เพิ่ม email อวยพร** — Add Gmail Send node หลัง HTTP Request → ส่ง email ถึง `{{ $json.email }}`
2. **เปลี่ยนเป็น LINE Bot (Messaging API)** — เมื่อ LINE Notify ปิดบริการ → ใช้ `line_user_id` ที่เก็บไว้ใน Sheet ส่ง personal message
3. **เพิ่มกระดาษทดสอบ** — Add Google Sheets append row เก็บ log การส่ง (timestamp, ชื่อ, ส่งสำเร็จไหม)
4. **เพิ่ม branch แจ้งหัวหน้า** — IF False branch ไม่ต้องว่าง — ส่ง summary "วันนี้ไม่มีใครเกิด" ตอนเช้า
