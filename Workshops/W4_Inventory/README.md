# Workshop 4: เฝ้าระวังสต๊อก/พัสดุ — Sheets → IF → LINE Notify

> **Pattern:** เช็คเงื่อนไข → แจ้ง (condition check → alert)
> **เวลา:** 60 นาที (วันที่ 2 ช่วง 13:00–14:00)
> **ระดับ:** Foundation — ต่อยอดจาก W1–W3

## เป้าหมายของ Workshop นี้

เมื่อจบ Workshop นี้ ผู้เรียนจะ:

1. **เข้าใจ pattern** "เช็คเงื่อนไข → แจ้ง" — รู้ว่าใช้กับงานเฝ้าระวังอะไรได้บ้าง
2. **เชื่อม Google Sheets** กับ n8n ผ่าน OAuth2 (อ่านข้อมูลจาก sheet)
3. **เขียน IF condition** ที่เทียบตัวเลข 2 column (`qty < min_qty`)
4. **Loop หลายรายการ** — รายการที่ต่ำกว่าจุดสั่งซื้อพร้อมๆ กัน
5. **ส่ง LINE Notify** ไปหาผู้รับผิดชอบ ของแต่ละรายการ
6. **ตั้ง Schedule** ให้เช็คทุกชั่วโมงในเวลาทำการ

## งานสมมติ (Use Case)

> **สถานการณ์:** คุณเป็นเจ้าหน้าที่พัสดุของหน่วยงาน — ดูแลสต็อกอุปกรณ์สำนักงาน (กระดาษ A4, หมึกพิมพ์, ผงหมึก, ลวดเย็บ ฯลฯ)
>
> **ปัญหา:** ต้องเดินไปนับสต็อกในคลังเองสัปดาห์ละครั้ง บางทีลืม — พอจะใช้ก็พบว่าหมึกหมด ต้องวิ่งซื้อด่วน เสียทั้งเงินและเวลา
>
> **แก้ด้วย n8n:** มี Google Sheet "inventory" บันทึกของคงเหลือไว้ — ทุก 1 ชม. ในเวลาทำการ n8n จะอ่าน sheet → เช็คว่ารายการไหน `qty < min_qty` → แจ้งคนรับผิดชอบทาง LINE ทันที

## Workflow ที่จะสร้าง

```
Schedule (ทุก 1 ชม. 8-17 น. จ.-ศ.) ─▶ Sheets: อ่าน inventory ─▶ IF (qty < min_qty)?
                                                                  ├─ TRUE  ─▶ Loop ─▶ LINE Notify (แจ้งผู้รับผิดชอบ)
                                                                  └─ FALSE ─▶ (จบ ไม่ทำอะไร)
```

## สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | สถานะ |
|---|---|
| n8n account (จาก W1) | ✅ ใช้ของเดิม |
| Google Sheets OAuth2 credential (จาก W2) | ✅ ใช้ของเดิมได้ |
| Google Sheet "inventory" (template) | ✅ TA แจกในห้อง — Copy เก็บไว้ใน Drive ตัวเอง |
| LINE Notify token (จาก W1) | ✅ ใช้ของเดิม |

> 💡 **ถ้า credential หาย:** ตั้งใหม่ใน Settings → Credentials ของ n8n — ใช้เวลา 3 นาที (ดู W2 GUIDE.md Step 2)

## โครงสร้างไฟล์ใน Workshop นี้

```
W4_Inventory/
├── README.md              ← ไฟล์นี้ (ภาพรวม)
├── GUIDE.md               ← ขั้นตอนละเอียดทีละคลิก
├── sample-data.md         ← โครงสร้าง Google Sheet "inventory"
├── troubleshooting.md     ← ปัญหาที่เจอบ่อย + วิธีแก้
└── solution/
    ├── workflow.json      ← เฉลยฉบับเต็ม (เปิดดูเมื่อทำเสร็จ)
    └── README.md
```

## ขั้นตอนคร่าวๆ (อ่านละเอียดใน [GUIDE.md](GUIDE.md))

