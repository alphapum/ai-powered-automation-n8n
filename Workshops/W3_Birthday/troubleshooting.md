# Workshop 3: Troubleshooting

---

## ❌ Google Sheets node ไม่ขึ้นชื่อ Sheet ใน dropdown

**สาเหตุ:** OAuth scope ไม่ครอบคลุม `spreadsheets` หรือยังไม่ login

**วิธีแก้:**
1. ที่ Sheets node — ดู Credential ว่าตั้งแล้วหรือยัง
2. ถ้าตั้งแล้วแต่ยังว่าง → กด **Reconnect** ใน credential
3. ตอน Allow ของ Google — เช็คว่าให้สิทธิ์ "See, edit, create, and delete your spreadsheets" ครบ

---

## ❌ Sheets node อ่านได้แค่ row เดียว (จริงๆ มีหลาย row)

**สาเหตุ:** Toggle `Return All` ปิดอยู่ → ดึงแค่ row แรก

**วิธีแก้:** เปิด toggle **`Return All`** ที่หน้าตั้งค่า Sheets node

---

## ❌ `birthday` ใน output เป็น ISO date (`2026-05-27T00:00:00.000Z`) ไม่ใช่ `05-27`

**สาเหตุ:** Google Sheet auto-convert `05-27` เป็น date object

**วิธีแก้:**
1. เปิด Sheet → คลิก column header `D` (column `birthday`)
2. **Format → Number → Plain text**
3. ลบข้อมูลเดิม แล้วพิมพ์ใหม่ (ตอนพิมพ์ใส่ `'` นำหน้าเพื่อความชัวร์ เช่น `'05-27`)
4. กลับ n8n → Execute step Sheets อีกครั้ง → ดูว่าเป็น `"05-27"` แล้ว

**หรือใช้ expression ใน IF แทน** (workaround):
```
{{ DateTime.fromISO($json.birthday).toFormat('MM-dd') === $now.toFormat('MM-dd') }}
```

---

## ❌ IF node True branch ว่าง — แม้มีคนเกิดวันนี้

**เช็คทีละข้อ:**

1. **format ของ birthday ใน sheet ตรงไหม?** — ต้องเป็น `MM-DD` 2 หลัก เช่น `05-27` ไม่ใช่ `5-27`
2. **ค่าใน sheet ตรงกับวันนี้จริงไหม?** — ดูใน output Sheets node ก่อน IF
3. **expression เขียนถูกไหม?**
   - Left: `{{ $json.birthday }}`
   - Right: `{{ $now.toFormat('MM-dd') }}` (`MM` ใหญ่ = เดือน, `dd` เล็ก = วัน)
   - **อย่าใช้ `mm`** (`mm` = นาที!)
4. **Operator** = `is equal to` (ไม่ใช่ `contains` หรือ `starts with`)

> ⚠️ **`MM` vs `mm` ใน toFormat:**
> - `MM` = เดือน (01–12)
> - `mm` = นาที (00–59) — ผิดมาก!
> - `dd` = วัน (01–31)

---

## ❌ IF node ตรวจ True ทุก row (เกินคาด)

**สาเหตุ:** Right value อาจ render ผิด — เป็น literal string `{{ $now... }}` ไม่ใช่ expression

**วิธีแก้:**
1. ที่ช่อง Value 2 — เช็คว่ามีไอคอน `fx` (expression mode) เป็น สีฟ้า/มี =
2. ถ้าไม่มี — กดที่ไอคอน toggle เพื่อเปลี่ยน mode เป็น expression
3. แล้วจึงพิมพ์ `{{ $now.toFormat('MM-dd') }}`

---

## ❌ Loop Over Items ไม่วน — รันแค่ครั้งเดียว

**สาเหตุ:** ไม่ได้ลาก connection จาก HTTP Request กลับเข้า Loop node

**วิธีแก้:**
1. Loop Over Items มี 2 output: `loop` (วน) + `done` (จบ)
2. ต่อ `loop` → HTTP Request
3. ต่อ HTTP Request → **กลับเข้า Loop node** (input ด้านซ้าย)
4. Loop จะวนจน items หมด แล้ว trigger `done` output

> 💡 **ทางเลือก:** ลบ Loop node ออก ต่อ IF True branch → HTTP Request ตรงๆ — n8n จะรัน HTTP Request ครั้งละ 1 item อยู่แล้ว (เหมาะกับเคสง่าย)

---

## ❌ LINE Notify ส่งไม่ขึ้น (HTTP Request error 401)

**สาเหตุ:** Token ผิด หรือหมดอายุ

**เช็ค:**
1. Credential `LINE Notify` — Header Value เป็น **`Bearer XXXX`** (มีคำว่า `Bearer` + เว้นวรรค)
2. Token ที่ TA แจกใช้งานได้ — ลองส่งจาก Postman/curl
3. LINE Notify ยังไม่หมดอายุ (ดูประกาศ — LINE จะ shutdown LINE Notify ปลายปี 2025/ต้นปี 2026)

---

## ⚠️ LINE Notify จะหยุดให้บริการ (สำคัญ)

