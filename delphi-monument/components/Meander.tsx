import { useId } from "react";
import { cx } from "./cx";

type Props = {
  /** Share done, 0..1 */
  value: number;
  /** data = data or steps (orchid), ai = the AI is working (bronze), error = failed (danger) */
  tone?: "data" | "ai" | "error";
  /** Number of key units. Pick so one unit is about 40 px on screen: ~24 for full width, ~9 on a phone. */
  units?: number;
  /** Draw a dashed goal line at the end (for plans) */
  goal?: boolean;
  /** Required: what the progress means, e.g. "Выполнено 97% плана" */
  label: string;
  className?: string;
};

/** Build the key-pattern path: one baseline plus a spiral per unit. Shared with vanilla/monument.js. */
export function meanderPath(units: number): string {
  const U = 40, s = 2, y = 2;
  let d = `M0 ${y + 19 * s} H${U * units}`;
  for (let i = 0; i < units; i++) {
    const o = i * U;
    d += ` M${o + s} ${y + 19 * s} V${y + s} H${o + 19 * s} V${y + 15 * s} H${o + 7 * s} V${y + 7 * s} H${o + 13 * s} V${y + 11 * s}`;
  }
  return d;
}

/**
 * Meander as a progress bar: the key pattern is "cut" up to the share done.
 * Use it for: plan completion, file processing, AI at work, form steps. At most two per screen.
 * Narrower than ~200 px it turns into ripple: use ProgressBar there.
 */
export function Meander({ value, tone = "data", units = 24, goal = false, label, className }: Props) {
  const id = useId().replace(/:/g, "");
  const W = 40 * units;
  const v = Math.max(0, Math.min(1, value));
  const d = meanderPath(units);
  return (
    <svg className={cx("m-meander", className)} data-tone={tone} viewBox={`0 0 ${W} 44`} role="img" aria-label={label}>
      <defs><clipPath id={`m${id}`}><rect x="0" y="0" width={W * v} height="44" /></clipPath></defs>
      <path d={d} className="m-rest" fill="none" strokeWidth="3" strokeLinecap="square" />
      <path d={d} className="m-done" fill="none" strokeWidth="3" strokeLinecap="square" clipPath={`url(#m${id})`} />
      {goal && <line x1={W} x2={W} y1="0" y2="44" className="m-goal" />}
    </svg>
  );
}
