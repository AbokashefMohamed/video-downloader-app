# 🎬 Video Downloader App

A full-stack web application that allows users to download videos, audio, and subtitles from YouTube and other platforms. Built with React + TypeScript on the frontend and Express + MongoDB on the backend.

## ✨ Features

- 🎥 Download videos in multiple qualities
- 🎵 Download audio in MP3, M4A, or WAV format
- 💬 Download subtitles in SRT format
- 📋 Playlist support with smart limits
- 👤 User authentication (register, login, JWT)
- 📜 Personal download history
- 🌍 Multi-language support (English, Arabic, Swedish, Italian, Spanish, French)
- 🔄 RTL support for Arabic
- 👑 Admin panel for user management
- 📱 Mobile responsive design
- 🆓 3 free downloads for guests

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Redux Toolkit
- React Router
- Axios
- i18next

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- yt-dlp + ffmpeg
- cors

## 📋 Prerequisites

- Node.js 24+ (LTS)
- MongoDB Atlas account (or local MongoDB)
- yt-dlp installed or downloaded to `backend/bin/`
- ffmpeg (installed via ffmpeg-static)

## 🚀 Installation

### 1. Clone the repository

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `CLIENT_ORIGIN` | Frontend URL for CORS |
| `YTDLP_PATH` | Path to yt-dlp binary |
| `FFMPEG_PATH` | Path to ffmpeg binary |
| `TEMP_DOWNLOAD_DIR` | Temp directory for downloads |


### Production build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PATCH | `/api/auth/me` | Update profile | Yes |
| DELETE | `/api/auth/me` | Delete account | Yes |

### Download
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/probe` | Get video metadata | Optional |
| POST | `/api/download` | Download video/audio/subtitle | Optional |

### History
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/history` | Get download history | Yes |
| DELETE | `/api/history` | Clear all history | Yes |
| DELETE | `/api/history/:id` | Delete one entry | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/users` | List all users | Admin |
| PATCH | `/api/admin/users/:id` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

## 📄 License

MIT