"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GitBranch, History, Network, Route, Scale, Search, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { GraphPreview } from "@/components/molecules/graph-preview";
import type { QuerySuggestionGroup } from "@/components/molecules/query-input";
import { ActionCard } from "@/components/organisms/action-card";
import { AnswerCard } from "@/components/organisms/answer-card";
import {
  getStatusHint,
  type QueryPanelStatus,
} from "@/components/organisms/query-panel-status";
import { RationaleCard } from "@/components/organisms/rationale-card";
import { buildHomeGraphModel, type HomeGraphModel } from "@/features/home/graph-view-model";
import { PipelineStepper } from "@/features/home/molecules/PipelineStepper";
import type { QueryContextElement, QueryReference, QuerySuccessResponse } from "@/features/query/contracts";
import {
  buildGraphRagPromptMessages,
  buildLlmOnlyPromptMessages,
  type PromptMessage,
} from "@/features/query/prompt-templates";
import { buildQueryViewModel, type QueryViewModel } from "@/features/query/view-model";

const QueryInput = dynamic(
  () => import("@/components/molecules/query-input").then((module) => module.QueryInput),
  { ssr: false },
);
const SESSION_HISTORY_LIMIT = 8;

type SessionHistoryEntry = {
  sessionId: string;
  query: string;
  answerPreview: string;
  createdAt: string;
  referenceCount: number;
};

type QualitySignalState = "green" | "yellow" | "red";

type QualitySignal = {
  label: string;
  value: string;
  state: QualitySignalState;
};

type LlmOnlyAnswer = {
  main: string;
  coreRationale: string;
  nextSteps: string[];
};

type PersistedAnalysisState = {
  locale: "de" | "en";
  query: string;
  viewModel: QueryViewModel | null;
  llmOnlyAnswer: LlmOnlyAnswer | null;
  llmOnlyError: string | null;
  isQuestionSelectionLocked: boolean;
  status: QueryPanelStatus;
  isLlmOnlyExpanded?: boolean;
  isGraphRagExpanded?: boolean;
  isSessionMemoryExpanded?: boolean;
};

type PersistedSessionSnapshot = {
  locale: "de" | "en";
  sessionId: string;
  query: string;
  viewModel: QueryViewModel;
  llmOnlyAnswer: LlmOnlyAnswer | null;
  llmOnlyError: string | null;
  status: "success" | "empty";
  createdAt: string;
};

function getDefaultQuery(locale: "de" | "en"): string {
  return locale === "en"
    ? "Where do we lose time day to day because work keeps bouncing between teams?"
    : "Wo verlieren wir im Alltag Zeit, weil Aufgaben zwischen Teams hin und her gehen?";
}

function getSuggestionGroups(locale: "de" | "en"): QuerySuggestionGroup[] {
  if (locale === "en") {
    return [
      {
        category: "Teamwork & handoffs",
        questions: [
          "Where do we lose time day to day because work keeps bouncing between teams?",
          "Why do we still need so much coordination even after introducing new tools?",
          "How do we reduce follow-up questions at team handoff points?",
          "Which information is typically missing at the handoff point?",
        ],
      },
      {
        category: "Delivery & operations",
        questions: [
          "What happens when we try to deliver faster than operations can absorb?",
          "How do we gain more stability without slowing releases to a halt?",
          "Which signals tell us early that the system is running overloaded?",
          "How do we stop urgent work from permanently crowding out the plan?",
        ],
      },
      {
        category: "Steering & priorities",
        questions: [
          "What side effects appear when each team optimizes only locally?",
          "Why do priorities keep shifting even though the goals are clear?",
          "How do we spot rules or incentives that reward the wrong behavior?",
          "Where is a small leverage point likely to have the biggest effect?",
        ],
      },
      {
        category: "Communication & decisions",
        questions: [
          "Why do meetings keep circling even when everyone is informed?",
          "How do we make faster decisions without losing important perspectives?",
          "Which signals show that information gets distorted inside the system?",
          "How do we avoid decisions being rolled back later on?",
          "Where do misunderstandings between business and engineering happen most often?",
        ],
      },
      {
        category: "Learning & improvement",
        questions: [
          "Why do the same problems repeat even after retrospectives?",
          "How do we build a learning loop that people actually use in day-to-day work?",
          "Which small experiments help us test causes instead of symptoms?",
          "How do we notice early whether an improvement is truly systemic?",
          "How do we avoid action bias and prioritize the improvements that really matter?",
        ],
      },
    ];
  }

  return [
    {
      category: "Teamarbeit & Übergaben",
      questions: [
        "Wo verlieren wir im Alltag Zeit, weil Aufgaben zwischen Teams hin und her gehen?",
        "Warum gibt es trotz neuer Tools immer noch so viele Abstimmungen?",
        "Wie reduzieren wir Rückfragen bei Übergaben zwischen Teams?",
        "Welche Informationen fehlen typischerweise am Übergabepunkt?",
      ],
    },
    {
      category: "Lieferfähigkeit & Betrieb",
      questions: [
        "Was passiert, wenn wir schneller liefern wollen als unser Betrieb mitkommt?",
        "Wie bekommen wir mehr Stabilität, ohne Releases komplett auszubremsen?",
        "Woran merken wir früh, dass unser System überlastet läuft?",
        "Wie vermeiden wir, dass Notfallarbeit den Plan dauerhaft verdrängt?",
      ],
    },
    {
      category: "Steuerung & Prioritäten",
      questions: [
        "Welche Nebenwirkungen hat es, wenn jedes Team nur lokal optimiert?",
        "Warum kippen Prioritäten ständig, obwohl wir klare Ziele haben?",
        "Wie erkennen wir Regeln oder Anreize, die falsches Verhalten fördern?",
        "Wo lohnt ein kleiner Hebel mit großer Wirkung am meisten?",
      ],
    },
    {
      category: "Kommunikation & Entscheidungen",
      questions: [
        "Warum drehen wir uns in Meetings oft im Kreis, obwohl alle informiert sind?",
        "Wie treffen wir schneller Entscheidungen, ohne wichtige Perspektiven zu verlieren?",
        "Welche Signale zeigen, dass Informationen im System verzerrt ankommen?",
        "Wie verhindern wir, dass Entscheidungen später wieder zurückgerollt werden?",
        "Wo entstehen Missverständnisse zwischen Fachbereich und Technik am häufigsten?",
      ],
    },
    {
      category: "Lernen & Verbesserung",
      questions: [
        "Warum wiederholen sich dieselben Probleme trotz Retrospektiven?",
        "Wie bauen wir eine Lernschleife auf, die im Alltag wirklich genutzt wird?",
        "Welche kleinen Experimente helfen uns, Ursachen statt Symptome zu testen?",
        "Wie erkennen wir früh, ob eine Verbesserung wirklich systemisch wirkt?",
        "Wie vermeiden wir Aktionismus und priorisieren wirksame Verbesserungen?",
      ],
    },
  ];
}

