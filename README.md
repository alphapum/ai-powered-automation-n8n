# AI-Powered Automation ด้วย n8n — Foundation Workshop

> หลักสูตรอบรมเชิงปฏิบัติการ สำหรับบุคลากรมหาวิทยาลัยเกษตรศาสตร์
>
> จัดโดย: **สำนักบริการคอมพิวเตอร์** ร่วมกับ **ฝ่ายเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์** มหาวิทยาลัยเกษตรศาสตร์

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-v2.12.3-EA4B71)](https://n8n.io)
[![KU LLM](https://img.shields.io/badge/AI-KU%20LLM%20Gateway-006633)](https://apigw.ku.ac.th)

---

## 📌 เกี่ยวกับคอร์ส

- **วันจัด:** 26–27 พฤษภาคม 2569 (2 วัน / 12 ชั่วโมง / 09:00–16:00)
- **สถานที่:** ห้องปฏิบัติการคอมพิวเตอร์ ชั้น 3 อาคารสำนักบริการคอมพิวเตอร์ มก. บางเขน
- **ผู้เรียน:** บุคลากร มก. 119 คน / 33 ส่วนงาน / 4 วิทยาเขต
- **วิทยากร:** คุณอมรพันธ์ พรชัยเจริญ (วิทยากรรับเชิญ)
- **TA:** นักศึกษา SPU 4 คน (ห้องละ 2 คน)
- **n8n version:** v2.12.3 บน `workflow.ku.ac.th`
- **AI backend:** KU LLM Gateway (`apigw.ku.ac.th`) — Mistral-7B + BGE-M3

---

## 🎯 เป้าหมายของคอร์ส

จบ 2 วัน ทุกคนจะได้:

1. **เห็นภาพ** — เข้าใจว่า automation / n8n คืออะไร ต่างจาก AI ผู้ช่วย (ChatGPT) อย่างไร
2. **แตะของจริง** — ได้ลงมือทำ n8n เอง อย่างน้อย 1-2 workflow รู้สึก "ทำได้"
3. **เห็นงานตัวเอง** — มี "แผนที่งานอัตโนมัติของฉัน" — ระบุได้ว่างานคุณ เอา n8n ไปจับตรงไหน

---

## 🗺️ โครงสร้างเนื้อหา

**5 Sessions บรรยาย + 5 Workshops ปฏิบัติ**

### วันที่ 1 (26 พ.ค.) — ทำความรู้จัก + Pattern ง่ายๆ
| เวลา | กิจกรรม | ไฟล์ |
|------|---------|------|
| 09:15-10:30 | **Session 1:** AI & Automation 101 | [📊 Slides](Slides/Session1_AI_Automation_101/Session1.pdf) |
| 10:45-12:00 | **Session 2:** เริ่มต้นใช้งาน n8n | [📊 Slides](Slides/Session2_Getting_Started/Session2.pdf) |
| 13:00-14:00 | **Workshop 1:** คำร้องนิสิต (Forms→LINE) | [🛠 Guide](Workshops/W1_Forms_LINE/) · [⚙️ workflow.json](Workshops/W1_Forms_LINE/solution/workflow.json) |
| 14:15-15:30 | **Workshop 2:** รวบรวมไฟล์ (Gmail→Drive) | [🛠 Guide](Workshops/W2_Gmail_Drive/) · [⚙️ workflow.json](Workshops/W2_Gmail_Drive/solution/workflow.json) |

### วันที่ 2 (27 พ.ค.) — Logic + AI + Production
| เวลา | กิจกรรม | ไฟล์ |
|------|---------|------|
| 09:15-10:30 | **Session 3:** Logic & Conditions | [📊 Slides](Slides/Session3_Logic_Conditions/Session3.pdf) |
| 10:45-12:00 | **Workshop 3+4:** อวยพรวันเกิด + เฝ้าระวังสต๊อก | [🛠 W3](Workshops/W3_Birthday/) · [🛠 W4](Workshops/W4_Inventory/) |
| 13:00-14:15 | **Session 4:** AI Integration | [📊 Slides](Slides/Session4_AI_Integration/Session4.pdf) |
| 14:30-15:30 | **Workshop 5:** สรุปเบิกจ่าย + AI | [🛠 Guide](Workshops/W5_Expenses_AI/) · [⚙️ workflow.json](Workshops/W5_Expenses_AI/solution/workflow.json) |
| 15:30-16:00 | **Session 5:** นำไปใช้จริง + ปิดคอร์ส | [📊 Slides](Slides/Session5_Apply_Real/Session5.pdf) |

---

## 📁 โครงสร้าง Repository

```
ai-powered-automation-n8n/
│
├── 📊 Slides/                  ← สไลด์บรรยาย 5 Sessions (PDF พร้อมใช้)
│   └── Session{1-5}/          ← PDF ไฟล์
│
├── 🛠 Workshops/               ← 5 Workshop คู่มือ + solution
│   ├── W1_Forms_LINE/         ← README, GUIDE, sample, troubleshooting, solution/
│   ├── W2_Gmail_Drive/
│   ├── W3_Birthday/
│   ├── W4_Inventory/
│   └── W5_Expenses_AI/
│
├── 🧪 Examples/                ← workflow ทดสอบ KU LLM Gateway
│   └── Test_KU_LLM_Gateway/
│
├── 📅 00_Schedule.md           ← ตารางคอร์สแบบละเอียด
└── 📜 LICENSE                  ← CC BY-NC-SA 4.0
```

---

## 🚀 ใช้งาน Repo นี้ยังไง

### สำหรับผู้เรียน

1. **ก่อนคอร์ส:** อ่าน [00_Schedule.md](00_Schedule.md) — รู้ว่าจะเรียนอะไร
2. **ระหว่างคอร์ส:** เปิด `Workshops/W*/GUIDE.md` ที่กำลังทำ ทำตามทีละขั้น
3. **ถ้าติด:** เปิด `troubleshooting.md` ของ workshop นั้น หรือถามใน LINE กลุ่ม
4. **ถ้าทำไม่ทัน:** download `solution/workflow.json` มาดูเทียบ
5. **หลังคอร์ส:**
   - Browse คู่มือทุกที่ ทำต่อที่บ้าน
   - ใช้ [Issues](../../issues) ถามคำถาม
   - ใช้ [Discussions](../../discussions) แชร์ workflow ของตัวเอง

### สำหรับ TA / วิทยากรรอบหน้า

- **สไลด์:** ใช้ PDF ใน `Slides/Session{1-5}/` ได้เลย
- **แก้ไข/recompile สไลด์ + สคริปต์วิทยากร + Pretest/Posttest:** ติดต่อ instructor โดยตรง (private)

### สำหรับ Admin / Maintainer

- **Update workflow examples:** แก้ใน `Workshops/W*/solution/workflow.json` → commit
- **เพิ่ม resource:** เพิ่มใน [Resources/](Resources/) (ถ้ามี)

---

## 🔧 Infrastructure ของคอร์ส

```
ผู้เรียน 119 คน
       ↓ browser
workflow.ku.ac.th (n8n v2.12.3)
       │
   ┌───┼─────────────────────────┐
   ↓   ↓                         ↓
Google Workspace            KU LLM Gateway
(Sheets/Forms/Gmail/Drive)  apigw.ku.ac.th
                              │
                       ┌──────┴──────┐
                       ↓             ↓
                  /llm2/v1/chat   /llm/v1/embeddings
                  Mistral-7B      BGE-M3 (1024d)
```

⚠️ **Gotcha:** chat ใช้ `/llm2/` (มี 2) แต่ embed ใช้ `/llm/` (ไม่มี 2) — service แยกกัน

ดู [Examples/Test_KU_LLM_Gateway/](Examples/Test_KU_LLM_Gateway/) — workflow ทดสอบ + URL ที่ใช้ได้

---

## 📊 ผลลัพธ์ทาง education (จะอัพเดตหลังคอร์ส)

| Metric | Pretest | Posttest |
|--------|---------|----------|
| คะแนนเฉลี่ย (12 ข้อ) | TBD | TBD |
| % คนที่ activate workflow ตัวแรก | TBD | TBD |
| Workshop ที่ทำเสร็จเฉลี่ย / คน | — | TBD |

ผลข้างเคียง: ผู้เรียนที่นำไปใช้จริงในงาน → คาดประหยัด ~200 ชม./ปี/คน (5 งานซ้ำๆ × 10 นาที × 250 วัน)

---

## 💬 ติดต่อ + Community

- **GitHub Issues:** ถามคำถาม / แจ้ง bug → [New Issue](../../issues/new/choose)
- **GitHub Discussions:** แชร์ workflow / ขอ feedback → [Discussions](../../discussions)
- **LINE กลุ่ม:** (แจกในวันแรกของคอร์ส)
- **Email สนับสนุน:** ผ่านสำนักบริการคอมพิวเตอร์ มก.

---

## 📜 License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](LICENSE) (CC BY-NC-SA 4.0)

ใช้ฟรีเพื่อการศึกษา + ดัดแปลงได้ + ห้ามใช้เชิงพาณิชย์ + งานต่อยอดต้อง license เดียวกัน

---

## 🙏 ขอบคุณ

- **สำนักบริการคอมพิวเตอร์** มก. — ผู้จัดและสถานที่
- **ฝ่ายเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์** มก. — ผู้สนับสนุนหลัก
- **รศ. อนันต์ ผลเพิ่ม** รองอธิการบดีฯ — ผู้กล่าวเปิดคอร์ส
- **น้องนักศึกษา SPU 4 คน** — TA ช่วย hands-on
- **บุคลากร มก. 119 คน** — ผู้เรียนที่ยอมมาเรียน 2 วันเต็ม

🌱 *Powered by [n8n](https://n8n.io) (Sustainable Use License) — สร้างโดย ม.เกษตรศาสตร์ สำหรับ ม.เกษตรศาสตร์*
