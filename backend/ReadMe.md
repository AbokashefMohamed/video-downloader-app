## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your_long_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
YTDLP_PATH=./bin/yt-dlp.exe
FFMPEG_PATH=./node_modules/ffmpeg-static/ffmpeg.exe
TEMP_DOWNLOAD_DIR=./tmp_downloads
```

## 🚀 Getting Started

```bash
npm install        # installs deps + downloads yt-dlp automatically
npm run dev        # start with hot reload
npm start          # start in production
```

## 📡 API Reference

### Authentication
All protected routes require `Authorization: Bearer <token>` header.

### Rate Limiting
- General: 100 requests / 15 minutes
- Auth endpoints: 10 requests / 15 minutes

### Guest Limits
- 3 free downloads total (tracked by IP + cookie)
- After limit: must register to continue

### Download Types
| Type | Format | Notes |
|---|---|---|
| video | MP4 | Default 720p, user can pick quality |
| audio | MP3, M4A, WAV | Best available quality |
| subtitle | SRT | Real + auto-generated subtitles |

## 🔒 Security Features

- JWT authentication with configurable expiry
- Password hashing with bcryptjs (cost factor 10)
- Rate limiting on all endpoints
- CORS restricted to frontend origin
- Input validation on all endpoints
- NoSQL injection protection via Zod schema validation
- Admin cannot modify their own role or delete themselves
- Guest download tracking by IP + cookie

## 🗄 Database Models

### User