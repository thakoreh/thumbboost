# ThumbBoost

YouTube packaging intelligence MVP for creators who need better title + thumbnail decisions before publishing.

## Market positioning

Generic AI thumbnail generators are crowded. Pikzels positions around YouTube packaging and charges roughly $28-$56/mo on annual plans; ThumbnailTest positions around A/B testing, analytics, and old-video revival. ThumbBoost is the lighter wedge between them: a low-cost packaging preflight that scores the title, niche, hook, and mobile-readability signals, then generates CTR-angle thumbnail variants.

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Clerk auth
- Convex.dev database/backend schema for users, thumbnail projects, and generation queue jobs
- Stripe checkout route for Creator and Studio subscriptions
- OpenAI DALL-E 3 route with mock fallback when no API key is set
- YouTube trending route with mock fallback when no API key is set

## Implemented
- Prompt-first packaging dashboard
- Inputs: video title, description, channel name, keywords/reference style, reference-image placeholder
- AI generation API route: `/api/generate`
- 6 CTR-angle variation gallery with loading state
- In-app quick editor for overlay text and font preset controls
- Canvas PNG export at 1280x720 with demo watermark
- Pricing model displayed: free packaging check, $12/mo Creator, $25/mo Studio
- Trend-adaptive section and `/api/trends` scaffold; YouTube API support when `YOUTUBE_API_KEY` is set
- Performance predictor heuristic
- Rate limit helper for generation/trends
- Convex schema and functions in `convex/`
- Clerk + Convex provider bridge in `src/components/app-providers.tsx`
- Stripe checkout API route: `/api/checkout`

## Production wiring
1. Clerk: create app, configure sign-in/sign-up, set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
2. Convex: create/deploy project, set `NEXT_PUBLIC_CONVEX_URL`, configure Clerk JWT template named `convex`, and add Clerk provider in Convex Auth settings.
3. Stripe: create Creator $12/mo and Studio $25/mo prices, set env price IDs.
4. OpenAI: set `OPENAI_API_KEY` for DALL-E 3 generation.
5. YouTube: set `YOUTUBE_API_KEY` for real trending signals.
6. Coolify/Hetzner: deploy as a dynamic Next.js app with the env vars above.
7. Add a Stripe webhook route before real payments are accepted.

## Verification
```bash
npm run lint
npm run build
```
