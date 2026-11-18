import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--site-border)] bg-[var(--site-surface)] py-10 text-sm text-[var(--site-ink-muted)]">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
        <div className="space-y-2">
          <p className="font-script text-2xl text-[var(--site-primary)]">
            {site.name}
          </p>
          <p>{site.lcm.badge}.</p>
          <p className="text-xs">
            <a
              href={site.lcm.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[var(--site-accent)] underline-offset-4 hover:text-[var(--site-primary)]"
            >
              {site.lcm.countryPageLabel}
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[var(--site-ink)]">Studio</p>
          <p>{site.city}, {site.province}, Philippines</p>
          <p className="rounded-md border border-dashed border-[var(--site-accent)] bg-[var(--site-accent-soft)]/45 px-2.5 py-1.5 text-xs text-[var(--site-ink)]">
            {site.address.value ?? site.address.todoLabel}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[var(--site-ink)]">Explore</p>
          <ul className="space-y-1.5">
            <li>
              <Link href="/lessons" className="hover:text-[var(--site-primary)]">
                Lessons &amp; Fees
              </Link>
            </li>
            <li>
              <Link href="/lcm-exams" className="hover:text-[var(--site-primary)]">
                LCM Examinations
              </Link>
            </li>
            <li>
              <Link href="/enquire" className="hover:text-[var(--site-primary)]">
                Enquire / Enrol
              </Link>
            </li>
            <li>
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--site-primary)]"
              >
                Facebook Page
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-[var(--site-primary)]">
                Student &amp; Teacher Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-5xl border-t border-[var(--site-border)] px-4 pt-6 text-xs text-[var(--site-ink-muted)] sm:px-6">
        <p>© {new Date().getFullYear()} {site.fullName} · {site.city}</p>
      </div>
    </footer>
  );
}
