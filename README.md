# croM

croM is a browser-based tool for coding intervals on a video: load a local video file, bind subjects/behaviors to keys, and toggle each one as you watch to record open/close timestamps. Everything runs client-side — no upload, no backend.

This is an updated and improved version of the tool used in [this study](https://doi.org/10.1016/j.ijppaw.2024.101023), originally developed to meet the needs of the researchers.

## Features

- Load any local video file (nothing leaves the browser).
- Any number of subjects, each bound to a keyboard key or an on-screen card.
- Toggle a subject by pressing its key or clicking its card while the video plays — each press records the video's current timestamp, alternating open/close of an interval. Toggling is disabled while the video isn't playing.
- Four default subjects (keys `1`–`4`) are seeded on load; add or remove subjects freely.
- A session-wide report below the video: a chronological log of every trigger/release event, and a table of intervals + totals per subject.
- Export the session as CSV or JSON.
- Sessions persist in `localStorage`, keyed by the video's name/size/last-modified date — reselecting the same file offers to resume where you left off.

## Getting started

```sh
npm install
npm run dev
```

Open the printed local URL, load a video file, and start toggling subjects.

## How to use

1. **Load a video.** On the *Session* tab, pick a local video file in the player. If a saved session already exists for that file, you'll be asked to resume it or start over.
2. **Set up subjects.** Four default subjects (keys `1`–`4`) are seeded automatically. Use **+ Add subject** to add more (a label and a key). Each card has buttons to edit or remove it, plus an expand/collapse icon that just resizes the card — it has no effect on recording.
3. **Record.** Play the video, then press a subject's bound key or click its toggle button (showing its label and key) to start an interval; press/click again to end it — each press logs the video's current timestamp. Recording only works while the video is playing.
4. **Check the report.** Switch to the *Log* tab for a chronological list of every trigger/release event, or the *Table* tab for per-subject intervals and totals.
5. **Save or export.** Use **Save to history** (or flip on **Auto-save to history**) to keep a copy in the *History* tab, and **Export CSV** / **Export JSON** to download the session. **Reset** clears the current session.
6. **Revisit past sessions.** The *History* tab lists auto/manually saved sessions for read-only viewing or export. The *Load JSON* tab lets you open a previously exported JSON file the same way.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production (output in `dist/`). |
| `npm run preview` | Preview the production build locally. |
| `npm run test` | Run the Vitest suite in watch mode. |
| `npm run test:run` | Run the Vitest suite once. |
| `npm run storybook` | Start Storybook to browse components in isolation. |
| `npm run build-storybook` | Build the static Storybook site (output in `storybook-static/`). |

## Tech stack

Vue 3 + Vite + TypeScript, Pinia for state, Naive UI for base components, SCSS for the custom timeline/card styling, Storybook for component-level documentation, and Vitest + Vue Test Utils for testing. Components follow Atomic Design (`atoms/ → molecules/ → organisms/ → templates/ → pages/`), each in its own folder alongside its story and spec.

## Project structure

```
src/
├── components/          # atoms, molecules, organisms, templates (Atomic Design)
├── composables/         # useKeybinds, useSessionPersistence
├── pages/HomePage.vue   # store-connected entry point
├── stores/session.ts    # Pinia store: video, subjects, intervals
├── styles/_variables.scss
├── types.ts
└── utils/                # storageKey, csv, json export helpers
```

## License

[MIT](LICENSE)
