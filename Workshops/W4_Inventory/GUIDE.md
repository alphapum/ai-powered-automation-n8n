# Workshop 4: เฝ้าระวังสต๊อก/พัสดุ — คู่มือทีละคลิก

> **เวลา:** 60 นาที | **Pattern:** เช็คเงื่อนไข → แจ้ง
> ใช้ความรู้จาก W1 (LINE) + W2 (OAuth, IF) — จะเร็วกว่าเดิม

---

## Step 0: เตรียม Google Sheet (3 นาที)

ก่อนสร้าง workflow ต้องมี "ฐานข้อมูลสต็อก" ใน Google Sheets ก่อน

### 0.1 Copy template ที่ TA แจก

1. TA จะ share link template ในห้อง — ตัวอย่าง: `https://docs.google.com/spreadsheets/d/XXXX/copy`
2. กด **`Make a copy`** → เก็บใน Drive ตัวเอง
3. ตั้งชื่อ: **`KU Workshop W4 - สต๊อกของฉัน - [ชื่อคุณ]`**

### 0.2 เช็คโครงสร้าง sheet

Sheet มี 8 columns (รายละเอียดดู [sample-data.md](sample-data.md)):

| item | sku | qty | min_qty | unit | responsible | line_token | last_updated |
|---|---|---|---|---|---|---|---|
| กระดาษ A4 80 แกรม | PA-A4-80 | 25 | 50 | รีม | น.ส.มาลี | XXXXX | 2026-05-26 |
| หมึกพิมพ์ HP 88A ดำ | INK-HP88A | 8 | 5 | ตลับ | นายสมชาย | XXXXX | 2026-05-26 |
| ลวดเย็บกระดาษ #10 | ST-10 | 30 | 20 | กล่อง | น.ส.มาลี | XXXXX | 2026-05-26 |
| ผงหมึก Brother TN-261 | TONER-261 | 2 | 5 | ตลับ | นายสมชาย | XXXXX | 2026-05-26 |

> 💡 **ของจริง:** `line_token` ใน Workshop ใช้ token รวมของห้อง (TA แจกใน W1) — ทุก row ใส่ token เดียวกันได้

✅ **เช็ค:** เปิด sheet เห็นข้อมูลครบ 4 row + 8 column

### 0.3 จด Sheet URL ไว้

Copy URL ของ sheet (จาก browser address bar) — จะใช้ตอนตั้งค่า Google Sheets node

ตัวอย่าง: `https://docs.google.com/spreadsheets/d/1aBcDeFgHiJk.../edit#gid=0`

---

## Step 1: สร้าง Workflow ใหม่ (1 นาที)

1. ที่ n8n หน้า Workflows → **`+ Add workflow`**
2. ตั้งชื่อ: **`W4-เฝ้าระวังสต๊อก-[ชื่อคุณ]`**

---

## Step 2: ตั้ง Schedule Trigger (5 นาที)

**Schedule** = "ตื่นมาทำงานตามเวลา" — เหมือน W2 แต่ครั้งนี้ใช้ Cron expression

### 2.1 เพิ่ม node

1. กลางหน้าจอ คลิก **`+ Add first step...`**
2. ค้นหา **`schedule`** → คลิก **`Schedule Trigger`**

### 2.2 ตั้งค่า (สำหรับ production)

- **Trigger Rules:** เพิ่ม Rule 1
- **Trigger Interval:** เลือก `Custom (Cron)`
- **Expression:** `0 8-17 * * 1-5`
  - หมายความว่า: นาทีที่ 0 ของชั่วโมงที่ 8–17 ทุกวัน จันทร์–ศุกร์
  - = ทำงาน 8:00, 9:00, ..., 17:00 ในวันทำการ

### 2.3 ตั้งค่า (สำหรับ workshop — เร็วกว่า)

ในห้อง workshop ไม่ต้องรอเป็นชั่วโมง — ใช้ค่านี้ก่อนเพื่อทดสอบ:

- **Trigger Interval:** `Every X Minutes`
- **Minutes Between Triggers:** `1`

