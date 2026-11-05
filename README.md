# Delphi UI kit

Единый стандарт интерфейсов команды **Delphi** для хакатонов: стиль **«Монумент»** и агентный набор, по которому ИИ-агент собирает MVP под единый стиль.

| Папка | Что это |
|---|---|
| [`delphi-monument/`](delphi-monument) | сам стандарт: скилл Claude Code, правила, токены, шрифты, компоненты, эталонные экраны, проверка. Начните с [`delphi-monument/README.md`](delphi-monument/README.md) |
| [`delphi-playground/`](delphi-playground) | тестовый проект (Vite + React + TypeScript + Tailwind 4.1), где набор установлен как в настоящий проект: `npm install`, `npm run dev`, `npm run build`, `npm run check` |
| [`HANDOFF.md`](HANDOFF.md) | состояние работы и решения для следующей сессии |

`delphi-playground/src/monument/` — копия компонентов, стилей, шрифтов и примеров из `delphi-monument/`. После правок в наборе обновите её:

```bash
cp -r delphi-monument/components delphi-monument/styles delphi-monument/fonts delphi-monument/examples delphi-playground/src/monument/
```
