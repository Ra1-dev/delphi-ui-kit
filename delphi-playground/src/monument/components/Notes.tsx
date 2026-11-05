import type { ReactNode } from "react";

/**
 * Margin note: the AI comment stands next to what it explains, under a bronze rule. Not a card, not a popup.
 * tone="neutral" for a plain remark (e.g. "Совпадает").
 */
export function MarginNote({ who, tone = "ai", children }: { who: string; tone?: "ai" | "neutral"; children: ReactNode }) {
  return (
    <div className="m-note" data-tone={tone}>
      <span className="m-who">{who}</span>
      <p>{children}</p>
    </div>
  );
}

/** System message. warn = gold (something needs attention), error = danger. Always says what happened and what to do. */
export function Alert({ kind = "warn", title, children }: { kind?: "warn" | "error"; title: string; children?: ReactNode }) {
  return (
    <div className="m-alert" data-kind={kind} role={kind === "error" ? "alert" : "status"}>
      <b>{title}</b>
      {children != null && <span>{children}</span>}
    </div>
  );
}

/** Status in a table cell or list: a short bar plus a word. ok / warn (gold) / error. */
export function StatusMark({ kind = "ok", children }: { kind?: "ok" | "warn" | "error"; children: ReactNode }) {
  return <span className="m-status" data-kind={kind}>{children}</span>;
}
