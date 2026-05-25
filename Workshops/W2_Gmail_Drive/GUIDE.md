# Workshop 2: รวบรวมไฟล์ — คู่มือทีละคลิก

> **เวลา:** 60 นาที | **Pattern:** email + attach → จัดเก็บ
> ใช้ workshop 1 เป็นพื้นฐาน — จะเร็วกว่าเพราะรู้จัก n8n แล้ว

---

## Step 0: สร้าง Workflow ใหม่ (1 นาที)

1. ที่ n8n หน้า Workflows → **`+ Add workflow`**
2. ตั้งชื่อ: **`W2-รวบรวมไฟล์-[ชื่อคุณ]`**

---

## Step 1: ตั้ง Schedule Trigger (3 นาที)

**Schedule** = "ตื่นมาทำงานตามเวลาที่กำหนด" — แทน webhook ที่รอ event

1. กลางหน้าจอ คลิก **`+ Add first step...`**
2. ค้นหา **`schedule`** → คลิก **`Schedule Trigger`**
3. ตั้งค่า:
   - **Trigger Interval:** `Custom (Cron)` หรือ `Every X Minutes`
   - **For workshop:** เลือก `Every 1 Minute` (เพื่อให้เห็นผลเร็ว — แต่ของจริงควรเป็น 15 นาที)
4. กด **Execute step** ทดสอบ — ควรได้ output `{ timestamp: ... }`

> 💡 **ของจริงควรเป็นทุกๆ 15 นาที** — เพราะถ้าทุก 1 นาที จะ ping Gmail บ่อยเกิน + เปลือง quota

---

## Step 2: ตั้ง Gmail OAuth2 Credential (10 นาที)

นี่คือส่วนที่ "ตั้งครั้งแรกใช้เวลา ครั้งต่อไปไม่ต้องทำใหม่"

### 2.1 สร้าง Gmail node

1. ที่ Schedule node กด **`+`**
2. ค้นหา **`Gmail`** → คลิก node `Gmail`
3. หน้าตั้งค่าเปิดขึ้น — ที่ช่อง **Credential to connect with** กด **`Create New Credential`**

### 2.2 ตั้ง OAuth Credential

n8n จะเปิด popup ขอข้อมูล OAuth (ใน Workshop เราใช้ shared credentials ของ สบค.)

**สำหรับ Workshop:**
TA จะแจก Client ID + Client Secret ที่ตั้งไว้แล้วใน Google Cloud Console:
- **OAuth Client ID:** `XXXX.apps.googleusercontent.com` (แจกในห้อง)
- **OAuth Client Secret:** `GOCSPX-XXXX` (แจกในห้อง)

1. ใส่ Client ID + Secret
2. กด **`Sign in with Google`**
3. popup ขึ้นให้เลือก Google account — เลือกของคุณ
4. หน้า permission แสดง — กด **Allow** (อนุญาต n8n อ่าน Gmail)
5. กลับมาที่ n8n — เห็น status **`Account connected`** สีเขียว
6. ตั้งชื่อ credential: **`Gmail - [ชื่อคุณ]`** → กด **Save**

✅ **เช็ค:** ที่ Gmail node ช่อง Credential เห็นชื่อ credential ของคุณ

---

## Step 3: ค้นหา Email (5 นาที)

ที่ Gmail node ตั้งค่าให้ค้นหา email ที่ตรงเงื่อนไข:

1. **Resource:** `Message`
2. **Operation:** `Get Many`
3. **Return All:** Off → **Limit:** `10`
4. **Filters** → คลิก **Add Filter**:
   - **Search:** `subject:[ส่งงาน] is:unread has:attachment`

> 💡 **Gmail search syntax** ทำงานเหมือนกับช่อง search ใน Gmail website
> - `subject:xxx` — ค้นจาก subject
> - `from:xxx@xxx` — ค้นจากผู้ส่ง
> - `is:unread` — ยังไม่อ่าน
> - `has:attachment` — มีไฟล์แนบ
> - `after:2026/05/26` — หลังวันที่นี้

5. **Simplify Output:** เปิด toggle (ให้ output ตัด field ที่ไม่จำเป็นออก)
6. กด **Execute step**

