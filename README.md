# ThumbAI

Sleek SaaS thumbnail generator MVP for creator thumbnails.

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase scaffold for auth, usage, projects/history schema
- Stripe checkout route for Basic and Pro subscriptions
- OpenAI DALL-E 3 route with mock fallback when no API key is set
- YouTube trending route with mock fallback when no API key is set

## Implemented
- Prompt-first creator dashboard
- Inputs: video title, description, channel name, keywords/reference style, reference-image placeholder
- AI generation API route: `/api/generate`
- 6 variation gallery with loading state
- In-app quick editor for overlay text and font preset controls
- Canvas PNG export at 1280x720 with demo watermark
- Freemium pricing model displayed: free MVP demo, $12/mo Basic checkout-ready, $25/mo Pro provider-ready
- Trend-adaptive section and `/api/trends` scaffold; YouTube API support when `YOUTUBE_API_KEY` is set
- Performance predictor heuristic
- Rate limit helper for generation/trends
- Supabase schema snippet in `src/lib/supabase.ts`
- Stripe checkout API route: `/api/checkout`

## Local run
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Production wiring
1. Supabase: create project, enable auth, run the SQL in `src/lib/supabase.ts`.
2. Stripe: create Basic $12/mo and Pro $25/mo prices, set env price IDs.
3. OpenAI: set `OPENAI_API_KEY` for DALL-E 3 generation.
4. YouTube: set `YOUTUBE_API_KEY` for real trending signals.
5. Add a Stripe webhook route before real payments are accepted.

## Verification
```bash
npm run lint
npm run build
```
