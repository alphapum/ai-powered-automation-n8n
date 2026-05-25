# Workshop 3: อวยพรวันเกิดบุคลากร — Schedule + Sheets + IF

> **Pattern:** เวลา + ตาราง + เงื่อนไข (Schedule + Sheets + IF)
> **เวลา:** 75 นาที (วันที่ 2 ช่วงเช้า)
> **ระดับ:** Foundation — ต่อยอดจาก Workshop 1 + 2

## เป้าหมายของ Workshop นี้

เมื่อจบ Workshop นี้ ผู้เรียนจะ:

1. **เข้าใจ pattern** "เวลา + ตาราง + เงื่อนไข" — รู้ว่าเอาไปใช้กับงาน reminder อื่นๆ ได้
2. **ตั้ง Schedule Trigger** แบบ Cron `0 9 * * *` (ทุกวันเช้า 9 โมง)
3. **อ่านข้อมูลจาก Google Sheets** เข้ามาเป็น list ใน n8n
4. **เขียน IF expression** เทียบวันที่ปัจจุบันกับวันเกิด (format `MM-DD`)
5. **วน Loop Over Items** สำหรับกรณีมีคนเกิดวันเดียวกันหลายคน
6. **ส่ง LINE Notify** อวยพรเป็นรายบุคคล ด้วยข้อความ personalized

## งานสมมติ (Use Case)

> **สถานการณ์:** คุณเป็นเจ้าหน้าที่ HR หรือผู้บริหารหน่วยงาน ต้องการอวยพรวันเกิดบุคลากรในทีมทุกคน เพื่อสร้าง engagement
>
> **ปัญหา:** ต้องเปิด Excel/Sheet เช็คเองทุกเช้าว่าวันนี้ใครเกิด — บางวันลืม บางคนได้รับช้า บางคนตกหล่น ทำให้บุคลากรน้อยใจ
>
> **แก้ด้วย n8n:** ทุกเช้า 9 โมง — n8n จะอ่านตารางบุคลากร เช็คว่าวันนี้ใครเกิด แล้วส่งข้อความอวยพรเข้า LINE กลุ่มทีม + email ถึงเจ้าตัวอัตโนมัติ

## Workflow ที่จะสร้าง

```
Schedule (ทุกวัน 9:00) ──▶ Sheets: read staff ──▶ IF (วันนี้=วันเกิด?) ──▶ Loop ──▶ LINE Notify
   trigger                      fetch list           filter                  iterate    action
```

## สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | สถานะ |
|---|---|
| n8n account (จาก W1) | ✅ ใช้ของเดิม |
| Google Sheets OAuth2 credential | ⚠️ ตั้งใหม่ใน Workshop (เหมือน W2) |
| Google Sheet "staff" ตัวอย่าง (มีให้ copy) | ✅ TA จะแจก template |
| LINE Notify token (กลุ่มทีม) | ✅ ใช้ของเดิมจาก W1 |
| Google account ส่วนตัว | ✅ ของคุณเอง |

> ⚠️ **เกี่ยวกับ LINE Notify:** LINE ประกาศจะหยุดบริการ LINE Notify ปี 2025 — แต่ยังใช้ได้ถึงกำหนดสิ้นสุดบริการ ของจริงในอนาคตควรเปลี่ยนไปใช้ LINE Messaging API (Bot) — แต่ workshop นี้ใช้ LINE Notify เพื่อความง่าย เพราะ pattern เหมือนกัน

## โครงสร้างไฟล์

```
W3_Birthday/
├── README.md                ← ไฟล์นี้ (ภาพรวม)
├── GUIDE.md                 ← ขั้นตอนละเอียดทีละคลิก
├── sample-data.md           ← โครงสร้าง Google Sheet "staff"
├── troubleshooting.md       ← ปัญหาที่เจอบ่อย
└── solution/
    ├── workflow.json        ← เฉลยฉบับเต็ม
    └── README.md
```

## ขั้นตอนคร่าวๆ (อ่านละเอียดใน [GUIDE.md](GUIDE.md))

