# Spendly · Expense Tracker

A full-stack MERN expense tracker with JWT authentication, dashboard analytics, charts, dark mode, and a polished, animated UI built with React + Vite + module CSS.

![Stack](https://img.shields.io/badge/stack-MERN-6366f1)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node](https://img.shields.io/badge/Node-18%2B-43853d)
![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-13aa52)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Scripts](#scripts)
- [Architecture Notes](#architecture-notes)
- [Screenshots / UI Highlights](#screenshots--ui-highlights)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Core
- **Add / Edit / Delete expenses** with full inline form validation
- **View expense history** with responsive table (collapses to cards on mobile)
- **Search expenses** across title and note (case-insensitive)
- **Filter by category** (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Travel, Other)
- **Dashboard** with:
  - Total spent (all-time)
  - Monthly spend (current calendar month)
  - Transaction count
  - Average per expense
  - Recent transactions (last 5)

### Technical
- **React 18 + Vite** frontend
- **Node.js + Express** backend
- **REST API** with consistent error contract
- **MongoDB + Mongoose** persistence
- **JWT authentication** with bcrypt-hashed passwords
- **Form validation** on both client and server
- **Responsive UI** with mobile breakpoints at 960 / 720 / 540 px

### Bonus
- **JWT-based user authentication** (register, login, protected routes, token rehydration)
- **Expense charts** — category donut + last 6 months bar chart (Recharts)
- **Dark mode** with `localStorage` persistence and `prefers-color-scheme` detection
- **High-quality animations** — `fadeInUp`, `scaleIn`, `float`, `pulse`, hover lift + glow, staggered row reveals, animated modal, dual-ring spinner

---

## Tech Stack

| Layer       | Technology                                              |
|-------------|---------------------------------------------------------|
| Frontend    | React 18, React Router 6, Vite, Axios, Recharts         |
| Styling     | CSS Modules with CSS custom properties for theming      |
| State       | React Context (Auth, Expense, Theme)                    |
| Backend     | Node.js, Express, express-async-handler                 |
| Database    | MongoDB with Mongoose ODM                               |
| Auth        | JSON Web Tokens (jsonwebtoken) + bcryptjs               |
| Dev tools   | nodemon, @vitejs/plugin-react                           |

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── expenseController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Expense.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── expenseRoutes.js
│   │   ├── utils/generateToken.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── nodemon.json
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── api/
        │   ├── axios.js
        │   └── expenseApi.js
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ExpenseContext.jsx
        │   └── ThemeContext.jsx
        ├── components/
        │   ├── Navbar/
        │   ├── DashboardCard/
        │   ├── ExpenseForm/
        │   ├── ExpenseTable/
        │   ├── ExpenseChart/
        │   ├── SearchBar/
        │   ├── Loader/
        │   └── ErrorMessage/
        ├── pages/
        │   ├── Login/
        │   ├── Register/
        │   ├── Dashboard/
        │   └── Expenses/
        ├── routes/ProtectedRoute.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

Every component / page has its own folder containing a `.jsx` file and a `.module.css` file.

---

## Prerequisites

- **Node.js** 18 or newer
- **npm** 9 or newer (ships with Node)
- **MongoDB** 6+ running locally, or a MongoDB Atlas connection string

Verify with:

```bash
node --version
npm --version
mongod --version
```

---

## Quick Start

Clone the repo and install dependencies for both packages:

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 1. Configure & start the backend

```bash
cd backend
npm install
# Open .env and set MONGO_URI + a strong JWT_SECRET
npm run dev
```

The API will be available at **http://localhost:5000**. You should see:

```
MongoDB connected: 127.0.0.1
Server running in development mode on port 5000
```

### 2. Start the frontend (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Vite proxies `/api` to the backend, so no CORS configuration is needed in dev.

### 3. Create an account

1. Navigate to `/register`
2. Fill in name, email, password (min 6 chars)
3. You'll be redirected straight to the dashboard
4. Head over to **Expenses** to add your first transaction

---

## Environment Variables

Create or update `backend/.env`:

| Variable        | Description                                  | Example                                       |
|-----------------|----------------------------------------------|-----------------------------------------------|
| `PORT`          | Backend port                                 | `5000`                                        |
| `MONGO_URI`     | MongoDB connection string                    | `mongodb://127.0.0.1:27017/expense_tracker`   |
| `JWT_SECRET`    | Secret used to sign tokens (use a long one!) | `change-me-to-something-random-and-long`      |
| `JWT_EXPIRES_IN`| Token lifetime                               | `7d`                                          |
| `NODE_ENV`      | `development` or `production`                | `development`                                 |
| `CLIENT_ORIGIN` | Allowed CORS origin                          | `http://localhost:5173`                       |

> Generate a strong JWT secret quickly:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```

---

## API Reference

All `/api/expenses/*` routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Route                  | Body                              | Description                       |
|--------|------------------------|-----------------------------------|-----------------------------------|
| POST   | `/api/auth/register`   | `{ name, email, password }`       | Create account, returns JWT       |
| POST   | `/api/auth/login`      | `{ email, password }`             | Authenticate, returns JWT         |
| GET    | `/api/auth/me`         | —                                 | Returns the current user          |

### Expenses

| Method | Route                  | Body / Query                                      | Description                              |
|--------|------------------------|---------------------------------------------------|------------------------------------------|
| GET    | `/api/expenses`        | `?q=&category=&from=&to=`                         | List filtered expenses                   |
| POST   | `/api/expenses`        | `{ title, amount, category, note?, date? }`       | Create expense                           |
| GET    | `/api/expenses/stats`  | —                                                 | Dashboard aggregations                   |
| GET    | `/api/expenses/:id`    | —                                                 | Get a single expense                     |
| PUT    | `/api/expenses/:id`    | Same fields as create (all optional)              | Update expense                           |
| DELETE | `/api/expenses/:id`    | —                                                 | Delete expense                           |

### Sample request

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'

# Create an expense (replace <TOKEN>)
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Coffee","amount":4.5,"category":"Food"}'
```

### Stats response shape

```json
{
  "total": 1234.56,
  "count": 42,
  "monthly": 320.00,
  "recent": [ /* up to 5 expense docs */ ],
  "byCategory": [
    { "category": "Food", "total": 540.10 },
    { "category": "Transport", "total": 220.00 }
  ],
  "monthlySeries": [
    { "label": "Jan 26", "total": 0 },
    { "label": "Feb 26", "total": 145.20 }
  ]
}
```

---

## Scripts

### Backend (`/backend`)

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm start`   | Start production server              |
| `npm run dev` | Start dev server with nodemon reload |

### Frontend (`/frontend`)

| Script            | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Vite dev server on port 5173      |
| `npm run build`   | Production build to `dist/`       |
| `npm run preview` | Preview the production build      |

---

## Architecture Notes

### Context-driven state
- **`AuthContext`** — holds the current user + JWT, rehydrates from `localStorage` on first mount, validates the cached token by calling `/auth/me` so stale tokens never leave the UI in a broken state.
- **`ExpenseContext`** — owns the expense list, dashboard stats, search/filter state, and exposes `addExpense` / `updateExpense` / `deleteExpense` which automatically refresh stats so the dashboard stays in sync.
- **`ThemeContext`** — toggles a `data-theme` attribute on `<html>`. All colours are CSS variables, so theme switching is instant and re-render-free.

### Error & loading handling
- A single `axios` instance attaches the JWT, clears local state on `401`, and normalises every rejection to `new Error(message)` so components can simply read `err.message`.
- The backend's `errorMiddleware` converts Mongoose `ValidationError`, duplicate-key, and `CastError` into the same `{ message }` contract.
- Every page surfaces error state through the shared `<ErrorMessage>` banner and shows the `<Loader>` while initial data is being fetched.

### Animations
Defined once in `index.css` (`fadeIn`, `fadeInUp`, `scaleIn`, `slideInRight`, `shimmer`, `spin`, `pulse`, `float`) and consumed via CSS classes / inline `animation-delay` for staggered row reveals.

---

## Screenshots / UI Highlights

- **Indigo → violet → pink gradient** brand identity threaded through logos, buttons, and chart bars.
- **Floating background orbs** on the auth pages with blurred glass cards.
- **Glassy sticky navbar** with animated logo, theme toggle, avatar, and pill-style active link.
- **Stat cards** with elevation lift on hover and a coloured radial glow per variant.
- **Color-coded category badges** in the expenses table.
- **Custom delete-confirm modal** with backdrop blur and scale-in entrance.
- **Mobile-first responsiveness** — the expense table reflows into stacked cards under 720 px.

---

## Troubleshooting

**"MongoDB connection error"**
Check that `mongod` is running locally, or that your Atlas URI / IP whitelist is correct.

**"Not authorized, no token provided" (401)**
Your token expired or was cleared. Log in again. The frontend handles this automatically by redirecting.

**Frontend can't reach the API**
Confirm the backend is on port 5000 and Vite is on 5173. The proxy is configured in `frontend/vite.config.js`.

**CORS errors in production**
Set `CLIENT_ORIGIN` in `backend/.env` to your deployed frontend URL.

**Port already in use**
Change `PORT` in `backend/.env`, or update the `server.proxy.target` in `frontend/vite.config.js` to match.

---

## Roadmap

Ideas for future iterations:

- [ ] Budget limits per category with progress bars
- [ ] CSV / PDF export of expenses
- [ ] Multi-currency support with live FX rates
- [ ] Receipt image upload (S3 / Cloudinary)
- [ ] Recurring expenses
- [ ] Email summary digests
- [ ] Mobile app (React Native) sharing the same API

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT). Use it, fork it, ship it.
