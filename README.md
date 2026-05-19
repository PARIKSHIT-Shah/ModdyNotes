# ModdyNotes ✦

A sleek full-stack **MERN** note-taking app with user auth, category filtering, and real-time search.

---

## Features

- 🔐 **Auth** — Register / Login with JWT tokens
- 📝 **Notes CRUD** — Create, edit, delete notes
- 📌 **Pin notes** — Keep important notes at the top
- ✅ **Complete notes** — Mark notes as done
- 🎨 **Color cards** — Assign colors to notes
- 🏷️ **Tags** — Add comma-separated tags
- 📂 **Categories** — Personal, Work, Study, Health, Finance, Shopping, Travel, Ideas, Other
- 🔍 **Search** — Search by title, content, tags, or category (debounced)
- 📱 **Responsive** — Works on mobile with sidebar hidden and FAB button

---

## Tech Stack

| Layer    | Tech                                     |
|----------|------------------------------------------|
| Frontend | React 18, React Hot Toast, Axios         |
| Backend  | Node.js, Express.js                      |
| Database | MongoDB + Mongoose                       |
| Auth     | JWT + bcryptjs                           |
| Fonts    | Syne (display) + DM Sans (body)          |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd moddynotes
npm run install-all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/moddynotes
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Run in development

```bash
# From the root directory — runs both server and client
npm run dev
```

- Client → http://localhost:3000  
- Server → http://localhost:5000

### 4. Production build

```bash
cd client && npm run build
```

---

## Project Structure

```
moddynotes/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema (bcrypt hashed password)
│   │   └── Note.js            # Note schema (category, tags, color, pin)
│   ├── routes/
│   │   ├── auth.js            # POST /register, POST /login, GET /me
│   │   └── notes.js           # Full CRUD + search/filter
│   ├── index.js               # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   │   ├── AuthPage.js    # Login + Register UI
│       │   │   └── Auth.css
│       │   ├── dashboard/
│       │   │   ├── Dashboard.js   # Main dashboard (search, filter, notes grid)
│       │   │   └── Dashboard.css
│       │   └── notes/
│       │       ├── NoteCard.js    # Individual note card
│       │       ├── NoteCard.css
│       │       ├── NoteModal.js   # Create/edit note modal
│       │       └── NoteModal.css
│       ├── context/
│       │   └── AuthContext.js     # Auth state (user, login, register, logout)
│       ├── hooks/
│       │   └── useNotes.js        # Notes CRUD + state management
│       ├── utils/
│       │   └── api.js             # Axios instance with JWT interceptor
│       ├── App.js
│       ├── index.js
│       └── index.css              # Global CSS variables & base styles
│
├── package.json                   # Root: concurrently scripts
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/register  | Register new user  |
| POST   | /api/auth/login     | Login              |
| GET    | /api/auth/me        | Get current user   |

### Notes (all require `Authorization: Bearer <token>`)
| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | /api/notes      | Get notes (supports `?category=&search=`)|
| POST   | /api/notes      | Create a note                            |
| PUT    | /api/notes/:id  | Update a note                            |
| DELETE | /api/notes/:id  | Delete a note                            |
| GET    | /api/notes/categories | List all category options          |

---

## Environment Variables

| Variable    | Description                         | Default                     |
|-------------|-------------------------------------|-----------------------------|
| PORT        | Server port                         | 5000                        |
| MONGO_URI   | MongoDB connection string           | —                           |
| JWT_SECRET  | Secret key for signing JWTs         | —                           |
| JWT_EXPIRE  | Token expiry duration               | 7d                          |
| CLIENT_URL  | Allowed CORS origin                 | http://localhost:3000       |

---

## License

MIT
