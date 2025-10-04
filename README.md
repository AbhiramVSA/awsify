# AWSify – AWS Architect Quiz Platform

An open-source, Supabase-backed study companion for AWS Solutions Architect candidates. Build a personal cloud question bank, practice with curated quizzes, and track progress in a polished React experience.

---

## Table of Contents

1. [Highlights](#highlights)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Quick Start](#quick-start)
4. [Environment Configuration](#environment-configuration)
5. [Database Migrations](#database-migrations)
6. [Available Scripts](#available-scripts)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [Roadmap](#roadmap)
10. [License](#license)

## Highlights

- **Supabase Auth** – Email/password sign-in with per-user data isolation enforced at the database (RLS).
- **Question Bank Management** – Add questions manually or bulk import JSON; everything is scoped to the signed-in user.
- **Adaptive Quiz Flows** – Filter by AWS service, category, or difficulty; get instant scoring and explanations.
- **shadcn/ui Foundations** – Responsive, accessible UI components styled with Tailwind CSS.
- **Production-ready Build Pipeline** – Vite + React 18 + TypeScript with ESLint and SWC for fast feedback loops.

## Architecture & Tech Stack

| Layer          | Details                                      |
|----------------|----------------------------------------------|
| Frontend       | React 18, TypeScript, Vite 5                 |
| UI Components  | shadcn/ui, Radix UI, Tailwind CSS            |
| State/Data     | TanStack Query, React Hook Form, Zod         |
| Authentication | Supabase Auth (email/password)               |
| Persistence    | Supabase PostgreSQL with row-level security  |
| Tooling        | ESLint, SWC, PostCSS, Tailwind CLI           |

### Flow Overview

1. Users authenticate via Supabase, establishing a session handled by `AuthProvider`.
2. Authenticated pages call Supabase using service-generated types for safety.
3. All question CRUD operations include the `user_id`; database RLS guarantees tenant isolation.
4. Supabase migrations (SQL) define schema, triggers, and PostgREST refresh for cache consistency.

## Quick Start

### Prerequisites

- Node.js ≥ 18.x and npm ≥ 9.x ([nvm install guide](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase project with SQL editor or CLI access

### Setup

```sh
git clone https://github.com/AbhiramVSA/awsify.git
cd awsify
npm install
cp .env.example .env               # if you track an example file
# populate the environment variables listed below
supabase db push                   # apply schema & policies to your Supabase instance
npm run dev
```

Visit the application at **http://localhost:8001**.

## Environment Configuration

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

> Retrieve these values from the Supabase dashboard under **Project Settings → API**.

## Database Migrations

Migrations live under `supabase/migrations/` and should be applied before running the app.

### Using Supabase CLI (recommended)

```sh
supabase db push
```

This command:

- Creates the `mcq_questions` table, indexes, and timestamp trigger.
- Adds the `user_id` column with a foreign key to `auth.users`.
- Installs row-level security (RLS) policies limiting reads/writes to the current user.
- Triggers a PostgREST schema cache reload so the new columns are immediately available to the API.

### Without the CLI

Copy the SQL files from `supabase/migrations/` into the Supabase SQL editor and run them in order by timestamp.

## Available Scripts

| Command             | Description                                              |
|---------------------|----------------------------------------------------------|
| `npm run dev`       | Start Vite dev server on port 8001 with hot reload        |
| `npm run build`     | Create an optimized production build                     |
| `npm run build:dev` | Build using development mode (useful for debugging)      |
| `npm run preview`   | Preview the production build locally                     |
| `npm run lint`      | Run ESLint across the project                            |

> Tests are not yet implemented. Contributions that introduce unit or integration tests are welcome.

## Project Structure

```
src/
├── components/      # Reusable UI primitives (shadcn/ui)
├── hooks/           # Custom hooks (auth, mobile detection, toasts)
├── integrations/    # Supabase client + typed schema definitions
├── pages/           # Route-level screens (Dashboard, Quiz, Login, etc.)
├── providers/       # React context providers (AuthProvider)
└── lib/             # Utilities shared across the app
```

## Contributing

We welcome community contributions. To get started:

1. **Fork** the repository and clone your fork.
2. Create a feature branch (`git checkout -b feature/amazing-idea`).
3. Write clear, conventional commits (`feat: …`, `fix: …`, etc.).
4. Ensure `npm run lint` and `npm run build` both succeed.
5. Open a pull request describing your change and referencing any related issues.

Please open an issue before embarking on substantial work so we can coordinate efforts.

## Roadmap

- [ ] Add unit tests for Supabase data hooks and quiz state transitions.
- [ ] Support question tagging and advanced filtering.
- [ ] Implement spaced-repetition practice mode.
- [ ] Add CI workflow (GitHub Actions) for lint/build/test automation.

Have an idea? Open an issue and let’s discuss it.

## License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.
