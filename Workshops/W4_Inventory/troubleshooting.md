# Workshop 4: Troubleshooting

ปัญหาที่พบบ่อย + วิธีแก้ — ถ้าเจอที่ไม่อยู่ในนี้ ถาม TA หรือ LINE กลุ่ม

---

## ❌ IF node ปล่อยทุก row ไปฝั่ง False หมด (แม้ qty < min_qty จริง)

**อาการ:** ดูใน Sheet — กระดาษ A4 qty=25, min_qty=50 ชัดๆ — แต่ IF บอก False

**สาเหตุ:** เปรียบเทียบเป็น string ไม่ใช่ number — `"25" < "50"` ตามตัวอักษร = True แต่ `"8" < "50"` = **False** (เพราะ "8" > "5" ตามตัวอักษร!)

**วิธีแก้:**

1. ที่ IF node — เช็คว่า Type ของ value เป็น `Number` (ไม่ใช่ String / Auto)
2. ใส่ expression ครอบด้วย `Number(...)`:
   ```
   Left: {{ Number($json.qty) }}
   Right: {{ Number($json.min_qty) }}
   ```
3. ถ้ายังไม่ตรง — เปิด Google Sheet → เลือก column qty + min_qty → Format → Number → Number

---

## ❌ Google Sheets node อ่านได้ 0 row

**อาการ:** Execute step แล้ว output เป็น array ว่าง `[]`

**เช็ค:**

1. **Range ผิด** — เว้นว่างใน `Range` (default = `A:Z`) หรือกำหนดเป็น `A1:Z1000`
2. **Sheet tab ผิด** — เช็คว่าใส่ชื่อ tab ตรง (case-sensitive) — สังเกตชื่อ tab ด้านล่าง spreadsheet
3. **Row 1 ไม่ใช่ header** — n8n อ่าน row 1 เป็น header เสมอ — ถ้า row 1 มีข้อมูลจริง → จะหายไป 1 row
4. **Sheet ว่าง** — ใส่ข้อมูลตัวอย่างก่อน (อย่างน้อย 2-3 row)
5. **Permission ใน OAuth** — ตอน connect Google account อาจไม่ได้ขอ scope `spreadsheets.readonly` — ลอง re-authorize

---

## ❌ Google Sheets ขึ้น error "The caller does not have permission"

**สาเหตุ:** OAuth ของ n8n ไม่ได้เปิด scope ของ Sheets — ถ้าใช้ credential ที่สร้างไว้สำหรับ Gmail/Drive เท่านั้น อาจไม่ครอบคลุม

**วิธีแก้:**

1. ไปที่ Settings → Credentials → เลือก credential ของคุณ
2. กด **Disconnect** แล้ว **Connect again**
3. ตอนหน้า Google permission — เช็คว่ามี checkbox `See, edit, create and delete your spreadsheets in Google Drive` — Allow

หรือสร้าง credential ใหม่เฉพาะสำหรับ Sheets:
- Settings → Credentials → Create new → Google Sheets OAuth2 API

---

## ❌ qty มีค่าเป็น `""` (empty string) แทน Number

**สาเหตุ:** Cell ใน Sheet เป็น string ที่ดูเหมือนตัวเลขแต่ที่จริงเป็น text — เช่น `'25` (มี apostrophe นำหน้า)

**วิธีแก้:**

1. ใน Sheet → เลือก column qty → Format → Number → Number
2. ลบค่าออกแล้วพิมพ์ใหม่ (ไม่มี apostrophe)
3. ใน n8n ใช้ `Number($json.qty)` หรือ `parseInt($json.qty)` ก็ได้

---

## ❌ LINE Notify ส่งไม่ส่ง — Error 401 Unauthorized

**อาการ:** HTTP Request node ขึ้นแดง — error `401`

**สาเหตุ + วิธีแก้:**

1. **Token ผิด** — เช็คว่า:
   - Header Name = `Authorization` (มี `n` ตัวเดียว)
   - Header Value = `Bearer XXXXX` — มีคำว่า `Bearer` เว้นวรรค แล้วตามด้วย token
   - Token ไม่มี space หน้า/หลัง
