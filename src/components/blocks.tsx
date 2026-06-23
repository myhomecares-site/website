import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Button, Container } from "./ui";
import { Icon } from "./icons";
import { LeadForm } from "./LeadForm";
import { SiteImage } from "./SiteImage";

export function ServiceCard({
  title,
  description,
  href,
  icon,
  image,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 card-shadow"
    >
      {image && (
        <span className="relative block h-40 w-full">
          <SiteImage path={image} alt={title} className="h-40 w-full" imgClassName="transition-transform duration-300 group-hover:scale-105" />
          <span className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-primary shadow-sm">
            <Icon name={icon} className="h-6 w-6" />
          </span>
        </span>
      )}
      <span className="flex flex-1 flex-col p-6">
        {!image && (
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon name={icon} className="h-6 w-6" />
          </span>
        )}
        <h3 className={`text-lg font-bold ${image ? "" : "mt-5"}`}>{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Learn More
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-dark">
            <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-ink-soft">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function CTASection({
  title = "Get in Touch with My Home Cares",
  text = "Reach out for personalized care solutions. Contact us today to discuss your needs and learn how we can support you and your loved ones.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 90% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-lg text-lg text-white/85">{text}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary-50">
                  <Icon name="phone" className="h-4 w-4" /> {site.phone}
                </a>
                <a href={site.emailHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  <Icon name="mail" className="h-4 w-4" /> {site.email}
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 card-shadow">
              <LeadForm compact source="cta" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-extrabold text-primary sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="hero-gradient border-b border-border">
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl animate-rise">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-muted">{subtitle}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export { Button };
