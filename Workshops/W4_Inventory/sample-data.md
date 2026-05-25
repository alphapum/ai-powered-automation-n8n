# Workshop 4: Google Sheet Template — "inventory"

โครงสร้าง Google Sheets ที่ใช้ใน Workshop 4 — TA จะแจก link template ในห้อง

## ข้อมูลพื้นฐาน

- **ชื่อ Spreadsheet:** `KU Workshop W4 — Inventory Template`
- **ชื่อ Sheet (tab):** `inventory` (หรือ `Sheet1`)
- **บรรทัดที่ 1:** header — n8n อ่านจาก header ใส่ field name

## โครงสร้าง Column

| Column | ชื่อ field | Data Type | Example | คำอธิบาย |
|---|---|---|---|---|
| A | `item` | Text | กระดาษ A4 80 แกรม | ชื่อสินค้า/พัสดุ |
| B | `sku` | Text | PA-A4-80 | รหัสสินค้า (ใช้เป็น primary key สำหรับ Update) |
| C | `qty` | Number | 25 | จำนวนคงเหลือ |
| D | `min_qty` | Number | 50 | จุดสั่งซื้อ — ต่ำกว่านี้ต้อง alert |
| E | `unit` | Text | รีม | หน่วยนับ (รีม, ตลับ, กล่อง, ขวด ฯลฯ) |
| F | `responsible` | Text | น.ส.มาลี | ชื่อคนรับผิดชอบสั่งซื้อ |
| G | `line_token` | Text | XXXXX | LINE Notify token (workshop ใช้ token ร่วมได้) |
| H | `last_updated` | Date | 2026-05-26 | วันที่อัพเดทล่าสุด |
| I (optional) | `last_alerted` | DateTime | 2026-05-26T13:00:00Z | (Step 9) วันที่/เวลา แจ้งครั้งล่าสุด |

## ข้อมูลตัวอย่าง (4 รายการ)

ใช้สำหรับทดสอบใน Workshop — มี 2 รายการที่ต่ำกว่าจุดสั่ง (เพื่อให้ IF เห็น "True branch" ทำงาน)

| item | sku | qty | min_qty | unit | responsible | line_token | last_updated |
|---|---|---|---|---|---|---|---|
| กระดาษ A4 80 แกรม | PA-A4-80 | **25** | 50 | รีม | น.ส.มาลี | XXXXX | 2026-05-26 |
| หมึกพิมพ์ HP 88A ดำ | INK-HP88A | 8 | 5 | ตลับ | นายสมชาย | XXXXX | 2026-05-26 |
| ลวดเย็บกระดาษ #10 | ST-10 | 30 | 20 | กล่อง | น.ส.มาลี | XXXXX | 2026-05-26 |
| ผงหมึก Brother TN-261 | TONER-261 | **2** | 5 | ตลับ | นายสมชาย | XXXXX | 2026-05-26 |

> 💡 **ทำไม qty `25` ของกระดาษถึงต่ำกว่า min `50`?** เพื่อให้นักเรียนเห็น "True branch ทำงาน" — รายการนี้จะถูก IF จับ → แจ้ง LINE

### ผลลัพธ์ที่คาดหวัง

หลังรัน workflow 1 ครั้ง — จะส่ง LINE 2 ข้อความ (กระดาษ A4 + ผงหมึก Brother)

## ตัวอย่างชุดข้อมูลขยาย (ถ้าอยากเล่นเพิ่ม)

