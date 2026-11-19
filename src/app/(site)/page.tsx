import type { Metadata } from "next";
import Image from "next/image";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__backdrop" aria-hidden="true">
          <Image src="/hero-music-class.webp" alt="" fill priority sizes="100vw" className="hero__image" />
        </div>
        <div className="container hero__grid">
          <div>
            <h1 id="hero-heading">{site.fullName}</h1>
            <p className="lead">Music classes for all ages in {site.city}.</p>
            <div className="hero__actions">
              <Link href="/enquire" className="btn btn-primary">
                Enroll now
              </Link>
              <Link href="/lessons" className="btn btn-quiet">
                Explore lessons
              </Link>
            </div>
          </div>

          <div className="programme">
            {site.tagline.value ? (
              <p className="programme__title">{site.tagline.value}</p>
            ) : (
              <TodoNotice label={site.tagline.todoLabel} candidates={site.tagline.candidates} />
            )}
            <hr className="programme__rule" />
            <ol aria-label="Classes offered">
              {site.instruments.map(inst => (
                <li key={inst.id}>
                  <span className="programme__name">{inst.name}</span>
                  {inst.levels.length > 0 && (
                    <span className="programme__levels">{inst.levels.join(" and ")}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="statement" aria-labelledby="lcm-heading">
        <div className="container statement__grid">
          <h2 id="lcm-heading">{site.lcm.badge}</h2>
          <div>
            <p>{site.lcm.resultsSummary}</p>
            <div className="statement__links">
              <a
                href={site.lcm.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="site-link"
              >
                Official LCME list
              </a>
              <Link href="/lcm-exams" className="site-link">
                Read about LCM exams
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="classes" aria-labelledby="instruments-heading">
        <div className="container">
          <div className="classes__head">
            <h2 id="instruments-heading">Classes &amp; LCM pathway</h2>
          </div>
          <ul className="classes__rows">
            {site.instruments.map(inst => (
              <li key={inst.id}>
                <h3>{inst.name}</h3>
                <p>{inst.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="who" aria-labelledby="who-heading">
        <div className="container">
          <h2 id="who-heading">Who we teach in {site.city}</h2>
          <div className="who__grid">
            {site.audiences.map(item => (
              <article key={item.title} className="who__item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="visit" aria-labelledby="visit-heading">
        <div className="container visit__grid">
          <h2 id="visit-heading">Location in {site.city}</h2>
          <div className="visit__body">
            <div className="visit__contact">
              <div>
                <p className="visit__person">
                  {site.contact.person}, {site.contact.role.toLowerCase()}
                </p>
                <a href={site.contact.phoneHref} className="visit__phone">
                  {site.contact.phoneDisplay}
                </a>
              </div>
              <Link href="/enquire" className="btn btn-primary">
                Enroll now
              </Link>
            </div>
            {site.address.value ? (
              <address className="visit__address">
                <span>{site.address.value}</span>
                <span>{site.addressLandmark}</span>
              </address>
            ) : (
              <TodoNotice label={site.address.todoLabel} candidates={site.address.candidates} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
