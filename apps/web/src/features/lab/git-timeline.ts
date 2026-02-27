import { execSync } from "node:child_process";
import snapshot from "@/features/lab/data/git-history.snapshot.json";
import type { CaseStudyEntry, GitTimelineEvent } from "@/features/lab/contracts";

type RawCommit = {
  hash: string;
  date: string;
  subject: string;
};

const MAX_COMMITS = 220;

const THEME_DEFINITIONS: Array<{
  key: GitTimelineEvent["theme"];
  phase: GitTimelineEvent["phase"];
  matchers: string[];
  context: string;
  decision: string;
  why: string;
  result: string;
  tradeoffs: string;
  impactScore: number;
}> = [
  {
    key: "graph-ux",
    phase: "ux",
    matchers: ["graph", "layout", "tooltip", "cytoscape", "explorer", "ui", "motion"],
    context: "Die Graphdarstellung musste gleichzeitig verständlich, interaktiv und visuell überzeugend werden.",
    decision: "Fokus auf iterative UX-Verbesserungen am Explorer und an der Herleitungsvisualisierung.",
    why: "Die größte Wirkung auf Nutzervertrauen kam über sichtbare Nachvollziehbarkeit im Interface.",
    result: "Bessere Lesbarkeit, weniger Überlappung und klarere Interaktionsmuster im Graph.",
    tradeoffs: "Mehr Feinjustierung im Frontend und wiederholte visuelle Iterationsschleifen.",
    impactScore: 89,
  },
  {
    key: "retrieval-prompting",
    phase: "retrieval",
    matchers: ["retrieval", "prompt", "openai", "semantic", "query", "llm", "context"],
    context: "Die Antwortqualität hing stark von sauberem Kontextaufbau und robustem Prompting ab.",
    decision: "Retrieval, Kontextpaket und Prompt-Transparenz wurden systematisch ausgebaut.",
    why: "Nur so wird aus plausibler Ausgabe eine überprüfbare Herleitung.",
    result: "Stabilere Antworten, klarere Referenzen und bessere Fehlersichtbarkeit im Query-Flow.",
    tradeoffs: "Höhere Komplexität im Datenfluss zwischen Retrieval, Prompting und UI.",
    impactScore: 92,
  },
  {
    key: "stability-ops",
    phase: "stability",
    matchers: ["fix", "stabil", "security", "devops", "qa", "gate", "seed", "reset"],
    context: "Der öffentliche MVP brauchte verlässliche Guardrails und reproduzierbare Betriebsabläufe.",
    decision: "Security-, QA- und DevOps-Gates wurden früh in den Delivery-Flow integriert.",
    why: "Öffentliche Demos brauchen belastbare Laufzeitstabilität statt kurzfristiger Hacks.",
    result: "Konsistentere Releases und klar dokumentierte Betriebsgrenzen.",
    tradeoffs: "Etwas langsameres Delivery-Tempo durch zusätzliche Prüfpfade.",
    impactScore: 86,
  },
  {
    key: "storytelling-showcase",
    phase: "storytelling",
    matchers: ["blog", "story", "lab", "showcase", "template", "content", "hero"],
    context: "Die Technik musste in eine verständliche, überzeugende Produktgeschichte übersetzt werden.",
    decision: "Neue Story- und Content-Flächen wurden für Medium/LinkedIn-Reuse aufgebaut.",
    why: "Reichweite entsteht durch klare Narrative und gut wiederverwendbare Inhalte.",
    result: "Bessere Positionierung als Public Showcase mit klarer Außenwirkung.",
    tradeoffs: "Mehr redaktioneller Aufwand neben der reinen Implementierung.",
    impactScore: 84,
  },
];

export function getGitTimelineEvents(): GitTimelineEvent[] {
  const commits = loadCommits();
  const clusters = clusterCommits(commits);

  const events = clusters
    .map((cluster) => {
      const definition = THEME_DEFINITIONS.find((item) => item.key === cluster.theme);
      if (!definition) {
        return null;
      }

      const commitRefs = cluster.commits.slice(0, 10).map((entry) => `${entry.hash} ${entry.subject}`);
      const date = cluster.commits[0]?.date ?? "n/a";

      return {
        id: `${cluster.theme}-${date}`,
        date,
        theme: cluster.theme,
        phase: definition.phase,
        context: definition.context,
        decision: definition.decision,
        why: definition.why,
        result: definition.result,
        tradeoffs: definition.tradeoffs,
        commitRefs,
        impactScore: definition.impactScore,
        commitCount: cluster.commits.length,
      } satisfies GitTimelineEvent;
    })
    .filter((event): event is GitTimelineEvent => event !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return events;
}

export function toCaseStudyEntries(events: GitTimelineEvent[]): CaseStudyEntry[] {
  return events.map((event) => ({
    context: event.context,
    decision: event.decision,
    why: event.why,
    result: event.result,
    tradeoffs: event.tradeoffs,
    date: event.date,
    commitRefs: event.commitRefs,
    phase: event.phase,
    impactScore: event.impactScore,
  }));
}

function loadCommits(): RawCommit[] {
  try {
    const raw = execSync(`git log --date=short --pretty=format:'%h|%ad|%s' -n ${MAX_COMMITS}`, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const parsed = parseGitLog(raw);
    if (parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback to committed snapshot for environments without .git metadata.
  }
  return (snapshot as RawCommit[]).slice(0, MAX_COMMITS);
}

function parseGitLog(raw: string): RawCommit[] {
  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [hash, date, ...rest] = line.split("|");
      return {
        hash: hash?.trim() ?? "",
        date: date?.trim() ?? "",
        subject: rest.join("|").trim(),
      };
    })
    .filter((entry) => entry.hash.length > 0 && entry.date.length > 0 && entry.subject.length > 0);
}

function clusterCommits(commits: RawCommit[]): Array<{ theme: GitTimelineEvent["theme"]; commits: RawCommit[] }> {
  const grouped = new Map<GitTimelineEvent["theme"], RawCommit[]>();

  for (const commit of commits) {
    const normalized = commit.subject.toLowerCase();
    const matched = THEME_DEFINITIONS.find((theme) =>
      theme.matchers.some((matcher) => normalized.includes(matcher)),
    );

    const themeKey = matched?.key ?? "storytelling-showcase";
    const current = grouped.get(themeKey) ?? [];
    current.push(commit);
    grouped.set(themeKey, current);
  }

  return [...grouped.entries()]
    .map(([theme, groupedCommits]) => ({ theme, commits: groupedCommits }))
    .filter((entry) => entry.commits.length > 0);
}
