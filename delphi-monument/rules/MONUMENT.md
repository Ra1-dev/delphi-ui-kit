# Delphi Monument: rules for agents

Delphi is a hackathon team. Monument is its visual style: a museum of data, dark marble with deep paint. It must make an MVP read as serious, unusual and clearly not AI-generated. Every rule here exists because the obvious alternative looked like a template. When a rule and a request conflict, say which rule and ask before breaking it.

## 1. Two layers. Decide first which one a screen belongs to

| Layer | Screens | What it uses |
|---|---|---|
| **Showcase** | what judges and first-time users see: dashboard, result of an analysis, AI answer, landing/home, application result | everything: inscription, slabs, meander, colonnade, big type |
| **Workshop** | internal screens: settings, user lists, admin tables, long forms, documents and reports | same fonts, colours, header, labels and notes; **no** inscription, slabs, meander or colonnade; dense type (`layer="workshop"` / `.m-dense`); plain progress bars |

A hackathon demo is usually 3-5 showcase screens. Do not dress a settings page as a monument.

**Light variant** for non-serious topics (food, sport, students, entertainment): `data-theme="paper"`, no Forum, no Greek signs (no inscription, meander, colonnade). Keep Literata big and bold, orchid on data and selection, bronze on the AI hint, one pigment slab per screen, sharp corners. See `references/workshop-report-light.html` §3.

## 2. Theme
- Dark (`night`) is the default and the main theme. `paper` (light) is for documents, reports, printing and the light variant. Set `<html data-theme="night|paper">`.
- Background is flat stone. No textures, veins, ornaments, gradients, glow, blobs or patterns behind content.

## 3. Colour law: roles, never hues
| Role | Token / class | Where |
|---|---|---|
| **orchid** | `--m-orchid`, `text-orchid` | the data that matters: the inscription, key facts in the thesis (`<b>`), lagging rows, selected item, data progress (meander), checked box |
| **bronze** | `--m-bronze`, `text-bronze` | the voice of the AI and the forecast: AI notes, "who" labels, forecast columns and lines, AI-at-work meander, interpuncts, active nav underline |
| **gold** | `--m-gold` | warnings only (`Alert kind="warn"`, `StatusMark kind="warn"`) |
| **danger** | `--m-danger` | errors only |
| **ok** | `--m-ok` | success marks only |
| ink / stone / line | everything else | text, buttons, links, focus, rules |

- **Pigment slabs** (`Slab`): deep orchid `#9B3590` or deep bronze `#8C5524` with light text. **At most one orchid and one bronze slab per screen; one in total on a phone.** When a desktop screen has both, mark the secondary one `mobile="note"` (`data-mobile="note"` in HTML): on phones it turns into a margin note by itself. Never pastel, never a grid of slabs, never a dark slab with a coloured edge.
- **Severity of data is not a system state.** A high-severity finding, defect or risk is data that matters: `StatusMark kind="attention"` (orchid). Medium and low: `kind="neutral"`. Red (`danger`) only means the system or an operation failed; gold only means the user must act on a system warning.
- **Paint never fills a button.** Buttons are ink. Paint goes into data and the AI voice.
- Paint as text only at weight 600+ or 20 px+.
- No raw hex/rgb in components: tokens only. No other accent colours.
- A colour never works alone: a status is a bar + a word; an error says what broke and how to fix it, with a code.

## 4. Typography
| Role | Font | Size | Use |
|---|---|---|---|
| Inscription | Forum, capitals | 30-76 px | `Inscription`: **one per showcase screen**, 2-4 words, interpuncts between words. Also the app name in the header. Nothing else in Forum |
| Key figure | Literata 700 | 64-104 px | inside a `Slab` |
| Thesis | Literata 500, facts 700 | 20-25 px | the thought of the screen in 1-2 sentences, right under the inscription |
| Question | Literata 700 | 23 px | a question in a chat protocol |
| Label | Literata 700 + 500 | 19 + 15 px | `MuseumLabel`: what it is · where from · when |
| Body | Literata 400-500 | 17 px (workshop 15) | text, table cells |
| Meta | Literata 500 | 15 px (workshop 14) | sources, hints, secondary lines |

