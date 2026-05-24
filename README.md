# 🚀 DevPulse

### Internal Tech Issue & Feature Tracker

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

🌐 **Live URL:** [your-vercel-url-here]

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register and login with bcrypt password hashing
- 👥 **Role-Based Access Control** — Contributor and maintainer roles with different permissions
- 🐛 **Issue Management** — Create, update and delete bug reports and feature requests
- 🔍 **Search & Filter** — Filter issues by type and status, sort by newest or oldest
- 🛡️ **Protected Routes** — JWT middleware guards all private API endpoints
- 📊 **Status Tracking** — Track issues through open, in_progress and resolved states

---

## 🛠️ Tech Stack

| Technology | Note |
|------------|------|
| Node.js | LTS runtime |
| TypeScript | Strict mode, no `any` types |
| Express.js | Modular router architecture |
| PostgreSQL | NeonDB serverless |
| Raw SQL | Direct `pool.query()` calls, no ORM |
| bcrypt | Password hashing, salt rounds 10 |
| jsonwebtoken | JWT generation & verification |

---

## 🚀 Getting Started

```bash
git clone https://github.com/otherV/devpulse-v2
cd devpulse-v2
npm install
npm run dev
```

---

## 🔑 Environment Variables

```
PORT=5000
DATABASE_URL=
JWT_SECRET=
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

### Issues
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/issues` | Public |
| GET | `/api/issues/:id` | Public |
| POST | `/api/issues` | Authenticated |
| PATCH | `/api/issues/:id` | Authenticated |
| PATCH | `/api/issues/:id/status` | Maintainer only |
| DELETE | `/api/issues/:id` | Maintainer only |

---

## 🗄️ Database Schema

### users
| Field | Type | Notes |
|-------|------|-------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Unique |
| password | VARCHAR(255) | Hashed, never returned |
| role | VARCHAR(20) | contributor or maintainer |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |

### issues
| Field | Type | Notes |
|-------|------|-------|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required |
| description | TEXT | Min 20 chars |
| type | VARCHAR(20) | bug or feature_request |
| status | VARCHAR(20) | open, in_progress, resolved |
| reporter_id | INTEGER | References users.id |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |