import Link from "next/link";
import { services, regions, conditions, site, associations, media } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./icons";

const socialLinks = [
  { name: "facebook", href: site.social.facebook, label: "Facebook" },
  { name: "instagram", href: site.social.instagram, label: "Instagram" },
  { name: "linkedin", href: site.social.linkedin, label: "LinkedIn" },
  { name: "google", href: site.social.google, label: "Google" },
  { name: "x", href: site.social.x, label: "X (Twitter)" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-white/80">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="rounded-2xl bg-white/95 px-4 py-3 inline-block">
              <Logo />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              {site.mission}
            </p>
            <p className="mt-3 text-sm font-medium text-white/90">Where Service Matters</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark hover:scale-105"
                >
                  <Icon name={s.name} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-white/70 transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-white">Specialized Care</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {conditions.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-white/70 transition-colors hover:text-white">
                    {c.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Service Areas", href: "/service-areas" },
                { label: "Reviews", href: "/reviews" },
                { label: "Careers", href: "/careers" },
                { label: "CareLink Staffing", href: "/carelink-staffing" },
                { label: "Resources", href: "/resources" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-2.5 text-white/80 hover:text-white">
                  <Icon name="phone" className="h-4 w-4 text-primary-light" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={site.emailHref} className="flex items-center gap-2.5 text-white/80 hover:text-white">
                  <Icon name="mail" className="h-4 w-4 text-primary-light" /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/80">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" /> Serving all of {site.region}
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-white/60">
              <p className="font-semibold text-white/80">{site.staffing.name}</p>
              <p>{site.staffing.phone} · {site.staffing.email}</p>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">
              Proud Member &amp; Licensed By
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {associations.map((a) => (
                <div
                  key={a.name}
                  title={a.name}
                  className="flex h-24 w-44 items-center justify-center rounded-xl bg-white p-3.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media(a.image)} alt={a.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved. · License {site.license}
          </p>
          <p className="flex flex-wrap gap-x-2">
            {regions.map((r, i) => (
              <span key={r.slug}>
                <Link href={`/home-care-services-${r.slug}-md`} className="hover:text-white/80">
                  {r.name}
                </Link>
                {i < regions.length - 1 && <span className="text-white/30"> ·</span>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
