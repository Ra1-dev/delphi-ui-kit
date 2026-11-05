import { useId } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  wide?: boolean;
  /** Verb in progress, e.g. "Считаем…". Disables the button while set */
  loading?: string;
};

/** Ink button. The label says what happens ("Выгрузить отчёт"), never "Начать" or an arrow. Paint never fills a button. */
export function Button({ variant = "primary", wide, loading, children, disabled, type = "button", ...rest }: BtnProps) {
  return (
    <button type={type} className="m-btn" data-variant={variant} data-wide={wide ? "true" : undefined} disabled={disabled || !!loading} aria-busy={!!loading || undefined} {...rest}>
      {loading ?? children}
    </button>
  );
}

/** Text action, underlined. */
export function LinkButton({ children, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className="m-link" {...rest}>{children}</button>;
}

type FieldBase = { label: string; hint?: ReactNode; error?: ReactNode };

/** Text input written on a line. error shows a message that says how to fix it. */
export function TextField({ label, hint, error, id, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const fid = id ?? auto;
  const msg = `${fid}-m`;
  return (
    <div className="m-field" data-state={error ? "error" : undefined}>
      <label htmlFor={fid}>{label}</label>
      <input id={fid} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? msg : undefined} {...rest} />
      {error ? <span className="m-field-msg" id={msg}>{error}</span> : hint ? <span className="m-field-hint" id={msg}>{hint}</span> : null}
    </div>
  );
}

export function TextArea({ label, hint, error, id, ...rest }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const fid = id ?? auto;
  const msg = `${fid}-m`;
  return (
    <div className="m-field" data-state={error ? "error" : undefined}>
      <label htmlFor={fid}>{label}</label>
      <textarea id={fid} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? msg : undefined} {...rest} />
      {error ? <span className="m-field-msg" id={msg}>{error}</span> : hint ? <span className="m-field-hint" id={msg}>{hint}</span> : null}
    </div>
  );
}

export function SelectField({ label, hint, options, id, ...rest }: Omit<FieldBase, "error"> & { options: string[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className="m-field">
      <label htmlFor={fid}>{label}</label>
      <select id={fid} {...rest}>{options.map((o) => <option key={o}>{o}</option>)}</select>
      {hint != null && <span className="m-field-hint">{hint}</span>}
    </div>
  );
}

/** One choice out of 2-5 short options. The chosen one is underlined in orchid. */
export function Segmented({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const lid = useId();
  return (
    <div className="m-field">
      <span className="m-field-l" id={lid}>{label}</span>
      <div className="m-seg" role="group" aria-labelledby={lid}>
        {options.map((o) => <button key={o} type="button" aria-pressed={o === value} onClick={() => onChange(o)}>{o}</button>)}
      </div>
    </div>
  );
}

export function Checkbox({ label, ...rest }: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return <label className="m-check"><input type="checkbox" {...rest} /><span>{label}</span></label>;
}

/** Plain progress bar for rows, tables and anything narrower than ~200 px (where a Meander would be ripple). */
export function ProgressBar({ value, max, text }: { value: number; max: number; text?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span className="m-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <i><b style={{ width: `${pct}%` }} /></i>{text ?? `${value} из ${max}`}
    </span>
  );
}
