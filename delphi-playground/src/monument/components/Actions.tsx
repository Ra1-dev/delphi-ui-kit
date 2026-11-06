import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button, LinkButton } from "./Controls";

/* ---------- Tabs ---------- */

export type TabItem = { id: string; label: string; /** e.g. "не сохранён" */ flag?: string; closable?: boolean };

/**
 * Tabs: open documents in an editor, sections of a settings page. The open tab is underlined in ink:
 * a selection is a state, not data, so it never takes the orchid.
 */
export function Tabs({ label, items, value, onChange, onClose }: {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  onClose?: (id: string) => void;
}) {
  return (
    <div className="m-tabs" role="tablist" aria-label={label}>
      {items.map((t) => (
        <span className="m-tabw" key={t.id}>
          <button type="button" role="tab" className="m-tab" aria-selected={t.id === value} tabIndex={t.id === value ? 0 : -1} onClick={() => onChange(t.id)}>
            {t.label}
            {t.flag && <span className="m-tab-flag">{t.flag}</span>}
          </button>
          {t.closable && onClose && (
            <button type="button" className="m-tab-x" aria-label={`Закрыть ${t.label}`} onClick={() => onClose(t.id)}>×</button>
          )}
        </span>
      ))}
    </div>
  );
}

/* ---------- Dialog ---------- */

/**
 * Modal window on the native <dialog>: Esc closes it, focus stays inside. A thin frame with the cornice on top;
 * on phones it becomes a sheet from the bottom. The backdrop is flat dimmed stone, never a blur.
 * For a reference, a form that must not lose the page, or a confirmation that needs explanation.
 * A short yes/no about checked rows goes into the SelectionBar instead.
 */
export function Dialog({ open, title, onClose, closeLabel = "Закрыть", children }: {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="m-dialog" aria-labelledby={tid} onClose={onClose} onCancel={onClose}>
      <div className="m-dialog-head">
        <h2 className="m-h2" id={tid}>{title}</h2>
        <LinkButton onClick={onClose}>{closeLabel}</LinkButton>
      </div>
      {children}
    </dialog>
  );
}

/* ---------- Done: the answer to an action, where the action was ---------- */

/** Shows the answer for `ms` (default 8 s) and then gives the button back. `const [done, flash] = useDone();` */
export function useDone(ms = 8000): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const flash = useCallback(() => {
    window.clearTimeout(timer.current);
    setOn(true);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }, [ms]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [on, flash];
}

/**
 * The answer to a successful action, in place of the button that was pressed: what happened, where, and the next step.
 * Never a toast in a corner. Errors are not answered here: they are an Alert where it broke.
 */
export function Done({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <span className="m-done" role="status">
      <span className="m-status">{text}</span>
      {action}
    </span>
  );
}

/* ---------- SelectionBar: actions on checked rows, and the confirmation question ---------- */

export type Confirm = {
  /** "Убрать 3 файла из очереди?" */
  question: string;
  /** What stays and what is lost: "Готовые .md останутся в папке." */
  consequence?: string;
  /** The verb with the count: "Убрать 3 файла" */
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * One bar above a table. Normally: the count of checked rows and the actions on them.
 * A destructive action asks here, in the same place, instead of confirm(): the bar becomes the question.
 */
export function SelectionBar({ count, children, confirm }: { count: number; children?: ReactNode; confirm?: Confirm | null }) {
  if (confirm) {
    return (
      <div className="m-selbar" role="group" aria-live="polite">
        <span className="m-selbar-q">{confirm.question}{confirm.consequence && <span className="m-meta">{confirm.consequence}</span>}</span>
        <Button onClick={confirm.onConfirm}>{confirm.action}</Button>
        <LinkButton onClick={confirm.onCancel}>Оставить</LinkButton>
      </div>
    );
  }
  return (
    <div className="m-selbar" role="group" aria-live="polite">
      <span className="m-selbar-q">Отмечено: {count}</span>
      {count > 0 && children}
    </div>
  );
}

/* ---------- Dock: decisions in a review queue ---------- */

/**
 * Sticky bar at the bottom of a review queue, where one decision follows another (accept / reject, next item).
 * Only for review queues: one-off confirmations go into the SelectionBar.
 */
export function Dock({ children }: { children: ReactNode }) {
  return (
    <div className="m-dock">
      <div className="m-dock-in">{children}</div>
    </div>
  );
}
