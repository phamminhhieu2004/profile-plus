# Profile Plus — Phạm Minh Hiếu Personal Portfolio Website

[![CI/CD Pipeline](https://github.com/phamminhhieu2004/profile-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/phamminhhieu2004/profile-plus/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB?logo=react)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%20%2B%20TypeScript-E0234E?logo=nestjs)](https://nestjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

**Profile Plus** là website cá nhân full-stack cao cấp, hiện đại và chuẩn mực dành cho **Phạm Minh Hiếu** — Backend Developer & Sinh viên ngành Kỹ thuật Ô tô tại Đại học Công nghệ Thông tin và Truyền thông (ICTU), Thái Nguyên.

---

## 🌟 Điểm nổi bật & Tính năng (Key Features)

- 🎨 **UI/UX Đỉnh cao**: Thiết kế Dark/Light mode linh hoạt, hiệu ứng Glassmorphism, animations mượt mà với **Framer Motion**, typography tinh tế.
- ⚡ **Full Stack Hiện đại**:
  - **Frontend**: React 19, TypeScript, Vite 8 (Rolldown), Tailwind CSS v4, Zustand, TanStack React Query, i18next (Tiếng Việt & English).
  - **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Throttler (rate limiting), Helmet, Nodemailer, WebSocket Socket.IO.
- 🤖 **AI Chatbot Thông minh**: Tích hợp Google Gemini AI (hỗ trợ streaming response) trả lời câu hỏi của khách truy cập về kỹ năng, kinh nghiệm và thông tin của Hiếu.
- ⛅ **Widget Thời tiết Real-time**: Tích hợp OpenWeatherMap API với định vị tự động hoặc tra cứu thời tiết Thái Nguyên & toàn cầu.
- 📜 **7 Trang nội dung chi tiết**:
  1. **Trang chủ (`/`)**: Hero section với typing effect, stats counter, highlight cards và call-to-action.
  2. **Về tôi (`/about`)**: Thông tin cá nhân, triết lý phát triển, hành trình học vấn (ICTU) và kinh nghiệm làm việc.
  3. **Kỹ năng (`/skills`)**: Biểu đồ radial & progress bar animated cho các kỹ năng Backend (Spring Boot, FastAPI, TensorFlow, Node.js) và Kỹ thuật Ô tô (ECU, OBD-II, EV/Hybrid).
  4. **Dự án (`/portfolio`)**: Bộ lọc danh mục, modal chi tiết dự án, liên kết GitHub & Live Demo.
  5. **Chứng chỉ (`/certificates`)**: Google Gemini Certified Educator, Faculty & Student với Lightbox gallery tương tác và xem trước PDF.
  6. **Blog (`/blog`)**: Danh sách bài viết chuyên sâu về kỹ thuật, tìm kiếm theo tiêu đề, lọc theo tags, trang chi tiết bài viết (`/blog/:id`).
  7. **Liên hệ (`/contact`)**: Form liên hệ bảo mật với validation, gửi email qua Nodemailer và các liên kết mạng xã hội chính thức (GitHub, Facebook, TikTok, Telegram).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend
- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, CSS Variables Design System
- **Animation**: Framer Motion
- **State Management**: Zustand (theme, audio, chatbot state)
- **Data Fetching**: TanStack React Query + Axios
- **Đa ngôn ngữ**: i18next & react-i18next (Việt - Anh)
- **Icons**: Lucide React + Pixel-perfect SVG Brand Icons
- **Notifications**: React Hot Toast

### Backend
- **Core**: NestJS, TypeScript, Express
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Bảo mật**: Helmet, CORS whitelist, `@nestjs/throttler` (chống DDoS & spam)
- **Email Service**: Nodemailer (SMTP)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Realtime**: Socket.IO Gateway & RESTful API

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
profile-plus/
├── assets/                  # Ảnh gốc, chứng chỉ PDF/PNG, logo SVG
├── backend/                 # NestJS Backend API
│   ├── prisma/              # Prisma schema & migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── blog/            # Blog module (Service, Controller, Interface)
│   │   ├── chat/            # Chat module (Gemini AI Service, WebSocket Gateway, Controller)
│   │   ├── contact/         # Contact module (Nodemailer Service, Controller, DTO)
│   │   ├── app.module.ts    # Root application module
│   │   └── main.ts          # Entry point (CORS, Helmet, Validation)
│   ├── Dockerfile           # Multi-stage Docker build
│   └── package.json
├── frontend/                # React Vite Frontend
│   ├── public/              # Static assets (Favicon, certificates, logos)
│   ├── src/
│   │   ├── assets/          # Ảnh avatar, picture minh họa
│   │   ├── components/      # Reusable UI components
│   │   │   ├── chatbot/     # Floating Gemini AI Chatbot Widget
│   │   │   ├── icons/       # Custom SVG Social Icons
│   │   │   ├── layout/      # Navbar, Footer, Layout wrapper
│   │   │   ├── ui/          # FadeIn, ThemeToggle, PageWrapper, Logo
│   │   │   └── weather/     # Real-time Weather Widget
│   │   ├── i18n/            # Bản dịch vi.json & en.json
│   │   ├── pages/           # 7 trang chính của ứng dụng
│   │   ├── store/           # Zustand state store
│   │   └── App.tsx          # Router configuration
│   ├── Dockerfile           # Nginx container
│   ├── nginx.conf           # Reverse proxy & SPA routing config
│   └── package.json
├── .github/workflows/ci.yml # GitHub Actions CI workflow
├── docker-compose.yml       # Docker Compose cho toàn bộ hệ thống
├── .env.example             # Mẫu biến môi trường
└── README.md
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
- **Node.js**: >= 20.x
- **npm**: >= 10.x
- **Docker & Docker Compose** (nếu chạy qua container)

### 2. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc (hoặc trong từng thư mục `frontend` và `backend`):

```bash
cp .env.example .env
```

Điền các thông tin:
- `GEMINI_API_KEY`: API key từ [Google AI Studio](https://aistudio.google.com/)
- `VITE_WEATHER_API_KEY`: API key từ [OpenWeatherMap](https://openweathermap.org/)
- `SMTP_USER` / `SMTP_PASS`: Tài khoản Gmail và App Password để gửi mail liên hệ.

---

### 3. Chạy môi trường phát triển (Development Mode)

#### Chạy Backend:
```bash
cd backend
npm install
npm run start:dev
```
Backend API sẽ lắng nghe tại: `http://localhost:3001`

#### Chạy Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

---

### 4. Khởi chạy với Docker Compose (Production Ready)

Chỉ với 1 câu lệnh duy nhất để build và run toàn bộ hệ thống gồm PostgreSQL, NestJS Backend và React Frontend (Nginx):

```bash
docker-compose up --build -d
```

- **Frontend Website**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:3001/api`
- **PostgreSQL Database**: `localhost:5432`

---

## 📡 API Endpoints (Backend)

| Method | Endpoint | Mô tả | Rate Limit |
|---|---|---|---|
| `POST` | `/api/contact` | Gửi tin nhắn liên hệ & gửi email thông báo | 3 req / phút |
| `POST` | `/api/chat` | Hỏi đáp với trợ lý ảo AI Gemini | 10 req / phút |
| `WS` | `ws://localhost:3001` | WebSocket streaming hỏi đáp AI qua event `sendMessage` | - |
| `GET` | `/api/blog` | Lấy danh sách bài viết (hỗ trợ `?tag=` và `?search=`) | 20 req / phút |
| `GET` | `/api/blog/tags` | Lấy danh sách tất cả các tags | 20 req / phút |
| `GET` | `/api/blog/:id` | Xem chi tiết bài viết blog theo ID hoặc slug | 20 req / phút |

---

## 👤 Thông tin tác giả (Author)

- **Họ và tên**: Phạm Minh Hiếu (Pham Minh Hieu)
- **Năm sinh**: 2004
- **Quê quán**: Phổ Yên, Thái Nguyên, Việt Nam
- **Học vấn**: Kỹ thuật Ô tô — Đại học Công nghệ Thông tin và Truyền thông (ICTU) (2022 – Hiện tại)
- **GitHub**: [@phamminhhieu2004](https://github.com/phamminhhieu2004)
- **Facebook**: [Phạm Minh Hiếu](https://www.facebook.com/goodboy.real.minhhieu)
- **TikTok**: [@goodboy.real_2004](https://www.tiktok.com/@goodboy.real_2004)
- **Telegram**: [@pmh_2004](https://t.me/pmh_2004)
- **Email**: `phamminhhieu2004@gmail.com`
- **Hotline**: `0989 770 905`

---

## 📄 Bản quyền (License)

Dự án được phân phối dưới giấy phép **MIT License**.