/**
 * Renders the interactive query workflow and orchestrates API request state.
 */
type QueryPanelProps = {
  locale: "de" | "en";
};

export function QueryPanel({ locale }: QueryPanelProps): React.JSX.Element {
  const SESSION_HISTORY_KEY = `system-graph-rag-history-v1-${locale}`;
  const SESSION_ANALYSIS_KEY = `system-graph-rag-analysis-v1-${locale}`;
  const SESSION_SNAPSHOTS_KEY = `system-graph-rag-session-snapshots-v1-${locale}`;
  const tQuery = useTranslations("Query");
  const tStatus = useTranslations("QueryStatus");
  const isEn = locale === "en";
  const copy = {
    workflowTitle: isEn ? "Answer flow" : "Antwortführung",
    answerBuildTitle: isEn ? "Answer assembly" : "Antwortaufbau",
    running: isEn ? "running" : "läuft",
    answerBuildBody: isEn
      ? "Context selection -> graph context -> synthesis. The answer is being assembled from selected nodes and evidence."
      : "Kontextauswahl -> Graph-Kontext -> Synthese. Die Antwort wird gerade aus ausgewählten Knoten und Belegen aufgebaut.",
    qualityGateIdle: isEn
      ? "No analysis yet. Submit a question to inspect quality signals, references, and context budget."
      : "Noch keine Analyse durchgeführt. Sende eine Frage, um Bewertung, Referenzen und Kontextbudget zu sehen.",
    llmNodeTitle: isEn ? "Node selection for the LLM" : "Node-Auswahl fürs LLM",
    llmNodeBadge: isEn ? "Context selection transparency" : "Transparenz der Kontextauswahl",
    llmNodeBody: isEn
      ? "The system first identifies fitting concepts through embedding match and graph score, adds related evidence, and expands to direct neighbors when needed. Only this selected set is sent to the LLM as structured context."
      : "Das System ermittelt zuerst passende Konzepte über Embedding-Match und Graph-Score, ergänzt zugehörige Belege und erweitert bei Bedarf über einen Hop auf direkte Nachbarn. Nur diese Auswahl wird als strukturierter Kontext an das LLM übergeben.",
    llmNodeEmpty: isEn
      ? "No nodes selected yet. After the first run you will see the actual selection including score and hop."
      : "Noch keine Knoten ausgewählt. Nach dem ersten Lauf siehst du hier die tatsächliche Auswahl inklusive Score und Hop.",
    ragDiffTitle: "RAG vs GraphRAG",
    ragDiffBadge: isEn ? "3 core differences" : "3 Kernunterschiede",
    ragDiff1: isEn
      ? "Context shape: classic RAG mainly returns text chunks; GraphRAG also returns explicit relations between nodes."
      : "Kontextform: Klassisches RAG liefert primär Textabschnitte; GraphRAG liefert zusätzlich Beziehungen zwischen Knoten.",
    ragDiff2: isEn
      ? "Traceability: with GraphRAG the reasoning path across nodes and edges stays visible, not just text snippets."
      : "Nachvollziehbarkeit: Bei GraphRAG ist die Herleitung über Knoten und Kanten sichtbar, nicht nur über Textausschnitte.",
    ragDiff3: isEn
      ? "Multi-hop logic: GraphRAG can intentionally include neighbors across hops and structure cause chains more clearly."
      : "Mehrhop-Logik: GraphRAG kann Nachbarn gezielt über Hops einbeziehen und dadurch Ursachenketten strukturierter abbilden.",
    graphHelpBadge: isEn ? "Why the graph helps" : "Warum der Graph hilft",
    llmOnlyLabel: isEn ? "LLM only" : "Nur LLM",
    llmOnlyLoading: isEn ? "Loading LLM-only answer..." : "Lade LLM-only Antwort…",
    llmOnlyEmpty: isEn
      ? "No request sent yet. Submit a question to compare both variants."
      : "Noch keine Anfrage gesendet. Sende eine Frage, um beide Varianten zu vergleichen.",
    graphStatsNoSteps: isEn ? "No steps returned (LLM only)." : "Keine Schritte geliefert (LLM-only).",
    graphStatsSuffix: isEn ? "steps, without graph evidence." : "Schritte, ohne Graph-Belege.",
    graphRagLabel: "GraphRAG",
    more: isEn ? "Show more" : "Mehr anzeigen",
    less: isEn ? "Show less" : "Weniger anzeigen",
    promptInspector: isEn ? "Prompt inspector (read only)" : "Prompt-Inspector (Read only)",
    llmPrompt: isEn ? "LLM-only prompt" : "Nur LLM Prompt",
    graphPrompt: "GraphRAG Prompt",
    graphContextPayload: isEn ? "GraphRAG context payload for the LLM" : "GraphRAG Kontext-Paket an das LLM",
    sessionMemory: "Session Memory",
    storedLocally: isEn ? "stored locally" : "lokal gespeichert",
    collapse: isEn ? "Collapse" : "Einklappen",
    expand: isEn ? "Expand" : "Ausklappen",
    clearHistory: isEn ? "Clear history" : "Verlauf löschen",
    noHistory: isEn ? "No local session history available yet." : "Noch keine lokalen Verlaufsdaten vorhanden.",
    noNextSteps: isEn ? "No next steps available yet. Submit a question to generate concrete actions." : "Noch keine Handlungsschritte verfügbar. Sende eine Frage, um konkrete Schritte zu erhalten.",
    contextAndTools: isEn ? "Context and tools" : "Kontext und Tools",
    systemGraph: isEn ? "System thinking full graph" : "System Thinking Gesamtgraph",
    graphExplorer: "Graph Explorer",
    referencesTitle: isEn ? "Reference concepts" : "Referenzkonzepte",
    waitingForAnswer: isEn ? "Waiting for answer" : "Warten auf Antwort",
    referencesCount: (count: number) => (isEn ? `${count} reference${count > 1 ? "s" : ""}` : `${count} Referenz${count > 1 ? "en" : ""}`),
    openExplanation: isEn ? "Open explanation" : "Erklärung öffnen",
    referenceEmpty: isEn
      ? "After a successful answer we will show up to three reference concepts here together with the concrete tools."
      : "Nach erfolgreicher Antwort zeigen wir hier maximal drei Referenzkonzepte mit konkreten Tools an.",
    derivationTitle: isEn ? "Derivation details" : "Herleitungsdetails",
    derivationBadge: isEn ? "contextual depth" : "kontextuelle Tiefe",
    source: isEn ? "Source" : "Quelle",
    derivationEmpty: isEn
      ? "After a successful answer, the most relevant context summaries and sources will appear here."
      : "Nach erfolgreicher Antwort erscheinen hier die wichtigsten Kontextsummaries plus Quelle.",
    explorerTitle: isEn ? "Traversable Graph Explorer" : "Traversierbarer Graph Explorer",
    answerGraph: isEn ? "Answer graph" : "Antwortgraph",
    fullGraph: isEn ? "Full graph" : "Gesamtgraph",
    highlightEvidence: isEn ? "Highlight evidence nodes" : "Beleg-Knoten hervorheben",
    on: isEn ? "On" : "An",
    off: isEn ? "Off" : "Aus",
    close: isEn ? "Close" : "Schließen",
    systemGraphLoading: isEn ? "System graph is loading..." : "System-Graph wird geladen…",
    noGraph: isEn ? "No graph available." : "Kein Graph verfügbar.",
    invalidQuestion: isEn ? "Please enter a valid question." : "Bitte gib eine gültige Frage ein.",
    answerLoadError: isEn ? "Could not load answer." : "Antwort konnte nicht geladen werden.",
    llmOnlyLoadError: isEn ? "Could not load LLM-only answer." : "LLM-only Antwort konnte nicht geladen werden.",
    unexpectedError: isEn ? "Unexpected error while running the request." : "Unerwarteter Fehler während der Anfrage.",
    systemGraphLoadError: isEn ? "Could not load system graph." : "System-Graph konnte nicht geladen werden.",
    systemGraphCaption: (nodes: number, edges: number) =>
      isEn
        ? `System thinking full graph: ${nodes} nodes, ${edges} edges.`
        : `System Thinking Gesamtgraph: ${nodes} Knoten, ${edges} Kanten.`,
  };
  const suggestionGroups = getSuggestionGroups(locale);
  const [query, setQuery] = useState(getDefaultQuery(locale));
  const [viewModel, setViewModel] = useState<QueryViewModel | null>(null);
  const [status, setStatus] = useState<QueryPanelStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuestionSelectionLocked, setIsQuestionSelectionLocked] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [explorerMode, setExplorerMode] = useState<"query" | "system">("query");
  const [systemGraphModel, setSystemGraphModel] = useState<HomeGraphModel | null>(null);
  const [isSystemGraphLoading, setIsSystemGraphLoading] = useState(false);
  const [isSelectionHighlightEnabled, setIsSelectionHighlightEnabled] = useState(true);
  const [expandedDerivationIds, setExpandedDerivationIds] = useState<Record<string, boolean>>({});
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const [sessionSnapshots, setSessionSnapshots] = useState<PersistedSessionSnapshot[]>([]);
  const [llmOnlyAnswer, setLlmOnlyAnswer] = useState<LlmOnlyAnswer | null>(null);
  const [isLlmOnlyLoading, setIsLlmOnlyLoading] = useState(false);
  const [llmOnlyError, setLlmOnlyError] = useState<string | null>(null);
  const [isLlmOnlyExpanded, setIsLlmOnlyExpanded] = useState(false);
  const [isGraphRagExpanded, setIsGraphRagExpanded] = useState(false);
  const [isSessionMemoryExpanded, setIsSessionMemoryExpanded] = useState(true);
  const [didHydrateLocalState, setDidHydrateLocalState] = useState(false);

  const statusHint = getStatusHint(
    status,
    {
      idle: { statusText: tStatus("idleText"), nextAction: tStatus("idleAction") },
      loading: { statusText: tStatus("loadingText"), nextAction: tStatus("loadingAction") },
      success: { statusText: tStatus("successText"), nextAction: tStatus("successAction") },
      error: { statusText: tStatus("errorText"), nextAction: tStatus("errorAction") },
      empty: { statusText: tStatus("emptyText"), nextAction: tStatus("emptyAction") },
    },
    errorMessage,
  );
  const helperText = statusHint.statusText;
  const statusAction = statusHint.nextAction;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_HISTORY_KEY);
      if (!raw) {
        setSessionHistory([]);
      } else {
        const parsed = JSON.parse(raw) as SessionHistoryEntry[];
        if (Array.isArray(parsed)) {
          setSessionHistory(
            parsed
              .slice(0, SESSION_HISTORY_LIMIT)
              .map((entry, index) => ({
                ...entry,
                sessionId:
                  typeof entry.sessionId === "string" && entry.sessionId.length > 0
                    ? entry.sessionId
                    : `${entry.createdAt ?? "legacy"}-${index}`,
              })),
          );
        }
      }
    } catch {
      // Ignore malformed local storage payloads.
    }

    try {
      const raw = window.localStorage.getItem(SESSION_SNAPSHOTS_KEY);
      if (!raw) {
        setSessionSnapshots([]);
      } else {
        const parsed = JSON.parse(raw) as PersistedSessionSnapshot[];
        if (Array.isArray(parsed)) {
          setSessionSnapshots(
            parsed
              .filter((entry) => !entry.locale || entry.locale === locale)
              .slice(0, SESSION_HISTORY_LIMIT),
          );
        }
      }
    } catch {
      // Ignore malformed local storage payloads.
    }

    try {
      const raw = window.localStorage.getItem(SESSION_ANALYSIS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedAnalysisState;
        if (parsed.locale && parsed.locale !== locale) {
          return;
        }
        if (typeof parsed.query === "string") {
          setQuery(parsed.query);
        }
        if (parsed.viewModel) {
          setViewModel(parsed.viewModel);
        }
        if (parsed.llmOnlyAnswer) {
          setLlmOnlyAnswer(parsed.llmOnlyAnswer);
        }
        setLlmOnlyError(typeof parsed.llmOnlyError === "string" ? parsed.llmOnlyError : null);
        setIsQuestionSelectionLocked(parsed.isQuestionSelectionLocked === true);
        setIsLlmOnlyExpanded(parsed.isLlmOnlyExpanded === true);
        setIsGraphRagExpanded(parsed.isGraphRagExpanded === true);
        if (typeof parsed.isSessionMemoryExpanded === "boolean") {
          setIsSessionMemoryExpanded(parsed.isSessionMemoryExpanded);
        }
        if (parsed.status === "success" || parsed.status === "empty") {
          setStatus(parsed.status);
        }
      }
    } catch {
      // Ignore malformed persisted analysis payloads.
    } finally {
      setDidHydrateLocalState(true);
    }
  }, [SESSION_ANALYSIS_KEY, SESSION_HISTORY_KEY, SESSION_SNAPSHOTS_KEY, locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(sessionHistory.slice(0, SESSION_HISTORY_LIMIT)));
    } catch {
      // Ignore storage quota/browser restrictions.
    }
  }, [SESSION_HISTORY_KEY, sessionHistory]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SESSION_SNAPSHOTS_KEY,
        JSON.stringify(sessionSnapshots.slice(0, SESSION_HISTORY_LIMIT)),
      );
    } catch {
      // Ignore storage quota/browser restrictions.
    }
  }, [SESSION_SNAPSHOTS_KEY, sessionSnapshots]);

  useEffect(() => {
    if (!didHydrateLocalState || status === "loading") {
      return;
    }

    const payload: PersistedAnalysisState = {
      locale,
      query,
      viewModel,
      llmOnlyAnswer,
      llmOnlyError,
      isQuestionSelectionLocked,
      status,
      isLlmOnlyExpanded,
      isGraphRagExpanded,
      isSessionMemoryExpanded,
    };
    const hasPayload =
      query.trim().length > 0 ||
      viewModel !== null ||
      llmOnlyAnswer !== null ||
      (llmOnlyError ?? "").trim().length > 0;
    try {
      if (hasPayload) {
        window.localStorage.setItem(SESSION_ANALYSIS_KEY, JSON.stringify(payload));
      } else {
        window.localStorage.removeItem(SESSION_ANALYSIS_KEY);
      }
    } catch {
      // Ignore storage quota/browser restrictions.
    }
  }, [
    didHydrateLocalState,
    isQuestionSelectionLocked,
    llmOnlyAnswer,
    llmOnlyError,
    locale,
    query,
    SESSION_ANALYSIS_KEY,
    status,
    viewModel,
    isLlmOnlyExpanded,
    isGraphRagExpanded,
    isSessionMemoryExpanded,
  ]);

  /**
   * Loads GraphRAG and LLM-only answers for a query and updates UI state.
   */
  const runQuery = async (rawQuery: string, addToHistory: boolean) => {
    const trimmedQuery = rawQuery.trim();
    if (!trimmedQuery) {
      setErrorMessage(copy.invalidQuestion);
      setStatus("error");
      return;
    }

    setQuery(trimmedQuery);
    setStatus("loading");
    setErrorMessage(null);
    setLlmOnlyError(null);
    setIsLlmOnlyLoading(true);
    setLlmOnlyAnswer(null);

    try {
      const [graphResponse, llmOnlyResponse] = await Promise.all([
        fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmedQuery }),
          cache: "no-store",
        }),
        fetch("/api/query/llm-only", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmedQuery }),
          cache: "no-store",
        }),
      ]);

      if (!graphResponse.ok) {
        const remoteMessage = await graphResponse.text();
        throw new Error(remoteMessage || copy.answerLoadError);
      }

      const payload = (await graphResponse.json()) as QuerySuccessResponse;
      const viewModel = buildQueryViewModel(payload, trimmedQuery);
      const resolvedStatus: "success" | "empty" = viewModel.references.length === 0 ? "empty" : "success";
      let llmOnlyAnswerSnapshot: LlmOnlyAnswer | null = null;
      let llmOnlyErrorSnapshot: string | null = null;
      setViewModel(viewModel);
      setStatus(resolvedStatus);
      setIsQuestionSelectionLocked(true);

      if (llmOnlyResponse.ok) {
        const llmOnlyPayload = (await llmOnlyResponse.json()) as {
          status: "ok";
          answer: LlmOnlyAnswer;
        };
        llmOnlyAnswerSnapshot = llmOnlyPayload.answer;
        setLlmOnlyAnswer(llmOnlyPayload.answer);
      } else {
        const llmErrorText = await llmOnlyResponse.text();
        llmOnlyErrorSnapshot = llmErrorText || copy.llmOnlyLoadError;
        setLlmOnlyError(llmOnlyErrorSnapshot);
      }

      if (addToHistory) {
        const createdAt = new Date().toISOString();
        const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setSessionHistory((current) => {
          const next: SessionHistoryEntry = {
            sessionId,
            query: trimmedQuery,
            answerPreview: viewModel.answer.main.slice(0, 180),
            createdAt,
            referenceCount: viewModel.references.length,
          };
          return [next, ...current].slice(0, SESSION_HISTORY_LIMIT);
        });
        setSessionSnapshots((current) => {
          const next: PersistedSessionSnapshot = {
            locale,
            sessionId,
            query: trimmedQuery,
            viewModel,
            llmOnlyAnswer: llmOnlyAnswerSnapshot,
            llmOnlyError: llmOnlyErrorSnapshot,
            status: resolvedStatus,
            createdAt,
          };
          return [next, ...current].slice(0, SESSION_HISTORY_LIMIT);
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy.unexpectedError;
      setErrorMessage(message);
      setStatus("error");
    } finally {
      setIsLlmOnlyLoading(false);
    }
  };

  /**
   * Submits the current query to the API and updates panel state from the response.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runQuery(query, true);
  };

  const loadSessionFromStorage = (entry: SessionHistoryEntry) => {
    const snapshot = sessionSnapshots.find((candidate) => candidate.sessionId === entry.sessionId);
    if (!snapshot) {
      setQuery(entry.query);
      return;
    }

    setQuery(snapshot.query);
    setViewModel(snapshot.viewModel);
    setLlmOnlyAnswer(snapshot.llmOnlyAnswer);
    setLlmOnlyError(snapshot.llmOnlyError);
    setErrorMessage(null);
    setStatus(snapshot.status);
    setIsQuestionSelectionLocked(true);
    setIsLlmOnlyLoading(false);
    setIsLlmOnlyExpanded(false);
    setIsGraphRagExpanded(false);
  };

  const references = viewModel?.references ?? [];
  const derivationDetails = viewModel?.derivationDetails ?? [];
  const nextSteps = viewModel?.nextSteps ?? [];
  const hasReferences = references.length > 0;
  const hasDerivationDetails = derivationDetails.length > 0;
  const mainAnswer =
    viewModel?.answer.main ??
    isEn
      ? "Ready for analysis. Submit a question to start the evaluation."
      : "Bereit zur Analyse. Stelle eine Frage und starte die Auswertung.";
  const coreRationale =
    viewModel?.answer.coreRationale ??
    (isEn
      ? "The concise P0 core evidence will appear here once an answer is available."
      : "Hier wird der knappe P0-Kernnachweis angezeigt, sobald eine Antwort vorliegt.");
  const graphModel = buildHomeGraphModel(viewModel, query, locale);
  const explorerGraphModel = explorerMode === "system" ? systemGraphModel : graphModel;
  const qualitySignals = buildQualitySignals(
    references.length,
    viewModel?.contextTokens ?? 0,
    new Set(references.map((reference) => reference.nodeType)).size,
    derivationDetails.length,
  );
  const overallQualityState = getOverallQualityState(qualitySignals);
  const graphRagPromptPreview = formatPromptMessagesForDisplay(
    buildGraphRagPromptMessages(query, references, viewModel?.contextElements ?? []),
  );
  const llmOnlyPromptPreview = formatPromptMessagesForDisplay(buildLlmOnlyPromptMessages(query));
  const graphRagContextPayloadPreview = buildGraphContextPayloadPreview(
    query,
    references,
    viewModel?.contextElements ?? [],
  );

  const openExplorer = async (mode: "query" | "system") => {
    setExplorerMode(mode);
    setIsExplorerOpen(true);

    if (mode !== "system" || isSystemGraphLoading || systemGraphModel) {
      return;
    }

    setIsSystemGraphLoading(true);
    try {
      const response = await fetch("/api/graph/full", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(copy.systemGraphLoadError);
      }

      const payload = (await response.json()) as {
        status: "ok";
        graph: {
          nodes: Array<{
            id: string;
            label: string;
            nodeType: string;
            shortDescription: string;
            longDescription: string;
            url?: string;
          }>;
          edges: Array<{ id: string; source: string; target: string; label: string }>;
        };
      };

      const fullGraph: HomeGraphModel = {
        isFallback: false,
        caption: copy.systemGraphCaption(payload.graph.nodes.length, payload.graph.edges.length),
        nodes: payload.graph.nodes.map((node) => ({
          id: node.id,
          label: `${node.nodeType}: ${node.label}`,
          compactLabel: node.label,
          shortDescription: node.shortDescription,
          longDescription: node.longDescription,
          url: node.url,
          kind: node.nodeType === "Problem" ? "evidence" : "reference",
          nodeType: node.nodeType,
          x: 0,
          y: 0,
        })),
        edges: payload.graph.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
        })),
      };

      setSystemGraphModel(fullGraph);
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.systemGraphLoadError;
      setErrorMessage(message);
    } finally {
      setIsSystemGraphLoading(false);
    }
  };

  const handleResetQuestionSession = () => {
    setIsQuestionSelectionLocked(false);
    setViewModel(null);
    setErrorMessage(null);
    setStatus("idle");
    setQuery("");
    setExpandedDerivationIds({});
    setLlmOnlyAnswer(null);
    setLlmOnlyError(null);
    setIsLlmOnlyLoading(false);
    setIsLlmOnlyExpanded(false);
    setIsGraphRagExpanded(false);
  };

  const toggleDerivationDetail = (nodeId: string) => {
    setExpandedDerivationIds((current) => ({
      ...current,
      [nodeId]: !current[nodeId],
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(330px,37%)]">
      <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-slate-50/30 -z-10" />
        <h2 className="flex items-center gap-2 text-[1.125rem] font-bold text-slate-900 border-b border-slate-200/60 pb-4">
          <Route className="h-5 w-5 text-sky-600" aria-hidden />
          <span>{copy.workflowTitle}</span>
        </h2>

        <PipelineStepper locale={locale} status={status} />

        <QueryInput
          query={query}
          suggestionGroups={suggestionGroups}
          onSuggestionSelect={setQuery}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          onResetQuestionSession={handleResetQuestionSession}
          helperText={helperText}
          nextAction={statusAction}
          isSubmitting={status === "loading"}
          isQuestionSelectionLocked={isQuestionSelectionLocked}
        />
        {status === "loading" ? (
          <section className="rounded-xl border border-sky-200 bg-sky-50 p-3">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <Route className="h-3.5 w-3.5" aria-hidden />
                <span>{copy.answerBuildTitle}</span>
              </h3>
              <span className="text-xs text-sky-700">{copy.running}</span>
            </div>
            <p className="text-xs leading-6 text-slate-700">
              {copy.answerBuildBody}
            </p>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-slate-400" aria-hidden />
              <span>Quality Gate</span>
            </h3>
            {status !== "idle" ? (
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getQualityStateClasses(overallQualityState)}`}>
                {getOverallQualityLabel(overallQualityState)}
              </span>
            ) : null}
          </div>
          {status === "idle" ? (
            <p className="text-xs leading-6 text-slate-700">{copy.qualityGateIdle}</p>
          ) : (
            <div className="grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
              {qualitySignals.map((signal) => (
                <p key={signal.label} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${getQualityDotClasses(signal.state)}`} />
                  <span>{signal.label}:</span>
                  <span className="font-semibold">{signal.value}</span>
                </p>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <Network className="h-4 w-4 text-slate-400" aria-hidden />
              <span>{copy.llmNodeTitle}</span>
            </h3>
            <span className="text-xs text-slate-500">{copy.llmNodeBadge}</span>
          </div>
          <p className="text-xs leading-6 text-slate-700">{copy.llmNodeBody}</p>
          {references.length > 0 ? (
            <ul className="mt-2 space-y-1 rounded-md border border-slate-200 bg-slate-50 p-2">
              {references.slice(0, 3).map((reference) => (
                <li key={reference.nodeId} className="text-xs text-slate-700">
                  <span className="font-semibold">{reference.title}</span>{" "}
                  <span className="text-slate-500">
                    ({reference.nodeType}, Score {reference.score.toFixed(3)}, Hop {reference.hop})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              {copy.llmNodeEmpty}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <GitBranch className="h-4 w-4 text-slate-400" aria-hidden />
              <span>RAG vs GraphRAG</span>
            </h3>
            <span className="text-xs text-slate-500">{copy.ragDiffBadge}</span>
          </div>
          <ul className="space-y-1 text-xs leading-6 text-slate-700">
            <li>{copy.ragDiff1}</li>
            <li>{copy.ragDiff2}</li>
            <li>{copy.ragDiff3}</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <Scale className="h-4 w-4 text-slate-400" aria-hidden />
              <span>LLM-only vs GraphRAG</span>
            </h3>
            <span className="text-xs text-slate-500">{copy.graphHelpBadge}</span>
          </div>
          <div className="grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
              <p className="font-semibold text-slate-800">{copy.llmOnlyLabel}</p>
              {isLlmOnlyLoading ? (
                <p className="mt-1">{copy.llmOnlyLoading}</p>
              ) : llmOnlyError ? (
                <p className="mt-1 text-rose-700">{llmOnlyError}</p>
              ) : llmOnlyAnswer ? (
                <>
                  <p className="mt-1 leading-6">
                    {isLlmOnlyExpanded ? llmOnlyAnswer.main : truncatePreview(llmOnlyAnswer.main, 260)}
                  </p>
                  {shouldShowPreviewToggle(llmOnlyAnswer.main, 260) ? (
                    <button
                      type="button"
                      className="mt-1 text-xs font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2"
                      onClick={() => setIsLlmOnlyExpanded((current) => !current)}
                    >
                      {isLlmOnlyExpanded ? copy.less : copy.more}
                    </button>
                  ) : null}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {llmOnlyAnswer.nextSteps.length > 0
                      ? `${llmOnlyAnswer.nextSteps.length} ${copy.graphStatsSuffix}`
                      : copy.graphStatsNoSteps}
                  </p>
                </>
              ) : (
                <p className="mt-1">{copy.llmOnlyEmpty}</p>
              )}
            </div>
            <div className="rounded-md border border-sky-200 bg-sky-50 p-2">
              <p className="font-semibold text-slate-800">{copy.graphRagLabel}</p>
              {status === "idle" ? (
                <p className="mt-1">{copy.llmOnlyEmpty}</p>
              ) : (
                <>
                  <p className="mt-1 leading-6">
                    {isGraphRagExpanded ? mainAnswer : truncatePreview(mainAnswer, 260)}
                  </p>
                  {shouldShowPreviewToggle(mainAnswer, 260) ? (
                    <button
                      type="button"
                      className="mt-1 text-xs font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2"
                      onClick={() => setIsGraphRagExpanded((current) => !current)}
                    >
                      {isGraphRagExpanded ? copy.less : copy.more}
                    </button>
                  ) : null}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {references.length} Referenzen, {derivationDetails.length} Details, {viewModel?.contextTokens ?? 0} Tokens.
                  </p>
                </>
              )}
            </div>
          </div>
          <details className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-2">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">
              {copy.promptInspector}
            </summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{copy.llmPrompt}</p>
                <pre className="max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-slate-700">
                  {llmOnlyPromptPreview}
                </pre>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">GraphRAG Prompt</p>
                <pre className="max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-slate-700">
                  {graphRagPromptPreview}
                </pre>
              </div>
            </div>
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {copy.graphContextPayload}
              </p>
              <pre className="max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-slate-700">
                {graphRagContextPayloadPreview}
              </pre>
            </div>
          </details>
        </section>

        <section className="rounded-2xl glass-panel bg-white/40 p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <History className="h-4 w-4 text-slate-400" aria-hidden />
              <span>{copy.sessionMemory}</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">{copy.storedLocally}</span>
              <button
                type="button"
                className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setIsSessionMemoryExpanded((current) => !current)}
              >
                {isSessionMemoryExpanded ? copy.collapse : copy.expand}
              </button>
              <button
                type="button"
                className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setSessionHistory([]);
                  setSessionSnapshots([]);
                  try {
                    window.localStorage.removeItem(SESSION_HISTORY_KEY);
                    window.localStorage.removeItem(SESSION_SNAPSHOTS_KEY);
                  } catch {
                    // Ignore browser restrictions.
                  }
                }}
              >
                {copy.clearHistory}
              </button>
            </div>
          </div>
          {isSessionMemoryExpanded ? (
            sessionHistory.length > 0 ? (
              <ul className="space-y-2">
                {sessionHistory.map((entry) => (
                  <li key={entry.sessionId} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <button
                      type="button"
                      className="w-full text-left text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-2"
                      onClick={() => loadSessionFromStorage(entry)}
                    >
                      {entry.query}
                    </button>
                    <p className="mt-1 text-xs text-slate-600">{entry.answerPreview}...</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {new Date(entry.createdAt).toLocaleString(isEn ? "en-US" : "de-DE")} · {copy.referencesCount(entry.referenceCount)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">{copy.noHistory}</p>
            )
          ) : null}
        </section>

        <AnswerCard
          query={viewModel?.query ?? query}
          answer={mainAnswer}
          contextTokens={viewModel?.contextTokens ?? 0}
          status={status}
        />

        <ActionCard
          steps={
            nextSteps.length > 0
              ? nextSteps
              : [copy.noNextSteps]
          }
          title={tQuery("actionTitle")}
          badge={tQuery("actionBadge")}
        />

        <RationaleCard
          coreRationale={coreRationale}
          title={tQuery("rationaleTitle")}
          badge={tQuery("rationaleBadge")}
          evidenceTitle={tQuery("evidenceTitle")}
          rationaleMarker={tQuery("rationaleMarker")}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <BookOpen className="h-4.5 w-4.5 text-sky-700" aria-hidden />
            <span>{copy.contextAndTools}</span>
          </h2>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => void openExplorer("system")}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <Network className="h-3.5 w-3.5" aria-hidden />
              {copy.systemGraph}
            </button>
            <button
              type="button"
              onClick={() => void openExplorer("query")}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
              Graph Explorer
            </button>
          </div>
        </div>

        <GraphPreview model={graphModel} locale={locale} />

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              <span>{copy.referencesTitle}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {hasReferences ? copy.referencesCount(references.length) : copy.waitingForAnswer}
            </span>
          </div>
          {hasReferences ? (
            <ul className="space-y-2">
              {references.map((reference) => (
                <li
                  key={reference.nodeId}
                  className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 text-sm font-medium">{reference.title}</span>
                    <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-500">
                      {reference.nodeType}
                    </span>
                  </div>
                  {reference.explanationUrl && (
                    <p className="text-xs text-slate-600">
                      <a
                        className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2"
                        href={reference.explanationUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {copy.openExplanation}
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-slate-600">{reference.citation}</p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {reference.tools.map((tool) => (
                      <li
                        key={tool.label}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                        title={tool.label}
                      >
                        <a
                          className="block break-all text-slate-700 underline decoration-slate-300 underline-offset-2"
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {tool.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              {copy.referenceEmpty}
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
              <Route className="h-3.5 w-3.5" aria-hidden />
              <span>{copy.derivationTitle}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">{copy.derivationBadge}</span>
          </div>
          {hasDerivationDetails ? (
            <ul className="space-y-3">
              {derivationDetails.map((detail) => (
                <li key={detail.nodeId} className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-900">
                  <div className="text-sm font-semibold text-slate-900">{detail.label}</div>
                  <p className="text-sm leading-6 text-slate-700">
                    {getDerivationPreviewText(
                      detail.summary,
                      expandedDerivationIds[detail.nodeId] === true,
                    )}
                  </p>
                  {shouldShowDerivationToggle(detail.summary) ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2"
                      onClick={() => toggleDerivationDetail(detail.nodeId)}
                    >
                      {expandedDerivationIds[detail.nodeId] ? copy.less : copy.more}
                    </button>
                  ) : null}
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.source}:</span>{" "}
                    {detail.sourceUrl ? (
                      <a
                        className="underline decoration-slate-300 underline-offset-2"
                        href={detail.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {detail.sourceLabel}
                      </a>
                    ) : (
                      <span>{detail.sourceLabel}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              {copy.derivationEmpty}
            </p>
          )}
        </section>
      </section>

      <AnimatePresence>
        {isExplorerOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setIsExplorerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: 0.18 }}
              className="glass-panel max-h-[94dvh] w-full max-w-[1120px] overflow-x-hidden overflow-y-auto rounded-3xl border border-slate-200/60 p-4 pb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sm:p-5 sm:pb-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {copy.explorerTitle}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExplorerMode("query")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      explorerMode === "query"
                        ? "bg-sky-600 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {copy.answerGraph}
                  </button>
                  <button
                    type="button"
                    onClick={() => void openExplorer("system")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      explorerMode === "system"
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {copy.fullGraph}
                  </button>
                  {explorerMode === "system" ? (
                    <button
                      type="button"
                      onClick={() => setIsSelectionHighlightEnabled((current) => !current)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        isSelectionHighlightEnabled
                          ? "border border-indigo-300 bg-indigo-50 text-indigo-800"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {copy.highlightEvidence}: {isSelectionHighlightEnabled ? copy.on : copy.off}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setIsExplorerOpen(false)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {copy.close}
                  </button>
                </div>
              </div>
              <div className="min-h-[700px]">
                {explorerGraphModel ? (
                  <div className="relative">
                    <GraphPreview
                      model={explorerGraphModel}
                      locale={locale}
                      variant="expanded"
                      interactive
                      initialLayout={explorerMode === "system" ? "force" : "hierarchy-vertical"}
                      highlightNodeIds={
                        explorerMode === "system" && isSelectionHighlightEnabled
                          ? references.slice(0, 3).map((reference) => reference.nodeId)
                          : []
                      }
                    />
                    {explorerMode === "system" && isSystemGraphLoading ? (
                      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                        {copy.systemGraphLoading}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex min-h-[700px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-600">
                      {explorerMode === "system" && isSystemGraphLoading ? copy.systemGraphLoading : copy.noGraph}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function shouldShowDerivationToggle(text: string): boolean {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) {
    return false;
  }
  const sentenceCount = compact.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
  return sentenceCount > 2 || compact.length > 240;
}

function getDerivationPreviewText(text: string, isExpanded: boolean): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact || isExpanded) {
    return compact;
  }

  const sentenceMatches = compact.match(/[^.!?]+[.!?]+/g);
  if (sentenceMatches && sentenceMatches.length >= 2) {
    return `${sentenceMatches.slice(0, 2).join(" ").trim()}...`;
  }

  if (compact.length > 240) {
    return `${compact.slice(0, 237).trim()}...`;
  }

  return compact;
}

function truncatePreview(text: string, maxLength: number): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function shouldShowPreviewToggle(text: string, maxLength: number): boolean {
  return text.replace(/\s+/g, " ").trim().length > maxLength;
}

function formatPromptMessagesForDisplay(messages: PromptMessage[]): string {
  return messages
    .map((message) => `[${message.role.toUpperCase()}]\n${message.content}`)
    .join("\n\n");
}

function buildGraphContextPayloadPreview(
  query: string,
  references: QueryReference[],
  contextElements: QueryContextElement[],
): string {
  const payload = {
    query,
    references: references.map((reference) => ({
      title: reference.title,
      nodeType: reference.nodeType,
      citation: reference.citation,
      explanationUrl: reference.explanationUrl ?? null,
    })),
    contextSummaries: contextElements.map((element) => ({
      title: element.title,
      summary: element.summary,
      longDescription: element.longDescription ?? null,
      source: element.source.publicReference.citation,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

function buildQualitySignals(
  referenceCount: number,
  contextTokens: number,
  nodeTypeCount: number,
  derivationCount: number,
): QualitySignal[] {
  return [
    {
      label: "Referenzen",
      value: String(referenceCount),
      state: referenceCount >= 3 ? "green" : referenceCount >= 1 ? "yellow" : "red",
    },
    {
      label: "Kontext-Tokens",
      value: String(contextTokens),
      state: contextTokens >= 200 ? "green" : contextTokens >= 80 ? "yellow" : "red",
    },
    {
      label: "Knoten-Typen",
      value: String(nodeTypeCount),
      state: nodeTypeCount >= 3 ? "green" : nodeTypeCount >= 2 ? "yellow" : "red",
    },
    {
      label: "Ableitungsdetails",
      value: String(derivationCount),
      state: derivationCount >= 2 ? "green" : derivationCount >= 1 ? "yellow" : "red",
    },
  ];
}

function getOverallQualityState(signals: QualitySignal[]): QualitySignalState {
  const redCount = signals.filter((signal) => signal.state === "red").length;
  const greenCount = signals.filter((signal) => signal.state === "green").length;
  if (redCount >= 2) {
    return "red";
  }
  if (greenCount >= 3 && redCount === 0) {
    return "green";
  }
  return "yellow";
}

function getOverallQualityLabel(state: QualitySignalState): string {
  if (state === "green") {
    return "stark";
  }
  if (state === "yellow") {
    return "mittel";
  }
  return "schwach";
}

function getQualityDotClasses(state: QualitySignalState): string {
  if (state === "green") {
    return "bg-emerald-500";
  }
  if (state === "yellow") {
    return "bg-amber-500";
  }
  return "bg-rose-500";
}

function getQualityStateClasses(state: QualitySignalState): string {
  if (state === "green") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (state === "yellow") {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-rose-100 text-rose-800";
}
