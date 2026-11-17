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

Windows installer and portable downloads now use the public server URLs in `downloads.json`. Daniel confirmed HTTP 200, exact file sizes and SHA256 matches from the server on 2026-11-17 and explicitly authorised activation/merge. This environment did not independently download the binaries because its network proxy blocks the domain. Verification provenance is recorded in the metadata and docs/VERIFICATION.md. Linux AppImage remains `preparing` with a disabled control and no public URL. No executables or credentials are stored in this repository.

## Real screenshots

Current imagery is authentic catalogue imagery from the app's source. Full screenshots from the parallel Linux execution task can be added to `public/assets/` and connected to the gallery in `main.js`; preserve provenance, aspect ratio and explicit captions. Do not replace them with generated UI. Catalogue content and source SHA are recorded in [VERIFICATION.md](docs/VERIFICATION.md).

## Existing-site changes

Use a `review/` branch for subsequent proposals requiring Daniel’s approval. The owner-managed auto-merge workflow only targets `codex/` branches; do not use that prefix for approval-gated updates. Keep `dist/` in sync with the reviewed source.
