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
  url?: string;
  shortDescription?: string;
  longDescription?: string;
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
  url?: string;
  shortDescription?: string;
  longDescription?: string;
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
const MIN_LONG_TO_SHORT_DESCRIPTION_RATIO = 3;
const WIKIPEDIA_ARTICLE_BASE_URL = "https://en.wikipedia.org/wiki/";
const PRIMARY_REFERENCE_URL_BY_SOURCE_FILE: Record<string, string> = {
  "System Thinking.md": "https://en.wikipedia.org/wiki/Systems_thinking",
  "Methoden/CLDs - Causal Loop Diagrams.md": "https://en.wikipedia.org/wiki/Causal_loop_diagram",
  "Methoden/Iceberg Model.md": "https://thesystemsthinker.com/the-iceberg/",
  "Methoden/Netzwerk Visualisierungen.md": "https://en.wikipedia.org/wiki/Network_science",
  "Methoden/SSM - Soft Systems Methodology.md": "https://en.wikipedia.org/wiki/Soft_systems_methodology",
  "Thinking in Systems/Lesenotizen - Think in Systems.md":
    "https://en.wikipedia.org/wiki/Thinking_in_Systems:_A_Primer",
  "Books/Book Learning Systems Thinking.md":
    "https://www.oreilly.com/library/view/learning-systems-thinking/9781098151324/",
  "Books/System Thinking Tools.md": "https://www.routledge.com/System-Thinking-Tools/Maani-Cavana/p/book/9781874719366",
  "Tools/Tools.md": "https://thesystemsthinker.com/",
  "Tools/Modellierungssoftware.md": "https://en.wikipedia.org/wiki/System_dynamics",
};

