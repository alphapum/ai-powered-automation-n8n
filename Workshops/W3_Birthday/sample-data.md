# Workshop 3: ตัวอย่างข้อมูล Google Sheets `staff`

ใน Workshop คุณจะ copy template Sheet ที่ TA แจกให้ — header กับ format ตั้งไว้แล้ว ใส่แค่ข้อมูลของทีมตัวเอง

## โครงสร้าง Sheet

ใช้ **sheet ชื่อ `staff`** (sheet แรก) — มี 6 columns:

| Column | ตัวอย่าง | คำอธิบาย |
|--------|----------|----------|
| `name` | สมชาย ใจดี | ชื่อ-นามสกุลเต็ม |
| `nickname` | ชาย | ใช้ในข้อความ LINE (ฟังสนิทกว่า) |
| `email` | somchai@ku.ac.th | optional — สำหรับ extension: email อวยพรเพิ่ม |
| `birthday` | `05-27` | **format MM-DD** (ไม่ต้องใส่ปี) |
| `department` | ฝ่ายพัสดุ | ใช้ในข้อความ + กรองทีมได้ |
| `line_user_id` | `Uxxxxxxxx` | optional — สำหรับ LINE Bot direct message (workshop นี้ใช้ LINE Notify ส่งเข้ากลุ่ม ไม่ต้องใช้) |

---

## ⚠️ สำคัญที่สุด: format ของ column `birthday`

ต้องเป็น **string** format `MM-DD` (เดือน-วัน) — **ไม่ใส่ปี**

✅ **ใช้ได้:**
- `05-27` (27 พฤษภาคม)
- `01-15` (15 มกราคม)
- `12-31` (31 ธันวาคม)

❌ **ใช้ไม่ได้** (IF node จะเช็คผิด):
- `5-27` (ขาด 0 นำหน้า)
- `27/05/1990` (มีปี + ตัวคั่นต่าง)
- `27 May` (ภาษาคน)
- `2026-05-27` (date format ของ Sheet — Google Sheet จะ auto-convert เป็น date object)

### วิธีบังคับให้ Sheet เก็บเป็น string

Google Sheet ชอบ auto-convert `05-27` เป็น date — ป้องกันโดย:

**วิธีที่ 1:** ใส่ `'` (single quote) นำหน้า → Sheet เก็บเป็น text
```
'05-27
```

**วิธีที่ 2:** ก่อนใส่ข้อมูล — ที่ column `birthday`:
1. คลิก column header `D`
2. **Format → Number → Plain text**
3. แล้วค่อยใส่ข้อมูล

---

## ตัวอย่างข้อมูลทดสอบ (3-5 คน)

ใส่ข้อมูลนี้ลง Sheet ของคุณ (เปลี่ยนชื่อ/อีเมล/แผนกตามทีมจริงได้):

| name | nickname | email | birthday | department | line_user_id |
|------|----------|-------|----------|------------|--------------|
| สมชาย ใจดี | ชาย | somchai@ku.ac.th | `05-27` | ฝ่ายพัสดุ | |
| สมหญิง รักดี | หญิง | somying@ku.ac.th | `11-15` | ฝ่ายบุคคล | |
| ปิยะ ทำงานเก่ง | ปิ๊ | piya@ku.ac.th | `03-08` | ฝ่ายแผน | |
| ธนกร พัฒนะ | กร | thanakorn@ku.ac.th | `08-21` | ฝ่ายไอที | |
| ฐิติพร สุขสบาย | ฟ้า | thitiporn@ku.ac.th | `06-12` | ฝ่ายการเงิน | |

> 💡 **เพื่อทดสอบเห็นผล** — แก้ `birthday` ของคน 1 คนให้ตรงกับ "วันที่วันนี้" (format `MM-DD`)

---

## ตัวอย่าง output ที่ Google Sheets node จะคืน

หลัง execute Sheets node — output หน้าตาประมาณนี้ (เป็น array, 1 item ต่อ row):

```json
[
  {
    "name": "สมชาย ใจดี",
    "nickname": "ชาย",
    "email": "somchai@ku.ac.th",
    "birthday": "05-27",
    "department": "ฝ่ายพัสดุ",
    "line_user_id": ""
  },
  {
    "name": "สมหญิง รักดี",
    "nickname": "หญิง",
    "email": "somying@ku.ac.th",
    "birthday": "11-15",
    "department": "ฝ่ายบุคคล",
    "line_user_id": ""
  },
  ...
]
```

> 💡 **ถ้าเห็น `birthday: "2026-05-27T00:00:00"` แบบ ISO** — แสดงว่า Sheet auto-convert เป็น date แล้ว → กลับไปแก้ format column เป็น Plain text แล้ว re-enter ข้อมูล

---

## ตัวอย่าง output หลัง IF node (True branch)

วันที่วันนี้คือ `05-27` → IF เทียบ `birthday === "05-27"` → True branch ได้:

```json
[
  {
    "name": "สมชาย ใจดี",
    "nickname": "ชาย",
    "email": "somchai@ku.ac.th",
    "birthday": "05-27",
    "department": "ฝ่ายพัสดุ",
    "line_user_id": ""
  }
]
```

(เฉพาะคนที่ `birthday` ตรงวันนี้เท่านั้น)

---

## ตัวอย่างข้อความ LINE ที่จะส่ง

```
🎉 สุขสันต์วันเกิดคุณ ชาย!
ขออวยพรให้มีความสุข สุขภาพแข็งแรง 🎂

จาก: ทีม ฝ่ายพัสดุ
```

ใช้ template:
```
🎉 สุขสันต์วันเกิดคุณ {{ $json.nickname }}!
ขออวยพรให้มีความสุข สุขภาพแข็งแรง 🎂

จาก: ทีม {{ $json.department }}
```

---

## ปรับ Sheet สำหรับงานคุณเอง

หลัง workshop — ลองเปลี่ยน column เพื่อใช้กับงานอื่น:

### เตือนต่อสัญญา
| name | contract_expire | department |
|------|-----------------|------------|
| สมชาย | `2026-08-15` | พัสดุ |

→ ใน IF เปลี่ยน expression เป็น:
```
{{ DateTime.fromISO($json.contract_expire).diff($now, 'days').days <= 30 }}
```
(แจ้งล่วงหน้า 30 วัน)

### เตือนวันครบรอบการทำงาน
| name | hire_date | years_target |
|------|-----------|--------------|
| สมชาย | `2020-05-27` | 5 |

→ ใน IF เช็คว่าวันนี้ตรงกับ MM-DD ของ hire_date + ปีเต็มหรือไม่

---

## การจัด permission ของ Sheet

⚠️ **อย่าตั้ง Sheet เป็น "Anyone with link"** — เพราะเป็นข้อมูลส่วนตัวของบุคลากร

แทน ให้ n8n เข้าถึงผ่าน OAuth (ของ account คุณเอง) — Sheet ตั้ง permission แค่ตัวเอง ก็พอ

(ของจริง — ทีม HR ควรใช้ Sheet ในวงปิด + ใช้ service account ของหน่วยงาน)
