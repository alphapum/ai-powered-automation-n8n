# Workshop 5: Troubleshooting

ปัญหาที่พบบ่อยใน Workshop 5 — รวมโดยเฉพาะส่วน AI / HTTP Request / Code node

---

## ❌ Google Sheets node อ่านไม่ได้ — "Could not find resource"

**อาการ:** Sheets node ขึ้นแดง — error `404 Not Found` หรือ `Could not find resource`

**สาเหตุ + วิธีแก้:**

1. **เลือก Document ผิด** — ใน Sheets node ตรวจสอบ Document field — เลือกชื่อไฟล์ถูกหรือไม่
2. **Sheet (tab) ผิดชื่อ** — ค่าเริ่มต้นน่าจะเป็น `Sheet1` แต่ถ้าคุณเปลี่ยนชื่อ tab — ต้องเลือกใหม่
3. **Account ที่ใช้ OAuth ไม่มีสิทธิ์** — Sheet เป็นของอีก Google account หนึ่ง
   - แก้: Share Sheet ให้ account ที่ใช้ OAuth (กด Share → เพิ่ม email)
4. **Sheet ถูกลบหรือเปลี่ยน URL** — สร้าง Sheet ใหม่จาก [sample-data.md](sample-data.md) แล้ว Re-link

---

## ❌ Google Sheets — amount เป็น string ไม่ใช่ number

**อาการ:** ใน output ของ Sheets node `"amount": "1250"` มี quotes — ไม่ใช่ `1250`

**สาเหตุ:** Cell format ใน Sheet เป็น Plain Text หรือมีช่องว่าง

**วิธีแก้:**

1. ใน Sheet → คลุมเซลล์คอลัมน์ amount → **Format → Number → Plain Number**
2. หรือใน Code node — โค้ดมี `Number(row.amount) || 0` แปลงให้แล้ว ใช้งานได้
3. ถ้ายัง error → เช็คว่ามี space ใน cell หรือไม่ — `" 1250"` กับ `"1250"` ก็แปลงเป็น Number ได้ แต่ `"1,250"` (มี comma) จะแปลงเป็น `NaN`
   - แก้: Format → Number → Plain (ไม่ใส่ thousand separator)

---

## ❌ Code node ขึ้น Error: `Cannot read property 'json' of undefined`

**อาการ:** Code node ขึ้นแดง — error ตามด้านบน

**สาเหตุ:** node ก่อนหน้า (Google Sheets) ไม่มี output หรือ output ว่าง

**วิธีแก้:**

1. กด Execute step ของ Google Sheets node ก่อน — เช็คว่ามี items ออกมาจริง
2. ถ้า items = 0 (เพราะ filter `status = approved` ไม่เจอ row ไหน) — เพิ่ม row ที่ approved ใน Sheet
3. เช็คโค้ดบรรทัด `const items = $input.all();` — ถ้าใช้ `$input.first()` แทนจะเจอ error นี้

---

## ❌ Code node สรุปยอดผิด — บาง category หาย

**อาการ:** บางหมวดในตารางมีจริง แต่ใน `categories` ของ Code output ไม่มี

**สาเหตุ:**

1. **`category` มี whitespace** — `"ค่าวัสดุสำนักงาน "` กับ `"ค่าวัสดุสำนักงาน"` (มี space ท้าย) ถูกนับเป็นคนละหมวด
2. **`category` ตัวพิมพ์ต่างกัน** — JavaScript case-sensitive

**วิธีแก้:**

1. ใน Sheet — เช็คให้ทุก row ใช้ category string เหมือนกันเป๊ะ (ไม่มี space ก่อน/หลัง)
2. แก้โค้ดให้ trim: เปลี่ยน `const category = row.category || 'ไม่ระบุ';` เป็น `const category = (row.category || 'ไม่ระบุ').trim();`

---

## ❌ HTTP Request — `401 Unauthorized`

**อาการ:** HTTP Request node ขึ้นแดง — error `401`

**สาเหตุ:** API key ผิด หรือ Header ผิด format

**วิธีแก้:**

1. **เช็ค Header field name** — ต้องเป็น `apikey` (ตัวเล็กทั้งหมด)
   - ❌ `ApiKey` / `API-Key` / `X-API-Key` — ใช้ไม่ได้
   - ❌ `Authorization: Bearer XXX` — ใช้ไม่ได้ (KU LLM Gateway ไม่ใช้ Bearer)
