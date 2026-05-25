# Workshop 5: Solution

## ไฟล์ในนี้

- **[workflow.json](workflow.json)** — เฉลย Workshop 5 ฉบับเต็ม import เข้า n8n ได้ทันที

## โครงสร้าง 6 nodes

```
Manual Trigger
    │
    ▼
Google Sheets: read expenses (filter status=approved)
    │
    ▼
Code: aggregate by category (JavaScript)
    │
    ▼
HTTP: KU LLM Gateway (Mistral-7B → ภาษาไทย summary)
    │
    ▼
Set: format email body
    │
    ▼
Gmail: ส่งสรุปให้ผู้บริหาร
```

## วิธี Import

1. เปิด n8n → **`+ Add workflow`** → **`Import from File`**
2. เลือกไฟล์ `workflow.json` นี้
3. n8n สร้าง workflow ใหม่ชื่อ `W5-สรุปเบิกจ่าย-AI-Solution`

## ต้องแก้ 5 จุด หลัง Import

| # | จุดที่ต้องแก้ | ค่าปัจจุบัน | แก้เป็น |
|---|---------------|--------------|----------|
| 1 | **Google Sheets credential** (node `Google Sheets: read expenses`) | `REPLACE_WITH_YOUR_SHEETS_CRED_ID` | ของคุณเอง |
| 2 | **Sheet ID / Document** | `REPLACE_WITH_YOUR_SHEET_ID` | เลือกจาก list ใน UI |
| 3 | **Gmail credential** (node `Gmail: ส่งสรุปให้ผู้บริหาร`) | `REPLACE_WITH_YOUR_GMAIL_CRED_ID` | ของคุณเอง |
| 4 | **Recipient email** (To field ของ Gmail) | `REPLACE_WITH_RECIPIENT_EMAIL@ku.ac.th` | email ตัวเอง (สำหรับ test) หรือ email ผู้บริหาร |
| 5 | **(Optional) KU LLM Gateway API key** | hard-coded ใน HTTP Headers | ย้ายไปเป็น n8n Credential (ดูด้านล่าง) |

### วิธีแก้ในแต่ละจุด

**1-3. Credential:** เปิด node ที่ใส่ `REPLACE_WITH_...` → ช่อง Credential เลือก credential ของคุณ (หรือสร้างใหม่)

**4. Recipient email:**
- เปิด node `Gmail: ส่งสรุปให้ผู้บริหาร`
- ช่อง **To** ลบ `REPLACE_WITH_RECIPIENT_EMAIL@ku.ac.th`
- ใส่ email ที่ต้องการส่งไป (เช่น ของตัวเอง ระหว่าง test)

**5. API key → n8n Credential** (แนะนำสำหรับ production):
- เปิด node `HTTP: KU LLM Gateway`
- เปลี่ยน **Authentication** จาก `None` → `Generic Credential Type` → `Header Auth`
- Create New Credential:
  - **Name:** `KU LLM Gateway`
  - **Header Name:** `apikey`
  - **Header Value:** `YOUR_KU_LLM_API_KEY_HERE`
  - Save
- ลบ `apikey` ออกจาก **Specify Headers → Using JSON** (เหลือแค่ `Content-Type`)

## API key ใน solution นี้

API key `YOUR_KU_LLM_API_KEY_HERE` ที่ฝังใน solution = ของผู้สอน (จาก screenshot ตอน 2026-05-23)

> หลัง workshop หรือ ก่อน commit ไป public repo: **ขอ key ใหม่จาก KU IT** แล้ว rotate

## เปลี่ยน Manual Trigger เป็น Schedule (production)

solution ใช้ Manual Trigger เพื่อ workshop เร็ว — ใน production:

1. ลบ node `Manual Trigger`
2. เพิ่ม **Schedule Trigger:**
   - **Trigger Interval:** `Custom (Cron)`
   - **Cron Expression:** `0 17 28-31 * *` (17:00 ของวันที่ 28-31 ทุกเดือน)
3. เชื่อม Schedule → Google Sheets
4. ใน Code node เพิ่ม guard "เป็นวันสุดท้ายของเดือน":
   ```javascript
   const today = new Date();
   const tomorrow = new Date(today);
   tomorrow.setDate(today.getDate() + 1);
   if (tomorrow.getMonth() === today.getMonth()) {
     return []; // ยังไม่ใช่วันสุดท้าย — หยุด
   }
   // ... โค้ดเดิม
   ```
5. Activate workflow

## เปรียบเทียบกับของคุณ

หลังทำ Workshop 5 จบ ลอง import solution มาเทียบ:

- **Code node** — โค้ด JS ของคุณเหมือนใน solution ไหม
- **HTTP Request body** — JSON ของคุณถูก format ใช่ไหม
- **Set node expressions** — `{{ $('Code: aggregate by category').item.json.xxx }}` ใช้ถูกไหม

## ⚠️ ห้ามดูก่อนทำ

Workshop 5 = capstone — เนื้อหาที่เรียนมาทั้งหมด 2 วัน + AI ใหม่

- ลองทำเองให้สุด **30-40 นาที** แรก
- ถ้ายังไม่ผ่าน Step 6 (HTTP Request เรียก AI ไม่ได้) → เปิด solution มาดู `jsonHeaders` + `jsonBody`
- ดู [troubleshooting.md](../troubleshooting.md) ก่อนเปิด solution

## Token usage ของ workshop นี้

จากการทดสอบกับ data ตัวอย่าง (10 rows, 4 categories):

- **Prompt tokens:** ~250-300 tokens
- **Completion tokens:** ~150-200 tokens
- **Total:** ~400-500 tokens/request

ปริมาณ 119 คน × ทำ 1-2 ครั้ง = ~100K tokens ใน workshop (อยู่ใน budget ของ KU LLM Gateway)

## เกี่ยวข้องกับ workflow อื่น

- **Test workflow ของ KU LLM Gateway:** [`../../Examples/Test_KU_LLM_Gateway/`](../../../Examples/Test_KU_LLM_Gateway/) — ใช้ทดสอบ API key + URL ถ้า W5 มี error
- **W2 (Gmail):** ใช้ pattern Gmail OAuth เดียวกัน
- **W3 (Sheets):** ใช้ pattern Google Sheets OAuth เดียวกัน

## หลัง Workshop 5

ทดลองปรับ:

1. **เปลี่ยน prompt** — ให้ AI สรุปแบบอื่น (เช่น เน้นความเสี่ยง / โอกาสประหยัด)
2. **เปลี่ยน model** — ลอง model อื่นที่ KU LLM Gateway มี (ถาม TA)
3. **เพิ่ม step** — หลัง AI summary → save ลง Sheet อีก tab เพื่อ audit log
4. **เพิ่ม comparison** — ให้ AI เปรียบเทียบกับเดือนก่อน (ต้องอ่าน 2 sheets / 2 ranges)
5. **ส่งหลาย format** — ส่งทั้ง email + LINE + บันทึกใน Google Doc