```
| item                      | sku        | qty | min_qty | unit  | responsible        |
|---------------------------|------------|-----|---------|-------|--------------------|
| กระดาษ A4 80 แกรม         | PA-A4-80   |  25 |  50     | รีม   | น.ส.มาลี           |
| กระดาษ A3 80 แกรม         | PA-A3-80   |  18 |  10     | รีม   | น.ส.มาลี           |
| หมึกพิมพ์ HP 88A ดำ       | INK-HP88A  |   8 |   5     | ตลับ  | นายสมชาย           |
| หมึกพิมพ์ HP 88A สี        | INK-HP88C  |   1 |   3     | ตลับ  | นายสมชาย           |
| ผงหมึก Brother TN-261     | TONER-261  |   2 |   5     | ตลับ  | นายสมชาย           |
| ลวดเย็บกระดาษ #10         | ST-10      |  30 |  20     | กล่อง | น.ส.มาลี           |
| ปากกาลูกลื่น น้ำเงิน      | PEN-BL     | 120 |  50     | ด้าม  | น.ส.มาลี           |
| โพสต์อิท เหลือง 3x3        | NOTE-Y33   |   3 |  10     | แพ็ค  | น.ส.มาลี           |
| ผงซักฟอก 1 kg             | DET-1K     |   4 |   3     | ถุง   | น.ส.อรุณี          |
| น้ำดื่ม 600 mL             | WAT-600    |  60 | 100     | ขวด   | น.ส.อรุณี          |
```

**Quiz เร็วๆ:** จากตารางนี้ มีกี่รายการที่ต่ำกว่า min_qty?

<details>
<summary>เฉลย</summary>

5 รายการ:
- กระดาษ A4 (25 < 50)
- หมึกพิมพ์สี (1 < 3)
- ผงหมึก Brother (2 < 5)
- โพสต์อิท เหลือง (3 < 10)
- น้ำดื่ม (60 < 100)

</details>

## ตัวอย่าง JSON Output จาก Google Sheets node

หลัง n8n อ่าน sheet แล้ว — output หน้าตา:

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
  {
    "item": "หมึกพิมพ์ HP 88A ดำ",
    "sku": "INK-HP88A",
    "qty": 8,
    "min_qty": 5,
    "unit": "ตลับ",
    "responsible": "นายสมชาย",
    "line_token": "XXXXX",
    "last_updated": "2026-05-26"
  }
  // ... 2 รายการที่เหลือ
]
```

> ⚠️ **ระวัง type ของ qty/min_qty:**
> - บางครั้ง Google Sheets คืน `25` (number) — ถ้า cell เป็น Number format
> - บางครั้งคืน `"25"` (string) — ถ้า cell เป็น Plain text format
> - ใน IF node ใช้ `Number($json.qty)` ครอบไว้กันพลาด

## ตัวอย่างข้อความที่ส่งเข้า LINE

```
🚨 สต๊อกใกล้หมด!
รายการ: กระดาษ A4 80 แกรม
คงเหลือ: 25 รีม (จุดสั่ง: 50)
ผู้รับผิดชอบ: น.ส.มาลี
SKU: PA-A4-80
```

## เอาไปปรับใช้กับงานคุณ

ลองคิด — งานของคุณมีของอะไรที่ต้องเฝ้าดูจำนวนคงเหลือ?

| งาน | column qty | column min | unit |
|-----|-----------|-----------|------|
| ห้อง Lab — สารเคมี | จำนวนขวด | safety stock | ขวด/กิโล |
| ห้องพยาบาล — เวชภัณฑ์ | จำนวนกล่อง | minimum | กล่อง |
| คลังพัสดุ — เครื่องเขียน | จำนวนชิ้น | reorder point | ชิ้น |
| งานเลี้ยง — อาหารว่าง | จำนวนกล่อง | ต่อ 100 คน | กล่อง |
| ห้องสมุด — หนังสือยอดนิยม | available copies | กำหนดต่ำสุด | เล่ม |

## ข้อสังเกตเรื่องการตั้ง Sheet

1. **Row 1 ต้องเป็น header เท่านั้น** — ห้ามใส่ data ใน row 1
2. **อย่ามี row ว่างใน data** — n8n จะอ่านเป็น row เปล่า (field เป็น `""` หมด)
3. **format `qty` cell เป็น Number** — Format → Number → Number — กัน type confusion
4. **format `last_updated` เป็น Date** — Format → Number → Date
5. **อย่าใส่สูตร (`=A1+B1`) ใน cell ที่ workflow เขียนกลับ** — n8n จะ overwrite สูตรไปเลย