2. **ใช้ token จาก Sheet column ผิดวิธี** — ใน workshop เราใช้ credential ที่ตั้งไว้ครั้งเดียว (ไม่ดึงจาก sheet column `line_token` แบบ dynamic) — ถ้าอยากใช้ token แต่ละ row → ดู advanced ด้านล่าง

---

## ❌ LINE Notify Error 400 Bad Request

**อาการ:** HTTP node ขึ้นแดง — error `400`

**เช็ค:**

1. **ไม่ได้เปิด `Send Body`** — toggle Send Body ต้องเปิด
2. **Body Content Type ผิด** — ต้องเป็น `Form-Urlencoded` (ไม่ใช่ JSON)
3. **ไม่มี field `message`** — Body Parameters ต้องมี Name `message` (ต้องเป็น lowercase ตรงเป๊ะ)
4. **message ว่าง** — ลองเช็คว่า expression ออกค่าจริง — ดู panel ขวาของ HTTP Request node (ตรง Input)

---

## ❌ Loop Over Items ไม่ทำงาน — แค่ส่ง 1 ข้อความ แม้มี 3 รายการต่ำกว่า min

**สาเหตุ:**

1. **Connection ผิด** — ลากจาก output ที่ไม่ใช่ Iteration ของ Loop — ตรวจสอบให้ HTTP Request ต่อกับ "loop iteration" (output ด้านขวาบน) ไม่ใช่ "after loop done"
2. **ก่อน Loop ไม่ได้แตก items** — Sheets node อาจ output เป็น array ใน item เดียว — ลองเช็ค output structure

**วิธีแก้:**

- หลัง Sheets node ที่อ่านมา ดู output ใน panel ขวา ถ้าเป็น `[{...}, {...}]` แยกเป็น items ต่างกัน = ถูกต้องแล้ว
- ถ้าทั้งหมดอยู่ใน item เดียว → ใช้ Code node `return $input.first().json.items.map(i => ({json: i}))` หรือดูตั้งค่า "Split into Items" ใน Sheets node

> 💡 จริงๆ ใน Workshop 4 — Sheets node กับ "Get Row(s)" จะแยก items ให้เอง ดังนั้น HTTP Request ที่ต่อตรงๆ ก็ทำงาน per-item อยู่แล้ว — Loop เป็นเครื่องประกอบเพื่อให้ workflow อ่านง่ายเท่านั้น

---

## ❌ Schedule Trigger ไม่ทำงานหลัง Activate

**เช็ค:**