function toPrimaryReferenceFallbackUrl(sourceFile: string): string {
  const cleaned = sourceFile
    .replace(/\.md$/i, "")
    .replace(/^Books\//i, "")
    .replace(/^Konzepte\//i, "")
    .replace(/^Methoden\//i, "")
    .replace(/^Mentale Modelle\//i, "")
    .replace(/^Problem Solving\//i, "")
    .replace(/^Thinking in Systems\//i, "")
    .replace(/^Tools\//i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const normalized = (cleaned.length > 0 ? cleaned : sourceFile)
    .replace(/[^A-Za-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
  return `${WIKIPEDIA_ARTICLE_BASE_URL}${encodeURIComponent(normalized || "Systems_thinking")}`;
}

/**
 * Zweck:
 * Leitet aus einer internen Quelle eine oeffentlich referenzierbare Literaturangabe ab.
 *
 * Input:
 * - sourceFile: Pfad oder URL der kuratierten Quelle
 * - sourceType: Herkunftstyp der Quelle
 *
 * Output:
 * - PublicReference mit stabilen Pflichtfeldern fuer Zitierbarkeit
 *
 * Fehlerfall:
 * - Kein Throw; unbekannte Quellen fallen auf einen generischen Buchverweis zurueck
 *
 * Beispiel:
 * - createPublicReference("https://example.org", "optional_internet").kind === "web"
 */
function createPublicReference(sourceFile: string, sourceType: SeedSourceType): PublicReference {
  if (sourceType === "optional_internet") {
    return {
      kind: "web",
      citation: "Kuratiertes Online-Material, siehe sourceFile",
      url: sourceFile,
    };
  }

  const primaryReferenceUrl = PRIMARY_REFERENCE_URL_BY_SOURCE_FILE[sourceFile];
  const primaryFallbackUrl = toPrimaryReferenceFallbackUrl(sourceFile);

  if (sourceFile.includes("Thinking in Systems") || sourceFile.includes("System Thinking")) {
    return {
      kind: "book",
      citation: "Donella H. Meadows, Thinking in Systems: A Primer (2008)",
      url: primaryReferenceUrl ?? "https://en.wikipedia.org/wiki/Thinking_in_Systems:_A_Primer",
      isbn: "9781603580557",
    };
  }

  if (sourceFile.includes("Book Learning Systems Thinking")) {
    return {
      kind: "book",
      citation: "Diana Montalion, Learning Systems Thinking (2024)",
      url:
        primaryReferenceUrl ??
        "https://www.oreilly.com/library/view/learning-systems-thinking/9781098151324/",
      isbn: "9781098151324",
    };
  }

  if (sourceFile.includes("System Thinking Tools")) {
    return {
      kind: "book",
      citation: "Jamshid Gharajedaghi, Systems Thinking: Managing Chaos and Complexity (2011)",
      url:
        primaryReferenceUrl ??
        "https://www.routledge.com/System-Thinking-Tools/Maani-Cavana/p/book/9781874719366",
    };
  }

  if (sourceFile.includes("General System Theory")) {
    return {
      kind: "book",
      citation: "Ludwig von Bertalanffy, General System Theory (1968)",
      url: primaryReferenceUrl ?? "https://en.wikipedia.org/wiki/General_systems_theory",
    };
  }

  return {
    kind: "book",
    citation: "Kuratierte Sekundärquelle, fachlich auf Primärliteratur rückführbar",
    url: primaryReferenceUrl ?? primaryFallbackUrl,
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
    shortDescription: "Kurz: Autorin von Thinking in Systems und zentrale Referenz fuer Systemdynamik.",
    longDescription: "Donella Meadows praegte das Verstaendnis von Rueckkopplungen, Verzoegerungen und Hebelpunkten in komplexen Systemen. Die Perspektive zeigt, wie Ziele, Regeln und Informationsfluesse Verhalten im System praegen. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    url: "https://en.wikipedia.org/wiki/Donella_Meadows",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "author:russell_ackoff",
    nodeType: "Author",
    name: "Russell Ackoff",
    summary: "Systemtheoretiker mit Fokus auf Gesamtleistung statt Teiloptimierung.",
    shortDescription: "Kurz: Systemtheoretiker mit Fokus auf Gesamtleistung statt Teiloptimierung.",
    longDescription: "Russell Ackoff betonte, dass die Leistung eines Systems aus dem Zusammenspiel der Teile entsteht, nicht aus isolierter Teiloptimierung. Die Arbeit dieser Person macht systemische Interventionen anschlussfaehig fuer die Praxis. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    url: "https://en.wikipedia.org/wiki/Russell_L._Ackoff",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    id: "author:diana_montalion",
    nodeType: "Author",
    name: "Diana Montalion",
    summary: "Systemarchitektin mit Fokus auf nicht-lineares Denken in Softwaresystemen.",
    shortDescription: "Kurz: Systemarchitektin mit Fokus auf nicht-lineares Denken in Softwaresystemen.",
    longDescription: "Diana Montalion uebertraegt Systemdenken auf moderne Software- und Produktorganisationen mit starken Abhaengigkeiten. Die Arbeit dieser Person macht systemische Interventionen anschlussfaehig fuer die Praxis. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    url: "https://www.oreilly.com/library/view/learning-systems-thinking/9781098151324/",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
  },
  {
    id: "author:lisa_moritz",
    nodeType: "Author",
    name: "Lisa Moritz",
    summary: "Mitwirkende Stimme im Lernkontext zu System Thinking in der Softwarepraxis.",
    shortDescription: "Kurz: Mitwirkende Stimme im Lernkontext zu System Thinking in der Softwarepraxis.",
    longDescription: "Lisa Moritz vermittelt systemische Denkweisen praxisnah fuer Teamarbeit, Priorisierung und Entscheidungsfindung unter Unsicherheit. Die Arbeit dieser Person macht systemische Interventionen anschlussfaehig fuer die Praxis. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    url: "https://www.linkedin.com/in/lisa-moritz/",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
  },
  {
    id: "author:stafford_beer",
    nodeType: "Author",
    name: "Stafford Beer",
    summary: "Kybernetiker und Urheber des Viable System Model.",
    shortDescription: "Kurz: Kybernetiker und Urheber des Viable System Model.",
    longDescription: "Stafford Beer entwickelte mit dem Viable System Model einen Rahmen fuer robuste und lernfaehige Organisationen. Die Perspektive zeigt, wie Ziele, Regeln und Informationsfluesse Verhalten im System praegen. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    url: "https://en.wikipedia.org/wiki/Stafford_Beer",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "book:thinking_in_systems",
    nodeType: "Book",
    title: "Thinking in Systems: A Primer",
    summary: "Grundlagenwerk zu Rueckkopplung, Dynamik und Systemgrenzen.",
    shortDescription: "Kurz: Grundlagenwerk zu Rueckkopplung, Dynamik und Systemgrenzen.",
    longDescription: "Thinking in Systems erklaert die Kernelemente von Systemdynamik, inklusive Rueckkopplungen, Bestaenden und Zeitverzoegerungen. Als Referenz hilft es, unscharfe Begriffe und falsche Kausalannahmen zu vermeiden. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    url: "https://en.wikipedia.org/wiki/Thinking_in_Systems:_A_Primer",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "book:learning_systems_thinking",
    nodeType: "Book",
    title: "Learning Systems Thinking",
    summary: "Praxisorientierter Leitfaden fuer Systemdenken in modernen Informationssystemen.",
    shortDescription: "Kurz: Praxisorientierter Leitfaden fuer Systemdenken in modernen Informationssystemen.",
    longDescription: "Learning Systems Thinking verbindet theoretische Modelle mit konkreten Arbeitsweisen in Produkt- und Softwarekontexten. Das Werk bietet einen stabilen Begriffsrahmen fuer Analyse, Diskussion und Intervention. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    url: "https://www.oreilly.com/library/view/learning-systems-thinking/9781098151324/",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "book:general_system_theory",
    nodeType: "Book",
    title: "General System Theory",
    summary: "Klassische theoretische Grundlage fuer interdisziplinaeres Systemverstaendnis.",
    shortDescription: "Kurz: Klassische theoretische Grundlage fuer interdisziplinaeres Systemverstaendnis.",
    longDescription: "General System Theory liefert die theoretische Grundlage fuer gemeinsame Prinzipien ueber unterschiedliche Fachdomänen hinweg. Das Werk bietet einen stabilen Begriffsrahmen fuer Analyse, Diskussion und Intervention. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    url: "https://en.wikipedia.org/wiki/General_systems_theory",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/General System Theory.md",
  },
  {
    id: "book:system_thinking_tools",
    nodeType: "Book",
    title: "System Thinking Tools",
    summary: "Werkzeugsammlung fuer Diagnose, Visualisierung und Intervention in komplexen Systemen.",
    shortDescription: "Kurz: Werkzeugsammlung fuer Diagnose, Visualisierung und Intervention in komplexen Systemen.",
    longDescription: "System Thinking Tools fokussiert auf anwendbare Methoden zur Diagnose und Gestaltung komplexer Systeme. Es verbindet Modelllogik mit konkreten Beispielen fuer reale Entscheidungssituationen. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    url: "https://www.routledge.com/System-Thinking-Tools/Maani-Cavana/p/book/9781874719366",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/System Thinking Tools.md",
  },
  {
    id: "concept:feedback_loops",
    nodeType: "Concept",
    title: "Feedback Loops",
    summary: "Rueckkopplungsschleifen erklaeren dynamische Verstaerkung und Stabilisierung.",
    shortDescription: "Kurz: Rueckkopplungsschleifen erklaeren dynamische Verstaerkung und Stabilisierung.",
    longDescription: "Rueckkopplungsschleifen erklaeren dynamische Verstaerkung und Stabilisierung. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.09582388, 0.19495375, -0.8655706, 0.45121875],
    url: "https://en.wikipedia.org/wiki/Feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:interdependence",
    nodeType: "Concept",
    title: "Interdependence",
    summary: "Systemelemente sind wechselseitig abhaengig und wirken nicht isoliert.",
    shortDescription: "Kurz: Systemelemente sind wechselseitig abhaengig und wirken nicht isoliert.",
    longDescription: "Systemelemente sind wechselseitig abhaengig und wirken nicht isoliert. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.41211566, 0.08371574, 0.07801304, 0.9039172],
    url: "https://en.wikipedia.org/wiki/Interdependence",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:system_boundaries",
    nodeType: "Concept",
    title: "System Boundaries",
    summary: "Abgrenzung des betrachteten Systems steuert Fokus und Entscheidungsspielraum.",
    shortDescription: "Kurz: Abgrenzung des betrachteten Systems steuert Fokus und Entscheidungsspielraum.",
    longDescription: "Abgrenzung des betrachteten Systems steuert Fokus und Entscheidungsspielraum. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.19851127, 0.4108886, 0.6061456, 0.65142256],
    url: "https://en.wikipedia.org/wiki/System_boundary",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:whole_system_view",
    nodeType: "Concept",
    title: "Whole System View",
    summary: "Ganzheitliche Sicht verhindert lokale Optimierung auf Kosten des Gesamtsystems.",
    shortDescription: "Kurz: Ganzheitliche Sicht verhindert lokale Optimierung auf Kosten des Gesamtsystems.",
    longDescription: "Ganzheitliche Sicht verhindert lokale Optimierung auf Kosten des Gesamtsystems. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [0.07029752, 0.37470403, 0.54844224, 0.74422187],
    url: "https://en.wikipedia.org/wiki/Systems_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Eine Einführung in das Systemdenken.md",
  },
  {
    id: "concept:critical_thinking",
    nodeType: "Concept",
    title: "Critical Thinking",
    summary: "Systematische Analyse von Annahmen und Argumenten fuer belastbare Schlussfolgerungen.",
    shortDescription: "Kurz: Systematische Analyse von Annahmen und Argumenten fuer belastbare Schlussfolgerungen.",
    longDescription: "Systematische Analyse von Annahmen und Argumenten fuer belastbare Schlussfolgerungen. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.21546996, 0.12305657, -0.9573575, 0.14797431],
    url: "https://en.wikipedia.org/wiki/Critical_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    id: "concept:emergence",
    nodeType: "Concept",
    title: "Emergence",
    summary: "Systemeigenschaften entstehen aus Interaktionen und sind nicht auf Teile reduzierbar.",
    shortDescription: "Kurz: Systemeigenschaften entstehen aus Interaktionen und sind nicht auf Teile reduzierbar.",
    longDescription: "Systemeigenschaften entstehen aus Interaktionen und sind nicht auf Teile reduzierbar. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.43462577, 0.5705627, 0.23016171, 0.6577113],
    url: "https://en.wikipedia.org/wiki/Emergence",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    id: "concept:viable_system_model",
    nodeType: "Concept",
    title: "Viable System Model",
    summary: "Modell fuer anpassungsfaehige, langfristig lebensfaehige Organisationen.",
    shortDescription: "Kurz: Modell fuer anpassungsfaehige, langfristig lebensfaehige Organisationen.",
    longDescription: "Modell fuer anpassungsfaehige, langfristig lebensfaehige Organisationen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.49049643, 0.8124619, 0.2042134, 0.24003308],
    url: "https://en.wikipedia.org/wiki/Viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "concept:heuristics",
    nodeType: "Concept",
    title: "Heuristics",
    summary: "Pragmatische Entscheidungsregeln fuer Unsicherheit bei begrenzter Information.",
    shortDescription: "Kurz: Pragmatische Entscheidungsregeln fuer Unsicherheit bei begrenzter Information.",
    longDescription: "Pragmatische Entscheidungsregeln fuer Unsicherheit bei begrenzter Information. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.7260923, -0.05243606, -0.6784425, 0.09877408],
    url: "https://en.wikipedia.org/wiki/Heuristic",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "concept:causal_loop_diagrams",
    nodeType: "Concept",
    title: "Causal Loop Diagrams",
    summary: "Visualisierung von Ursache-Wirkungs-Beziehungen und Rueckkopplungen im System.",
    shortDescription: "Kurz: Visualisierung von Ursache-Wirkungs-Beziehungen und Rueckkopplungen im System.",
    longDescription: "Visualisierung von Ursache-Wirkungs-Beziehungen und Rueckkopplungen im System. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.5085231, 0.2592349, -0.8205997, 0.02859665],
    url: "https://en.wikipedia.org/wiki/Causal_loop_diagram",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    id: "concept:iceberg_model",
    nodeType: "Concept",
    title: "Iceberg Model",
    summary: "Unterscheidung zwischen sichtbaren Ereignissen und tieferen Strukturursachen.",
    shortDescription: "Kurz: Unterscheidung zwischen sichtbaren Ereignissen und tieferen Strukturursachen.",
    longDescription: "Unterscheidung zwischen sichtbaren Ereignissen und tieferen Strukturursachen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.8891428, 0.19040169, -0.02489058, 0.4153945],
    url: "https://thesystemsthinker.com/the-iceberg/",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "concept:non_linear_thinking",
    nodeType: "Concept",
    title: "Non Linear Thinking",
    summary: "Nicht-lineare Zusammenhaenge helfen bei Architekturentscheidungen unter Dynamik.",
    shortDescription: "Kurz: Nicht-lineare Zusammenhaenge helfen bei Architekturentscheidungen unter Dynamik.",
    longDescription: "Nicht-lineare Zusammenhaenge helfen bei Architekturentscheidungen unter Dynamik. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.2929031, 0.80649024, 0.438415, 0.26753247],
    url: "https://en.wikipedia.org/wiki/Nonlinear_system",
    sourceType: PRIMARY_MD,
    sourceFile: "Non-linear Thinking with Diana Montalion 🇬🇧🇺🇸.md",
  },
  {
    id: "concept:systemic_complexity",
    nodeType: "Concept",
    title: "Systemic Complexity",
    summary: "Komplexitaet ist angemessen zu behandeln statt durch lineare Modelle zu vereinfachen.",
    shortDescription: "Kurz: Komplexitaet ist angemessen zu behandeln statt durch lineare Modelle zu vereinfachen.",
    longDescription: "Komplexitaet ist angemessen zu behandeln statt durch lineare Modelle zu vereinfachen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.21986996, 0.6384199, -0.00862057, 0.7375655],
    url: "https://en.wikipedia.org/wiki/Complex_system",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    id: "concept:stocks_and_flows",
    nodeType: "Concept",
    title: "Stocks and Flows",
    summary: "Bestaende und Fluesse erklaeren zeitverzoegertes Verhalten in dynamischen Systemen.",
    shortDescription: "Kurz: Bestaende und Fluesse erklaeren zeitverzoegertes Verhalten in dynamischen Systemen.",
    longDescription: "Bestaende und Fluesse erklaeren zeitverzoegertes Verhalten in dynamischen Systemen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.16607083, 0.8760206, -0.3975525, 0.21670365],
    url: "https://en.wikipedia.org/wiki/System_dynamics",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:balancing_feedback",
    nodeType: "Concept",
    title: "Balancing Feedback",
    summary: "Ausgleichende Rueckkopplung stabilisiert Systeme um einen Zielzustand.",
    shortDescription: "Kurz: Ausgleichende Rueckkopplung stabilisiert Systeme um einen Zielzustand.",
    longDescription: "Ausgleichende Rueckkopplung stabilisiert Systeme um einen Zielzustand. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.17978042, 0.49373522, -0.46399215, 0.7131731],
    url: "https://en.wikipedia.org/wiki/Negative_feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:reinforcing_feedback",
    nodeType: "Concept",
    title: "Reinforcing Feedback",
    summary: "Verstaerkende Rueckkopplung erzeugt Wachstum oder Eskalation in Systemen.",
    shortDescription: "Kurz: Verstaerkende Rueckkopplung erzeugt Wachstum oder Eskalation in Systemen.",
    longDescription: "Verstaerkende Rueckkopplung erzeugt Wachstum oder Eskalation in Systemen. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.16896775, 0.45240343, -0.13342437, 0.8654357],
    url: "https://en.wikipedia.org/wiki/Positive_feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:resilience",
    nodeType: "Concept",
    title: "Resilience",
    summary: "Resilienz beschreibt die Faehigkeit eines Systems, Stoerungen zu absorbieren.",
    shortDescription: "Kurz: Resilienz beschreibt die Faehigkeit eines Systems, Stoerungen zu absorbieren.",
    longDescription: "Resilienz beschreibt die Faehigkeit eines Systems, Stoerungen zu absorbieren. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.15098289, 0.6661135, -0.29195702, 0.66952074],
    url: "https://en.wikipedia.org/wiki/Resilience",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:self_organization",
    nodeType: "Concept",
    title: "Self Organization",
    summary: "Selbstorganisation erlaubt Systemen, neue Strukturen ohne zentrale Steuerung zu bilden.",
    shortDescription: "Kurz: Selbstorganisation erlaubt Systemen, neue Strukturen ohne zentrale Steuerung zu bilden.",
    longDescription: "Selbstorganisation erlaubt Systemen, neue Strukturen ohne zentrale Steuerung zu bilden. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.04485324, 0.4080559, 0.09201003, 0.90720046],
    url: "https://en.wikipedia.org/wiki/Self-organization",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:system_traps",
    nodeType: "Concept",
    title: "System Traps",
    summary: "Wiederkehrende Dynamiken wie Tragedy of the Commons oder Escalation verschlechtern Systeme.",
    shortDescription: "Kurz: Wiederkehrende Dynamiken wie Tragedy of the Commons oder Escalation verschlechtern Systeme.",
    longDescription: "Wiederkehrende Dynamiken wie Tragedy of the Commons oder Escalation verschlechtern Systeme. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.17924099, 0.8139872, 0.1856987, 0.52039737],
    url: "https://en.wikipedia.org/wiki/Asynchronous_system_trap",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:leverage_points",
    nodeType: "Concept",
    title: "Leverage Points",
    summary: "Hebelpunkte sind Eingriffspunkte mit ueberproportionaler Systemwirkung.",
    shortDescription: "Kurz: Hebelpunkte sind Eingriffspunkte mit ueberproportionaler Systemwirkung.",
    longDescription: "Hebelpunkte sind Eingriffspunkte mit ueberproportionaler Systemwirkung. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.45375177, 0.49925423, 0.53202873, 0.511664],
    url: "https://en.wikipedia.org/wiki/Twelve_leverage_points",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:policy_resistance",
    nodeType: "Concept",
    title: "Policy Resistance",
    summary: "Policy Resistance entsteht, wenn Teilsysteme Interventionen gegeneinander ausgleichen.",
    shortDescription: "Kurz: Policy Resistance entsteht, wenn Teilsysteme Interventionen gegeneinander ausgleichen.",
    longDescription: "Policy Resistance entsteht, wenn Teilsysteme Interventionen gegeneinander ausgleichen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.30600417, 0.5370532, 0.39913586, 0.6772193],
    url: "https://en.wikipedia.org/wiki/National_Resistance_Front",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:pattern_thinking",
    nodeType: "Concept",
    title: "Pattern Thinking",
    summary: "Pattern Thinking identifiziert wiederkehrende Strukturmuster hinter beobachteten Ereignissen.",
    shortDescription: "Kurz: Pattern Thinking identifiziert wiederkehrende Strukturmuster hinter beobachteten Ereignissen.",
    longDescription: "Pattern Thinking identifiziert wiederkehrende Strukturmuster hinter beobachteten Ereignissen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.6505714, 0.74030536, 0.11196354, 0.12715714],
    url: "https://en.wikipedia.org/wiki/Lateral_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "concept:systems_leadership",
    nodeType: "Concept",
    title: "Systems Leadership",
    summary: "Systems Leadership gestaltet Kommunikations- und Entscheidungsstrukturen fuer komplexe Umfelder.",
    shortDescription: "Kurz: Systems Leadership gestaltet Kommunikations- und Entscheidungsstrukturen fuer komplexe Umfelder.",
    longDescription: "Systems Leadership gestaltet Kommunikations- und Entscheidungsstrukturen fuer komplexe Umfelder. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.25226355, 0.14090563, 0.9396171, 0.18338045],
    url: "https://en.wikipedia.org/wiki/Leadership",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "concept:trap_tragedy_of_the_commons",
    nodeType: "Concept",
    title: "Trap: Tragedy of the Commons",
    summary: "Gemeinsame Ressourcen werden uebernutzt, wenn Kosten externalisiert bleiben.",
    shortDescription: "Kurz: Gemeinsame Ressourcen werden uebernutzt, wenn Kosten externalisiert bleiben.",
    longDescription: "Gemeinsame Ressourcen werden uebernutzt, wenn Kosten externalisiert bleiben. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [0.17981571, 0.58885074, 0.48871282, 0.6181269],
    url: "https://en.wikipedia.org/wiki/Tragedy_of_the_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_escalation",
    nodeType: "Concept",
    title: "Trap: Escalation",
    summary: "Gegenseitige Ueberbietung fuehrt zu selbstverstaerkender Konfliktdynamik.",
    shortDescription: "Kurz: Gegenseitige Ueberbietung fuehrt zu selbstverstaerkender Konfliktdynamik.",
    longDescription: "Gegenseitige Ueberbietung fuehrt zu selbstverstaerkender Konfliktdynamik. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.07822, 0.4954998, 0.22540131, 0.8351981],
    url: "https://en.wikipedia.org/wiki/Escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_drift_to_low_performance",
    nodeType: "Concept",
    title: "Trap: Drift to Low Performance",
    summary: "Sinkende Standards normalisieren niedrige Leistung im Zeitverlauf.",
    shortDescription: "Kurz: Sinkende Standards normalisieren niedrige Leistung im Zeitverlauf.",
    longDescription: "Sinkende Standards normalisieren niedrige Leistung im Zeitverlauf. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.42963442, 0.7821729, 0.40066504, 0.20757487],
    url: "https://en.wikipedia.org/wiki/System_archetype",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_success_to_the_successful",
    nodeType: "Concept",
    title: "Trap: Success to the Successful",
    summary: "Ressourcen konzentrieren sich rekursiv bei bereits erfolgreichen Akteuren.",
    shortDescription: "Kurz: Ressourcen konzentrieren sich rekursiv bei bereits erfolgreichen Akteuren.",
    longDescription: "Ressourcen konzentrieren sich rekursiv bei bereits erfolgreichen Akteuren. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [0.35776594, 0.75957793, 0.35452726, 0.41152802],
    url: "https://en.wikipedia.org/wiki/Success",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_shifting_the_burden",
    nodeType: "Concept",
    title: "Trap: Shifting the Burden",
    summary: "Symptomloesungen verdraengen strukturelle Ursachenarbeit und erzeugen Abhaengigkeit.",
    shortDescription: "Kurz: Symptomloesungen verdraengen strukturelle Ursachenarbeit und erzeugen Abhaengigkeit.",
    longDescription: "Symptomloesungen verdraengen strukturelle Ursachenarbeit und erzeugen Abhaengigkeit. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.00676453, 0.5201994, 0.20683749, 0.82859224],
    url: "https://en.wikipedia.org/wiki/Burden_of_proof_(philosophy)",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_rule_beating",
    nodeType: "Concept",
    title: "Trap: Rule Beating",
    summary: "Akteure optimieren auf Regelindikatoren statt auf den eigentlichen Systemzweck.",
    shortDescription: "Kurz: Akteure optimieren auf Regelindikatoren statt auf den eigentlichen Systemzweck.",
    longDescription: "Akteure optimieren auf Regelindikatoren statt auf den eigentlichen Systemzweck. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.0146307, 0.9636304, -0.12807746, 0.23409115],
    url: "https://en.wikipedia.org/wiki/Rule_of_thumb",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:trap_wrong_goal",
    nodeType: "Concept",
    title: "Trap: Wrong Goal",
    summary: "Falsch gesetzte Ziele lenken das System in unerwuenschte Richtung.",
    shortDescription: "Kurz: Falsch gesetzte Ziele lenken das System in unerwuenschte Richtung.",
    longDescription: "Falsch gesetzte Ziele lenken das System in unerwuenschte Richtung. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.03016229, 0.8820027, 0.20487374, 0.42330617],
    url: "https://en.wikipedia.org/wiki/Ghost_goal",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:leverage_parameters",
    nodeType: "Concept",
    title: "Leverage Point: Parameters",
    summary: "Parameteraenderungen sind wirksam, aber meist schwache Eingriffe.",
    shortDescription: "Kurz: Parameteraenderungen sind wirksam, aber meist schwache Eingriffe.",
    longDescription: "Parameteraenderungen sind wirksam, aber meist schwache Eingriffe. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.5022021, 0.83299387, 0.22384831, -0.06169455],
    url: "https://en.wikipedia.org/wiki/Parameter",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_information_flows",
    nodeType: "Concept",
    title: "Leverage Point: Information Flows",
    summary: "Sichtbarkeit von Information aendert Entscheidungen und Systemverhalten direkt.",
    shortDescription: "Kurz: Sichtbarkeit von Information aendert Entscheidungen und Systemverhalten direkt.",
    longDescription: "Sichtbarkeit von Information aendert Entscheidungen und Systemverhalten direkt. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.5114937, 0.6035718, -0.3489759, 0.5022859],
    url: "https://en.wikipedia.org/wiki/Information_flow_(information_theory)",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_rules",
    nodeType: "Concept",
    title: "Leverage Point: Rules",
    summary: "Regeln und Anreize steuern Handlungsraum und Kopplungen im System.",
    shortDescription: "Kurz: Regeln und Anreize steuern Handlungsraum und Kopplungen im System.",
    longDescription: "Regeln und Anreize steuern Handlungsraum und Kopplungen im System. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.33150008, 0.8926779, 0.20658398, 0.22484902],
    url: "https://en.wikipedia.org/wiki/Rule",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_goals",
    nodeType: "Concept",
    title: "Leverage Point: Goals",
    summary: "Systemziele bestimmen priorisierte Dynamiken und Nebenwirkungen.",
    shortDescription: "Kurz: Systemziele bestimmen priorisierte Dynamiken und Nebenwirkungen.",
    longDescription: "Systemziele bestimmen priorisierte Dynamiken und Nebenwirkungen. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.3718231, 0.8731658, 0.19955477, 0.2439407],
    url: "https://en.wikipedia.org/wiki/Goal_(disambiguation)",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:leverage_paradigm",
    nodeType: "Concept",
    title: "Leverage Point: Paradigm",
    summary: "Paradigmenwechsel aendert grundlegende Systemlogik und Interventionseffekt.",
    shortDescription: "Kurz: Paradigmenwechsel aendert grundlegende Systemlogik und Interventionseffekt.",
    longDescription: "Paradigmenwechsel aendert grundlegende Systemlogik und Interventionseffekt. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.5275819, 0.728245, -0.24558482, 0.3619457],
    url: "https://en.wikipedia.org/wiki/Paradigm",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:systems_thinker_community",
    nodeType: "Concept",
    title: "Systems Thinker Community",
    summary: "Öffentliche Community-Ressourcen unterstützen kontinuierliches Lernen im Systemdenken.",
    shortDescription: "Kurz: Öffentliche Community-Ressourcen unterstützen kontinuierliches Lernen im Systemdenken.",
    longDescription: "Öffentliche Community-Ressourcen unterstützen kontinuierliches Lernen im Systemdenken. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.16558537, -0.18861872, 0.24116023, 0.93746793],
    url: "https://thesystemsthinker.com/",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://thesystemsthinker.com/",
  },
  {
    id: "concept:human_ai_systems_symbiosis",
    nodeType: "Concept",
    title: "Human-AI Systems Symbiosis",
    summary: "Systemdenken erweitert sich auf ko-adaptive Mensch-KI-Systeme mit rekursiven Lern- und Steuerungsdynamiken.",
    shortDescription: "Kurz: Systemdenken erweitert sich auf ko-adaptive Mensch-KI-Systeme mit rekursiven Lern- und Steuerungsdynamiken.",
    longDescription: "Systemdenken erweitert sich auf ko-adaptive Mensch-KI-Systeme mit rekursiven Lern- und Steuerungsdynamiken. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.00478058, 0.2794535, 0.07097652, 0.95752037],
    url: "https://en.wikipedia.org/wiki/Human-AI_interaction",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://arxiv.org/abs/2509.05534",
  },
  {
    id: "concept:complex_adaptive_systems_thinking",
    nodeType: "Concept",
    title: "Complex Adaptive Systems Thinking",
    summary: "CAST betrachtet Systeme mit nichtlinearen Interaktionen, Adaptivitaet und emergentem Verhalten.",
    shortDescription: "Kurz: CAST betrachtet Systeme mit nichtlinearen Interaktionen, Adaptivitaet und emergentem Verhalten.",
    longDescription: "CAST betrachtet Systeme mit nichtlinearen Interaktionen, Adaptivitaet und emergentem Verhalten. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.1807477, 0.5864094, -0.15875734, 0.7734665],
    url: "https://en.wikipedia.org/wiki/Complex_adaptive_system",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was bedeutet CASTs.md",
  },
  {
    id: "concept:second_order_thinking",
    nodeType: "Concept",
    title: "Second Order Thinking",
    summary: "Second-Order Thinking bewertet direkte und indirekte Langzeitfolgen von Entscheidungen.",
    shortDescription: "Kurz: Second-Order Thinking bewertet direkte und indirekte Langzeitfolgen von Entscheidungen.",
    longDescription: "Second-Order Thinking bewertet direkte und indirekte Langzeitfolgen von Entscheidungen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [0.15885247, 0.12804022, -0.9410543, 0.26979312],
    url: "https://en.wikipedia.org/wiki/Second-order_logic",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Denken zweiter Ordnung.md",
  },
  {
    id: "concept:taxonomy_and_ontology_modeling",
    nodeType: "Concept",
    title: "Taxonomy and Ontology Modeling",
    summary: "Taxonomie und Ontologie ordnen Begriffe, Relationen und Klassen fuer konsistente Wissensmodelle.",
    shortDescription: "Kurz: Taxonomie und Ontologie ordnen Begriffe, Relationen und Klassen fuer konsistente Wissensmodelle.",
    longDescription: "Taxonomie und Ontologie ordnen Begriffe, Relationen und Klassen fuer konsistente Wissensmodelle. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.65805507, 0.51673603, -0.479563, -0.26451233],
    url: "https://en.wikipedia.org/wiki/Taxonomy",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Taxonomy und eine Ontologie zum Thema System Thinking.md",
  },
  {
    id: "concept:catwoe",
    nodeType: "Concept",
    title: "CATWOE",
    summary: "CATWOE strukturiert Perspektiven auf Problemkontexte ueber Kunden, Akteure und Transformation.",
    shortDescription: "Kurz: CATWOE strukturiert Perspektiven auf Problemkontexte ueber Kunden, Akteure und Transformation.",
    longDescription: "CATWOE strukturiert Perspektiven auf Problemkontexte ueber Kunden, Akteure und Transformation. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.629999, -0.02118525, -0.15070982, 0.76153725],
    url: "https://en.wikipedia.org/wiki/Soft_systems_methodology",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    id: "concept:network_analysis",
    nodeType: "Concept",
    title: "Network Analysis",
    summary: "Netzwerkanalyse identifiziert zentrale Knoten, Cluster und Flussmuster in komplexen Systemen.",
    shortDescription: "Kurz: Netzwerkanalyse identifiziert zentrale Knoten, Cluster und Flussmuster in komplexen Systemen.",
    longDescription: "Netzwerkanalyse identifiziert zentrale Knoten, Cluster und Flussmuster in komplexen Systemen. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.67242426, 0.13317963, -0.60039604, -0.4118659],
    url: "https://en.wikipedia.org/wiki/Social_network_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    id: "concept:mental_models",
    nodeType: "Concept",
    title: "Mental Models",
    summary: "Mentale Modelle sind übertragbare Denkwerkzeuge zur strukturierten Bewertung komplexer Situationen.",
    shortDescription: "Kurz: Mentale Modelle sind übertragbare Denkwerkzeuge zur strukturierten Bewertung komplexer Situationen.",
    longDescription: "Mentale Modelle sind übertragbare Denkwerkzeuge zur strukturierten Bewertung komplexer Situationen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.26947838, 0.30214718, -0.9141007, 0.02254771],
    url: "https://en.wikipedia.org/wiki/Mental_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Mentale Modelle.md",
  },
  {
    id: "concept:pareto_principle",
    nodeType: "Concept",
    title: "Pareto Principle",
    summary: "Das 80/20-Prinzip fokussiert auf wenige Ursachen mit grossem Ergebniseffekt.",
    shortDescription: "Kurz: Das 80/20-Prinzip fokussiert auf wenige Ursachen mit grossem Ergebniseffekt.",
    longDescription: "Das 80/20-Prinzip fokussiert auf wenige Ursachen mit grossem Ergebniseffekt. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.72112995, 0.52022344, 0.3280288, 0.31896132],
    url: "https://en.wikipedia.org/wiki/Pareto_principle",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Das Pareto-Prinzip.md",
  },
  {
    id: "concept:scientific_method",
    nodeType: "Concept",
    title: "Scientific Method",
    summary: "Beobachtung, Hypothese, Experiment und Replikation verbessern Entscheidungsqualitaet und Lernzyklen.",
    shortDescription: "Kurz: Beobachtung, Hypothese, Experiment und Replikation verbessern Entscheidungsqualitaet und Lernzyklen.",
    longDescription: "Beobachtung, Hypothese, Experiment und Replikation verbessern Entscheidungsqualitaet und Lernzyklen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.26538172, 0.24834529, -0.72852635, 0.58064324],
    url: "https://en.wikipedia.org/wiki/Scientific_method",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Die wissenschaftliche Methode.md",
  },
  {
    id: "concept:delayed_gratification",
    nodeType: "Concept",
    title: "Delayed Gratification",
    summary: "Aufgeschobene Belohnung staerkt langfristige Zielverfolgung und robuste Entscheidungen.",
    shortDescription: "Kurz: Aufgeschobene Belohnung staerkt langfristige Zielverfolgung und robuste Entscheidungen.",
    longDescription: "Aufgeschobene Belohnung staerkt langfristige Zielverfolgung und robuste Entscheidungen. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [0.14861833, 0.26665363, -0.29673114, 0.9048531],
    url: "https://en.wikipedia.org/wiki/Delayed_gratification",
    sourceType: PRIMARY_MD,
    sourceFile: "Mentale Modelle/Verspätete Belohnung.md",
  },
  {
    id: "concept:system_archetypes",
    nodeType: "Concept",
    title: "System Archetypes",
    summary: "Systemarchetypen beschreiben wiederkehrende Strukturmuster mit typischen Dynamiken und Fehlentwicklungen.",
    shortDescription: "Kurz: Systemarchetypen beschreiben wiederkehrende Strukturmuster mit typischen Dynamiken und Fehlentwicklungen.",
    longDescription: "Systemarchetypen beschreiben wiederkehrende Strukturmuster mit typischen Dynamiken und Fehlentwicklungen. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.38448733, 0.90486026, -0.01384491, 0.18222445],
    url: "https://en.wikipedia.org/wiki/System_archetype",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://de.wikipedia.org/wiki/Systemarchetyp",
  },
  {
    id: "concept:archetype_limits_to_growth",
    nodeType: "Concept",
    title: "Archetype: Limits to Growth",
    summary: "Frühes Wachstum trifft auf begrenzende Faktoren und kippt ohne Gegenmassnahmen in Stagnation.",
    shortDescription: "Kurz: Frühes Wachstum trifft auf begrenzende Faktoren und kippt ohne Gegenmassnahmen in Stagnation.",
    longDescription: "Frühes Wachstum trifft auf begrenzende Faktoren und kippt ohne Gegenmassnahmen in Stagnation. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.10520001, 0.85184646, 0.50766134, -0.07463554],
    url: "https://en.wikipedia.org/wiki/The_Limits_to_Growth",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://systemsandus.com/archetypes/",
  },
  {
    id: "concept:archetype_fixes_that_fail",
    nodeType: "Concept",
    title: "Archetype: Fixes that Fail",
    summary: "Kurzfristige Loesungen lindern Symptome, erzeugen aber langfristig neue oder staerkere Probleme.",
    shortDescription: "Kurz: Kurzfristige Loesungen lindern Symptome, erzeugen aber langfristig neue oder staerkere Probleme.",
    longDescription: "Kurzfristige Loesungen lindern Symptome, erzeugen aber langfristig neue oder staerkere Probleme. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.48040983, 0.75288105, 0.38002568, 0.24074268],
    url: "https://en.wikipedia.org/wiki/Fixes_that_fail",
    sourceType: OPTIONAL_INTERNET,
    sourceFile: "https://www.community-of-knowledge.de/beitrag/systemarchetypen/",
  },
  {
    id: "tool:system_mapping",
    nodeType: "Tool",
    title: "Tool: System Mapping",
    summary: "System Mapping visualisiert Akteure, Grenzen, Beziehungen und Fluesse auf Systemebene.",
    shortDescription: "Kurz: System Mapping visualisiert Akteure, Grenzen, Beziehungen und Fluesse auf Systemebene.",
    longDescription: "System Mapping visualisiert Akteure, Grenzen, Beziehungen und Fluesse auf Systemebene. Sie hilft Teams, komplexe Zusammenhaenge sichtbar zu machen und Optionen nachvollziehbar zu vergleichen. Das verbessert Anschlussfaehigkeit zwischen Fachbereich, Produkt, Technik und Management.",
    embedding: [-0.6224541, 0.7590669, 0.1676393, 0.09091485],
    url: "https://en.wikipedia.org/wiki/Systems_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:rich_picture",
    nodeType: "Tool",
    title: "Tool: Rich Picture",
    summary: "Rich Pictures machen Problemkontext, Perspektiven und Spannungen visuell sichtbar.",
    shortDescription: "Kurz: Rich Pictures machen Problemkontext, Perspektiven und Spannungen visuell sichtbar.",
    longDescription: "Rich Pictures machen Problemkontext, Perspektiven und Spannungen visuell sichtbar. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen.",
    embedding: [-0.40227026, 0.24521953, -0.6378463, 0.6092603],
    url: "https://en.wikipedia.org/wiki/Soft_systems_methodology",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:stock_flow_diagram",
    nodeType: "Tool",
    title: "Tool: Stock and Flow Diagram",
    summary: "Stock-and-Flow-Diagramme modellieren Bestaende, Zu- und Abfluesse dynamischer Systeme.",
    shortDescription: "Kurz: Stock-and-Flow-Diagramme modellieren Bestaende, Zu- und Abfluesse dynamischer Systeme.",
    longDescription: "Stock-and-Flow-Diagramme modellieren Bestaende, Zu- und Abfluesse dynamischer Systeme. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess.",
    embedding: [-0.23970498, 0.7290851, -0.61112833, -0.19364567],
    url: "https://en.wikipedia.org/wiki/Flow_diagram",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:behavior_over_time",
    nodeType: "Tool",
    title: "Tool: Behavior Over Time Graph",
    summary: "Zeitverlaufsgrafiken zeigen Muster, Trends und Verzogerungen in Systemverhalten.",
    shortDescription: "Kurz: Zeitverlaufsgrafiken zeigen Muster, Trends und Verzogerungen in Systemverhalten.",
    longDescription: "Zeitverlaufsgrafiken zeigen Muster, Trends und Verzogerungen in Systemverhalten. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen.",
    embedding: [-0.2923974, 0.90941924, -0.29401612, -0.0318591],
    url: "https://en.wikipedia.org/wiki/System_dynamics",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:system_archetypes",
    nodeType: "Tool",
    title: "Tool: System Archetypes",
    summary: "System-Archetypen helfen wiederkehrende Problemstrukturen und Hebel zu erkennen.",
    shortDescription: "Kurz: System-Archetypen helfen wiederkehrende Problemstrukturen und Hebel zu erkennen.",
    longDescription: "System-Archetypen helfen wiederkehrende Problemstrukturen und Hebel zu erkennen. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess.",
    embedding: [-0.6959763, 0.5147079, -0.30414557, 0.39772886],
    url: "https://en.wikipedia.org/wiki/System_archetype",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:systemigram",
    nodeType: "Tool",
    title: "Tool: Systemigram",
    summary: "Systemigramme bilden narrative Kausalketten und Wechselwirkungen in komplexen Lagen ab.",
    shortDescription: "Kurz: Systemigramme bilden narrative Kausalketten und Wechselwirkungen in komplexen Lagen ab.",
    longDescription: "Systemigramme bilden narrative Kausalketten und Wechselwirkungen in komplexen Lagen ab. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.48818803, 0.7356611, -0.4585814, -0.1008879],
    url: "https://en.wikipedia.org/wiki/Systemigram",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:stakeholder_map",
    nodeType: "Tool",
    title: "Tool: Stakeholder Map",
    summary: "Stakeholder-Maps strukturieren Einfluss, Interessen und Konfliktlinien im System.",
    shortDescription: "Kurz: Stakeholder-Maps strukturieren Einfluss, Interessen und Konfliktlinien im System.",
    longDescription: "Stakeholder-Maps strukturieren Einfluss, Interessen und Konfliktlinien im System. Sie hilft Teams, komplexe Zusammenhaenge sichtbar zu machen und Optionen nachvollziehbar zu vergleichen. Das verbessert Anschlussfaehigkeit zwischen Fachbereich, Produkt, Technik und Management.",
    embedding: [-0.5960509, 0.72978324, 0.01904307, 0.3343308],
    url: "https://en.wikipedia.org/wiki/Stakeholder_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:scenario_planning",
    nodeType: "Tool",
    title: "Tool: Scenario Planning",
    summary: "Szenarioplanung erkundet robuste Entscheidungen fuer mehrere Zukunftspfade.",
    shortDescription: "Kurz: Szenarioplanung erkundet robuste Entscheidungen fuer mehrere Zukunftspfade.",
    longDescription: "Szenarioplanung erkundet robuste Entscheidungen fuer mehrere Zukunftspfade. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess.",
    embedding: [-0.5613083, 0.17628044, 0.77833587, -0.21920657],
    url: "https://en.wikipedia.org/wiki/Scenario_planning",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:modeling_software",
    nodeType: "Tool",
    title: "Tool: Modeling Software",
    summary: "Modellierungssoftware unterstuetzt Simulation, Sensitivitaetsanalyse und Teamkommunikation.",
    shortDescription: "Kurz: Modellierungssoftware unterstuetzt Simulation, Sensitivitaetsanalyse und Teamkommunikation.",
    longDescription: "Modellierungssoftware unterstuetzt Simulation, Sensitivitaetsanalyse und Teamkommunikation. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.152566, 0.586085, -0.7737276, -0.18593982],
    url: "https://en.wikipedia.org/wiki/System_dynamics",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Modellierungssoftware.md",
  },
  {
    id: "tool:causal_layered_analysis",
    nodeType: "Tool",
    title: "Tool: Causal Layered Analysis",
    summary: "CLA verbindet Ereignisse, systemische Ursachen, Weltbilder und Narrativebenen.",
    shortDescription: "Kurz: CLA verbindet Ereignisse, systemische Ursachen, Weltbilder und Narrativebenen.",
    longDescription: "CLA verbindet Ereignisse, systemische Ursachen, Weltbilder und Narrativebenen. Sie hilft Teams, komplexe Zusammenhaenge sichtbar zu machen und Optionen nachvollziehbar zu vergleichen. Das verbessert Anschlussfaehigkeit zwischen Fachbereich, Produkt, Technik und Management.",
    embedding: [-0.6228876, 0.65743345, -0.37123466, -0.20488326],
    url: "https://en.wikipedia.org/wiki/Causal_layered_analysis",
    sourceType: PRIMARY_MD,
    sourceFile: "Tools/Tools.md",
  },
  {
    id: "tool:iceberg_model",
    nodeType: "Tool",
    title: "Tool: Iceberg Model",
    summary: "Das Iceberg Model verbindet Ereignisse mit Mustern, Strukturen und mentalen Modellen.",
    shortDescription: "Kurz: Das Iceberg Model verbindet Ereignisse mit Mustern, Strukturen und mentalen Modellen.",
    longDescription: "Das Iceberg Model verbindet Ereignisse mit Mustern, Strukturen und mentalen Modellen. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess.",
    embedding: [-0.8282937, 0.41103998, -0.24994834, 0.28723088],
    url: "https://en.wikipedia.org/wiki/Iceberg",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "tool:causal_loop_diagram",
    nodeType: "Tool",
    title: "Tool: Causal Loop Diagram",
    summary: "CLDs zeigen verstaerkende und ausgleichende Rueckkopplungsschleifen im System.",
    shortDescription: "Kurz: CLDs zeigen verstaerkende und ausgleichende Rueckkopplungsschleifen im System.",
    longDescription: "CLDs zeigen verstaerkende und ausgleichende Rueckkopplungsschleifen im System. Sie hilft Teams, komplexe Zusammenhaenge sichtbar zu machen und Optionen nachvollziehbar zu vergleichen. Das verbessert Anschlussfaehigkeit zwischen Fachbereich, Produkt, Technik und Management.",
    embedding: [-0.49555582, 0.59684527, -0.6093703, 0.16391462],
    url: "https://en.wikipedia.org/wiki/Causal_loop_diagram",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    id: "tool:viable_system_model",
    nodeType: "Tool",
    title: "Tool: Viable System Model",
    summary: "Das VSM strukturiert Steuerung, Koordination und Anpassungsfaehigkeit komplexer Organisationen.",
    shortDescription: "Kurz: Das VSM strukturiert Steuerung, Koordination und Anpassungsfaehigkeit komplexer Organisationen.",
    longDescription: "Das VSM strukturiert Steuerung, Koordination und Anpassungsfaehigkeit komplexer Organisationen. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.37798056, 0.8154136, -0.43354577, -0.06534056],
    url: "https://en.wikipedia.org/wiki/Viable_system_model",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "tool:heuristics_catalog",
    nodeType: "Tool",
    title: "Tool: Heuristics Catalog",
    summary: "Ein Heuristik-Katalog hilft bei schnellen Entscheidungen unter Unsicherheit und Zeitdruck.",
    shortDescription: "Kurz: Ein Heuristik-Katalog hilft bei schnellen Entscheidungen unter Unsicherheit und Zeitdruck.",
    longDescription: "Ein Heuristik-Katalog hilft bei schnellen Entscheidungen unter Unsicherheit und Zeitdruck. Sie hilft Teams, komplexe Zusammenhaenge sichtbar zu machen und Optionen nachvollziehbar zu vergleichen. Das verbessert Anschlussfaehigkeit zwischen Fachbereich, Produkt, Technik und Management. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.7106133, -0.08851957, -0.68543166, 0.1318197],
    url: "https://en.wikipedia.org/wiki/Heuristic",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "tool:emergence_lens",
    nodeType: "Tool",
    title: "Tool: Emergence Lens",
    summary: "Die Emergenz-Linse fokussiert auf neue Eigenschaften, die aus Interaktionen vieler Teile entstehen.",
    shortDescription: "Kurz: Die Emergenz-Linse fokussiert auf neue Eigenschaften, die aus Interaktionen vieler Teile entstehen.",
    longDescription: "Die Emergenz-Linse fokussiert auf neue Eigenschaften, die aus Interaktionen vieler Teile entstehen. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.18497248, 0.8518107, -0.19379382, 0.45016402],
    url: "https://en.wikipedia.org/wiki/Emergence",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Was ist Emergence.md",
  },
  {
    id: "tool:boundary_analysis",
    nodeType: "Tool",
    title: "Tool: Boundary Analysis",
    summary: "Boundary Analysis macht sichtbar, was innerhalb und ausserhalb der Systembetrachtung liegt.",
    shortDescription: "Kurz: Boundary Analysis macht sichtbar, was innerhalb und ausserhalb der Systembetrachtung liegt.",
    longDescription: "Boundary Analysis macht sichtbar, was innerhalb und ausserhalb der Systembetrachtung liegt. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.36732653, 0.55761003, 0.13325517, 0.7323833],
    url: "https://en.wikipedia.org/wiki/System_boundary",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "tool:soft_systems_methodology",
    nodeType: "Tool",
    title: "Tool: Soft Systems Methodology",
    summary: "SSM verbindet Rich Pictures, Root Definitions und iterative Verbesserungen in weichen Problemlagen.",
    shortDescription: "Kurz: SSM verbindet Rich Pictures, Root Definitions und iterative Verbesserungen in weichen Problemlagen.",
    longDescription: "SSM verbindet Rich Pictures, Root Definitions und iterative Verbesserungen in weichen Problemlagen. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.18827248, 0.8342804, -0.23302315, 0.46284983],
    url: "https://en.wikipedia.org/wiki/Soft_systems_methodology",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    id: "tool:network_visualization",
    nodeType: "Tool",
    title: "Tool: Network Visualization",
    summary: "Netzwerkvisualisierung macht Knoten-Kanten-Strukturen, Cluster und Zentralitaet sichtbar.",
    shortDescription: "Kurz: Netzwerkvisualisierung macht Knoten-Kanten-Strukturen, Cluster und Zentralitaet sichtbar.",
    longDescription: "Netzwerkvisualisierung macht Knoten-Kanten-Strukturen, Cluster und Zentralitaet sichtbar. Die Methode erzeugt ein gemeinsames Arbeitsartefakt, das Diskussionen strukturiert und Annahmen explizit macht. Dadurch wird aus Bauchgefuehl ein systematisch begruendeter Entscheidungsprozess. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.90128064, 0.2500573, -0.29486692, -0.19549422],
    url: "https://en.wikipedia.org/wiki/Graph_drawing",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Netzwerk Visualisierungen.md",
  },
  {
    id: "tool:scenario_analysis",
    nodeType: "Tool",
    title: "Tool: Scenario Analysis",
    summary: "Szenarioanalyse beschreibt alternative Zukunftsbilder fuer robuste Entscheidungen unter Unsicherheit.",
    shortDescription: "Kurz: Szenarioanalyse beschreibt alternative Zukunftsbilder fuer robuste Entscheidungen unter Unsicherheit.",
    longDescription: "Szenarioanalyse beschreibt alternative Zukunftsbilder fuer robuste Entscheidungen unter Unsicherheit. Durch die Anwendung werden blinde Flecken in Problemdefinition, Datenlage und Zielsetzung schneller erkennbar. So steigt die Chance, wirksame statt nur schnelle Massnahmen umzusetzen. In der Anwendung schafft das ein gemeinsames Verstaendnis zwischen Beteiligten und verbessert die Nachvollziehbarkeit von Entscheidungen.",
    embedding: [-0.58011585, 0.6893717, -0.42683157, -0.07776324],
    url: "https://en.wikipedia.org/wiki/Scenario_planning",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    id: "problem:local_optimization",
    nodeType: "Problem",
    title: "Local Optimization",
    summary: "Optimierung einzelner Teile verschlechtert in komplexen Systemen die Gesamtleistung.",
    shortDescription: "Kurz: Optimierung einzelner Teile verschlechtert in komplexen Systemen die Gesamtleistung.",
    longDescription: "Lokale Optimierung fuehrt oft dazu, dass Teilbereiche gewinnen, waehrend die Gesamtleistung sinkt. Ohne Gegensteuerung steigt die Wahrscheinlichkeit fuer Folgekosten, Reibung und Zielkonflikte. Ziel ist, das Muster dauerhaft zu unterbrechen statt Symptome zyklisch zu behandeln.",
    embedding: [0.29485738, 0.8160699, 0.32251355, 0.37825137],
    url: "https://en.wikipedia.org/wiki/Local_search_(optimization)",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    id: "problem:linear_problem_framing",
    nodeType: "Problem",
    title: "Linear Problem Framing",
    summary: "Lineares Denken unterschlaegt Rueckkopplungen und Nebenwirkungen in Systemen.",
    shortDescription: "Kurz: Lineares Denken unterschlaegt Rueckkopplungen und Nebenwirkungen in Systemen.",
    longDescription: "Lineare Problemdeutung blendet Rueckkopplungen und Verzoegerungen aus und produziert zu einfache Loesungen. Ohne Gegensteuerung steigt die Wahrscheinlichkeit fuer Folgekosten, Reibung und Zielkonflikte. Ziel ist, das Muster dauerhaft zu unterbrechen statt Symptome zyklisch zu behandeln.",
    embedding: [-0.714363, 0.41459438, 0.11134437, 0.55262965],
    url: "https://en.wikipedia.org/wiki/Frame_problem",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    id: "problem:symptom_fixing",
    nodeType: "Problem",
    title: "Symptom Fixing",
    summary: "Reine Ereignisreaktion ohne Strukturursachen fuhrt zu wiederkehrenden Problemen.",
    shortDescription: "Kurz: Reine Ereignisreaktion ohne Strukturursachen fuhrt zu wiederkehrenden Problemen.",
    longDescription: "Symptomorientierte Eingriffe schaffen kurzfristige Entlastung, ohne strukturelle Ursachen zu veraendern. Das Problem ist strukturell, nicht nur operativ, und braucht deshalb mehr als lokale Korrekturen. Wirksame Gegenmassnahmen kombinieren kurzfristige Entlastung mit langfristiger Ursachenarbeit.",
    embedding: [-0.27621743, 0.4102924, -0.23780055, 0.8359515],
    url: "https://en.wikipedia.org/wiki/Troubleshooting",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    id: "problem:decision_bias_under_uncertainty",
    nodeType: "Problem",
    title: "Decision Bias Under Uncertainty",
    summary: "Heuristische Verzerrungen erschweren robuste Entscheidungen in dynamischen Umfeldern.",
    shortDescription: "Kurz: Heuristische Verzerrungen erschweren robuste Entscheidungen in dynamischen Umfeldern.",
    longDescription: "Unter Unsicherheit wirken Wahrnehmungs- und Entscheidungsbias besonders stark auf Prioritaeten und Massnahmen. Das Problem ist strukturell, nicht nur operativ, und braucht deshalb mehr als lokale Korrekturen. Wirksame Gegenmassnahmen kombinieren kurzfristige Entlastung mit langfristiger Ursachenarbeit.",
    embedding: [-0.21596946, -0.14611289, -0.20587406, 0.94319886],
    url: "https://en.wikipedia.org/wiki/Decision_theory",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    id: "problem:organizational_viability",
    nodeType: "Problem",
    title: "Organizational Viability",
    summary: "Organisationen verlieren Anpassungsfaehigkeit ohne balancierte Koordinationsebenen.",
    shortDescription: "Kurz: Organisationen verlieren Anpassungsfaehigkeit ohne balancierte Koordinationsebenen.",
    longDescription: "Organisationale Viabilitaet verlangt die Balance aus Tagesgeschaeft, Steuerung und langfristiger Erneuerung. Das Problem ist strukturell, nicht nur operativ, und braucht deshalb mehr als lokale Korrekturen. Wirksame Gegenmassnahmen kombinieren kurzfristige Entlastung mit langfristiger Ursachenarbeit.",
    embedding: [-0.00751915, 0.8164493, 0.49044934, 0.3046531],
    url: "https://en.wikipedia.org/wiki/Fetal_viability",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "concept:archetype_reactive_fix_trap",
    nodeType: "Concept",
    title: "System Archetype: Reactive Fix Trap",
    summary: "Kurzfristige Loesungen verschieben die Last und verstaerken spaeter das urspruengliche Problem.",
    shortDescription: "Kurz: Kurzfristige Loesungen verschieben die Last und verstaerken spaeter das urspruengliche Problem.",
    longDescription: "Kurzfristige Loesungen verschieben die Last und verstaerken spaeter das urspruengliche Problem. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.5253491, 0.7551392, 0.1317383, 0.36934847],
    url: "https://en.wikipedia.org/wiki/Hydrocodone%2Fparacetamol",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_shifting_the_burden",
    nodeType: "Concept",
    title: "System Archetype: Shifting the Burden",
    summary: "Symptomatische Eingriffe verdrängen nachhaltige Ursachenarbeit und erhoehen langfristige Abhaengigkeit.",
    shortDescription: "Kurz: Symptomatische Eingriffe verdrängen nachhaltige Ursachenarbeit und erhoehen langfristige Abhaengigkeit.",
    longDescription: "Symptomatische Eingriffe verdrängen nachhaltige Ursachenarbeit und erhoehen langfristige Abhaengigkeit. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.42221865, 0.50203246, 0.24116908, 0.71521485],
    url: "https://en.wikipedia.org/wiki/Burden_of_proof_(philosophy)",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_growth_friction_cycle",
    nodeType: "Concept",
    title: "System Archetype: Growth Friction Cycle",
    summary: "Verstaerkendes Wachstum trifft auf spaet wirksame Begrenzungen und kippt in Stagnation.",
    shortDescription: "Kurz: Verstaerkendes Wachstum trifft auf spaet wirksame Begrenzungen und kippt in Stagnation.",
    longDescription: "Verstaerkendes Wachstum trifft auf spaet wirksame Begrenzungen und kippt in Stagnation. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [-0.16281995, 0.8285168, 0.44917673, 0.29204422],
    url: "https://en.wikipedia.org/wiki/Earthquake_cycle",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_success_to_successful",
    nodeType: "Concept",
    title: "System Archetype: Success to the Successful",
    summary: "Ressourcenallokation bevorzugt bestehende Gewinner und vergroessert strukturelle Ungleichgewichte.",
    shortDescription: "Kurz: Ressourcenallokation bevorzugt bestehende Gewinner und vergroessert strukturelle Ungleichgewichte.",
    longDescription: "Ressourcenallokation bevorzugt bestehende Gewinner und vergroessert strukturelle Ungleichgewichte. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.14508648, 0.53993183, 0.76517284, 0.3192711],
    url: "https://en.wikipedia.org/wiki/Success",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_tragedy_commons",
    nodeType: "Concept",
    title: "System Archetype: Tragedy of the Commons",
    summary: "Individuelle Optimierung uebernutzt gemeinsame Ressourcen und untergraebt kollektive Stabilitaet.",
    shortDescription: "Kurz: Individuelle Optimierung uebernutzt gemeinsame Ressourcen und untergraebt kollektive Stabilitaet.",
    longDescription: "Individuelle Optimierung uebernutzt gemeinsame Ressourcen und untergraebt kollektive Stabilitaet. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.28777176, 0.65207857, 0.4575095, 0.5316634],
    url: "https://en.wikipedia.org/wiki/Tragedy_of_the_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_escalation",
    nodeType: "Concept",
    title: "System Archetype: Escalation",
    summary: "Reaktive Gegenmassnahmen zwischen Akteuren treiben gegenseitige Aufruestungsschleifen.",
    shortDescription: "Kurz: Reaktive Gegenmassnahmen zwischen Akteuren treiben gegenseitige Aufruestungsschleifen.",
    longDescription: "Reaktive Gegenmassnahmen zwischen Akteuren treiben gegenseitige Aufruestungsschleifen. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet.",
    embedding: [-0.06583631, 0.7797503, 0.5239736, 0.3363134],
    url: "https://en.wikipedia.org/wiki/Escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_eroding_goals",
    nodeType: "Concept",
    title: "System Archetype: Eroding Goals",
    summary: "Wiederholte Zielabsenkung kaschiert Leistungsdefizite und normalisiert sinkende Standards.",
    shortDescription: "Kurz: Wiederholte Zielabsenkung kaschiert Leistungsdefizite und normalisiert sinkende Standards.",
    longDescription: "Wiederholte Zielabsenkung kaschiert Leistungsdefizite und normalisiert sinkende Standards. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln.",
    embedding: [0.04161443, 0.8152368, 0.519348, 0.25285333],
    url: "https://en.wikipedia.org/wiki/System_archetype",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_growth_underinvestment",
    nodeType: "Concept",
    title: "System Archetype: Growth and Underinvestment",
    summary: "Nachfragewachstum ohne Kapazitaetsinvestition erzeugt Engpaesse und selbstverstaerkende Verschlechterung.",
    shortDescription: "Kurz: Nachfragewachstum ohne Kapazitaetsinvestition erzeugt Engpaesse und selbstverstaerkende Verschlechterung.",
    longDescription: "Nachfragewachstum ohne Kapazitaetsinvestition erzeugt Engpaesse und selbstverstaerkende Verschlechterung. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.01327812, 0.82653433, 0.53326774, 0.1796947],
    url: "https://en.wikipedia.org/wiki/Growth_and_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_accidental_adversaries",
    nodeType: "Concept",
    title: "System Archetype: Accidental Adversaries",
    summary: "Gut gemeinte lokale Anpassungen fuehren zu unbeabsichtigten Zielkonflikten zwischen Partnern.",
    shortDescription: "Kurz: Gut gemeinte lokale Anpassungen fuehren zu unbeabsichtigten Zielkonflikten zwischen Partnern.",
    longDescription: "Gut gemeinte lokale Anpassungen fuehren zu unbeabsichtigten Zielkonflikten zwischen Partnern. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.30410174, 0.62584853, 0.58228725, 0.4204489],
    url: "https://en.wikipedia.org/wiki/Accidental_Adversaries",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:archetype_attractiveness",
    nodeType: "Concept",
    title: "System Archetype: Attractiveness Principle",
    summary: "Ressourcen fließen kurzfristig in attraktive Felder und entziehen strukturell wichtige Grundlagenarbeit.",
    shortDescription: "Kurz: Ressourcen fließen kurzfristig in attraktive Felder und entziehen strukturell wichtige Grundlagenarbeit.",
    longDescription: "Ressourcen fließen kurzfristig in attraktive Felder und entziehen strukturell wichtige Grundlagenarbeit. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.41322, 0.77751756, 0.3040181, 0.36371514],
    url: "https://en.wikipedia.org/wiki/Attractiveness_principle",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    id: "concept:system_mapping",
    nodeType: "Concept",
    title: "System Mapping",
    summary: "System Mapping macht Akteure, Wechselwirkungen und Randbedingungen als Entscheidungsgrundlage sichtbar.",
    shortDescription: "Kurz: System Mapping macht Akteure, Wechselwirkungen und Randbedingungen als Entscheidungsgrundlage sichtbar.",
    longDescription: "System Mapping macht Akteure, Wechselwirkungen und Randbedingungen als Entscheidungsgrundlage sichtbar. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.5497356, 0.70036215, 0.4226765, 0.16919869],
    url: "https://en.wikipedia.org/wiki/Hexagonal_and_Grid_Mapping_System",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    id: "concept:boundary_critique",
    nodeType: "Concept",
    title: "Boundary Critique",
    summary: "Boundary Critique hinterfragt bewusst, welche Perspektiven im Modell eingeschlossen oder ausgeschlossen sind.",
    shortDescription: "Kurz: Boundary Critique hinterfragt bewusst, welche Perspektiven im Modell eingeschlossen oder ausgeschlossen sind.",
    longDescription: "Boundary Critique hinterfragt bewusst, welche Perspektiven im Modell eingeschlossen oder ausgeschlossen sind. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.14537205, 0.52715164, 0.2668623, 0.79357576],
    url: "https://en.wikipedia.org/wiki/Boundary_critique",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    id: "concept:feedback_delay_awareness",
    nodeType: "Concept",
    title: "Feedback Delay Awareness",
    summary: "Bewusstsein fuer Zeitverzoegerungen verhindert Fehldeutung kurzfristiger Signale als stabile Trends.",
    shortDescription: "Kurz: Bewusstsein fuer Zeitverzoegerungen verhindert Fehldeutung kurzfristiger Signale als stabile Trends.",
    longDescription: "Bewusstsein fuer Zeitverzoegerungen verhindert Fehldeutung kurzfristiger Signale als stabile Trends. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.20397401, 0.12386578, -0.7830779, 0.5743179],
    url: "https://en.wikipedia.org/wiki/Delayed_auditory_feedback",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    id: "concept:policy_counterdynamics",
    nodeType: "Concept",
    title: "Policy Counterdynamics",
    summary: "Interventionen scheitern, wenn Gegenreaktionen im Gesamtsystem staerker wirken als die beabsichtigte Steuerung.",
    shortDescription: "Kurz: Interventionen scheitern, wenn Gegenreaktionen im Gesamtsystem staerker wirken als die beabsichtigte Steuerung.",
    longDescription: "Interventionen scheitern, wenn Gegenreaktionen im Gesamtsystem staerker wirken als die beabsichtigte Steuerung. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.29322624, 0.44255257, 0.18037735, 0.8280275],
    url: "https://en.wikipedia.org/wiki/Policy_Counterdynamics",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    id: "concept:adaptive_capacity",
    nodeType: "Concept",
    title: "Adaptive Capacity",
    summary: "Adaptive Capacity beschreibt die systemische Faehigkeit, auf Stoerungen lernend und robust zu reagieren.",
    shortDescription: "Kurz: Adaptive Capacity beschreibt die systemische Faehigkeit, auf Stoerungen lernend und robust zu reagieren.",
    longDescription: "Adaptive Capacity beschreibt die systemische Faehigkeit, auf Stoerungen lernend und robust zu reagieren. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.2698916, 0.50146973, -0.15119264, 0.8079774],
    url: "https://en.wikipedia.org/wiki/Adaptive_capacity",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    id: "concept:multi_loop_learning",
    nodeType: "Concept",
    title: "Multi Loop Learning",
    summary: "Mehrschleifiges Lernen verbindet Ergebnisfeedback mit Reflexion ueber Regeln und Zielsetzungen.",
    shortDescription: "Kurz: Mehrschleifiges Lernen verbindet Ergebnisfeedback mit Reflexion ueber Regeln und Zielsetzungen.",
    longDescription: "Mehrschleifiges Lernen verbindet Ergebnisfeedback mit Reflexion ueber Regeln und Zielsetzungen. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.21664742, 0.8992452, -0.24357603, 0.29170638],
    url: "https://en.wikipedia.org/wiki/Active_learning_(machine_learning)",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    id: "concept:intervention_timing",
    nodeType: "Concept",
    title: "Intervention Timing",
    summary: "Wirksame Eingriffe haengen von zeitlicher Platzierung entlang Rueckkopplungsstrukturen ab.",
    shortDescription: "Kurz: Wirksame Eingriffe haengen von zeitlicher Platzierung entlang Rueckkopplungsstrukturen ab.",
    longDescription: "Wirksame Eingriffe haengen von zeitlicher Platzierung entlang Rueckkopplungsstrukturen ab. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign.",
    embedding: [-0.6443661, 0.39290613, 0.3631456, 0.5463903],
    url: "https://en.wikipedia.org/wiki/United_States_intervention_in_Syria",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    id: "concept:cross_scale_effects",
    nodeType: "Concept",
    title: "Cross Scale Effects",
    summary: "Entscheidungen auf Mikroebene koennen meso- und makroskopische Dynamiken unvorhergesehen verstaerken.",
    shortDescription: "Kurz: Entscheidungen auf Mikroebene koennen meso- und makroskopische Dynamiken unvorhergesehen verstaerken.",
    longDescription: "Entscheidungen auf Mikroebene koennen meso- und makroskopische Dynamiken unvorhergesehen verstaerken. Entscheidend ist die Betrachtung ueber Zeit, weil Ursachen und Wirkungen meist nicht gleichzeitig auftreten. So lassen sich Nebenwirkungen frueher erkennen und robuste Handlungsoptionen entwickeln. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.5604306, 0.22748247, 0.4711312, 0.6420317],
    url: "https://en.wikipedia.org/wiki/Network_effect",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    id: "concept:structural_drift",
    nodeType: "Concept",
    title: "Structural Drift",
    summary: "Kleine lokale Anpassungen koennen schleichend in eine strategisch unguenstige Systemarchitektur fuehren.",
    shortDescription: "Kurz: Kleine lokale Anpassungen koennen schleichend in eine strategisch unguenstige Systemarchitektur fuehren.",
    longDescription: "Kleine lokale Anpassungen koennen schleichend in eine strategisch unguenstige Systemarchitektur fuehren. Der Mehrwert liegt darin, wiederkehrende Muster hinter einzelnen Ereignissen sichtbar zu machen. Damit werden Entscheidungen weniger reaktiv und besser auf strukturelle Ursachen ausgerichtet. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [0.01724407, 0.75653297, 0.6009319, 0.25737417],
    url: "https://en.wikipedia.org/wiki/Drift_pin",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    id: "concept:coordination_overhead",
    nodeType: "Concept",
    title: "Coordination Overhead",
    summary: "Steigende Kopplung und Abstimmungskosten koennen den Nutzen neuer Interventionspfade neutralisieren.",
    shortDescription: "Kurz: Steigende Kopplung und Abstimmungskosten koennen den Nutzen neuer Interventionspfade neutralisieren.",
    longDescription: "Steigende Kopplung und Abstimmungskosten koennen den Nutzen neuer Interventionspfade neutralisieren. Typisch sind nichtlineare Effekte, bei denen kleine Eingriffe grosse Folgewirkungen ausloesen koennen. In der Praxis verbessert das die Qualitaet von Priorisierung, Ursachenanalyse und Interventionsdesign. Dieser Blick hilft, Wechselwirkungen, Zeitverzoegerungen und Zielkonflikte gemeinsam zu bewerten, statt isolierte Einzelmassnahmen zu priorisieren.",
    embedding: [-0.26671395, 0.04403892, 0.8637563, 0.4252638],
    url: "https://en.wikipedia.org/wiki/IEEE_802.11bn",
    sourceType: PRIMARY_MD,
    sourceFile: "Systemisches Denken in Softwareentwicklung.md",
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
    type: "WROTE",
    fromNodeId: "author:russell_ackoff",
    toNodeId: "book:system_thinking_tools",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "WROTE",
    fromNodeId: "author:lisa_moritz",
    toNodeId: "book:learning_systems_thinking",
    sourceType: PRIMARY_MD,
    sourceFile: "Learning Systems Thinking with Diana Montalion and Lisa Moritz.md",
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
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_fixes_that_fail",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_shifting_the_burden",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_limits_to_growth",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_success_to_successful",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_tragedy_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_eroding_goals",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_growth_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_accidental_adversaries",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:archetype_attractiveness",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:system_mapping",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:boundary_critique",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:feedback_delay_awareness",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:thinking_in_systems",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:adaptive_capacity",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:multi_loop_learning",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:intervention_timing",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:cross_scale_effects",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:structural_drift",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "EXPLAINS",
    fromNodeId: "book:learning_systems_thinking",
    toNodeId: "concept:coordination_overhead",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_fixes_that_fail",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_shifting_the_burden",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_limits_to_growth",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_success_to_successful",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_tragedy_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_eroding_goals",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_growth_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_accidental_adversaries",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:local_optimization",
    toNodeId: "concept:archetype_attractiveness",
    sourceType: PRIMARY_MD,
    sourceFile: "Systems Thinking Speech by Dr. Russell Ackoff.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:linear_problem_framing",
    toNodeId: "concept:system_mapping",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:linear_problem_framing",
    toNodeId: "concept:boundary_critique",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:linear_problem_framing",
    toNodeId: "concept:feedback_delay_awareness",
    sourceType: PRIMARY_MD,
    sourceFile: "Books/Book Learning Systems Thinking.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:symptom_fixing",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:symptom_fixing",
    toNodeId: "concept:adaptive_capacity",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Iceberg Model.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:decision_bias_under_uncertainty",
    toNodeId: "concept:multi_loop_learning",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:decision_bias_under_uncertainty",
    toNodeId: "concept:intervention_timing",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Heuristics.md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:organizational_viability",
    toNodeId: "concept:cross_scale_effects",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:organizational_viability",
    toNodeId: "concept:structural_drift",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "RELATES_TO",
    fromNodeId: "problem:organizational_viability",
    toNodeId: "concept:coordination_overhead",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_fixes_that_fail",
    toNodeId: "concept:archetype_shifting_the_burden",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_reactive_fix_trap",
    toNodeId: "concept:archetype_shifting_the_burden",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_shifting_the_burden",
    toNodeId: "concept:archetype_limits_to_growth",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_growth_friction_cycle",
    toNodeId: "concept:archetype_growth_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_limits_to_growth",
    toNodeId: "concept:archetype_success_to_successful",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_success_to_successful",
    toNodeId: "concept:archetype_tragedy_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_tragedy_commons",
    toNodeId: "concept:archetype_escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_escalation",
    toNodeId: "concept:archetype_eroding_goals",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_eroding_goals",
    toNodeId: "concept:archetype_growth_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_growth_underinvestment",
    toNodeId: "concept:archetype_accidental_adversaries",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_accidental_adversaries",
    toNodeId: "concept:archetype_attractiveness",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:archetype_attractiveness",
    toNodeId: "concept:system_mapping",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:system_mapping",
    toNodeId: "concept:boundary_critique",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:boundary_critique",
    toNodeId: "concept:feedback_delay_awareness",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:feedback_delay_awareness",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:policy_counterdynamics",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:policy_resistance",
    toNodeId: "concept:adaptive_capacity",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:adaptive_capacity",
    toNodeId: "concept:multi_loop_learning",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:multi_loop_learning",
    toNodeId: "concept:intervention_timing",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:intervention_timing",
    toNodeId: "concept:cross_scale_effects",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:cross_scale_effects",
    toNodeId: "concept:structural_drift",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
  {
    type: "INFLUENCES",
    fromNodeId: "concept:structural_drift",
    toNodeId: "concept:coordination_overhead",
    sourceType: PRIMARY_MD,
    sourceFile: "Die Angemessenheit von Komplexität.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_fixes_that_fail",
    toNodeId: "concept:archetype_limits_to_growth",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_shifting_the_burden",
    toNodeId: "concept:archetype_success_to_successful",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_limits_to_growth",
    toNodeId: "concept:archetype_tragedy_commons",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_success_to_successful",
    toNodeId: "concept:archetype_escalation",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_tragedy_commons",
    toNodeId: "concept:archetype_eroding_goals",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_escalation",
    toNodeId: "concept:archetype_growth_underinvestment",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_eroding_goals",
    toNodeId: "concept:archetype_accidental_adversaries",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_growth_underinvestment",
    toNodeId: "concept:archetype_attractiveness",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_accidental_adversaries",
    toNodeId: "concept:system_mapping",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:archetype_attractiveness",
    toNodeId: "concept:boundary_critique",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in systems eine Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:system_mapping",
    toNodeId: "concept:feedback_delay_awareness",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/CLDs - Causal Loop Diagrams.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:boundary_critique",
    toNodeId: "concept:policy_resistance",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/SSM - Soft Systems Methodology.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:feedback_delay_awareness",
    toNodeId: "concept:adaptive_capacity",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Kapitel Zusammenfassung.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:policy_resistance",
    toNodeId: "concept:multi_loop_learning",
    sourceType: PRIMARY_MD,
    sourceFile: "Thinking in Systems/Lesenotizen - Think in Systems.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:adaptive_capacity",
    toNodeId: "concept:intervention_timing",
    sourceType: PRIMARY_MD,
    sourceFile: "Konzepte/Viable System Model (VSM).md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:multi_loop_learning",
    toNodeId: "concept:cross_scale_effects",
    sourceType: PRIMARY_MD,
    sourceFile: "Kritisches Denken.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:intervention_timing",
    toNodeId: "concept:structural_drift",
    sourceType: PRIMARY_MD,
    sourceFile: "Methoden/Was sind Szenarien.md",
  },
  {
    type: "CONTRASTS_WITH",
    fromNodeId: "concept:cross_scale_effects",
    toNodeId: "concept:coordination_overhead",
    sourceType: PRIMARY_MD,
    sourceFile: "System Thinking.md",
  },
];

const ALLOWED_SOURCE_TYPES: SeedSourceType[] = ["primary_md", "optional_internet"];

/**
 * Zweck:
 * Prueft, ob ein String ein zulaessiger SeedSourceType ist.
 *
 * Input:
 * - sourceType: beliebiger String
 *
 * Output:
 * - Type Guard auf SeedSourceType
 *
 * Fehlerfall:
 * - Kein Throw; liefert false bei ungueltigem Wert
 *
 * Beispiel:
 * - isValidSourceType("primary_md") === true
 */
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

function normalizeShortDescription(node: RawSeedNode): string {
  if (typeof node.shortDescription === "string" && node.shortDescription.trim().length > 0) {
    return node.shortDescription.trim();
  }
  return node.summary.trim();
}

function normalizeLongDescription(node: RawSeedNode, shortDescription: string): string {
  const preferred =
    typeof node.longDescription === "string" && node.longDescription.trim().length > 0
      ? node.longDescription.trim()
      : node.summary.trim();
  const minLength = shortDescription.length * MIN_LONG_TO_SHORT_DESCRIPTION_RATIO;
  if (preferred.length >= minLength) {
    return preferred;
  }
  return growDescriptionToMinLength(preferred, minLength);
}

function growDescriptionToMinLength(seedText: string, minLength: number): string {
  const trimmed = seedText.trim();
  if (!trimmed) {
    return trimmed;
  }
  let result = trimmed;
  while (result.length < minLength) {
    result = `${result} ${trimmed}`;
  }
  return result;
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
    nodes: NODES.map((node) => {
      const shortDescription = normalizeShortDescription(node);
      const longDescription = normalizeLongDescription(node, shortDescription);

      return {
        ...node,
        shortDescription,
        longDescription,
        internalSource: {
          sourceType: node.sourceType,
          sourceFile: node.sourceFile,
        },
        publicReference: createPublicReference(node.sourceFile, node.sourceType),
      };
    }),
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
    if (typeof node.url !== "string" || node.url.trim().length === 0) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld url.`);
    }
    if (typeof node.shortDescription !== "string" || node.shortDescription.trim().length === 0) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld shortDescription.`);
    }
    if (typeof node.longDescription !== "string" || node.longDescription.trim().length === 0) {
      errors.push(`Node ${node.id} hat leeres Pflichtfeld longDescription.`);
    }
    if (
      typeof node.shortDescription === "string" &&
      typeof node.longDescription === "string" &&
      node.longDescription.trim().length <
        node.shortDescription.trim().length * MIN_LONG_TO_SHORT_DESCRIPTION_RATIO
    ) {
      errors.push(
        `Node ${node.id} verletzt Ratio longDescription>=${MIN_LONG_TO_SHORT_DESCRIPTION_RATIO}x shortDescription.`,
      );
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
