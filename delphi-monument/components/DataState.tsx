import type { ReactNode } from "react";
import { Meander } from "./Meander";
import { Alert } from "./Notes";
import { Button } from "./Controls";

export type DataStateKind = "loading" | "empty" | "error" | "partial" | "ready";

type Props = {
  state: DataStateKind;
  /** Same height in every state, so the page does not jump. Default 220 */
  minHeight?: number;
  /** loading: what is being done, e.g. "Читаю кассы за 31 день", and how far (0..1) */
  loading?: { text: string; progress?: number };
  /** empty: what is missing and the one action that fixes it */
  empty?: { title: string; text?: string; action?: string; onAction?: () => void };
  /** error: what broke, a code, the last known value, retry */
  error?: { title: string; code: string; lastValue?: string; onRetry?: () => void };
  /** partial: what is missing in the data shown */
  partial?: string;
  children?: ReactNode;
};

/**
 * Every block that shows data has five states at the same height. Loading = bronze meander (the AI/system is working).
 * Never leave a blank area while data loads.
 */
export function DataState({ state, minHeight = 220, loading, empty, error, partial, children }: Props) {
  const box = { minHeight } as const;
  if (state === "loading") {
    return (
      <div className="m-state" style={box} role="status">
        <span className="m-who">{loading?.text ?? "Загружаю данные"}</span>
        <Meander value={loading?.progress ?? 0.35} tone="ai" label={`Загрузка${loading?.progress != null ? `, ${Math.round(loading.progress * 100)}%` : ""}`} />
        <div className="m-skel" /><div className="m-skel" />
      </div>
    );
  }
  if (state === "empty") {
    return (
      <div className="m-state" style={box}>
        <div className="m-label"><b>{empty?.title ?? "Данных пока нет"}</b></div>
        {empty?.text && <p className="m-muted">{empty.text}</p>}
        {empty?.action && <div><Button onClick={empty.onAction}>{empty.action}</Button></div>}
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="m-state" style={box}>
        <Alert kind="error" title={`${error?.title ?? "Не удалось загрузить данные"} · ${error?.code ?? "E-000"}`}>
          {error?.lastValue ? `Последнее известное значение: ${error.lastValue}.` : null}
        </Alert>
        {error?.onRetry && <div><Button variant="secondary" onClick={error.onRetry}>Повторить</Button></div>}
      </div>
    );
  }
  return (
    <div style={box}>
      {children}
      {state === "partial" && <div style={{ marginTop: 14 }}><Alert kind="warn" title="Данные неполные.">{partial}</Alert></div>}
    </div>
  );
}
