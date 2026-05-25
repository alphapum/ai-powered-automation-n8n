# Workshop 3: อวยพรวันเกิดบุคลากร — คู่มือทีละคลิก

> **เวลา:** 75 นาที | **Pattern:** Schedule + ตาราง + IF
> ใช้ workshop 1 + 2 เป็นพื้นฐาน — เร็วกว่าเพราะรู้จัก n8n + OAuth แล้ว

---

## Step 0: เตรียม Google Sheet "staff" (5 นาที)

ก่อนเริ่ม n8n เราต้องมีตาราง "บุคลากร" ก่อน — เพราะ workflow จะอ่านจากที่นี่

### 0.1 Copy template

1. เปิด link ที่ TA ให้: **`https://docs.google.com/spreadsheets/d/.../template-staff`**
2. กด **File → Make a copy** → ตั้งชื่อใหม่: **`staff-[ชื่อคุณ]`**
3. เก็บใน Drive ของคุณ

### 0.2 ใส่ข้อมูลทดสอบ

ใน sheet `staff` (sheet แรก) จะมี header แล้ว:

| name | nickname | email | birthday | department | line_user_id |
|------|----------|-------|----------|------------|--------------|

ใส่ข้อมูล 3-5 คน — ดู [sample-data.md](sample-data.md) สำหรับตัวอย่าง

> ⚠️ **สำคัญมาก:** column `birthday` ต้องเป็น format **`MM-DD`** เช่น `05-27` (ไม่ต้องมีปี เพราะเราเช็คแค่ "วันนี้ใช่วันเกิดมั้ย" ไม่สนใจอายุ)

### 0.3 ใส่คน 1 คนให้เกิด "วันนี้"

เพื่อให้ทดสอบเห็นผล — เปลี่ยน `birthday` ของคน 1 คนให้เป็น **วันที่วันนี้** ในรูปแบบ `MM-DD`

ตัวอย่าง: ถ้าวันนี้คือ 27 พฤษภาคม 2026 → ใส่ `05-27` ใน row ใดrow หนึ่ง

✅ **เช็ค:** Sheet มี 3-5 row + อย่างน้อย 1 คนมี birthday = วันนี้

---

## Step 1: สร้าง Workflow ใหม่ (1 นาที)

1. ที่ n8n หน้า Workflows → **`+ Add workflow`**
2. ตั้งชื่อ: **`W3-อวยพรวันเกิด-[ชื่อคุณ]`**

---

## Step 2: ตั้ง Schedule Trigger แบบ Cron (5 นาที)

**Schedule** จะ "ตื่นมาทำงาน" ทุกวันเวลา 9:00 น.

1. กลางหน้าจอ คลิก **`+ Add first step...`**
2. ค้นหา **`schedule`** → คลิก **`Schedule Trigger`**
3. ตั้งค่า:
   - **Trigger Interval:** เลือก `Custom (Cron)`
   - **Expression:** `0 9 * * *`
   - แปลว่า: นาทีที่ 0 ของชั่วโมงที่ 9 ทุกวัน ทุกเดือน ทุก day-of-week

> 💡 **Cron 5 ส่วน:** `นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์`
> - `0 9 * * *` = ทุกวัน 9:00
> - `0 9 * * 1-5` = จันทร์–ศุกร์ 9:00
> - `30 8 1 * *` = วันที่ 1 ของทุกเดือน 8:30

4. **สำหรับ workshop:** เพื่อทดสอบเร็วๆ ไม่ต้องรอ 9 โมง — เราจะใช้ปุ่ม **`Execute Workflow`** กดเองทดสอบ ก่อน Activate

✅ **เช็ค:** Schedule node ตั้ง Cron `0 9 * * *` แล้ว

---

## Step 3: ตั้ง Google Sheets OAuth Credential (8 นาที)

ถ้าทำ Workshop 2 มาแล้ว — process จะคล้ายกัน แต่ต้องสร้าง credential ใหม่สำหรับ Sheets (scope ต่างกับ Gmail/Drive)

### 3.1 เพิ่ม Google Sheets node

1. ที่ Schedule node กด **`+`** (จุดสีเทาขวาของ node)
2. ค้นหา **`Google Sheets`** → คลิก node `Google Sheets`
3. หน้าตั้งค่าเปิด — ที่ **Credential to connect with** กด **`Create New Credential`**

