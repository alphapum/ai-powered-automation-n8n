# Workshop 1: Troubleshooting

ปัญหาที่พบบ่อย + วิธีแก้ — ถ้าเจอที่ไม่อยู่ในนี้ ถาม TA หรือ LINE กลุ่ม

---

## ❌ "Listen for test event" ไม่รับข้อมูล

**อาการ:** กด Submit form แล้ว n8n ไม่เปลี่ยน status — ยังเขียน "Waiting..."

**สาเหตุ + วิธีแก้:**

1. **URL ผิด** — เช็คว่าใน Apps Script ใส่ Test URL ถูก (ขึ้นต้นด้วย `webhook-test`)
2. **Apps Script ยังไม่ trigger** — เช็คที่ Triggers ของ Apps Script ว่ามี trigger `onFormSubmit` แสดงสีเขียวอยู่
3. **Event type ผิด** — ต้องเป็น `เมื่อส่งฟอร์ม` (On form submit) ไม่ใช่ `เมื่อเปิด` (On open)!
4. **Submit form แล้วแต่ trigger ไม่ทำงาน** — เปิด `⌛ Executions` ใน Apps Script ดู:
   - ถ้าไม่มี execution → trigger ไม่ทำงาน
   - ถ้ามี execution สีแดง (Failed) → คลิกดู error
5. **n8n หมดเวลารอ** — Listen for test event มีเวลา 120 วินาที — ลองกดใหม่อีกครั้ง

---

## ❌ Webhook ได้ข้อมูลแต่ค่าเป็น `empty`

**อาการ:** n8n รับ webhook ได้ แต่ใน body เห็น `name: empty`, `student_id: empty`, ฯลฯ — แม้ใน `_debug_raw` มีค่าครบ

**สาเหตุ:** ชื่อคำถามใน Form ใช้ตัว dash unicode ต่างจาก code

ตัวอย่าง: `-` ใน Form อาจเป็น U+2013 (en dash) หรือ U+2014 (em dash) — ดูตาเปล่าเหมือน hyphen U+002D ที่อยู่ในโค้ด แต่ความจริงต่างกัน

**วิธีแก้:** ใช้ `findField()` partial match แทน exact key

```javascript
function findField(keyword) {
  const key = Object.keys(responses).find(k => k.includes(keyword));
  return key ? responses[key] : "";
}

const payload = {
  name:       findField("ชื่อ"),       // match "ชื่อ-นามสกุล"
  student_id: findField("รหัส"),
  topic:      findField("เรื่อง"),
  detail:     findField("รายละเอียด")
};
```

ดูตัวอย่างเต็มใน [`apps-script.gs`](apps-script.gs) บน GitHub

---

## ❌ Set node: Output ขึ้น `[Execute previous nodes for preview]`

**อาการ:** เปิด Set node แล้วใน Result preview เห็น `[Execute previous nodes for preview]` ทั้งหมด

**สาเหตุ:** n8n หมด test data — ต้อง trigger Webhook ใหม่ก่อน

**วิธีแก้:**
1. ปิด Expression editor
2. คลิก Webhook node → กด `Listen for test event` ใหม่
3. Submit form อีกครั้ง
4. กลับมา Set node — preview จะแสดงค่าจริง

---

## ❌ Set node: ข้อความใน LINE ขึ้นต้นด้วย `=`

**อาการ:** ใน LINE เห็นข้อความ `=📩 คำร้องใหม่จาก:...`

**สาเหตุ:** พิมพ์ `=` หน้า `📩` ใน expression — ตัว `=` กลายเป็นตัวอักษรในข้อความ

**วิธีแก้:** ลบ `=` ตัวแรกออก (ที่อยู่หน้า 📩)
- ตัว `=` เล็กๆ ในป้ายซ้ายของ input box คือ expression mode indicator — n8n ใส่ให้เอง
- **อย่าพิมพ์ซ้ำ** ในเนื้อ value

---

## ❌ Set node: ค่าเป็น `empty` ทั้งที่ Webhook มีข้อมูล

**อาการ:** Webhook node เห็นค่าครบ แต่ Set node output เป็น `empty` ทั้งหมด

**สาเหตุ:** ใช้ `{{ $json.name }}` ที่ root level — แต่ Webhook ใส่ payload ใน `body`

**วิธีแก้:** เปลี่ยนเป็น `{{ $json.body.name }}` (เพิ่ม `.body.`)

