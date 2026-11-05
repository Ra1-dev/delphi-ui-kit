import type { ReactNode } from "react";

/** The thought of the screen in one or two sentences, big. Wrap the 1-2 key facts in <b>: they turn orchid. */
export function Thesis({ children }: { children: ReactNode }) {
  return <p className="m-thesis">{children}</p>;
}

/** Museum label for a block: what it is, where the data comes from, when. No section numbers. */
export function MuseumLabel({ title, source }: { title: ReactNode; source?: ReactNode }) {
  return (
    <div className="m-label">
      <b>{title}</b>
      {source != null && <span>{source}</span>}
    </div>
  );
}

/** A question in a chat protocol: set as a heading, not a bubble. */
export function Question({ meta, children }: { meta: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <span className="m-meta">{meta}</span>
      <p className="m-q">{children}</p>
    </div>
  );
}

/** Who is speaking, in bronze: "Касса ИИ · ответ за 4 секунды" */
export function Who({ children }: { children: ReactNode }) {
  return <span className="m-who">{children}</span>;
}
