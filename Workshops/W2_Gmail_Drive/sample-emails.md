# Workshop 2: ตัวอย่าง Email สำหรับทดสอบ

ในห้อง Workshop คุณจะส่ง email หาตัวเองเพื่อทดสอบ — ใช้รูปแบบนี้

## รูปแบบ Subject

ทุก email ที่จะให้ workflow จับ ต้องขึ้นต้น subject ด้วย `[ส่งงาน]`

✅ **ใช้ได้:**
- `[ส่งงาน] รายงาน week 1`
- `[ส่งงาน] CSC101 - assignment 2`
- `[ส่งงาน] ขออนุมัติงบ ไตรมาส 2`

❌ **ใช้ไม่ได้** (workflow จะไม่จับ):
- `ส่งงาน รายงาน` (ไม่มี `[` `]`)
- `Submission: report` (ไม่มี `[ส่งงาน]`)

## ตัวอย่าง Email ที่ครบ

### Email #1 — เอกสารทั่วไป

```
To: your-email@gmail.com
Subject: [ส่งงาน] ทดสอบ workshop W2 #1

Body:
สวัสดีค่ะ
แนบเอกสารทดลองมาด้วย
ขอบคุณค่ะ

Attachment: test-document.pdf (เอกสาร PDF เปล่าใดก็ได้ ~100KB)
```

### Email #2 — ไฟล์ Word

```
To: your-email@gmail.com
Subject: [ส่งงาน] รายงานประจำสัปดาห์ - สมชาย

Body:
รายงานสัปดาห์ที่ 1 ครับ
รบกวนตรวจสอบด้วย

Attachment: weekly-report-2026-05-26.docx
```

### Email #3 — Multi-attach

```
To: your-email@gmail.com
Subject: [ส่งงาน] ใบเสร็จเดือน พฤษภาคม

Body:
รวมใบเสร็จ 3 ใบ ของเดือนนี้

Attachments:
- receipt-001.pdf
- receipt-002.pdf
- receipt-003.pdf
```

## วิธีสร้าง PDF ทดสอบเร็วๆ

ถ้าไม่มีไฟล์ PDF ทดสอบ — ใช้วิธีนี้:

1. เปิด Google Docs → พิมพ์อะไรก็ได้ 1-2 บรรทัด
2. File → Download → PDF (`.pdf`)
3. ใช้ไฟล์นี้แนบ email

หรือใช้ที่มีอยู่:
- เอกสารราชการ (ใบลา / ใบรับรอง)
- screenshot ของ slide
- ไฟล์ PDF ใน Drive ที่มีอยู่แล้ว

## ตัวอย่าง JSON ที่ Gmail node จะคืนมา

หลัง execute Gmail (Get Many) — output หน้าตาประมาณนี้:

```json
[
  {
    "id": "18d2a3b4c5f6e7",
    "threadId": "18d2a3b4c5f6e7",
    "labelIds": ["UNREAD", "CATEGORY_PRIMARY", "INBOX"],
    "snippet": "สวัสดีค่ะ แนบเอกสารทดลองมาด้วย...",
    "subject": "[ส่งงาน] ทดสอบ workshop W2 #1",
    "from": "your-email@gmail.com",
    "to": "your-email@gmail.com",
    "date": "2026-05-26T14:23:11Z",
    "attachments": [
      {
        "id": "ANGjdJ...",
        "filename": "test-document.pdf",
        "mimeType": "application/pdf",
        "size": 102400
      }
    ]
  }
]
```

## หลังจาก Download (Gmail node ตัวที่ 2)

```json
{
  "id": "18d2a3b4c5f6e7",
  "subject": "[ส่งงาน] ทดสอบ workshop W2 #1",
  ...
  "binary": {
    "attachment_0": {
      "fileName": "test-document.pdf",
      "mimeType": "application/pdf",
      "fileSize": "100 KB"
    }
  }
}
```

> 💡 **`attachment_0`** = ไฟล์ที่ 1 (ถ้ามีหลายไฟล์: `attachment_0`, `attachment_1`, ...)
