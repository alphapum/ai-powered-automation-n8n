# 🛠 Workshops — 5 Hands-on Workshops

ทั้ง 5 workshops ใช้บัญชี `workflow.ku.ac.th` (n8n v2.12.3) — แจกในวันแรกของคอร์ส

---

## 📋 รายการ Workshop

| # | ชื่อ | Pattern | เวลา | วันที่ทำ |
|---|------|---------|------|----------|
| **W1** | [คำร้องนิสิต (Forms→LINE)](W1_Forms_LINE/) | Webhook + Notification | 60 นาที | วัน 1 บ่าย |
| **W2** | [รวบรวมไฟล์ (Gmail→Drive)](W2_Gmail_Drive/) | Filter + File handling | 75 นาที | วัน 1 บ่าย |
| **W3** | [อวยพรวันเกิด (Sheets→LINE)](W3_Birthday/) | Schedule + Filter + Personalization | 35 นาที | วัน 2 เช้า |
| **W4** | [เฝ้าระวังสต๊อก (Sheets→LINE)](W4_Inventory/) | Schedule + Threshold + Alert | 35 นาที | วัน 2 เช้า |
| **W5** | [สรุปเบิกจ่าย + AI (Sheets→KU LLM→Email)](W5_Expenses_AI/) | AI summarization + Email | 60 นาที | วัน 2 บ่าย |

**รวม 5 workflows** | 4 ใช้ Google services | 1 ใช้ AI (KU LLM Gateway)

---

## 📁 โครงสร้างแต่ละ Workshop

```
W{N}_ชื่อ/
├── README.md           ← overview สั้นๆ + เป้าหมาย + เวลา
├── GUIDE.md            ← คู่มือทำตามทีละขั้น (10-20 นาที อ่าน)
├── sample-*.md         ← ข้อมูลทดสอบที่ใช้ใน workshop
├── troubleshooting.md  ← ปัญหาที่เจอบ่อย + วิธีแก้
└── solution/
    └── workflow.json   ← ไฟล์พร้อม import ลง n8n
```

---

## 🚀 วิธีใช้

### สำหรับผู้เรียน (ในห้องเรียน)

1. เปิด `GUIDE.md` ของ workshop ที่กำลังทำ
2. ทำตามทีละขั้น (10-30 นาที)
3. **ถ้าติด** → เปิด `troubleshooting.md`
4. **ถ้าทำไม่ทัน** → download `solution/workflow.json` มา import ลง n8n เพื่อดูเทียบ

### Import workflow.json ลง n8n

1. ใน n8n: ⋯ menu (มุมขวาบน) → **Import from File**
2. เลือก `workflow.json`
3. ใส่ credentials ที่จำเป็น (Google/LINE/KU LLM)
4. คลิก **Save** → **Active** (toggle ขวาบน)

### สำหรับ TA / วิทยากรรอบหน้า

- มี troubleshooting พร้อม — อ่านล่วงหน้าก่อนสอน
- ทุก `solution/workflow.json` ทดสอบแล้วบน `workflow.ku.ac.th`
- **Talking points / สคริปต์** — ติดต่อ instructor โดยตรง (private)

---

## 🔑 Credentials ที่ใช้

| Workshop | Service | Credential ที่ต้อง setup |
|----------|---------|--------------------------|
| W1 | LINE Notify | LINE Notify token (ทีมจัดแจก) |
| W2 | Gmail + Google Drive | OAuth (Google account ส่วนตัว) |
| W3 | Google Sheets + LINE Notify | OAuth + LINE token |
| W4 | Google Sheets + LINE Notify | OAuth + LINE token |
| W5 | Google Sheets + KU LLM + Gmail | OAuth + KU LLM API key + OAuth |

---

## 📊 Pattern Mapping

แต่ละ workshop สอน automation pattern หนึ่งที่เอาไปใช้ในงานจริงได้:

| Pattern | Workshop | งานจริงที่ใช้ได้ |
|---------|----------|------------------|
| **Event → Notify** | W1 | คำร้องเข้ามา/นัดหมายใหม่/lead เข้า/ฟอร์มยื่นเอกสาร |
| **Filter + Save** | W2 | เก็บใบเสร็จ/รายงานจาก email/เอกสาร attachment |
| **Schedule + Filter + Personalize** | W3 | อวยพรวันเกิด/แจ้งครบกำหนดสัญญา/แจ้ง KPI รายเดือน |
| **Schedule + Threshold** | W4 | เตือนสต๊อก/เตือน budget เกิน/เตือนงานค้าง |
| **Aggregate + AI Summary** | W5 | สรุปรายงาน/สรุปคำร้อง/สรุปประชุมจาก transcript |

---

## 💡 Tips

- **เก็บ credentials ลง n8n ครั้งเดียว** — reuse ได้ในทุก workflow
- **ทุก node ใส่ Note** (Click node → 📝 icon) — กลับมาดูจะเข้าใจ
- **ตั้งชื่อ workflow ชัดๆ** เช่น `W1-Forms-LINE-คำร้องนิสิต` (TA จะหาง่าย)
- **Export workflow ส่วนตัว** เก็บไว้ — ถ้า n8n ล่ม import กลับได้

---

## 🐛 ปัญหาทั่วไป

| ปัญหา | แก้ที่ |
|--------|-------|
| Trigger ไม่ทำงาน | toggle **Active** บนสุด |
| Google node "Forbidden" | reconnect OAuth |
| LINE Notify "Invalid token" | ตรวจ token ตัดบรรทัด/ช่องว่าง |
| KU LLM 404 | chat ใช้ `/llm2/` แต่ embed ใช้ `/llm/` (ไม่มี 2) |

อ่าน `troubleshooting.md` ของ workshop แต่ละตัว
