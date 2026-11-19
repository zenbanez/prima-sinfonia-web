import type { Metadata } from "next";
import Link from "next/link";
import { TodoNotice } from "@/components/site/TodoNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Lessons & Fees — Music Lessons Tacloban",
  description:
    "Piano, vocals, violin, cello and musical theatre classes in Tacloban City at Prima Sinfonia, with pathways aligned to LCM exams.",
};

export default function LessonsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-[var(--site-primary)] sm:text-4xl">
          Lessons &amp; Fees
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--site-ink-muted)]">
          {site.lessonFormat.summary}
        </p>
        <TodoNotice label={site.lessonFormat.detailsTodo} />
      </header>

      <section aria-labelledby="offerings-heading" className="space-y-4">
        <h2
          id="offerings-heading"
          className="text-2xl font-bold text-[var(--site-ink)]"
        >
          Classes Offered
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {site.instruments.map(inst => (
            <article
              key={inst.id}
              className="flex flex-col justify-between rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm"
            >
              <div>
                <h3 className="text-xl font-bold text-[var(--site-primary)]">
                  {inst.name}
                </h3>
                {inst.levels.length > 0 && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--site-accent-strong)]">
                    Levels: {inst.levels.join(" & ")}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-[var(--site-ink-muted)]">
                  {inst.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="fees-heading"
        className="space-y-4 rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm sm:p-8"
      >
        <h2
          id="fees-heading"
          className="text-2xl font-bold text-[var(--site-ink)]"
        >
          Current Tuition &amp; Package Fees
        </h2>

        {site.fees ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {site.fees.tiers.map(tier => (
              <div
                key={tier.name}
                className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-alt)] p-5"
              >
                <h3 className="font-bold text-[var(--site-primary)]">{tier.name}</h3>
                <p className="mt-1 text-lg font-semibold text-[var(--site-ink)]">
                  {tier.price}
                </p>
                <p className="mt-2 text-sm text-[var(--site-ink-muted)]">
                  {tier.details}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-base font-medium text-[var(--site-ink)]">
              Ask us for current fees.
            </p>
            <TodoNotice label={site.feesTodo} />
            <div>
              <Link
                href="/enquire"
                className="inline-flex items-center rounded-xl bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--site-primary-hover)]"
              >
                Enquire about lessons &amp; fees
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