2. **เช็ค API key** — copy ตรงๆ จาก [README.md](README.md) — `YOUR_KU_LLM_API_KEY_HERE`
   - ห้ามมี space หน้า/หลัง
   - ห้ามมี quote ครอบ key
3. **ลองทดสอบ Test Workflow ของ KU LLM Gateway:**
   - ไปที่ `08_Workshop_KU/Examples/Test_KU_LLM_Gateway/workflow.json`
   - Import → Execute → ถ้า test workflow ทำงาน = API key ดี → ปัญหาอยู่ที่ workshop ของคุณ
4. **API key หมดอายุ / โดน revoke** — แจ้ง TA หรือ KU IT ขอ key ใหม่

---

## ❌ HTTP Request — `404 Not Found`

**อาการ:** error `404`

**สาเหตุ:** URL ผิด

**วิธีแก้:**

URL ที่ถูกต้องคือ:
```
https://apigw.ku.ac.th/llm2/v1/chat/completions
```

ระวัง:
- ❌ `https://apigw.ku.ac.th/llm/v1/chat/completions` — `/llm/` (ไม่มี 2) คือ endpoint ของ embeddings ไม่ใช่ chat
- ❌ `https://apigw.ku.ac.th/v1/chat/completions` — ไม่มี `/llm2`
- ❌ `https://apigw.ku.ac.th/llm2/chat/completions` — ขาด `/v1`

จำง่ายๆ: **Chat = `/llm2/` (มี 2), Embed = `/llm/` (ไม่มี 2)**

---

## ❌ HTTP Request — `400 Bad Request`

**อาการ:** error `400` — ใน response body มี error message

**สาเหตุที่พบบ่อย:**

1. **JSON body ผิด syntax** — เครื่องหมาย `,` / `"` ขาด
   - แก้: copy JSON template จาก [GUIDE.md](GUIDE.md) Step 6 ตรงๆ
2. **Model name ผิด** — ต้องเป็น `mistralai/Mistral-7B-Instruct-v0.3` (เป๊ะๆ)
   - ❌ `mistral-7b` / `Mistral-7B` / `mistralai/mistral-7b`
3. **Messages format ผิด** — ต้องเป็น array ของ object ที่มี `role` + `content`
   ```json
   "messages": [
     {"role": "system", "content": "..."},
     {"role": "user", "content": "..."}
   ]
   ```
4. **Expression `{{ }}` ไม่แทนค่า** — ใน JSON body ถ้าเขียน `{{ $json.month }}` แล้วเห็นเป็นข้อความตรงๆ ใน request — แสดงว่า expression mode ไม่เปิด
   - แก้: ใน HTTP Request น่ะ JSON body รองรับ expression อยู่แล้ว แต่ต้องเขียนตรง format

ดู response body เต็มๆ จะเห็น error message ที่บอกว่าอะไรผิด

---

## ❌ HTTP Request — Timeout

**อาการ:** รอ 30 วินาทีแล้วยังไม่ตอบ — error timeout

**สาเหตุ:** KU LLM Gateway ใช้เวลาตอบนานในช่วง peak

**วิธีแก้:**

1. **กดอีกครั้ง** — บางครั้งเรียกใหม่ก็ตอบทันที
2. **เพิ่ม timeout** — ที่ HTTP Request node → Options → Timeout = `60000` (60 วินาที)
3. **ลด `max_tokens`** — ใน body เปลี่ยน `"max_tokens": 400` → `"max_tokens": 200` (response สั้นลง = เร็วขึ้น)
4. **เปลี่ยน prompt** — ใน user message สั้นลง — ส่งข้อมูลที่จำเป็นเท่านั้น

---

## ❌ AI ตอบกลับมาเป็นภาษาอังกฤษ ไม่ใช่ไทย

**อาการ:** AI สรุปออกมาเป็น "In May 2026, the department spent..."

**สาเหตุ:** System prompt ไม่เน้นภาษาไทยเพียงพอ หรือ user message มีคำศัพท์อังกฤษเยอะ

**วิธีแก้:**

แก้ system message ให้ explicit ขึ้น:

```
คุณคือผู้ช่วยวิเคราะห์ค่าใช้จ่ายของหน่วยงานราชการไทย
**คำตอบของคุณต้องเป็นภาษาไทยเท่านั้น** ห้ามใช้ภาษาอังกฤษ
จงสรุปข้อมูลเป็นภาษาไทย 3-4 ประโยค...
```

> 💡 Mistral 7B เข้าใจไทยแต่บางครั้งจะ "เผลอ" ตอบอังกฤษ — บอกย้ำให้ตอบไทยใน prompt

