# ParthScribbles

> A hand-drawn indie arcade sketchbook — discover, play, and review community-made browser games.

**Live:** https://parthscribbles.vercel.app

ParthScribbles is a single-page web platform styled like a living sketchbook. It hosts a curated catalogue of indie arcade games, lets players favourite titles and leave reviews, and gives community & verified developers a submission pipeline that an admin moderates in real time.

---

## Features

- **Hand-drawn sketchbook UI** — paper textures, marker fonts, crayon borders, and an animated live background.
- **Game catalogue** — browse curated titles with covers, genres, play counts, and featured badges.
- **Two ways to play**
  - *Sketch Arcade* — a built-in hand-drawn `canvas` game engine (`ArcadeCabinetGame`).
  - *External App* — embed or launch a game hosted elsewhere in a new tab.
- **Favourites & reviews** — persisted to `localStorage` and synced to Firestore, with a real-time listener.
- **Developer submissions** — anyone can submit a game; it enters a `pending` queue for admin approval.
- **Admin dashboard** — approve/reject submissions, toggle developer verification, and monitor content.
- **Real-time cloud sync** — Firestore `onSnapshot` listeners keep games and reviews live across clients.
- **Offline-friendly** — favourites and reviews are cached locally and hydrate instantly before the cloud sync completes.
- **Retro audio** — a tiny Web Audio synth (`arcadeAudio.ts`) generates jump/score/hit/page-flip sounds with no asset files.

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animation | `motion` |
| Icons | `lucide-react` |
| Backend / DB | Firebase Firestore (real-time) |
| Auth (admin) | Lightweight client-side gate (see Security) |
| Hosting | Vercel (static SPA) |

## Project Structure

```
.
├── index.html                     # App shell + Google Fonts
├── firebase-applet-config.json    # Firebase client config (public web keys)
├── firebase-blueprint.json        # Firestore entity/schema blueprint
├── firestore.rules                # Security rules for games & reviews
├── vite.config.ts                 # Vite + React + Tailwind config
└── src
    ├── main.tsx                   # React entry point
    ├── App.tsx                    # View router (welcome / home / favourites / admin)
    ├── context
    │   └── FavouritesContext.tsx  # Favourites, reviews, submissions, admin state + Firestore sync
    ├── lib
    │   ├── firebase.ts            # Firebase init + connection probe
    │   └── arcadeAudio.ts         # Web Audio sound synthesizer
    ├── components
    │   ├── Navbar.tsx, Footer.tsx
    │   ├── WelcomeView.tsx, GameGrid.tsx, GameCard.tsx
    │   ├── GameDetailView.tsx, PlayModal.tsx, ArcadeCabinetGame.tsx
    │   ├── FavouritesView.tsx, SubmitGameModal.tsx
    │   ├── AdminLoginModal.tsx, AdminDashboardView.tsx
    │   └── SketchbookLiveBackground.tsx
    ├── data/games.ts              # Seed catalogue (INITIAL_GAMES, INITIAL_REVIEWS)
    └── types/index.ts             # Game & Review interfaces
```

## Getting Started

**Prerequisites:** Node.js 20+ (or Bun) and a Firebase project.

```bash
# install dependencies (project ships a bun.lock)
bun install
# or, with npm (peer-dep resolution is strict):
npm install --legacy-peer-deps

# start the dev server on http://localhost:3000
npm run dev

# production build -> dist/
npm run build

# preview the production build
npm run preview

# type-check only
npm run lint
```

## Firebase / Firestore

The client reads its configuration from `firebase-applet-config.json` (imported statically in `src/lib/firebase.ts`). No environment variables are required for the Firestore connection.

> This file is **git-ignored** (it carries project-specific identifiers). Create your own from the committed template before building:
>
> ```bash
> cp firebase-applet-config.example.json firebase-applet-config.json
> # then fill in the values from Firebase Console → Project settings → Your apps
> ```

```ts
// src/lib/firebase.ts
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
```

On startup the app probes the connection via `testFirestoreConnection()` and logs whether it is running against the cloud or the offline cache.

### Data model

| Collection | Doc fields | Notes |
| --- | --- | --- |
| `games/{gameId}` | `id`, `slug`, `title`, `description`, `longDescription`, `genre`, `coverUrl`, `externalUrl`, `controls[]`, `developerName`, `developerType`, `status`, `playCount`, `createdAt` | `status` is `pending` \| `approved` \| `rejected` |
| `reviews/{reviewId}` | `id`, `gameId`, `userName`, `userAvatar`, `rating` (1–5), `comment`, `createdAt` | Append-only |
| `test/connection` | — | Used by the startup connectivity probe |

Seed games from `src/data/games.ts` are always treated as approved and merged with Firestore results.

### Deploying the rules

```bash
firebase deploy --only firestore:rules
```

## Deployment (Vercel)

The site is a static SPA built by Vite to `dist/`.

```bash
vercel link --project parthscribbles
vercel deploy --prod
```

Production URL: **https://parthscribbles.vercel.app** (project `pravaah3/parthscribbles`; Vercel requires lowercase project names).

## Security Notes

> These are known limitations of this demo, listed for transparency:

- Admin access is a **client-side gate only** (a hardcoded email/password check in `src/context/FavouritesContext.tsx`) — it is not real authentication and the credentials are visible in the source. Move it behind Firebase Auth + server-side authorization before any serious use.
- Firestore rules currently allow **public create/read** on `games` and `reviews` with field validation, but **no write restriction on `update`/`delete`** for `games`. Tighten these before production.
- Firebase *web* API keys are public by design and never secret — real protection comes from `firestore.rules`. Even so, the project's config file is kept out of git (see below) to avoid publishing project identifiers.

## Git & Ignored Files

This repository is intentionally trimmed to source code only. The [`.gitignore`](./.gitignore) excludes everything that is either sensitive, machine-specific, or reproducible:

| Ignored | Why |
| --- | --- |
| `.env`, `.env.*` (but **not** `.env.example`) | Secrets / API keys / tokens |
| `.env.local` | Created by `vercel link`; contains a live **`VERCEL_OIDC_TOKEN`** |
| `.vercel/` | Machine-specific Vercel project link |
| `firebase-applet-config.json` | Project-specific Firebase identifiers — use `firebase-applet-config.example.json` as a template |
| `node_modules/`, `.pnp`, `jspm_packages/` | Installed dependencies (use `bun install` / `npm install`) |
| `dist/`, `build/`, `out/`, `.vite/`, `*.tsbuildinfo` | Build output / caches |
| `coverage/`, `.nyc_output/` | Test artifacts |
| `*.log`, `logs/` | Runtime logs |
| `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.crt`, `serviceAccount*.json`, `credentials*.json`, `secrets*.json` | Private keys & service-account credentials |
| `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/*`, `*.swp` | OS / editor cruft |
| `*.tmp`, `*.temp`, `.cache/`, `.temp/`, `.tmp/` | Scratch files |

**Committed on purpose:** `.env.example`, `firebase-applet-config.example.json`, `bun.lock`, `firestore.rules`, and `firebase-blueprint.json` — templates and reproducible config that contain no secrets.

> **Note:** the Vercel CLI uploads the working tree (it honors `.vercelignore`, not `.gitignore`), so `vercel deploy` still works with the Firebase config excluded from git. If you instead connect this repo to Vercel via **Git integration**, add `firebase-applet-config.json` to the build (or set the values as build-time environment variables and read them in `src/lib/firebase.ts`).

## License

Released for demo/educational purposes. Game assets and third-party titles belong to their respective owners.