1. **Cron expression ผิด** — ลองทดสอบที่ [crontab.guru](https://crontab.guru) ก่อน
   - `0 8-17 * * 1-5` = นาทีที่ 0 ของชั่วโมง 8-17 จันทร์-ศุกร์ ✅
2. **Workflow ยังไม่ Active** — Toggle Active สีเขียวมุมขวาบน
3. **n8n server timezone** — ที่ Settings → Timezone — ตรวจสอบให้เป็น `Asia/Bangkok`
4. **ดู Executions tab** — มี log บอกว่า trigger fire เมื่อไหร่ ถ้าไม่มีเลย = ไม่ทำงาน

---

## ❌ ได้รับ LINE ทุกชั่วโมงเรื่องรายการเดียวกัน (สแปม)

**อาการ:** กระดาษ A4 ยังไม่มีเวลาไปสั่ง → 8 โมง 9 โมง 10 โมง — แจ้งเรื่องเดียวกันรัวๆ

**ทางแก้:**

- **Quick fix:** ปิด workflow ชั่วคราว (toggle Active → Inactive) ระหว่างที่ยังไม่ได้ replenish
- **Long fix:** ทำตาม [GUIDE.md Step 9](GUIDE.md#step-9-advanced-ป้องกัน-spam-ด้วย-last_alerted-5-นาที---เลือกทำ) — ใช้ column `last_alerted` กันแจ้งซ้ำ 24 ชม.

---

## ❌ ตัวเลข qty เป็น `0` แทนค่าจริง

**สาเหตุ:** ค่าใน sheet เป็นสูตร (เช่น `=SUMIF(...)`) — บางครั้ง n8n อ่านได้ค่า cached ไม่ใช่ค่าที่คำนวณแล้ว

**วิธีแก้:**

1. ที่ Google Sheets node → **Options → Value Render Mode** = `Formatted Value` (default) หรือลองเป็น `Unformatted Value`
2. ถ้าใช้สูตรซับซ้อน — copy paste ค่าผลลัพธ์เป็น value (Paste Special → Values only)

---

## ❌ Workflow เกิดอาการ "ส่งซ้ำ 2 รอบ"

**สาเหตุ:** workflow ถูก execute ทั้ง manual (Execute Workflow) และ schedule fire พร้อมๆ กัน

**วิธีแก้:**

- ระหว่าง dev: ปิด Active เสมอ ก่อน manual test
- ระหว่าง production: อย่ากด Execute Workflow ถ้า active อยู่
- ถ้าเกิดซ้ำต่อเนื่อง — เช็คที่ Executions มี execution duplicate ไหม

---

## ❌ ภาษาไทยใน LINE ขึ้น `?????`

**สาเหตุ:** Content-Type ไม่ระบุ UTF-8

**วิธีแก้:**

ที่ HTTP Request node → **Headers** → เพิ่ม custom header:
- Name: `Content-Type`
- Value: `application/x-www-form-urlencoded; charset=utf-8`

(โดยปกติ n8n ตั้งให้ถูกแล้ว แต่ถ้าเจอปัญหานี้ลอง force ดู)

---

## ❌ Expression `{{ Number($json.qty) }}` ใน IF ออกค่าเป็น `NaN`

**สาเหตุ:** `$json.qty` เป็น `undefined` หรือ string ว่าง — `Number(undefined) = NaN`

**วิธีแก้:**

1. ใส่ default ก่อน Number:
   ```
   {{ Number($json.qty || 0) }}
   ```
2. หรือใส่ค่าใน Sheet ให้ครบทุก row (ห้ามมี cell ว่างใน column qty/min_qty)

---

## ❌ HTTP Request หลัง Loop ส่ง LINE แต่ message format เพี้ยน (มี comma ติด)

**สาเหตุ:** ใส่ message ผิด — ทำให้ n8n เข้าใจเป็น 2 fields แทนที่จะเป็นข้อความเดียว

**วิธีแก้:**

ที่ Body Parameter → field `message` → ใส่ใน Expression mode (กด **fx** ก่อนพิมพ์) ครอบเครื่องหมาย `=` หน้า:
```
=
🚨 สต๊อกใกล้หมด!
รายการ: {{ $json.item }}
...
```

ไม่ใช่:
```
{{ $json.item }}, {{ $json.qty }}, ...  ← ผิด
```

---

## 💡 Tips

- **ทดสอบกับ qty/min_qty ที่ extreme** — ลองตั้ง qty=0 หรือ min_qty=999999 เพื่อ test edge case
- **ดู Executions tab** — เห็น run history ทุกครั้ง — เลือก execution เก่าเพื่อ debug
- **Disable workflow ก่อนแก้** — ถ้าแก้ขณะ active จะมี execution ซ้อน
- **อย่าใส่ token จริงใน screenshot** ที่ post ในกลุ่ม — เบลอก่อน
- **Manual test ก่อน activate cron** — ใช้ Every 1 Minute หรือ Execute Workflow ดูครบทุก case ก่อน

---

## Advanced: ใช้ token ของแต่ละ responsible (ไม่ใช้ token รวม)

ถ้าอยากให้แต่ละคนได้ LINE token ของตัวเอง (ไม่สแปม group):

1. ที่ Sheet — column `line_token` ใส่ token เฉพาะของแต่ละคน
2. ที่ HTTP Request — เปลี่ยน Authentication เป็น `None` (ไม่ใช้ credential)
3. เพิ่ม **Header Parameter** (ที่ tab Headers):
   - Name: `Authorization`
   - Value: `=Bearer {{ $json.line_token }}`

> ⚠️ **ระวัง:** ไม่ควร store token จริงใน Sheet ที่ share กว้าง — Sheet ต้องอยู่ private only — token รั่ว = ทุกคนยิง spam ได้

---

## ถ้ายังแก้ไม่ได้

1. ยกมือเรียก **TA** ในห้อง
2. หรือถามใน **LINE กลุ่ม** — โพสต์:
   - screenshot ของ error
   - node ที่ติด
   - output JSON ของ Sheets node (เพื่อดู type ของ qty/min_qty)
   - สิ่งที่ลองแก้แล้ว
