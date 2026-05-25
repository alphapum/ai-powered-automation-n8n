# 🧪 Examples — Workflow ทดสอบ + Reference

workflow ตัวอย่างที่ **ไม่ใช่** workshop หลัก — ใช้ทดสอบระบบ / เป็น reference / debug

---

## 📁 รายการ

### [Test_KU_LLM_Gateway/](Test_KU_LLM_Gateway/)

ทดสอบ KU LLM Gateway endpoints (chat + embedding) — มี 2 workflow:

| ไฟล์ | ใช้ทำอะไร |
|------|----------|
| `workflow.json` | Test แบบ end-to-end: Manual → Chat (`/llm2/v1/chat/completions`) → Embed (`/llm/v1/embeddings`) → Report |
| `workflow-find-embed-url.json` | URL probe — ลอง 5 URL variants เพื่อหาว่า embed endpoint อยู่ไหน |

⚠️ **Key Finding:** Chat ใช้ `/llm2/` แต่ Embedding ใช้ `/llm/` (ไม่มี "2") — service แยกกัน!

ดู [Test_KU_LLM_Gateway/README.md](Test_KU_LLM_Gateway/README.md) สำหรับรายละเอียด

---

## 🚀 เพิ่ม example ใหม่

ถ้าคุณสร้าง workflow น่าสนใจที่ไม่ใช่ workshop → contribute ได้!

```
Examples/
└── Your_Example_Name/
    ├── README.md         ← อธิบายว่า workflow ทำอะไร / ใช้ตอนไหน
    ├── workflow.json     ← n8n workflow export
    └── screenshots/      ← (optional) ภาพหน้าจอ
```

ส่ง PR — ดู [PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)

---

## 💡 Use Cases ของ Examples

- 🧪 **Test:** ทดสอบว่า service ภายนอก (เช่น KU LLM) ใช้ได้มัย
- 🔧 **Debug:** ลด workflow ให้เล็กที่สุดเพื่อหา bug
- 📚 **Reference:** แสดง pattern การใช้ node แบบ specific (เช่น HTTP Request กับ custom headers)
- 🎓 **Learning:** ผู้เรียนเอาไป fork + ดัดแปลง

---

## 🔐 หมายเหตุ API Keys

ใน `workflow.json` ที่ commit ลง repo — **อย่าใส่** API key จริง

ใช้ placeholder แทน:

```json
{
  "headers": {
    "apikey": "YOUR_KU_LLM_API_KEY_HERE"
  }
}
```

ผู้ใช้จะต้องมา replace ก่อน import — เป็น security practice ที่ดี
