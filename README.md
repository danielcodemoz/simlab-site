# Educare SimLab website

Public presentation site for Daniel Marcos's Educare SimLab, intended for **https://simlab.danielpro.dev**. Static Vite + vanilla JavaScript/CSS. Portuguese (Mozambican/pre-1990 orthography) and English, using the application's Onest font, original mark, Lucide icons and colour palette.

## Develop and verify

Node 22+:

```sh
npm ci
npm run dev
npm run check
```

`npm run check` runs syntax/format checks, production build, and Chromium Playwright tests with axe WCAG checks. Chromium defaults to `/usr/bin/chromium`; override `CHROMIUM_PATH` when needed. `npm run preview` serves the production build. No runtime server, account or external API is needed.

## Deploy to the requested server

Run `npm ci && npm run build`; serve **dist/** as the static web root. Root index.html is a Vite entry point and must not be served directly in production. All fonts, scripts and images are local. No analytics or third-party runtime requests. Language preference alone is stored locally.

The owner reports that `novo-site` serves the committed `dist/` directory without building. The repository now contains `danielpro-site.json` with subdomain `simlab`; this establishes the requested destination but does not independently verify the server document root. The owner-added `auto-merge-codex` workflow automatically marks matching draft PRs ready and merges them. A push to this PR can therefore publish through the reported server synchronisation. `dist/` is committed for the reported server contract; regenerate it with every source change. Server-side configuration remains unverified from this environment. See [verified evidence and blockers](docs/VERIFICATION.md).

## Public downloads

Current application release 1.0.1 exists in a **private repository**. Its public asset URLs return 404. The website intentionally shows “coming soon” rather than unusable buttons. `downloads.json` contains release sizes/hashes and null public URLs. After the owner publishes the existing binaries to the separate server downloads directory, verify complete file hashes and anonymous HTTP 200 before filling the corresponding URL and setting its status to `available`. The Windows installer, Windows portable and Linux AppImage cards derive their enabled state from this metadata. The AppImage entry remains `preparing` with no invented file metadata. Do not expose private GitHub credentials to the website.

## Real screenshots

Current imagery is authentic catalogue imagery from the app's source. Full screenshots from the parallel Linux execution task can be added to `public/assets/` and connected to the gallery in `main.js`; preserve provenance, aspect ratio and explicit captions. Do not replace them with generated UI. Catalogue content and source SHA are recorded in [VERIFICATION.md](docs/VERIFICATION.md).

## Existing-site changes

Use a `review/` branch for subsequent proposals requiring Daniel’s approval. The owner-managed auto-merge workflow only targets `codex/` branches; do not use that prefix for approval-gated updates. Keep `dist/` in sync with the reviewed source.
