## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Getting Started

```bash
npm install     # install dependencies
npm run dev     # start dev server (http://localhost:5173)
npm run build   # production build
```

## 🌍 Supported Languages

| Code | Language | RTL |
|---|---|---|
| en | English | No |
| ar | Arabic | Yes |
| sv | Swedish | No |
| it | Italian | No |
| es | Spanish | No |
| fr | French | No |

## 🎨 Design System

- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component library
- **Glass morphism** — frosted glass card style
- **Gradient background** — purple → blue → indigo

## 📱 Responsive Design

- Mobile first approach
- Stacked layout on small screens
- Full navigation on desktop
- RTL layout support for Arabic

## 🔐 Auth Flow

1. User registers/logs in → receives JWT token
2. Token stored in localStorage + Redux
3. Axios interceptor attaches token to every request
4. On page refresh — AuthInitializer fetches user profile
5. Protected routes check Redux auth state before rendering

## 🧩 Key Components

| Component | Purpose |
|---|---|
| `AuthInitializer` | Restores session on page refresh |
| `ProtectedRoute` | Redirects unauthenticated users |
| `AdminRoute` | Restricts admin-only pages |
| `DownloadTypeSelector` | Video/Audio/Subtitle picker |
| `VideoInfo` | Shows probe result (thumbnail, title) |
| `HistoryCard` | Single history entry display |
| `UserRow` | Admin user management row |