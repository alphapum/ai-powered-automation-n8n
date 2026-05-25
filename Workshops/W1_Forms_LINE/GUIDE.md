# Workshop 1: คำร้องนิสิต — คู่มือทีละคลิก

> **เวลา:** 60 นาที | **Pattern:** event → แจ้งเตือน
> ทำตามไปพร้อมกันกับวิทยากร — ไม่ต้องรีบ ถ้าตามไม่ทันบอก TA ในห้อง

---

## Step 0: เปิด n8n + Login (2 นาที)

1. เปิด browser **Chrome** หรือ **Edge**
2. ไปที่ URL: **`https://workflow.ku.ac.th`**
3. Login ด้วย account ที่ TA แจกให้ในห้อง:
   - Email: `kuworkshop-XX@ku.ac.th` (XX = เลขที่นั่งของคุณ)
   - Password: ใส่ตามที่ TA บอก

> 💡 **ถ้า login ไม่ได้:** ยกมือเรียก TA — TA จะ reset ให้

✅ **เช็ค:** เมื่อ login สำเร็จ จะเห็นหน้า **Workflows** (อาจว่างเปล่า หรือมี workflow ตัวอย่างไว้แล้ว)

---

## Step 1: สร้าง Workflow ใหม่ (3 นาที)

1. กดปุ่ม **`+ Add workflow`** ที่มุมบนขวา
2. หน้า Workflow editor จะเปิดขึ้น — ตรงกลางเขียนว่า *"Add first step..."*
3. คลิกที่ชื่อ workflow ด้านบน (ตอนนี้เขียนว่า `My workflow`)
4. เปลี่ยนชื่อเป็น: **`W1-คำร้องนิสิต-[ชื่อคุณ]`**
   - ตัวอย่าง: `W1-คำร้องนิสิต-สมชาย`

> 💡 **ทำไมต้องใส่ชื่อตัวเอง?** เพราะเราใช้ host เดียวกันทั้งห้อง — จะได้หาง่ายในรายการ

✅ **เช็ค:** ชื่อ workflow เปลี่ยนแล้ว เห็นที่ tab ด้านบน

---

## Step 2: เพิ่ม Webhook Node (Trigger) (5 นาที)

**Webhook** คือ "ประตูรับสัญญาณ" — Google Form จะส่งข้อมูลมาที่นี่

1. กลางหน้าจอ คลิก **`+ Add first step...`**
2. ในช่องค้นหา พิมพ์: **`webhook`**
3. คลิกที่ node **`Webhook`** (ไอคอนปลั๊กไฟ สีเขียว)
4. หน้าตั้งค่าจะเปิด — ดูช่อง **`HTTP Method`** ตั้งให้เป็น `POST`
5. ดูช่อง **`Path`** — n8n จะสร้างเลขสุ่มให้ เช่น `1a2b3c4d-...` (ไม่ต้องแก้)
6. ดูช่อง **`Respond`** เลือก **`Immediately`** (Google Form ไม่ต้องการรอ response)

7. **กดปุ่ม `Listen for test event`** (สีฟ้า ด้านบนของหน้าตั้งค่า)
   - n8n จะรอข้อมูลเข้า — ตอนนี้ status เป็น *"Waiting for webhook call..."*

8. **คัดลอก Webhook URL** ที่แสดงในช่อง `Test URL`:
   - URL หน้าตาประมาณ: `https://workflow.ku.ac.th/webhook-test/1a2b3c4d-...`
   - **เก็บไว้ — จะใช้ใน Step 3**

> ⚠️ **มี 2 URL อย่าสับสน:**
> - `Test URL` (`/webhook-test/...`) — ใช้ทดสอบเฉพาะตอนกด "Listen"
> - `Production URL` (`/webhook/...`) — ใช้จริงเมื่อ Activate workflow แล้ว
>
> ตอนนี้ใช้ **Test URL** ก่อน

✅ **เช็ค:** ปุ่ม "Listen for test event" เป็นสีแดง = กำลังฟังอยู่

---

## Step 3: เชื่อม Google Form → Webhook (10 นาที)

Google Form ไม่มีปุ่ม "ส่ง webhook" ตรงๆ — ต้องใช้ **Google Apps Script** เป็นตัวกลาง

### 3.1 เปิด Google Form ตัวอย่าง

1. ไปที่ URL ที่ TA ให้: **`https://forms.google.com/.../ku-workshop-form`**
2. กด **`Use template`** หรือ **`Make a copy`** เก็บไว้ใน Drive ของตัวเอง
3. ตั้งชื่อ form: **`คำร้องนิสิต — Workshop ของ [ชื่อคุณ]`**

ฟอร์มมีคำถาม 4 ข้อ:
- ชื่อ-นามสกุล (Short answer)
- รหัสนิสิต (Short answer)
- เรื่องที่ขอ (Dropdown: ลาเรียน / ขอใบรับรอง / อื่นๆ)
- รายละเอียด (Paragraph)

### 3.2 เปิด Apps Script editor

