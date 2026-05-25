# Test KU LLM Gateway

> **Workflow ทดสอบระบบ KU LLM Gateway** (`apigw.ku.ac.th`)
> ทดสอบ Chat Completion + Embeddings และสรุปผล

## ระบบที่ทดสอบ

**KU LLM Gateway** — OpenAI-compatible API ของมหาวิทยาลัยเกษตรศาสตร์
- **Authentication:** Header `apikey: XXX` (ไม่ใช่ `Authorization: Bearer`)
- **API Key (ของคุณ):** `YOUR_KU_LLM_API_KEY_HERE`

### Endpoints ที่ workflow นี้เทส

| Endpoint | Path (ทดสอบแล้ว) | Model | จุดประสงค์ |
|----------|-----|-------|------------|
| Chat Completion | `/llm2/v1/chat/completions` (มี `2`) | `mistralai/Mistral-7B-Instruct-v0.3` | LLM ตอบข้อความ |
| Embeddings | `/llm/v1/embeddings` (**ไม่มี** `2`) | `BAAI/bge-m3` | สร้าง vector 1024 dims |

> ⚠️ **สำคัญ:** KU แยก 2 service ที่ prefix **ต่างกัน**:
> - chat = `/llm2/...`
> - embed = `/llm/...`
>
> (ยืนยันจาก URL probe — ดู [`workflow-find-embed-url.json`](workflow-find-embed-url.json))

## โครงสร้าง Workflow

```
                 ┌─→ Test Chat Completion ─→ Extract Chat ──┐
Manual Trigger ──┤                                          ├→ Merge → 📋 Report
                 └─→ Test Embeddings ──→ Extract Embed ────┘
```

**7 nodes:**
1. **เริ่มทดสอบ (Manual)** — กดทดสอบเอง
2. **Test Chat Completion** — HTTP POST → Mistral 7B (body ฝัง prompt ไว้)
3. **Test Embeddings** — HTTP POST → BAAI/bge-m3 (parallel)
4. **Extract Chat Result** — แยก fields ใช้ prefix `chat_*`
5. **Extract Embedding Result** — แยก fields ใช้ prefix `embed_*`
6. **Merge ผลทดสอบ** — รวม 2 ผลลัพธ์ (clashHandling: addSuffix)
7. **📋 สรุปผลทดสอบ** — สร้าง report พร้อม PASS/FAIL + raw_keys/raw_preview ไว้ debug

> **เปลี่ยนจาก v1:** ลบ Config node ออก เพราะการใช้ `{{ $json.test_text }}` ใน JSON body ของ HTTP Request ทำให้ embed test ล้มเหลว (n8n บางครั้ง parse JSON ไม่ถูกเมื่อมี expression ฝังใน body) — v2 ฝัง prompt/input ไว้ใน body ตรงๆ

## วิธีใช้

### 1. Import workflow

1. เปิด n8n → **`+ Add workflow`** → **`Import from File`**
2. เลือก [`workflow.json`](workflow.json)
3. n8n จะสร้าง workflow ใหม่ชื่อ `Test-KU-LLM-Gateway`

### 2. ทดสอบ

1. กด **Execute Workflow** (มุมขวาบน)
2. n8n รันทั้ง 8 nodes — ใช้เวลาประมาณ 5-15 วินาที
3. ดู output ของ node **📋 สรุปผลทดสอบ** → field `report`

### 3. ตัวอย่างผลลัพธ์

ถ้าระบบทำงานปกติ จะเห็น (ใน output ของ node **📋 สรุปผลทดสอบ** field `report`):

```
📊 KU LLM Gateway — Test Report
=====================================
🕒 Tested: 2026-05-23 15:30:08

┌─ Test 1: Chat Completion ──────────────────
│ Status:  ✅ PASS
│ Model:   mistralai/Mistral-7B-Instruct-v0.3
│ Tokens:  prompt=44 | completion=87 | total=131
│ Finish:  stop
│ Reply:   n8n เป็นเครื่องมือ workflow automation แบบ low-code...
│ Keys:    id, object, created, model, choices, usage
└─────────────────────────────────────────────

┌─ Test 2: Embeddings ───────────────────────
│ Status:  ✅ PASS
│ Model:   BAAI/bge-m3
│ Vector:  1024 dims
│ Tokens:  18
│ Sample:  [-0.039,-0.011,0.002,0.016,-0.002]
│ Keys:    id, object, created, model, data, usage
│ Preview: {"id":"embd-...","object":"list","created":...
└─────────────────────────────────────────────

🎉 ALL TESTS PASSED — Gateway healthy
```

