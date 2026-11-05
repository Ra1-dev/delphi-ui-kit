import type { ReactNode } from "react";
import { cx } from "./cx";

export type NavItem = { label: string; href?: string; current?: boolean };

/** App header with the cornice profile under it. App name in Forum, nav in Literata, context on the right. */
export function AppHeader({ app, nav = [], context }: { app: string; nav?: NavItem[]; context?: ReactNode }) {
  return (
    <header className="m-top">
      <span className="m-app">{app}</span>
      {nav.length > 0 && (
        <nav className="m-nav" aria-label="Разделы">
          {nav.map((n) =>
            n.href ? (
              <a key={n.label} href={n.href} aria-current={n.current ? "page" : undefined}>{n.label}</a>
            ) : (
              <span key={n.label} aria-current={n.current ? "page" : undefined}>{n.label}</span>
            ),
          )}
        </nav>
      )}
      {context != null && <span className="m-context">{context}</span>}
    </header>
  );
}

/** Root of a Monument page. layer="workshop" makes it dense (internal screens). theme is set on <html data-theme> instead when the whole app shares it. */
export function Page({ layer = "showcase", children, className }: { layer?: "showcase" | "workshop"; children: ReactNode; className?: string }) {
  return <div className={cx("m-root", layer === "workshop" && "m-dense", className)}><div className="m-page">{children}</div></div>;
}

/** 12-column order grid. Put Bays inside. */
export function Grid({ children }: { children: ReactNode }) {
  return <div className="m-grid">{children}</div>;
}

/**
 * A bay of the order grid. span 12 (default) or 8/7/6/5/4. first = starts a row, side = sits to the right of another bay (gets the column rule).
 * Never use a side bay to hold a coloured card next to text: that is the "text left, card right" template.
 */
export function Bay({ span = 12, first, side, label, children }: { span?: 4 | 5 | 6 | 7 | 8 | 12; first?: boolean; side?: boolean; label?: string; children: ReactNode }) {
  return (
    <section className="m-bay" data-span={span} data-first={first || undefined} data-side={side || undefined} aria-label={label}>
      {children}
    </section>
  );
}

/** Stepped base (krepidoma) and footer at the bottom of a page. */
export function Base({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <>
      <div className="m-base" aria-hidden="true"><i /><i /><i /></div>
      <footer className="m-foot"><span>{left}</span>{right != null && <span>{right}</span>}</footer>
    </>
  );
}