> ⚠️ **อย่าลืมเปลี่ยนกลับเป็น Cron** ก่อน activate จริง — ไม่งั้น workflow จะ ping Sheets ทุกนาทีตลอด 24 ชม.

### 2.4 ทดสอบ

กด **Execute step** → ควรได้ output `{ timestamp: "..." }` ทันที

✅ **เช็ค:** Schedule node ขึ้นเขียว + เห็น output

---

## Step 3: เพิ่ม Google Sheets Node (10 นาที)

### 3.1 ตั้ง credential (ถ้ายังไม่มี)

1. ที่ Schedule node กด **`+`**
2. ค้นหา **`Google Sheets`** → คลิก node `Google Sheets`
3. ที่ช่อง **Credential to connect with**:
   - ถ้าทำ W2 ไว้แล้ว → เลือก credential เดิม (อาจชื่อ `Google - [ชื่อคุณ]`)
   - ถ้ายังไม่มี → กด **Create New** → Sign in with Google → Allow permission → ตั้งชื่อ `Google Sheets - [ชื่อคุณ]` → Save

> 💡 **OAuth scope:** ถ้าใช้ credential เก่าของ Gmail/Drive อาจต้อง re-authorize เพิ่ม scope ของ Sheets — ตามที่ Google บอก

✅ **เช็ค:** credential เป็นสีเขียว Connected

### 3.2 ตั้งค่า Read Rows

ที่ Google Sheets node ตั้งค่า:

1. **Resource:** `Sheet Within Document`
2. **Operation:** `Get Row(s) in Sheet`
3. **Document:**
   - กดเลือก `By URL` หรือ `From List`
   - วาง URL ของ sheet จาก Step 0.3
4. **Sheet:** เลือก sheet ชื่อ `inventory` (หรือ `Sheet1` ถ้าไม่ได้เปลี่ยนชื่อ)
5. **Filters:** เว้นว่าง (อ่านทุก row)
6. **Combine Filters:** AND (default)
7. **Options → Range:** เว้นว่าง (อ่านทั้งหมด)

8. กด **Execute step**

### 3.3 ดู output

ที่ panel ขวา ควรเห็น output เป็น array — แต่ละ item คือ 1 row:

```json
[
  {
    "item": "กระดาษ A4 80 แกรม",
    "sku": "PA-A4-80",
    "qty": 25,
    "min_qty": 50,
    "unit": "รีม",
    "responsible": "น.ส.มาลี",
    "line_token": "XXXXX",
    "last_updated": "2026-05-26"
  },
  { "item": "หมึกพิมพ์ HP 88A ดำ", ... },
  ...
]
```

> 💡 **ค่าตัวเลข (qty, min_qty)** บางทีมาเป็น string `"25"` แทน `25` — ปกติ เราจะ cast ใน IF node

✅ **เช็ค:** เห็น 4 items (ถ้าใช้ sample-data) + field ครบ 8 field

---

## Step 4: เพิ่ม IF Node — เช็คว่าต่ำกว่าจุดสั่งซื้อ (8 นาที)

นี่คือใจกลางของ workflow — ตรวจว่า `qty < min_qty` ของแต่ละ row

### 4.1 เพิ่ม node

1. ที่ Sheets node กด **`+`**
2. ค้นหา **`IF`** → คลิก node `IF`

### 4.2 ตั้ง Condition

1. ในหน้าตั้งค่า IF → ที่ **Conditions** กด **Add Condition**
2. ตั้งค่า:
   - **Type ของ value:** เลือก `Number`
   - **Value 1 (Left):** คลิกไอคอน **fx** → ใส่ expression:
     ```
     {{ Number($json.qty) }}
     ```
   - **Operator:** `is less than (<)`
   - **Value 2 (Right):** คลิก **fx** → ใส่:
     ```
     {{ Number($json.min_qty) }}
     ```

> 💡 **ทำไมต้อง `Number(...)`?** Google Sheets อาจคืนตัวเลขมาเป็น string (`"25"` แทน `25`) — `Number()` แปลงให้ชัวร์ก่อนเปรียบเทียบ ไม่งั้น `"25" < "50"` จะเทียบเป็น "ตามตัวอักษร" ไม่ใช่ "ตามตัวเลข"

