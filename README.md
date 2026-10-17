# ParthScribbles

> A sketchbook that plays back. Indie arcade pages drawn in wet ink — come doodle, come press start.

**Live ink:** https://parthscribbles.vercel.app

Somewhere between a margin doodle and a real arcade cabinet, this thing breathes. ParthScribbles is a single **living page**: a paper world that opens onto a small curated shelf of indie games, remembers what you loved, lets your words spill into the margins as reviews — and hands community & verified developers a doorway to slip their own game into the book, where it waits for a keeper to stamp it *approved*.

Nothing here holds still. Firestore whispers changes across every open window the moment they happen. Close the tab, wander off — your favourites and reviews wait in the local cache, inked before the cloud even answers.

---

## What's in the sketchbook

- **A page that feels like paper** — textures, marker lettering, crayon borders, and a background that never stops sketching itself.
- **A shelf of games** — covers, genres, play counters, and a gold star for the featured few.
- **Two doors into play**
  - *Sketch Arcade* — a hand-drawn `canvas` engine built right into the page (`ArcadeCabinetGame`).
  - *External App* — frame a game from elsewhere, or fling it open in its own tab.
- **Loves & opinions** — favourites and reviews live in `localStorage` *and* Firestore, stitched together live.
- **An open doorway for devs** — anyone can slide a game through; it lands in a `pending` pile.
- **A keeper's desk** — the admin approves or turns away, flips a developer's badge, watches the shelf.
- **Cloud in real time** — `onSnapshot` keeps every page in sync, no refresh, no waiting.
- **Works half-blind** — offline? The local cache still gives you something to hold.
- **Sound with no sound files** — a pocket Web Audio synth (`arcadeAudio.ts`) conjures every jump, score and page-flip out of thin air.

## Tools on the desk

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animation | `motion` |
| Icons | `lucide-react` |
| Backend / DB | Firebase Firestore (real-time) |
| Auth (admin) | Lightweight client-side gate (see *Marks worth minding*) |
| Hosting | Vercel (static SPA) |

## How it's pieced together

```
.
├── index.html                     # the paper + ink (shell, fonts)
├── firebase-applet-config.json    # keys to the cloud room (public web keys)
├── firebase-blueprint.json        # the shape of every record
├── firestore.rules                # who may draw, who may erase
├── vite.config.ts                 # the loom
└── src
    ├── main.tsx                   # where the first stroke lands
    ├── App.tsx                    # pages: welcome / home / favourites / admin
    ├── context
    │   └── FavouritesContext.tsx  # memory: loves, reviews, submissions, admin — all synced
    ├── lib
    │   ├── firebase.ts            # opens the cloud room + tests the line
    │   └── arcadeAudio.ts         # makes noise from nothing
    ├── components
    │   ├── Navbar.tsx, Footer.tsx
    │   ├── WelcomeView.tsx, GameGrid.tsx, GameCard.tsx
    │   ├── GameDetailView.tsx, PlayModal.tsx, ArcadeCabinetGame.tsx
    │   ├── FavouritesView.tsx, SubmitGameModal.tsx
    │   ├── AdminLoginModal.tsx, AdminDashboardView.tsx
    │   └── SketchbookLiveBackground.tsx
    ├── data/games.ts              # the seed shelf (INITIAL_GAMES, INITIAL_REVIEWS)
    └── types/index.ts             # the vocabulary (Game & Review)
```

## Scratch it into life

**Bring:** Node.js 20+ (or Bun) and a Firebase project of your own.

```bash
# gather the tools (a bun.lock rides along)
bun install
# or, with npm (its peer resolution grips tight):
npm install --legacy-peer-deps

# wake the page at http://localhost:3000
npm run dev

# press the whole thing flat -> dist/
npm run build

# walk through the flat version
npm run preview

# check the lines are straight, nothing more
npm run lint
```

## Wiring the cloud

The page reads its keys from `firebase-applet-config.json` — pulled in by hand at `src/lib/firebase.ts`. No environment variables stand between you and Firestore.

> That file is **hidden from git** (it carries the fingerprints of one particular project). Trace your own from the template that *is* committed:

