# Workshop 2: Troubleshooting

---

## ❌ Sign in with Google ไม่ขึ้น popup

**สาเหตุ:** browser block popup

**วิธีแก้:** อนุญาต popup สำหรับ `workflow.ku.ac.th` ที่ icon รูปกุญแจในแถบ URL

---

## ❌ "Access blocked: This app's request is invalid"

**สาเหตุ:** OAuth redirect URI ไม่ตรง

**วิธีแก้:**
1. แจ้ง TA — Google Cloud Console ของ สบค. ต้องเพิ่ม callback URL
2. หรือใช้ Google account ที่ทาง สบค. ให้ในห้อง (มีตั้งไว้แล้ว)

---

## ❌ Gmail node ค้นไม่เจอ email

**เช็ค:**
1. Subject ของ email ขึ้นต้นด้วย `[ส่งงาน]` ตรงเป๊ะหรือไม่ (case-sensitive ใน Gmail search)
2. Account ที่ใช้ OAuth ใน n8n เป็น account เดียวกับที่รับ email หรือไม่
3. Filter อาจมี typo — เช็คเครื่องหมาย `:` หลัง `subject`

---

## ❌ Gmail node ค้นได้ แต่ไม่มี `attachments` field

**สาเหตุ:** Simplify Output ตั้งเป็น Off — output ไม่ structured

**วิธีแก้:** เปิด toggle **Simplify Output** ในหน้าตั้งค่า Gmail node

---

## ❌ IF node บอกไม่มี attach แต่จริงๆ มี

**สาเหตุ:** Expression `$json.attachments.length` ผิด — เพราะ Simplify Output อาจคืน `attachments` ใน format อื่น

**วิธีแก้:** ลองเปลี่ยน condition เป็น:
- Left: `{{ $json.attachments }}`
- Operator: `exists` (ใน n8n เรียก `is not empty`)

---

## ❌ Drive Upload error: "File is empty"

**สาเหตุ:** ไม่ได้ตั้ง `Input Data Field Name` ถูก

**วิธีแก้:**
1. ที่ Drive Upload node → ดู `Input Data Field Name`
2. ใส่ชื่อ field binary ที่มาจาก Gmail Download node
3. ปกติจะเป็น `attachment_0` (ไฟล์แรก) — เช็คใน output ของ node ก่อนหน้า

---

## ❌ Drive Upload สำเร็จ แต่ไม่เห็นไฟล์ใน Drive

**เช็ค:**
1. ที่ Drive node เลือก **Parents → Folder** ตรงไหม
2. เปิด Drive ของ account ที่ใช้ OAuth (ไม่ใช่ account อื่น)
3. ดู Recent ใน Drive — ไฟล์อาจอยู่ที่ root ของ Drive ถ้าไม่ได้ตั้ง folder

---

## ❌ Workflow active แล้ว แต่ไม่ทำงานเป็นรอบ

**เช็ค:**
1. Schedule node ตั้ง interval ถูกไหม (เช่น Every 1 Minute)
2. เปิด Executions tab ทางซ้าย — มี run ใหม่ๆ ขึ้นหรือไม่
3. ถ้าไม่มี run เลย — toggle Inactive แล้ว Active อีกครั้ง

---

## ❌ Email ถูกดึงซ้ำๆ ทุกรอบ Schedule

**สาเหตุ:** ไม่ได้ Mark as Read หรือไม่ใส่ filter `is:unread`

**วิธีแก้:**
1. ใน Gmail Get Many → filter ใส่ `is:unread` ด้วย
2. ที่ขั้นตอนสุดท้าย — Mark as Read ให้ email ที่ดึงไปแล้ว
3. หรือใช้ Add Label `Archived` แล้ว filter `-label:Archived`

---

## ❌ ไฟล์ใน Drive ทับกันชื่อซ้ำ

**ลอง:** ใส่ timestamp ใน filename:
```
{{ $('Gmail').item.json.subject }}_{{ DateTime.now().toFormat('yyyyMMdd_HHmm') }}_{{ $json.binary.attachment_0.fileName }}
```

---

## ❌ Multi-attach: ดึงได้แค่ไฟล์แรก

**สาเหตุ:** workflow loop เฉพาะ email level — ไม่ได้ loop ที่ attachment level

**วิธีแก้ (advanced — มี slide ใน Session 3 ครอบคลุม):**
1. ใช้ **Loop Over Items** node หลัง Gmail Download
2. หรือใช้ Code node แยก binary field เป็นหลาย items ก่อน upload

---

## 💡 Tips

- **ทดสอบ Schedule แค่ 1 ครั้ง** — กด **Execute Workflow** ครั้งเดียวพอ ไม่ต้องรอ schedule fire
- **ปิด workflow ตอน debug** — เพราะถ้า active ระหว่างแก้ จะมี run ซ้อนๆ
- **ตั้ง Drive folder เป็น Workspace ของ workshop** — อย่าใส่ไฟล์รก Drive ส่วนตัว

---

## ถ้ายังแก้ไม่ได้

1. ยกมือเรียก **TA**
2. โพสต์ใน **LINE กลุ่ม** พร้อม:
   - screenshot node ที่ติด
   - output JSON ของ node ก่อนหน้า (ปกปิด email address ก่อนโพสต์)
