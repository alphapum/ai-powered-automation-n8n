# Workshop 5: สรุปเบิกจ่าย + AI — คู่มือทีละคลิก

> **เวลา:** 75 นาที | **Pattern:** data → aggregate → AI → notify
> Capstone — ใช้ทุกอย่างที่เรียนมา 2 วัน + เพิ่ม AI
> Workshop นี้ยาวสุดและซับซ้อนสุด — ค่อยๆ ทำตาม ไม่ต้องรีบ

---

## Step 0: เตรียม Google Sheet (5 นาที)

ก่อนเริ่มสร้าง workflow — เราต้องมี Sheet ที่มีข้อมูล expense ก่อน

1. TA จะแจก link Sheet template ในห้อง: `https://docs.google.com/spreadsheets/d/.../expenses-template`
2. กด **File → Make a copy** → ตั้งชื่อ **`W5 Expenses - [ชื่อคุณ]`**
3. เปิดดู — ควรเห็นข้อมูลตัวอย่าง 10 rows (ดู [sample-data.md](sample-data.md) สำหรับโครงสร้าง)

โครงสร้างคอลัมน์:

| date | category | description | amount | requester | approver | status | receipt_url |
|------|----------|-------------|--------|-----------|----------|--------|-------------|
| 2026-05-26 | ค่าวัสดุสำนักงาน | กระดาษ A4 5 รีม | 1250 | สมหญิง | ผอ.สมชาย | approved | https://... |

> หากต้องการสร้างเอง — copy ข้อมูล 10 rows จาก [sample-data.md](sample-data.md) ลง Sheet ใหม่

4. **Copy Sheet URL** ไว้ — จะใช้ใน Step 4 (ตอนผูก Google Sheets node)
   - URL หน้าตา: `https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit`

เช็คว่า: เปิด Sheet ได้ + เห็นข้อมูล 10 rows + Sheet1 มี header แถวแรก

---

## Step 1: สร้าง Workflow ใหม่ (2 นาที)

1. เปิด n8n ที่ `https://workflow.ku.ac.th`
2. กด **`+ Add workflow`**
3. ตั้งชื่อ: **`W5-สรุปเบิกจ่าย-AI-[ชื่อคุณ]`**

> 💡 ใส่ชื่อตัวเองเพื่อให้หาง่ายในห้อง 119 คน

---

## Step 2: เพิ่ม Manual Trigger (1 นาที)

1. กลางหน้าจอ คลิก **`+ Add first step...`**
2. ค้นหา **`manual`** → คลิก **`Manual Trigger`** (ไอคอนสีเทา)
3. ไม่ต้องตั้งค่าอะไร — มี node เริ่มต้นแล้ว

> 💡 **ทำไมใช้ Manual ไม่ใช่ Schedule?**
> Workshop จะรอ schedule fire ไม่ทันใน 75 นาที — ใช้ Manual ทดสอบเร็วๆ ก่อน
> ตอนใช้จริง: เปลี่ยน Manual → Schedule Trigger (Cron `0 17 28-31 * *`)

เช็คว่า: เห็น node "When clicking 'Execute Workflow'" บน canvas

---

## Step 3: ตั้ง Google Sheets Credential (5 นาที)

> ถ้าคุณทำ Workshop 3 หรือ 4 (ที่ใช้ Sheets) มาแล้ว — ใช้ credential เดิมได้เลย ข้าม step นี้

### 3.1 สร้าง Google Sheets node

1. ที่ Manual Trigger กดปุ่ม **`+`**
2. ค้นหา **`google sheets`** → คลิก node **`Google Sheets`** (ไอคอน Sheets เขียว)
3. หน้าตั้งค่าเปิด — ที่ **Credential to connect with** กด **Create New Credential**

### 3.2 OAuth

1. ในหน้า Credential เลือก **Sign in with Google**
2. popup เปิด → เลือก Google account ของคุณ → กด Allow
3. กลับมาที่ n8n เห็นสถานะ **Account connected** สีเขียว
4. ตั้งชื่อ credential: **`Google Sheets - [ชื่อคุณ]`** → กด **Save**

เช็คว่า: ที่ Google Sheets node ช่อง Credential เห็นชื่อ credential ของคุณ

---

## Step 4: อ่านข้อมูลจาก Sheet (5 นาที)

ที่ Google Sheets node ตั้งค่า:

1. **Resource:** `Sheet Within Document`
2. **Operation:** `Get Row(s) in Sheet`
3. **Document:**
   - กด `Select from list` → ค้นหาชื่อ Sheet ของคุณ (`W5 Expenses - [ชื่อคุณ]`) → คลิกเลือก
   - หรือกด `By URL` → วาง Sheet URL จาก Step 0