1. **เปิด n8n** → New Workflow → ชื่อ `W3-อวยพรวันเกิด-[ชื่อคุณ]`
2. **Copy Google Sheet template** จาก TA → ใส่ข้อมูลบุคลากรในทีมตัวเอง (3-5 คน)
3. **เพิ่ม Schedule Trigger** — Cron `0 9 * * *` (สำหรับ workshop ใช้ Manual ก่อน)
4. **เพิ่ม Google Sheets node** — Operation: Get Rows → อ่านตาราง staff
5. **เพิ่ม IF node** — เทียบ `birthday` กับวันที่ปัจจุบัน format `MM-DD`
6. **เพิ่ม Loop Over Items** — กรณีมีคนเกิดวันเดียวกันหลายคน
7. **เพิ่ม HTTP Request (LINE Notify)** — ส่งข้อความ personalized
8. **Execute** → ทดสอบกับวันเกิดสมมติ (เปลี่ยน `birthday` ของคน 1 คนให้ตรงวันนี้)
9. **Activate workflow** → ตั้งให้ทำเองทุกวัน 9 โมง

## เกณฑ์สำเร็จ

ผู้เรียนถือว่าทำสำเร็จเมื่อ:

- [x] ตั้ง Google Sheets credential (OAuth) สำเร็จ
- [x] อ่านข้อมูลจาก Sheet ออกมาเป็น list ได้
- [x] Schedule trigger ตั้ง Cron `0 9 * * *` ถูกต้อง
- [x] IF node เทียบวันที่ได้ — output เฉพาะคนที่เกิดวันนี้
- [x] Loop Over Items วนได้ทุกคน
- [x] LINE ได้รับข้อความ personalized (เห็นชื่อ + nickname ของแต่ละคน)
- [x] Activate workflow + ทดสอบ end-to-end

**ทำได้ครบ = สำเร็จ** (Foundation Level — เน้นเข้าใจ pattern)

## ถ้าทำไม่ทันในคาบ

ไม่เป็นไร! Workshop นี้คือ "pattern ของงาน reminder รายวัน"
- ดู [GUIDE.md](GUIDE.md) ทำต่อที่บ้าน
- ถามใน LINE กลุ่ม
- ดู solution ที่ [`solution/workflow.json`](solution/workflow.json)

## เอาไปใช้กับงานอะไรได้บ้าง?

Pattern นี้ (Schedule + ตาราง + IF) เหมาะกับงาน:

- **เตือนวันครบรอบการทำงาน** — เปลี่ยน column `birthday` เป็น `hire_date`
- **เตือนวันหมดอายุสัญญา** — เช็ค `contract_expire` ใน 30 วันข้างหน้า
- **เตือนวันส่งรายงาน** — มี deadline ใน sheet → แจ้งล่วงหน้า 3 วัน
- **เตือนวันต่อใบอนุญาต/บัตรประจำตัว** — เช็ค `id_expire` รายเดือน
- **เตือนวันประชุมประจำสัปดาห์** — Schedule ทุกวันจันทร์เช้า → ส่ง agenda
- **ส่งสรุปยอดทุกสิ้นเดือน** — Schedule ทุกวัน 25 → อ่าน sheet → email สรุป

## ความต่างจาก Workshop 1 + 2

| | W1: Forms→LINE | W2: Gmail→Drive | W3: Schedule→Sheets→LINE |
|--|----------------|------------------|---------------------------|
| Trigger | Webhook (push) | Schedule (15 นาที) | Schedule (Cron รายวัน) |
| Data source | Form submission | Email + attach | Google Sheets (ตาราง) |
| Logic | จัดข้อความ | กรอง attach | เทียบวันที่ + Loop |
| ใหม่ที่เรียน | Expression พื้นฐาน | OAuth, Binary | Cron, Date expression, Loop |

---

**ก่อนหน้านี้:** [Workshop 2 — รวบรวมไฟล์ (Gmail + Drive)](../W2_Gmail_Drive/README.md)
**ถัดไป:** Workshop 4 (Session 5 — อ่านต่อใน course plan)