1. **เปิด n8n** → New Workflow → ชื่อ `W4-เฝ้าระวังสต๊อก-[ชื่อคุณ]`
2. **Copy Google Sheet template** ที่ TA แจก → เก็บใน Drive ของคุณ
3. **Schedule Trigger** — ทุก 1 ชม. ระหว่าง 8-17 น. วันจันทร์-ศุกร์ (Cron: `0 8-17 * * 1-5`)
4. **Google Sheets node** — operation: Read Rows → เลือก sheet ของคุณ
5. **IF node** — condition: `{{ Number($json.qty) < Number($json.min_qty) }}`
6. **Loop Over Items** — เผื่อมีหลายรายการต่ำกว่าจุดสั่ง
7. **HTTP Request (LINE Notify)** — ใช้ Header Auth + format ข้อความ
8. **Execute** → ทดสอบกับ sheet จริง (แก้ qty ให้ต่ำกว่า min_qty ดู)
9. **Activate** → workflow ทำงานเอง 24/7

## เกณฑ์สำเร็จ

ผู้เรียนถือว่าทำสำเร็จเมื่อ:

- [x] Schedule trigger ตั้ง cron ถูก + execute ครั้งแรกผ่าน
- [x] Google Sheets node อ่านข้อมูลออกมาเป็น row ได้
- [x] IF node แยก rows ที่ `qty < min_qty` ออกมาได้
- [x] LINE Notify ส่งข้อความสำเร็จ (เห็นใน LINE กลุ่ม)
- [x] ถ้ามี 2-3 รายการต่ำกว่าจุดสั่ง → ได้ข้อความ 2-3 ข้อความตามจำนวน
- [x] Activate workflow + ทดสอบ end-to-end

**ทำได้ครบ = สำเร็จ** (ไม่ต้องส่งงาน — Foundation Level เน้นเข้าใจ pattern)

## ถ้าทำไม่ทันในคาบ

ไม่เป็นไร! Workshop นี้คือ "รูปแบบ pattern" ไม่ใช่ test
- ดู [GUIDE.md](GUIDE.md) ทำต่อที่บ้าน
- ถามใน LINE กลุ่ม
- ดู solution ที่ [`solution/workflow.json`](solution/workflow.json)

## ความต่างจาก Workshop ก่อนๆ

| | W1: Form→LINE | W2: Gmail→Drive | **W4: Inventory** |
|--|----------------|------------------|----------------------|
| Trigger | Webhook (push) | Schedule (pull) | **Schedule (pull, cron)** |
| ตอบสนอง | ทันที | รอ 15 นาที | **รอชั่วโมงถัดไป** |
| Logic | ไม่มี | IF (กรอง) | **IF เปรียบเทียบ 2 column** |
| Output | LINE 1 ข้อความ | ไฟล์ใน Drive | **LINE หลายข้อความ (Loop)** |
| ใหม่ที่เรียน | Webhook | OAuth + IF | **Cron + Number compare + Loop** |

## เอาไปใช้กับงานอะไรได้บ้าง?

Pattern นี้ (เช็คเงื่อนไข → แจ้ง) เหมาะกับงาน:

- **เฝ้าระวังสต๊อก** — กระดาษ/หมึก/ของบริโภค → แจ้งฝ่ายจัดซื้อ
- **เฝ้าระวังงบประมาณ** — เหลือ < 20% ของก้อนใด → แจ้งผู้บริหาร
- **เฝ้าระวังกำหนดส่ง** — เอกสารใกล้ครบกำหนด → แจ้งเจ้าของเรื่อง
- **เฝ้าระวังจำนวนนิสิตลงทะเบียน** — วิชาเปิดไม่ครบโควต้า → แจ้งภาควิชา
- **เฝ้าระวังคำร้องค้าง** — > 3 วัน ยังไม่ดำเนินการ → แจ้งหัวหน้า

## ข้อควรระวัง (สำหรับ production จริง)

- **อย่าให้ workflow สแปม** — ถ้ารายการนึงค้างไว้ต่ำ ทุกชั่วโมงจะแจ้งซ้ำ → แก้ด้วยคอลัมน์ `last_alerted` (ดู [GUIDE.md](GUIDE.md) Step 9 หรือ Sample Data)
- **Sheet ต้องอัพเดทเรื่อยๆ** — เพราะ workflow อ่านจาก sheet ไม่ใช่ระบบ ERP จริง
- **token LINE Notify** — ถ้าใช้ token เดียวทั้งหน่วยงาน คนอื่นเห็นทุกแจ้งเตือน → แยก token ตามผู้รับผิดชอบจะดีกว่า

---

**ก่อนหน้านี้:** [Workshop 3 — อวยพรวันเกิด](../W3_Birthday/README.md)
**ถัดไป:** [Workshop 5 — AI Triage](../W5_AI_Triage/README.md)
