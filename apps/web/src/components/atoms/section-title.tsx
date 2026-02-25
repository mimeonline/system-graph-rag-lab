export type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps): React.JSX.Element {
  return (
    <header className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-slate-700">{description}</p>
    </header>
  );
}
