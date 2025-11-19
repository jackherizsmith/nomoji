# Nomoji - "Who's missing?"

A daily emoji identification game where players must identify which emoji is missing from a chaotic field of 50 animated emojis.

## Features

- **Daily Challenge**: Same game for all players, resets daily
- **Infinite Mode**: Endless practice with randomly generated games
- **Two Guesses**: Players get two attempts to find the missing emoji
- **Timer**: Track your speed from page load to correct answer
- **Share Results**: Share your daily game results with friends
- **Animated Chaos**: 50 emojis moving, rotating, and changing size/saturation

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- PostgreSQL
- Prisma ORM
- Docker

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run with Docker:
```bash
npm run docker:up
```

4. Or run locally (requires PostgreSQL):
```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Game Rules

1. 50 animated emojis appear on screen
2. Three emoji buttons appear at the bottom
3. One of the three emojis is missing from the field
4. You have two guesses to identify the missing emoji
5. Your time is tracked from page load
6. Second incorrect guess = DNF (Did Not Finish)

## Project Structure

```
nomoji/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── infinite/          # Infinite mode page
│   └── page.tsx           # Daily game page
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── docker-compose.yml    # Docker configuration
└── Dockerfile           # Docker build file
```

## License

MIT
