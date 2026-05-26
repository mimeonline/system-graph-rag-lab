import type { LucideIcon } from "lucide-react";
import { Database, FileText, MessageSquareText, Network, RefreshCcw } from "lucide-react";

export type DemoGraphTypeId =
  | "knowledge"
  | "domain"
  | "document"
  | "conversation"
  | "dynamic";

export type DemoGraphNodeKind = "query" | "source" | "concept" | "rule" | "actor" | "decision" | "event";

export type DemoGraphNode = {
  id: string;
  label: string;
  kind: DemoGraphNodeKind;
  x: number;
  y: number;
};

export type DemoGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type DemoGraphStep = {
  label: string;
  detail: string;
  observation: string;
};

export type DemoLearningBox = {
  title: string;
  body: string;
};

export type DemoGraphType = {
  id: DemoGraphTypeId;
  slug: string;
  number: string;
  title: string;
  icon: LucideIcon;
  badge: string;
  useCase: string;
  question: string;
  structure: string;
  risk: string;
  detailIntro: string;
  learningGoal: string;
  genericDefinition: string;
  genericWhenUseful: string[];
  genericGraphContents: string[];
  genericLlmRole: string[];
  whenUseful: string[];
  modellingNotes: string[];
  userActions: DemoLearningBox[];
  graphContents: DemoLearningBox[];
  llmActions: DemoLearningBox[];
  interactionLoop: DemoLearningBox[];
  promptPackage: string[];
  nodes: DemoGraphNode[];
  edges: DemoGraphEdge[];
  steps: DemoGraphStep[];
};