LINE ประกาศ **LINE Notify จะปิดบริการในปี 2025** (ตรวจสอบ deadline ล่าสุดที่ developers.line.biz)

**ใน workshop นี้ยังใช้ LINE Notify ได้** ถ้ายังก่อน deadline

**ของจริงหลัง deadline** — ต้องเปลี่ยนไปใช้:
- **LINE Messaging API (Bot)** — ส่งข้อความผ่าน Channel Access Token
- HTTP Request เปลี่ยน URL เป็น `https://api.line.me/v2/bot/message/push`
- Body เป็น JSON (ไม่ใช่ form-urlencoded)
- ต้องมี `line_user_id` ของคนรับ (เลยมี column `line_user_id` ใน sheet ไว้รองรับ)

**Pattern ของ workflow ไม่เปลี่ยน** — แค่เปลี่ยน node ปลายทาง

---

## ❌ Schedule ตั้ง Cron แล้วแต่ไม่ทำงาน

**เช็ค:**
1. **Workflow ต้อง Active** (toggle สีเขียวมุมขวาบน) — ถ้า Inactive จะรันแค่ตอน Execute มือ
2. **Timezone ของ n8n** — ดูใน Settings → Schedule จะใช้ timezone ของ server
   - ถ้า server timezone = UTC, `0 9 * * *` = 16:00 ของไทย!
   - แก้: ตั้ง expression เป็น `0 2 * * *` (= 9:00 ไทย) หรือเปลี่ยน timezone ใน Schedule node options
3. **เปิด Executions tab** ทางซ้าย — ดูว่ามี run ใหม่หรือไม่

> 💡 **n8n รุ่น 2.12 ส่วนใหญ่จะใช้ Bangkok timezone** ที่ workflow.ku.ac.th — แต่ลองเช็ค Executions ว่า run เวลาตรงไหม

---

## ❌ "วันนี้ไม่มีใครเกิด" — workflow รันไม่มีอะไรเกิดขึ้น

**ถูกต้องแล้ว!** ถ้าวันนี้ไม่มีใครใน sheet มี `birthday = วันนี้` — IF True branch จะว่าง → ไม่ส่ง LINE → workflow ทำงานเฉยๆ

**ทดสอบ:** เปลี่ยน `birthday` ของคน 1 คนใน sheet ให้เป็นวันนี้ แล้ว Execute ใหม่

---

## ❌ Sheet อัพเดท แต่ n8n ยังเห็นข้อมูลเก่า

**สาเหตุ:** ไม่ได้กด Execute step ใหม่หลังแก้ Sheet — n8n cache ผลรอบล่าสุด

**วิธีแก้:** กด **Execute step** ที่ Sheets node อีกครั้ง → ดูว่า output อัพเดทไหม

---

## ❌ ข้อความ LINE ตัวอักษรเพี้ยน (ไทยกลายเป็น ?????)

**สาเหตุ:** Body Content Type ผิด หรือ encoding ไม่ใช่ UTF-8

**วิธีแก้:**
1. ที่ HTTP Request node — **Body Content Type** ต้องเป็น `Form-Urlencoded`
2. **อย่าใช้** Body Content Type = `Raw` หรือ `JSON` (LINE Notify ไม่ accept JSON)

---

## ❌ ส่ง LINE ซ้ำ 2 ครั้ง (ทุกคนได้ข้อความ 2 รอบ)

**สาเหตุ:**
1. **HTTP Request ต่อกลับ Loop ผิด** — ทำให้วน 2 รอบ
2. **Workflow Active 2 ครั้งซ้อน** — มี execution ค้าง

**วิธีแก้:**
1. ปิด Workflow (Inactive)
2. เปิด Executions tab → cancel ตัว running ทั้งหมด
3. ลบ HTTP Request → สร้างใหม่ + เชื่อม connection ใหม่ให้สะอาด
4. Active อีกครั้ง

---

## 💡 Tips

- **ทดสอบเร็วๆ:** ตั้ง Schedule เป็น `*/2 * * * *` (ทุก 2 นาที) ตอนทดสอบ → เปลี่ยนกลับ `0 9 * * *` ก่อนใช้จริง
- **ป้องกัน rate limit:** ถ้ามีคนเกิดวันเดียวกัน > 10 คน — ใช้ Loop + เพิ่ม Wait node 1 วินาที ระหว่าง batch
- **เก็บ log ดี:** เพิ่ม Google Sheets node อีกตัว (เป็น "log sheet") บันทึกว่าส่งให้ใครเวลาไหน
- **อย่าใส่ข้อมูลจริงตอนทดสอบ:** ใส่ชื่อสมมติ + email ของตัวเองทดสอบใน workshop ก่อน → ของจริงค่อยใช้ทีม

---

## ถ้ายังแก้ไม่ได้

1. ยกมือเรียก **TA**
2. โพสต์ใน **LINE กลุ่ม** พร้อม:
   - screenshot node ที่ติด
   - output JSON ของ node ก่อนหน้า
   - ตัวอย่าง 1 row จาก Sheet (ไม่ใส่ข้อมูลจริงของบุคลากร)
