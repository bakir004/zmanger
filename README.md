# Zmanger

**Sve za kodiranje na ETF-u.** Zmanger is an open-source alternative to c9 for students working on C and C++ courses at ETF Sarajevo (Uvod u programiranje, Tehnike programiranja, Algoritmi i strukture podataka, Numerički algoritmi).

It gives you an in-browser editor (**c10**) where you can keep your files, run your code, and run the autotests for your homework in one click, including memory-leak checks.

> Zmanger is a standalone helper app. It has no access to Zamger or any other ETF system, so you still have to submit your homework on Zamger yourself.

## Features

- **c10 editor**: Monaco-based editor with a personal file and folder tree, multiple open files, saving, and running code with custom stdin.
- **Autotests**: run a single test or a whole test batch against your code. Each test can inject code at the top of the file, above `main`, and into `main`, then compares stdout against one or more expected outputs.
- **Submission history**: results per test (compile output, stdout, stderr, execution time, status) are stored so you can see your progress per batch.
- **Dashboard**:
  - `/dashboard/testovi`: create, edit and delete test batches and tests (moderators and admins)
  - `/dashboard/obavijesti`: post notifications to users (moderators and admins)
  - `/dashboard/korisnici`: manage user roles and plans (admins only)
- **Plans and pricing** page; admins assign plans to users, stored in Clerk metadata.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- [Clerk](https://clerk.com) for auth, roles and plans
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- [Tailwind CSS 4](https://tailwindcss.com) + shadcn/ui (Radix)
- [TanStack Query](https://tanstack.com/query), React Hook Form, Zod
- [Sentry](https://sentry.io) for error tracking, Winston for logging
- [Biome](https://biomejs.dev) for linting and formatting
- An external code runner service (`CODE_RUNNER_URL`) that compiles and executes submissions

## Architecture

The backend follows a clean-architecture layout with dependency injection via [`@evyweb/ioctopus`](https://github.com/evyweb/ioctopus):

```
app/                       Next.js routes, pages, server actions, UI components
src/
  entities/                Domain models and errors
  application/
    use-cases/             Business logic
    repositories/          Repository interfaces
    services/              Service interfaces (code judge, Clerk, instrumentation, ...)
  infrastructure/          Drizzle repositories and concrete service implementations
  interface-adapters/      Controllers: input validation, auth checks, mapping
di/                        DI container and modules wiring it all together
drizzle/                   Database schema and migrations
```

## Getting started

Requirements: Node.js 20+, pnpm 10, a PostgreSQL database, a Clerk application, and a running code runner instance.

```bash
git clone https://github.com/bakir004/zmanger.git
cd zmanger
pnpm install
cp .env.example .env   # then fill in the values below
pnpm db:push           # or: pnpm db:migrate
pnpm dev
```

The app runs at http://localhost:3000.

### Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CODE_RUNNER_URL` | Base URL of the code runner (`POST /submissions`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (optional) |
| `SKIP_ENV_VALIDATION` | Set to skip env validation, e.g. in Docker builds (optional) |

### Roles

Roles are stored in each Clerk user's public metadata, e.g. `{"role": "admin"}`. Supported values are `admin` and `moderator`; users without a role are regular users. Route protection is handled in `middleware.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm check` / `pnpm check:write` | Lint and format with Biome |
| `pnpm typecheck` | Run the TypeScript compiler |
| `pnpm db:generate` | Generate a migration from the schema |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push the schema directly to the database |
| `pnpm db:studio` | Open Drizzle Studio |

## Deployment

Zmanger is deployed on [Vercel](https://vercel.com). Set the environment variables above in the project settings; `vercel.json` configures CORS headers for `/api/*`.