### Debug fields (ใหม่ใน v2)

ถ้า test ไม่ PASS ดู:
- **`chat_raw_keys`** / **`embed_raw_keys`** — รายการ field ที่ API คืนมาจริงๆ (เช็คได้ว่ามี `choices`/`data` ไหม)
- **`embed_raw_preview`** — 300 ตัวอักษรแรกของ response (เห็น error message ของ API)
- **Output ของ node `Extract Chat Result` / `Extract Embedding Result`** — ดู field แต่ละตัว
- **Output ของ HTTP Request nodes** — ดู raw response เต็มๆ

## ปรับแต่ง

### เปลี่ยน prompt ทดสอบ

แก้ที่ node **Config — กำหนดข้อมูลทดสอบ**:
- `test_prompt` — คำถามสำหรับ Chat Completion
- `test_embedding_text` — ข้อความสำหรับ Embeddings

### เปลี่ยน model

ดู [model.md](../../../docs/ku-llm-models.md) (ถ้ามี) หรือถาม KU LLM Gateway team

แก้ที่ Body ของ HTTP Request node:
- Chat Completion: เปลี่ยน `"model": "..."`
- Embeddings: เปลี่ยน `"model": "..."`

### เพิ่ม test cases

- duplicate HTTP Request + Extract นั่นๆ
- เชื่อม merge เพิ่ม input
- ปรับ report template

## ⚠️ Security Note

API key `YOUR_KU_LLM_API_KEY_HERE` ใน workflow นี้เป็นของ **คุณ** (เห็นจาก screenshot ที่ส่งให้)

**แนะนำ:**
1. ใน production — ย้าย key ไปเก็บเป็น **n8n Credentials** ไม่ใช่ใส่ตรงๆ ใน JSON
2. **อย่า commit** ไฟล์นี้ลง public GitHub โดยไม่ลบ key ก่อน
3. ถ้า key หลุดในที่อื่น — request key ใหม่จาก KU IT

### วิธีย้ายไปใช้ n8n Credential (แนะนำ)

1. ที่ HTTP Request node → **Authentication** → `Generic Credential Type` → `Header Auth`
2. Create New Credential:
   - **Header Name:** `apikey`
   - **Header Value:** `YOUR_KU_LLM_API_KEY_HERE`
   - Save as `KU LLM Gateway`
3. ลบ `apikey` ออกจาก `Specify Headers → Using JSON`

## เอาไปปรับใช้

Workflow นี้คือ **pattern พื้นฐาน** ของการเรียก LLM API จาก n8n — ปรับไปใช้:

| งาน | ปรับยังไง |
|-----|-----------|
| **Chatbot นิสิต** | แทน Manual Trigger ด้วย Webhook + ผูก LINE/Discord |
| **สรุปเอกสาร** | ใส่ enkele PDF content เป็น user message |
| **จัดประเภท email** | system message = "แยกประเภท email นี้" |
| **RAG search** | Embedding → query Vector DB → ตอบ |
| **Multi-step** | Chat result → ส่งให้ Chat รอบ 2 (chain) |

## Troubleshooting

| ปัญหา | สาเหตุ + วิธีแก้ |
|-------|-------------------|
| `401 Unauthorized` | API key ผิด/หมดอายุ — ติดต่อ KU IT |
| `404 Not Found` | URL ผิด — เช็ค base = `https://apigw.ku.ac.th/llm2/v1` |
| `400 Bad Request` | model name ผิด หรือ messages format ผิด |
| `Timeout` | LLM ตอบช้า — เพิ่ม `timeout` ใน node options |
| `prompt_tokens=0` | Response ไม่มี `usage` — แสดงว่า error ในระบบ check `$json.error` |

## เกี่ยวข้องกับ Workshop ไหน

Workflow ทดสอบนี้เป็นพื้นฐานของ:
- **Workshop 5: สรุปเบิกจ่าย + AI** (วัน 2) — ใช้ Chat Completion เพื่อสรุป
- **Session 4: AI Integration** — sessions explanation ของวิธีเรียก LLM
- **Foundation → Applied** — ในรอบ Applied จะลึกขึ้นเรื่อง RAG (ใช้ Embeddings)
