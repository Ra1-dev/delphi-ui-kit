/*
  Reference WORKSHOP screen (internal, used every day). Same fonts, colours, header and labels as the showcase,
  but: no inscription, no slabs, no meander or colonnade, dense type (Page layer="workshop"), plain progress bars,
  warnings in gold, the AI hint as a margin note.
  Actions: Tabs over the list, a SelectionBar that asks before a destructive action (no confirm()),
  Done in place of the pressed button (no toast), Dialog for the role reference.
*/
import { useState } from "react";
import {
  Alert, AppHeader, Bay, Button, Checkbox, Dialog, Done, Grid, LinkButton, MarginNote, Page, ProgressBar, SelectField,
  SelectionBar, StatusMark, Tabs, TextField, useDone,
} from "../components";

const people = [
  { name: "Айгерим Сапарова", phone: "+7 701 482 11 09", store: "Абая, 12", role: "Управляющий", done: 4, shifts: 22, st: ["ok", "Активен"] },
  { name: "Данияр Ермеков", phone: "+7 707 310 45 72", store: "Абая, 12", role: "Кассир", done: 2, shifts: 18, st: ["warn", "Нет 2FA"] },
  { name: "Ольга Ким", phone: "+7 777 902 63 18", store: "Достык, 97", role: "Кассир", done: 3, shifts: 20, st: ["ok", "Активен"] },
  { name: "Ержан Тулегенов", phone: "+7 705 118 27 40", store: "Жандосова, 58", role: "Кассир", done: 1, shifts: 9, st: ["warn", "Обучение просрочено"] },
  { name: "Мадина Абенова", phone: "+7 702 554 90 31", store: "Саина, 16", role: "Кассир", done: 4, shifts: 21, st: ["error", "Заблокирован"] },
] as const;

export default function WorkshopScreen() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [checked, setChecked] = useState<string[]>(["Данияр Ермеков", "Ержан Тулегенов"]);
  const [asking, setAsking] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [saved, flashSaved] = useDone();
  const rows = people
    .filter((p) => tab === "all" || p.st[0] !== "ok")
    .filter((p) => (p.name + p.store + p.phone).toLowerCase().includes(query.toLowerCase()));
  const toggle = (name: string) => { setAsking(false); setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name])); };
  const n = checked.length;
  return (
    <Page layer="workshop">
      <AppHeader app="Касса" nav={[{ label: "Продажи" }, { label: "Магазины" }, { label: "Сотрудники", current: true }, { label: "Настройки" }]} context="Алматы · 14 магазинов" />
      <div style={{ display: "grid", gap: 4, marginTop: 22 }}>
        <h1 className="m-h">Сотрудники</h1>
        <span className="m-meta">86 человек в 14 магазинах · обновлено 09:40 · 3 требуют внимания</span>
      </div>
      <Grid>
        <Bay span={8} first label="Список сотрудников">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 22px", alignItems: "end" }}>
            <div style={{ flex: "1 1 240px" }}><TextField label="Поиск" placeholder="Имя, телефон или магазин" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            <SelectField label="Магазин" options={["Все магазины", "Абая, 12", "Достык, 97"]} />
            <Button>Добавить сотрудника</Button>
          </div>
          <Tabs label="Списки" value={tab} onChange={setTab} items={[{ id: "all", label: "Все · 86" }, { id: "attention", label: "Требуют внимания · 3" }]} />
          <SelectionBar
            count={n}
            confirm={asking ? {
              question: `Снять ${n} ${n === 1 ? "сотрудника" : "сотрудников"} со смен?`,
              consequence: "Смены до конца недели перейдут в свободные.",
              action: `Снять ${n} со смен`,
              onConfirm: () => { setChecked([]); setAsking(false); },
              onCancel: () => setAsking(false),
            } : null}
          >
            <LinkButton onClick={() => setAsking(true)}>Снять со смен</LinkButton>
            <LinkButton>Отправить ссылку для 2FA</LinkButton>
          </SelectionBar>
          <div className="m-tw">
            <table className="m-table">
              <thead><tr><th><span className="m-meta">Выбор</span></th><th>Сотрудник</th><th>Магазин</th><th>Роль</th><th>Обучение</th><th data-num="">Смен</th><th>Статус</th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.name}>
                    <td><Checkbox label="" aria-label={`Отметить ${p.name}`} checked={checked.includes(p.name)} onChange={() => toggle(p.name)} /></td>
                    <td style={{ fontWeight: 600 }}>{p.name}<small>{p.phone}</small></td>
                    <td>{p.store}</td><td>{p.role}</td>
                    <td><ProgressBar value={p.done} max={4} /></td>
                    <td data-num="">{p.shifts}</td>
                    <td><StatusMark kind={p.st[0]}>{p.st[1]}</StatusMark></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Bay>
        <Bay span={4} side label="Профиль сотрудника">
          <h2 className="m-h2">Данияр Ермеков</h2>
          <Alert kind="warn" title="Внимание: нет двухфакторного входа">Без 2FA с 1 декабря кассир не сможет открыть смену.</Alert>
          <TextField label="Телефон для 2FA" defaultValue="+7 707 310 45 72" />
          <SelectField label="Роль" options={["Кассир", "Управляющий"]} hint={<LinkButton onClick={() => setRolesOpen(true)}>Что может каждая роль</LinkButton>} />
          <MarginNote who="Подсказка ИИ">У Данияра 2 из 4 модулей обучения. Назначьте модуль «Возвраты»: 3 возврата в октябре оформлены с ошибкой.</MarginNote>
          <div className="m-acts">
            {saved ? <Done text="Сохранено, 09:41" action={<LinkButton>Отправить ссылку для 2FA</LinkButton>} /> : <Button onClick={flashSaved}>Сохранить</Button>}
          </div>
        </Bay>
      </Grid>
      <Dialog open={rolesOpen} title="Что может каждая роль" onClose={() => setRolesOpen(false)}>
        <p className="m-meta">Права задаются в Настройках · действуют во всех 14 магазинах</p>
        <table className="m-table">
          <thead><tr><th>Роль</th><th>Может</th></tr></thead>
          <tbody>
            <tr><td style={{ fontWeight: 600 }}>Кассир</td><td>открывать и закрывать смену, продажи, возвраты до 50 000 ₸</td></tr>
            <tr><td style={{ fontWeight: 600 }}>Управляющий</td><td>всё, что кассир, плюс возвраты без лимита, график смен, сотрудники своего магазина</td></tr>
          </tbody>
        </table>
        <Alert kind="warn" title="Возвраты свыше 50 000 ₸">Кассир не может их оформить: позовите управляющего.</Alert>
      </Dialog>
    </Page>
  );
}
