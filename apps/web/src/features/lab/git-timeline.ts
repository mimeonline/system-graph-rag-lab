import { execSync } from "node:child_process";
import snapshot from "@/features/lab/data/git-history.snapshot.json";
import type { CaseStudyEntry, GitTimelineEvent } from "@/features/lab/contracts";

type RawCommit = {
  hash: string;
  date: string;
  subject: string;
};

type ThemeRule = {
  theme: GitTimelineEvent["theme"];
  phase: GitTimelineEvent["phase"];
  matchers: string[];
  label: string;
};

const MAX_COMMITS = 320;

const THEME_RULES: ThemeRule[] = [
  {
    theme: "process-governance",
    phase: "process",
    label: "Prozess und Rollen-Gates",
    matchers: ["qa", "security", "devops", "pm", "epic", "story", "backlog", "workflow", "docs", "agent", "gate"],
  },
  {
    theme: "query-retrieval-core",
    phase: "retrieval",
    label: "Query und Retrieval Kern",
    matchers: ["query", "retrieval", "openai", "vector", "semantic", "prompt", "answer", "reference", "neo4j", "seed"],
  },
  {
    theme: "graph-ux-iteration",
    phase: "ux",
    label: "Graph UX Iterationen",
    matchers: ["graph", "layout", "tooltip", "cytoscape", "explorer", "node", "edge", "popover", "fullscreen", "hydration", "session"],
  },
  {
    theme: "public-showcase",
    phase: "showcase",
    label: "Public Showcase und Story",
    matchers: ["blog", "story", "lab", "showcase", "hero", "editorial", "linkedin", "medium", "three", "3d"],
  },
  {
    theme: "stability-hardening",
    phase: "stability",
    label: "Stabilisierung und Fixes",
    matchers: ["fix", "stabil", "harden", "fallback", "retry", "error"],
  },
];

export function getGitTimelineEvents(): GitTimelineEvent[] {
  const commits = loadCommits();
  const grouped = groupByTheme(commits);

  return grouped
    .map((bucket) => toTimelineEvent(bucket.rule, bucket.commits))
    .filter((event): event is GitTimelineEvent => event !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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
    // fallback below
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
    .filter((entry) => entry.hash && entry.date && entry.subject);
}

function groupByTheme(commits: RawCommit[]): Array<{ rule: ThemeRule; commits: RawCommit[] }> {
  const map = new Map<GitTimelineEvent["theme"], { rule: ThemeRule; commits: RawCommit[] }>();

  for (const commit of commits) {
    const normalized = commit.subject.toLowerCase();
    const scored = THEME_RULES.map((rule) => ({
      rule,
      score: rule.matchers.reduce((sum, matcher) => sum + (normalized.includes(matcher) ? 1 : 0), 0),
    })).sort((a, b) => b.score - a.score);

    const chosenRule = scored[0] && scored[0].score > 0 ? scored[0].rule : THEME_RULES[0];
    const existing = map.get(chosenRule.theme);
    if (existing) {
      existing.commits.push(commit);
    } else {
      map.set(chosenRule.theme, { rule: chosenRule, commits: [commit] });
    }
  }

  return [...map.values()].filter((bucket) => bucket.commits.length > 0);
}

function toTimelineEvent(rule: ThemeRule, commits: RawCommit[]): GitTimelineEvent | null {
  if (commits.length === 0) {
    return null;
  }

  const sortedByDate = [...commits].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestDate = sortedByDate[0]?.date ?? "n/a";
  const byType = countByCommitType(commits);
  const topKeywords = extractTopKeywords(commits.map((c) => c.subject), 3);
  const examples = sortedByDate.slice(0, 3).map((c) => c.subject);
  const refs = sortedByDate.slice(0, 12).map((c) => `${c.hash} ${c.subject}`);

  const dominantType = findDominantType(byType);
  const impactScore = computeImpactScore(commits.length, byType);

  return {
    id: `${rule.theme}-${latestDate}`,
    date: latestDate,
    theme: rule.theme,
    phase: rule.phase,
    context: `${rule.label}: ${commits.length} Commits. Haeufige Begriffe: ${topKeywords.join(", ")}.`,
    decision: `Dominanter Commit-Typ: ${dominantType}. Beispiele: ${examples.join(" | ")}`,
    why: `Verteilung feat/fix/chore/docs/test = ${byType.feat}/${byType.fix}/${byType.chore}/${byType.docs}/${byType.test}.`,
    result: `Aktueller Stand basiert auf realen Commit-Mustern dieser Phase statt generischer Annahmen.`,
    tradeoffs: `Hoher Fokus auf ${dominantType} verbessert Verlaesslichkeit in diesem Bereich, reduziert aber Zeit fuer andere Themen.`,
    commitRefs: refs,
    impactScore,
    commitCount: commits.length,
  };
}

function countByCommitType(commits: RawCommit[]): Record<"feat" | "fix" | "chore" | "docs" | "test" | "other", number> {
  const initial = { feat: 0, fix: 0, chore: 0, docs: 0, test: 0, other: 0 };
  for (const commit of commits) {
    const s = commit.subject.toLowerCase();
    if (s.startsWith("feat")) initial.feat += 1;
    else if (s.startsWith("fix")) initial.fix += 1;
    else if (s.startsWith("chore")) initial.chore += 1;
    else if (s.startsWith("docs")) initial.docs += 1;
    else if (s.startsWith("test")) initial.test += 1;
    else initial.other += 1;
  }
  return initial;
}

function findDominantType(byType: Record<"feat" | "fix" | "chore" | "docs" | "test" | "other", number>): string {
  return Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "other";
}

function computeImpactScore(commitCount: number, byType: Record<"feat" | "fix" | "chore" | "docs" | "test" | "other", number>): number {
  const base = Math.min(55 + Math.round(commitCount / 2), 85);
  const deliveryBonus = byType.feat * 1.5 + byType.fix * 1.2 + byType.test * 0.8;
  const governanceBonus = byType.docs * 0.5 + byType.chore * 0.4;
  return Math.max(50, Math.min(98, Math.round(base + deliveryBonus / 4 + governanceBonus / 8)));
}

function extractTopKeywords(subjects: string[], limit: number): string[] {
  const stop = new Set([
    "feat",
    "fix",
    "chore",
    "docs",
    "test",
    "web",
    "add",
    "update",
    "improve",
    "refine",
    "for",
    "and",
    "with",
    "via",
    "the",
    "all",
    "commit",
    "changes",
    "sync",
  ]);

  const counts = new Map<string, number>();
  for (const subject of subjects) {
    const tokens = subject
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !stop.has(t));
    for (const token of tokens) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([token]) => token);
  return ranked.slice(0, limit).length > 0 ? ranked.slice(0, limit) : ["keine", "klaren", "keywords"];
}
