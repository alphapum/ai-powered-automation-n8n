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
📩 คำร้องใหม่จาก: {{ $json.body.name }}
รหัส: {{ $json.body.student_id }}
เรื่อง: {{ $json.body.topic }}

รายละเอียด:
{{ $json.body.detail }}
```

> 💡 **Expression `{{ $json.body.xxx }}`** = ดึงค่าจาก JSON body ของ Webhook
>
> ⚠️ **ต้องมี `.body.`** เพราะ Webhook ใส่ payload ใน `body` ไม่ใช่ root
>
> ⚠️ **อย่าพิมพ์ `=` หน้า 📩** — n8n ใส่เครื่องหมาย `=` ให้เองในป้ายซ้าย (expression mode indicator) ถ้าพิมพ์ซ้ำ จะติดไปกับข้อความตอนส่ง LINE
>
> 💡 **`\n` ใน Table view = newline จริง** — ตอนส่ง LINE จะเป็นบรรทัดใหม่ปกติ คลิก JSON button เพื่อดูโครงสร้างจริง

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

## Step 6: เพิ่ม LINE Messaging API (ส่งข้อความ) (15 นาที)

> ⚠️ **LINE Notify ปิดบริการแล้ว** (31 มี.ค. 2568) — Workshop นี้ใช้ **LINE Messaging API** แทน
>
> ขั้นตอนยาวกว่า Notify เดิม แต่ยืดหยุ่นกว่า (ส่ง flex message, image, sticker ฯลฯ ได้)

### 6.1 สมัคร LINE Developers + สร้าง Provider (3 นาที)

1. เปิด **https://developers.line.biz**
2. กด **Log in** (มุมขวาบน) → **Log in with LINE Account**
3. ครั้งแรก: ยอมรับ Terms of Use
4. ในหน้า Console → section **Providers** → กด **Create**
5. Provider name: `KU Workshop [ชื่อคุณ]`
6. กด **Create**

> 💡 Provider = "องค์กร" ที่จะเป็นเจ้าของ Bot — ใช้ของตัวเองได้เลย

### 6.2 สร้าง Messaging API Channel (5 นาที)

> ⚠️ **UI ใหม่:** LINE รวม flow สร้าง Channel เข้ากับการสร้าง LINE Official Account (OA) ผ่าน UI ภาษาไทย — กดสร้าง channel แล้วจะถูก redirect ไป OA Manager

**A. เริ่มสร้าง Channel:**
1. คลิกที่ Provider ที่สร้างไว้ → tab **Channels**
2. คลิกที่ icon **Create a Messaging API channel** (icon ที่ 2 มีรูปจอ+มือถือ+กล่องแชท)
3. LINE จะ **redirect ไปหน้าสร้าง LINE Official Account** (Thai UI)

**B. ขั้นที่ 1/3 — กรอกข้อมูล:**
| ช่อง (ภาษาไทย) | ใส่ |
|---|---|
| ชื่อบัญชี ● | `KU-W1-[ชื่อคุณ]` (เช่น `KU-W1-Kong`) |
| อีเมล ● | email ของคุณ |
| ประเทศที่ตั้งบริษัท & ธุรกิจ ● | ไทย |
| ชื่อบริษัท/ธุรกิจ | `KU-OCS` |
| ประเภทธุรกิจ ● | การศึกษา → อุดมศึกษา |

> ● = ต้องระบุ

กดปุ่ม **ตกลง** (สีเขียว)

**C. ขั้นที่ 2/3 — ตรวจสอบรายละเอียด:**
- ตรวจข้อมูลทั้งหมด → กด **เสร็จสิ้น**

**D. ขั้นที่ 3/3 — สำเร็จ!**
- เห็นข้อความ "สร้าง LINE ออฟฟิเชียลแอคเคาท์แล้ว"
- เห็น **เบสิค ID** เช่น `@673zrhdy` (จด/copy เก็บไว้)
- Channel ใน Developers Console ก็ถูกสร้างพร้อมกัน

**E. ⚠️ สำคัญ — เลื่อนล่างจะมี 2 ปุ่ม:**

| ปุ่ม | สี | ทำอะไร | ใช้มั้ย? |
|------|-----|--------|----------|
| **ขอรับรองบัญชี** | สีเขียวเข้ม | สมัครบัญชี Verified (paid feature + ต้องรอ approve) | ❌ **อย่ากด!** |
| **ภายหลัง (ไปหน้าจอ Manager)** | ขอบเขียวข้างในขาว | ข้ามขั้นรับรอง → เข้า LINE OA Manager | ✅ **กดอันนี้** |

> 💡 **Basic ID (`@xxxx`)** = ID ที่คนใช้ Add Friend  
> **Your user ID (`Uxxxxx`)** = ID สำหรับใช้ใน push API (จะหาใน 6.4)
>
> 🚨 **ปุ่มสีเขียวเข้ม "ขอรับรองบัญชี" = เสียเงิน + ต้องส่งเอกสาร**  
> สำหรับ Workshop ไม่ต้องใช้ — กด "ภายหลัง" ผ่านไปได้เลย

### 6.3 Enable Messaging API ใน OA Manager (2 นาที)

หลังกด "ภายหลัง (ไปหน้าจอ Manager)" จากขั้น 6.2 — เข้า LINE OA Manager (`manager.line.biz`)

**A. เข้า Messaging API page:**
1. **ถ้ามีหน้า "ข้อตกลงเกี่ยวกับการใช้ข้อมูล"** → กด **ยอมรับ**
2. ที่หน้า LINE OA Manager Home (`manager.line.biz/account/@xxxx`)
3. คลิก **Settings** (ฟันเฟือง มุมขวาบน)
4. เมนูซ้าย → คลิก **Messaging API**
5. จะเห็น **Status: Disabled** + ปุ่มเขียว **Enable Messaging API**
6. กดปุ่ม **Enable Messaging API**

**B. Dialog 1 — Select provider:**
- เลือก radio button **`KU Workshop`** (Provider ที่สร้างไว้)
- มีข้อความ "By tapping Agree below, you agree to the Messaging API Terms..."
- กด **Agree** (สีเขียว)

**C. Dialog 2 — Privacy Policy and Terms of Use (optional):**
- มี 2 ช่องให้กรอก URL → **เว้นว่างทั้ง 2 ช่อง** (optional)
- กด **OK** (สีเขียว)

**D. Dialog 3 — Enabling Messaging API:**
- แสดง warning: *"You won't be able to change or unlink this provider once linked"*
- ยืนยันข้อมูล: Account name = `KU-W1-Kong`, Provider name = `KU Workshop`
- กด **OK** (สีเขียว)

**E. ผลลัพธ์:**
- Status เปลี่ยนเป็น **Enabled** ✅
- เห็น **Channel info**:
  - Channel ID (ตัวเลข ~10 หลัก)
  - Channel secret (32 ตัว hex)
- ช่อง **Webhook URL** (ยังว่าง — ไม่ต้องใส่)
- ข้อความ "You can find more related settings in the LINE Developers Console"

> ⚠️ **ขั้นนี้สำคัญ!** ถ้าไม่ Enable — แม้มี Channel + Token ก็จะส่งข้อความไม่ได้
> 
> 💡 **ทำไมต้อง Enable?** OA ถูกสร้างพร้อม Channel แต่ default = Disabled เพื่อให้เจ้าของเลือกว่าจะใช้ API หรือใช้เป็น OA แชทธรรมดา
>
> 🔒 **Channel secret ที่เห็น** = ไว้ใช้ verify webhook signature (เราไม่ต้องใช้ใน workshop นี้)

### 6.4 กลับไป Developers Console + รับ Channel Access Token (2 นาที)

1. เปิด tab ใหม่ ไปที่ **https://developers.line.biz/console/**
2. คลิกที่ Provider `KU Workshop` (ที่สร้างไว้)
3. จะเห็น **Channel** ชื่อ `KU-W1-[ชื่อ]` (ที่เพิ่ง enable แล้ว)
4. คลิกเข้าไปใน Channel
5. เลือก tab **Messaging API**
6. เลื่อนลงหา section **Channel access token (long-lived)**
7. กด **Issue** → token จะแสดง
8. **Copy เก็บไว้** (ยาว ~170 ตัวอักษร)

> ⚠️ **Token = รหัสผ่าน!** อย่า commit ขึ้น Git / share ในที่สาธารณะ  
> ถ้าหลุด → กด **Reissue** ทันที

> 💡 **ถ้าไม่เห็น Channel ใน Provider:** Refresh หน้า หรือ logout/login ใหม่

### 6.5 เพิ่ม Bot เป็นเพื่อน + หา User ID (3 นาที)

**A. เพิ่ม Bot:**
1. ใน tab Messaging API เลื่อนหา **QR code**
2. เปิด LINE บนมือถือ → Home → Scan QR → scan QR ของ Bot
3. กด **Add** — Bot จะเข้ามาในรายชื่อเพื่อน

**B. หา User ID ของตัวเอง:**
1. กลับไปที่ tab **Basic settings** ของ Channel
2. เลื่อนหา **Your user ID** (ไม่ใช่ Bot user ID!)
3. Copy: ขึ้นต้นด้วย `U` + ตัวเลข/ตัวอักษร 32 ตัว

> ⚠️ **ระวัง 2 ID ต่างกัน:**
> - **Your user ID** (ขึ้นต้น `U`) ← ใช้อันนี้!
> - **Bot user ID** (ขึ้นต้น `@`) ← ไม่ใช่อันนี้

### 6.6 เพิ่ม HTTP Request Node ใน n8n (5 นาที)

1. ที่ Set node กดปุ่ม **`+`**
2. ค้นหา **`HTTP Request`** → คลิก
3. ตั้งค่า:
   - **Method:** `POST`
   - **URL:** `https://api.line.me/v2/bot/message/push`
   - **Authentication:** `Generic Credential Type` → `Header Auth`
     - กด **Create New Credential**:
       - **Name:** `LINE Messaging API - KU Workshop`
       - **Header Name:** `Authorization`
       - **Header Value:** `Bearer <Channel Access Token จาก 6.3>`
       - กด **Save**
   - **Send Body:** เปิด toggle
   - **Body Content Type:** `JSON`
   - **Specify Body:** `Using JSON`
   - **JSON:**
     ```json
     {
       "to": "U1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6",
       "messages": [
         {
           "type": "text",
           "text": "{{ $json.message }}"
         }
       ]
     }
     ```
   - **แทน `U1a2b3...` ด้วย Your user ID ของคุณ** (จาก Step 6.4)

