# ❓ FAQ — คำถามที่พบบ่อย

---

## 🎓 เกี่ยวกับคอร์ส

### Q: ใครเรียนได้บ้าง?
**A:** บุคลากร มก. ทุกตำแหน่ง — ไม่ต้องเขียนโปรแกรมเป็น ขอแค่ใช้ Excel/Google Sheets เป็น พิมพ์เร็วระดับนึง

### Q: ต้องเตรียมอะไรมาบ้าง?
**A:**
- Account `workflow.ku.ac.th` — TA แจกในวัน
- Google account ส่วนตัว (Gmail/Drive/Sheets)
- มือถือมี LINE
- ที่เหลือเครื่อง Lab มีให้

### Q: ถ้าทำ workshop ไม่ทันใน 60-75 นาที?
**A:** **ไม่เป็นไร** — ทุก workshop มี `solution/workflow.json` ให้ download มา import ดู แล้วทำต่อที่บ้านได้

### Q: เกณฑ์ผ่านคอร์สคือ?
**A:** 3 อย่าง:
1. เห็นภาพว่า automation คืออะไร
2. ลงมือทำได้อย่างน้อย 1-2 workflow
3. มีแผนที่ว่าจะใช้งานในหน่วยตัวเองยังไง

ทำครบ 5 workshop = **โบนัส** (ไม่ใช่เกณฑ์ตัดสิน)

### Q: หลังคอร์สมีอะไรต่อ?
**A:** 
- **Applied Workshop 3 วัน** (รอบหน้า — ดูประกาศ)
- เข้า [Discussions](../../discussions) แชร์ workflow ของตัวเอง
- ตั้ง [Issue](../../issues) ถ้ามีคำถาม

---

## 🛠 เกี่ยวกับ n8n + workflow.ku.ac.th

### Q: workflow.ku.ac.th ใช้ฟรีตลอดไปมัย?
**A:** ใช่ — สำหรับบุคลากร มก. — สำนักบริการคอมพิวเตอร์ดูแล infra ให้

### Q: ลืมรหัสผ่าน?
**A:** ติดต่อ TA / สำนักบริการคอมพิวเตอร์ (helpdesk@ku.ac.th)

### Q: n8n version ที่ใช้คืออะไร?
**A:** v2.12.3 (อาจ upgrade ในอนาคต — feature หลักไม่เปลี่ยน)

### Q: workflow ฉันรันได้กี่ครั้ง?
**A:** ปกติไม่ rate-limit สำหรับใช้งานในหน่วย — ถ้าจะใช้ commercial / public-facing คุยกับ OCS ก่อน

### Q: Workflow ถูก save อัตโนมัติมัย?
**A:** **ไม่** — ต้องกด **Save** เอง (Ctrl+S) — ถ้าปิด browser ก่อน save ก็หาย!

### Q: ถ้า workflow.ku.ac.th ล่ม ฉันทำงานต่อไม่ได้?
**A:**
- รอกู้คืน (OCS ดูแล)
- ระหว่างรอ — สามารถ run n8n local บนเครื่องตัวเองได้ (`npx n8n`)
- Export workflow เก็บไว้เสมอ — ถ้าเปลี่ยน server import กลับได้

---

## 🤖 เกี่ยวกับ AI / KU LLM Gateway

### Q: KU LLM Gateway ฟรีหรือเสียเงิน?
**A:** ฟรี สำหรับใช้ในงานของ มก. — API key ขอจาก OCS

### Q: ใช้ ChatGPT/Claude แทนได้มัย?
**A:** ได้ แต่ KU LLM Gateway:
- ไม่ส่งข้อมูลออกนอกประเทศไทย (PDPA-friendly)
- ฟรี
- รวมกับ ecosystem ของ KU แล้ว

### Q: KU LLM Gateway ดีพอแทน GPT-4 มั้ย?
**A:** **ไม่** สำหรับงานยาก (vision/code/long reasoning)  
**ใช่** สำหรับงาน 80% ของหน่วยงาน (สรุป/แปล/categorize/email draft)

