# TaskCal — To-Do List & Calendar App

A full-stack To-Do List & Calendar web application built with Next.js 16. Organize your daily tasks through an interactive calendar interface with status tracking.

## Live Demo

**[DEPLOYMENT_URL]**

> Replace `[DEPLOYMENT_URL]` with the Vercel deployment URL after first deploy.

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
| Calendar | react-day-picker v9 |
| Validation | Zod |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Installation

```bash
git clone <repo-url>
cd taskcal
npm install
```

> **Note:** This project uses **React 19**. If you encounter peer dependency errors during `npm install` (e.g. from packages that haven't declared React 19 support yet), add a `.npmrc` file at the project root with:
> ```
> legacy-peer-deps=true
> ```
> The `react-day-picker` dependency was upgraded to v9 specifically to resolve this; no workaround should be needed with a clean install.

### Environment Variables

```bash
cp .env.example .env
```

Fill in the following variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Random secret for JWT signing — generate with `openssl rand -base64 32` |

### Database Setup

Apply migrations and (optionally) seed demo data:

```bash
# Apply schema migrations
npm run db:migrate

# Seed a demo user (demo@example.com / demo1234!)
npm run db:seed
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

After running `npm run db:seed`:

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `demo1234!` |

The seed script creates the demo user and populates sample tasks spread across yesterday, today, and tomorrow so you can immediately explore the calendar view.

## Deployment to Vercel

1. Create a **Neon** database at [neon.tech](https://neon.tech) (free tier available)
2. Push your code to GitHub
3. Import the repo in [Vercel](https://vercel.com)
4. Add environment variables in the Vercel project settings:
   - `DATABASE_URL` — use the **pooled** Neon connection string
   - `SESSION_SECRET` — run `openssl rand -base64 32` to generate
5. Set the **Build Command** to:
   ```
   prisma migrate deploy && next build
   ```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed demo user and sample tasks |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

## API Reference

All endpoints require authentication (session cookie set on login).

### Tasks API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks; supports `?date=YYYY-MM-DD` and `?status=NOT_STARTED` |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PUT` | `/api/tasks/:id` | Replace a task (full update) |
| `PATCH` | `/api/tasks/:id` | Partial update |
| `DELETE` | `/api/tasks/:id` | Delete a task — returns `204 No Content` |

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
taskcal/
├── app/
│   ├── actions/          # Server Actions (auth + tasks)
│   ├── api/tasks/        # REST API route handlers
│   ├── dashboard/        # Protected dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── page.tsx          # Landing page
├── components/
│   ├── calendar/         # Interactive calendar (react-day-picker v9)
│   ├── tasks/            # Task card, list, form, status summary
│   ├── ui/               # Button, Input, Modal, Badge, ThemeToggle, etc.
│   └── dashboard-client.tsx
├── lib/
│   ├── dal.ts            # Data Access Layer (session verification)
│   ├── db.ts             # Prisma client singleton
│   ├── definitions.ts    # Zod schemas and TypeScript types
│   ├── session.ts        # JWT encrypt/decrypt + cookie management
│   └── utils.ts          # Utility functions + status label/color constants
├── prisma/
│   ├── schema.prisma     # Database schema (User, Task, TaskStatus enum)
│   ├── seed.ts           # Demo data seeder
│   └── migrations/       # SQL migration files
└── proxy.ts              # Route protection (Next.js 16 — replaces middleware.ts)
```

## Security

- Passwords hashed with **bcryptjs** (12 rounds)
- Sessions stored as **httpOnly, SameSite=Lax** cookies (7-day expiry)
- JWT signed with **HMAC-SHA256** via `jose`
- All task endpoints verify **user ownership** before any read/write operation
- `proxy.ts` guards protected routes at the edge level

## License

MIT
