import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./monument.css";
import DashboardScreen from "./monument/examples/DashboardScreen";
import WorkshopScreen from "./monument/examples/WorkshopScreen";
import type { DataStateKind } from "./monument/components";

const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get("theme") === "paper" ? "paper" : "night";
const state = (params.get("state") ?? "partial") as DataStateKind;
createRoot(document.getElementById("root")!).render(
  <StrictMode>{params.get("view") === "workshop" ? <WorkshopScreen /> : <DashboardScreen state={state} />}</StrictMode>,
);
