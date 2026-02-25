import { QueryInput } from "@/components/molecules/query-input";

export function QueryPanel(): React.JSX.Element {
  return (
    <div className="grid gap-6">
      <QueryInput />
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
          Antwort
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Das technische MVP-Grundgerüst ist bereit. API, Contracts und Testbasis sind
          angelegt, fachliche Antwortlogik folgt story-basiert.
        </p>
      </section>
    </div>
  );
}