- **Significant things are big and bold.** The key number, the thought and the actions must not be set in the same small size as everything else: that is the main sign of AI slop. Minimum 14 px anywhere.
- Fonts support Kazakh (ә ғ қ ң ө ұ ү һ і). Do not add fonts. Never Inter, Geist, Roboto, Space Grotesk, Poppins, Montserrat, Onest, Oswald.
- Numbers in tables: tabular figures (`data-num`, `.m-num`).

## 5. Composition
- Header: `AppHeader` (app name in Forum, nav, context) with the cornice profile. Footer: `Base` (stepped base). Web apps and landings: links to «Условия» and «Конфиденциальность» when those pages exist. Generated offline reports and documents: the footer names the source, the date and the generator instead.
- Grid: `Grid` of `Bay`s, 12 columns, bays divided by rules, not boxes. No cards with borders or backgrounds except slabs.
- **Never "text on the left, a coloured card on the right".** Each screen type has its own composition:
  - **Dashboard:** key figure band (orchid slab, `band`) above the inscription → inscription + thesis + actions → plan meander → colonnade full width with the AI forecast band (bronze slab) under it → table (8) + AI margin note (4).
  - **AI chat:** one protocol column (9) + an index of the questions asked (3). A question is a heading (`Question`), an answer is an exhibit: thesis → orchid band with the key figure → evidence (colonnade or table) → bronze slab with what to do → a line of sources. The AI at work: bronze meander. No bubbles, no avatars.
  - **Upload + result:** inscription + thesis → result as a full-width orchid band with actions → items with AI margin notes → files last; meander only on the file being processed. The AI correction: with **one to three** flagged items, a bronze slab right under the item it fixes; with **more items**, one bronze slab summarises all corrections (count, what kind, one action) and each item carries its own correction as a `MarginNote` with a `Redline` inside.
  - **Review queue** (one item at a time, accept/reject): workshop layer; the item in 8 columns, the reviewer panel in 4, decisions in a bar at the bottom. No slabs.
  - **Mobile form:** inscription → step meander → fields → one slab (the calculation) → full-width button. Success screen: one slab with the number; the AI forecast as a margin note.
  - **Document / report** (paper): one inscription on the title, a definition list of period/source/author, thesis, key figures as a row under an orchid rule, colonnade in dark stone, AI comment in the margin, warnings with a gold rule, page footer.
- Wide paint bands: at most two per screen.

## 6. The signs: reinterpreted Greek forms that do a job
| Sign | Component | Rule |
|---|---|---|
| Interpunct · | inside `Inscription` | only in the inscription; never ends a line (handled) |
| Meander = progress | `Meander` | plan completion, file processing, AI at work, form steps. **At most two per screen.** Orchid = data/steps, bronze = AI working, danger = failed. The number of key units follows the width by itself; do not hard-code it. Narrower than ~200 px use `ProgressBar` |
| Colonnade = bar chart | `Colonnade` | **3-10 values** of **similar magnitude** (a time series, comparable periods). Counts per category with a long tail (e.g. 2 … 170) make stubs: use a ranked table with `ProgressBar` instead. Longer series use a line. Marble = fact, dim marble = incomplete period, bronze = forecast. Abacus line on top = exactly the value. It sizes itself (78-130 px per column) and scrolls inside its block on narrow screens. Show attention with `mark` or `callout`, never a coloured column |
| Cornice | `AppHeader` | thick + thin rule under the header |
| Stepped base | `Base` | three rules under the page |
| Margin note | `MarginNote` | the AI comment next to what it explains, under a bronze rule |

No other ornaments: no meander as a border or background, no columns as decoration, no rosettes, no marble textures, no Greek letters or maxims, no "oracle" wording.