---

## ❌ AI สรุปยอดผิด — ไม่ตรงกับ data จริง

**อาการ:** AI บอก "ยอดรวม 50,000 บาท" แต่จริงๆ 17,660 บาท

**สาเหตุ:**

1. **AI หลอน (hallucinate)** — Mistral 7B บางครั้งสร้างตัวเลขเอง
2. **Prompt ส่ง data ไม่ครบ** — `summary_text` ไม่มียอดรวม

**วิธีแก้:**

1. **ตรวจ prompt** — เช็คว่า user message มี grand_total + รายละเอียดทุกหมวดครบ
2. **ใส่ instruction ใน prompt:**
   ```
   ห้ามคำนวณตัวเลขเอง — ใช้ตัวเลขจาก data ที่ให้มาตรงๆ
   ห้ามคิดเลขเพิ่ม / ลด / คูณ / หาร
   ```
3. **ลด temperature** — เปลี่ยน `"temperature": 0.3` → `0.1` (AI จะเชื่อข้อมูลมากขึ้น สุ่มน้อยลง)
4. **ถ้ายังหลอน** — เปลี่ยน strategy: ให้ AI สรุปแบบ "qualitative" (วิเคราะห์) ไม่ให้พูดตัวเลข แล้วเราใส่ตัวเลขเองใน Set node

---

## ❌ Expression ใน Set node ไม่ดึงค่า — แสดง `{{ $('Code').item.json.month }}` ตรงๆ

**อาการ:** ใน email body เห็นข้อความ `{{ $('Code').item.json.month }}` แทนค่าจริง

**สาเหตุ:** Field value ไม่ได้อยู่ใน Expression mode

**วิธีแก้:**

1. ใน Set node คลิกที่ค่า field
2. ดูที่ tab/toggle ด้านบนช่อง value — เปลี่ยนจาก **Fixed** → **Expression** (หรือคลิก icon `fx`)
3. ค่าจะกลายเป็นสีฟ้า + แสดง preview ของผลลัพธ์

---

## ❌ Set Node — ดึงค่าจาก node ก่อนหน้านั้นไม่ได้

**อาการ:** ใน Set node อยากดึงค่าจาก Code node (ที่อยู่ก่อน HTTP Request) — แต่ใช้ `{{ $json.month }}` แล้วได้ค่าจาก HTTP Request แทน

**สาเหตุ:** `$json` หมายถึง output ของ **node ก่อนหน้าทันที** (HTTP Request) — ไม่ใช่ Code node

**วิธีแก้:**

ใช้ `$('ชื่อ node').item.json.field`:

- `{{ $json.choices[0].message.content }}` — ดึงจาก HTTP Request (node ก่อน)
- `{{ $('Code').item.json.month }}` — ดึงจาก node ชื่อ "Code"
- `{{ $('Google Sheets').item.json.amount }}` — ดึงจาก Google Sheets node

> 💡 **เคล็ดลับ:** ในช่อง Expression ของ n8n — กดปุ่ม **fx** ด้านขวาช่อง — จะเห็น tree ของ node ทั้งหมด คลิกเลือกได้

---

## ❌ Gmail — Send Failed

**อาการ:** Gmail node แดง — error message ต่างๆ

**เช็ค:**

1. **Email To ถูก format ไหม** — `user@gmail.com` (ไม่มี space, มี @, มี domain)
2. **Gmail OAuth ยังใช้ได้ไหม** — บางครั้ง Google revoke token หลังนานๆ
   - แก้: ใน Credentials → Re-authenticate
3. **Quota limit** — Gmail API ส่งได้ ~500 email/วัน ต่อ account — ใน workshop ไม่น่าถึง
4. **Subject / Body ว่าง** — ถ้า expression ดึงค่าจาก node ก่อนหน้าไม่ได้ → empty → Gmail ปฏิเสธ

---

## ❌ Email มาถึง แต่เป็น `?????` ทั้งหมด

**อาการ:** ภาษาไทยใน email แสดงเป็น `?` แทนตัวอักษร

**สาเหตุ:** Content-Type ไม่ระบุ UTF-8

**วิธีแก้:**

1. ที่ Gmail node → **Options** → **Append Attribution / Recipients:** ปิด toggle
2. หรือเปลี่ยน Email Type จาก `Text` → `HTML` (HTML ขีกใช้ UTF-8 ดีกว่า)

---

## ❌ "ไม่อยากใส่ API key ตรงๆ ใน workflow"

