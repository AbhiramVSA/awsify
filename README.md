<p align="center">
  <img src="assets/awsify-mark.svg" alt="Cloud outline above a quiz card with an answer mark" width="112" />
</p>

<h1 align="center">AWSify</h1>

<p align="center">A quiz app for AWS Solutions Architect study, with sign-in, personal questions, and practice by category and difficulty.</p>

<p align="center">
  <a href="#what-you-can-do">Features</a> ·
  <a href="#run-locally">Run locally</a> ·
  <a href="#data-and-auth">Data and auth</a> ·
  <a href="#license">License</a>
</p>

## What you can do

- Create questions by hand or import them from a JSON file.
- Build a quiz from the available categories and difficulty levels.
- Submit answers and view the score and explanations.
- Sign in with an email and password.

The Supabase migrations include a shared starter question set and policies for personal questions.

## Run locally

**Requirements:** Node.js and npm, plus a Supabase project.

```bash
git clone https://github.com/AbhiramVSA/awsify.git
cd awsify
npm install
```

Create a root `.env.local` file with the public Supabase project URL and publishable key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) separately, then link your project and apply the migrations:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Start the Vite development server:

```bash
npm run dev
```

Open <http://localhost:8001>.

## Data and auth

The browser app uses Supabase Auth and the `mcq_questions` table. The migrations in `supabase/migrations/` define that table, row-level security policies, and the shared starter questions. Apply these migrations before you use the app.

The app uses the Supabase publishable key in browser code. Do not put a service-role key in the Vite environment.

## Development commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server on port `8001`. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run build:dev` | Create a development-mode build. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview the build locally. |

## License

This project uses the [MIT License](LICENSE).
