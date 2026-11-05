/*
  Reference SHOWCASE screen (the one judges see). Copy the structure, not the texts.
  Composition for a dashboard: key figure band ABOVE the inscription, thesis, plan meander, colonnade across the full width
  with the AI forecast band under it, table + AI margin note. One orchid slab, one bronze slab, one inscription, one meander.
*/
import { useState } from "react";
import {
  AppHeader, Base, Bay, Button, Colonnade, ColonnadeLegend, DataState, Grid, Inscription, LinkButton,
  MarginNote, Meander, MuseumLabel, Page, Slab, Thesis,
} from "../components";
import type { DataStateKind } from "../components";

const weeks = [
  { label: "1–7 окт", value: 93.5 },
  { label: "8–14", value: 95.2 },
  { label: "15–21", value: 96.4 },
  { label: "22–28", value: 97.4 },
  { label: "29–31", value: 38.6, kind: "partial" as const },
  { label: "1–7 ноя", value: 100.0, kind: "forecast" as const },
  { label: "8–14", value: 102.1, kind: "forecast" as const },
];

const stores = [
  { name: "Абая, 12", district: "Алмалинский", revenue: "19,7", delta: "−31%", plan: "71%", low: true },
  { name: "Жандосова, 58", district: "Ауэзовский", revenue: "25,4", delta: "−12%", plan: "84%", low: true },
  { name: "Кульджинский тракт, 22", district: "Медеуский", revenue: "22,2", delta: "−4%", plan: "89%", low: true },
  { name: "Рыскулова, 140", district: "Жетысуский", revenue: "28,0", delta: "+1%", plan: "95%", low: false },
  { name: "Райымбека, 233", district: "Алатауский", revenue: "28,6", delta: "+2%", plan: "96%", low: false },
];

export default function DashboardScreen({ state = "partial" }: { state?: DataStateKind }) {
  const [tableState] = useState<DataStateKind>(state);
  return (
    <Page>
      <AppHeader
        app="Касса"
        nav={[{ label: "Продажи", current: true }, { label: "Магазины" }, { label: "Прогноз" }, { label: "Выгрузки" }]}
        context="Алматы · 14 магазинов · октябрь 2026"
      />
      <Grid>
        <Bay label="Выручка за октябрь">
          <Slab tone="orchid" band title="Выручка за октябрь · кассы 14 магазинов, 09:40" figure="421,1">
            <b>млн ₸</b>
            <p><b>+6,2%</b> к сентябрю, <b>+24,6 млн ₸</b>. Это лучший месяц года.</p>
          </Slab>
        </Bay>
        <Bay>
          <Inscription>Продажи октябрь</Inscription>
          <Thesis>Сеть выполнила план на <b>97%</b>. Отстают три магазина, сильнее всего <b>Абая, 12</b>: там ремонт улицы.</Thesis>
          <div className="m-acts"><Button>Выгрузить отчёт</Button><LinkButton>Изменить план</LinkButton></div>
        </Bay>
        <Bay label="Выполнение плана">
          <MuseumLabel title="План октября" source="434,1 млн ₸, утверждён 1 октября" />
          <Meander value={0.97} goal label="Выполнено 97% плана" />
          <span className="m-meta">421,1 из 434,1 млн ₸, не хватает 13,0</span>
        </Bay>
        <Bay label="Выручка по неделям">
          <MuseumLabel title="Выручка по неделям, млн ₸" source="факт и прогноз на две недели" />
          <ColonnadeLegend items={[{ kind: "fact", label: "Факт" }, { kind: "partial", label: "Неполная неделя, 3 дня" }, { kind: "forecast", label: "Прогноз ИИ" }]} />
          <Colonnade rows={weeks} mark={{ before: 5 }} label="Выручка по неделям октября от 93,5 до 97,4 млн тенге, неполная неделя 38,6, прогноз 100,0 и 102,1" />
          <Slab tone="bronze" band mobile="note" title="Прогноз ИИ · 1–14 ноября · модель v2.3" figure="202,1">
            <b>млн ₸, интервал ± 9 млн</b>
            <p>Пики по субботам сохранятся: 17,0 и 17,3 млн в день. Если Абая, 12 откроет вход с 10 ноября, прогноз вырастет на 3,1 млн.</p>
          </Slab>
        </Bay>
        <Bay span={8} first label="Магазины">
          <MuseumLabel title="Магазины по выполнению плана" source="сначала отстающие" />
          <DataState state={tableState} partial="За 31 октября нет выгрузки от 2 магазинов. Повторим в 10:00." loading={{ text: "Читаю кассы 14 магазинов", progress: 0.6 }} error={{ title: "Кассы не отвечают", code: "E-503", lastValue: "421,1 млн ₸ на 09:40" }}>
            <div className="m-tw">
              <table className="m-table">
                <thead><tr><th>Магазин</th><th data-num="">Выручка, млн ₸</th><th data-num="">К сентябрю</th><th data-num="">План</th></tr></thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.name} data-attention={s.low || undefined}>
                      <td>{s.name}<small>{s.district}</small></td>
                      <td data-num="">{s.revenue}</td><td data-num="">{s.delta}</td><td data-num="" data-key="">{s.plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataState>
        </Bay>
        <Bay span={4} side label="Почему отстаёт Абая, 12">
          <MuseumLabel title="Почему отстаёт Абая, 12" />
          <MarginNote who="Объяснение ИИ">
            С 14 октября вход со стороны Абая закрыт. Чеков меньше на <b>38%</b>, средний чек почти не изменился. <b>Причина внешняя</b>, ассортимент менять не нужно.
          </MarginNote>
        </Bay>
      </Grid>
      <Base left="Касса · команда Delphi" right="Условия · Конфиденциальность" />
    </Page>
  );
}
