import Link from "next/link";
import { site } from "@/content/site";

// The mast: the school's name large on navy, the links beneath.
export function SiteFooter() {
  return (
    <footer className="mast">
      <div className="container">
        <p className="mast__name">{site.fullName}</p>
        <p className="mast__tagline">{site.tagline.value}</p>

        <div className="mast__grid">
          <div>
            <p>{site.lcm.badge}.</p>
            <p>
              <a href={site.lcm.officialUrl} target="_blank" rel="noopener noreferrer">
                {site.lcm.countryPageLabel}
              </a>
            </p>
          </div>

          <div>
            <h3>Studio</h3>
            <p>
              {site.city}, {site.province}, Philippines
            </p>
            {site.address.value ? (
              <p>
                {site.address.value}
                <br />
                {site.addressLandmark}
              </p>
            ) : (
              <p className="mast__todo">{site.address.todoLabel}</p>
            )}
            <p>
              {site.contact.person} ({site.contact.role})
            </p>
            <p>
              <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <ul>
              <li>
                <Link href="/lessons">Lessons &amp; Fees</Link>
              </li>
              <li>
                <Link href="/lcm-exams">LCM Examinations</Link>
              </li>
              <li>
                <Link href="/enquire">Enquire / Enrol</Link>
              </li>
              <li>
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook Page
                </a>
              </li>
              <li>
                <Link href="/login">Student &amp; Teacher Log in</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mast__legal">
          © {new Date().getFullYear()} {site.fullName}, {site.city}
        </p>
      </div>
    </footer>
  );
}
