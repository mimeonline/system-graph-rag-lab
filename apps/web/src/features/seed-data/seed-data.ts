import {
  ONTOLOGY_NODE_TYPES,
  ONTOLOGY_RELATION_TYPES,
  isAllowedOntologyRelation,
  type OntologyNodeType,
  type OntologyRelationType,
} from "@/features/ontology/ontology";

export type SeedSourceType = "primary_md" | "optional_internet";

export type SeedSource = {
  sourceType: SeedSourceType;
  sourceFile: string;
};

export type InternalSource = {
  sourceType: SeedSourceType;
  sourceFile: string;
};

export type PublicReference = {
  kind: "book" | "web";
  citation: string;
  url?: string;
  isbn?: string;
};

export type CuratedSourceEntry = SeedSource & {
  sourceId: string;
  title: string;
  scopeNote: string;
  gapNote?: string;
  internalSource: InternalSource;
  publicReference: PublicReference;
};

export type SeedNode = {
  id: string;
  nodeType: OntologyNodeType;
  title?: string;
  name?: string;
  summary: string;
  embedding?: number[];
  sourceType: SeedSourceType;
  sourceFile: string;
  internalSource: InternalSource;
  publicReference: PublicReference;
};

export type SeedEdge = {
  type: OntologyRelationType;
  fromNodeId: string;
  toNodeId: string;
  sourceType: SeedSourceType;
  sourceFile: string;
  internalSource: InternalSource;
  publicReference: PublicReference;
};

export type SeedDataset = {
  sources: CuratedSourceEntry[];
  nodes: SeedNode[];
  edges: SeedEdge[];
};

export type SeedValidationResult = {
  valid: boolean;
  errors: string[];
};

type RawCuratedSourceEntry = SeedSource & {
  sourceId: string;
  title: string;
  scopeNote: string;
  gapNote?: string;
};

type RawSeedNode = {
  id: string;
  nodeType: OntologyNodeType;
  title?: string;
  name?: string;
  summary: string;
  embedding?: number[];
  sourceType: SeedSourceType;
  sourceFile: string;
};

type RawSeedEdge = {
  type: OntologyRelationType;
  fromNodeId: string;
  toNodeId: string;
  sourceType: SeedSourceType;
  sourceFile: string;
};

const PRIMARY_MD: SeedSourceType = "primary_md";
const OPTIONAL_INTERNET: SeedSourceType = "optional_internet";

function createPublicReference(sourceFile: string, sourceType: SeedSourceType): PublicReference {
  if (sourceType === "optional_internet") {
    return {
      kind: "web",
      citation: "Kuratiertes Online-Material, siehe sourceFile",
      url: sourceFile,
    };
  }

  if (sourceFile.includes("Thinking in Systems") || sourceFile.includes("System Thinking")) {
    return {
      kind: "book",
      citation: "Donella H. Meadows, Thinking in Systems: A Primer (2008)",
      isbn: "9781603580557",
    };
  }

  if (sourceFile.includes("Book Learning Systems Thinking")) {
    return {
      kind: "book",
      citation: "Diana Montalion, Learning Systems Thinking (2024)",
      isbn: "9781098151324",
    };
  }

  if (sourceFile.includes("General System Theory")) {
    return {
      kind: "book",
      citation: "Ludwig von Bertalanffy, General System Theory (1968)",
    };
  }

  return {
    kind: "book",
    citation: "Kuratierte Sekundärquelle, fachlich auf Primärliteratur rückführbar",
  };
}

