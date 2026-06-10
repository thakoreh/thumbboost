# ThumbBoost

YouTube packaging intelligence MVP for creators who need better title + thumbnail decisions before publishing.

## Market positioning

Generic AI thumbnail generators are crowded. Pikzels positions around YouTube packaging and charges roughly $28-$56/mo on annual plans; ThumbnailTest positions around A/B testing, analytics, and old-video revival. ThumbBoost is the lighter wedge between them: a low-cost packaging preflight that scores the title, niche, hook, and mobile-readability signals, then generates CTR-angle thumbnail variants.

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Clerk auth
- Convex.dev database/backend schema for users, thumbnail projects, and billing status
- Stripe checkout, Customer Portal, and webhook routes for Basic and Pro subscriptions
- OpenAI `gpt-image-1` image generation with guarded fallback when no API key is set
- YouTube trending route with fallback when no API key is set

## Implemented
- Prompt-first packaging dashboard
- Inputs: video title, description, channel name, keywords/reference style
- AI generation API route: `/api/generate`
- Abuse guard: signed-out users get one generated image per request and tighter hourly rate limits; signed-in users reserve quota server-side before image generation
- Convex-backed fixed-window rate limiting for shared production abuse controls, with in-memory fallback for local/demo mode
- Enforced free plan quota: 5 thumbnails/month, with Basic and Pro capped to six variants per generation request
- Blank optional field handling; fully blank prompts are rejected before spending image credits
- 6 CTR-angle variation gallery with loading state
- Editable overlay text rendered separately from generated image backgrounds
- Functional font preset controls for preview and export
- Canvas PNG export at 1280x720 with plan-aware watermark text
- Pricing model displayed: free packaging check, $12/mo Basic, $25/mo Pro
- Stripe checkout API route: `/api/stripe/checkout`
- Stripe Customer Portal API route: `/api/stripe/portal`
- Stripe webhook API route: `/api/webhooks/stripe` with duplicate event tracking and subscription-status-aware plan updates
- Privacy and Terms pages linked in the footer
- Health, readiness, sitemap, and robots routes; `/api/health` is deployment liveness and `/api/readiness` reports launch-critical environment issues with HTTP 503
- Convex schema and functions in `convex/`
- Clerk + Convex provider bridge in `src/components/app-providers.tsx`

## Production wiring
1. Clerk: create app, configure sign-in/sign-up, set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
2. Convex: create/deploy project, set `CONVEX_URL` for server routes and `NEXT_PUBLIC_CONVEX_URL` for the browser, configure Clerk JWT template named `convex`, and add Clerk provider in Convex Auth settings.
3. Stripe: create Basic $12/mo and Pro $25/mo prices, enable the Customer Portal, and allow subscription updates/cancellations there. Set `STRIPE_BASIC_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
4. Stripe webhook endpoint: `https://<domain>/api/webhooks/stripe` with `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`. Active/trialing subscriptions grant paid access; inactive subscription states downgrade to Free.
5. OpenAI: set `OPENAI_API_KEY` and optionally `OPENAI_IMAGE_MODEL=gpt-image-1`.
6. YouTube: set `YOUTUBE_API_KEY` for real trending signals.
7. Coolify/Hetzner: deploy as a dynamic Next.js app with the env vars above.

## Verification
```bash
npm test
npm run lint
npm run preflight
npm run build
PORT=3000 npm start
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:3000/api/readiness
```

`npm run preflight` is the strict live-launch gate: it rejects missing env, localhost app URLs, malformed service URLs, and test-mode Clerk/Stripe keys. `/api/health` returns HTTP 200 when the Next.js process is alive so deployment health checks do not roll back a bootable app. `/api/readiness` returns `503` until required Clerk, Convex, Stripe, OpenAI, and app URL variables are configured; it allows linked test-mode Clerk/Stripe keys for staging unless `REQUIRE_LIVE_PROVIDER_KEYS=true` is set. `YOUTUBE_API_KEY` is optional and is reported separately. Server-side Convex calls use `CONVEX_URL` first and fall back to `NEXT_PUBLIC_CONVEX_URL`.
