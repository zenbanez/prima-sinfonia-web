import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "LCM Exams — London College of Music in Tacloban",
  description:
    "Prima Sinfonia is an officially affiliated London College of Music (LCM) examination location in Tacloban City for violin, piano, and voice music lessons.",
};

export default function LcmExamsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="inline-block rounded-full border border-[var(--site-accent)] bg-[var(--site-accent-soft)]/50 px-3.5 py-1 text-xs font-semibold text-[var(--site-primary)]">
          {site.lcm.badge}
        </p>
        <h1 className="text-3xl font-bold text-[var(--site-primary)] sm:text-4xl">
          London College of Music (LCM) Examinations
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--site-ink-muted)]">
          London College of Music Examinations (University of West London) offers
          internationally benchmarked graded and diploma music assessments in
          violin, piano, and voice.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <article className="space-y-3 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--site-ink)]">
            Official Affiliation &amp; How Entry Works
          </h2>
          <p className="text-sm leading-relaxed text-[var(--site-ink-muted)]">
            {site.lcm.badge}. {site.lcm.primaryCentreNote}
          </p>
          <p className="pt-1 text-sm">
            <a
              href={site.lcm.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--site-primary)] underline decoration-[var(--site-accent)] underline-offset-4"
            >
              Verify on the official University of West London LCME Philippines list →
            </a>
          </p>
        </article>

        <article className="space-y-3 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--site-ink)]">
            Levels &amp; Student Results
          </h2>
          <p className="text-sm leading-relaxed text-[var(--site-ink-muted)]">
            Learners progress step by step from early foundation levels through
            graded examinations in violin, piano, and voice at a pace suited to
            each student.
          </p>
          <p className="text-sm leading-relaxed text-[var(--site-ink)]">
            {site.lcm.resultsSummary}
          </p>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-alt)] p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[var(--site-ink)]">
            Considering graded music study in Tacloban?
          </h2>
          <p className="text-sm text-[var(--site-ink-muted)]">
            Ask how lessons align with LCM entry readiness for your learner.
          </p>
        </div>
        <Link
          href="/enquire"
          className="inline-flex items-center rounded-xl bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--site-primary-hover)]"
        >
          Enquire about LCM preparation
        </Link>
      </section>
    </div>
  );
}
