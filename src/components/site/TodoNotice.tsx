export function TodoNotice({ label, candidates }: { label: string; candidates?: readonly string[] }) {
  return (
    <div
      role="note"
      className="rounded-xl border border-dashed border-[var(--site-accent)] bg-[var(--site-accent-soft)]/50 px-4 py-3 text-sm text-[var(--site-ink)]"
    >
      <p className="font-semibold text-[var(--site-primary)]">{label}</p>
      {candidates && candidates.length > 0 ? (
        <p className="mt-1 text-xs text-[var(--site-ink-muted)]">
          Options under owner review: {candidates.join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
