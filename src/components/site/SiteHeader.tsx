import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

const NAV_LINKS = [
  { href: "/lessons", label: "Lessons" },
  { href: "/lcm-exams", label: "LCM Exams" },
  { href: "/about", label: "About" },
  { href: "/recitals", label: "Recitals" },
  { href: "/enquire", label: "Enquire" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--site-border)] bg-[var(--site-surface)]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="order-1 flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--site-border)] bg-white p-1.5 shadow-sm sm:h-12 sm:w-12">
            <Image
              src="/logo.png"
              alt="Prima Sinfonia emblem"
              fill
              sizes="(max-width: 640px) 40px, 48px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="truncate font-script text-2xl text-[var(--site-primary)] sm:text-4xl">
            {site.name}
          </span>
        </Link>

        <Link
          href="/login"
          className="order-2 shrink-0 whitespace-nowrap rounded-lg border border-[var(--site-primary)] px-3 py-1.5 text-sm font-semibold text-[var(--site-primary)] transition-colors hover:bg-[var(--site-primary)] hover:text-white sm:order-3 sm:px-3.5"
        >
          Log in
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--site-border)] pt-3 text-sm font-medium text-[var(--site-ink-muted)] sm:order-2 sm:ml-auto sm:w-auto sm:border-t-0 sm:pt-0"
        >
          {NAV_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[var(--site-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