**เหตุผล:** ใน production ไม่ควรเห็น API key ใน workflow JSON

**วิธีแก้:** ย้ายไปเก็บเป็น n8n Credential

1. ใน HTTP Request node → **Authentication** → เปลี่ยนจาก `None` → `Generic Credential Type` → `Header Auth`
2. กด **Create New Credential:**
   - **Name:** `KU LLM Gateway`
   - **Header Name:** `apikey`
   - **Header Value:** `YOUR_KU_LLM_API_KEY_HERE`
   - กด **Save**
3. ใน node — ลบ `apikey` ออกจาก `Specify Headers → Using JSON` (เหลือแค่ `Content-Type`)

หลังทำเสร็จ — workflow JSON จะมีแค่ credential reference ไม่มี API key plain text

---

## ❌ ทำงาน 2-3 ครั้งแล้ว AI ตอบช้ามาก / ตอบไม่ได้

**สาเหตุ:** อาจชน rate limit ของ KU LLM Gateway

**วิธีแก้:**

1. รอ 1-2 นาที แล้วลองใหม่
2. **ในงานจริง:** ใส่ delay ระหว่าง request — n8n มี node `Wait` ที่ใส่ระหว่าง workflow ได้
3. **ปริมาณ workshop 119 คน:** ถ้าทำพร้อมกันอาจถึง limit — ทยอยทำตามกลุ่ม

---

## ⚠️ Schedule Trigger — เมื่อ Activate แล้วยิงหลายครั้ง

**ปัญหา:** Cron `0 17 28-31 * *` จะ fire 4 ครั้งใน 4 วัน (28, 29, 30, 31) — workflow จะส่ง email 4 ครั้ง

**วิธีแก้:**

ใน Code node เพิ่ม logic เช็คว่าเป็น "วันสุดท้ายของเดือนจริงๆ":

```javascript
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const isLastDayOfMonth = tomorrow.getMonth() !== today.getMonth();

if (!isLastDayOfMonth) {
  // ยังไม่ใช่วันสุดท้าย — return [] เพื่อหยุด workflow
  return [];
}

// ... โค้ดเดิม
```

หรือ simpler — เปลี่ยน Cron เป็น `0 17 L * *` ถ้า n8n รองรับ `L` (Last day)

---

## 💡 Tips สำหรับ Workshop 5

- **ทดสอบ HTTP Request แยกก่อน** — ก่อนเสียบเข้า workflow ใหญ่ ทดลอง prompt บน [Test_KU_LLM_Gateway](../../Examples/Test_KU_LLM_Gateway/) ก่อน
- **เก็บ AI output ใน Sheet** — เพิ่ม Sheets node ก่อน Gmail เขียน log การส่ง (วันที่ส่ง + summary) — ช่วย audit
- **เปลี่ยน Manual → Schedule ทีหลัง** — ตอน workshop ใช้ Manual ก่อน ค่อยเปลี่ยนเป็น Schedule + Activate หลังเทสต์ครบ
- **อย่าใส่ email ผู้บริหารจริง** ใน workshop — ใช้ email ตัวเอง / TA ก่อน แล้วค่อยเปลี่ยนตอนใช้จริง
- **ส่งหลาย email พร้อมกัน** — ถ้าต้องส่งหลายผู้บริหาร ใช้ Gmail node ตั้ง To = `boss1@ku.ac.th, boss2@ku.ac.th`

---

## ถ้ายังแก้ไม่ได้

1. **ยกมือเรียก TA** — มี 2 คนต่อห้อง
2. โพสต์ใน **LINE กลุ่ม** พร้อม:
   - screenshot node ที่ติด
   - error message
   - output JSON ของ node ก่อนหน้า (ปกปิด API key + email ก่อนโพสต์)
3. **อย่าโพสต์ API key ใน screenshot** — เบลอออกก่อน
4. ลอง **Import solution** [`solution/workflow.json`](solution/workflow.json) มาดูเปรียบเทียบ (หลังพยายามเองสุดทาง)

---

## Reference

- **KU LLM Gateway endpoints:** [memory/ku_llm_gateway_endpoints.md](../../docs/ku-llm-gateway-endpoints.md) (ถ้ามี link)
- **Test workflow:** [`Examples/Test_KU_LLM_Gateway/`](../../Examples/Test_KU_LLM_Gateway/)
- **Mistral 7B docs:** ค้นหา "Mistral 7B Instruct v0.3" ใน Google
- **n8n HTTP Request docs:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
