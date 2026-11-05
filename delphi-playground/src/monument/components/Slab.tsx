import type { ReactNode } from "react";
import { cx } from "./cx";

type Props = {
  /** orchid = the key data of the screen, bronze = the AI voice (recommendation, forecast, correction) */
  tone: "orchid" | "bronze";
  /** Short title, e.g. "Выручка за октябрь · кассы, 09:40" */
  title: string;
  /** The big figure, e.g. "421,1" or "−38%" */
  figure?: ReactNode;
  /** Horizontal band: figure on the left, meaning on the right. Default for wide screens */
  band?: boolean;
  children?: ReactNode;
  className?: string;
};

/**
 * A slab of paint: deep pigment with light text. The single strongest accent on a screen.
 * At most one orchid and one bronze slab per screen, one in total on a phone. Never a pastel card, never a grid of slabs.
 */
export function Slab({ tone, title, figure, band = false, children, className }: Props) {
  return (
    <div className={cx("m-slab", className)} data-tone={tone} data-band={band ? "true" : undefined}>
      <span className="m-slab-t">{title}</span>
      {figure != null && <span className="m-slab-k">{figure}</span>}
      {children != null && (band ? <div className="m-slab-body">{children}</div> : children)}
    </div>
  );
}