1. ในหน้า Google Form ของคุณ คลิก **⋮** (จุด 3 จุด ขวาบน)
2. เลือก **`Script editor`** (ถ้าไม่มี → ไปที่ `Extensions` → `Apps Script`)
3. หน้า Apps Script จะเปิดในแท็บใหม่

### 3.3 วาง Code ต่อไปนี้

ลบโค้ดเดิมที่เห็น แล้ววางโค้ดนี้ลงไป:

```javascript
function onFormSubmit(e) {
  const WEBHOOK_URL = "วาง_TEST_URL_ที่_COPY_จาก_STEP_2_ตรงนี้";

  // เก็บคำตอบทั้งหมด
  const responses = e.namedValues;
  const payload = {
    timestamp: new Date().toISOString(),
    name: responses["ชื่อ-นามสกุล"]?.[0] || "",
    student_id: responses["รหัสนิสิต"]?.[0] || "",
    topic: responses["เรื่องที่ขอ"]?.[0] || "",
    detail: responses["รายละเอียด"]?.[0] || ""
  };

  // ส่งไป n8n webhook
  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
```

### 3.4 ใส่ Webhook URL

แก้บรรทัด `const WEBHOOK_URL = "..."` ให้เป็น Test URL ที่ copy จาก Step 2

ตัวอย่าง:
```javascript
const WEBHOOK_URL = "https://workflow.ku.ac.th/webhook-test/1a2b3c4d-5e6f-7g8h-9i0j-klmnopqrstuv";
```

### 3.5 ตั้ง Trigger

1. กดไอคอน **⏰ Triggers** (รูปนาฬิกาทางซ้าย)
2. กด **`+ Add Trigger`** (มุมขวาล่าง)
3. ตั้งค่า:
   - **Choose function:** `onFormSubmit`
   - **Event source:** `From form`
   - **Event type:** `On form submit`
4. กด **`Save`**
5. Google จะขอ permission — กด `Allow` ผ่านทุกหน้า

> 💡 **ถ้า permission ติด:** เลือก account ตัวเอง → "Advanced" → "Go to ... (unsafe)" → "Allow" — เพราะเป็น script ที่เราเขียนเอง

✅ **เช็ค:** ที่หน้า Triggers เห็น 1 trigger ชื่อ `onFormSubmit` แสดงเป็นสีเขียว

---

## Step 4: ทดสอบ Webhook (5 นาที)

1. กลับไปที่ Google Form (หน้า preview)
2. กรอกข้อมูลทดสอบ:
   - ชื่อ: `ทดสอบ จาก-[ชื่อคุณ]`
   - รหัส: `6500000`
   - เรื่อง: `ลาเรียน`
   - รายละเอียด: `ทดสอบ webhook`
3. กด **Submit**

4. **กลับไปหน้า n8n** ที่กำลัง `Listen for test event` อยู่
5. ภายใน 2-3 วินาที จะเห็นข้อมูลเข้า — status เปลี่ยนเป็น *"Test event received"*
6. ที่ panel ขวา จะเห็น **JSON output**:
   ```json
   {
     "timestamp": "2026-05-26T...",
     "name": "ทดสอบ จาก-สมชาย",
     "student_id": "6500000",
     "topic": "ลาเรียน",
     "detail": "ทดสอบ webhook"
   }
   ```

✅ **เช็ค:** เห็น JSON ใน panel ขวาของ Webhook node

> ⚠️ **ถ้าไม่เห็น:**
> - เช็คว่า WEBHOOK_URL ใน Apps Script ตรงกับ Test URL ของ n8n
> - เช็คว่ากด `Listen for test event` แล้ว
> - ดู [troubleshooting.md](troubleshooting.md)

---

## Step 5: เพิ่ม Set Node (จัดข้อความ) (5 นาที)

**Set node** ช่วย "จัดรูปแบบข้อมูล" ก่อนส่งไป LINE

1. ที่ Webhook node กดปุ่ม **`+`** (จุดสีเทาด้านขวาของ node)
2. ค้นหา **`Set`** → คลิกที่ node **`Edit Fields (Set)`**
3. ในหน้าตั้งค่า เพิ่ม field 1 field:
   - คลิก **`+ Add Field`**
   - **Name:** `message`
   - **Type:** `String`
   - **Value:** ใส่ข้อความนี้ (ใช้ expression):

```
📩 คำร้องใหม่จาก: {{ $json.name }}
รหัส: {{ $json.student_id }}
เรื่อง: {{ $json.topic }}

รายละเอียด:
{{ $json.detail }}
```

> 💡 **Expression `{{ $json.xxx }}`** = ดึงค่าจาก JSON ของ node ก่อนหน้า

4. กด **Execute step** (มุมขวาบน) → ดู output ของ Set node
5. ควรเห็น field `message` มีข้อความครบ:
   ```
   📩 คำร้องใหม่จาก: ทดสอบ จาก-สมชาย
   รหัส: 6500000
   เรื่อง: ลาเรียน

   รายละเอียด:
   ทดสอบ webhook
   ```

✅ **เช็ค:** Set node มี output ที่ format แล้ว

---

## Step 6: เพิ่ม LINE Notify Node (ส่งข้อความ) (10 นาที)