✅ **เช็ค:** ตั้งค่าครบทุกช่อง + ใส่ user ID ของตัวเองแล้ว

---

## Step 7: ทดสอบ End-to-End (5 นาที)

1. กดปุ่ม **`Execute Workflow`** (มุมขวาบน — สีแดง)
2. n8n จะรอ webhook event อีกครั้ง
3. กลับไป Google Form ของคุณ — submit ฟอร์มทดลองอีก 1 ครั้ง:
   - ชื่อ: ใช้ชื่อจริงของคุณ
   - เรื่อง: เลือก `ขอใบรับรอง`
4. ใน n8n ดู workflow ไหลผ่าน 3 nodes (Webhook → Set → HTTP Request) — ทุก node ขึ้นเขียว
5. **เช็ค LINE ของตัวเอง** — เปิด chat กับ Bot `KU-W1-[ชื่อคุณ]`
   ภายใน 2-3 วินาที จะมีข้อความ:
   ```
   📩 คำร้องใหม่จาก: [ชื่อจริงของคุณ]
   รหัส: 6500000
   เรื่อง: ขอใบรับรอง

   รายละเอียด:
   ...
   ```

🎉 **เสร็จแล้ว!** workflow แรกของคุณทำงานจริง

✅ **เช็ค:** เห็นข้อความใน chat ของ LINE Bot

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
