# Workshop 4: Solution

## ไฟล์ในนี้

- **[workflow.json](workflow.json)** — เฉลยฉบับเต็ม ทำงานได้

## วิธี Import workflow.json มาดู

1. เปิด n8n → ไปที่หน้า **Workflows**
2. คลิก **`+ Add workflow`** → จุด 3 จุดมุมขวา → เลือก **`Import from File...`**
3. เลือกไฟล์ `workflow.json` นี้
4. n8n จะสร้าง workflow ใหม่ — ไม่ทับของคุณ

## Import + ต้องแก้ 4 จุด

หลัง import — ต้องเปลี่ยน 4 ค่าเป็นของคุณเอง:

1. **Google Sheets credential** (ใช้ใน node `Sheets: อ่าน inventory`) — เลือก credential ที่คุณตั้งไว้ (ของ W2)
2. **Document ID + Sheet name** ใน Google Sheets node — เลือก spreadsheet ของคุณเอง (อย่าใช้ของ solution)
3. **LINE Notify credential** (HTTP Request) — เลือก credential ที่ตั้งไว้ใน W1 หรือ Workshop นี้
4. **Schedule interval** — ใน workshop ใช้ `Every 1 Minute` (test เร็ว) — ของจริงเปลี่ยนกลับเป็น Cron `0 8-17 * * 1-5`

## โครงสร้าง Workflow

```
Schedule (Cron) ─▶ Sheets: อ่าน inventory ─▶ IF (qty < min_qty)?
                                                  ├─ True  ─▶ Loop Over Items ─▶ HTTP Request (LINE Notify)
                                                  └─ False ─▶ (no action)
```

6 nodes ทั้งหมด:
1. **Schedule Trigger** (`scheduleTrigger` v1.2)
2. **Sheets: อ่าน inventory** (`googleSheets` v4.5)
3. **IF: qty < min_qty?** (`if` v2)
4. **Loop Over Items** (`splitInBatches` v3)
5. **HTTP Request (LINE Notify)** (`httpRequest` v4.2)

## เปรียบเทียบกับของคุณ

หลังทำ Workshop 4 จบ ลองดู solution นี้เพื่อ:
- เช็คว่า expression `Number(...)` ใน IF เขียนเหมือนกันไหม
- ดูว่า message template ตรงกันไหม
- ดู Loop batch size + connection ของ True branch ถูกไหม

## ⚠️ ห้ามดูก่อนทำ

Workshop 4 ใช้ pattern ใหม่ — Cron + Number comparison + Loop
- ลองทำเองให้สุด 30 นาที
- ถ้าติด → ดู [troubleshooting.md](../troubleshooting.md) ก่อน
- ถ้ายังไม่ได้ → เปิด solution + เทียบทีละ node

## Note: Advanced extension (Step 9)

Solution นี้ **ไม่รวม** Step 9 (`last_alerted` กัน spam) — เพื่อให้ workflow อ่านง่ายในห้อง

ถ้าอยาก implement Step 9 เอง — ดู [GUIDE.md Step 9](../GUIDE.md) — เพิ่ม 2 อย่าง:
1. IF เพิ่ม condition: `last_alerted ว่าง OR เก่ากว่า 24 ชม.`
2. หลัง HTTP Request เพิ่ม Sheets: Update Row → เขียน `last_alerted = now()`
