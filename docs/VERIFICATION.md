# Content and release verification

Verified 2026-11-17 against `danielcodemoz/educaresimlab` main commit `37bc55c03e6ddbe1c7642ee1cf96ab023c08b43b` (read-only checkout).

- `src/renderer/src/sims/registry.ts`: 89 catalogue entries including Studio; Physics 41, Chemistry 19, Mathematics 18, Biology 11. `catalogue.json` preserves IDs, categories, dimensions and English titles; Portuguese titles receive pre-1990 orthography edits.
- `src/renderer/src/styles/app.css`: Onest Variable, navy #14213d, primary #2347c9, yellow #ffc533 and subject colour system. Darker text variants used for accessible small labels.
- Original mark copied from `src/renderer/src/assets/mark.svg`. Lucide icon family matches application's `ui/SimCard.tsx`. Onest and Lucide licences remain in installed package distributions.
- Images copied from the application's committed `assets/thumbs/*-light.jpg`; they are genuine application catalogue thumbnails, NOT fabricated full application screenshots. Labelled accordingly. Hero diagram is an editorial science illustration, not application UI.
- README and source verify offline desktop use, Portuguese/English, controls, saved .simlab files and stage images. No claim of curriculum certification, measured learning outcomes, mobile application support or tested Windows compatibility.
- GitHub authenticated release metadata confirms v1.0.1, published 2026-11-17, portable 80,105,074 bytes and setup 80,273,978 bytes, with hashes recorded in `downloads.json`.
- **Repository is private.** Anonymous GET of the portable GitHub asset returned HTTP 404. Authenticated release metadata does not prove public availability. Downloads therefore remain visibly unavailable with no broken release links. Hashes are metadata from GitHub, not independently recomputed binary hashes.
- Full app build and execution is assigned to another task. This website task does not build or test the Electron app.

## Deployment evidence

`simlab-site` initial HEAD and remote main both `886b07ec1f8c797ccf5bd1ea57a259afb103269f`. No AGENTS.md, HANDOFF or local skills existed in the site repository. App-repository instructions were read but no app files changed.

The selected environment has no configured server secret or outbound identity. The requested domain was tested through the normal proxy: CONNECT denied with HTTP 403 and curl status 000. The domain and server are absent from the enforced network allowlist. No server changes were made; nginx, DNS, HTTPS and webhook claims remain unverified.

Before publication: provide authorized server connection and network access; inspect `novo-site` and its serving/build contract; publish tested `dist/`; verify HTTPS and expected content from outside. Do not assume its webhook builds Vite. Store large executables separately from the web repository, verify public URLs and SHA256, then configure downloads. No need to make the application repository public.

## Website validation

`npm run check` passed: syntax + Prettier, Vite production build, all 7 Playwright tests. Chromium tested at 320, 390, 768 and 1440 px, including no horizontal overflow, decoded real images, working section targets, repeated mobile menu navigation, category filtering, accent-insensitive search, empty results, expand/collapse, persistent PT/EN selection, FAQ toggles, keyboard skip link, reduced motion and repeated gallery selection. Axe found no WCAG A/AA violations in tested states. These automated checks do not establish complete accessibility conformance.

Desktop PT, desktop EN and mobile PT screenshots were visually reviewed and are in `docs/previews/`. The Library batch upload helper failed before transfer with `hosted apps tools/list request failed: network`; no Library IDs were created. Screenshots remain available in this repository and locally.

Production JavaScript is approximately 31.5 kB (11.8 kB gzip), CSS 20.2 kB (5.8 kB gzip), with local subsetted font files and actual small JPG thumbnails. No generated pretend UI or remote runtime dependencies.
