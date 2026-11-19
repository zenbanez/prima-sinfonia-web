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

// A masthead, like the poster's head: the emblem and the school's name
// centred over a rule, the pages beneath.
export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="container masthead__bar">
        <Link href="/" className="masthead__mark">
          <span className="masthead__emblem relative block shrink-0 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Prima Sinfonia emblem"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="masthead__name">
            <strong>{site.name}</strong>
            <span>Music School</span>
          </span>
        </Link>

        <Link href="/login" className="btn btn-quiet masthead__login">
          Log in
        </Link>
      </div>

      <nav aria-label="Primary navigation" className="masthead__nav">
        <ul className="container">
          {NAV_LINKS.map(item => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
