# Workshop 5: สรุปเบิกจ่ายรายเดือน + AI

> **Pattern:** AI-Powered Automation — workflow ที่ "คิดได้"
> **เวลา:** 75 นาที (วันที่ 2 ช่วงท้าย — Capstone)
> **ระดับ:** Foundation — ซับซ้อนสุด ใช้ทุกอย่างที่เรียนมา 2 วัน

## เป้าหมายของ Workshop นี้

เมื่อจบ Workshop นี้ ผู้เรียนจะ:

1. **เข้าใจ pattern** "AI-Powered Automation" — ให้ AI ช่วย "คิด" ไม่ใช่แค่ "ส่งต่อข้อมูล"
2. **เรียก KU LLM Gateway** จาก n8n ผ่าน HTTP Request ได้
3. **เขียน System / User Prompt** สำหรับสรุปข้อมูลธุรกิจเป็นภาษาไทย
4. **ใช้ Code node** aggregate ข้อมูลจาก Google Sheets (sum by category)
5. **ผูก output ของ AI** เข้ากับ Gmail เพื่อส่งสรุปอัตโนมัติ
6. **เห็นภาพรวม** — ทุกอย่างที่เรียน 2 วัน (Trigger + Sheets + Code + AI + Email) มารวมกันใน workflow เดียว

## งานสมมติ (Use Case)

> **สถานการณ์:** คุณเป็นเลขาฝ่าย/ผู้ช่วย ผอ. ที่ต้องสรุปการเบิกจ่ายให้ผู้บริหารทุกสิ้นเดือน
>
> **ปัญหา:** ทุกสิ้นเดือนต้อง
> - เปิด Google Sheet expense ดูทีละ row
> - รวมยอดตามหมวด (วัสดุ / ค่าเดินทาง / ค่าอบรม / ...)
> - เขียนสรุปสั้นๆ ให้ ผอ. อ่านง่าย
> - ส่ง email หา ผอ.
>
> เสียเวลา **1-2 ชั่วโมง/เดือน** — แล้วถ้ามีหลายหน่วยงานยิ่งหนัก
>
> **แก้ด้วย n8n + AI:**
> - n8n อ่าน Sheet เอง → รวมยอดเอง → ให้ **AI เขียนสรุปเป็นภาษาทางการ** → ส่ง email อัตโนมัติ
> - ใช้เวลา **15 วินาที** แทน 2 ชั่วโมง

## Workflow ที่จะสร้าง

```
Manual Trigger ─▶ Google Sheets ─▶ Code (aggregate) ─▶ HTTP Request ─▶ Set ─▶ Gmail
   (กดเอง)      (อ่าน expense)    (รวมตามหมวด)      (KU LLM Gateway)  (จัด)  (ส่งสรุป)
```

> **Note:** ใน production เราจะแทน Manual Trigger ด้วย **Schedule Trigger** (Cron `0 17 28-31 * *` = 17:00 ของวันที่ 28-31 ของทุกเดือน) — แต่ใน workshop ใช้ Manual ก่อนเพื่อให้ทดสอบเร็ว

## พลังของ "AI ในกลาง workflow"

เปรียบเทียบกับ Workshop 1-4:

| Workshop | สิ่งที่ workflow ทำ |
|----------|----------------------|
| W1-W4 | **ส่งต่อข้อมูล** — รับ → format → ส่ง |
| **W5** | **คิดวิเคราะห์ข้อมูล** — รับ → รวม → **ให้ AI สรุป** → ส่ง |

ความต่าง = AI Agent ช่วย "เขียนภาษาคน" จากตัวเลข — แทนที่เราต้องเขียนเอง

## สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | สถานะ |
|---|---|
| n8n account (จาก W1-W4) | เตรียมให้แล้ว |
| Google Sheets template "expenses" | เตรียมให้แล้ว — ดู [sample-data.md](sample-data.md) |
| Google Sheets OAuth credential | ใช้ของเดียวกับ W3/W4 (ถ้ามี) หรือสร้างใหม่ |
| Gmail OAuth credential | ใช้ของเดียวกับ W2 |
| **KU LLM Gateway API key** | เตรียมให้แล้ว — `YOUR_KU_LLM_API_KEY_HERE` |

> หมายเหตุเรื่อง API key: ใน Workshop เราใส่ key ตรงๆ ใน HTTP Request เพื่อความเร็ว ใน production ควรย้ายไปเก็บใน n8n Credential (Header Auth) — มีอธิบายใน [troubleshooting.md](troubleshooting.md)

## โครงสร้างไฟล์ใน Workshop นี้

```
W5_Expenses_AI/
├── README.md            ← ไฟล์นี้ (ภาพรวม)
├── GUIDE.md             ← ขั้นตอนละเอียดทีละคลิก
├── sample-data.md       ← โครงสร้าง Google Sheet + ข้อมูลตัวอย่าง 10 rows
├── troubleshooting.md   ← ปัญหาที่เจอบ่อย + วิธีแก้
└── solution/
    ├── workflow.json    ← เฉลยฉบับเต็ม (import ได้)
    └── README.md        ← วิธีใช้ solution
```

## ขั้นตอนคร่าวๆ (อ่านละเอียดใน [GUIDE.md](GUIDE.md))

