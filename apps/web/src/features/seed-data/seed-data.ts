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
    longDescription: "Donella Meadows steht fuer autorin von thinking in systems und zentrale referenz fuer systemdynamik. Der Knoten ordnet den Beitrag dieser Person ein und macht nachvollziehbar, welche Denkfiguren sie fuer Analyse und Intervention bereitstellt. Fuer Donella Meadows steht damit nicht nur ein Name, sondern ein klarer fachlicher Beitrag zur Systempraxis im Vordergrund. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Russell Ackoff steht fuer systemtheoretiker mit fokus auf gesamtleistung statt teiloptimierung. Der Knoten ordnet den Beitrag dieser Person ein und macht nachvollziehbar, welche Denkfiguren sie fuer Analyse und Intervention bereitstellt. Fuer Russell Ackoff steht damit nicht nur ein Name, sondern ein klarer fachlicher Beitrag zur Systempraxis im Vordergrund. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Diana Montalion steht fuer systemarchitektin mit fokus auf nicht-lineares denken in softwaresystemen. Der Knoten ordnet den Beitrag dieser Person ein und macht nachvollziehbar, welche Denkfiguren sie fuer Analyse und Intervention bereitstellt. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Fuer Diana Montalion steht damit nicht nur ein Name, sondern ein klarer fachlicher Beitrag zur Systempraxis im Vordergrund.",
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
    longDescription: "Lisa Moritz steht fuer mitwirkende stimme im lernkontext zu system thinking in der softwarepraxis. Der Knoten ordnet den Beitrag dieser Person ein und macht nachvollziehbar, welche Denkfiguren sie fuer Analyse und Intervention bereitstellt. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Fuer Lisa Moritz steht damit nicht nur ein Name, sondern ein klarer fachlicher Beitrag zur Systempraxis im Vordergrund.",
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
    longDescription: "Stafford Beer steht fuer kybernetiker und urheber des viable system model. Der Knoten ordnet den Beitrag dieser Person ein und macht nachvollziehbar, welche Denkfiguren sie fuer Analyse und Intervention bereitstellt. Fuer Stafford Beer steht damit nicht nur ein Name, sondern ein klarer fachlicher Beitrag zur Systempraxis im Vordergrund. Die Perspektive orientiert sich an Viabilitaet, Steuerung und Anpassungsfaehigkeit von Organisationen.",
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
    longDescription: "Thinking in Systems: A Primer steht fuer grundlagenwerk zu rueckkopplung, dynamik und systemgrenzen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten beschreibt den fachlichen Rahmen der Quelle und wofuer sie bei Begriffsbildung, Diagnose und Entscheidungsarbeit genutzt wird. Zu Thinking in Systems: A Primer dient der Knoten als Referenzanker fuer Definitionen, Beispiele und begruendete Ableitungen.",
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
    longDescription: "Learning Systems Thinking steht fuer praxisorientierter leitfaden fuer systemdenken in modernen informationssystemen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten beschreibt den fachlichen Rahmen der Quelle und wofuer sie bei Begriffsbildung, Diagnose und Entscheidungsarbeit genutzt wird. Zu Learning Systems Thinking dient der Knoten als Referenzanker fuer Definitionen, Beispiele und begruendete Ableitungen.",
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
    longDescription: "General System Theory steht fuer klassische theoretische grundlage fuer interdisziplinaeres systemverstaendnis. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten beschreibt den fachlichen Rahmen der Quelle und wofuer sie bei Begriffsbildung, Diagnose und Entscheidungsarbeit genutzt wird. Zu General System Theory dient der Knoten als Referenzanker fuer Definitionen, Beispiele und begruendete Ableitungen.",
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
    longDescription: "System Thinking Tools steht fuer werkzeugsammlung fuer diagnose, visualisierung und intervention in komplexen systemen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten beschreibt den fachlichen Rahmen der Quelle und wofuer sie bei Begriffsbildung, Diagnose und Entscheidungsarbeit genutzt wird. Zu System Thinking Tools dient der Knoten als Referenzanker fuer Definitionen, Beispiele und begruendete Ableitungen.",
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
    longDescription: "Feedback Loops steht fuer rueckkopplungsschleifen erklaeren dynamische verstaerkung und stabilisierung. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Feedback Loops hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Interdependence steht fuer systemelemente sind wechselseitig abhaengig und wirken nicht isoliert. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Interdependence hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Boundaries steht fuer abgrenzung des betrachteten systems steuert fokus und entscheidungsspielraum. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Boundaries hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Whole System View steht fuer ganzheitliche sicht verhindert lokale optimierung auf kosten des gesamtsystems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Whole System View hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Critical Thinking steht fuer systematische analyse von annahmen und argumenten fuer belastbare schlussfolgerungen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Critical Thinking hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Emergence steht fuer systemeigenschaften entstehen aus interaktionen und sind nicht auf teile reduzierbar. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Emergence hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Viable System Model steht fuer modell fuer anpassungsfaehige, langfristig lebensfaehige organisationen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Viable System Model hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Perspektive orientiert sich an Viabilitaet, Steuerung und Anpassungsfaehigkeit von Organisationen.",
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
    longDescription: "Heuristics steht fuer pragmatische entscheidungsregeln fuer unsicherheit bei begrenzter information. Der Fokus liegt auf praktischen Entscheidungsregeln unter Unsicherheit und Zeitdruck. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Heuristics hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Causal Loop Diagrams steht fuer visualisierung von ursache-wirkungs-beziehungen und rueckkopplungen im system. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Wirkungen werden als Rueckkopplungsschleifen statt als lineare Ketten betrachtet. Causal Loop Diagrams hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Iceberg Model steht fuer unterscheidung zwischen sichtbaren ereignissen und tieferen strukturursachen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Iceberg Model hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung folgt der Trennung von Ereignis-, Muster-, Struktur- und Annahmeebene.",
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
    longDescription: "Non Linear Thinking steht fuer nicht-lineare zusammenhaenge helfen bei architekturentscheidungen unter dynamik. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Non Linear Thinking hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Systemic Complexity steht fuer komplexitaet ist angemessen zu behandeln statt durch lineare modelle zu vereinfachen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Systemic Complexity hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Stocks and Flows steht fuer bestaende und fluesse erklaeren zeitverzoegertes verhalten in dynamischen systemen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Stocks and Flows hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Balancing Feedback steht fuer ausgleichende rueckkopplung stabilisiert systeme um einen zielzustand. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Balancing Feedback hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Reinforcing Feedback steht fuer verstaerkende rueckkopplung erzeugt wachstum oder eskalation in systemen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Reinforcing Feedback hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Resilience steht fuer resilienz beschreibt die faehigkeit eines systems, stoerungen zu absorbieren. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Resilience hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Self Organization steht fuer selbstorganisation erlaubt systemen, neue strukturen ohne zentrale steuerung zu bilden. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Self Organization hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Traps steht fuer wiederkehrende dynamiken wie tragedy of the commons oder escalation verschlechtern systeme. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Traps hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Leverage Points steht fuer hebelpunkte sind eingriffspunkte mit ueberproportionaler systemwirkung. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Leverage Points hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Policy Resistance steht fuer policy resistance entsteht, wenn teilsysteme interventionen gegeneinander ausgleichen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Policy Resistance hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Pattern Thinking steht fuer pattern thinking identifiziert wiederkehrende strukturmuster hinter beobachteten ereignissen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Pattern Thinking hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Systems Leadership steht fuer systems leadership gestaltet kommunikations- und entscheidungsstrukturen fuer komplexe umfelder. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Systems Leadership hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Trap: Tragedy of the Commons steht fuer gemeinsame ressourcen werden uebernutzt, wenn kosten externalisiert bleiben. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Trap: Tragedy of the Commons hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Trap: Escalation steht fuer gegenseitige ueberbietung fuehrt zu selbstverstaerkender konfliktdynamik. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Trap: Escalation hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Trap: Drift to Low Performance steht fuer sinkende standards normalisieren niedrige leistung im zeitverlauf. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Trap: Drift to Low Performance hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Trap: Success to the Successful steht fuer ressourcen konzentrieren sich rekursiv bei bereits erfolgreichen akteuren. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Trap: Success to the Successful hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Trap: Shifting the Burden steht fuer symptomloesungen verdraengen strukturelle ursachenarbeit und erzeugen abhaengigkeit. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Trap: Shifting the Burden hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Trap: Rule Beating steht fuer akteure optimieren auf regelindikatoren statt auf den eigentlichen systemzweck. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Trap: Rule Beating hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Trap: Wrong Goal steht fuer falsch gesetzte ziele lenken das system in unerwuenschte richtung. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Trap: Wrong Goal hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Leverage Point: Parameters steht fuer parameteraenderungen sind wirksam, aber meist schwache eingriffe. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Leverage Point: Parameters hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Leverage Point: Information Flows steht fuer sichtbarkeit von information aendert entscheidungen und systemverhalten direkt. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Leverage Point: Information Flows hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Leverage Point: Rules steht fuer regeln und anreize steuern handlungsraum und kopplungen im system. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Leverage Point: Rules hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Leverage Point: Goals steht fuer systemziele bestimmen priorisierte dynamiken und nebenwirkungen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Leverage Point: Goals hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Leverage Point: Paradigm steht fuer paradigmenwechsel aendert grundlegende systemlogik und interventionseffekt. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Leverage Point: Paradigm hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Systems Thinker Community steht fuer öffentliche community-ressourcen unterstützen kontinuierliches lernen im systemdenken. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Systems Thinker Community hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Human-AI Systems Symbiosis steht fuer systemdenken erweitert sich auf ko-adaptive mensch-ki-systeme mit rekursiven lern- und steuerungsdynamiken. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Human-AI Systems Symbiosis hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Complex Adaptive Systems Thinking steht fuer cast betrachtet systeme mit nichtlinearen interaktionen, adaptivitaet und emergentem verhalten. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Complex Adaptive Systems Thinking hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Second Order Thinking steht fuer second-order thinking bewertet direkte und indirekte langzeitfolgen von entscheidungen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Second Order Thinking hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Im Zentrum steht, wie implizite Annahmen Wahrnehmung und Entscheidung steuern.",
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
    longDescription: "Taxonomy and Ontology Modeling steht fuer taxonomie und ontologie ordnen begriffe, relationen und klassen fuer konsistente wissensmodelle. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Taxonomy and Ontology Modeling hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "CATWOE steht fuer catwoe strukturiert perspektiven auf problemkontexte ueber kunden, akteure und transformation. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. CATWOE hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Network Analysis steht fuer netzwerkanalyse identifiziert zentrale knoten, cluster und flussmuster in komplexen systemen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Relevant sind Rollen von Knoten, Bruecken und Clustern in Beziehungsstrukturen. Network Analysis hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Mental Models steht fuer mentale modelle sind übertragbare denkwerkzeuge zur strukturierten bewertung komplexer situationen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Im Zentrum steht, wie implizite Annahmen Wahrnehmung und Entscheidung steuern. Mental Models hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Pareto Principle steht fuer das 80/20-prinzip fokussiert auf wenige ursachen mit grossem ergebniseffekt. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Im Zentrum steht, wie implizite Annahmen Wahrnehmung und Entscheidung steuern. Pareto Principle hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Scientific Method steht fuer beobachtung, hypothese, experiment und replikation verbessern entscheidungsqualitaet und lernzyklen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Scientific Method hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Im Zentrum steht, wie implizite Annahmen Wahrnehmung und Entscheidung steuern.",
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
    longDescription: "Delayed Gratification steht fuer aufgeschobene belohnung staerkt langfristige zielverfolgung und robuste entscheidungen. Im Zentrum steht, wie implizite Annahmen Wahrnehmung und Entscheidung steuern. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Delayed Gratification hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetypes steht fuer systemarchetypen beschreiben wiederkehrende strukturmuster mit typischen dynamiken und fehlentwicklungen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetypes hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Archetype: Limits to Growth steht fuer frühes wachstum trifft auf begrenzende faktoren und kippt ohne gegenmassnahmen in stagnation. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Archetype: Limits to Growth hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Archetype: Fixes that Fail steht fuer kurzfristige loesungen lindern symptome, erzeugen aber langfristig neue oder staerkere probleme. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Archetype: Fixes that Fail hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: System Mapping steht fuer system mapping visualisiert akteure, grenzen, beziehungen und fluesse auf systemebene. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: System Mapping: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Rich Picture steht fuer rich pictures machen problemkontext, perspektiven und spannungen visuell sichtbar. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Rich Picture: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Stock and Flow Diagram steht fuer stock-and-flow-diagramme modellieren bestaende, zu- und abfluesse dynamischer systeme. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Stock and Flow Diagram: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Behavior Over Time Graph steht fuer zeitverlaufsgrafiken zeigen muster, trends und verzogerungen in systemverhalten. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Behavior Over Time Graph: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: System Archetypes steht fuer system-archetypen helfen wiederkehrende problemstrukturen und hebel zu erkennen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: System Archetypes: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Systemigram steht fuer systemigramme bilden narrative kausalketten und wechselwirkungen in komplexen lagen ab. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Typischer Nutzen von Tool: Systemigram: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Stakeholder Map steht fuer stakeholder-maps strukturieren einfluss, interessen und konfliktlinien im system. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Stakeholder Map: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Scenario Planning steht fuer szenarioplanung erkundet robuste entscheidungen fuer mehrere zukunftspfade. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Typischer Nutzen von Tool: Scenario Planning: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Modeling Software steht fuer modellierungssoftware unterstuetzt simulation, sensitivitaetsanalyse und teamkommunikation. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Modeling Software: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Causal Layered Analysis steht fuer cla verbindet ereignisse, systemische ursachen, weltbilder und narrativebenen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Typischer Nutzen von Tool: Causal Layered Analysis: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Iceberg Model steht fuer das iceberg model verbindet ereignisse mit mustern, strukturen und mentalen modellen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Iceberg Model: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung folgt der Trennung von Ereignis-, Muster-, Struktur- und Annahmeebene.",
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
    longDescription: "Tool: Causal Loop Diagram steht fuer clds zeigen verstaerkende und ausgleichende rueckkopplungsschleifen im system. Wirkungen werden als Rueckkopplungsschleifen statt als lineare Ketten betrachtet. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Causal Loop Diagram: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Viable System Model steht fuer das vsm strukturiert steuerung, koordination und anpassungsfaehigkeit komplexer organisationen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Perspektive orientiert sich an Viabilitaet, Steuerung und Anpassungsfaehigkeit von Organisationen. Typischer Nutzen von Tool: Viable System Model: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Heuristics Catalog steht fuer ein heuristik-katalog hilft bei schnellen entscheidungen unter unsicherheit und zeitdruck. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Heuristics Catalog: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Der Fokus liegt auf praktischen Entscheidungsregeln unter Unsicherheit und Zeitdruck.",
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
    longDescription: "Tool: Emergence Lens steht fuer die emergenz-linse fokussiert auf neue eigenschaften, die aus interaktionen vieler teile entstehen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Emergence Lens: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Boundary Analysis steht fuer boundary analysis macht sichtbar, was innerhalb und ausserhalb der systembetrachtung liegt. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Typischer Nutzen von Tool: Boundary Analysis: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Tool: Soft Systems Methodology steht fuer ssm verbindet rich pictures, root definitions und iterative verbesserungen in weichen problemlagen. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Soft Systems Methodology: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Tool: Network Visualization steht fuer netzwerkvisualisierung macht knoten-kanten-strukturen, cluster und zentralitaet sichtbar. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Typischer Nutzen von Tool: Network Visualization: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen. Relevant sind Rollen von Knoten, Bruecken und Clustern in Beziehungsstrukturen.",
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
    longDescription: "Tool: Scenario Analysis steht fuer szenarioanalyse beschreibt alternative zukunftsbilder fuer robuste entscheidungen unter unsicherheit. Der Knoten beschreibt ein Arbeitsmittel mit klarem Output, damit Teams Hypothesen, Abhaengigkeiten und Handlungsoptionen konkret bearbeiten koennen. Die Einordnung beruecksichtigt alternative Zukunftsbilder statt einer einzelnen Prognose. Typischer Nutzen von Tool: Scenario Analysis: Komplexitaet strukturieren, Diskussionen fokussieren und Optionen nachvollziehbar vergleichbar machen.",
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
    longDescription: "Local Optimization steht fuer optimierung einzelner teile verschlechtert in komplexen systemen die gesamtleistung. Der Knoten beschreibt ein wiederkehrendes Fehlmuster mit typischen Ursachen und Folgen, damit Gegenmassnahmen nicht bei Symptomen stehen bleiben. Bei Local Optimization geht es darum, das Muster frueh zu erkennen und Ursachen, Anreize und Rueckkopplungen gezielt zu korrigieren. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Linear Problem Framing steht fuer lineares denken unterschlaegt rueckkopplungen und nebenwirkungen in systemen. Der Knoten beschreibt ein wiederkehrendes Fehlmuster mit typischen Ursachen und Folgen, damit Gegenmassnahmen nicht bei Symptomen stehen bleiben. Bei Linear Problem Framing geht es darum, das Muster frueh zu erkennen und Ursachen, Anreize und Rueckkopplungen gezielt zu korrigieren. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Symptom Fixing steht fuer reine ereignisreaktion ohne strukturursachen fuhrt zu wiederkehrenden problemen. Der Knoten beschreibt ein wiederkehrendes Fehlmuster mit typischen Ursachen und Folgen, damit Gegenmassnahmen nicht bei Symptomen stehen bleiben. Die Beschreibung folgt der Trennung von Ereignis-, Muster-, Struktur- und Annahmeebene. Bei Symptom Fixing geht es darum, das Muster frueh zu erkennen und Ursachen, Anreize und Rueckkopplungen gezielt zu korrigieren.",
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
    longDescription: "Decision Bias Under Uncertainty steht fuer heuristische verzerrungen erschweren robuste entscheidungen in dynamischen umfeldern. Der Fokus liegt auf praktischen Entscheidungsregeln unter Unsicherheit und Zeitdruck. Der Knoten beschreibt ein wiederkehrendes Fehlmuster mit typischen Ursachen und Folgen, damit Gegenmassnahmen nicht bei Symptomen stehen bleiben. Bei Decision Bias Under Uncertainty geht es darum, das Muster frueh zu erkennen und Ursachen, Anreize und Rueckkopplungen gezielt zu korrigieren.",
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
    longDescription: "Organizational Viability steht fuer organisationen verlieren anpassungsfaehigkeit ohne balancierte koordinationsebenen. Der Knoten beschreibt ein wiederkehrendes Fehlmuster mit typischen Ursachen und Folgen, damit Gegenmassnahmen nicht bei Symptomen stehen bleiben. Bei Organizational Viability geht es darum, das Muster frueh zu erkennen und Ursachen, Anreize und Rueckkopplungen gezielt zu korrigieren. Die Perspektive orientiert sich an Viabilitaet, Steuerung und Anpassungsfaehigkeit von Organisationen.",
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
    longDescription: "System Archetype: Reactive Fix Trap steht fuer kurzfristige loesungen verschieben die last und verstaerken spaeter das urspruengliche problem. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. System Archetype: Reactive Fix Trap hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Shifting the Burden steht fuer symptomatische eingriffe verdrängen nachhaltige ursachenarbeit und erhoehen langfristige abhaengigkeit. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Shifting the Burden hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Growth Friction Cycle steht fuer verstaerkendes wachstum trifft auf spaet wirksame begrenzungen und kippt in stagnation. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Growth Friction Cycle hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Success to the Successful steht fuer ressourcenallokation bevorzugt bestehende gewinner und vergroessert strukturelle ungleichgewichte. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Success to the Successful hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Tragedy of the Commons steht fuer individuelle optimierung uebernutzt gemeinsame ressourcen und untergraebt kollektive stabilitaet. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Tragedy of the Commons hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Escalation steht fuer reaktive gegenmassnahmen zwischen akteuren treiben gegenseitige aufruestungsschleifen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Escalation hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "System Archetype: Eroding Goals steht fuer wiederholte zielabsenkung kaschiert leistungsdefizite und normalisiert sinkende standards. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. System Archetype: Eroding Goals hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Growth and Underinvestment steht fuer nachfragewachstum ohne kapazitaetsinvestition erzeugt engpaesse und selbstverstaerkende verschlechterung. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Growth and Underinvestment hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "System Archetype: Accidental Adversaries steht fuer gut gemeinte lokale anpassungen fuehren zu unbeabsichtigten zielkonflikten zwischen partnern. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. System Archetype: Accidental Adversaries hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Archetype: Attractiveness Principle steht fuer ressourcen fließen kurzfristig in attraktive felder und entziehen strukturell wichtige grundlagenarbeit. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Archetype: Attractiveness Principle hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "System Mapping steht fuer system mapping macht akteure, wechselwirkungen und randbedingungen als entscheidungsgrundlage sichtbar. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. System Mapping hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Wirkungen werden als Rueckkopplungsschleifen statt als lineare Ketten betrachtet.",
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
    longDescription: "Boundary Critique steht fuer boundary critique hinterfragt bewusst, welche perspektiven im modell eingeschlossen oder ausgeschlossen sind. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Boundary Critique hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet.",
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
    longDescription: "Feedback Delay Awareness steht fuer bewusstsein fuer zeitverzoegerungen verhindert fehldeutung kurzfristiger signale als stabile trends. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Feedback Delay Awareness hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Policy Counterdynamics steht fuer interventionen scheitern, wenn gegenreaktionen im gesamtsystem staerker wirken als die beabsichtigte steuerung. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Policy Counterdynamics hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen. Die Einordnung stützt sich auf das Grundlagenfeld aus Thinking in Systems.",
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
    longDescription: "Adaptive Capacity steht fuer adaptive capacity beschreibt die systemische faehigkeit, auf stoerungen lernend und robust zu reagieren. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Perspektive orientiert sich an Viabilitaet, Steuerung und Anpassungsfaehigkeit von Organisationen. Adaptive Capacity hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Multi Loop Learning steht fuer mehrschleifiges lernen verbindet ergebnisfeedback mit reflexion ueber regeln und zielsetzungen. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Multi Loop Learning hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Intervention Timing steht fuer wirksame eingriffe haengen von zeitlicher platzierung entlang rueckkopplungsstrukturen ab. Die Einordnung beruecksichtigt alternative Zukunftsbilder statt einer einzelnen Prognose. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Intervention Timing hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Cross Scale Effects steht fuer entscheidungen auf mikroebene koennen meso- und makroskopische dynamiken unvorhergesehen verstaerken. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Cross Scale Effects hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Structural Drift steht fuer kleine lokale anpassungen koennen schleichend in eine strategisch unguenstige systemarchitektur fuehren. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Structural Drift hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    longDescription: "Coordination Overhead steht fuer steigende kopplung und abstimmungskosten koennen den nutzen neuer interventionspfade neutralisieren. Die Beschreibung ist auf die praktische Einordnung im Alltag von Analyse und Entscheidung ausgerichtet. Der Knoten erklaert den fachlichen Kernbegriff und zeigt, welche Dynamik oder Struktur damit in realen Situationen analysiert werden kann. Coordination Overhead hilft, von Einzelereignissen zu belastbaren Strukturhypothesen und wirksamen Interventionen zu kommen.",
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
    return toSingleSentence(stripShortPrefix(node.shortDescription.trim()));
  }

  const label = (node.title ?? node.name ?? "Dieser Knoten").trim();
  switch (node.nodeType) {
    case "Author":
      return `Einordnung: ${label} praegt zentrale Perspektiven im Systemdenken.`;
    case "Book":
      return `Einordnung: ${label} dient als kompakte Referenz fuer Begriffe und Modelle.`;
    case "Tool":
      return `Einordnung: ${label} ist ein praktisches Werkzeug fuer Analyse und Intervention.`;
    case "Problem":
      return `Einordnung: ${label} beschreibt ein wiederkehrendes Fehlmuster mit Folgekosten.`;
    default:
      return `Einordnung: ${label} beschreibt einen zentralen Baustein im Systemdenken.`;
  }
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

function normalizeSummary(summary: string): string {
  const compact = toSingleSentence(summary);
  return compact.endsWith(".") ? compact : `${compact}.`;
}

function toSingleSentence(value: string): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) {
    return compact;
  }
  const match = compact.match(/^(.+?[.!?])(\s|$)/);
  return (match ? match[1] : compact).trim();
}

function stripShortPrefix(value: string): string {
  return value.replace(/^\s*kurz:\s*/i, "").trim();
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
      const summary = normalizeSummary(node.summary);
      const shortDescription = normalizeShortDescription(node);
      const longDescription = normalizeLongDescription(node, shortDescription);

      return {
        ...node,
        summary,
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
