# Workshop 1: Solution

## ไฟล์ในนี้

- **[workflow.json](workflow.json)** — เฉลยฉบับเต็ม ทำงานได้

## วิธี Import workflow.json มาดู

1. เปิด n8n → ไปที่หน้า **Workflows**
2. คลิก **`+ Add workflow`** → เลือก **`Import from File...`**
3. เลือกไฟล์ `workflow.json` นี้
4. n8n จะสร้าง workflow ใหม่ — ไม่ทับของคุณ
5. **สำคัญ:** ต้องแก้ 2 จุด:
   - **LINE Notify credential** — ใส่ของคุณเอง (credential ID ใน export เป็น placeholder)
   - **Webhook path** — ถ้าตั้งให้ unique จะเป็น URL ที่ต่างจากของคุณ

## เปรียบเทียบกับของคุณ

หลังทำ Workshop 1 จบ ลองดู solution นี้เพื่อ:
- เช็คว่าโครงสร้าง node ตรงกันไหม
- ดูว่ามี node อะไรที่เราข้ามไป
- ดู expression ใน Set node ว่าเขียนถูกไหม

## ⚠️ ห้ามดูก่อนทำ

Workshop 1 เป้าหมายคือ "ทำเอง" ไม่ใช่ "copy เฉลย"
- ถ้าติด → ดู [troubleshooting.md](../troubleshooting.md) ก่อน
- ถ้ายังไม่ได้ → เปิดเฉลยดู หลังจากพยายามเอง 15 นาทีแล้ว