### 3.2 ตั้ง OAuth Credential

TA จะแจก OAuth Client ID + Secret (เดียวกับ W2)

1. ใส่ Client ID + Secret
2. กด **`Sign in with Google`**
3. popup ขึ้น → เลือก Google account ของคุณ (ที่มี Sheet)
4. หน้า permission — กด **Allow** (อนุญาต n8n อ่าน Sheets)
5. กลับมาที่ n8n → status **`Account connected`** สีเขียว
6. ตั้งชื่อ credential: **`Sheets - [ชื่อคุณ]`** → **Save**

> 💡 **ใช้ Google account เดียวกับ Drive ใน W2 ได้** — แต่ credential จะแยกตัว เพราะ scope `spreadsheets` ต่างกับ `drive`

✅ **เช็ค:** ช่อง Credential ของ Sheets node แสดงชื่อ `Sheets - [ชื่อคุณ]`

---

## Step 4: อ่านตาราง staff (5 นาที)

ที่ Google Sheets node ตั้งค่าให้อ่านตาราง:

1. **Resource:** `Sheet Within Document`
2. **Operation:** `Get Row(s) in Sheet`
3. **Document:** กด `From list` → เลือก sheet `staff-[ชื่อคุณ]` ที่ copy มา (Step 0)
4. **Sheet:** เลือก sheet ตัวแรก (ปกติชื่อ `staff` หรือ `Sheet1`)
5. **Return All:** เปิด toggle (จะอ่านทุก row)

6. กด **Execute step**
7. ดู output ทางขวา — ควรเห็น row ทั้งหมด:

```json
[
  {
    "name": "สมชาย ใจดี",
    "nickname": "ชาย",
    "email": "somchai@ku.ac.th",
    "birthday": "05-27",
    "department": "ฝ่ายพัสดุ",
    "line_user_id": "Uxxxxxxxx"
  },
  {
    "name": "สมหญิง รักดี",
    "nickname": "หญิง",
    "email": "somying@ku.ac.th",
    "birthday": "11-15",
    ...
  },
  ...
]
```

✅ **เช็ค:** เห็นทุก row จาก sheet ใน output (1 item ต่อ 1 row)

> ⚠️ **ถ้าได้ output แค่ 1 item ที่เป็น array:** เปิด toggle **Return All** หรือเช็คว่าใช้ `Get Row(s)` (มี `s`) ไม่ใช่ `Get Row`

---

## Step 5: เพิ่ม IF Node — เทียบวันเกิด (10 นาที)

นี่คือ "หัวใจของ workshop" — เราจะเทียบ column `birthday` กับวันที่วันนี้

### 5.1 เพิ่ม IF node

1. ที่ Sheets node กด **`+`**
2. ค้นหา **`IF`** → คลิก node `IF`

### 5.2 เขียน Condition

ใน IF node เพิ่ม condition 1 อัน:

- คลิก **`Add Condition`** → เลือก type **`String`**
- **Value 1 (Left):** ใส่ expression — กด icon `fx` ก่อน แล้วใส่:
  ```
  {{ $json.birthday }}
  ```
- **Operator:** `is equal to`
- **Value 2 (Right):** ใส่ expression:
  ```
  {{ $now.toFormat('MM-dd') }}
  ```

> 💡 **`$now`** = วันที่/เวลาปัจจุบัน (n8n built-in)
> **`.toFormat('MM-dd')`** = แปลงเป็น format `เดือน-วัน` เช่น `05-27`
> เปรียบเทียบกับ column `birthday` ที่เก็บไว้ format เดียวกัน

### 5.3 ทดสอบ

1. กด **Execute step**
2. ดู output:
   - **True branch (ด้านบน):** จะมีเฉพาะ row ที่ `birthday` ตรงกับวันนี้
   - **False branch (ด้านล่าง):** row ที่ไม่ตรง (ใน workshop ไม่ใช้ branch นี้)

3. ถ้าวันนี้คือ 27 พ.ค. และคุณตั้งให้คน 1 คนมี `birthday = "05-27"`:
   - True branch จะมี 1 item (คนคนนั้น)
   - False branch จะมี items ที่เหลือ

✅ **เช็ค:** True branch มีอย่างน้อย 1 item (คนที่เกิดวันนี้)

