import type { Metadata } from "next";
import Link from "next/link";
import { EnquireForm } from "@/components/site/EnquireForm";
import { getPulseTenantId, site } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enquire & Enrol — Music Lessons Tacloban",
  description:
    "Enquire about violin, piano, and voice music lessons in Tacloban City and LCM exam preparation at Prima Sinfonia.",
};

export default function EnquirePage() {
  const tenantId = getPulseTenantId();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-[var(--site-primary)] sm:text-4xl">
          {site.enquire.heading}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--site-ink-muted)]">
          {site.enquire.intro}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EnquireForm tenantId={tenantId} />
        </div>

        <aside className="space-y-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--site-ink)]">
            What to include
          </h2>
          <ul className="space-y-2.5 text-sm text-[var(--site-ink-muted)]">
            {site.enquire.suggestedDetails.map(detail => (
              <li key={detail} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--site-accent)]"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--site-border)] pt-4 text-xs text-[var(--site-ink-muted)]">
            Already an enrolled student or parent?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--site-primary)] underline underline-offset-4"
            >
              Log in to your studio portal
            </Link>
            .
          </div>
        </aside>
      </div>
    </div>
  );
}
