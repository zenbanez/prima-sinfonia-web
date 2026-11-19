import type { Metadata } from "next";
import Link from "next/link";
import { TodoNotice } from "@/components/site/TodoNotice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Music Classes in Tacloban City — Piano, Vocals, Violin, Cello & Musical Theatre",
  description:
    "Prima Sinfonia offers music classes for all ages in Tacloban: piano, vocals, violin, cello and musical theatre, preparing children, teens, and adults as an officially affiliated London College of Music examination location.",
};

export default function HomePage() {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    name: site.fullName,
    url: site.baseUrl,
    areaServed: `${site.city}, ${site.province}, Philippines`,
    sameAs: [site.facebookUrl, site.lcm.officialUrl],
    ...(site.address.status === "confirmed" && site.address.value
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.value,
            addressLocality: site.city,
            addressRegion: site.province,
            addressCountry: site.countryCode,
          },
        }
      : {}),
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="site-frame rounded-3xl bg-[var(--site-surface)] p-6 shadow-sm sm:p-10">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--site-accent)] bg-[var(--site-accent-soft)]/50 px-3.5 py-1.5 text-xs font-semibold text-[var(--site-primary)]">
          <span>{site.lcm.badge}</span>
          <a
            href={site.lcm.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Official LCME list
          </a>
        </div>

        <h1 className="mt-6 text-3xl font-bold uppercase leading-tight text-[var(--site-primary)] sm:text-5xl">
          {site.fullName}
        </h1>
        <p className="mt-3 max-w-2xl text-xl font-semibold text-[var(--site-ink)] sm:text-2xl">
          Music classes for all ages in {site.city}.
        </p>

        <div className="mt-4 max-w-xl">
          {site.tagline.value ? (
            <p className="text-base font-medium tracking-wide text-[var(--site-accent-strong)]">
              {site.tagline.value}
            </p>
          ) : (
            <TodoNotice
              label={site.tagline.todoLabel}
              candidates={site.tagline.candidates}
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/enquire"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--site-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--site-primary-hover)]"
          >
            Enroll now
          </Link>
          <Link
            href="/lessons"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-alt)] px-5 py-3 text-sm font-semibold text-[var(--site-primary)] transition-colors hover:border-[var(--site-primary)]"
          >
            Explore lessons
          </Link>
        </div>
      </section>

      <section aria-labelledby="who-heading" className="space-y-4">
        <h2
          id="who-heading"
          className="text-2xl font-bold text-[var(--site-ink)]"
        >
          Who we teach in {site.city}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {site.audiences.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-5 shadow-sm"
            >
              <h3 className="text-base font-bold text-[var(--site-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--site-ink-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="instruments-heading"
        className="space-y-4 rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface-alt)] p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="instruments-heading"
            className="text-2xl font-bold text-[var(--site-ink)]"
          >
            Classes &amp; LCM pathway
          </h2>
          <Link
            href="/lcm-exams"
            className="text-sm font-semibold text-[var(--site-primary)] underline underline-offset-4"
          >
            Read about LCM exams →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {site.instruments.map(inst => (
            <article
              key={inst.id}
              className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-5"
            >
              <h3 className="text-lg font-bold text-[var(--site-ink)]">
                {inst.name}
              </h3>
              {inst.levels.length > 0 && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--site-accent-strong)]">
                  {inst.levels.join(" · ")}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-[var(--site-ink-muted)]">
                {inst.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--site-ink)]">
          Location in {site.city}
        </h2>
        {site.address.value ? (
          <p className="text-sm text-[var(--site-ink-muted)]">
            {site.address.value}
          </p>
        ) : (
          <TodoNotice
            label={site.address.todoLabel}
            candidates={site.address.candidates}
          />
        )}
      </section>
    </div>
  );
}