const CURATED_SOURCES: RawCuratedSourceEntry[] = [
  {
    sourceId: "src-system-thinking-overview",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
    title: "System Thinking",
    scopeNote: "Grundlagen, Feedbackschleifen, Interdependenz und Systemgrenzen.",
  },
  {
    sourceId: "src-introduction-system-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Eine Einführung in das Systemdenken.md",
    title: "Eine Einführung in das Systemdenken",
    scopeNote: "Einordnung von Systemdenken in komplexen Entscheidungssituationen.",
  },
  {
    sourceId: "src-critical-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
    title: "Kritisches Denken",
    scopeNote: "Kritische Bewertung von Annahmen und Schlussfolgerungen.",
  },
  {
    sourceId: "src-ackoff-speech",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
    title: "Systems Thinking Speech by Dr. Russell Ackoff",
    scopeNote: "Systemleistung und Grenzen der lokalen Teiloptimierung.",
  },
  {
    sourceId: "src-learning-systems-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
    title: "Learning Systems Thinking with Diana Montalion and Lisa Moritz",
    scopeNote: "Uebergang von linearem zu systemischem Denken in Software-Kontexten.",
  },
  {
    sourceId: "src-non-linear-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Non-linear Thinking with Diana Montalion 🇬🇧🇺🇸.md",
    title: "Non-linear Thinking with Diana Montalion",
    scopeNote: "Nicht-lineare Ursache-Wirkungs-Ketten in komplexen Systemen.",
  },
  {
    sourceId: "src-complexity-fit",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
    title: "Die Angemessenheit von Komplexität",
    scopeNote: "Soziotechnische Komplexitaet und Systemangemessenheit.",
  },
  {
    sourceId: "src-thinking-in-systems-notes",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
    title: "Thinking in Systems: Lesenotizen",
    scopeNote: "Referenz auf Donella Meadows und Kernprinzipien aus Thinking in Systems.",
  },
  {
    sourceId: "src-thinking-in-systems-chapter-summary",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
    title: "Thinking in Systems: Kapitel Zusammenfassung",
    scopeNote: "Kapitelweise Zusammenfassung zu Stocks, Flows und Feedback-Dynamiken.",
  },
  {
    sourceId: "src-thinking-in-systems-summary",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
    title: "Thinking in Systems: Zusammenfassung",
    scopeNote: "Gesamtzusammenfassung mit Hebelpunkten und Interventionslogik.",
  },
  {
    sourceId: "src-general-system-theory",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/General System Theory.md",
    title: "General System Theory",
    scopeNote: "Klassische Systemtheorie als Grundlagenquelle.",
  },
  {
    sourceId: "src-book-learning-systems-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
    title: "Book Learning Systems Thinking",
    scopeNote: "Buchquelle zu Systemdenken in verteilten Informationssystemen.",
  },
  {
    sourceId: "src-heuristics",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
    title: "Heuristics",
    scopeNote: "Heuristiken als Denkwerkzeug unter Unsicherheit.",
  },
  {
    sourceId: "src-emergence",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
    title: "Was ist Emergence",
    scopeNote: "Emergenz als nicht-reduzierbares Systemverhalten.",
  },
  {
    sourceId: "src-vsm",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
    title: "Viable System Model",
    scopeNote: "Lebensfaehigkeit von Organisationen und strukturelle Regelkreise.",
  },
  {
    sourceId: "src-cld",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
    title: "Causal Loop Diagrams",
    scopeNote: "Rueckkopplungsschleifen und dynamische Systemeffekte.",
  },
  {
    sourceId: "src-iceberg",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
    title: "Iceberg Model",
    scopeNote: "Unterscheidung von Ereignissen, Mustern und tieferen Systemstrukturen.",
  },
  {
    sourceId: "src-problem-solving-methods",
    sourceType: PRIMARY_MD,
    sourceFile: "Problem Solving/Methoden.md",
    title: "Problem Solving Methoden",
    scopeNote: "Methodensammlung fuer Problem- und Ursachenanalyse.",
  },
  {
    sourceId: "src-system-thinking-software",
    sourceType: PRIMARY_MD,
    sourceFile: "Systemisches Denken in Softwareentwicklung.md",
    title: "Systemisches Denken in Softwareentwicklung",
    scopeNote: "Uebertrag von Systemdenken auf Softwarearchitektur-Praxis.",
  },
  {
    sourceId: "src-way-of-system-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "The Way of System Thinking – Was Systemdenken ausmacht Julia Grimm.md",
    title: "The Way of System Thinking",
    scopeNote: "Ganzheitliche Entscheidungsfindung und Perspektivwechsel.",
  },
  {
    sourceId: "src-tools-overview",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
    title: "System Thinking Tools",
    scopeNote: "Ueberblick ueber Werkzeugklassen fuer Analyse und Modellierung.",
  },
  {
    sourceId: "src-modeling-software",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Modellierungssoftware.md",
    title: "Modellierungssoftware",
    scopeNote: "Werkzeugunterstuetzung fuer kausale und dynamische Modellierung.",
  },
  {
    sourceId: "src-book-system-thinking-tools",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
    title: "System Thinking Tools (Book Notes)",
    scopeNote: "Buchbezogene Zusammenfassung von Analyse- und Interventionswerkzeugen.",
  },
  {
    sourceId: "src-casts",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
    title: "Complex Adaptive Systems Thinking",
    scopeNote: "Kernmerkmale komplex-adaptiver Systeme mit Fokus auf Nichtlinearitaet und Selbstorganisation.",
  },
  {
    sourceId: "src-ssm",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
    title: "Soft Systems Methodology",
    scopeNote: "Qualitative Methode fuer weiche, schlecht strukturierte Problemkontexte.",
  },
  {
    sourceId: "src-network-visualization",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
    title: "Netzwerkvisualisierungen",
    scopeNote: "Knoten-Kanten-Darstellungen und Analyse von Zentralitaet, Clustern und Informationsflussen.",
  },
  {
    sourceId: "src-scenarios",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
    title: "Szenarioanalyse",
    scopeNote: "Alternative Zukunftsbilder und robuste Entscheidungsfindung unter Unsicherheit.",
  },
  {
    sourceId: "src-second-order-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
    title: "Denken zweiter Ordnung",
    scopeNote: "Langfristige Folgen von Entscheidungen und Nebenwirkungen in komplexen Systemen.",
  },
  {
    sourceId: "src-taxonomy-ontology",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Taxonomy und eine Ontologie zum Thema System Thinking.md",
    title: "Taxonomy und Ontologie System Thinking",
    scopeNote: "Strukturierung zentraler Begriffe und Relationen fuer systemisches Wissensmodell.",
  },
  {
    sourceId: "src-mental-models-overview",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Mentale Modelle.md",
    title: "Mentale Modelle",
    scopeNote: "Katalog wiederverwendbarer Denkmodelle fuer Problemanalyse und Entscheidungsfindung.",
  },
  {
    sourceId: "src-mental-models-system-thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Systemdenken.md",
    title: "Mentales Modell Systemdenken",
    scopeNote: "Ganzheitliche Perspektive, Feedback, Verzogerungen und unbeabsichtigte Folgen.",
  },
  {
    sourceId: "src-pareto-principle",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Das Pareto-Prinzip.md",
    title: "Pareto-Prinzip",
    scopeNote: "Priorisierungsregel fuer Hebelwirkung und Ressourceneffizienz.",
  },
  {
    sourceId: "src-scientific-method",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Die wissenschaftliche Methode.md",
    title: "Wissenschaftliche Methode",
    scopeNote: "Hypothesengeleitete, reproduzierbare und falsifizierbare Erkenntnisgewinnung.",
  },
  {
    sourceId: "src-delayed-gratification",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Verspätete Belohnung.md",
    title: "Verspaetete Belohnung",
    scopeNote: "Langfristige Zielorientierung durch Aufschub kurzfristiger Impulse.",
  },
  {
    sourceId: "src-meadows-wikipedia",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://en.wikipedia.org/wiki/Donella_Meadows",
    title: "Donella Meadows",
    scopeNote: "Öffentlich referenzierbare Autorinnen-Metadaten.",
    gapNote: "Nur für offene Biografie-Lücken; kein Ersatz für Buchinhalte.",
  },
  {
    sourceId: "src-systems-thinking-org",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://thesystemsthinker.com/",
    title: "The Systems Thinker",
    scopeNote: "Öffentliche Referenzen zu System Traps und praktischen Patterns.",
    gapNote: "Nur ergänzend bei fehlender MD-Abdeckung.",
  },
  {
    sourceId: "src-oreilly-learning-systems-thinking",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.oreilly.com/library/view/learning-systems-thinking/9781098151324/",
    title: "Learning Systems Thinking - O'Reilly",
    scopeNote: "Öffentliche bibliografische Referenz zum Buch von Diana Montalion.",
    gapNote: "Nur bibliografische Ergänzung.",
  },
  {
    sourceId: "src-system-archetype-wikipedia",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://de.wikipedia.org/wiki/Systemarchetyp",
    title: "Systemarchetyp",
    scopeNote: "Offene Referenz zu Systemarchetypen und wiederkehrenden Dynamikmustern.",
    gapNote: "Nur ergänzend fuer allgemein zugaengliche Archetypenbeschreibung.",
  },
  {
    sourceId: "src-system-archetypes-systemsandus",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://systemsandus.com/archetypes/",
    title: "Archetypes – Systems & Us",
    scopeNote: "Uebersicht und Praxisbezug zu gaengigen Systemarchetypen.",
    gapNote: "Nur ergänzend bei fehlender MD-Detailtiefe.",
  },
  {
    sourceId: "src-system-archetypes-community",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.community-of-knowledge.de/beitrag/systemarchetypen/",
    title: "Systemarchetypen (Community of Knowledge)",
    scopeNote: "Kurzdarstellungen von Archetypen fuer Organisationskontexte.",
    gapNote: "Nur ergänzend fuer oeffentliche Referenzierbarkeit.",
  },
  {
    sourceId: "src-who-systems-thinking-event-2026",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news-room/events/item/2026/01/26/default-calendar/systems-thinking-for-health-workforce-development",
    title: "WHO Europe: Systems Thinking for Health Workforce Development (2026)",
    scopeNote: "Aktueller Praxisbezug zu systemischem Denken in gesundheitsbezogenen Arbeitskraeftesystemen.",
    gapNote: "Nur ergänzend fuer neuere Anwendungsfaelle und Terminologie.",
  },
  {
    sourceId: "src-who-health-systems-feature",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news/item/17-06-2024-how-systems-thinking-can-help-us-move-towards-health-systems-that-work-for-all",
    title: "WHO: How systems thinking helps health systems work for all (2024)",
    scopeNote: "Systemdenken in Public-Health-Transformation und Governance-Kontext.",
    gapNote: "Nur ergänzend fuer oeffentlich referenzierbare Fallperspektiven.",
  },
  {
    sourceId: "src-oecd-public-sector-systems-thinking",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://oecd-opsi.org/trends/systems-thinking/",
    title: "OECD OPSI: Systems Thinking in Public Sector Innovation",
    scopeNote: "Politik- und Verwaltungsbezug fuer systemische Problemformulierung und Intervention.",
    gapNote: "Nur ergänzend fuer moderne Public-Sector-Praxis.",
  },
  {
    sourceId: "src-unicef-systems-strengthening",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.unicef.org/documents/systems-strengthening-framework",
    title: "UNICEF: Systems Strengthening Framework",
    scopeNote: "Rahmen fuer systemweite Staerkung und adaptive Verbesserung in komplexen Umfeldern.",
    gapNote: "Nur ergänzend fuer organisationsuebergreifende Systementwicklung.",
  },
  {
    sourceId: "src-arxiv-human-ai-systems-thinking",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://arxiv.org/abs/2509.05534",
    title: "Human-AI Symbiosis in Systems Thinking (arXiv, 2025)",
    scopeNote: "Neue Perspektive auf Systemdenken in sozio-technischen Human-AI-Interaktionssystemen.",
    gapNote: "Nur ergänzend fuer emergente Forschungsthemen.",
  },
];

