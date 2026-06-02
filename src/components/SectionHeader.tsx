type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mx-auto mb-7 max-w-2xl text-center">
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold tracking-[0.14em] text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
