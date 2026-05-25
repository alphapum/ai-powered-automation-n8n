# 🤝 Contributing

ขอบคุณที่สนใจ contribute! Repo นี้เปิด **ทุกคน** ส่ง improvement ได้ — ตั้งแต่ผู้เรียนคอร์ส, TA, วิทยากร, จนถึงคน community ทั่วไป

---

## 🎯 อะไร contribute ได้บ้าง

### ✅ ยินดีรับ
- **แก้ typo / ปรับสำนวน** ใน slides / scripts / guides
- **เพิ่ม troubleshooting** ที่เจอจริง (ที่ไม่มีใน `troubleshooting.md`)
- **แชร์ workflow ของตัวเอง** ที่เอาไปประยุกต์ใช้ (ลง [Discussions](../../discussions) หรือ `Examples/`)
- **แปลภาษาอังกฤษ** (ถ้ามีต่างชาติสนใจ)
- **เพิ่ม example use case** ในงานจริง (พร้อม screenshot + workflow.json)
- **รายงาน bug** ใน guide / workflow.json / slide

### ❌ ไม่รับ
- เปลี่ยน **ทิศทาง** ของคอร์ส (เช่น เอา Python มาแทน n8n)
- ลบ KU branding / logo
- แทรกโฆษณา / commercial content
- ละเมิด CC BY-NC-SA 4.0 license

---

## 📝 วิธี contribute

### 1. รายงาน Issue
[ตั้ง Issue ใหม่](../../issues/new/choose) — เลือก template:
- **❓ คำถาม** — ถามอะไรก็ได้
- **🐛 Bug in guide** — เจอข้อผิดใน guide / workflow
- **💡 Share workflow** — แชร์ workflow ของคุณ

### 2. ส่ง Pull Request

```bash
# Fork repo ผ่าน GitHub UI

# Clone ของคุณเอง
git clone https://github.com/YOUR_USERNAME/ai-powered-automation-n8n.git
cd ai-powered-automation-n8n

# สร้าง branch
git checkout -b fix/typo-session2

# แก้ไข + commit
git add .
git commit -m "fix: แก้ typo หน้า 12 ของ Session 2"

# Push + PR
git push origin fix/typo-session2
# ไปที่ GitHub → Create Pull Request
```

ดู [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) สำหรับ format

---

## 📐 Coding Style

### Markdown
- ใช้ `##` (h2) เป็นหัวข้อหลัก, `###` (h3) เป็นย่อย
- ใช้ emoji ตอนเริ่ม heading (📊 🛠 🎯 ⚠️) — ทำให้อ่านง่าย scan ไว
- Code block ใส่ภาษาเสมอ (` ```bash`, ` ```json`)
- ตาราง — ใช้ markdown table (ไม่ใช่ HTML)

### Workflow JSON
- ตั้งชื่อ workflow: `W{N}-{Pattern}-{Use Case}` เช่น `W1-Webhook-คำร้องนิสิต`
- ทุก node มี Note (อธิบายว่าทำอะไร)
- **อย่า commit credentials จริง** — ใช้ placeholder `YOUR_API_KEY_HERE`
- Test ก่อน export — ต้องรันได้จริงบน `workflow.ku.ac.th`

---

## 🎨 Branding Guidelines

- **สีหลัก:** KU Green `#006633`
- **โลโก้:** มหาวิทยาลัยเกษตรศาสตร์ + สำนักบริการคอมพิวเตอร์
- **ห้ามใช้:** logo MindData / vendor อื่น (คอร์สนี้ของ KU ล้วน)
- **ฟอนต์:** TH Sarabun New (ไทย) — `Inconsolata` (code monospace)

---

## ⚖️ License Agreement

โดย contribute → คุณยอมรับว่า contribution ของคุณจะถูกเผยแพร่ภายใต้ **CC BY-NC-SA 4.0** เหมือนกับ project นี้

ดู [LICENSE](LICENSE)

---

## 💬 Question?

- ถามใน [Issues](../../issues) (สำหรับ technical / bug)
- ถามใน [Discussions](../../discussions) (สำหรับ idea / general)
- LINE กลุ่มของคอร์ส (สำหรับผู้เรียน)

ขอบคุณที่ช่วยทำให้คอร์สนี้ดีขึ้น! 🙏
