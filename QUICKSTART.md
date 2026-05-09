## 🚀 Quick Start Guide

### Option 1: Using Docker (Recommended)

**1. เตรียม PostgreSQL ด้วย Docker**
```bash
make docker-up
```

**2. ติดตั้ง Backend Dependencies**
```bash
make install-backend
```

**3. ติดตั้ง Frontend Dependencies**
```bash
make install-frontend
```

**4. เปิด Terminal 2 หน้าต่าง**

Terminal 1 - รัน Backend:
```bash
make backend
```

Terminal 2 - รัน Frontend:
```bash
make frontend
```

**5. เปิดเบราว์เซอร์**
```
http://localhost:5173
```

---

### Option 2: Manual Setup

**1. ติดตั้ง PostgreSQL (ถ้ายังไม่มี)**

macOS:
```bash
brew install postgresql
brew services start postgresql
createdb accounting
```

Linux (Ubuntu):
```bash
sudo apt install postgresql
sudo -u postgres createdb accounting
```

**2. Backend Setup**
```bash
cd backend
go mod download
go run main.go
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 ใช้งาน

1. **บันทึกค่าใช้จ่าย**
   - คลิก "➕ บันทึกค่าใช้จ่าย"
   - กรอกรายละเอียด จำนวนเงิน หมวดหมู่ และวันที่
   - คลิก "บันทึก"

2. **ดูประวัติ**
   - คลิก "📊 ประวัติค่าใช้จ่าย"
   - เลือกช่วงเวลา (วัน/เดือน/ปี)
   - ดูสรุปและรายการค่าใช้จ่าย

3. **เปลี่ยนภาษา**
   - ที่ด้านซ้าย เลือก "ไทย" หรือ "English"

---

## 🔧 Troubleshooting

**Backend ไม่สามารถเชื่อมต่อ Database**
- ตรวจสอบ PostgreSQL ว่ากำลังรัน
- ตรวจสอบ `.env` ว่าเสร็จสมบูรณ์ถูกต้อง

**Frontend ไม่สามารถเชื่อมต่อ Backend**
- ตรวจสอบว่า Backend กำลังรัน (port 8080)
- ตรวจสอบ CORS settings ใน backend

**Port 5173 หรือ 8080 ใช้อยู่แล้ว**
```bash
# ลบ port ที่ใช้
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Backend
```

---

## 📞 Support

หากมีปัญหา ให้ตรวจสอบ:
- PostgreSQL ทำงานปกติ
- Go และ Node.js ถูกติดตั้ง
- Ports 5173, 8080, 5432 ว่าง