4. **Sheet:** `Sheet1` (หรือชื่อ tab ที่คุณตั้ง)
5. **Filters → Add Filter:**
   - **Field:** `status`
   - **Value:** `approved`

> 💡 เรากรองเฉพาะ status = approved เพราะ pending/rejected ยังไม่เบิกจริง

6. **Options → Range:** เว้นว่าง (อ่านทั้ง sheet)
7. กด **Execute step**

ดู output ที่ panel ขวา ควรเห็น rows ที่ status = approved:

```json
[
  {
    "date": "2026-05-26",
    "category": "ค่าวัสดุสำนักงาน",
    "description": "กระดาษ A4 5 รีม",
    "amount": 1250,
    "requester": "สมหญิง",
    "status": "approved",
    ...
  },
  ...
]
```

เช็คว่า: เห็น 7-9 items ใน output (จาก 10 rows ตัวอย่าง — มีบางอันที่ status ไม่ใช่ approved)

> ⚠️ ถ้า `amount` ขึ้นเป็น string (`"1250"` แทน `1250`) — ก็ใช้ได้ Code node แปลงให้

---

## Step 5: รวมยอดตามหมวดด้วย Code Node (10 นาที)

เราจะใช้ **Code node** เขียน JavaScript รวมยอดตามหมวด (category)

### 5.1 เพิ่ม Code node

1. ที่ Google Sheets node กดปุ่ม **`+`**
2. ค้นหา **`code`** → คลิก **`Code`** (ไอคอนสีฟ้า)
3. ที่หน้าตั้งค่า:
   - **Mode:** `Run Once for All Items` (สำคัญ — เพราะเราจะรวมยอดข้าม items)
   - **Language:** `JavaScript`

### 5.2 วาง JavaScript Code

ลบโค้ดเริ่มต้น แล้ววางโค้ดนี้:

```javascript
// อ่าน expense items ทั้งหมดจาก node ก่อนหน้า
const items = $input.all();

// รวมยอดตามหมวด
const byCategory = {};
let grandTotal = 0;

for (const item of items) {
  const row = item.json;
  const category = row.category || 'ไม่ระบุ';
  const amount = Number(row.amount) || 0;

  if (!byCategory[category]) {
    byCategory[category] = { category, total: 0, count: 0 };
  }
  byCategory[category].total += amount;
  byCategory[category].count += 1;
  grandTotal += amount;
}

// แปลง object → array เรียงจากมากไปน้อย
const categories = Object.values(byCategory).sort((a, b) => b.total - a.total);

// หาเดือนของข้อมูล (จาก date แรกที่เจอ)
const firstDate = items[0]?.json?.date || '';
const month = firstDate.slice(0, 7); // "2026-05"

// คืนค่า 1 item ที่มีทุกอย่าง
return [{
  json: {
    month: month,
    grand_total: grandTotal,
    item_count: items.length,
    top_category: categories[0]?.category || 'n/a',
    top_category_total: categories[0]?.total || 0,
    categories: categories,
    summary_text: categories.map(c => `- ${c.category}: ${c.total.toLocaleString('th-TH')} บาท (${c.count} รายการ)`).join('\n')
  }
}];
```

> 💡 **โค้ดนี้ทำอะไร:**
> 1. รับ items ทุกอันจาก Sheets
> 2. รวมยอดและนับจำนวนรายการของแต่ละ category
> 3. เรียงจากหมวดที่ใช้มากไปน้อย
> 4. หาเดือนจาก date แรก
> 5. สร้าง `summary_text` ที่เป็นข้อความรวม — จะส่งให้ AI

### 5.3 ทดสอบ

กด **Execute step**

ดู output ควรเห็น:

```json
{
  "month": "2026-05",
  "grand_total": 45230,
  "item_count": 8,
  "top_category": "ค่าวัสดุสำนักงาน",
  "top_category_total": 18500,
  "categories": [
    { "category": "ค่าวัสดุสำนักงาน", "total": 18500, "count": 3 },
    { "category": "ค่าเดินทาง", "total": 12300, "count": 2 },
    ...
  ],
  "summary_text": "- ค่าวัสดุสำนักงาน: 18,500 บาท (3 รายการ)\n- ค่าเดินทาง: 12,300 บาท (2 รายการ)\n..."
}
```

เช็คว่า: `grand_total` ตรงกับยอดที่บวกเอง + เห็น `categories` array + `summary_text` มีรายการครบ

---

## Step 6: เรียก KU LLM Gateway ให้ AI สรุป (15 นาที)

