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

## Publication preparation update

Remote main advanced to `a1e385d`: owner-added `danielpro-site.json` declares subdomain `simlab`; `.github/workflows/auto-merge-codex.yml` marks codex draft PRs ready and squash-merges them, checking the exact PR head. These changes were merged locally and preserved. The workflow does not build or inspect the server. Per the owner-supplied setup report, `dist/` is now committed so a server serving this directory can publish without Node/build steps. No credentials or application executables are included. Pushing this update may trigger the owner-configured merge/publication.

A fresh HTTPS request still failed at the environment proxy (CONNECT 403). Actual nginx document root, webhook execution and public page remain unverified. Library image IDs `libfile_a5b8fc40df388191ab55233c709c2e40` and `libfile_5119073e16ec8191b9b00f5461a78bcb` resolved to `02-projectile-stage.png` and `04-water-3d-dark.png`; both byte transfers failed, so neither is falsely represented as integrated. Existing real catalogue imagery is retained.

## Download and imagery refinement (review required)

2026-11-17: inspected the private application releases again: v1.0.1 still lists Windows setup and portable executables only; no AppImage is present. The public site repository has no releases. A fresh domain check failed with proxy CONNECT 403; the external web reader also could not access the URL. This cannot establish whether the origin server is online or offline.

The new proposal replaces the vector hero with genuine dark-theme cell, DNA and molecule catalogue images from the previously verified application source. These are not complete interface screenshots, and captions explicitly identify their source. Download presentation now has separate Windows installer, Windows portable and Linux AppImage cards, non-interactive unavailable buttons, file sizes/hashes for existing Windows release assets and an explicit unverified/preparing state for AppImage. No AppImage filename, size or checksum is invented. Buttons become links only when the corresponding metadata has status `available` and an HTTPS URL; maintainers must independently verify the actual binary and public access before setting that status.

All seven production-build Playwright tests passed after these changes, including axe, 320/390/768/1440 px layouts and download details interaction. Refreshed screenshots are under docs/previews/. The branch `review/simlab-downloads-visuals` intentionally does not match the owner's `codex/` auto-merge rule. This proposal must remain a draft PR until Daniel approves integration into the existing site; the previous version stays in main.

## Theme and pastel revision

Applied Daniel's review feedback within PR #2: original app light thumbnails replace dark backgrounds in light mode; full-site dark mode uses the corresponding original dark thumbnails. Cream, mint and lilac download cards adapt to muted dark counterparts. Theme selection uses the system preference initially, persists explicit choices and has localised accessible labels. Entrance and hover motion retain full text opacity and are disabled for reduced motion. No availability changes or invented download links.

Production build and all 11 tests passed, including axe contrast checks for light/PT, light/EN, dark/PT and dark/EN, mobile overflow and theme selection/persistence. Refreshed desktop/mobile captures for all four combinations and download close-ups are in docs/previews/themes/. Light desktop EN, dark mobile PT and download detail views were visually reviewed. Assets originate in the same verified app checkout; no app build was repeated.

## Owner-confirmed Windows downloads — 2026-11-17

Daniel directly confirmed in the conversation at 14:21 UTC that the live site serves commit 32e2ce9 and that `/downloads/SimLab-1.0.1-setup.exe` and `/downloads/SimLab-1.0.1-portable.exe` return HTTP 200 with sizes and SHA256 matching downloads.json. He explicitly requested activation and merge. Windows metadata is now `available` with the exact HTTPS URLs and owner-confirmation provenance. Existing release hashes/sizes are unchanged. Site copy in both languages reflects availability; Linux remains preparing/disabled. This relies on Daniel's server verification, not a claim of independent byte verification by this agent. Local navigation tests intercept the URLs solely to check button wiring, not server integrity.

## Native captures, SimLab branding and real demonstrations — 2026-11-17

Removed the EDUCARE sub-label and renamed the public title/metadata to SimLab. PT/EN hero and FAQ now explicitly say Windows is available and Linux is in preparation. Windows links and owner-confirmed provenance are unchanged; Linux remains disabled.

Executed the official browser renderer of application source commit `37bc55c03e6ddbe1c7642ee1cf96ab023c08b43b` with `npm run dev:web`, in cloud Chromium/SwiftShader. This is the real application renderer, **not an Electron window capture**. The separate Linux build was not repeated. Six real stages were captured at 2512×1774 (function grapher: 2512×1776), covering Portuguese/English and light/dark. DNA was zoomed out through its actual wheel control so the whole helix fits. No generated interface, enlarged catalogue thumbnails or altered simulation content. Original images open through accessible links; manifest records provenance.

