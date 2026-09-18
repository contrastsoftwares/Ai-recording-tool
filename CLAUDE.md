# Contrast AI — AI-Powered Study Note Generator

## What This App Does
A web app that turns recordings, files, and links into comprehensive study notes. Users upload audio, video, PDFs, images, or paste URLs (YouTube, articles) — the AI transcribes, extracts, and generates formatted study notes. Also includes flashcards, practice tests, AI chat, and a photo problem solver.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style)
- **Rich Text**: TipTap 3.20
- **State**: Zustand with localStorage persistence
- **AI**: OpenAI SDK (GPT-4o for generation, Whisper for transcription)
- **Icons**: Lucide React
- **i18n**: Custom hook with 7 languages

## Project Structure
- `src/app/(app)/` — Main app routes (dashboard, notes, recorder, photo-solver, settings)
- `src/app/(auth)/` — Login/signup pages
- `src/app/api/` — Server-side API routes (transcribe, generate-notes, extract-content, chat, etc.)
- `src/components/` — Organized by feature (notes/, recorder/, chat/, flashcards/, test-generator/, layout/, ui/)
- `src/stores/` — Zustand stores (notes, upload, recording, chat, processing)
- `src/lib/` — Utilities, AI service wrapper, OpenAI client, i18n translations
- `src/types/` — TypeScript interfaces

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Key Conventions
- Components use "use client" directive when interactive
- API routes are POST-only, return `{ error: string }` on failure
- Streaming responses (NDJSON) for long operations like transcription
- All styling via Tailwind classes — no custom CSS files
- Translations via `useTranslation()` hook, organized by feature
- Stores follow `use<Entity>Store()` pattern

## Important Design Decisions
- **Single-select formats**: The user picks exactly ONE format per note (not multiple). Selecting multiple was removed because each format independently re-covered all content, causing heavy cross-format repetition.
- **Mix & Match mode** (default, replaces the old "AI Decide"): the AI produces ONE cohesive document and formats each section in whichever single style best fits that section's content (bullets, prose, table, timeline, etc.). Each fact appears exactly once — no repetition across formats.
- **Note formats**: mix-and-match (default), bullet-points, sentences, cornell, outline, key-concepts, summary, timeline, qa-format
- **Note lengths**: short, medium, long — controls detail/depth per point, never how much content is covered. Tiers are non-overlapping so Short < Medium < Long always holds.
- **Zero content loss rule**: Generated notes must capture every detail from source material regardless of format or length choices

## Don't
- Don't add comments/docstrings to code you didn't change
- Don't over-engineer — keep solutions simple
- Don't use custom CSS files — use Tailwind classes
- Don't use emojis in code unless in user-facing generated content
