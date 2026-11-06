#!/usr/bin/env node
// Delphi Monument check: finds the mechanical signs of AI-generated UI and breaks of the Monument rules.
// Usage: node monument/scripts/check-monument.mjs [dir ...]   (default: src)
// Run it on SOURCES (components, templates, styles), not on built or generated pages: those inline the kit CSS and client data.
// Exit code 1 when anything is found. Zero findings is the bar before "done".
// A deliberate exception: put `monument-allow` in a comment on that line (line rules) or anywhere in the file
// as `monument-allow-file: <rule-id>` (file rules).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
// Server-side templates count too: Python, Jinja, Nunjucks, Handlebars, Vue, Svelte, Astro, ERB, Twig
const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".css", ".html", ".htm", ".mdx", ".py", ".j2", ".jinja", ".jinja2", ".njk", ".hbs", ".vue", ".svelte", ".astro", ".erb", ".twig"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".next", ".git", "coverage"]);
// The kit itself (tokens, components, vanilla script, fonts) defines the rules and is not checked
const KIT_PARTS = [`monument${sep}styles${sep}`, `monument${sep}components${sep}`, `monument${sep}vanilla${sep}`, `monument${sep}fonts${sep}`, `monument${sep}scripts${sep}`];

const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black";
const LINE_RULES = [
  { id: "raw-colour", re: /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?|oklch|oklab)\(/g, why: "raw colour; use a Monument token (var(--m-orchid), text-ink2…)" },
  { id: "tw-palette", re: new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|divide|decoration|accent|caret)-(?:${PALETTE})-\\d{2,3}\\b`, "g"), why: "default Tailwind colour; use a Monument role" },
  { id: "rounded", re: /\brounded(?:-[a-z0-9]+)*\b|border-radius\s*:(?!\s*0(?:px)?\s*[;}"])/g, why: "rounded corners; Monument is sharp" },
  { id: "shadow", re: /\b(?:shadow|drop-shadow)-[a-z0-9]+\b|box-shadow\s*:|filter\s*:\s*drop-shadow/g, why: "shadow; depth comes from rules and slabs" },
  { id: "glow", re: /text-shadow\s*:|\banimate-(?:pulse|ping|bounce)\b|\bglow\b/gi, why: "glow or pulsing; Monument paint is matte and still" },
  { id: "gradient", re: /\bbg-(?:gradient|linear|radial|conic)-|\b(?:linear|radial|conic)-gradient\(/g, why: "gradient; Monument colour is always flat" },
  { id: "glass", re: /\bbackdrop-blur(?:-[a-z0-9]+)?\b|backdrop-filter\s*:/g, why: "glass / backdrop blur" },
  { id: "texture", re: /feTurbulence|\bnoise\b.*\.(?:png|svg)|\bmarble\.(?:jpe?g|png|webp)\b/gi, why: "texture behind content; the stone is flat" },
  { id: "banned-font", re: /\b(?:Inter|Geist|Space Grotesk|Poppins|Montserrat|Roboto|Oswald|Onest|Cormorant|IBM Plex|Manrope|DM Sans|Playfair|Open Sans|Lato|Nunito)\b/g, why: "foreign font; Monument uses Forum (inscription only) and Literata" },
  { id: "tiny-text", re: /\btext-(?:xs|\[(?:\d|1[0-3])px\])|font-size\s*:\s*(?:\d|1[0-3])px\b|fontSize\s*:\s*(?:\d|1[0-3])\b/g, why: "text under 14px; nothing significant is small" },
  { id: "paint-fill", re: /\bbg-(?:orchid|bronze|gold)\b|background(?:-color)?\s*:\s*var\(--m-(?:orchid|bronze|gold)\)/g, why: "paint as a fill; deep paint only through <Slab>, buttons are ink" },
  { id: "icon-lib", re: /from\s+["'](?:lucide-react|@heroicons\/[^"']+|react-icons\/[^"']+|@tabler\/icons-react|@phosphor-icons\/react|@mui\/icons-material)["']/g, why: "stock icon set; use words and museum labels" },
  { id: "toast-lib", re: /from\s+["'](?:react-hot-toast|sonner|react-toastify|notistack|@radix-ui\/react-toast)["']/g, why: "toast library; answer an action with <Done> where it was pressed" },
  { id: "emoji", re: /\p{Extended_Pictographic}/gu, why: "emoji or pictograph in UI or copy" },
  { id: "arrow-cta", re: /[→⟶➜➔↗]/g, why: "arrow as decoration; buttons say what happens in words" },
  { id: "dead-link", re: /href=\{?["']#?["']\}?/g, why: "dead link; link to a real page or render text" },
  { id: "buzzword", re: /революционн|бесшовн|на базе ИИ|раскройте|следующего уровня|\bseamless\b|\brevolutionary\b|\bunlock\b|\bsupercharge\b|\bnext-level\b/gi, why: "buzzword; say what the product does" },
  { id: "vague-cta", re: />\s*(?:Начать|Узнать больше|Подробнее|Get started|Learn more|Click here)\s*</gi, why: "vague action; name it (Выгрузить отчёт, Отправить правку)" },
  { id: "not-x-but-y", re: /это не [^.!?\n]{1,40}, (?:а|это) |\bit'?s not (?:just )?[^.!?\n]{1,30}, it'?s\b/gi, why: "\"it's not X, it's Y\" construction" },
  { id: "oracle-props", re: /оракул|ΓΝΩΘΙ|γνῶθι|\boracle\b/gi, why: "Delphi/oracle costume; use plain product language" },
];
// Per file (≈ per screen) limits of the showcase signs
const FILE_RULES = [
  // One match per element: a tag carrying class m-inscr and/or data-inscription, or a React <Inscription>
  { id: "inscriptions", re: /<Inscription\b|<[a-zA-Z][\w-]*\b[^>]*?(?:\bm-inscr\b|\bdata-inscription\b)[^>]*>/g, max: 1, why: "more than one inscription in this file; one per screen" },
  { id: "orchid-slabs", re: /<Slab\b[^>]*tone="orchid"|class(?:Name)?="m-slab"[^>]*data-tone="orchid"/g, max: 1, why: "more than one orchid slab; at most one per screen" },
  { id: "bronze-slabs", re: /<Slab\b[^>]*tone="bronze"|class(?:Name)?="m-slab"[^>]*data-tone="bronze"/g, max: 1, why: "more than one bronze slab; at most one per screen" },
  { id: "meanders", re: /<Meander\b|data-meander=/g, max: 2, why: "more than two meanders; a sign repeated becomes a theme" },
];

const findings = [];
function walk(path) {
  let st;
  try { st = statSync(path); } catch { return; }
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP_DIRS.has(name)) walk(join(path, name));
    return;
  }
  if (!EXT.has(extname(path))) return;
  const rel = relative(process.cwd(), path);
  if (KIT_PARTS.some((p) => rel.includes(p))) return;
  const text = readFileSync(path, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/monument-allow(?!-file)/.test(line)) return;
    // Comments describe rules ("never use rounded corners") and must not trip them
    if (/^\s*(?:\/\/|\/\*|\*|\{\s*\/\*|<!--|\{#)/.test(line)) return;
    if (extname(path) === ".py" && /^\s*#/.test(line)) return;
    for (const r of LINE_RULES) {
      r.re.lastIndex = 0;
      if (r.re.exec(line)) findings.push(`${rel}:${i + 1}  [${r.id}] ${r.why}\n    ${line.trim().slice(0, 140)}`);
    }
  });
  for (const r of FILE_RULES) {
    if (new RegExp(`monument-allow-file:\\s*${r.id}`).test(text)) continue;
    const n = (text.match(r.re) || []).length;
    if (n > r.max) findings.push(`${rel}  [${r.id}] ${r.why} (found ${n})`);
  }
}
roots.forEach(walk);

if (findings.length) {
  console.log(`Monument check: ${findings.length} finding(s)\n`);
  console.log(findings.join("\n"));
  console.log("\nFix them, or mark a deliberate exception with a `monument-allow` comment on that line.");
  process.exit(1);
}
console.log("Monument check: 0 findings.");