### Q: ทำไม Chat กับ Embed URL ต่างกัน?
**A:** เป็น service แยกกันใน infra ของ KU
- Chat: `/llm2/v1/chat/completions` (Mistral-7B)
- Embed: `/llm/v1/embeddings` (BGE-M3, 1024 dim)
- **อย่าลืม `/llm2/` กับ `/llm/` ไม่เหมือนกัน!**

### Q: ข้อมูลที่ส่งไป KU LLM ถูกเก็บมั้ย?
**A:** ไม่ — เป็น stateless API (ตามนโยบาย KU) — แต่เพื่อความปลอดภัย **อย่าส่งข้อมูลส่วนบุคคล** (ชื่อ-นามสกุล/บัตรประชาชน/เบอร์โทร) ถ้าไม่จำเป็น

---

## 🐛 ปัญหาที่เจอบ่อย

### Q: Trigger ไม่ทำงาน
**A:** Toggle **Active** มุมขวาบนของ workflow ต้องเปิด

### Q: Google node เด้ง "Forbidden"
**A:** Credentials หมดอายุ → ไป **Credentials** → กด **Reconnect**

### Q: LINE Notify ส่งไม่ได้ — "Invalid token"
**A:** Token ตอน copy อาจติด **ช่องว่าง / newline** ตอนหัวท้าย → ลบออก

### Q: KU LLM ตอบ 404
**A:** ตรวจ URL:
- Chat → `https://apigw.ku.ac.th/llm2/v1/chat/completions`
- Embed → `https://apigw.ku.ac.th/llm/v1/embeddings` (ไม่มี **2**!)

### Q: KU LLM ตอบ 401
**A:** Header ต้องเป็น `apikey: XXX` (ไม่ใช่ `Authorization: Bearer XXX`)

### Q: workflow รันได้ใน editor แต่ scheduled trigger ไม่ทำงาน
**A:** ต้องกด **Active** บนสุด → workflow ต้องอยู่ใน "Active" state ไม่ใช่แค่ "Saved"

### Q: ตัวอักษรไทยใน Sheets เป็น ???
**A:** เปลี่ยน sheet encoding เป็น UTF-8 (Google Sheets เป็น UTF-8 by default — ถ้าใช้ Excel export ต้องเลือก)

---

## 📚 อยากเรียนเพิ่ม

### Q: หา resource ไปอ่านต่อตรงไหน?
**A:**
- **n8n official:** https://docs.n8n.io/
- **n8n community:** https://community.n8n.io/
- **YouTube:** ช่อง `n8n` (English) — มี playlist สำหรับ beginner
- **คอร์ส Applied** (รุ่นหน้า — รอประกาศ)

### Q: อยากเขียน JavaScript ใน Code node เป็นได้
**A:** เริ่มจาก:
- MDN — https://developer.mozilla.org/en-US/docs/Web/JavaScript
- คอร์ส freeCodeCamp (ฟรี) — ใช้เวลา ~2 สัปดาห์ก็เริ่มเขียน Code node ได้

### Q: อยากเข้าใจ HTTP API
**A:**
- ลองเล่น Postman (https://www.postman.com)
- อ่าน "What is REST API" บน Google (มีเป็นไทยเยอะ)

### Q: อยากทำ chatbot บน LINE
**A:** เนื้อหานี้อยู่ใน **Applied Workshop** — ใช้ LINE Webhook + n8n + LLM

---

## 💬 ยังไม่ได้คำตอบ?

- **GitHub Issues** → [New Issue](../../issues/new/choose)
- **GitHub Discussions** → [Discussions](../../discussions)
- **LINE กลุ่ม** (สำหรับผู้เรียนคอร์ส) — แจกในวันแรก
- **Email:** helpdesk@ku.ac.th (สำหรับเรื่อง account / infra)
