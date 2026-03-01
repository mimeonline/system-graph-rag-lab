export type StoryPerspective = "architecture" | "product" | "governance";

export type StoryChapterId = "question" | "retrieval" | "graph" | "synthesis" | "action";

export type StoryChapter = {
  id: StoryChapterId;
  label: string;
  goal: string;
  technicalFlow: string;
  structuralRelevance: string;
  visualSpec: string;
  perspectiveCopy: Record<StoryPerspective, string>;
  visualMode: "svg" | "three";
};

export type StoryPrimaryAction = {
  label: "Weiter" | "Zur Demo";
  isDemoLink: boolean;
};

export const STORY_PERSPECTIVES: Array<{ id: StoryPerspective; label: string }> = [
  { id: "architecture", label: "Architektur" },
  { id: "product", label: "Produkt" },
  { id: "governance", label: "Governance" },
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "question",
    label: "Frage",
    goal: "Systemproblem formulieren",
    technicalFlow:
      "Die Ausgangsfrage wird als präziser Problemknoten modelliert. Implizite Begriffe wie Ziel, Grenze und Wirkung werden explizit benannt, bevor Retrieval startet.",
    structuralRelevance:
      "Entscheidungsqualität entsteht am Eingang. Unklare Problemräume erzeugen später instabile Pfade, auch wenn die Antwort sprachlich plausibel wirkt.",
    visualSpec: "Ein zentraler Frage-Knoten mit angedeutetem Bedeutungsraum. Noch keine expliziten Relationen.",
    perspectiveCopy: {
      architecture:
        "Fokus auf Scope-Schnitt: Welche Systemgrenzen und Abhängigkeiten sind Teil des Entscheidungsraums?",
      product:
        "Fokus auf Outcome-Schnitt: Welche Nutzer- und Geschäftswirkung soll die Frage tatsächlich klären?",
      governance:
        "Fokus auf Regel-Schnitt: Welche Richtlinien, Nachweispflichten und Risiken sind bereits implizit enthalten?",
    },
    visualMode: "svg",
  },
  {
    id: "retrieval",
    label: "Retrieval",
    goal: "Kontext priorisieren",
    technicalFlow:
      "Kontextkandidaten werden mit Relevanzsignalen gewichtet. Nur strukturell tragfähige Knoten und Belege gelangen in das aktive Kontextpaket.",
    structuralRelevance:
      "Kontextdisziplin ist wichtiger als Kontextmenge. Priorisierung reduziert Rauschen und schützt die spätere Beziehungslogik.",
    visualSpec: "Mehrere Kontextknoten mit sichtbarer Gewichtung. Sekundäre Knoten bleiben vorhanden, aber zurückgenommen.",
    perspectiveCopy: {
      architecture:
        "Fokus auf Signalqualität: Welche Quellen erhöhen Modellklarheit, welche erzeugen nur Dichte?",
      product:
        "Fokus auf Entscheidungsnutzen: Welcher Kontext verändert Priorisierung oder Sequenz der nächsten Produktschritte?",
      governance:
        "Fokus auf Nachweislast: Welche Kontexte sind belastbar, aktuell und auditierbar?",
    },
    visualMode: "svg",
  },
  {
    id: "graph",
    label: "Graph",
    goal: "Knoten verknüpfen",
    technicalFlow:
      "Begriffe werden als Knoten normalisiert, Beziehungen typisiert und über Ursache, Trade-off und Evidenz differenziert modelliert.",
    structuralRelevance:
      "Explizite Beziehungen machen Abhängigkeiten, Nebenwirkungen und Zielkonflikte prüfbar statt implizit diskutierbar.",
    visualSpec:
      "Ein fokussiertes Netz mit klar unterscheidbaren Kanten-Typen. Der Schritt zeigt den Sprung von isolierten Knoten zur belastbaren Struktur.",
    perspectiveCopy: {
      architecture:
        "Fokus auf Kopplung: Wo entstehen Ursache-Wirkung-Ketten zwischen Komponenten oder Domänen?",
      product:
        "Fokus auf Trade-offs: Welche Produktentscheidung verbessert einen Pfad und verschlechtert einen anderen?",
      governance:
        "Fokus auf Verantwortbarkeit: Welche Beziehungstypen benötigen Freigaben, Kontrollen oder dokumentierte Ausnahmen?",
    },
    visualMode: "three",
  },
  {
    id: "synthesis",
    label: "Synthese",
    goal: "Antwort herleiten",
    technicalFlow:
      "Aus dem Modell wird ein expliziter Ableitungspfad markiert: Frage, Konzept, Beziehung, Beleg und Schlussfolgerung.",
    structuralRelevance:
      "Auditierbarkeit entsteht durch den Pfad, nicht durch eine lose Quellenliste. Jede Schlussfolgerung bleibt auf ihre Struktur rückführbar.",
    visualSpec:
      "Ein hervorgehobener Primärpfad, während alternative Pfade sichtbar bleiben. Der Fokus liegt auf nachvollziehbarer Herleitung.",
    perspectiveCopy: {
      architecture:
        "Fokus auf Begründungstiefe: Ist die technische Entscheidung über mehrere Relationen konsistent hergeleitet?",
      product:
        "Fokus auf Entscheidungsargument: Lässt sich die priorisierte Produktmaßnahme mit klaren Ursache-Ketten begründen?",
      governance:
        "Fokus auf Prüfpfad: Kann ein Review die Schlussfolgerung ohne implizites Expertenwissen reproduzieren?",
    },
    visualMode: "svg",
  },
  {
    id: "action",
    label: "Handlung",
    goal: "Nächste Schritte nutzen",
    technicalFlow:
      "Die hergeleitete Schlussfolgerung wird als versionierter Entscheidungszustand operativ gemacht. Alternative Pfade bleiben vergleichbar.",
    structuralRelevance:
      "Stabile Entscheidungen brauchen Variationsfähigkeit. Versionierung zeigt, ob Kernaussagen bei neuen Eingaben robust bleiben.",
    visualSpec: "Entscheidungszustand mit Versionslayer und einblendbaren Alternativpfaden.",
    perspectiveCopy: {
      architecture:
        "Fokus auf Änderbarkeit: Bleibt der Entscheidungszustand bei Architekturvariation nachvollziehbar und kontrolliert?",
      product:
        "Fokus auf Umsetzung: Welche nächsten Schritte sind direkt ausführbar und wie wird ihr Effekt zurück in den Pfad gespiegelt?",
      governance:
        "Fokus auf Steuerung: Welche Version ist freigegeben, welche Abweichung ist dokumentiert und welche Eskalation gilt?",
    },
    visualMode: "svg",
  },
];

export function getPrimaryActionForChapter(chapterIndex: number): StoryPrimaryAction {
  if (chapterIndex >= STORY_CHAPTERS.length - 1) {
    return { label: "Zur Demo", isDemoLink: true };
  }

  return { label: "Weiter", isDemoLink: false };
}
