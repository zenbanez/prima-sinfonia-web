import type { Metadata } from "next";
import Link from "next/link";
import { TodoNotice } from "@/components/site/TodoNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Fenella Dawn \"Khea\" Sancho-Bañez — Music Lessons Tacloban",
  description:
    "Meet Fenella Dawn \"Khea\" Sancho-Bañez, London College of Music diploma holder teaching violin, piano, and voice in Tacloban City since 2007.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-[var(--site-primary)] sm:text-4xl">
          About {site.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--site-ink-muted)]">
          Founded and led in {site.city} by{" "}
          <strong className="text-[var(--site-ink)]">
            {site.about.founderName}
          </strong>{" "}
          ({site.about.credential}).
        </p>
      </header>

      <section className="space-y-5 rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-[var(--site-ink)]">
          Musical Training &amp; Teaching Experience
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed text-[var(--site-ink-muted)]">
          {site.about.highlights.map(line => (
            <li key={line} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--site-accent)]"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <TodoNotice label={site.about.storyTodo} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/lessons"
          className="inline-flex items-center rounded-xl border border-[var(--site-border)] bg-[var(--site-surface)] px-5 py-3 text-sm font-semibold text-[var(--site-primary)] hover:border-[var(--site-primary)]"
        >
          View lesson offerings
        </Link>
        <Link
          href="/enquire"
          className="inline-flex items-center rounded-xl bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--site-primary-hover)]"
        >
          Enquire / Enrol
        </Link>
      </div>
    </div>
  );
}
