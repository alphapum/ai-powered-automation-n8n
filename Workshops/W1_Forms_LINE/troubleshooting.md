# Workshop 1: Troubleshooting

ปัญหาที่พบบ่อย + วิธีแก้ — ถ้าเจอที่ไม่อยู่ในนี้ ถาม TA หรือ LINE กลุ่ม

---

## ❌ "Listen for test event" ไม่รับข้อมูล

**อาการ:** กด Submit form แล้ว n8n ไม่เปลี่ยน status — ยังเขียน "Waiting..."

**สาเหตุ + วิธีแก้:**

1. **URL ผิด** — เช็คว่าใน Apps Script ใส่ Test URL ถูก (ขึ้นต้นด้วย `webhook-test`)
2. **Apps Script ยังไม่ trigger** — เช็คที่ Triggers ของ Apps Script ว่ามี trigger `onFormSubmit` แสดงสีเขียวอยู่
3. **Submit form แล้วแต่ trigger ไม่ทำงาน** — ลอง:
   - ที่ Apps Script editor กด **Run** บน function `onFormSubmit` ครั้งหนึ่งเพื่อทดสอบ permission
   - อาจมี popup ขอ permission อีกครั้ง — Allow
4. **n8n หมดเวลารอ** — Listen for test event มีเวลา 120 วินาที — ลองกดใหม่อีกครั้ง

---

## ❌ LINE Notify ไม่ส่งข้อความ — Error 401 Unauthorized

**อาการ:** HTTP Request node ขึ้นแดง — error `401`

**สาเหตุ + วิธีแก้:**

1. **Token ผิด** — เช็คว่า:
   - Header Name = `Authorization` (มี `n` ตัวเดียว ระวัง typo)
   - Header Value = `Bearer XXXXX` — มีคำว่า `Bearer` เว้นวรรค แล้วตามด้วย token
   - Token ไม่มี space หน้า/หลัง
2. **Token หมดอายุ** — token ของ LINE Notify อยู่ตลอด (ไม่หมดอายุ) แต่ถ้า admin revoke จะใช้ไม่ได้ — แจ้ง TA

---

## ❌ LINE Notify ไม่ส่งข้อความ — Error 400 Bad Request

**อาการ:** HTTP Request node ขึ้นแดง — error `400`

**สาเหตุ + วิธีแก้:**

1. **ไม่ได้ใส่ field `message`** — LINE Notify บังคับต้องมี field ชื่อ `message`
2. **Body type ผิด** — ต้องเป็น `Form-Urlencoded` (ไม่ใช่ JSON)
3. **Message ว่าง** — ลองเช็คว่า `{{ $json.message }}` มีค่าจริง (ดูที่ Set node ก่อนหน้า)

---

## ❌ Apps Script Permission ติด

**อาการ:** ตอนตั้ง Trigger ขึ้น "This app isn't verified"

**วิธีแก้:**
1. กด **Advanced** ที่มุมล่างซ้ายของ popup
2. กด **Go to [ชื่อ project] (unsafe)**
3. กด **Allow** ผ่านทุกหน้า

> 💡 ที่ขึ้นแบบนี้เพราะ Google เตือนว่า script ของเราไม่ผ่าน Google verify — แต่เป็น script ที่เราเขียนเอง ปลอดภัย

---

## ❌ Expression `{{ $json.name }}` ไม่ออกค่า

**อาการ:** ใน Set node ใส่ expression แล้ว output แสดง `{{ $json.name }}` ตรงๆ ไม่ได้ค่าจริง

**สาเหตุ + วิธีแก้:**

1. **ใส่เป็น Fixed value** — ที่ช่อง Value ต้องคลิกที่ไอคอน **fx** (กล่องสี่เหลี่ยม) เพื่อเปลี่ยนเป็น Expression mode ก่อน
   - หรือกดปุ่ม `Expression` ที่ tab
2. **Field name สะกดผิด** — เช็คว่า `name` ใน JSON ของ webhook output ตรงกัน (case-sensitive)
3. **node ก่อนหน้ายังไม่ได้ execute** — กด **Execute previous nodes** ก่อน

---

## ❌ ฟอร์ม Google ส่งซ้ำหลายครั้ง

**อาการ:** Submit 1 ครั้ง แต่ LINE ส่ง 2-3 ข้อความ

**สาเหตุ + วิธีแก้:**

1. **มี Trigger ซ้ำใน Apps Script** — ไปที่ Triggers → ลบ trigger ที่ซ้ำให้เหลือแค่ 1
2. **workflow ทั้ง Test และ Production ทำงานพร้อมกัน** — ถ้า activate แล้ว แต่ Apps Script ยังใช้ Test URL → จะส่ง 2 ทาง
   - แก้: ใช้ URL เดียวเท่านั้น (หลัง activate ให้ใช้ Production)

---

## ❌ ใส่ภาษาไทยใน Set node แล้ว LINE ขึ้น `?????`

**อาการ:** ข้อความใน LINE เป็น `?` แทนภาษาไทย

**สาเหตุ + วิธีแก้:**

1. **Content-Type ไม่ระบุ UTF-8** — ปกติ n8n ตั้งให้ถูกอยู่แล้ว แต่ถ้ายังเป็น `?` ลอง:
   - HTTP Request node → Headers → เพิ่ม `Content-Type: application/x-www-form-urlencoded; charset=utf-8`

---

## ❌ ลืม Webhook URL — หาตรงไหน?

ที่ Webhook node:
1. เปิด tab **Parameters**
2. ดูช่อง **Webhook URLs** — มี 2 URLs ให้:
   - Test URL (ใช้ตอน debug)
   - Production URL (ใช้หลัง activate)
3. คลิกไอคอน copy ด้านขวา

---

## ❌ Apps Script editor หาไม่เจอ

**ใน Google Form:**
1. คลิก **⋮** (จุด 3 จุด ขวาบน)
2. ถ้าไม่มี `Script editor` ในเมนู → ไปที่ `Settings` → `Default settings for forms`
3. หรือลองไปที่ URL: `script.google.com/u/0/home` → New project → จะตั้งใหม่ทั้งหมดได้

---

## 💡 Tips เพิ่มเติม

- **Always test Webhook with "Listen for test event"** ก่อน activate
- **ดู Executions tab** ทางซ้ายของ Workflow editor — เห็นประวัติทุกครั้งที่ workflow รัน (success/fail)
- **Disable workflow ก่อนแก้** — ถ้าแก้ขณะ active อาจมี request เข้ามาแล้ว error
- **อย่าใส่ token จริงใน screenshot** ที่ post ในกลุ่ม — เอาออกหรือเบลอก่อน

---

## ถ้ายังแก้ไม่ได้

1. ยกมือเรียก **TA** ในห้อง (มี 2 คนต่อห้อง)
2. หรือถามใน **LINE กลุ่ม** — โพสต์:
   - screenshot ของ error
   - node ที่ติด
   - สิ่งที่ลองแก้แล้ว
3. วิทยากรจะมา debug หลังเลิก workshop / ในเบรค
