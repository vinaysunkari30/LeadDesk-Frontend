# LeadDesk Mini

A full-stack lead capture and management platform built with **React + Tailwind CSS** (frontend) and **Express + MongoDB** (backend).

> **Live Credit**: Built for [Digital Heroes Training Task](https://digitalheroesco.com)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Routing | React Router DOM v7 |

---

## 📁 Project Structure

```
LeadDesk/
├── client/                   # React frontend
    └── src/
        ├── components/
        │   ├── Home/         # Public landing page + lead form
        │   ├── LeadForm/     # Lead capture form (client + server validation)
        │   ├── AdminLogin/   # Admin login page
        │   ├── AdminPanel/   # Admin dashboard (leads table)
        │   ├── Navbar/       # Responsive navbar
        │   └── Toast/        # Toast notification system
        ├── context/
        │   └── AuthContext.jsx  # Auth state (JWT session management)
        └── App.jsx           # Routes + ProtectedRoute guard

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

##🔒 Auth Approach

Registration (POST /api/auth/register) — 
Hashes the admin password with bcrypt (10 salt rounds) and stores the      Admin document in MongoDB. Registration is intended to be run once to seed the initial admin account.

Login (POST /api/auth/login) — 
Verifies the admin's email and password using bcrypt, then issues a JWT with a 7-day expiry. The frontend stores the JWT using js-cookie.

Session Check (GET /api/auth/me) — 
When the application loads, the React client retrieves the JWT from the js-cookie cookie and sends it to the backend using the Authorization: Bearer <token> header. The server verifies the JWT and returns the authenticated admin's information. This allows the admin session to persist across page refreshes.

Logout (POST /api/auth/logout) — 
The frontend removes the JWT from the js-cookie cookie, clearing the client-side authentication state.

Protected Routes — 
authMiddleware.js verifies the JWT from the Authorization header before allowing access to protected API endpoints. The React ProtectedRoute component also prevents unauthenticated users from accessing the /admin page.

---

## 🛠️ Local Setup

### 1. Clone & Install

```bash

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
POST to http://localhost:3000/api/auth/register
Body: { "username": "Admin", "email": "admin@gmail.com", "password": "yourpassword" }
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"Admin","email":"admin@gmail.com","password":"Admin@123"}'
```

### 4. Run

```bash
# Client
cd client && npm run dev
```

- Public page: http://localhost:5173
- Admin login: http://localhost:5173/login
- Admin dashboard: http://localhost:5173/admin
- API: http://localhost:3000

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create admin account |
| POST | /api/auth/login | ❌ | Login |
| POST | /api/auth/logout | ❌ | Logout |
| GET | /api/auth/me | ✅ | Verify session |
| POST | /api/leads | ❌ | Submit new lead |
| GET | /api/leads | ✅ | List leads |
| PUT | /api/leads/:id | ✅ | Update lead status |
| DELETE | /api/leads/:id | ✅ | Delete lead |

---

## ✅ Features

- **Public landing page** with hero, stats, and feature list
- **Lead form** with client-side + server-side validation
- **Admin login** with JWT + bcrypt
- **Session persistence** (refresh stays logged in)
- **Admin dashboard** with search (debounced), status filter
- **Status toggle**: New → Contacted → Closed (cycles)
- **Mobile-responsive** — accordion cards on mobile, table on desktop
- **Toast notifications** for success/error feedback
- **Protected routes** — unauthenticated users redirected to login

---

## 📝 Test Credentials (after seeding)

```
Email:    leadDesk@gmail.com
Password: Lead Desk Admin
      OR
You can register as admin using http://localhost:3000/api/auth/register
by giving necessary credentials like
  username: 'Your Name'
  email: 'Your Email ID'
  password: 'Your password'
```

---

*Built for Digital Heroes Training Task — [digitalheroesco.com](https://digitalheroesco.com)*
