---
name: delphi-monument
description: Build or restyle any web UI, dashboard, AI chat, upload/result screen, mobile web form, report or demo for the hackathon team Delphi in the Delphi Monument style (dark slate stone, Forum inscription with interpuncts, Literata, deep orchid and bronze pigment slabs, meander progress bars, colonnade bar charts, museum labels, AI margin notes). Use whenever the user asks for a frontend, a screen, a page, a component, a report, "the Delphi style" or "Монумент", or asks to make an MVP look professional for judges. Not for slides or video.
---

# Delphi Monument

You are building a screen for team Delphi. The style is decided; your job is to apply it exactly, fast, and without AI-generated clichés. The rules are short and every one of them replaced something that looked like a template, so follow them over your own taste.

## Do this first
1. Read `rules/MONUMENT.md` (the system) and `rules/anti-slop.md` (what never to do, two layers).
2. Decide for each screen: **showcase** (judges see it: dashboard, analysis result, AI answer, home, application result) or **workshop** (internal: settings, lists, admin, long forms, documents). Decide the theme: `night` (default) or `paper` (documents, print, light variant for playful topics).
3. Install the kit, unless `src/monument/` already exists:
   - copy this skill's `components/`, `styles/` and `fonts/` to `src/monument/`, and `scripts/check-monument.mjs` to `monument/scripts/` in the project root;
   - main CSS, in this order: `@import "tailwindcss"; @import "./monument/fonts/fonts.css"; @import "./monument/styles/theme.css"; @import "./monument/styles/monument.css";` (no Tailwind: link `fonts.css` and `monument.css` only);
   - set `<html lang="ru" data-theme="night">`;
   - React 18+, TypeScript; with Vite use `@tailwindcss/vite` and Tailwind v4.1+ (4.0.x breaks).
   - Plain HTML page without React: link the CSS, use the same classes, add `vanilla/monument.js` (its header shows the markup).
   - Desktop shell (pywebview, Electron, WebView2), a strict CSP or a backend that serves only a fixed list of files: `fonts.css` fails silently and you get Times. Generate `node monument/scripts/inline-fonts.mjs fonts-inline.css` (fonts as data URIs) and import that instead. Also copy `scripts/inline-fonts.mjs` to `monument/scripts/`.
4. Open the references and copy their structure, not their texts:
   - `examples/DashboardScreen.tsx` (showcase, React) and `examples/WorkshopScreen.tsx` (workshop, React);
   - `references/dashboard.html`, `references/chat-upload-mobile.html` (AI chat, upload with result, Kazakh mobile form), `references/workshop-report-light.html` (workshop, paper report, light variant). Open them in a browser if you can.
   - The references are standalone prototypes with their own local CSS. Copy their composition and copy, never their `<style>` blocks: in a project use the kit components and `monument.css` classes.

## While building
- Compose from kit components: `Page`, `AppHeader`, `Grid` + `Bay`, `Inscription`, `Thesis`, `MuseumLabel`, `Slab`, `Meander`, `Colonnade`, `MarginNote`, `DataState`, `Button`, `TextField`, `SelectField`, `Segmented`, `Checkbox`, `ProgressBar`, `Alert`, `StatusMark`, `Tabs`, `Dialog`, `Done`, `SelectionBar`, `Dock`, `Base`. `rules/MONUMENT.md` §7 says which one when.
- Use only Monument Tailwind roles (`bg-stone`, `text-ink2`, `border-line`, `text-orchid`, `text-bronze`, `font-carve`, `font-book`). Default colours, radii and shadows are switched off on purpose; if a class "does nothing", you are reaching for something banned.
- Colour law: orchid = the data that matters, bronze = the AI voice and the forecast, gold = warnings, danger = errors. Buttons and checkboxes are ink. A product without AI has no bronze slab, note or meander: do not invent an AI to use the bronze.
- Showcase limits per screen: one `Inscription`, at most one orchid and one bronze `Slab`, at most two `Meander`s, `Colonnade` only for 3-10 values. Use the composition of the screen type from §5; never "text left, coloured card right".
- Significant things are big and bold: key figure in a slab, the thesis, the actions. Nothing under 14 px.
- Every data block in `DataState` with five states.
- Copy in Russian (or Kazakh) unless told otherwise: a concrete thesis with numbers, verbs on buttons, sources for numbers, errors with codes. No buzzwords, no emoji, no oracle props.
- Missing component? Build it from the kit classes without new colours, signs or effects and list it as a kit candidate (`proposals/README.md`).
- Mobile: check 375 px.

## Before you say "done"
1. Run `node monument/scripts/check-monument.mjs <your sources>` (it reads .tsx, .html, .py, .j2 and other templates) and fix every finding. Zero is the bar. Run it on sources, not on built or generated pages.
2. Walk the checklist in `rules/MONUMENT.md` §11.
3. Do the anti-slop test at the end of `rules/anti-slop.md`.
4. In the browser, check that the real fonts loaded: `document.fonts.check('16px Literata')` and `document.fonts.check('40px Forum')` are both true.

If the human asks for something the rules ban (a gradient hero, rounded cards, a glowing button, emoji), say which rule it breaks and offer the Monument alternative; do it only if they insist.
