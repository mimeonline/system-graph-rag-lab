import type { LucideIcon } from "lucide-react";
import { BookOpen, Home, Info, Network, Route, Sparkles } from "lucide-react";

import type { AppLocale } from "@/i18n/config";

export type LocalizedNavText = Record<AppLocale, {
  label: string;
  description: string;
}>;

export type NavChild = {
  href: string;
  text: LocalizedNavText;
  icon: LucideIcon;
};

export type NavItem = {
  href: string;
  text: LocalizedNavText;
  icon: LucideIcon;
  children?: NavChild[];
};

export const siteNavigation: NavItem[] = [
  {
    href: "/",
    icon: Home,
    text: {
      de: { label: "Home", description: "Einstieg in das System GraphRAG Lab" },
      en: { label: "Home", description: "Start with the System GraphRAG Lab" },
    },
  },
  {
    href: "/demo",
    icon: Sparkles,
    text: {
      de: { label: "Demo", description: "GraphRAG als Lernmodus und Live-Fluss erleben" },
      en: { label: "Demo", description: "Explore GraphRAG as a learning mode and live flow" },
    },
    children: [
      {
        href: "/demo",
        icon: Network,
        text: {
          de: { label: "Lernmodus", description: "Graph-Typen über die Übersicht vergleichen" },
          en: { label: "Learning mode", description: "Compare graph types from the overview" },
        },
      },
      {
        href: "/demo/live",
        icon: Route,
        text: {
          de: { label: "Live-Modus", description: "Die bestehende Query-Pipeline separat öffnen" },
          en: { label: "Live mode", description: "Open the existing query pipeline separately" },
        },
      },
    ],
  },
  {
    href: "/story/graphrag",
    icon: Route,
    text: {
      de: { label: "GraphRAG Story", description: "Vom Nutzerimpuls zur nachvollziehbaren Antwort" },
      en: { label: "GraphRAG Story", description: "From user intent to traceable answer" },
    },
  },
  {
    href: "/essay",
    icon: BookOpen,
    text: {
      de: { label: "Graph Essays", description: "Hintergrundtexte und Argumentationsketten" },
      en: { label: "Graph Essays", description: "Background essays and argument chains" },
    },
  },
  {
    href: "/about",
    icon: Info,
    text: {
      de: { label: "About", description: "Projektziel, Scope und Einordnung" },
      en: { label: "About", description: "Project goal, scope, and context" },
    },
  },
];
