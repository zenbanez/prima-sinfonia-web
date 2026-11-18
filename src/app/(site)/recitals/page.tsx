import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TodoNotice } from "@/components/site/TodoNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Recitals & Performances — Music Lessons Tacloban",
  description:
    "Studio recitals for violin, piano, and voice learners at Prima Sinfonia in Tacloban City, including the 18 July 2026 recital.",
};

export default function RecitalsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-[var(--site-primary)] sm:text-4xl">
          Recitals &amp; Studio Performances
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--site-ink-muted)]">
          Performing together gives students calm stage experience alongside peers
          and families while preparing repertoire for LCM milestones.
        </p>
      </header>

      <div className="space-y-6">
        {site.recitals.map(recital => (
          <article
            key={recital.id}
            className="space-y-5 rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-[var(--site-ink)]">
                {recital.title}
              </h2>
              <time
                dateTime={recital.dateIso}
                className="rounded-full bg-[var(--site-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--site-primary)]"
              >
                {recital.displayDate}
              </time>
            </div>

            <p className="text-sm leading-relaxed text-[var(--site-ink-muted)]">
              {recital.summary}
            </p>

            <div className="space-y-3">
              <TodoNotice label={recital.programmeTodo} />
              <TodoNotice label={recital.photosTodo} />
            </div>

            {recital.images.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {recital.images.map(img => (
                  <div
                    key={img.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--site-border)]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-alt)] p-6 text-sm text-[var(--site-ink-muted)]">
                Recital gallery intentionally withheld until written parent consent is
                confirmed for each published photo.
              </div>
            )}
          </article>
        ))}
      </div>

      <div>
        <Link
          href="/enquire"
          className="inline-flex items-center rounded-xl bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--site-primary-hover)]"
        >
          Enquire about upcoming studio recitals &amp; lessons
        </Link>
      </div>
    </div>
  );
}
