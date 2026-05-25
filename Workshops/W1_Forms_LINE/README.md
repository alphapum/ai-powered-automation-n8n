# Workshop 1: คำร้องนิสิต — Google Forms → LINE Notify

> **Pattern:** event → แจ้งเตือน
> **เวลา:** 60 นาที (วันที่ 1 ช่วง 13:00–14:00)
> **ระดับ:** Foundation — ง่ายสุด เริ่มจากศูนย์

## เป้าหมายของ Workshop นี้

เมื่อจบ Workshop นี้ ผู้เรียนจะ:

1. **เข้าใจ pattern** "event → แจ้งเตือน" — รู้ว่าใช้ตอนไหน
2. **สร้าง workflow แรก** ใน n8n ที่ทำงานจริง
3. **เชื่อม Google Forms** กับ n8n ผ่าน webhook
4. **ส่งข้อความเข้า LINE** ได้อัตโนมัติเมื่อนิสิตส่งฟอร์ม
5. **เห็นแนวคิด** ของการเชื่อมต่อระบบภายนอกผ่าน n8n

## งานสมมติ (Use Case)

> **สถานการณ์:** คุณเป็นเจ้าหน้าที่บริหารงานทั่วไป รับผิดชอบดูแลคำร้องที่นิสิตส่งเข้ามาผ่าน Google Forms
>
> **ปัญหา:** ต้องเปิด Google Sheet เช็คเองทุก 1–2 ชั่วโมง บางครั้งคำร้องด่วนหลุดไปเป็นวัน
>
> **แก้ด้วย n8n:** ทันทีที่มีนิสิตส่งฟอร์ม → ส่งข้อความเข้า LINE กลุ่มทีมงาน ภายใน 2 วินาที

## Workflow ที่จะสร้าง

```
Google Forms ──submit──▶ Webhook ──▶ Set (จัดข้อความ) ──▶ LINE Notify
   (trigger)              (n8n)       (format)            (action)
```

## สิ่งที่ต้องเตรียม (จะเตรียมให้แล้วใน Session 2)

| สิ่งที่ต้องมี | สถานะ |
|---|---|
| Account บน `workflow.ku.ac.th` | ✅ เตรียมให้แล้ว |
| Google Form ตัวอย่าง (มีให้ในห้อง) | ✅ เตรียมให้แล้ว |
| LINE Notify token (ของกลุ่มทดสอบ) | ✅ เตรียมให้แล้ว |
| Browser (Chrome / Edge) | ✅ มีในเครื่อง Lab |

## โครงสร้างไฟล์ใน Workshop นี้

```
W1_Forms_LINE/
├── README.md              ← ไฟล์นี้ (ภาพรวม)
├── GUIDE.md               ← ขั้นตอนละเอียดทีละคลิก
├── sample-form.md         ← โครงสร้าง Google Form ที่ใช้
├── workflow-skeleton.json ← โครงเปล่าให้ import เริ่มต้น
├── solution/
│   └── workflow.json      ← เฉลยฉบับเต็ม (เปิดดูเมื่อทำเสร็จ)
└── troubleshooting.md     ← ปัญหาที่เจอบ่อย + วิธีแก้
```

## ขั้นตอนคร่าวๆ (อ่านละเอียดใน [GUIDE.md](GUIDE.md))

1. **เปิด n8n** ที่ `workflow.ku.ac.th` → New Workflow → ชื่อ `W1-คำร้องนิสิต-ของฉัน`
2. **เพิ่ม Webhook node** → copy URL ที่ได้
3. **ตั้งค่า Google Form** ให้ส่งข้อมูลมาที่ Webhook URL (ผ่าน Google Apps Script — มี snippet ให้)
4. **ทดสอบ webhook** — ส่งฟอร์มทดลอง 1 ครั้ง → ดูข้อมูลเข้า n8n
5. **เพิ่ม Set node** — จัดข้อความ format `📩 คำร้องใหม่จาก {{ชื่อ}}: {{เรื่อง}}`
6. **เพิ่ม LINE Notify node** — ใส่ token + ผูกกับ message จาก Set
7. **Execute** workflow → ส่งฟอร์มจริง → เช็ค LINE
8. **Activate workflow** → workflow ทำงานอัตโนมัติ 24/7

## เกณฑ์สำเร็จ

ผู้เรียนถือว่าทำสำเร็จเมื่อ:

- [x] เปิด n8n ได้ + เข้าใจหน้าจอ Workflow editor
- [x] สร้าง Webhook node + ได้ URL
- [x] เชื่อม Google Form → Webhook (ส่งฟอร์ม 1 ครั้ง เห็นข้อมูลใน n8n)
- [x] format ข้อความได้ด้วย expression `{{ $json.xxx }}`
- [x] ส่ง LINE Notify ได้สำเร็จ
- [x] Activate workflow + ทดสอบ end-to-end อย่างน้อย 1 ครั้ง

**ทำได้ครบ = สำเร็จ** (ไม่ต้องส่งงาน ไม่มีการให้คะแนน — Foundation Level เน้นเข้าใจ)

## ถ้าทำไม่ทันในคาบ

ไม่เป็นไร! Workshop นี้คือ "รูปแบบ pattern" ไม่ใช่ test
- ดู [GUIDE.md](GUIDE.md) ทำต่อที่บ้าน
- ถามใน LINE กลุ่ม
- ดู solution ที่ [`solution/workflow.json`](solution/workflow.json)

## เอาไปใช้กับงานอะไรได้บ้าง?

Pattern นี้ (event → แจ้งเตือน) เหมาะกับงาน:

- **คำร้อง / นัดหมาย / ร้องเรียน** — มีฟอร์ม → แจ้งทีม
- **การจองห้องประชุม** — มีคนจอง → แจ้งคนดูแลห้อง
- **การแจ้งซ่อม** — มีคนแจ้ง → แจ้งช่าง
- **การส่งข้อเสนอแนะ** — มีคนเขียน → แจ้งผู้บริหาร
- **การอนุมัติเอกสาร** — มีคนส่งมา → แจ้งหัวหน้า

---

**ถัดไป:** [Workshop 2 — รวบรวมไฟล์ (Gmail + Drive)](../W2_Gmail_Drive/README.md)
