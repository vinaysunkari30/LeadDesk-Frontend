# LeadDesk Mini

A full-stack lead capture and management platform built with **React + Tailwind CSS** (frontend) and **Express + MongoDB** (backend).

> **Live Credit**: Built for [Digital Heroes Training Task](https://digitalheroesco.com)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Express 5, Node.js (ESM) |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (httpOnly cookies) + bcrypt |
| Routing | React Router DOM v7 |

---

## 📁 Project Structure

```
LeadDesk/
├── client/                   # React frontend
│   └── src/
│       ├── components/
│       │   ├── Home/         # Public landing page + lead form
│       │   ├── LeadForm/     # Lead capture form (client + server validation)
│       │   ├── AdminLogin/   # Admin login page
│       │   ├── AdminPanel/   # Admin dashboard (leads table)
│       │   ├── Navbar/       # Responsive navbar
│       │   └── Toast/        # Toast notification system
│       ├── context/
│       │   └── AuthContext.jsx  # Auth state (JWT session management)
│       └── App.jsx           # Routes + ProtectedRoute guard
│
└── server/                   # Express backend
    ├── databaseConfig.js/
    │   ├── dbConnection.js   # Mongoose connect
    │   ├── schema.js         # Lead model
    │   └── adminSchema.js    # Admin model
    ├── middleware/
    │   └── authMiddleware.js # JWT verification middleware
    ├── routes/
    │   ├── authRoutes.js     # /api/auth (login, logout, register, me)
    │   └── leadRoutes.js     # /api/leads (CRUD)
    └── server.js             # App entry point
```

---

## 🗃️ Data Model

### Lead

```js
{
  name:      String (required, min 2 chars),
  email:     String (required, unique, valid email),
  budget:    String (enum: under-1k | 1k-5k | 5k-10k | 10k-25k | 25k-plus),
  message:   String (required, 10–1000 chars),
  status:    String (enum: New | Contacted | Closed, default: New),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Admin

```js
{
  username:  String (required),
  email:     String (required, unique),
  password:  String (bcrypt hashed, min 6 chars),
  createdAt: Date (auto)
}
```

---

## 🔒 Auth Approach

1. **Registration** (`POST /api/auth/register`) — Hashes password with bcrypt (12 salt rounds), stores Admin document in MongoDB. Run once to seed the admin account.
2. **Login** (`POST /api/auth/login`) — Verifies email + bcrypt password comparison, issues a **JWT** (7-day expiry) stored in an **httpOnly cookie** (not accessible via JS).
3. **Session Check** (`GET /api/auth/me`) — On page load, the client calls this endpoint. The cookie is sent automatically by the browser; the server decodes and returns admin info. This enables session persistence across refreshes.
4. **Logout** (`POST /api/auth/logout`) — Clears the httpOnly cookie server-side.
5. **Protected Routes** — `authMiddleware.js` verifies the JWT on every protected API endpoint. The React `ProtectedRoute` component also gates the `/admin` page.

---

## 🛠️ Local Setup

### 1. Clone & Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

```bash
# server/.env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Seed Admin Account

```bash
# POST to http://localhost:3000/api/auth/register
# Body: { "username": "Admin", "email": "admin@leaddesk.com", "password": "yourpassword" }
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"Admin","email":"admin@leaddesk.com","password":"Admin@123"}'
```

### 4. Run

```bash
# Server (terminal 1)
cd server && npm run dev

# Client (terminal 2)
cd client && npm run dev
```

- Public page: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- Admin dashboard: http://localhost:5173/admin
- API: http://localhost:3000

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create admin account |
| POST | /api/auth/login | ❌ | Login → sets cookie |
| POST | /api/auth/logout | ❌ | Clears cookie |
| GET | /api/auth/me | ✅ | Verify session |
| POST | /api/leads | ❌ | Submit new lead |
| GET | /api/leads | ✅ | List leads (search, filter) |
| PUT | /api/leads/:id | ✅ | Update lead status |
| DELETE | /api/leads/:id | ✅ | Delete lead |

---

## ✅ Features

- **Public landing page** with hero, stats, and feature list
- **Lead form** with client-side + server-side validation
- **Admin login** with JWT + bcrypt (httpOnly cookie)
- **Session persistence** (refresh stays logged in)
- **Admin dashboard** with search (debounced), status filter
- **Status toggle**: New → Contacted → Closed (cycles)
- **Mobile-responsive** — accordion cards on mobile, table on desktop
- **Toast notifications** for success/error feedback
- **Protected routes** — unauthenticated users redirected to login

---

## 📝 Test Credentials (after seeding)

```
Email:    vinaysunkari@gmail.com
Password: vinay sunkari
      OR
You can register as admin using http://localhost:3000/api/auth/register
by giving necessary credentials like
  username: 'Your Name'
  email: 'Your Email ID'
  password: 'Your password'
```

---

*Built for Digital Heroes Training Task — [digitalheroesco.com](https://digitalheroesco.com)*