const NODES: RawSeedNode[] = [
  {
    id: "author:donella_meadows",
    nodeType: "Author",
    name: "Donella Meadows",
    summary: "Autorin von Thinking in Systems und zentrale Referenz fuer Systemdynamik.",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "author:russell_ackoff",
    nodeType: "Author",
    name: "Russell Ackoff",
    summary: "Systemtheoretiker mit Fokus auf Gesamtleistung statt Teiloptimierung.",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    id: "author:diana_montalion",
    nodeType: "Author",
    name: "Diana Montalion",
    summary: "Systemarchitektin mit Fokus auf nicht-lineares Denken in Softwaresystemen.",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
  },
  {
    id: "author:lisa_moritz",
    nodeType: "Author",
    name: "Lisa Moritz",
    summary: "Mitwirkende Stimme im Lernkontext zu System Thinking in der Softwarepraxis.",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
  },
  {
    id: "author:stafford_beer",
    nodeType: "Author",
    name: "Stafford Beer",
    summary: "Kybernetiker und Urheber des Viable System Model.",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "book:thinking_in_systems",
    nodeType: "Book",
    title: "Thinking in Systems: A Primer",
    summary: "Grundlagenwerk zu Rueckkopplung, Dynamik und Systemgrenzen.",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "book:learning_systems_thinking",
    nodeType: "Book",
    title: "Learning Systems Thinking",
    summary: "Praxisorientierter Leitfaden fuer Systemdenken in modernen Informationssystemen.",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "book:general_system_theory",
    nodeType: "Book",
    title: "General System Theory",
    summary: "Klassische theoretische Grundlage fuer interdisziplinaeres Systemverstaendnis.",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/General System Theory.md",
  },
  {
    id: "book:system_thinking_tools",
    nodeType: "Book",
    title: "System Thinking Tools",
    summary: "Werkzeugsammlung fuer Diagnose, Visualisierung und Intervention in komplexen Systemen.",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    id: "concept:feedback_loops",
    nodeType: "Concept",
    title: "Feedback Loops",
    summary: "Rueckkopplungsschleifen erklaeren dynamische Verstaerkung und Stabilisierung.",
    embedding: [0.92, 0.68, 0.74, 0.81],
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:interdependence",
    nodeType: "Concept",
    title: "Interdependence",
    summary: "Systemelemente sind wechselseitig abhaengig und wirken nicht isoliert.",
    embedding: [0.88, 0.66, 0.71, 0.79],
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:system_boundaries",
    nodeType: "Concept",
    title: "System Boundaries",
    summary: "Abgrenzung des betrachteten Systems steuert Fokus und Entscheidungsspielraum.",
    embedding: [0.77, 0.62, 0.69, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:whole_system_view",
    nodeType: "Concept",
    title: "Whole System View",
    summary: "Ganzheitliche Sicht verhindert lokale Optimierung auf Kosten des Gesamtsystems.",
    embedding: [0.84, 0.71, 0.67, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Eine Einführung in das Systemdenken.md",
  },
  {
    id: "concept:critical_thinking",
    nodeType: "Concept",
    title: "Critical Thinking",
    summary: "Systematische Analyse von Annahmen und Argumenten fuer belastbare Schlussfolgerungen.",
    embedding: [0.79, 0.85, 0.72, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    id: "concept:emergence",
    nodeType: "Concept",
    title: "Emergence",
    summary: "Systemeigenschaften entstehen aus Interaktionen und sind nicht auf Teile reduzierbar.",
    embedding: [0.9, 0.73, 0.83, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    id: "concept:viable_system_model",
    nodeType: "Concept",
    title: "Viable System Model",
    summary: "Modell fuer anpassungsfaehige, langfristig lebensfaehige Organisationen.",
    embedding: [0.82, 0.64, 0.89, 0.77],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "concept:heuristics",
    nodeType: "Concept",
    title: "Heuristics",
    summary: "Pragmatische Entscheidungsregeln fuer Unsicherheit bei begrenzter Information.",
    embedding: [0.74, 0.87, 0.66, 0.7],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "concept:causal_loop_diagrams",
    nodeType: "Concept",
    title: "Causal Loop Diagrams",
    summary: "Visualisierung von Ursache-Wirkungs-Beziehungen und Rueckkopplungen im System.",
    embedding: [0.89, 0.75, 0.8, 0.72],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    id: "concept:iceberg_model",
    nodeType: "Concept",
    title: "Iceberg Model",
    summary: "Unterscheidung zwischen sichtbaren Ereignissen und tieferen Strukturursachen.",
    embedding: [0.76, 0.69, 0.88, 0.71],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "concept:non_linear_thinking",
    nodeType: "Concept",
    title: "Non Linear Thinking",
    summary: "Nicht-lineare Zusammenhaenge helfen bei Architekturentscheidungen unter Dynamik.",
    embedding: [0.81, 0.83, 0.7, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Non-linear Thinking with Diana Montalion 🇬🇧🇺🇸.md",
  },
  {
    id: "concept:systemic_complexity",
    nodeType: "Concept",
    title: "Systemic Complexity",
    summary: "Komplexitaet ist angemessen zu behandeln statt durch lineare Modelle zu vereinfachen.",
    embedding: [0.78, 0.72, 0.9, 0.68],
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    id: "concept:stocks_and_flows",
    nodeType: "Concept",
    title: "Stocks and Flows",
    summary: "Bestaende und Fluesse erklaeren zeitverzoegertes Verhalten in dynamischen Systemen.",
    embedding: [0.83, 0.76, 0.71, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:balancing_feedback",
    nodeType: "Concept",
    title: "Balancing Feedback",
    summary: "Ausgleichende Rueckkopplung stabilisiert Systeme um einen Zielzustand.",
    embedding: [0.8, 0.78, 0.67, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:reinforcing_feedback",
    nodeType: "Concept",
    title: "Reinforcing Feedback",
    summary: "Verstaerkende Rueckkopplung erzeugt Wachstum oder Eskalation in Systemen.",
    embedding: [0.85, 0.74, 0.7, 0.79],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:resilience",
    nodeType: "Concept",
    title: "Resilience",
    summary: "Resilienz beschreibt die Faehigkeit eines Systems, Stoerungen zu absorbieren.",
    embedding: [0.79, 0.82, 0.75, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:self_organization",
    nodeType: "Concept",
    title: "Self Organization",
    summary: "Selbstorganisation erlaubt Systemen, neue Strukturen ohne zentrale Steuerung zu bilden.",
    embedding: [0.76, 0.81, 0.82, 0.7],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:system_traps",
    nodeType: "Concept",
    title: "System Traps",
    summary: "Wiederkehrende Dynamiken wie Tragedy of the Commons oder Escalation verschlechtern Systeme.",
    embedding: [0.73, 0.79, 0.84, 0.69],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:leverage_points",
    nodeType: "Concept",
    title: "Leverage Points",
    summary: "Hebelpunkte sind Eingriffspunkte mit ueberproportionaler Systemwirkung.",
    embedding: [0.84, 0.77, 0.86, 0.72],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:policy_resistance",
    nodeType: "Concept",
    title: "Policy Resistance",
    summary: "Policy Resistance entsteht, wenn Teilsysteme Interventionen gegeneinander ausgleichen.",
    embedding: [0.74, 0.68, 0.88, 0.71],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:pattern_thinking",
    nodeType: "Concept",
    title: "Pattern Thinking",
    summary: "Pattern Thinking identifiziert wiederkehrende Strukturmuster hinter beobachteten Ereignissen.",
    embedding: [0.77, 0.8, 0.79, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "concept:systems_leadership",
    nodeType: "Concept",
    title: "Systems Leadership",
    summary: "Systems Leadership gestaltet Kommunikations- und Entscheidungsstrukturen fuer komplexe Umfelder.",
    embedding: [0.72, 0.83, 0.78, 0.77],
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "concept:trap_tragedy_of_the_commons",
    nodeType: "Concept",
    title: "Trap: Tragedy of the Commons",
    summary: "Gemeinsame Ressourcen werden uebernutzt, wenn Kosten externalisiert bleiben.",
    embedding: [0.71, 0.77, 0.86, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_escalation",
    nodeType: "Concept",
    title: "Trap: Escalation",
    summary: "Gegenseitige Ueberbietung fuehrt zu selbstverstaerkender Konfliktdynamik.",
    embedding: [0.69, 0.74, 0.88, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_drift_to_low_performance",
    nodeType: "Concept",
    title: "Trap: Drift to Low Performance",
    summary: "Sinkende Standards normalisieren niedrige Leistung im Zeitverlauf.",
    embedding: [0.72, 0.7, 0.84, 0.79],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_success_to_the_successful",
    nodeType: "Concept",
    title: "Trap: Success to the Successful",
    summary: "Ressourcen konzentrieren sich rekursiv bei bereits erfolgreichen Akteuren.",
    embedding: [0.75, 0.73, 0.82, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_shifting_the_burden",
    nodeType: "Concept",
    title: "Trap: Shifting the Burden",
    summary: "Symptomloesungen verdraengen strukturelle Ursachenarbeit und erzeugen Abhaengigkeit.",
    embedding: [0.74, 0.76, 0.8, 0.77],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_rule_beating",
    nodeType: "Concept",
    title: "Trap: Rule Beating",
    summary: "Akteure optimieren auf Regelindikatoren statt auf den eigentlichen Systemzweck.",
    embedding: [0.7, 0.79, 0.78, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_wrong_goal",
    nodeType: "Concept",
    title: "Trap: Wrong Goal",
    summary: "Falsch gesetzte Ziele lenken das System in unerwuenschte Richtung.",
    embedding: [0.77, 0.71, 0.79, 0.81],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:leverage_parameters",
    nodeType: "Concept",
    title: "Leverage Point: Parameters",
    summary: "Parameteraenderungen sind wirksam, aber meist schwache Eingriffe.",
    embedding: [0.68, 0.74, 0.73, 0.69],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_information_flows",
    nodeType: "Concept",
    title: "Leverage Point: Information Flows",
    summary: "Sichtbarkeit von Information aendert Entscheidungen und Systemverhalten direkt.",
    embedding: [0.8, 0.76, 0.81, 0.72],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_rules",
    nodeType: "Concept",
    title: "Leverage Point: Rules",
    summary: "Regeln und Anreize steuern Handlungsraum und Kopplungen im System.",
    embedding: [0.79, 0.72, 0.77, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_goals",
    nodeType: "Concept",
    title: "Leverage Point: Goals",
    summary: "Systemziele bestimmen priorisierte Dynamiken und Nebenwirkungen.",
    embedding: [0.82, 0.74, 0.83, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_paradigm",
    nodeType: "Concept",
    title: "Leverage Point: Paradigm",
    summary: "Paradigmenwechsel aendert grundlegende Systemlogik und Interventionseffekt.",
    embedding: [0.81, 0.78, 0.85, 0.8],
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:systems_thinker_community",
    nodeType: "Concept",
    title: "Systems Thinker Community",
    summary: "Öffentliche Community-Ressourcen unterstützen kontinuierliches Lernen im Systemdenken.",
    embedding: [0.67, 0.73, 0.76, 0.7],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://thesystemsthinker.com/",
  },
  {
    id: "concept:health_systems_transformation",
    nodeType: "Concept",
    title: "Health Systems Transformation",
    summary: "Systemdenken verbindet Workforce, Governance und Versorgungspfade zu resilienteren Gesundheitssystemen.",
    embedding: [0.73, 0.79, 0.77, 0.75],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news/item/17-06-2024-how-systems-thinking-can-help-us-move-towards-health-systems-that-work-for-all",
  },
  {
    id: "concept:health_workforce_system_dynamics",
    nodeType: "Concept",
    title: "Health Workforce System Dynamics",
    summary: "Arbeitskraefteplanung im Gesundheitssystem profitiert von Feedback-, Verzogerungs- und Interdependenzmodellen.",
    embedding: [0.74, 0.76, 0.8, 0.73],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news-room/events/item/2026/01/26/default-calendar/systems-thinking-for-health-workforce-development",
  },
  {
    id: "concept:public_sector_systems_innovation",
    nodeType: "Concept",
    title: "Public Sector Systems Innovation",
    summary: "Systemische Innovation im oeffentlichen Sektor adressiert vernetzte Probleme ueber Silo-Grenzen hinweg.",
    embedding: [0.76, 0.72, 0.79, 0.74],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://oecd-opsi.org/trends/systems-thinking/",
  },
  {
    id: "concept:systems_strengthening_framework",
    nodeType: "Concept",
    title: "Systems Strengthening Framework",
    summary: "Systemstaerkung fokussiert Kapazitaeten, Koordination und Anpassungsfaehigkeit auf mehreren Ebenen.",
    embedding: [0.75, 0.78, 0.73, 0.77],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.unicef.org/documents/systems-strengthening-framework",
  },
  {
    id: "concept:human_ai_systems_symbiosis",
    nodeType: "Concept",
    title: "Human-AI Systems Symbiosis",
    summary: "Systemdenken erweitert sich auf ko-adaptive Mensch-KI-Systeme mit rekursiven Lern- und Steuerungsdynamiken.",
    embedding: [0.71, 0.8, 0.78, 0.76],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://arxiv.org/abs/2509.05534",
  },
  {
    id: "concept:complex_adaptive_systems_thinking",
    nodeType: "Concept",
    title: "Complex Adaptive Systems Thinking",
    summary: "CAST betrachtet Systeme mit nichtlinearen Interaktionen, Adaptivitaet und emergentem Verhalten.",
    embedding: [0.82, 0.75, 0.86, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
  },
  {
    id: "concept:second_order_thinking",
    nodeType: "Concept",
    title: "Second Order Thinking",
    summary: "Second-Order Thinking bewertet direkte und indirekte Langzeitfolgen von Entscheidungen.",
    embedding: [0.77, 0.8, 0.74, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
  },
  {
    id: "concept:taxonomy_and_ontology_modeling",
    nodeType: "Concept",
    title: "Taxonomy and Ontology Modeling",
    summary: "Taxonomie und Ontologie ordnen Begriffe, Relationen und Klassen fuer konsistente Wissensmodelle.",
    embedding: [0.74, 0.78, 0.8, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Taxonomy und eine Ontologie zum Thema System Thinking.md",
  },
  {
    id: "concept:catwoe",
    nodeType: "Concept",
    title: "CATWOE",
    summary: "CATWOE strukturiert Perspektiven auf Problemkontexte ueber Kunden, Akteure und Transformation.",
    embedding: [0.72, 0.79, 0.76, 0.71],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    id: "concept:network_analysis",
    nodeType: "Concept",
    title: "Network Analysis",
    summary: "Netzwerkanalyse identifiziert zentrale Knoten, Cluster und Flussmuster in komplexen Systemen.",
    embedding: [0.8, 0.74, 0.77, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    id: "concept:mental_models",
    nodeType: "Concept",
    title: "Mental Models",
    summary: "Mentale Modelle sind übertragbare Denkwerkzeuge zur strukturierten Bewertung komplexer Situationen.",
    embedding: [0.78, 0.8, 0.74, 0.79],
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Mentale Modelle.md",
  },
  {
    id: "concept:pareto_principle",
    nodeType: "Concept",
    title: "Pareto Principle",
    summary: "Das 80/20-Prinzip fokussiert auf wenige Ursachen mit grossem Ergebniseffekt.",
    embedding: [0.76, 0.78, 0.7, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Das Pareto-Prinzip.md",
  },
  {
    id: "concept:scientific_method",
    nodeType: "Concept",
    title: "Scientific Method",
    summary: "Beobachtung, Hypothese, Experiment und Replikation verbessern Entscheidungsqualitaet und Lernzyklen.",
    embedding: [0.74, 0.82, 0.79, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Die wissenschaftliche Methode.md",
  },
  {
    id: "concept:delayed_gratification",
    nodeType: "Concept",
    title: "Delayed Gratification",
    summary: "Aufgeschobene Belohnung staerkt langfristige Zielverfolgung und robuste Entscheidungen.",
    embedding: [0.72, 0.77, 0.76, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Verspätete Belohnung.md",
  },
  {
    id: "concept:system_archetypes",
    nodeType: "Concept",
    title: "System Archetypes",
    summary: "Systemarchetypen beschreiben wiederkehrende Strukturmuster mit typischen Dynamiken und Fehlentwicklungen.",
    embedding: [0.79, 0.75, 0.82, 0.77],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://de.wikipedia.org/wiki/Systemarchetyp",
  },
  {
    id: "concept:archetype_limits_to_growth",
    nodeType: "Concept",
    title: "Archetype: Limits to Growth",
    summary: "Frühes Wachstum trifft auf begrenzende Faktoren und kippt ohne Gegenmassnahmen in Stagnation.",
    embedding: [0.77, 0.72, 0.81, 0.76],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://systemsandus.com/archetypes/",
  },
  {
    id: "concept:archetype_fixes_that_fail",
    nodeType: "Concept",
    title: "Archetype: Fixes that Fail",
    summary: "Kurzfristige Loesungen lindern Symptome, erzeugen aber langfristig neue oder staerkere Probleme.",
    embedding: [0.75, 0.76, 0.8, 0.78],
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.community-of-knowledge.de/beitrag/systemarchetypen/",
  },
  {
    id: "tool:system_mapping",
    nodeType: "Tool",
    title: "Tool: System Mapping",
    summary: "System Mapping visualisiert Akteure, Grenzen, Beziehungen und Fluesse auf Systemebene.",
    embedding: [0.76, 0.82, 0.74, 0.71],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:rich_picture",
    nodeType: "Tool",
    title: "Tool: Rich Picture",
    summary: "Rich Pictures machen Problemkontext, Perspektiven und Spannungen visuell sichtbar.",
    embedding: [0.72, 0.8, 0.73, 0.69],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:stock_flow_diagram",
    nodeType: "Tool",
    title: "Tool: Stock and Flow Diagram",
    summary: "Stock-and-Flow-Diagramme modellieren Bestaende, Zu- und Abfluesse dynamischer Systeme.",
    embedding: [0.84, 0.78, 0.72, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:behavior_over_time",
    nodeType: "Tool",
    title: "Tool: Behavior Over Time Graph",
    summary: "Zeitverlaufsgrafiken zeigen Muster, Trends und Verzogerungen in Systemverhalten.",
    embedding: [0.79, 0.75, 0.77, 0.7],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:system_archetypes",
    nodeType: "Tool",
    title: "Tool: System Archetypes",
    summary: "System-Archetypen helfen wiederkehrende Problemstrukturen und Hebel zu erkennen.",
    embedding: [0.78, 0.73, 0.83, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:systemigram",
    nodeType: "Tool",
    title: "Tool: Systemigram",
    summary: "Systemigramme bilden narrative Kausalketten und Wechselwirkungen in komplexen Lagen ab.",
    embedding: [0.71, 0.74, 0.8, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:stakeholder_map",
    nodeType: "Tool",
    title: "Tool: Stakeholder Map",
    summary: "Stakeholder-Maps strukturieren Einfluss, Interessen und Konfliktlinien im System.",
    embedding: [0.75, 0.81, 0.71, 0.72],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:scenario_planning",
    nodeType: "Tool",
    title: "Tool: Scenario Planning",
    summary: "Szenarioplanung erkundet robuste Entscheidungen fuer mehrere Zukunftspfade.",
    embedding: [0.74, 0.79, 0.76, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:modeling_software",
    nodeType: "Tool",
    title: "Tool: Modeling Software",
    summary: "Modellierungssoftware unterstuetzt Simulation, Sensitivitaetsanalyse und Teamkommunikation.",
    embedding: [0.8, 0.77, 0.75, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Modellierungssoftware.md",
  },
  {
    id: "tool:causal_layered_analysis",
    nodeType: "Tool",
    title: "Tool: Causal Layered Analysis",
    summary: "CLA verbindet Ereignisse, systemische Ursachen, Weltbilder und Narrativebenen.",
    embedding: [0.69, 0.76, 0.82, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:iceberg_model",
    nodeType: "Tool",
    title: "Tool: Iceberg Model",
    summary: "Das Iceberg Model verbindet Ereignisse mit Mustern, Strukturen und mentalen Modellen.",
    embedding: [0.77, 0.74, 0.79, 0.72],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "tool:causal_loop_diagram",
    nodeType: "Tool",
    title: "Tool: Causal Loop Diagram",
    summary: "CLDs zeigen verstaerkende und ausgleichende Rueckkopplungsschleifen im System.",
    embedding: [0.81, 0.78, 0.75, 0.76],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    id: "tool:viable_system_model",
    nodeType: "Tool",
    title: "Tool: Viable System Model",
    summary: "Das VSM strukturiert Steuerung, Koordination und Anpassungsfaehigkeit komplexer Organisationen.",
    embedding: [0.76, 0.72, 0.82, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "tool:heuristics_catalog",
    nodeType: "Tool",
    title: "Tool: Heuristics Catalog",
    summary: "Ein Heuristik-Katalog hilft bei schnellen Entscheidungen unter Unsicherheit und Zeitdruck.",
    embedding: [0.71, 0.83, 0.69, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "tool:emergence_lens",
    nodeType: "Tool",
    title: "Tool: Emergence Lens",
    summary: "Die Emergenz-Linse fokussiert auf neue Eigenschaften, die aus Interaktionen vieler Teile entstehen.",
    embedding: [0.7, 0.75, 0.81, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    id: "tool:boundary_analysis",
    nodeType: "Tool",
    title: "Tool: Boundary Analysis",
    summary: "Boundary Analysis macht sichtbar, was innerhalb und ausserhalb der Systembetrachtung liegt.",
    embedding: [0.78, 0.71, 0.77, 0.75],
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "tool:soft_systems_methodology",
    nodeType: "Tool",
    title: "Tool: Soft Systems Methodology",
    summary: "SSM verbindet Rich Pictures, Root Definitions und iterative Verbesserungen in weichen Problemlagen.",
    embedding: [0.75, 0.78, 0.79, 0.74],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    id: "tool:network_visualization",
    nodeType: "Tool",
    title: "Tool: Network Visualization",
    summary: "Netzwerkvisualisierung macht Knoten-Kanten-Strukturen, Cluster und Zentralitaet sichtbar.",
    embedding: [0.79, 0.73, 0.76, 0.77],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    id: "tool:scenario_analysis",
    nodeType: "Tool",
    title: "Tool: Scenario Analysis",
    summary: "Szenarioanalyse beschreibt alternative Zukunftsbilder fuer robuste Entscheidungen unter Unsicherheit.",
    embedding: [0.76, 0.81, 0.75, 0.78],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    id: "problem:local_optimization",
    nodeType: "Problem",
    title: "Local Optimization",
    summary: "Optimierung einzelner Teile verschlechtert in komplexen Systemen die Gesamtleistung.",
    embedding: [0.9, 0.61, 0.77, 0.8],
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    id: "problem:linear_problem_framing",
    nodeType: "Problem",
    title: "Linear Problem Framing",
    summary: "Lineares Denken unterschlaegt Rueckkopplungen und Nebenwirkungen in Systemen.",
    embedding: [0.83, 0.7, 0.76, 0.85],
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "problem:symptom_fixing",
    nodeType: "Problem",
    title: "Symptom Fixing",
    summary: "Reine Ereignisreaktion ohne Strukturursachen fuhrt zu wiederkehrenden Problemen.",
    embedding: [0.75, 0.64, 0.82, 0.79],
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "problem:decision_bias_under_uncertainty",
    nodeType: "Problem",
    title: "Decision Bias Under Uncertainty",
    summary: "Heuristische Verzerrungen erschweren robuste Entscheidungen in dynamischen Umfeldern.",
    embedding: [0.72, 0.86, 0.74, 0.69],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "problem:organizational_viability",
    nodeType: "Problem",
    title: "Organizational Viability",
    summary: "Organisationen verlieren Anpassungsfaehigkeit ohne balancierte Koordinationsebenen.",
    embedding: [0.8, 0.67, 0.84, 0.73],
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
];

const EDGES: RawSeedEdge[] = [
  {
    type: "WROTE",
    fromNodeId: "author:donella_meadows",
    toNodeId: "book:thinking_in_systems",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "WROTE",
    fromNodeId: "author:diana_montalion",
    toNodeId: "book:learning_systems_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "WROTE",
    fromNodeId: "author:stafford_beer",
    toNodeId: "book:general_system_theory",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/General System Theory.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:feedback_loops",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:system_boundaries",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:emergence",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:stocks_and_flows",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:balancing_feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:reinforcing_feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:resilience",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:self_organization",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_points",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_tragedy_of_the_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_drift_to_low_performance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_success_to_the_successful",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_shifting_the_burden",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_rule_beating",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:trap_wrong_goal",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_parameters",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_information_flows",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_rules",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_goals",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:leverage_paradigm",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:non_linear_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Non-linear Thinking with Diana Montalion 🇬🇧🇺🇸.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:pattern_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:systems_leadership",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:systems_thinker_community",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://thesystemsthinker.com/",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:mental_models",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Mentale Modelle.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:second_order_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:delayed_gratification",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Verspätete Belohnung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:general_system_theory",
    toNodeId: "concept:interdependence",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:general_system_theory",
    toNodeId: "concept:viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:general_system_theory",
    toNodeId: "concept:complex_adaptive_systems_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:general_system_theory",
    toNodeId: "concept:taxonomy_and_ontology_modeling",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Taxonomy und eine Ontologie zum Thema System Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:system_mapping",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:rich_picture",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:stock_flow_diagram",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:behavior_over_time",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:system_archetypes",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:systemigram",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:stakeholder_map",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:scenario_planning",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:modeling_software",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Modellierungssoftware.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:causal_layered_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:iceberg_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:causal_loop_diagram",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:heuristics_catalog",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:emergence_lens",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:boundary_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:soft_systems_methodology",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:network_visualization",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:system_thinking_tools",
    toNodeId: "tool:scenario_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    type: "ADDRESSES",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "problem:symptom_fixing",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "ADDRESSES",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "problem:linear_problem_framing",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "ADDRESSES",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "problem:local_optimization",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "ADDRESSES",
    fromNodeId: "book:general_system_theory",
    toNodeId: "problem:organizational_viability",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:feedback_loops",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:linear_problem_framing",
    toNodeId: "concept:non_linear_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Non-linear Thinking with Diana Montalion 🇬🇧🇺🇸.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:symptom_fixing",
    toNodeId: "concept:iceberg_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:symptom_fixing",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:decision_bias_under_uncertainty",
    toNodeId: "concept:heuristics",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:decision_bias_under_uncertainty",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:linear_problem_framing",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:organizational_viability",
    toNodeId: "concept:viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:organizational_viability",
    toNodeId: "concept:systemic_complexity",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:interdependence",
    toNodeId: "concept:feedback_loops",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:feedback_loops",
    toNodeId: "concept:causal_loop_diagrams",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:balancing_feedback",
    toNodeId: "concept:resilience",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:reinforcing_feedback",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:stocks_and_flows",
    toNodeId: "concept:iceberg_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:pattern_thinking",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:systems_leadership",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:leverage_points",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:leverage_information_flows",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:leverage_rules",
    toNodeId: "concept:trap_rule_beating",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:leverage_goals",
    toNodeId: "concept:trap_wrong_goal",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:leverage_paradigm",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:trap_escalation",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:trap_tragedy_of_the_commons",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:system_mapping",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:stock_flow_diagram",
    toNodeId: "concept:stocks_and_flows",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:behavior_over_time",
    toNodeId: "concept:iceberg_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:system_archetypes",
    toNodeId: "concept:system_traps",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:modeling_software",
    toNodeId: "concept:causal_loop_diagrams",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Modellierungssoftware.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:stakeholder_map",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:iceberg_model",
    toNodeId: "concept:iceberg_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:causal_loop_diagram",
    toNodeId: "concept:causal_loop_diagrams",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:viable_system_model",
    toNodeId: "concept:viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:heuristics_catalog",
    toNodeId: "concept:heuristics",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:emergence_lens",
    toNodeId: "concept:emergence",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:boundary_analysis",
    toNodeId: "concept:system_boundaries",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:complex_adaptive_systems_thinking",
    toNodeId: "concept:non_linear_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:complex_adaptive_systems_thinking",
    toNodeId: "concept:self_organization",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:second_order_thinking",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:second_order_thinking",
    toNodeId: "concept:leverage_points",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:taxonomy_and_ontology_modeling",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Taxonomy und eine Ontologie zum Thema System Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:catwoe",
    toNodeId: "tool:stakeholder_map",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:network_analysis",
    toNodeId: "concept:interdependence",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:mental_models",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Mentale Modelle.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:pareto_principle",
    toNodeId: "concept:leverage_points",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Das Pareto-Prinzip.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:scientific_method",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Die wissenschaftliche Methode.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:delayed_gratification",
    toNodeId: "concept:second_order_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Verspätete Belohnung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:system_archetypes",
    toNodeId: "concept:system_traps",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://de.wikipedia.org/wiki/Systemarchetyp",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_limits_to_growth",
    toNodeId: "concept:trap_drift_to_low_performance",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://systemsandus.com/archetypes/",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_fixes_that_fail",
    toNodeId: "concept:trap_shifting_the_burden",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.community-of-knowledge.de/beitrag/systemarchetypen/",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:health_systems_transformation",
    toNodeId: "concept:whole_system_view",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news/item/17-06-2024-how-systems-thinking-can-help-us-move-towards-health-systems-that-work-for-all",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:health_workforce_system_dynamics",
    toNodeId: "concept:feedback_loops",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.who.int/europe/news-room/events/item/2026/01/26/default-calendar/systems-thinking-for-health-workforce-development",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:public_sector_systems_innovation",
    toNodeId: "concept:systems_leadership",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://oecd-opsi.org/trends/systems-thinking/",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:systems_strengthening_framework",
    toNodeId: "concept:resilience",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.unicef.org/documents/systems-strengthening-framework",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:human_ai_systems_symbiosis",
    toNodeId: "concept:complex_adaptive_systems_thinking",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://arxiv.org/abs/2509.05534",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:soft_systems_methodology",
    toNodeId: "concept:catwoe",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:soft_systems_methodology",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:network_visualization",
    toNodeId: "concept:network_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "tool:scenario_analysis",
    toNodeId: "concept:second_order_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:iceberg_model",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:system_boundaries",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:heuristics",
    toNodeId: "concept:critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:systemic_complexity",
    toNodeId: "concept:non_linear_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:viable_system_model",
    toNodeId: "concept:whole_system_view",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:critical_thinking",
    toNodeId: "concept:heuristics",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:whole_system_view",
    toNodeId: "concept:non_linear_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Eine Einführung in das Systemdenken.md",
  },
];

const ALLOWED_SOURCE_TYPES: SeedSourceType[] = ["primary_md", "optional_internet"];

function isValidSourceType(sourceType: string): sourceType is SeedSourceType {
  return ALLOWED_SOURCE_TYPES.includes(sourceType as SeedSourceType);
}

/**
 * Zweck:
 * Liefert den kuratierten Quellenkatalog fuer die Seed-Datenbasis.
 *
 * Input:
 * - keiner
 *
 * Output:
 * - CuratedSourceEntry[] mit sourceType und sourceFile je Eintrag
 *
 * Fehlerfall:
 * - Kein Throw; ungueltige Eintraege werden durch validateSeedDataset erkannt
 *
 * Beispiel:
 * - const sources = createCuratedSourceCatalog()
 * - sources[0].sourceType === "primary_md"
 */
export function createCuratedSourceCatalog(): CuratedSourceEntry[] {
  return CURATED_SOURCES.map((entry) => ({
    ...entry,
    internalSource: {
      sourceType: entry.sourceType,
      sourceFile: entry.sourceFile,
    },
    publicReference: createPublicReference(entry.sourceFile, entry.sourceType),
  }));
}

/**
 * Zweck:
 * Baut einen deterministischen, kuratierten Seed-Datensatz aus den freigegebenen Quellen.
 *
 * Input:
 * - keiner
 *
 * Output:
 * - SeedDataset mit kuratierten sources sowie ontologiekonformen nodes und edges
 *
 * Fehlerfall:
 * - Kein expliziter Throw; Fachfehler werden nachgelagert ueber validateSeedDataset erkannt
 *
 * Beispiel:
 * - const dataset = createSeedDataset()
 * - dataset.sources.length >= 3
 */
export function createSeedDataset(): SeedDataset {
  const sources = createCuratedSourceCatalog();

  return {
    sources,
    nodes: NODES.map((node) => ({
      ...node,
      internalSource: {
        sourceType: node.sourceType,
        sourceFile: node.sourceFile,
      },
      publicReference: createPublicReference(node.sourceFile, node.sourceType),
    })),
    edges: EDGES.map((edge) => ({
      ...edge,
      internalSource: {
        sourceType: edge.sourceType,
        sourceFile: edge.sourceFile,
      },
      publicReference: createPublicReference(edge.sourceFile, edge.sourceType),
    })),
  };
}

/**
 * Zweck:
 * Prueft einen Seed-Datensatz auf Quellen-, Schema-, Referenz- und Ontologie-Konformitaet.
 *
 * Input:
 * - dataset: SeedDataset
 *
 * Output:
 * - SeedValidationResult mit valid-Flag und Fehlerliste
 *
 * Fehlerfall:
 * - Kein Throw; alle Validierungsfehler werden gesammelt in errors zurueckgegeben
 *
 * Beispiel:
 * - const result = validateSeedDataset(createSeedDataset())
 * - result.valid === true
 */
export function validateSeedDataset(dataset: SeedDataset): SeedValidationResult {
  const errors: string[] = [];
  const nodeMap = new Map<string, SeedNode>();
  const curatedSourceKeys = new Set<string>();

  for (const source of dataset.sources) {
    if (!isValidSourceType(source.sourceType)) {
      errors.push(`Quelle ${source.sourceId} hat ungueltigen sourceType ${source.sourceType}.`);
    }

    if (!source.sourceFile.trim()) {
      errors.push(`Quelle ${source.sourceId} hat leeres Pflichtfeld sourceFile.`);
    }

    const sourceKey = `${source.sourceType}:${source.sourceFile}`;
    if (curatedSourceKeys.has(sourceKey)) {
      errors.push(`Quelle ${sourceKey} ist im Katalog nicht eindeutig.`);
      continue;
    }

    curatedSourceKeys.add(sourceKey);

    if (
      source.internalSource.sourceType !== source.sourceType ||
      source.internalSource.sourceFile !== source.sourceFile
    ) {
      errors.push(`Quelle ${source.sourceId} hat inkonsistente internalSource-Felder.`);
    }

    if (!source.publicReference.citation.trim()) {
      errors.push(`Quelle ${source.sourceId} hat leere publicReference.citation.`);
    }
  }

  if (dataset.sources.length === 0) {
    errors.push("Seed-Datensatz hat keinen kuratierten Quellenkatalog.");
  }

  for (const node of dataset.nodes) {
    if (!ONTOLOGY_NODE_TYPES.includes(node.nodeType)) {
      errors.push(`Node ${node.id} hat ungueltigen Node-Type ${node.nodeType}.`);
    }

    if (!node.id.trim()) {
      errors.push("Node mit leerer ID gefunden.");
      continue;
    }

    if (nodeMap.has(node.id)) {
      errors.push(`Node-ID ${node.id} ist nicht eindeutig.`);
      continue;
    }

    if (!node.summary.trim()) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld summary.`);
    }

    if (node.nodeType === "Author") {
      if (!node.name || !node.name.trim()) {
        errors.push(`Author ${node.id} hat kein Pflichtfeld name.`);
      }
    } else if (!node.title || !node.title.trim()) {
      errors.push(`Node ${node.id} hat kein Pflichtfeld title.`);
    }

    if ((node.nodeType === "Concept" || node.nodeType === "Tool" || node.nodeType === "Problem")) {
      if (!node.embedding || node.embedding.length === 0) {
        errors.push(`Node ${node.id} hat kein Pflichtfeld embedding.`);
      }
    }

    if (!isValidSourceType(node.sourceType)) {
      errors.push(`Node ${node.id} hat ungueltigen sourceType ${node.sourceType}.`);
    }

    if (!node.sourceFile.trim()) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld sourceFile.`);
    }

    const sourceKey = `${node.sourceType}:${node.sourceFile}`;
    if (!curatedSourceKeys.has(sourceKey)) {
      errors.push(`Node ${node.id} referenziert unbekannte Quelle ${sourceKey}.`);
    }

    if (
      node.internalSource.sourceType !== node.sourceType ||
      node.internalSource.sourceFile !== node.sourceFile
    ) {
      errors.push(`Node ${node.id} hat inkonsistente internalSource-Felder.`);
    }

    if (!node.publicReference.citation.trim()) {
      errors.push(`Node ${node.id} hat leere publicReference.citation.`);
    }

    nodeMap.set(node.id, node);
  }

  const edgeKeys = new Set<string>();

  for (const edge of dataset.edges) {
    if (!ONTOLOGY_RELATION_TYPES.includes(edge.type)) {
      errors.push(`Edge ${edge.fromNodeId}->${edge.toNodeId} hat ungueltigen Typ ${edge.type}.`);
      continue;
    }

    const edgeKey = `${edge.type}:${edge.fromNodeId}:${edge.toNodeId}`;
    if (edgeKeys.has(edgeKey)) {
      errors.push(`Edge ${edgeKey} ist nicht eindeutig.`);
      continue;
    }

    edgeKeys.add(edgeKey);

    const fromNode = nodeMap.get(edge.fromNodeId);
    const toNode = nodeMap.get(edge.toNodeId);

    if (!fromNode || !toNode) {
      errors.push(`Edge ${edgeKey} referenziert unbekannte Nodes.`);
      continue;
    }

    if (!isAllowedOntologyRelation(edge.type, fromNode.nodeType, toNode.nodeType)) {
      errors.push(
        `Edge ${edgeKey} verletzt Ontologie-Regel fuer ${fromNode.nodeType} -> ${toNode.nodeType}.`,
      );
    }

    if (!isValidSourceType(edge.sourceType)) {
      errors.push(`Edge ${edgeKey} hat ungueltigen sourceType ${edge.sourceType}.`);
    }

    if (!edge.sourceFile.trim()) {
      errors.push(`Edge ${edgeKey} hat leeres Pflichtfeld sourceFile.`);
    }

    const sourceKey = `${edge.sourceType}:${edge.sourceFile}`;
    if (!curatedSourceKeys.has(sourceKey)) {
      errors.push(`Edge ${edgeKey} referenziert unbekannte Quelle ${sourceKey}.`);
    }

    if (
      edge.internalSource.sourceType !== edge.sourceType ||
      edge.internalSource.sourceFile !== edge.sourceFile
    ) {
      errors.push(`Edge ${edgeKey} hat inkonsistente internalSource-Felder.`);
    }

    if (!edge.publicReference.citation.trim()) {
      errors.push(`Edge ${edgeKey} hat leere publicReference.citation.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