```
✗ ผิด: {{ $json.name }}
✓ ถูก: {{ $json.body.name }}
```

**ทางลัด:** ลาก field จาก INPUT panel (ซ้าย) → วางใน Value box → n8n เติม path ถูกให้อัตโนมัติ

---

## ❌ Set node: `\n` แสดงเป็นตัวอักษร ไม่ขึ้นบรรทัดใหม่

**อาการ:** Table view ของ output เห็น `\nรหัส:` แทนที่จะขึ้นบรรทัดใหม่

**สาเหตุ:** ไม่ใช่ปัญหา — n8n Table view แสดง newline เป็น `\n` เพื่อให้อ่าน 1 บรรทัด

**ตรวจสอบ:** คลิก **JSON** button มุมขวาบนของ Output panel — จะเห็น `"message": "...\nรหัส..."` ซึ่งคือ newline จริง

ตอนส่ง LINE จะแสดงเป็น**หลายบรรทัด**ปกติ

---

## ❌ LINE Messaging API: Error 401 Unauthorized

**อาการ:** HTTP Request node ขึ้นแดง — error `401`

**สาเหตุ + วิธีแก้:**

1. **Channel Access Token ผิด/หมดอายุ** — เช็คใน LINE Developers Console:
   - Channel → Messaging API tab → Channel access token
   - กด **Reissue** เพื่อออก token ใหม่ → ใส่ใน credential ของ n8n
2. **Header รูปแบบผิด** — ต้องเป็น:
   - Header Name = `Authorization` (case-sensitive)
   - Header Value = `Bearer ` + token (มีคำว่า Bearer เว้นวรรค 1 ครั้ง)
   - ไม่มี space หน้า/หลัง

---

## ❌ LINE Messaging API: Error 400 Bad Request

**อาการ:** HTTP Request node ขึ้นแดง — error `400`

**สาเหตุ + วิธีแก้:**

1. **JSON body ผิด format** — ต้องเป็น object ตามนี้เป๊ะ:
   ```json
   {
     "to": "U1a2b3...",
     "messages": [{"type": "text", "text": "ข้อความ"}]
   }
   ```
2. **User ID ผิด** — `to` ต้องเริ่มด้วย `U` ไม่ใช่ `@`
3. **Messages array ว่าง** — ต้องมีอย่างน้อย 1 message
4. **`text` ว่าง** — เช็คว่า `{{ $json.message }}` มีค่าจริง (ดู Set node)
5. **Content-Type ผิด** — ต้องเป็น `JSON` ไม่ใช่ `Form-Urlencoded`

---

## ❌ LINE Messaging API: Error 403 Forbidden (target user not friend)

**อาการ:** HTTP Request ส่งสำเร็จแต่ LINE ไม่ขึ้นข้อความ — error `403`

**สาเหตุ:** Bot ยังไม่เป็นเพื่อนกับ user ที่ระบุใน `to`

**วิธีแก้:**
1. เปิด LINE บนมือถือ → Home → Add friend
2. เลือก **Scan QR** → scan QR ของ Bot (จาก Messaging API tab)
3. กด **Add** เป็นเพื่อน
4. ลองส่งใหม่

> 💡 LINE Messaging API ส่งได้เฉพาะคนที่เป็นเพื่อนกับ Bot เท่านั้น (เพื่อป้องกัน spam)

---

## ❌ ใช้ User ID ผิด (Bot user ID vs Your user ID)

**อาการ:** Bot ส่งข้อความ "ไปหาตัวเอง" หรือ error

**สาเหตุ:** ใช้ Bot user ID (ขึ้นต้น `@`) แทน Your user ID (ขึ้นต้น `U`)

**วิธีแก้:**
- ใน Channel tab **Basic settings** → เลื่อนหา **Your user ID**
- Copy ค่าที่ขึ้นต้นด้วย `U` + 32 ตัวอักษร
- ใส่ค่านี้ใน `"to"` ของ JSON body

| ID type | ขึ้นต้น | ใช้ตอนไหน |
|---|---|---|
| **Your user ID** | `U` + 32 ตัว | ปลายทาง (`to` ใน push API) ✅ |
| Bot user ID | `@` หรือ `U` | สำหรับ user มา add friend |
| Channel ID | ตัวเลข 10 หลัก | Identification ของ channel |

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
