import { Button } from "@/components/ui/button";

export function QueryInput(): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block space-y-2" htmlFor="query">
        <span className="text-sm font-medium text-slate-900">Deine Frage</span>
        <textarea
          className="h-36 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          defaultValue="Welche Zielkonflikte entstehen zwischen Entkopplung und Betriebsaufwand in eventgetriebenen Systemen?"
          id="query"
          readOnly
        />
      </label>
      <p className="text-sm text-slate-600">
        Bootstrap-Modus: UI-Grundstruktur steht, Interaktionen folgen in den Storys.
      </p>
      <Button type="button">Antwort anzeigen</Button>
    </section>
  );
}
