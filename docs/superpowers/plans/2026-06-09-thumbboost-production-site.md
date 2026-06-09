# ThumbBoost Production Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ThumbBoost feel like a production-ready, trustworthy YouTube packaging product instead of a single-page prototype.

**Architecture:** Keep public marketing routes as Server Components and isolate the interactive generation/editor workflow in a smaller Client Component under `/studio`. Extract shared thumbnail preview, content, scoring, and sample-data helpers so the pages present one coherent product story without duplicating logic.

**Tech Stack:** Next.js 16.2.7 App Router, React 19, TypeScript, Tailwind CSS v4, Clerk, Convex, Stripe.

---

## Competitor Findings

- Pikzels presents itself as a YouTube packaging system, not a generic image generator, with clear pricing/credit mechanics, thumbnail analysis, title generation, style/persona training, and annual pricing around $28-$56/mo for premium tiers.
- ThumbnailTest leads with a clear workflow: test thumbnails and/or titles, understand winners with simple metrics, collaborate with teammates, and revive under-performing videos.
- vidIQ positions around broader YouTube optimization: titles, descriptions, tags, thumbnail ideas, and channel-aware optimization.
- Canva wins trust through ease, templates, testimonials, and immediate creation paths for non-technical users.

## Current ThumbBoost Gaps

- One page tries to do positioning, authenticated workspace, examples, trends, pricing, history, and export, which makes the product feel unfinished.
- The main route is a large Client Component, increasing client bundle scope and mixing static trust content with stateful generation code.
- Navigation uses hash anchors instead of route-level information architecture, so the site does not feel like a real SaaS product.
- The hero has good energy but limited trust: no workflow proof, comparison matrix, safety/guardrail messaging, FAQ, or page-specific calls to action.
- Pricing exists but lacks a dedicated buying context and competitor contrast.
- Examples are visual but thin: they do not explain decisions, scores, or why a creator should trust the output.
- Sign-in and sign-up screens use default blank centering and do not carry the product brand.

## Implementation Tasks

- [ ] **Task 1: Extract shared product data and thumbnail utilities**
  - Create `src/lib/thumbboost-content.ts` with `Thumb`, palettes, sample thumbnails, trend signals, competitor rows, workflow steps, case studies, FAQs, `makeThumbs`, and `scorePrompt`.
  - Create `src/components/thumbnail-card.tsx` for reusable thumbnail previews.

- [ ] **Task 2: Add reusable site shell components**
  - Create `src/components/auth-actions.tsx` as the small Client Component boundary for Clerk auth buttons.
  - Create `src/components/site-header.tsx` and `src/components/site-footer.tsx` as Server Components with route navigation.

- [ ] **Task 3: Rebuild the homepage as a production marketing route**
  - Replace `src/app/page.tsx` with a Server Component focused on hero, workflow, trust stats, competitor-aware positioning, examples preview, and final CTA.
  - Link primary actions to `/studio`, `/pricing`, and `/examples`.

- [ ] **Task 4: Move the product workflow to `/studio`**
  - Create `src/components/studio-workspace.tsx` as the Client Component containing the generator/editor/history/export workflow.
  - Create `src/app/studio/page.tsx` as a route-level wrapper with metadata-style page framing.

- [ ] **Task 5: Add dedicated pricing and examples routes**
  - Create `src/app/pricing/page.tsx` with plan cards, comparison context, FAQ, and checkout links.
  - Create `src/app/examples/page.tsx` with case-study cards and sample packaging outcomes.

- [ ] **Task 6: Update production basics**
  - Update `src/app/sitemap.ts` to include real routes instead of hash anchors.
  - Polish Clerk sign-in/sign-up pages with brand context.
  - Keep `src/app/layout.tsx` metadata aligned with the new route structure.

- [ ] **Task 7: Verify and ship**
  - Run `npm run lint`.
  - Run `npm run build`.
  - Run rendered desktop and mobile visual checks with local Playwright fallback because the in-app browser blocked localhost.
  - Verify `/studio` generation updates previews and PNG export still works.
  - Commit and push the changes.