export const DEMO_GRAPH_TYPES: DemoGraphType[] = [
  {
    id: "knowledge",
    slug: "wissensgraph",
    number: "01",
    title: "Wissensgraph",
    icon: Database,
    badge: "Semantische Basis",
    useCase: "Begriffe, Pflichten und Beziehungen werden explizit, damit eine Antwort nicht nur Textstellen wiederholt.",
    question: "Welche AI-Act-Pflichten berühren unseren geplanten Launch?",
    structure: "AI-System, Risikoklasse, Pflicht, Anbieter, Betreiber, Artikel, Nachweis",
    risk: "Begriffe, Rechtsrollen und Dokumentstellen werden vermischt.",
    detailIntro:
      "Ein Wissensgraph macht die Sprache des EU AI Act maschinenlesbar. Er trennt Dinge, Rollen, Pflichten und Belege, damit eine Antwort nicht nur plausibel klingt, sondern auf expliziten Beziehungen beruht.",
    learningGoal:
      "Du lernst, wie aus juristischen Begriffen ein semantisches Netz entsteht und warum dieses Netz dem LLM einen präziseren Kontext gibt.",
    genericDefinition:
      "Ein Wissensgraph modelliert Dinge, Begriffe, Rollen, Eigenschaften und Beziehungen so, dass Bedeutung explizit abfragbar wird. Er hilft, wenn ein System nicht nur Text finden, sondern verstehen soll, wie Konzepte zusammenhängen.",
    genericWhenUseful: [
      "Wenn Begriffe und reale Objekte sauber unterschieden werden müssen.",
      "Wenn Antworten über Beziehungen, Eigenschaften und Bedeutungen hergeleitet werden sollen.",
      "Wenn mehrere Quellen unterschiedliche Wörter für dieselben oder ähnliche Konzepte verwenden.",
    ],
    genericGraphContents: [
      "Entitäten, Begriffe, Typen, Eigenschaften und Synonyme.",
      "Semantische Beziehungen wie ist Teil von, gehört zu, verursacht, belegt oder widerspricht.",
      "Quellenanker, damit Bedeutung und Beleg nachvollziehbar getrennt bleiben.",
    ],
    genericLlmRole: [
      "Das LLM mappt Nutzerbegriffe auf Graphbegriffe.",
      "Es liest relevante Nachbarschaften statt lose Texttreffer.",
      "Es formuliert Antworten entlang expliziter Begriffspfade.",
    ],
    whenUseful: [
      "Wenn Begriffe wie Anbieter, Betreiber, KI-System und Hochrisiko-System sauber getrennt werden müssen.",
      "Wenn Antworten erklären sollen, welche Beziehung zwischen Pflicht, Rolle und Artikel besteht.",
      "Wenn ein Team wissen will, welche Begriffe im Gesetz für die eigene Produktentscheidung relevant sind.",
    ],
    modellingNotes: [
      "Knoten stehen für stabile Begriffe, Rollen und Pflichten.",
      "Kanten beschreiben Bedeutung, Zuständigkeit, Auslösung oder Belegbezug.",
      "Dokumentstellen bleiben angebunden, werden aber nicht mit fachlichen Begriffen verwechselt.",
    ],
    userActions: [
      {
        title: "Begriffe aus der Frage markieren",
        body: "Der Nutzer formuliert eine Launch-Frage und benennt Produkt, Rolle, Markt und vermutete Risikoklasse so konkret wie möglich.",
      },
      {
        title: "Unklare Rollen klären",
        body: "Wenn Anbieter, Betreiber oder Nutzer vermischt sind, fragt das System nach. Ohne diese Rolle ist die Pflichtenableitung unscharf.",
      },
      {
        title: "Antwort prüfen",
        body: "Der Nutzer kontrolliert, ob die verwendeten Begriffe wirklich zur eigenen Situation passen.",
      },
    ],
    graphContents: [
      {
        title: "Semantische Knoten",
        body: "Der Graph enthält Begriffe wie KI-System, Hochrisiko-System, Anbieter, Betreiber, Pflicht und Nachweis.",
      },
      {
        title: "Bedeutungskanten",
        body: "Kanten erklären, welche Rolle welche Pflicht hat, welche Risikoklasse welche Prüfung auslöst und welcher Artikel die Aussage belegt.",
      },
      {
        title: "Quellenanker",
        body: "Artikel und Textstellen bleiben als Belege am Begriffsknoten, damit semantische Aussage und Quelle getrennt bleiben.",
      },
    ],
    llmActions: [
      {
        title: "Frage auf Graphbegriffe mappen",
        body: "Das LLM erkennt Launch, KI-Feature, Anbieterrolle und Risikoklasse als Suchintention und fragt passende Knoten ab.",
      },
      {
        title: "Nachbarschaft lesen",
        body: "Es nutzt nicht den ganzen Gesetzestext, sondern die relevanten Rollen-, Pflicht- und Belegpfade.",
      },
      {
        title: "Antwort mit Begriffspfad schreiben",
        body: "Die Antwort sagt nicht nur was gilt, sondern über welche Begriffskette sie dazu kommt.",
      },
    ],
    interactionLoop: [
      {
        title: "User",
        body: "Beschreibt das KI-Feature, den EU-Bezug und die vermutete Rolle.",
      },
      {
        title: "Graph",
        body: "Liefert passende Begriffe, Beziehungen, Pflichten und Artikelbelege.",
      },
      {
        title: "LLM",
        body: "Verdichtet den Graphpfad zu einer verständlichen, prüfbaren Erklärung.",
      },
      {
        title: "User",
        body: "Korrigiert Rollen oder Scope, wodurch der Graphpfad neu ausgewählt wird.",
      },
    ],
    promptPackage: [
      "Nutzerfrage mit Produkt- und Rollenhinweisen",
      "Top-Begriffsknoten mit Definitionen",
      "Rollen- und Pflichtbeziehungen als strukturierte Kanten",
      "Artikelbelege mit kurzer Quellenangabe",
      "Explizite Unsicherheiten, die nicht entschieden werden dürfen",
    ],
    nodes: [
      { id: "q", label: "Launch-Frage", kind: "query", x: 70, y: 170 },
      { id: "ai", label: "KI-System", kind: "concept", x: 230, y: 95 },
      { id: "risk", label: "Hohes Risiko", kind: "rule", x: 405, y: 95 },
      { id: "provider", label: "Anbieter", kind: "actor", x: 235, y: 250 },
      { id: "obligation", label: "Pflichten", kind: "rule", x: 410, y: 250 },
      { id: "evidence", label: "Artikelbelege", kind: "source", x: 575, y: 170 },
    ],
    edges: [
      { id: "e1", source: "q", target: "ai", label: "fragt nach" },
      { id: "e2", source: "ai", target: "risk", label: "kann sein" },
      { id: "e3", source: "provider", target: "obligation", label: "hat" },
      { id: "e4", source: "risk", target: "obligation", label: "auslöst" },
      { id: "e5", source: "obligation", target: "evidence", label: "belegt durch" },
    ],
    steps: [
      {
        label: "Begriffe normalisieren",
        detail: "Launch, KI-System, Anbieter und Betreiber werden als getrennte Knoten geführt.",
        observation: "Die Simulation zeigt früh, wenn eine Frage Rollen oder Begriffe vermischt.",
      },
      {
        label: "Pflichten verbinden",
        detail: "Risikoklasse und Rolle bestimmen, welche Pflichten in den Antwortkontext kommen.",
        observation: "Der relevante Kontext wird semantisch kleiner, aber belastbarer.",
      },
      {
        label: "Antwort belegen",
        detail: "Jede Aussage verweist auf Artikelbelege und auf die Rolle im Graph.",
        observation: "Die Demo kann erklären, warum ein Beleg überhaupt im Prompt gelandet ist.",
      },
    ],
  },
  {
    id: "domain",
    slug: "domaenen-graph",
    number: "02",
    title: "Domänen-Graph",
    icon: Network,
    badge: "Fachliche Realität",
    useCase: "Der Launch wird als Unternehmensentscheidung modelliert: Produkt, Markt, Rolle, Risiko, Kontrolle und Freigabe.",
    question: "Dürfen wir dieses KI-Feature für EU-Kunden freigeben?",
    structure: "Produkt, Feature, Markt, Prozess, Verantwortlicher, Kontrolle, Freigabestatus",
    risk: "Der Graph wird zu allgemein und verliert die konkrete Geschäftsentscheidung.",
    detailIntro:
      "Ein Domänen-Graph übersetzt den EU AI Act in die fachliche Welt eines Unternehmens. Er fragt nicht zuerst nach Artikeln, sondern nach Produkt, Markt, Verantwortlichen, Kontrollen und Freigabestatus.",
    learningGoal:
      "Du lernst, wie GraphRAG aus Gesetzestexten eine arbeitsfähige Entscheidungsstruktur für Produkt, Compliance und Management macht.",
    genericDefinition:
      "Ein Domänen-Graph modelliert die fachliche Realität eines klar begrenzten Arbeitsbereichs. Er bildet ab, welche Objekte, Rollen, Prozesse, Regeln und Verantwortlichkeiten in dieser Domäne relevant sind.",
    genericWhenUseful: [
      "Wenn eine fachliche Entscheidung in einer konkreten Organisation getroffen werden muss.",
      "Wenn Wissen aus Dokumenten in Arbeitsobjekte, Rollen und Prozesse übersetzt werden soll.",
      "Wenn verschiedene Stakeholder eine gemeinsame Sicht auf Status, Verantwortung und Abhängigkeiten brauchen.",
    ],
    genericGraphContents: [
      "Fachobjekte wie Produkt, Kunde, Vertrag, Prozess, Kontrolle oder Entscheidung.",
      "Rollen, Verantwortlichkeiten, Zustände und Abhängigkeiten.",
      "Verbindungen zwischen fachlichen Regeln und operativen Aufgaben.",
    ],
    genericLlmRole: [
      "Das LLM übersetzt Nutzerfragen in Domänenobjekte.",
      "Es erkennt fehlende Informationen oder ungeklärte Verantwortlichkeiten.",
      "Es erzeugt Antworten, die in der Fachdomäne handlungsfähig sind.",
    ],
    whenUseful: [
      "Wenn ein Launch, eine Produktänderung oder ein Freigabeprozess bewertet werden soll.",
      "Wenn rechtliche Pflichten in Rollen, Kontrollen und Aufgaben übersetzt werden müssen.",
      "Wenn Stakeholder eine gemeinsame Sicht auf Risiko, Verantwortung und Status brauchen.",
    ],
    modellingNotes: [
      "Knoten stehen für Geschäftsobjekte und Verantwortlichkeiten.",
      "Kanten zeigen Abhängigkeiten zwischen Feature, Markt, Kontrolle und Entscheidung.",
      "Der Gesetzestext ist Quelle, aber der Mittelpunkt ist die konkrete Unternehmensrealität.",
    ],
    userActions: [
      {
        title: "Launch-Kontext beschreiben",
        body: "Der Nutzer nennt Feature, Zielmarkt, Kundengruppe, Datenfluss, geplanten Release und verantwortliche Teams.",
      },
      {
        title: "Kontrollen auswählen",
        body: "Product, Legal, Compliance und Engineering markieren, welche Kontrollen bereits existieren und welche fehlen.",
      },
      {
        title: "Entscheidung vorbereiten",
        body: "Der Nutzer erwartet keine Rechtsmeinung, sondern eine Go-, Hold- oder No-Go-Grundlage mit offenen Punkten.",
      },
    ],
    graphContents: [
      {
        title: "Geschäftsobjekte",
        body: "Der Graph enthält Produkt, Feature, Markt, Kundensegment, Verantwortliche, Prozesse, Kontrollen und Freigabestatus.",
      },
      {
        title: "Verantwortungskanten",
        body: "Kanten zeigen, welches Team welche Kontrolle verantwortet und welche Pflicht auf welchen Prozess wirkt.",
      },
      {
        title: "Entscheidungsknoten",
        body: "Go, Hold und No-Go werden als Zustände modelliert, die von Evidenz, Risiko und Kontrollreife abhängen.",
      },
    ],
    llmActions: [
      {
        title: "Business-Kontext einordnen",
        body: "Das LLM übersetzt die Frage in Produkt-, Rollen- und Kontrollknoten statt nur nach passenden Gesetzesabschnitten zu suchen.",
      },
      {
        title: "Lücken sichtbar machen",
        body: "Es benennt fehlende Informationen wie Risikoklassifizierung, Verantwortliche oder Nachweise.",
      },
      {
        title: "Entscheidungsvorlage erzeugen",
        body: "Die Antwort verbindet Status, Risiko, nötige Kontrollen und nächste Klärungen.",
      },
    ],
    interactionLoop: [
      {
        title: "User",
        body: "Beschreibt Produkt, Markt und geplante Freigabe.",
      },
      {
        title: "Graph",
        body: "Ordnet Feature, Rollen, Kontrollen und Freigabestatus in der Domäne ein.",
      },
      {
        title: "LLM",
        body: "Formuliert eine entscheidungsfähige Zusammenfassung mit Lücken und To-dos.",
      },
      {
        title: "User",
        body: "Ergänzt fehlende Kontrollen oder ändert den Launch-Scope.",
      },
    ],
    promptPackage: [
      "Produkt- und Featurebeschreibung",
      "Relevante Rollen und Verantwortliche",
      "Kontrollstatus und offene Nachweise",
      "Zuordenbare AI-Act-Pflichten",
      "Entscheidungsformat für Go, Hold oder No-Go",
    ],
    nodes: [
      { id: "q", label: "Launch-Entscheidung", kind: "query", x: 75, y: 170 },
      { id: "feature", label: "KI-Feature", kind: "concept", x: 235, y: 90 },
      { id: "market", label: "EU-Markt", kind: "concept", x: 405, y: 90 },
      { id: "owner", label: "Product Owner", kind: "actor", x: 230, y: 255 },
      { id: "control", label: "Kontrollen", kind: "decision", x: 405, y: 255 },
      { id: "go", label: "Go / No-Go", kind: "decision", x: 575, y: 170 },
    ],
    edges: [
      { id: "e1", source: "q", target: "feature", label: "bewertet" },
      { id: "e2", source: "feature", target: "market", label: "für" },
      { id: "e3", source: "owner", target: "control", label: "verantwortet" },
      { id: "e4", source: "market", target: "control", label: "fordert" },
      { id: "e5", source: "control", target: "go", label: "entscheidet" },
    ],
    steps: [
      {
        label: "Geschäftsobjekte setzen",
        detail: "Die Simulation startet nicht beim Gesetzestext, sondern beim Feature und seiner Markteinführung.",
        observation: "Der Graph zeigt, welche Unternehmensdaten für eine Antwort fehlen.",
      },
      {
        label: "Kontrollen zuordnen",
        detail: "Pflichten werden in konkrete Maßnahmen, Verantwortliche und Freigabekriterien übersetzt.",
        observation: "Die Antwort wird anschlussfähig für Projektmanagement und Governance.",
      },
      {
        label: "Entscheidung ableiten",
        detail: "Der Graph erzeugt keine Rechtsmeinung, sondern eine strukturierte Entscheidungsgrundlage.",
        observation: "Der Nutzer sieht, welche Annahmen für Go, Hold oder No-Go ausschlaggebend sind.",
      },
    ],
  },
  {
    id: "document",
    slug: "dokument-graph",
    number: "03",
    title: "Dokument-Graph",
    icon: FileText,
    badge: "Korpus und Quellen",
    useCase: "Der offizielle AI-Act-Text wird als Dokumentnetz aus Artikeln, Erwägungsgründen, Abschnitten und Claims sichtbar.",
    question: "Welche Textstellen stützen die Antwort zur Launch-Freigabe?",
    structure: "Dokument, Kapitel, Artikel, Absatz, Claim, Erwägungsgrund, Quelle",
    risk: "Der Dokument-Graph wird mit fachlicher Wahrheit verwechselt.",
    detailIntro:
      "Ein Dokument-Graph erschließt den offiziellen EU-AI-Act-Text als Quellenstruktur. Er macht sichtbar, welche Artikel, Absätze, Erwägungsgründe und Claims eine Antwort tatsächlich stützen.",
    learningGoal:
      "Du lernst, wie klassisches RAG durch eine dokumentnahe Graphstruktur nachvollziehbarer wird und warum Belege getrennt von Interpretation bleiben müssen.",
    genericDefinition:
      "Ein Dokument-Graph modelliert Quellen als Netz aus Dokumenten, Abschnitten, Chunks, Claims, Erwähnungen und Belegen. Er macht sichtbar, woher eine Aussage stammt und welche Textstellen zusammengehören.",
    genericWhenUseful: [
      "Wenn Antworten überprüfbare Fundstellen und Quellenbezug brauchen.",
      "Wenn lange oder viele Dokumente in stabile, zitierbare Einheiten zerlegt werden sollen.",
      "Wenn Retrieval nicht nur Textähnlichkeit, sondern Dokumentstruktur berücksichtigen soll.",
    ],
    genericGraphContents: [
      "Dokumente, Kapitel, Abschnitte, Chunks, Tabellen, Claims und Erwähnungen.",
      "Beziehungen wie enthält, erwähnt, stützt, widerspricht oder verweist auf.",
      "Metadaten wie Quelle, Version, Sprache, Autor, Datum und Position im Dokument.",
    ],
    genericLlmRole: [
      "Das LLM bekommt ausgewählte Textstellen mit Quellenstruktur.",
      "Es trennt belegte Aussage und Interpretation.",
      "Es kann erklären, welche Fundstelle welchen Antwortbaustein stützt.",
    ],
    whenUseful: [
      "Wenn eine Antwort überprüfbare Fundstellen braucht.",
      "Wenn lange Gesetzestexte in zitierbare Einheiten zerlegt werden sollen.",
      "Wenn Claims aus Textstellen extrahiert und im Prompt kontrolliert verwendet werden sollen.",
    ],
    modellingNotes: [
      "Knoten stehen für Dokumentteile, Claims und Quellen.",
      "Kanten beschreiben Enthaltensein, Erwähnung, Stützung und Belegbezug.",
      "Der Graph sagt, wo etwas steht. Er entscheidet nicht allein, was fachlich daraus folgt.",
    ],
    userActions: [
      {
        title: "Belegfrage stellen",
        body: "Der Nutzer fragt nach Fundstellen, Claims oder Abschnitten, die eine Launch-Aussage stützen.",
      },
      {
        title: "Quelle eingrenzen",
        body: "Er kann Sprache, Dokumentversion, Artikelbereich oder Thema eingrenzen.",
      },
      {
        title: "Zitate prüfen",
        body: "Der Nutzer schaut, ob Antwort und Fundstelle wirklich zusammenpassen.",
      },
    ],
    graphContents: [
      {
        title: "Dokumentstruktur",
        body: "Der Graph enthält Dokument, Kapitel, Artikel, Absatz, Erwägungsgrund und extrahierte Claims.",
      },
      {
        title: "Quellenkanten",
        body: "Kanten zeigen, welcher Claim aus welchem Absatz stammt und welche Abschnitte thematisch zusammenhängen.",
      },
      {
        title: "Retrieval-Einheiten",
        body: "Chunks sind nicht lose Textstücke, sondern liegen in ihrer Dokumentposition und Belegbeziehung.",
      },
    ],
    llmActions: [
      {
        title: "Textstellen auswählen",
        body: "Das LLM bekommt nicht den kompletten AI Act, sondern nur passende Artikel, Claims und Quellenanker.",
      },
      {
        title: "Beleg und Deutung trennen",
        body: "Es formuliert, was die Quelle sagt, und markiert, welche Interpretation daraus abgeleitet wird.",
      },
      {
        title: "Antwort zitierfähig machen",
        body: "Jede relevante Aussage wird auf Dokumentknoten und Fundstellen zurückgeführt.",
      },
    ],
    interactionLoop: [
      {
        title: "User",
        body: "Fragt nach Belegen oder nach einem Abschnitt des Gesetzes.",
      },
      {
        title: "Graph",
        body: "Findet Artikel, Absätze, Claims und verwandte Textstellen.",
      },
      {
        title: "LLM",
        body: "Erklärt die Fundstellen und baut daraus eine Antwort mit Quellenhinweis.",
      },
      {
        title: "User",
        body: "Fordert eine engere, andere oder stärker belegte Antwort an.",
      },
    ],
    promptPackage: [
      "Nutzerfrage und gewünschte Belegform",
      "Relevante Artikel und Absätze",
      "Extrahierte Claims mit Quellenanker",
      "Hinweise auf verwandte Erwägungsgründe",
      "Regel, Beleg und Interpretation getrennt auszugeben",
    ],
    nodes: [
      { id: "q", label: "Belegfrage", kind: "query", x: 70, y: 170 },
      { id: "doc", label: "EU AI Act", kind: "source", x: 225, y: 170 },
      { id: "chapter", label: "Kapitel", kind: "source", x: 380, y: 75 },
      { id: "article", label: "Artikel", kind: "source", x: 380, y: 265 },
      { id: "claim", label: "Claim", kind: "rule", x: 545, y: 170 },
      { id: "answer", label: "Antwort", kind: "decision", x: 680, y: 170 },
    ],
    edges: [
      { id: "e1", source: "q", target: "doc", label: "sucht in" },
      { id: "e2", source: "doc", target: "chapter", label: "enthält" },
      { id: "e3", source: "doc", target: "article", label: "enthält" },
      { id: "e4", source: "article", target: "claim", label: "stützt" },
      { id: "e5", source: "claim", target: "answer", label: "belegt" },
    ],
    steps: [
      {
        label: "Quelle schneiden",
        detail: "PDF und XHTML werden in stabile Einheiten wie Artikel, Absätze und Claims zerlegt.",
        observation: "Der Nutzer sieht, welche Textstellen wirklich in der Antwort stecken.",
      },
      {
        label: "Claims extrahieren",
        detail: "Aus relevanten Absätzen entstehen prüfbare Aussagen statt lose Textblöcke.",
        observation: "Die Simulation kann Claim, Fundstelle und Antwortbaustein getrennt anzeigen.",
      },
      {
        label: "Kontext paketieren",
        detail: "Nur ausgewählte Claims und Fundstellen wandern in den Prompt.",
        observation: "Das macht sichtbar, wie klassisches RAG durch Graph-Struktur kontrollierbarer wird.",
      },
    ],
  },
  {
    id: "conversation",
    slug: "conversational-graph",
    number: "04",
    title: "Conversational Graph",
    icon: MessageSquareText,
    badge: "Interaktion und Memory",
    useCase: "Die Demo merkt sich Annahmen, Rückfragen, Korrekturen und Entscheidungen über mehrere Gesprächsschritte.",
    question: "Was haben wir zur Launch-Entscheidung schon geklärt?",
    structure: "Session, Nutzerziel, Frage, Antwort, Annahme, Korrektur, offene Entscheidung",
    risk: "Alles wird gespeichert, aber nichts ist vertrauenswürdig oder widerrufbar.",
    detailIntro:
      "Ein Conversational Graph macht das Gespräch selbst zum strukturierten Kontext. Er hält fest, welche Annahmen, Korrekturen, Ziele und offenen Fragen für die nächste Antwort relevant sind.",
    learningGoal:
      "Du lernst, wie GraphRAG über mehrere Gesprächsschritte stabil bleibt, ohne jede Äußerung ungeprüft als Wahrheit zu behandeln.",
    genericDefinition:
      "Ein Conversational Graph modelliert Gesprächsverlauf, Nutzerziele, Annahmen, Korrekturen, Präferenzen und offene Fragen als strukturierten Kontext. Er macht Memory prüfbar statt nur Chatverlauf anzuhäufen.",
    genericWhenUseful: [
      "Wenn Nutzer über mehrere Schritte an einer Entscheidung oder Analyse arbeiten.",
      "Wenn Annahmen, Korrekturen und offene Punkte nachvollziehbar bleiben müssen.",
      "Wenn Folgefragen auf bestätigtem Kontext aufbauen sollen, ohne alte Fehler mitzuschleppen.",
    ],
    genericGraphContents: [
      "Sessions, Nutzerziele, Fragen, Antworten, Annahmen, Korrekturen und Entscheidungen.",
      "Beziehungen wie bestätigt, korrigiert, ersetzt, hängt ab von oder ist offen.",
      "Vertrauensstatus, Zeitstempel und Herkunft von Memory-Einträgen.",
    ],
    genericLlmRole: [
      "Das LLM erhält relevanten Gesprächskontext statt den gesamten Chat.",
      "Es erkennt Widersprüche zwischen neuen Aussagen und gespeichertem Kontext.",
      "Es schlägt sinnvolle nächste Klärungen vor.",
    ],
    whenUseful: [
      "Wenn eine Launch-Entscheidung über mehrere Workshops oder Fragen hinweg entsteht.",
      "Wenn Annahmen, Korrekturen und offene Punkte nachvollziehbar bleiben müssen.",
      "Wenn ein System bei Folgefragen wissen soll, was bereits geklärt wurde.",
    ],
    modellingNotes: [
      "Knoten stehen für Fragen, Antworten, Annahmen, Korrekturen und Ziele.",
      "Kanten zeigen, was geklärt, geändert, bestätigt oder blockiert wurde.",
      "Memory braucht Herkunft, Zeit und Vertrauensstatus, sonst wird es gefährlich.",
    ],
    userActions: [
      {
        title: "Annahmen bestätigen",
        body: "Der Nutzer bestätigt oder korrigiert, was das System aus früheren Fragen über Produkt, Rolle und Ziel gelernt hat.",
      },
      {
        title: "Folgefrage stellen",
        body: "Er fragt nicht jedes Detail neu, sondern baut auf der bisherigen Launch-Diskussion auf.",
      },
      {
        title: "Memory bereinigen",
        body: "Der Nutzer kann falsche Annahmen widerrufen oder offene Punkte als erledigt markieren.",
      },
    ],
    graphContents: [
      {
        title: "Gesprächsknoten",
        body: "Der Graph enthält Sessions, Fragen, Antworten, Ziele, Annahmen, Korrekturen und offene Entscheidungen.",
      },
      {
        title: "Vertrauenskanten",
        body: "Kanten halten fest, ob eine Aussage bestätigt, korrigiert, ungeprüft oder veraltet ist.",
      },
      {
        title: "Entscheidungsverlauf",
        body: "Der Graph zeigt, wie sich die Launch-Entscheidung Schritt für Schritt entwickelt hat.",
      },
    ],
    llmActions: [
      {
        title: "Gesprächskontext laden",
        body: "Das LLM erhält relevante bestätigte Annahmen, offene Punkte und Korrekturen statt den gesamten Chatverlauf.",
      },
      {
        title: "Widersprüche erkennen",
        body: "Es markiert, wenn eine neue Aussage früheren Annahmen widerspricht.",
      },
      {
        title: "Nächste Klärung vorschlagen",
        body: "Die Antwort enthält nicht nur Inhalt, sondern den nächsten sinnvollen Schritt im Entscheidungsprozess.",
      },
    ],
    interactionLoop: [
      {
        title: "User",
        body: "Stellt eine Folgefrage oder korrigiert eine Annahme.",
      },
      {
        title: "Graph",
        body: "Sucht bestätigte Ziele, offene Punkte und Korrekturen der Session.",
      },
      {
        title: "LLM",
        body: "Antwortet unter Berücksichtigung des aktuellen Gesprächszustands.",
      },
      {
        title: "User",
        body: "Bestätigt, verwirft oder ergänzt den entstandenen Kontext.",
      },
    ],
    promptPackage: [
      "Aktuelle Frage",
      "Bestätigte Annahmen aus der Session",
      "Korrekturen und widerrufene Aussagen",
      "Offene Entscheidungen und blockierende Fragen",
      "Regel, unsichere Memory-Einträge nicht als Fakt zu behandeln",
    ],
    nodes: [
      { id: "q", label: "Aktuelle Frage", kind: "query", x: 80, y: 170 },
      { id: "goal", label: "Launch-Ziel", kind: "decision", x: 240, y: 80 },
      { id: "assumption", label: "Annahme", kind: "concept", x: 405, y: 80 },
      { id: "correction", label: "Korrektur", kind: "event", x: 245, y: 260 },
      { id: "open", label: "Offene Frage", kind: "decision", x: 405, y: 260 },
      { id: "next", label: "Nächster Schritt", kind: "decision", x: 585, y: 170 },
    ],
    edges: [
      { id: "e1", source: "q", target: "goal", label: "gehört zu" },
      { id: "e2", source: "goal", target: "assumption", label: "nutzt" },
      { id: "e3", source: "correction", target: "assumption", label: "ändert" },
      { id: "e4", source: "open", target: "next", label: "blockiert" },
      { id: "e5", source: "assumption", target: "next", label: "prägt" },
    ],
    steps: [
      {
        label: "Gesprächszustand lesen",
        detail: "Die Simulation unterscheidet aktuelle Frage, Ziel, Annahme und offene Entscheidung.",
        observation: "Folgefragen starten nicht wieder bei null.",
      },
      {
        label: "Memory prüfen",
        detail: "Korrekturen überschreiben nicht still, sondern werden als Ereignis sichtbar.",
        observation: "Der Nutzer erkennt, ob die Antwort auf alten oder korrigierten Annahmen basiert.",
      },
      {
        label: "Nächsten Schritt wählen",
        detail: "Der Graph schlägt die nächste sinnvolle Klärung vor.",
        observation: "Das Demo-Gespräch wird zu einem prüfbaren Entscheidungsverlauf.",
      },
    ],
  },
  {
    id: "dynamic",
    slug: "dynamischer-graph",
    number: "05",
    title: "Dynamischer Graph",
    icon: RefreshCcw,
    badge: "Zeit und Veränderung",
    useCase: "AI-Act-Pflichten, Produktstatus und Umsetzungsfristen werden als zeitabhängige Zustände dargestellt.",
    question: "Was gilt heute, was gilt später, und was ändert unsere Launch-Planung?",
    structure: "Event, Datum, Version, Zustand, Frist, Änderung, aktueller Kontext",
    risk: "Der Graph zeigt nur den letzten Zustand und verliert die Historie.",
    detailIntro:
      "Ein dynamischer Graph ergänzt den Graph um Zeit. Gerade beim EU AI Act ist entscheidend, was heute gilt, welche Fristen später greifen und welche Version einer Quelle verwendet wurde.",
    learningGoal:
      "Du lernst, warum Compliance-Antworten ohne Zeitbezug schnell falsch werden und wie ein Graph Zustände, Fristen und Änderungen sichtbar hält.",
    genericDefinition:
      "Ein dynamischer Graph modelliert, was wann galt, was sich geändert hat und welcher Zustand zu einem bestimmten Zeitpunkt relevant ist. Er ergänzt Beziehungen um Zeit, Versionen und Ereignisse.",
    genericWhenUseful: [
      "Wenn Antworten vom Zeitpunkt, von Versionen oder von Zustandsänderungen abhängen.",
      "Wenn Historie erhalten bleiben muss, statt nur den letzten Stand zu speichern.",
      "Wenn Planung, Monitoring oder Compliance über mehrere Phasen hinweg gesteuert werden.",
    ],
    genericGraphContents: [
      "Ereignisse, Zeitpunkte, Fristen, Versionen, Zustände und Gültigkeitsintervalle.",
      "Beziehungen wie galt ab, galt bis, ersetzt, verursacht, blockiert oder aktualisiert.",
      "Aktuelle und historische Sichten auf denselben Sachverhalt.",
    ],
    genericLlmRole: [
      "Das LLM bestimmt zuerst den relevanten Stichtag.",
      "Es trennt aktuelle, vergangene und zukünftige Aussagen.",
      "Es erklärt, welche Änderung welche Entscheidung beeinflusst.",
    ],
    whenUseful: [
      "Wenn Umsetzungsfristen, Geltungszeitpunkte oder Übergangsphasen wichtig sind.",
      "Wenn eine Antwort zwischen aktuellem und zukünftigem Zustand unterscheiden muss.",
      "Wenn ein Launch-Plan an rechtliche und interne Meilensteine gekoppelt ist.",
    ],
    modellingNotes: [
      "Knoten stehen für Ereignisse, Versionen, Zustände und Fristen.",
      "Kanten tragen Gültigkeitslogik wie galt ab, ersetzt, verursacht oder blockiert.",
      "Der aktuelle Stand wird nicht überschrieben, sondern aus Historie und Stichtag berechnet.",
    ],
    userActions: [
      {
        title: "Stichtag nennen",
        body: "Der Nutzer sagt, ob er eine Antwort für heute, für den geplanten Launch oder für eine spätere Frist braucht.",
      },
      {
        title: "Version prüfen",
        body: "Er kontrolliert, welche Dokumentversion und welcher Produktstatus für die Antwort gelten.",
      },
      {
        title: "Plan aktualisieren",
        body: "Der Nutzer passt Meilensteine an, wenn neue Fristen oder Zustände relevant werden.",
      },
    ],
    graphContents: [
      {
        title: "Zeitknoten",
        body: "Der Graph enthält Daten, Fristen, Versionen, Ereignisse, Zustände und Gültigkeitsintervalle.",
      },
      {
        title: "Historische Kanten",
        body: "Kanten zeigen, was ab wann galt, was ersetzt wurde und welche Änderung welchen Zustand ausgelöst hat.",
      },
      {
        title: "Aktueller Kontext",
        body: "Der gültige Antwortkontext wird aus Stichtag, Version und Zustand berechnet.",
      },
    ],
    llmActions: [
      {
        title: "Zeitkontext bestimmen",
        body: "Das LLM fragt nicht nur nach relevanten Pflichten, sondern nach Pflichten zum passenden Zeitpunkt.",
      },
      {
        title: "Heute und später trennen",
        body: "Es unterscheidet aktuelle Aussage, künftige Änderung und Planungsrisiko.",
      },
      {
        title: "Zeitsensible Antwort schreiben",
        body: "Die Antwort benennt, was jetzt gilt, was später relevant wird und welche Entscheidung dadurch betroffen ist.",
      },
    ],
    interactionLoop: [
      {
        title: "User",
        body: "Nennt Stichtag, Launch-Termin oder gewünschte Perspektive.",
      },
      {
        title: "Graph",
        body: "Liefert gültige Zustände, Versionen, Fristen und Änderungsereignisse.",
      },
      {
        title: "LLM",
        body: "Erklärt aktuelle und künftige Relevanz getrennt.",
      },
      {
        title: "User",
        body: "Passt den Zeitplan oder fragt nach einer anderen Frist.",
      },
    ],
    promptPackage: [
      "Nutzerfrage mit Stichtag oder Launch-Termin",
      "Gültige Dokumentversion",
      "Aktuelle Zustände und spätere Fristen",
      "Änderungsereignisse mit Ursache",
      "Regel, Zeitbezug in jeder Aussage sichtbar zu machen",
    ],
    nodes: [
      { id: "q", label: "Zeitfrage", kind: "query", x: 75, y: 170 },
      { id: "now", label: "Heute", kind: "event", x: 235, y: 90 },
      { id: "future", label: "Frist", kind: "event", x: 405, y: 90 },
      { id: "version", label: "Version", kind: "source", x: 235, y: 260 },
      { id: "state", label: "Status", kind: "decision", x: 405, y: 260 },
      { id: "plan", label: "Launch-Plan", kind: "decision", x: 585, y: 170 },
    ],
    edges: [
      { id: "e1", source: "q", target: "now", label: "fragt für" },
      { id: "e2", source: "now", target: "state", label: "gilt als" },
      { id: "e3", source: "future", target: "state", label: "ändert" },
      { id: "e4", source: "version", target: "state", label: "belegt" },
      { id: "e5", source: "state", target: "plan", label: "steuert" },
    ],
    steps: [
      {
        label: "Zeitpunkt setzen",
        detail: "Die Simulation beantwortet nicht allgemein, sondern bezogen auf einen Stichtag.",
        observation: "Der Nutzer sieht sofort, ob die Antwort aktuell oder zukünftig gilt.",
      },
      {
        label: "Änderungen vergleichen",
        detail: "Versionen, Fristen und Zustände werden getrennt modelliert.",
        observation: "Die Demo kann zeigen, warum eine spätere Pflicht heute schon relevant ist.",
      },
      {
        label: "Plan aktualisieren",
        detail: "Der Launch-Plan bekommt zeitabhängige Bedingungen.",
        observation: "Das Ergebnis ist kein statischer Befund, sondern ein lebender Entscheidungskontext.",
      },
    ],
  },
];

export function getDemoGraphType(id: DemoGraphTypeId): DemoGraphType {
  return DEMO_GRAPH_TYPES.find((type) => type.id === id) ?? DEMO_GRAPH_TYPES[0];
}

export function getDemoGraphTypeBySlug(slug: string): DemoGraphType | undefined {
  return DEMO_GRAPH_TYPES.find((type) => type.slug === slug);
}