**ไฮไลต์ของ Workshop** — เราจะส่ง expense data ไปให้ AI เขียนสรุปเป็นภาษาไทย

### 6.1 เพิ่ม HTTP Request node

1. ที่ Code node กดปุ่ม **`+`**
2. ค้นหา **`http`** → คลิก **`HTTP Request`** (ไอคอนสีเทา)

### 6.2 ตั้งค่า HTTP Request

ตั้งค่าตามนี้ทีละช่อง:

1. **Method:** `POST`
2. **URL:** `https://apigw.ku.ac.th/llm2/v1/chat/completions`

> ⚠️ **สังเกตให้ดี** — URL มี `/llm2/` (มีเลข 2) — ไม่ใช่ `/llm/`

3. **Authentication:** `None` (เราจะใส่ apikey ใน Header แทน)

4. **Send Headers:** เปิด toggle ✅
5. **Specify Headers:** เลือก `Using JSON`
6. ในช่อง JSON ใส่:

```json
{
  "apikey": "YOUR_KU_LLM_API_KEY_HERE",
  "Content-Type": "application/json"
}
```

> 💡 `apikey` (ตัวเล็กทั้งหมด ไม่ใช่ `Authorization: Bearer`) — นี่เป็นแบบของ KU เอง

7. **Send Body:** เปิด toggle ✅
8. **Body Content Type:** `JSON`
9. **Specify Body:** เลือก `Using JSON`
10. ในช่อง JSON ใส่:

```json
{
  "model": "mistralai/Mistral-7B-Instruct-v0.3",
  "messages": [
    {
      "role": "system",
      "content": "คุณคือผู้ช่วยวิเคราะห์ค่าใช้จ่ายของหน่วยงาน จงสรุปข้อมูลที่ได้รับเป็นภาษาไทย 3-4 ประโยค สำหรับผู้บริหารอ่าน:\n- เน้นยอดรวมและหมวดที่ใช้มากที่สุด\n- ระบุจุดผิดปกติ (ถ้ามี) เช่น หมวดที่ใช้สูงผิดปกติ\n- ใช้ภาษาทางการ กระชับ ตรงประเด็น\n- อย่าใช้ bullet points - เขียนเป็นย่อหน้าเดียว"
    },
    {
      "role": "user",
      "content": "ข้อมูลค่าใช้จ่ายเดือน {{ $json.month }}:\n\nยอดรวมทั้งสิ้น: {{ $json.grand_total }} บาท ({{ $json.item_count }} รายการ)\n\nรายละเอียดตามหมวด:\n{{ $json.summary_text }}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 400
}
```

> 💡 **สำคัญ — Expression ใน JSON body:**
> n8n รองรับ `{{ $json.xxx }}` ใน JSON body ของ HTTP Request — มันจะแทนค่าก่อนส่ง
> ถ้าใส่แล้วช่องเป็นข้อความสีแดง = syntax ผิด ลองเปลี่ยน editor เป็น "Expression" mode

11. **Options → Response → Never Error:** ตั้ง `true` (ให้เห็น error response ถ้ามี)
12. **Options → Timeout:** `30000` (30 วินาที — Mistral อาจตอบช้า)

### 6.3 ทดสอบ

กด **Execute step**

รอประมาณ **5-15 วินาที** — Mistral 7B ตอบช้ากว่า ChatGPT บ้าง