### ทดสอบกับ email จริง

1. เปิด Gmail ของคุณ (browser tab อื่น)
2. ส่ง email หาตัวเอง:
   - **Subject:** `[ส่งงาน] ทดสอบ workshop`
   - **Body:** อะไรก็ได้
   - **Attach:** ไฟล์ PDF เล็กๆ 1 ไฟล์ (ดู [sample-emails.md](sample-emails.md))
3. กลับมาที่ n8n → กด **Execute step** ที่ Gmail node อีกครั้ง
4. ดู output — ควรเห็น email ของคุณใน list:
   ```json
   {
     "id": "1234abcd...",
     "threadId": "...",
     "subject": "[ส่งงาน] ทดสอบ workshop",
     "from": "your@gmail.com",
     "attachments": [{ "id": "...", "filename": "test.pdf", ... }]
   }
   ```

✅ **เช็ค:** เห็น email ของคุณใน output + มี field `attachments`

---

## Step 4: เพิ่ม IF Node — กรอง email ที่มี attach (3 นาที)

1. ที่ Gmail node กด **`+`**
2. ค้นหา **`IF`** → คลิก node `IF`
3. ตั้งค่า:
   - **Condition 1:**
     - Left: `{{ $json.attachments.length }}` (Expression mode)
     - Operator: `is greater than`
     - Right: `0`
4. กด **Execute step**

> 💡 **ผลลัพธ์ IF node มี 2 output:**
> - **True branch** (ด้านบน) — กรณีเงื่อนไขจริง
> - **False branch** (ด้านล่าง) — กรณีเงื่อนไขเท็จ

5. ใน workshop นี้ เราใช้แค่ True branch (มี attach) — False branch จะปล่อยไว้

✅ **เช็ค:** email ที่มี attach ออกที่ True branch

---

## Step 5: ดึง Attachment ออกมา (5 นาที)

attachments ใน Gmail เป็น "reference" ไม่ใช่ "binary data" — ต้องดึงตัวไฟล์มาเพิ่มอีก step

1. ที่ IF node — ลาก connection จาก **True branch** (จุดบนขวา)
2. กด **`+`** → ค้นหา **`Gmail`** → เลือก node Gmail อีกตัว
3. ตั้งค่า:
   - **Resource:** `Message`
   - **Operation:** `Get`
   - **Message ID:** `{{ $json.id }}` (เอาจาก node ก่อนหน้า — expression)
   - **Options → Format:** `Resolved`
   - **Options → Download Attachments:** เปิด toggle ✅

4. กด **Execute step**
5. ดู output — ควรเห็น `binary` data ของไฟล์ attachment

✅ **เช็ค:** มี field `binary` ใน output + เห็นไฟล์ใน panel ขวา

---

## Step 6: ตั้ง Google Drive Credential (3 นาที)

คล้าย Gmail — ใช้ OAuth client เดียวกันได้

1. ที่ Gmail (Download) node กด **`+`**
2. ค้นหา **`Google Drive`** → คลิก
3. ที่ **Credential** กด **Create New** → เลือก **Sign in with Google**
4. ใช้ Google account เดียวกับ Gmail
5. ตั้งชื่อ: **`Drive - [ชื่อคุณ]`** → Save

> 💡 **ทำไม OAuth 2 ครั้ง?** เพราะ Gmail / Drive เป็น scope ต่างกัน — n8n บังคับแยก credential

---

## Step 7: อัพโหลดไฟล์เข้า Drive (5 นาที)

ที่ Drive node ตั้งค่า:

1. **Resource:** `File`
2. **Operation:** `Upload`
3. **Input Data Field Name:** `attachment_0` (ชื่อ field ใน binary data — เช็คจาก Gmail Download node)
4. **File Name:** `{{ $('Gmail').item.json.subject }}_{{ $json.binary.attachment_0.fileName }}`
   - หมายความว่า: เอา subject ของ email + ชื่อไฟล์เดิม
5. **Parents → Folder:** เลือกโฟลเดอร์ปลายทาง:
   - กด `Select from list` → เลือก folder ใน Drive ของคุณ
   - หรือสร้างใหม่ที่ Drive ก่อน เช่น `KU Workshop - งานที่รับ`