1. **เตรียม Google Sheet** — copy template "expenses" + ใส่ข้อมูลตัวอย่าง 10 rows
2. **สร้าง Workflow ใหม่** — ชื่อ `W5-สรุปเบิกจ่าย-AI-[ชื่อคุณ]`
3. **เพิ่ม Manual Trigger** (workshop) หรือ Schedule (production)
4. **เพิ่ม Google Sheets node** — อ่าน rows ของเดือนปัจจุบัน
5. **เพิ่ม Code node** — รวมยอดตามหมวด (`category` → `total`) ด้วย JavaScript
6. **เพิ่ม HTTP Request** — เรียก KU LLM Gateway พร้อม prompt สรุปภาษาไทย
7. **เพิ่ม Set node** — format email body
8. **เพิ่ม Gmail node** — ส่งสรุปหา ผอ.
9. **Execute** → ตรวจ email + ดู AI summary
10. (Optional) **เปลี่ยน Manual → Schedule** + Activate

## เกณฑ์สำเร็จ

ผู้เรียนถือว่าทำสำเร็จเมื่อ:

- [x] อ่าน Google Sheets เข้า n8n ได้ (เห็น rows ใน output)
- [x] Code node รวมยอดตามหมวดได้ถูก (เห็น output เป็น array `{category, total, count}`)
- [x] HTTP Request เรียก KU LLM Gateway สำเร็จ — ได้ `choices[0].message.content` กลับมา
- [x] AI สรุปเป็นภาษาไทย 3-4 ประโยค ถูกต้องตามยอดจริง
- [x] Gmail ส่ง email สำเร็จ (เปิด inbox ผู้รับเห็น)
- [x] ทดสอบ end-to-end อย่างน้อย 1 ครั้ง

**ทำได้ครบ = สำเร็จ + จบ Foundation ทั้ง 2 วัน** 🎉

## ถ้าทำไม่ทันในคาบ

Workshop นี้ยาว 75 นาที — ซับซ้อนสุด ปกติจะมีคนทำไม่ทัน

- ดู [GUIDE.md](GUIDE.md) ทำต่อที่บ้านได้
- **อย่างน้อยให้เห็น AI ตอบกลับ 1 ครั้ง** (Step 6) — ส่วนนี้เป็นไฮไลต์ของ workshop
- ดู solution ที่ [`solution/workflow.json`](solution/workflow.json)

## เอาไปใช้กับงานอะไรได้บ้าง?

Pattern นี้ (data → aggregate → AI summarize → notify) เหมาะกับ:

| งาน | อ่านจาก | AI สรุปว่า | ส่งให้ใคร |
|-----|---------|------------|-----------|
| **สรุปเบิกจ่ายรายเดือน** | Sheet expenses | ยอดรวม + หมวดใหญ่ + ผิดปกติ | ผอ. |
| **สรุปคำร้องนิสิตรายสัปดาห์** | Sheet จาก W1 | ประเภทคำร้องที่เยอะสุด + แนวโน้ม | หัวหน้าฝ่าย |
| **สรุปการลาของพนักงาน** | HR system / Sheet | คนลาเยอะสุด + เปรียบเทียบเดือนก่อน | HR Manager |
| **สรุปการประชุม** | ไฟล์ transcript | ประเด็นหลัก + action items | ทีม |
| **สรุปรายงานยอดขาย** | CRM / Sheet | สินค้าขายดี + แนวโน้ม + warning | ผู้บริหาร |
| **สรุปบทความข่าว** | RSS / web scrape | ใจความสำคัญ 5 ประเด็น | ทีม PR |

## ความต่างจาก Workshop 1-4

|  | W1-W4 | **W5 (AI)** |
|--|-------|-------------|
| Trigger | Webhook / Schedule | Manual (workshop) / Schedule (prod) |
| ข้อมูล | จาก event เดียว | จากหลาย rows ที่ต้องรวม |
| ตรรกะ | IF / Set | **Code (JavaScript)** + **AI Prompt** |
| Output | ข้อความตามที่เรา format | **AI เขียนเอง** จาก data |
| Credential | LINE / Gmail / Drive | + **KU LLM Gateway** |
| ความใหม่ | - | **HTTP Request + AI** |

## เกี่ยวกับ KU LLM Gateway

ใน Workshop เราใช้ **KU LLM Gateway** — บริการ LLM ของมหาวิทยาลัยเกษตรศาสตร์
- URL: `https://apigw.ku.ac.th/llm2/v1/chat/completions`
- Model: `mistralai/Mistral-7B-Instruct-v0.3`
- Auth: Header `apikey: XXXX`
- รูปแบบ request/response = **OpenAI-compatible** (ใครเคยใช้ ChatGPT API มาก่อนจะคุ้น)

> ใน Foundation รุ่นนี้เราใช้ HTTP Request node ตรงๆ — เพื่อให้เห็น "ไส้ใน" ของการเรียก LLM
> ในรุ่น Applied (3 วัน) จะใช้ **AI Agent node** ของ n8n ที่จัดการให้สวยขึ้น พร้อม Tools / Memory / RAG

---

**ก่อนหน้า:** [Workshop 4 — เตือนนัดประชุม](../W4_Calendar_Reminder/README.md)
**สรุปทั้งหมด:** [Day 2 Wrap-up](../../docs/day2-wrapup.md) (ถ้ามี)
