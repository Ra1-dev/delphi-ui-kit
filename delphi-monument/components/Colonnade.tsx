import { cx } from "./cx";

export type ColumnRow = {
  label: string;
  value: number;
  /** fact = marble (default), partial = incomplete period (dim marble), forecast = bronze */
  kind?: "fact" | "partial" | "forecast";
};

type Props = {
  rows: ColumnRow[];
  /** Top of the scale. Default: 110% of the largest value */
  max?: number;
  format?: (n: number) => string;
  /** A dashed vertical mark before row index `before`, e.g. "Сегодня" or "14 окт: ремонт улицы" */
  mark?: { before: number; label?: string };
  /** A callout above a column, e.g. "−38%" in orchid */
  callout?: { at: number; text: string };
  /** Required: the data in words for screen readers */
  label: string;
  className?: string;
};

/** Russian number format; one decimal for every value when any value has one, so "100,0" sits next to "102,1". */
const ruFor = (rows: ColumnRow[]) => {
  const d = rows.some((r) => !Number.isInteger(r.value)) ? 1 : 0;
  return (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: d, maximumFractionDigits: d });
};

/**
 * Colonnade = bar chart. Each value is a fluted column with a base on a stylobate; the abacus line on top is exactly the value.
 * Works for 3-10 values. For longer series use a line chart.
 * Colours: marble = fact, dim marble = incomplete period, bronze = forecast. Show attention with a mark or callout, never a pink column.
 */
export function Colonnade({ rows, max, format, mark, callout, label, className }: Props) {
  const fmt = format ?? ruFor(rows);
  if (rows.length < 3 || rows.length > 10) {
    console.warn(`Colonnade: ${rows.length} values. It works for 3-10; use a line chart for longer series.`);
  }
  const slot = 100, W = Math.max(400, rows.length * slot), base = 230, top0 = 40;
  const hi = max ?? Math.max(...rows.map((r) => r.value)) * 1.1;
  const k = (base - top0) / hi;
  const s = W / rows.length;
  return (
    <svg className={cx("m-colon", className)} viewBox={`0 0 ${W} 280`} role="img" aria-label={label}>
      <rect x="0" y={base} width={W} height="7" className="m-stylo" />
      {rows.map((r, i) => {
        const cx0 = s * i + s / 2, top = base - r.value * k;
        const cls = r.kind === "forecast" ? "m-fc" : r.kind === "partial" ? "m-part" : "m-fact";
        const flute = r.kind === "forecast" ? "m-flute-fc" : "m-flute";
        return (
          <g key={i}>
            <rect x={cx0 - 23} y={top} width="46" height={Math.max(0, base - 9 - top)} className={cls} />
            <rect x={cx0 - 33} y={top - 1.5} width="66" height="3" className={cls} />
            <rect x={cx0 - 31} y={base - 9} width="62" height="9" className={cls} />
            {[-12, 0, 12].map((fx) => (
              <line key={fx} x1={cx0 + fx} x2={cx0 + fx} y1={top + 10} y2={base - 15} className={flute} />
            ))}
            <text x={cx0} y={top - 12} textAnchor="middle" className="m-val">{fmt(r.value)}</text>
            <text x={cx0} y={base + 32} textAnchor="middle" className="m-lab">{r.label}</text>
          </g>
        );
      })}
      {mark && (
        <g>
          <line x1={s * mark.before} x2={s * mark.before} y1="6" y2={base} className="m-mark" />
          {mark.label && <text x={s * mark.before + 8} y="20" className="m-mark-t">{mark.label}</text>}
        </g>
      )}
      {callout && (
        <text x={s * callout.at + s / 2} y={base - rows[callout.at].value * k - 40} textAnchor="middle" style={{ fill: "var(--m-orchid)", font: "700 22px var(--m-f-book)" }}>
          {callout.text}
        </text>
      )}
    </svg>
  );
}

/** Legend for a Colonnade. Pass only the kinds the chart actually uses. */
export function ColonnadeLegend({ items }: { items: Array<{ kind: "fact" | "partial" | "forecast"; label: string }> }) {
  return (
    <div className="m-legend">
      {items.map((it) => <span key={it.kind}><i data-k={it.kind} />{it.label}</span>)}
    </div>
  );
}