### 6.1 รับ LINE Notify Token

TA จะแจก **LINE Notify token** ให้ในห้อง (ของกลุ่มทดสอบ — ทุกคนใช้ token เดียวกันเพื่อความสะดวก)

> 💡 **Token หน้าตาประมาณ:** `XXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (40 ตัวอักษร)

ในกลุ่ม LINE ที่ TA สร้างไว้ ทุกคนเข้ากลุ่ม → ทุกข้อความที่ทุกคนส่ง จะเข้ามาในกลุ่มเดียวกัน

### 6.2 เพิ่ม HTTP Request Node

n8n รุ่น 2.12 ยังไม่มี LINE Notify node ในตัว — เราใช้ **HTTP Request** ส่งเองได้ง่ายๆ

1. ที่ Set node กดปุ่ม **`+`**
2. ค้นหา **`HTTP Request`** → คลิก
3. ตั้งค่า:
   - **Method:** `POST`
   - **URL:** `https://notify-api.line.me/api/notify`
   - **Authentication:** เลือก `Generic Credential Type` → `Header Auth`
     - กด **Create New Credential** :
       - Name: `LINE Notify - KU Workshop`
       - **Header Name:** `Authorization`
       - **Header Value:** `Bearer XXXXX` (แทน XXXXX ด้วย token จาก TA)
       - กด **Save**
   - **Send Body:** เปิด toggle
   - **Body Content Type:** `Form-Urlencoded`
   - **Body Parameters** → เพิ่ม 1 field:
     - **Name:** `message`
     - **Value:** `{{ $json.message }}` (ดึงจาก Set node)

✅ **เช็ค:** ตั้งค่าครบทุกช่อง

---

## Step 7: ทดสอบ End-to-End (5 นาที)

1. กดปุ่ม **`Execute Workflow`** (มุมขวาบน — สีแดง)
2. n8n จะรอ webhook event อีกครั้ง
3. กลับไป Google Form ของคุณ — submit ฟอร์มทดลองอีก 1 ครั้ง:
   - ชื่อ: ใช้ชื่อจริงของคุณ
   - เรื่อง: เลือก `ขอใบรับรอง`
4. ใน n8n ดู workflow ไหลผ่าน 3 nodes (Webhook → Set → HTTP Request) — ทุก node ขึ้นเขียว
5. **เช็ค LINE กลุ่ม** — ภายใน 2-3 วินาที จะมีข้อความ:
   ```
   📩 คำร้องใหม่จาก: [ชื่อจริงของคุณ]
   รหัส: 6500000
   เรื่อง: ขอใบรับรอง
   ...
   ```

🎉 **เสร็จแล้ว!** workflow แรกของคุณทำงานจริง

✅ **เช็ค:** เห็นข้อความใน LINE กลุ่ม

---

## Step 8: Activate Workflow (ทำให้ทำงาน 24/7) (3 นาที)

ตอนนี้ workflow จะทำงาน **เฉพาะตอนกด Execute** เท่านั้น เราต้อง Activate

1. ที่มุมขวาบนของ Workflow editor มี toggle **`Inactive`** (สีเทา)
2. คลิก toggle → เปลี่ยนเป็น **`Active`** (สีเขียว)
3. n8n จะเปลี่ยน Webhook URL จาก Test URL → **Production URL**
   - Test URL: `/webhook-test/xxx`
   - Production URL: `/webhook/xxx`

4. **อัพเดท Apps Script** ให้ใช้ Production URL:
   - กลับไป Apps Script editor
   - แก้ `WEBHOOK_URL` เป็น URL ใหม่ (เอา `-test` ออก)
   - กด **Save** (Ctrl+S)

5. ทดสอบอีกครั้ง — submit ฟอร์ม → เช็ค LINE → ควรได้ข้อความ

> 💡 **ทำไมแยก Test/Production URL?**
> - Test = ใช้ตอน debug ต้องกด Listen ทุกครั้ง
> - Production = ทำงานตลอด 24/7 หลัง Activate

✅ **เช็ค:** Workflow เป็น Active สีเขียว + ส่งฟอร์มหลัง Activate → ได้ข้อความ LINE

---

## Checklist ก่อนจบ Workshop 1

- [ ] สร้าง n8n workflow + ตั้งชื่อ
- [ ] Webhook node + ได้ Test URL
- [ ] เชื่อม Google Form → Webhook ด้วย Apps Script
- [ ] ทดสอบ submit form → เห็นข้อมูลใน n8n
- [ ] Set node format ข้อความได้
- [ ] LINE Notify ส่งข้อความสำเร็จ
- [ ] Activate workflow + ทดสอบ Production URL

**ครบทุกข้อ = สำเร็จ Workshop 1** 🎉

---

## ถัดไป

- พัก 10 นาที
- **Workshop 2:** [รวบรวมไฟล์ (Gmail + Drive)](../W2_Gmail_Drive/README.md)

## ถ้าเจอปัญหา

ดู [troubleshooting.md](troubleshooting.md) หรือถามใน LINE กลุ่ม
