# Workshop 2: รวบรวมไฟล์ — Gmail → Google Drive

> **Pattern:** email มี attach → เก็บไฟล์ในโฟลเดอร์ที่จัดประเภทแล้ว
> **เวลา:** 60 นาที (วันที่ 1 ช่วง 14:15–15:30)
> **ระดับ:** Foundation — ต่อยอดจาก Workshop 1

## เป้าหมายของ Workshop นี้

เมื่อจบ Workshop นี้ ผู้เรียนจะ:

1. **เข้าใจ pattern** "email มี attach → จัดเก็บ" — ใช้กับงานรับเอกสารต่างๆ
2. **เชื่อม Gmail** กับ n8n ผ่าน OAuth2
3. **ใช้ IF node** กรองเฉพาะ email ที่ตรงเงื่อนไข (subject, sender)
4. **ดาวน์โหลด attachment** จาก email ออกมา
5. **อัพโหลดเข้า Google Drive** ในโฟลเดอร์ที่กำหนด
6. **ตั้ง Schedule trigger** ให้ทำทุก 15 นาที (ไม่ใช้ webhook)

## งานสมมติ (Use Case)

> **สถานการณ์:** คุณเป็นเลขาภาควิชา ดูแลการรับส่งเอกสารจากนิสิต/อาจารย์
>
> **ปัญหา:** นิสิตส่ง assignment มาทาง email พร้อมไฟล์ PDF/Word — คุณต้องเปิด email ทีละฉบับ download ทีละไฟล์ แล้วเอาไปวางในโฟลเดอร์ Drive ที่จัดประเภทไว้ — เสีย เวลา 1-2 ชม./สัปดาห์
>
> **แก้ด้วย n8n:** ทุก 15 นาที — เช็ค email ใหม่ ถ้ามี subject ขึ้นต้นด้วย `[ส่งงาน]` → ดึง attachment → อัพ Drive อัตโนมัติ

## Workflow ที่จะสร้าง

```
Schedule (15 นาที) ──▶ Gmail (search) ──▶ IF (มี attach?) ──▶ Drive (upload) ──▶ Gmail (label)
   trigger                  fetch              filter              action            cleanup
```

## สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | สถานะ |
|---|---|
| n8n account (จาก W1) | ✅ ใช้ของเดิม |
| Gmail OAuth2 credential ใน n8n | ⚠️ จะตั้งใน Workshop |
| Google Drive OAuth2 credential | ⚠️ จะตั้งใน Workshop (ใช้ account เดียวกับ Gmail) |
| Google account ที่ใช้ทดสอบ (Gmail + Drive) | ✅ ใช้ของส่วนตัว หรือ workshop account ของ TA |

> 💡 **เกี่ยวกับ OAuth:** Google จะถาม permission ตอน connect — ต้อง Allow ให้ n8n อ่าน Gmail + เขียน Drive ของคุณ

## โครงสร้างไฟล์

```
W2_Gmail_Drive/
├── README.md                ← ไฟล์นี้
├── GUIDE.md                 ← ขั้นตอนละเอียดทีละคลิก
├── sample-emails.md         ← ตัวอย่าง email ที่จะใช้ทดสอบ
├── troubleshooting.md       ← ปัญหาที่เจอบ่อย
└── solution/
    ├── workflow.json        ← เฉลยฉบับเต็ม
    └── README.md
```

## ขั้นตอนคร่าวๆ

1. **เปิด n8n** → New Workflow → ชื่อ `W2-รวบรวมไฟล์-[ชื่อคุณ]`
2. **เพิ่ม Schedule Trigger** — ทุก 15 นาที (สำหรับ workshop ใช้ Manual ก่อน)
3. **เพิ่ม Gmail node** — Operation: Get Many → search: `subject:[ส่งงาน] is:unread`
4. **เพิ่ม IF node** — ตรวจว่ามี attachment (จำนวน > 0)
5. **เพิ่ม Loop** — ถ้ามีหลาย email
6. **เพิ่ม Google Drive node** — Operation: Upload → file binary
7. **เพิ่ม Gmail node ที่ 2** — Add label `Archived` ให้ email ที่อ่านแล้ว
8. **Execute** → ทดสอบกับ email ตัวอย่าง 1-2 ฉบับ
9. **Activate workflow** → ตั้งให้ทำทุก 15 นาที

## เกณฑ์สำเร็จ

ผู้เรียนถือว่าทำสำเร็จเมื่อ:

- [x] เชื่อม Gmail + Drive credentials ผ่าน OAuth
- [x] Gmail node ค้นหา email ตาม subject ได้
- [x] IF node กรอง email ที่มี attach
- [x] Download + Upload to Drive สำเร็จ (เห็นไฟล์ใน Drive)
- [x] Label email เก่าเป็น Archived
- [x] Schedule trigger ทำงานเป็นรอบ (เห็น Execution log)

## เอาไปใช้กับงานอะไรได้บ้าง?

Pattern นี้ (email + attach → จัดเก็บ) เหมาะกับงาน:

- **รับใบเสร็จจาก vendor** — รวมในโฟลเดอร์ Accounting
- **รับ CV จากผู้สมัคร** — รวมในโฟลเดอร์ HR / ปี / ตำแหน่ง
- **รับเอกสารสัญญา** — เก็บใน Drive ตามคู่สัญญา
- **รวม report จากหลายส่วนงาน** — รวมเป็นโฟลเดอร์รายเดือน
- **รับงานนิสิต** — รวมตามวิชา / ภาคเรียน

## ความต่างจาก Workshop 1

| | W1: Forms→LINE | W2: Gmail→Drive |
|--|----------------|------------------|
| Trigger | Webhook (push) | Schedule (pull ทุก 15 นาที) |
| ความเร็ว | ทันที | รอ 15 นาที |
| ความซับซ้อน | 3 nodes | 5-6 nodes |
| Credential | LINE token (Header) | Gmail + Drive (OAuth2) |
| ใหม่ที่เรียน | Expression | OAuth, IF, Binary data |

---

**ก่อนหน้านี้:** [Workshop 1 — คำร้องนิสิต](../W1_Forms_LINE/README.md)
**ถัดไป:** [Workshop 3 — อวยพรวันเกิด](../W3_Birthday/README.md) (วันที่ 2)