> ```bash
> cp firebase-applet-config.example.json firebase-applet-config.json
> # then fill it from Firebase Console → Project settings → Your apps
> ```

```ts
// src/lib/firebase.ts
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
```

The moment the page wakes, `testFirestoreConnection()` taps the cloud on the shoulder and reports back — *real room*, or *offline cache pretending*.

### The ledger

| Collection | Doc fields | Notes |
| --- | --- | --- |
| `games/{gameId}` | `id`, `slug`, `title`, `description`, `longDescription`, `genre`, `coverUrl`, `externalUrl`, `controls[]`, `developerName`, `developerType`, `status`, `playCount`, `createdAt` | `status` is `pending` \| `approved` \| `rejected` |
| `reviews/{reviewId}` | `id`, `gameId`, `userName`, `userAvatar`, `rating` (1–5), `comment`, `createdAt` | append-only — written, never rewritten |
| `test/connection` | — | the wake-up knock |

The seed shelf in `src/data/games.ts` is always inked in as approved, then woven together with whatever the cloud sends back.

### Post the rules

```bash
firebase deploy --only firestore:rules
```

## Ship it skyward

Flat, fast, static — Vite presses it into `dist/`.

```bash
vercel link --project parthscribbles
vercel deploy --prod
```

**Alive at:** https://parthscribbles.vercel.app — project `pravaah3/parthscribbles` (the platform demands names all in lowercase, so the capital letters had to go).

## Marks worth minding

> Honest scuffs in the paint. This is a demo, and these are its soft spots:

- The admin door is a **sketch of a lock** — an email and password checked in the open at `src/context/FavouritesContext.tsx`. It is not real authentication, and the words are plainly readable in the source. Before this grows teeth, move it behind Firebase Auth and let the server decide.
- The rules let anyone **add and read** `games` and `reviews` (with careful shape-checking), but they leave `games` wide open to `update` and `delete`. Close that gap before the crowd arrives.
- Firebase **web** keys are meant to be seen — they were never the secret. The real wall is `firestore.rules`. Still, the config stays out of git (below) so one project's fingerprints don't travel.

## Kept out of the sketchbook

This repo is trimmed to the drawing itself — source, templates, and nothing that could sting. The [`.gitignore`](./.gitignore) sweeps the rest off the page:

| Kept out | Because |
| --- | --- |
| `.env`, `.env.*` (but **not** `.env.example`) | secrets, keys, tokens |
| `.env.local` | born of `vercel link`; carries a living **`VERCEL_OIDC_TOKEN`** |
| `.vercel/` | the machine's own tether to a project |
| `firebase-applet-config.json` | one project's fingerprints — build from `firebase-applet-config.example.json` |
| `node_modules/`, `.pnp`, `jspm_packages/` | gathered tools (`bun install` / `npm install` rebuilds them) |
| `dist/`, `build/`, `out/`, `.vite/`, `*.tsbuildinfo` | flattened output & caches |
| `coverage/`, `.nyc_output/` | crumbs of testing |
| `*.log`, `logs/` | the chatter |
| `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.crt`, `serviceAccount*.json`, `credentials*.json`, `secrets*.json` | private keys & service-account spells |
| `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/*`, `*.swp` | desktop and editor debris |
| `*.tmp`, `*.temp`, `.cache/`, `.temp/`, `.tmp/` | scratch marks |

**Kept on purpose:** `.env.example`, `firebase-applet-config.example.json`, `bun.lock`, `firestore.rules`, and `firebase-blueprint.json` — templates and honest, reproducible scaffolding that hold no secrets.

> **One quiet catch:** the Vercel CLI carries the *working tree* skyward (it bows to `.vercelignore`, not `.gitignore`), so `vercel deploy` flies fine with the Firebase config hidden from git. Wire this repo to Vercel through **Git integration** instead, though, and you'll need to hand the build its `firebase-applet-config.json` — or feed the values in as build-time environment variables and read them in `src/lib/firebase.ts`.

## Borrowed crayons

Released for demos and learning. The games and art belong to the hands that made them.
