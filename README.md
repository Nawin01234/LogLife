# Accounting System - Expense Tracker

ระบบบัญชีรายรับรายจ่ายแบบสมบูรณ์ ด้วย React Frontend และ Go Backend พร้อม PostgreSQL Database

## 📁 โครงสร้างโปรเจกต์

```
Accounting/
├── frontend/               # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities (translations, etc)
│   │   ├── App.tsx
│   │   └── index.css
│   ├── .env.local
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                # Go + Gin + PostgreSQL
    ├── config/             # Configuration
    ├── database/           # Database setup
    ├── handlers/           # API handlers
    ├── models/             # Data models
    ├── main.go
    ├── go.mod
    └── .env
```

## 🚀 ติดตั้งและรันโปรเจกต์

### Backend (Go)

1. **ติดตั้ง PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql
```

2. **สร้าง Database**
```bash
createdb accounting
```

3. **ติดตั้ง Go dependencies**
```bash
cd backend
go mod download
```

4. **รันเซิร์ฟเวอร์ Backend**
```bash
go run main.go
```
Backend จะรันที่ `http://localhost:8080`

### Frontend (React)

1. **ติดตั้ง Dependencies**
```bash
cd frontend
npm install
```

2. **รันเซิร์ฟเวอร์ Frontend**
```bash
npm run dev
```
Frontend จะรันที่ `http://localhost:5173`

## ✨ ฟีเจอร์

✅ **บันทึกค่าใช้จ่าย**
- เลือกหมวดหมู่ (อาหาร/ของใช้/อื่นๆ)
- ระบุจำนวนเงิน วันที่ และรายละเอียด

✅ **ดูประวัติค่าใช้จ่าย**
- กรองตามวัน เดือน หรือปี
- สรุปยอดรวมตามหมวดหมู่
- ลบรายการได้

✅ **รองรับ 2 ภาษา**
- ไทย
- อังกฤษ

✅ **ธีมสวยและเรียบร้อย**
- ใช้ Tailwind CSS
- Responsive design
- Modern UI

## 🔌 API Endpoints

### Expenses
- `POST /api/expenses` - สร้างค่าใช้จ่ายใหม่
- `GET /api/expenses?period=day&date=2026-05-09` - ดึงรายการค่าใช้จ่าย
- `GET /api/expenses/summary?period=day&date=2026-05-09` - ดึงสรุปค่าใช้จ่าย
- `DELETE /api/expenses/:id` - ลบค่าใช้จ่าย

## 🛠 Configuration

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8080/api
```

### Backend (.env)
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=accounting
```

## 📝 สถานะข้อมูล

ข้อมูลจะถูกเก็บใน PostgreSQL ฐานข้อมูล โดยจะสร้างตารางอัตโนมัติเมื่อรันแอปครั้งแรก

## 🎨 Customization

### เปลี่ยนสี Theme
แก้ไข `frontend/tailwind.config.js`

### เพิ่มหมวดหมู่ใหม่
1. แก้ไข `backend/models/expense.go` - เพิ่ม category validation
2. แก้ไข `frontend/src/types/index.ts` - เพิ่ม ExpenseCategory type
3. แก้ไข `frontend/src/utils/translations.ts` - เพิ่มชื่อหมวดหมู่

## 🐛 Troubleshooting

**Frontend ไม่สามารถเชื่อมต่อ Backend**
- ตรวจสอบว่า Backend กำลังรันที่ port 8080
- ตรวจสอบ `.env.local` ว่า API URL ถูกต้อง

**Database Connection Error**
- ตรวจสอบว่า PostgreSQL กำลังรัน
- ตรวจสอบค่า `.env` ของ Backend ว่าถูกต้อง

## 📄 License

MIT