3. **Combine Conditions:** AND (default — ใช้แค่ 1 condition พอ)
4. กด **Execute step**

### 4.3 ดูผล

IF node มี 2 output ที่ panel ขวา:
- **True branch (output 0)** — rows ที่ `qty < min_qty` (ต้องแจ้ง)
- **False branch (output 1)** — rows ที่ `qty >= min_qty` (ไม่ต้องทำอะไร)

จาก sample data 4 rows:
- กระดาษ A4 (25 < 50) → **True**
- หมึก HP 88A (8 < 5? **ไม่** เพราะ 8 > 5) → False
- ลวดเย็บ (30 < 20? ไม่) → False
- ผงหมึก Brother (2 < 5) → **True**

ดังนั้นจะมี 2 items ใน True branch

> ⚠️ **ถ้าทุก row ไปอยู่ False:** ตัวเลข qty/min_qty อาจเป็น string — เช็คว่าใช้ `Number(...)` ครอบหรือยัง

✅ **เช็ค:** True branch มี 2 items (กระดาษ A4 + ผงหมึก) — False branch มี 2 items (หมึก HP + ลวดเย็บ)

---

## Step 5: เพิ่ม Loop Over Items (3 นาที)

ตอนนี้ True branch มี 2 items — เราต้องส่ง LINE ทีละรายการ

> 💡 **เกร็ดเล็กๆ:** จริงๆ HTTP Request node จะ loop เอง 1 ครั้ง/item อยู่แล้ว — แต่ใส่ **Loop Over Items** ชัดๆ ให้ workflow อ่านง่ายขึ้น (เห็นว่า "loop ทำ 2 รอบ")

1. ที่ IF node — ลาก connection จาก **output ด้านบน (True branch)**
2. กด **`+`** → ค้นหา **`Loop Over Items`** → คลิก
3. ตั้งค่า:
   - **Batch Size:** `1` (ทำทีละรายการ)
   - **Options:** เว้นว่าง

4. กด **Execute step**
5. ดู output — Loop จะส่งทีละ item ต่อรอบ

> 💡 **ทำไมแยกเป็น Loop ไม่ใช้ HTTP Request ตรงๆ?**
> - ถ้ามีรายการเยอะมาก (เช่น 50 รายการ) → ส่ง 50 ข้อความ LINE พร้อมๆ กัน อาจติด rate limit
> - Loop + Batch Size 1 + (advance: Wait node) จะช่วย "ทยอยส่ง" — แต่ใน workshop ใช้ default พอ

✅ **เช็ค:** Loop node เห็นว่าจะ loop ทั้งหมดเท่ากับจำนวน row ใน True branch

---

## Step 6: เพิ่ม HTTP Request (LINE Notify) (10 นาที)

ส่งข้อความ LINE — เหมือน W1 แต่ครั้งนี้ message มาจาก Sheet row

### 6.1 ตรวจ credential LINE Notify

ถ้าทำ W1 ไว้แล้ว → มี credential `LINE Notify - KU Workshop` ในระบบอยู่แล้ว — ใช้ของเดิมได้

ถ้ายังไม่มี:
- Header Name: `Authorization`
- Header Value: `Bearer XXXXX` (token จาก TA)
- Save ชื่อ `LINE Notify - KU Workshop`

### 6.2 เพิ่ม HTTP Request node

1. ที่ Loop Over Items node — ลาก connection จาก **Done (ด้านล่าง)** ของ Loop output แรก (เรียก "Iteration output")
   - หรือพูดง่ายๆ: ต่อ "ขาที่ออกจาก loop ไปทำงานแต่ละรอบ"
2. กด **`+`** → ค้นหา **`HTTP Request`** → คลิก

### 6.3 ตั้งค่า HTTP Request