Recorded two real pointer interactions: Studio circuit switch open/closed (current changes from 0.750 A to 0.000 A and back), followed by dragging the lamp; and rotating the DNA helix. H.264 videos retain the native stage crop at 1256×886 and 24 fps with faststart, no audio. Studio files are 100–121 kB; DNA files 350–415 kB. Language/theme variants total approximately 1.9 MB, but **no video source is assigned or downloaded until the visitor presses Play**. Posters remain visible, native controls/fullscreen appear on playback, changing theme/language stops playback, and reduced-motion visitors get the same opt-in behaviour. Captions describe the silent action in both languages. Frame inspection confirmed the switch state/current and lamp movement; playback is checked in the browser.

Review remains on `review/simlab-brand-imagery` (outside the owner auto-merge workflow's `codex/` prefix). Do not merge until Daniel approves this new revision. `dist/` includes the new assets for the existing server contract. No claim of a new live deployment or independent executable verification is made.

Final verification: `npm run lint`, `npm run build`, and all 13 Playwright tests pass. Tests cover 320/390/768/1440 px, all four theme/language combinations, axe WCAG checks, repeat navigation/gallery/FAQ interactions, download wiring, native-image resolution, no initial video network requests, opt-in playback under reduced motion and language/theme playback reset. Eight full-page desktop/mobile screenshots, download sections and Studio sections were refreshed for review. All eight video variants were checked with ffprobe; the renderer capture manifest contains no page errors.

## Owner-confirmed Linux AppImage — 2026-11-17

Daniel confirmed publication of website commit 580743c and a public, functional `https://simlab.danielpro.dev/downloads/SimLab-1.0.1.AppImage`, with SHA-256 `bb0a42d8a575c459832e10da23c87556b874f28bcfa8eaa5a54c725b3f47ac6a`, and requested activation/publication. Metadata records this owner confirmation. The AppImage link is now active and PT/EN hero, metadata, FAQ and download descriptions reflect availability. No size was supplied; bytes remains null and the card displays the verified version without an invented size. Reference checksum wording avoids implying an independently checked GitHub release. Windows metadata is unchanged.

An independent HEAD request again failed before reaching the origin with proxy CONNECT 403. Browser navigation tests stub responses solely to validate button wiring. No new remote integrity or publication claim follows from those tests.

## Automatic gallery, Studio tour and compact gradient layout — 2026-11-17

New review revision based on main 23e017c. Experiment uses the five native-resolution stage captures in a lightweight one-second carousel while visible. Pause/resume is explicit; hover, keyboard focus, manual selection, hidden tabs and reduced-motion preferences stop automatic advances. Link names and targets continue to track the selected capture.

Re-recorded the official Studio renderer at the previously documented source commit. Used its real example selector to show circuit (including switch interaction), acid/base neutralisation, quadratic function, photosynthesis and lunar cannon/pendulum. Four PT/EN/theme variants are 12.5 seconds, 131–162 kB each. Original example titles remain as authored by the app (some are Portuguese even in the English app); no UI text was fabricated. Studio starts muted/inline/looping only when visible, pauses offscreen, respects user pause and falls back to the poster/play control when autoplay is unavailable. Reduced motion keeps manual playback. DNA video remains opt-in. Asset provenance updated.

Replaced download decorations with flat Windows/Windows/Linux SVG symbols; downloads.json is byte-for-byte unchanged. Dark mode uses navy/blue/violet gradients with an amber accent inspired by the mark. Reduced section spacing and responsive media heights preserve intrinsic proportions without imposing fixed viewport-height containers. At 1366×768 in all four combinations: hero 632 px, Studio section 617 px, video 353 px and gallery image frame 364 px. A 683×384 viewport (200%-zoom equivalent available layout area) has no horizontal overflow. Small screens continue to stack naturally.

Validation: lint/build; 15 existing tests passed; the new carousel/autoplay test passed after fixing offscreen resume. Six affected theme/media tests re-run successfully after that fix. Real frame contact sheet confirms all five Studio examples. Desktop/mobile screenshots refreshed for all four combinations, plus gallery/download/Studio views. Library reference metadata and extracted descriptions were readable; raw reference pixels were not returned through the available read route. No deployment or merge for this review revision.

Tablet/mobile follow-up: responsive stacking and compact navigation now begin at 900 px. Narrow-phone explanatory blocks stack into one column with 14 px body text. Rebuilt dist and refreshed desktop/mobile captures; tablet captures added at 820 px. Eight focused responsive/theme/accessibility checks passed after this adjustment (320/390/768/1440 px plus PT/EN and light/dark).

Delivery blocker: automated approval review rejected creation of an external draft PR in danielcodemoz/simlab-site, stating that website edits did not explicitly authorise opening/publishing a PR to that repository. After checking trusted history, the subsequent attempt was interrupted; a read-only check confirmed there are no open PRs. No workaround or further PR attempt is being made. The initial revision 392e06c was pushed before that rejection; the tablet follow-up is retained locally pending resolved authorisation. No merge/publication.