ดู output ควรเห็น:

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1716800000,
  "model": "mistralai/Mistral-7B-Instruct-v0.3",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "เดือนพฤษภาคม 2569 หน่วยงานมีค่าใช้จ่ายรวมทั้งสิ้น 45,230 บาท จาก 8 รายการ โดยหมวดค่าวัสดุสำนักงานใช้สูงสุดที่ 18,500 บาท คิดเป็นประมาณ 41% ของยอดรวม รองลงมาคือค่าเดินทาง 12,300 บาท สังเกตว่าค่าวัสดุสำนักงานเดือนนี้สูงกว่าปกติเล็กน้อย ควรพิจารณาประหยัดในไตรมาสถัดไป..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 234,
    "completion_tokens": 167,
    "total_tokens": 401
  }
}
```

🎉 **AI ตอบกลับแล้ว!**

เช็คว่า: เห็น `choices[0].message.content` มีข้อความสรุปเป็นภาษาไทย

> ⚠️ ถ้า error 401 → API key ผิด, ถ้า 404 → URL ผิด, ถ้า timeout → กดอีกครั้ง ดู [troubleshooting.md](troubleshooting.md)

---

## Step 7: เพิ่ม Set Node — จัด Email Body (5 นาที)

เราจะรวม AI summary + รายละเอียดหมวด เป็นข้อความ email สวยๆ

1. ที่ HTTP Request node กดปุ่ม **`+`**
2. ค้นหา **`set`** → คลิก **`Edit Fields (Set)`**
3. ตั้งค่า:
   - **Mode:** `Manual Mapping`
   - คลิก **`+ Add Field`** เพิ่ม 2 fields:

**Field 1:**
- **Name:** `email_subject`
- **Type:** `String`
- **Value:** (เปิด expression mode)
  ```
  [สรุปเบิกจ่าย] เดือน {{ $('Code').item.json.month }} - ยอดรวม {{ $('Code').item.json.grand_total.toLocaleString('th-TH') }} บาท
  ```

**Field 2:**
- **Name:** `email_body`
- **Type:** `String`
- **Value:** (เปิด expression mode)
  ```
  เรียน ผู้บริหาร

  สรุปการเบิกจ่ายของหน่วยงานในเดือน {{ $('Code').item.json.month }}:

  ━━━ AI Summary ━━━
  {{ $json.choices[0].message.content }}

  ━━━ รายละเอียดตามหมวด ━━━
  {{ $('Code').item.json.summary_text }}

  ━━━ รวมทั้งสิ้น ━━━
  {{ $('Code').item.json.grand_total.toLocaleString('th-TH') }} บาท ({{ $('Code').item.json.item_count }} รายการ)

  จัดทำโดยระบบอัตโนมัติ n8n + KU LLM Gateway
  ส่งเมื่อ {{ $now.toFormat('yyyy-MM-dd HH:mm') }}
  ```

> 💡 **สังเกต expression สองแบบ:**
> - `{{ $json.xxx }}` — เอาจาก node ก่อนหน้า (HTTP Request)
> - `{{ $('Code').item.json.xxx }}` — เอาจาก node ชื่อ Code (ก่อนหน้านั้นอีก)

4. กด **Execute step** — ดู output ควรเห็น `email_subject` + `email_body` ครบ

เช็คว่า: `email_body` มีทั้ง AI summary + รายละเอียดหมวด + ยอดรวม

---

## Step 8: ส่ง Email ด้วย Gmail (10 นาที)

### 8.1 เพิ่ม Gmail node

1. ที่ Set node กดปุ่ม **`+`**
2. ค้นหา **`gmail`** → คลิก **`Gmail`**

### 8.2 ตั้ง Gmail Credential

ถ้าทำ Workshop 2 มาแล้ว — ใช้ credential เดิม
ถ้ายังไม่มี:
1. กด **Create New Credential** → **Sign in with Google**
2. เลือก account → Allow → ตั้งชื่อ `Gmail - [ชื่อคุณ]` → Save

### 8.3 ตั้งค่า Send Email

1. **Resource:** `Message`
2. **Operation:** `Send`
3. **To:** ใส่ email ของคุณเอง (เพื่อ test ก่อน) เช่น `yourname@gmail.com`
   - หรือ email TA: `ku-workshop-ta@ku.ac.th` (ถามในห้อง)
4. **Subject:** (expression mode)
   ```
   {{ $json.email_subject }}
   ```
5. **Email Type:** `Text` (หรือ HTML — Text ง่ายกว่าใน workshop)
6. **Message:** (expression mode)
   ```
   {{ $json.email_body }}
   ```

> 💡 **ของจริง:** To = email ผอ. หรือผู้บริหาร — แต่ workshop ส่งหาตัวเองก่อนเพื่อทดสอบ

7. กด **Execute step**

### 8.4 เช็ค Email

1. เปิด Gmail ของคุณ (browser tab อื่น)
2. ภายใน 5-10 วินาที จะเห็น email ใหม่:
   - **Subject:** `[สรุปเบิกจ่าย] เดือน 2026-05 - ยอดรวม 45,230 บาท`
   - **Body:** AI summary + รายละเอียด

🎉 **ระบบทำงาน end-to-end แล้ว!**

เช็คว่า: เห็น email ใน inbox + เนื้อหามี AI summary + รายละเอียดหมวด + ยอดรวม

---

## Step 9: ทดสอบ End-to-End (5 นาที)

ตอนนี้ workflow มี 6 nodes แล้ว — ลองรันทั้งหมดจาก trigger

1. กด **`Execute Workflow`** ที่มุมขวาบน (สีแดง)
2. ดู workflow run ผ่านทุก node:
   - Manual Trigger → Google Sheets → Code → HTTP Request → Set → Gmail
3. ทุก node ควรขึ้นเขียว (ถ้าแดงดู error → [troubleshooting.md](troubleshooting.md))
4. รอประมาณ 15-20 วินาที (HTTP Request ใช้เวลาสุด)
5. เช็ค Gmail — มี email ใหม่ 1 ฉบับ

เช็คว่า: ทุก node เขียวหมด + email มาจริง

---

## Step 10: (Optional) เปลี่ยน Manual → Schedule + Activate (5 นาที)

ถ้าเหลือเวลา — ลองตั้งให้ workflow ทำเองทุกสิ้นเดือน

### 10.1 ลบ Manual Trigger

1. คลิก node Manual Trigger → กด **Delete** (Del บนคีย์บอร์ด)

### 10.2 เพิ่ม Schedule Trigger

1. กดปุ่ม **`+ Add first step...`**
2. ค้นหา **`schedule`** → **`Schedule Trigger`**
3. ตั้งค่า:
   - **Trigger Interval:** `Custom (Cron)`
   - **Cron Expression:** `0 17 28-31 * *`
     - แปลว่า: 17:00 น. ของวันที่ 28, 29, 30, 31 ของทุกเดือน
     - (workflow จะทำซ้ำใน 4 วัน — เพิ่ม logic เช็คว่าเป็น "วันสุดท้ายของเดือน" ใน Code node ก็ได้)
4. เชื่อม Schedule → Google Sheets (ลาก connection)

### 10.3 Activate

1. มุมขวาบน toggle **Inactive** → **Active** (เขียว)
2. workflow จะทำงานเองตามตารางที่ตั้ง

> ⚠️ ตอนนี้ workflow จะส่ง email จริง ทุกสิ้นเดือน — **ระวังอย่าให้ส่งซ้ำ** (ดู [troubleshooting.md](troubleshooting.md))

> 💡 ใน workshop ไม่จำเป็นต้อง Activate — แค่ Manual ทำงานได้ ก็ผ่านแล้ว

---

## Checklist ก่อนจบ Workshop 5

- [ ] Google Sheet "expenses" พร้อม 10 rows
- [ ] Workflow ใหม่ + Manual Trigger
- [ ] Google Sheets อ่านข้อมูลได้
- [ ] Code node aggregate ตามหมวดถูก (เห็น `categories` array)
- [ ] HTTP Request เรียก KU LLM Gateway ได้ — เห็น `choices[0].message.content`
- [ ] AI สรุปเป็นภาษาไทย 3-4 ประโยค
- [ ] Set node สร้าง email body ครบ
- [ ] Gmail ส่ง email สำเร็จ — เห็นใน inbox
- [ ] Execute Workflow ทดสอบ end-to-end ผ่าน

**ครบทุกข้อ = จบ Foundation ทั้ง 2 วัน** 🎉🎉🎉

---

## คิดต่อ — เอาไปใช้กับงานคุณ

หลังจบ workshop ลองคิดดู:

| งานคุณ | Sheet มีอะไร | AI สรุปอะไร | ส่งให้ใคร |
|--------|--------------|-------------|-----------|
| สรุปคำร้องนิสิตรายสัปดาห์ | คำร้องทั้งหมด | ประเภทคำร้องเยอะสุด + แนวโน้ม | หัวหน้าฝ่าย |
| สรุปการขาย | ยอดขายรายวัน | สินค้าขายดี + ที่ตก | ผู้จัดการ |
| สรุปการลา | ใบลา | คนลาเยอะ + เปรียบเทียบเดือนก่อน | HR |
| สรุปการประชุม | minutes | ประเด็นหลัก + action | ทีม |

> 💡 **เคล็ดลับ:** เริ่มจาก "การสรุปข้อมูลใน Sheet ที่ทำซ้ำๆ ทุกสัปดาห์/เดือน" — ที่นั่นคือ jackpot ของ AI workflow

---

## ถัดไป

- **สิ้นวัน 2:** Wrap-up session — สรุปทุก pattern ที่เรียน
- **หลัง Foundation:** ลองทำ workflow ของหน่วยงานตัวเองที่บ้าน → ส่งให้ TA ดูใน LINE กลุ่ม
- **Applied 3 วัน:** จะลึกขึ้นเรื่อง AI Agent, RAG, Multi-step reasoning

## ถ้าเจอปัญหา

ดู [troubleshooting.md](troubleshooting.md) — รวมปัญหาที่เจอบ่อย โดยเฉพาะ:
- AI ไม่ตอบ / timeout
- API key error
- Expression ดึงค่าจาก node ก่อนหน้าไม่ได้
- AI สรุปผิดจากข้อมูลจริง

หรือถามใน LINE กลุ่ม / ยกมือเรียก TA
