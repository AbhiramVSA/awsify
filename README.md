# AWS Cloud Architect Quiz App

## About

An interactive quiz application for AWS Cloud Solutions Architect certification preparation. Practice with custom question banks, get instant feedback, and track your progress.

## Features

- 📚 Custom question bank management
- 🎯 Category-based quiz filtering
- 💯 Real-time scoring and feedback
- 📊 Progress tracking
- 🔄 Question difficulty levels (Easy, Medium, Hard)
- 💾 Persistent storage with Supabase

## Getting Started

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/AbhiramVSA/cloud-architect-quiz.git
cd cloud-architect-quiz
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

4. Apply database migrations to Supabase (via SQL Editor or CLI). With the Supabase CLI this is:
```sh
supabase db push
```

5. Start the development server:
```sh
npm run dev
```

The app will run at `http://localhost:8001`

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Dashboard, Quiz, etc.)
├── integrations/   # Supabase client setup
├── lib/            # Utility functions
└── hooks/          # Custom React hooks
```

## Deployment

### Build for production:
```sh
npm run build
```

### Preview production build:
```sh
npm run preview
```

Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## License

MIT
