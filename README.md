# TaskCal — To-Do List & Calendar App

A full-stack To-Do List & Calendar web application built with Next.js 16. Organize your daily tasks through an interactive calendar interface with status tracking.

## Features

- **Authentication** — Register, login, logout with JWT-based secure sessions
- **Calendar View** — Interactive monthly calendar; click any date to see tasks
- **Task Management** — Create, edit, delete tasks with title, description, date, and status
- **Status Tracking** — Not Started / In Progress / Done with visual progress bars
- **Dashboard** — Calendar + task list + summary in one view
- **Dark Mode** — Full dark/light mode toggle persisted in localStorage
- **Search & Filter** — Filter tasks by status and search by title/description
- **Responsive UI** — Works on mobile, tablet, and desktop
- **REST API** — JSON API for all task operations

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon for production) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Auth | Custom JWT (jose) + httpOnly cookies |
| Styling | Tailwind CSS v4 |
| Calendar | react-day-picker v8 |
| Validation | Zod |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Installation

```bash
git clone <repo-url>
cd todo-calendar
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for JWT (min 32 chars) — generate with `openssl rand -base64 32` |

### Database Setup

```bash
npx prisma migrate deploy
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `demo1234!` |

> Register an account first, or use the seed script to create the demo user.

## Deployment to Vercel

1. Create a **Neon** database at [neon.tech](https://neon.tech) (free tier available)
2. Push your code to GitHub
3. Import the repo in [Vercel](https://vercel.com)
4. Add environment variables in Vercel project settings:
   - `DATABASE_URL` — use the **pooled** Neon connection string
   - `SESSION_SECRET` — run `openssl rand -base64 32` to generate
5. Set the **Build Command** to: `prisma migrate deploy && next build`

## API Reference

All endpoints require authentication (session cookie set on login).

### Tasks API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks; filter with `?date=YYYY-MM-DD` or `?status=NOT_STARTED` |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PUT` | `/api/tasks/:id` | Replace a task |
| `PATCH` | `/api/tasks/:id` | Partial update |
| `DELETE` | `/api/tasks/:id` | Delete a task (returns 204) |

#### Task Schema

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "date": "YYYY-MM-DD (required)",
  "status": "NOT_STARTED | IN_PROGRESS | DONE"
}
```

## Project Structure

```
todo-calendar/
├── app/
│   ├── actions/          # Server Actions (auth + tasks)
│   ├── api/tasks/        # REST API route handlers
│   ├── dashboard/        # Protected dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── page.tsx          # Landing page
├── components/
│   ├── calendar/         # Interactive calendar
│   ├── tasks/            # Task card, list, form, summary
│   ├── ui/               # Button, Input, Modal, Badge, etc.
│   └── dashboard-client.tsx
├── lib/
│   ├── dal.ts            # Data Access Layer (session verification)
│   ├── db.ts             # Prisma client singleton
│   ├── definitions.ts    # Zod schemas and TypeScript types
│   ├── session.ts        # JWT encrypt/decrypt + cookie management
│   └── utils.ts          # Utility functions + status constants
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # SQL migration files
└── proxy.ts              # Route protection (Next.js 16 replaces middleware)
```

## Security

- Passwords hashed with **bcryptjs** (12 rounds)
- Sessions stored as **httpOnly, SameSite=Lax** cookies (7-day expiry)
- JWT signed with **HMAC-SHA256** via `jose`
- All task API endpoints verify **user ownership** before every operation
- `proxy.ts` guards protected routes server-side

## License

MIT
