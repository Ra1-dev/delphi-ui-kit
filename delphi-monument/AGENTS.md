# Instructions for coding agents (Cursor, Codex, Copilot and others)

This project uses the **Delphi Monument** style. Before writing any UI code:

1. Read `monument/rules/MONUMENT.md` and `monument/rules/anti-slop.md` and follow them over your own defaults.
2. Decide per screen: showcase (what judges see) or workshop (internal, dense). Theme `night` by default, `paper` for documents.
3. Build from the components in `src/monument/components` (see `monument/examples/DashboardScreen.tsx` and `WorkshopScreen.tsx`).
4. Use only Monument Tailwind roles (`bg-stone`, `text-ink2`, `border-line`, `text-orchid`, `text-bronze`, `font-carve`, `font-book`). Default Tailwind colours, radii and shadows are disabled on purpose.
5. Every data block has loading, empty, error, partial and ready states (`DataState`).
6. Before finishing, run `node monument/scripts/check-monument.mjs <your sources>` (components and templates, not built pages) and fix every finding.

Copy this file to the project root as `AGENTS.md` (Claude Code users install the `delphi-monument` skill instead).