6. กด **Execute step**
7. เปิด Google Drive — ควรเห็นไฟล์เพิ่งอัพมา

✅ **เช็ค:** ไฟล์ขึ้นใน Drive ในโฟลเดอร์ที่กำหนด

---

## Step 8: Mark Email as Read + Label "Archived" (5 นาที)

หลังเก็บไฟล์แล้ว — บอก Gmail ว่า "อ่านแล้ว" + ใส่ label เพื่อไม่ให้ดึงซ้ำ

1. ที่ Drive node กด **`+`**
2. ค้นหา **`Gmail`** → เลือก node Gmail
3. ตั้งค่า:
   - **Resource:** `Message`
   - **Operation:** `Mark as Read` (หรือ `Add Label`)
   - **Message ID:** `{{ $('Gmail').item.json.id }}` (เอาจาก Gmail node แรก)
4. ถ้าใช้ Add Label:
   - **Label Names or IDs** → เลือก `Archived` (สร้างก่อนใน Gmail ถ้ายังไม่มี)

5. กด **Execute step**
6. เช็ค Gmail — email ของคุณควรกลายเป็น "อ่านแล้ว" (ตัวอักษรปกติ ไม่หนา)

✅ **เช็ค:** email ใน Gmail เปลี่ยนเป็น read + มี label Archived

---

## Step 9: ทดสอบ End-to-End + Activate (5 นาที)

### ทดสอบทั้ง flow

1. ส่ง email ใหม่หาตัวเอง — subject `[ส่งงาน] ทดสอบ end-to-end` + attach 1 ไฟล์
2. ที่ n8n กด **`Execute Workflow`** (มุมขวาบน)
3. ดูทุก node ขึ้นเขียวเรียง:
   - Schedule → Gmail (Get Many) → IF → Gmail (Download) → Drive → Gmail (Mark Read)
4. เช็ค Drive — มีไฟล์ใหม่
5. เช็ค Gmail — email เป็น read + Archived

### Activate workflow

1. Toggle **`Inactive`** → **`Active`** (มุมขวาบน)
2. ตั้งแต่นี้ — ทุก 1 นาที (หรือเลขที่ตั้งไว้) workflow จะทำงานเอง
3. ลองส่ง email ใหม่ — รอ 1 นาที — เช็ค Drive

✅ **เช็ค:** Workflow Active + ส่ง email ใหม่ → ไฟล์ขึ้น Drive อัตโนมัติภายใน 1 นาที

---

## Checklist ก่อนจบ Workshop 2

- [ ] สร้าง Gmail + Drive credentials (OAuth)
- [ ] Schedule trigger ทำงาน
- [ ] Gmail Get Many — ค้น email ตาม subject
- [ ] IF node กรอง email ที่มี attach
- [ ] Gmail Get + Download attachment
- [ ] Drive Upload สำเร็จ
- [ ] Mark email as Read
- [ ] Activate workflow + ทดสอบ end-to-end

**ครบทุกข้อ = สำเร็จ Workshop 2** 🎉

---

## คิดต่อ — ปรับใช้กับงานคุณ

ลองนึก — งานของคุณมี email pattern ไหนที่ใช้ได้?

| งาน | subject filter | folder Drive |
|-----|---------------|--------------|
| รับใบเสร็จ vendor | `from:vendor@xxx is:unread has:attachment` | `บัญชี/2026/[เดือน]` |
| รับ CV ผู้สมัคร | `subject:[สมัคร]` | `HR/รับสมัคร/2026` |
| รับ report | `from:manager@xxx subject:report` | `รายงาน/รายเดือน` |
| รับงานนิสิต | `subject:[ส่งงาน Course101]` | `Course101/[ส่วนใน]` |

---

## ถัดไป

- พักเที่ยง / สรุปวัน 1
- **วันที่ 2 Session 3:** Logic & Conditions — เพิ่ม branching ซับซ้อนขึ้น
- **Workshop 3:** [อวยพรวันเกิด](../W3_Birthday/README.md)
