import { useLayoutEffect, useRef } from "react";
import { cx } from "./cx";

type Props = {
  /** The words of the inscription, plain text. Spaces become interpuncts. Keep it to 2-4 words. */
  children: string;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * The inscription: ONE per screen, Forum capitals, interpuncts in bronze between words, medium carving.
 * An interpunct never ends a line: the one before a line break is hidden (visibility keeps layout stable).
 * Showcase layer only. Workshop screens use a plain `.m-h` title instead.
 */
export function Inscription({ children, as = "h1", id, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = children.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fix = () => {
      el.querySelectorAll<HTMLElement>(".m-ip").forEach((ip) => {
        ip.dataset.eol = "false";
        const word = ip.parentElement?.lastElementChild as HTMLElement | null;
        if (word && word !== ip && word.offsetTop - ip.offsetTop > 4) ip.dataset.eol = "true";
      });
    };
    fix();
    const ro = new ResizeObserver(fix);
    ro.observe(el);
    document.fonts?.ready.then(fix);
    return () => ro.disconnect();
  }, [children]);

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={cx("m-inscr", className)} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 && <span className="m-ip" />}
          {i > 0 && <wbr />}
          <span>{w}</span>
        </span>
      ))}
    </Tag>
  );
}