> ⚠️ **ถ้า True branch ว่าง แม้มีคนเกิดวันนี้:**
> - เช็คว่า `birthday` ใน sheet เป็น format `MM-DD` (เช่น `05-27` ไม่ใช่ `5-27` หรือ `2026-05-27`)
> - ใน sheet ลองพิมพ์ `'05-27` (มี ' นำหน้า) เพื่อบังคับให้เป็น string ไม่ใช่ date

---

## Step 6: Loop Over Items — วนทุกคนที่เกิดวันนี้ (5 นาที)

ถ้ามีคนเกิดวันเดียวกันหลายคน — เราต้องส่ง LINE แยกข้อความให้ทุกคน

1. ที่ IF node ลาก connection จาก **True branch** (จุดบนขวา)
2. กด **`+`** → ค้นหา **`Loop Over Items`** → คลิก node `Loop Over Items` (หรือ `Split In Batches`)
3. ตั้งค่า:
   - **Batch Size:** `1` (ส่งทีละคน)

> 💡 **ทำไมต้อง Loop?** เพราะ HTTP Request node ที่ตามมา จะรัน 1 ครั้งต่อ 1 item — Loop ทำให้ส่ง LINE 1 ครั้งต่อ 1 คน อย่างปลอดภัย และเห็น log แยกต่อคน

> 💡 **จริงๆ ในเคสง่ายๆ ไม่ต้อง Loop ก็ได้** — เพราะ n8n รัน node ต่อ item อยู่แล้ว แต่ใส่ Loop ไว้ดีกว่า เพราะ:
> - จัดการ error ได้ทีละคน (ถ้าคนที่ 2 ส่งไม่สำเร็จ คนที่ 1 + 3 ยังได้รับ)
> - เพิ่ม delay ระหว่างคนได้ (กัน rate limit)

4. กด **Execute step** — ดู output (จะเหมือน True branch แต่วน 1 item per batch)

✅ **เช็ค:** Loop node เห็นจำนวน item เท่ากับ True branch

---

## Step 7: เพิ่ม HTTP Request (LINE Notify) — ส่งข้อความ (10 นาที)

ใช้วิธีเดียวกับ Workshop 1 — HTTP Request ส่ง LINE Notify

### 7.1 ถ้ายังไม่มี LINE Notify credential

ใช้ของเดิมจาก W1 ได้เลย (ถ้าทำเก็บไว้)
ถ้าไม่มี — สร้างใหม่:
- **Header Name:** `Authorization`
- **Header Value:** `Bearer XXXXX` (token จาก TA)

### 7.2 เพิ่ม HTTP Request node

1. ที่ Loop node ลาก connection จาก **`loop`** branch (จุดบน — ที่วนกลับมาแต่ละ item)
2. กด **`+`** → ค้นหา **`HTTP Request`** → คลิก
3. ตั้งค่า:
   - **Method:** `POST`
   - **URL:** `https://notify-api.line.me/api/notify`
   - **Authentication:** `Generic Credential Type` → `Header Auth`
     - เลือก credential `LINE Notify - KU Workshop` (จาก W1) หรือสร้างใหม่
   - **Send Body:** เปิด toggle
   - **Body Content Type:** `Form-Urlencoded`
   - **Body Parameters** → เพิ่ม 1 field:
     - **Name:** `message`
     - **Value:** ใส่ expression (กด `fx`):
     ```
     🎉 สุขสันต์วันเกิดคุณ {{ $json.nickname }}!
     ขออวยพรให้มีความสุข สุขภาพแข็งแรง 🎂

     จาก: ทีม {{ $json.department }}
     ```

> 💡 **`$json.nickname` / `$json.department`** = ดึงจาก row ของ Sheet (ผ่าน Loop)

### 7.3 ต่อ Loop กลับ

1. หลัง HTTP Request node — ต้องเชื่อมกลับมาที่ Loop node เพื่อให้วน item ถัดไป
2. ลาก connection จาก HTTP Request → กลับเข้า Loop Over Items node (input)

> 💡 **Loop Over Items มี 2 output:**
> - **loop** (ออกเพื่อทำงานในแต่ละ batch)
> - **done** (เมื่อวนครบทุก item)
>
> และ 1 input (รับกลับมาจาก batch ที่ทำเสร็จ)

ถ้า workshop ไม่ใช้ Loop — ก็ต่อ HTTP Request ตรงจาก IF True branch ได้เลย (เรียบง่ายกว่า)

✅ **เช็ค:** HTTP Request ตั้งค่าครบ — ดู preview value ของ message มีชื่อ nickname จริง

---

## Step 8: ทดสอบ End-to-End (5 นาที)

1. กดปุ่ม **`Execute Workflow`** (มุมขวาบน — สีแดง)
2. ดู workflow ไหลผ่านทุก node:
   - Schedule → Sheets → IF → Loop → HTTP Request
3. ทุก node ขึ้นเขียว = สำเร็จ
4. **เช็ค LINE กลุ่ม** — ภายใน 2-3 วินาที จะมีข้อความ:
   ```
   🎉 สุขสันต์วันเกิดคุณ ชาย!
   ขออวยพรให้มีความสุข สุขภาพแข็งแรง 🎂

   จาก: ทีม ฝ่ายพัสดุ
   ```

5. ถ้าใส่หลายคนเกิดวันเดียวกัน — จะได้หลายข้อความใน LINE

🎉 **เสร็จแล้ว!** workflow ส่งอวยพรวันเกิดอัตโนมัติทำงานจริง

✅ **เช็ค:** เห็นข้อความใน LINE กลุ่ม ครบทุกคนที่เกิดวันนี้

---

## Step 9: Activate Workflow (ทำให้ทำงานทุกวัน 9 โมง) (3 นาที)

1. มุมขวาบน toggle **`Inactive`** (สีเทา) → คลิก → **`Active`** (สีเขียว)
2. ตั้งแต่นี้ — ทุกวัน 9:00 เช้า n8n จะรัน workflow นี้เองอัตโนมัติ
3. ไม่ต้องกด Execute เอง อีกแล้ว

> 💡 **ทดสอบว่า Active ทำงานจริงไหม?**
> - ที่ Schedule node แก้ชั่วคราวเป็น `*/2 * * * *` (ทุก 2 นาที)
> - รอ 2 นาที — ดู Executions tab ทางซ้าย จะมี execution ใหม่
> - หลังทดสอบเสร็จ — เปลี่ยนกลับเป็น `0 9 * * *`

✅ **เช็ค:** Toggle เป็น Active สีเขียว + Executions tab มี run

---

## Checklist ก่อนจบ Workshop 3

- [ ] เตรียม Google Sheet `staff` พร้อมข้อมูล 3-5 คน
- [ ] Schedule Trigger ตั้ง Cron `0 9 * * *`
- [ ] Google Sheets credential (OAuth) สร้างสำเร็จ
- [ ] Sheets node อ่านตารางออกมาเป็น list ได้
- [ ] IF node เทียบ `birthday` กับ `$now.toFormat('MM-dd')` ได้
- [ ] Loop Over Items วนทุกคนที่เกิดวันนี้
- [ ] LINE ได้รับข้อความ personalized
- [ ] Activate workflow

**ครบทุกข้อ = สำเร็จ Workshop 3** 🎉

---

## คิดต่อ — ปรับใช้กับงานคุณ

ลองนึก — งานคุณมี "ตาราง + เวลา" pattern ไหนใช้ได้?

| งาน | column ใน sheet | Schedule | Action |
|-----|-----------------|----------|--------|
| เตือนต่อสัญญา 30 วัน | `contract_expire` | ทุกวัน 9:00 | email หัวหน้า |
| สรุปยอดทุกสิ้นเดือน | sheet ยอดขาย | วันที่ 25, 9:00 | email ผู้บริหาร |
| แจ้งเวียน agenda ประจำสัปดาห์ | sheet meeting | จันทร์ 8:00 | LINE กลุ่ม |
| เตือนวันครบเกษียณ | `retire_date` | ทุกเช้า | HR system |
| เตือนวันต่อบัตร KU | `id_expire` | ทุกเช้า | email บุคคล |

---

## ถัดไป

- พัก 10 นาที
- **Session 4:** Logic & Conditions เชิงลึก
- **Workshop 4** (ในช่วงบ่าย — ดู course plan)

## ถ้าเจอปัญหา

ดู [troubleshooting.md](troubleshooting.md) หรือถามใน LINE กลุ่ม
