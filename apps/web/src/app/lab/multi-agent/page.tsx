import type { Metadata } from "next";
import { withCanonical } from "@/config/site";
import { getGitTimelineEvents, toCaseStudyEntries } from "@/features/lab/git-timeline";
import { MultiAgentLabTemplate } from "@/features/lab/templates/MultiAgentLabTemplate";

export const metadata: Metadata = {
  title: "Multi-Agent Lab | System GraphRAG Lab",
  description: "Experimentelle Praxis-Insights: Multi-Agent vs Single-Agent im realen Delivery-Flow.",
  alternates: {
    canonical: withCanonical("/lab/multi-agent"),
  },
  openGraph: {
    title: "Multi-Agent Lab | System GraphRAG Lab",
    description: "Experimentelle Praxis-Insights: Multi-Agent vs Single-Agent im realen Delivery-Flow.",
    url: withCanonical("/lab/multi-agent"),
    type: "website",
  },
};

export default function MultiAgentLabPage(): React.JSX.Element {
  const events = getGitTimelineEvents();
  const caseStudy = toCaseStudyEntries(events);
  return <MultiAgentLabTemplate events={events} caseStudy={caseStudy} />;
}