| ช่อง | ค่า |
|---|---|
| **Method** | `POST` |
| **URL** | `https://notify-api.line.me/api/notify` |
| **Authentication** | `Generic Credential Type` |
| **Generic Auth Type** | `Header Auth` |
| **Credential** | เลือก `LINE Notify - KU Workshop` |
| **Send Body** | ✅ เปิด toggle |
| **Body Content Type** | `Form-Urlencoded` |

### 6.4 ใส่ Body Parameter (ข้อความ)

ที่ **Body Parameters** → กด **Add Parameter** เพิ่ม 1 field:

- **Name:** `message`
- **Value:** (เปลี่ยนเป็น Expression mode ก่อน — คลิกไอคอน **fx**) ใส่:

```
=
🚨 สต๊อกใกล้หมด!
รายการ: {{ $json.item }}
คงเหลือ: {{ $json.qty }} {{ $json.unit }} (จุดสั่ง: {{ $json.min_qty }})
ผู้รับผิดชอบ: {{ $json.responsible }}
SKU: {{ $json.sku }}
```

> 💡 **`=` ตัวแรก** = สัญลักษณ์ของ n8n บอกว่า "ค่านี้คือ Expression" (n8n ใส่ให้อัตโนมัติเมื่อกด fx)

✅ **เช็ค:** ตั้งค่าครบทุกช่อง — Body มี 1 parameter ชื่อ `message`

### 6.5 ทดสอบ

1. กด **Execute step**
2. ดู panel ขวา — ถ้าได้ response `{ "status": 200, "message": "ok" }` = ส่งสำเร็จ
3. **เช็ค LINE กลุ่ม** — ภายใน 2-3 วินาที จะเห็น 2 ข้อความ:

```
🚨 สต๊อกใกล้หมด!
รายการ: กระดาษ A4 80 แกรม
คงเหลือ: 25 รีม (จุดสั่ง: 50)
ผู้รับผิดชอบ: น.ส.มาลี
SKU: PA-A4-80
```

```
🚨 สต๊อกใกล้หมด!
รายการ: ผงหมึก Brother TN-261
คงเหลือ: 2 ตลับ (จุดสั่ง: 5)
ผู้รับผิดชอบ: นายสมชาย
SKU: TONER-261
```

🎉 **เสร็จ Step หลักแล้ว!**

✅ **เช็ค:** ได้ข้อความ LINE 2 ข้อความตรงตาม sample data

---

## Step 7: ทดสอบ End-to-End (5 นาที)

### 7.1 แก้ค่าใน Sheet แล้วลองใหม่

1. เปิด Google Sheet ของคุณ
2. แก้ค่า `qty` ของ row ที่ 2 (หมึกพิมพ์ HP 88A) จาก `8` → `3`
3. กลับมาที่ n8n → กด **Execute Workflow** (มุมขวาบน — สีแดง)
4. เช็ค LINE — ตอนนี้ควรได้ 3 ข้อความ (เพิ่ม row หมึกพิมพ์ HP 88A เข้ามา)

### 7.2 แก้ค่าให้ทุก row เกิน min_qty

1. แก้ qty ของทุก row ให้ > min_qty (เช่น qty = 100 หมด)
2. Execute Workflow ใหม่
3. **ไม่ควรมีข้อความใน LINE** — เพราะ IF เป็น False หมด

✅ **เช็ค:** ทั้ง 2 case ทำงานถูกต้อง

---

## Step 8: Activate Workflow (2 นาที)

1. **กลับไปเปลี่ยน Schedule Trigger** เป็น Cron `0 8-17 * * 1-5` (Step 2.2)
   - **อย่าลืม!** ไม่งั้นจะรันทุกนาที ตลอด 24 ชม.
2. ที่มุมขวาบน toggle **`Inactive`** → **`Active`** (สีเขียว)
3. workflow จะเริ่มทำงานเองในชั่วโมงถัดไป

> 💡 **อยากเช็คให้ชัวร์:** เปิด tab **Executions** ทางซ้ายของ Workflow editor — รอชั่วโมงถัดไป จะมี execution ใหม่ขึ้นมา

✅ **เช็ค:** workflow Active + Schedule เป็น Cron `0 8-17 * * 1-5`