## 7. Components
| Need | Use |
|---|---|
| Page root | `Page` (`layer="workshop"` for internal screens) |
| Header / footer | `AppHeader` / `Base` |
| Layout | `Grid` + `Bay span first side` |
| Screen title, showcase | `Inscription` + `Thesis` |
| Screen title, workshop | `<h1 className="m-h">` + `.m-meta` line |
| Block heading | `MuseumLabel title source` |
| The key number | `Slab tone="orchid" band figure` |
| AI recommendation / forecast / correction | `Slab tone="bronze"` (big) or `MarginNote` (small); corrected text inside with `Redline` (`<del>` removed, `<ins>` inserted) |
| Progress | `Meander` (showcase) or `ProgressBar` (rows, workshop) |
| Bar chart 3-10 values | `Colonnade` + `ColonnadeLegend` |
| Any block with data | `DataState` (five states) |
| Table | `<table className="m-table">`, numbers with `data-num`, attention rows with `data-attention` |
| Action | `Button` (ink), `Button variant="secondary"`, `LinkButton` |
| Inputs | `TextField`, `TextArea`, `SelectField`, `Segmented`, `Checkbox` |
| Warning / error | `Alert kind="warn"` (gold) / `kind="error"`; in cells `StatusMark` (`ok`, `warn`, `error` for system states; `attention`, `neutral` for severity of data) |
| Browser `alert()` / `confirm()` | never: show an `Alert` inside the page, and confirm with a second button |

Missing something (modal, tabs, menu, date picker)? Build it from these classes and tokens without inventing new colours, signs, radii, shadows or effects. List it in your report as a **kit candidate** (see `proposals/README.md`).

Plain HTML without React or server templates (Python, Jinja, ERB…): use the same classes, include `vanilla/monument.js`, see its header for markup. It is safe to inline into a single-file page.

**Self-contained results** (pages a client opens by double-click): link `monument.css`, `fonts/` and `monument.js` from one shared `assets/` folder by relative path. Do not inline the fonts into every page: one page then weighs megabytes.

## 8. States (mandatory)
Every data block whose data arrives at runtime has five states at the **same height** (`DataState`). A static generated report has no loading state: it shows ready, partial or empty only. The states: loading (bronze meander + what is being done), empty (what is missing + one action), error (what broke + code + last known value + retry), partial (data + gold "Данные неполные" alert), ready. Buttons: default, hover, focus-visible, disabled, loading (`loading="Считаем…"`). Fields: rest, focus, error with a fix-it message.

## 9. Motion
Quiet. Tokens `--m-d-fast` 120 ms, `--m-d-base` 240 ms, `--m-d-slow` 480 ms, easing `--m-e-out`. Hover changes only colour or underline of clickable things: no lift, scale, glow or shadow. Respect `prefers-reduced-motion` (built in). No entrance choreography on every block.

## 10. Copy
- Russian or Kazakh as the product needs. The thesis says what the data means, concretely, with numbers.
- Buttons say what happens ("Выгрузить отчёт", "Отправить правку поставщику"). Never "Начать", "Узнать больше", "Подробнее", never an arrow alone.
- Every number says where it comes from (MuseumLabel source, a sources line in AI answers).
- Errors: what went wrong, how to fix it, a code. No apologies.
- No buzzwords ("революционный", "на базе ИИ", "бесшовный", "раскройте потенциал"), no "это не X, а Y", no emoji.
- Realistic data. Label demo data as demo.

## 11. Done means
- [ ] `node monument/scripts/check-monument.mjs <sources>` passes with zero findings. Run it on sources (components, templates, styles), not on built or generated pages.
- [ ] Each screen is either showcase or workshop, and follows that layer.
- [ ] Showcase: one inscription, at most one orchid + one bronze slab, at most two meanders, no "text left, card right".
- [ ] Every data block has its five states.
- [ ] Nothing significant is small: key number, thesis and actions stand out by size and weight.
- [ ] Works at 375 px with no horizontal page scroll (tables scroll inside `.m-tw`).
- [ ] Footer per §5 (legal links for web apps, source and date for offline reports); no dead links in the final build.
