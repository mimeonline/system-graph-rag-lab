import { SectionTitle } from "@/components/atoms/section-title";
import { QueryPanel } from "@/components/organisms/query-panel";

export function HomeTemplate(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto grid w-full max-w-4xl gap-10">
        <SectionTitle
          eyebrow="System GraphRAG"
          title="Technisches MVP Grundgerüst"
          description="Dieses Bootstrap liefert den stabilen Unterbau für Story-by-Story Umsetzung mit Next.js 16.1.6, TypeScript Strict, Tailwind und API-Skelett."
        />
        <QueryPanel />
      </div>
    </main>
  );
}