---

## Step 9: (Advanced) ป้องกัน Spam ด้วย `last_alerted` (5 นาที — เลือกทำ)

> ⚠️ **ปัญหา:** ถ้าใครยังไม่ไปสั่งกระดาษเพิ่ม → ทุกชั่วโมง LINE จะแจ้ง "กระดาษใกล้หมด" ซ้ำๆ → คนรับ ignore ในที่สุด

วิธีแก้ — เพิ่มคอลัมน์ `last_alerted` ใน Sheet แล้วเช็คว่า "เคยแจ้งใน 24 ชม. ที่ผ่านมาหรือยัง"

### แนวคิด

1. เพิ่มคอลัมน์ใหม่ใน Sheet: **`last_alerted`** (date)
2. ปรับ IF condition เป็น 2 ข้อ (AND):
   - `Number($json.qty) < Number($json.min_qty)` (ของเดิม)
   - **AND** `last_alerted ว่าง OR last_alerted เก่ากว่า 24 ชม.`
3. หลัง LINE ส่งแล้ว → เพิ่ม **Google Sheets: Update Row** node ที่เขียน `last_alerted = now()` กลับเข้า sheet ของ row นั้น

### Implementation (อ่านสำหรับใครอยากลอง)

ที่ IF node เพิ่ม condition ข้อ 2:
```
{{ !$json.last_alerted || (DateTime.now().diff(DateTime.fromISO($json.last_alerted), 'hours').hours > 24) }}
```
(ใช้ `operator: equal` กับ value `true`)

หลัง HTTP Request เพิ่ม Google Sheets node:
- Operation: `Update Row`
- Match Column: `sku`
- Value to Update — `last_alerted`: `={{ $now.toISO() }}`

> 💡 **ของ workshop:** ไม่บังคับทำ Step 9 — แต่ของจริงควรมี เพราะไม่งั้น "alert fatigue" จะทำให้ทุกคน mute LINE

---

## Checklist ก่อนจบ Workshop 4

- [ ] Copy Google Sheet template + ตั้งชื่อตัวเอง
- [ ] สร้าง n8n workflow + ตั้งชื่อ
- [ ] Schedule Trigger — ตั้งทั้ง dev (1 นาที) และ production (cron)
- [ ] Google Sheets node อ่าน row ออกมาเป็น array
- [ ] IF node เปรียบเทียบ `Number(qty) < Number(min_qty)` แยก true/false ได้
- [ ] Loop Over Items + HTTP Request (LINE Notify) ส่งข้อความสำเร็จ
- [ ] ทดสอบ end-to-end อย่างน้อย 2 case (มี alert / ไม่มี alert)
- [ ] Activate workflow + Schedule กลับเป็น Cron `0 8-17 * * 1-5`

**ครบทุกข้อ = สำเร็จ Workshop 4** 🎉

---

## คิดต่อ — ปรับใช้กับงานคุณ

ลองนึก — งานของคุณมีตัวเลขอะไรที่ต้องเฝ้าดูบ้าง?

| งาน | column ใน Sheet | เงื่อนไข | แจ้งใคร |
|-----|------------|-----------|---------|
| งบประมาณโครงการ | `used / budget` | `used / budget > 0.8` | ผู้จัดการโครงการ |
| คำร้องค้าง | `days_pending` | `> 3` | หัวหน้า |
| ลูกหนี้ค้างจ่าย | `days_overdue` | `> 30` | บัญชี |
| สัญญาใกล้หมดอายุ | `expire_date` | `expire - now < 30 days` | เจ้าของสัญญา |
| คอร์สลงทะเบียนไม่ครบ | `enrolled / minimum` | `< 0.5` | ภาควิชา |

---

## ถัดไป

- พัก 10 นาที
- **Workshop 5:** [AI Triage — จัดประเภทคำร้องด้วย LLM](../W5_AI_Triage/README.md)

## ถ้าเจอปัญหา

ดู [troubleshooting.md](troubleshooting.md) หรือถามใน LINE กลุ่ม
