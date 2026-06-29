import Link from "next/link";
import type { ReactNode } from "react";
import { site, associations, media, differentiators, conditions } from "@/lib/site";
import { Button, Container } from "./ui";
import { Icon } from "./icons";
import { SiteImage } from "./SiteImage";
import { LeafWatermark, Blobs, DotGrid } from "./Decor";

export function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" className="h-4 w-4 text-amber-400" />
      ))}
    </span>
  );
}

export function TrustBand() {
  const facts = [
    { icon: "shield-heart", label: "Licensed", value: site.license },
    { icon: "mapPin", label: "Coverage", value: "24+ Maryland counties" },
    { icon: "clock", label: "Caring since", value: "2018" },
  ];
  return (
    <section className="border-y border-border bg-white">
      <Container className="flex flex-col items-center justify-between gap-6 py-6 lg:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-light">{f.label}</span>
                <span className="block text-sm font-bold text-ink">{f.value}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {associations.map((a) => (
            <div key={a.name} title={a.name} className="flex h-16 w-32 items-center justify-center rounded-lg border border-border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(a.image)} alt={a.name} className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: "phone", title: "Free consultation", text: "We listen to your family's needs and answer every question, no pressure, no obligation." },
    { icon: "heart-hand", title: "Personalized care plan", text: "We build a tailored plan around your loved one's health, routine, and preferences." },
    { icon: "users", title: "Matched caregiver", text: "We pair you with a trained, compassionate caregiver who's the right fit." },
    { icon: "shield-heart", title: "Ongoing support", text: "We check in, adapt the plan as needs change, and stay reachable around the clock." },
  ];
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Getting Started Is Simple</p>
          <h2 className="text-3xl font-bold sm:text-4xl">How My Home Cares works</h2>
          <p className="mt-4 text-lg text-muted">From first call to compassionate care at home, in four simple steps.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-primary-50">{i + 1}</span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 card-shadow"
    >
      {image && (
        <span className="relative block h-44 w-full">
          <SiteImage path={image} alt={title} className="h-44 w-full" imgClassName="transition-transform duration-[650ms] ease-out group-hover:scale-[1.08]" />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
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
  title = "Ready to talk about care?",
  text = "Schedule a free, no-obligation consultation and our care team will help you find the right support for your loved one.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 90% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
          <LeafWatermark className="-right-6 -top-8 h-48 w-48 text-white" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">{text}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-50">
                Schedule a Consultation <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WhatSetsUsApart() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Why Families Choose Us</p>
          <h2 className="text-3xl font-bold sm:text-4xl">What sets My Home Cares apart</h2>
          <p className="mt-4 text-lg text-muted">
            More than a home care agency, a licensed Maryland team built on training, trust, and care that starts when you need it.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d) => (
            <div key={d.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon name={d.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SpecializedCare() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Specialized Care</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Expert support for specific needs</h2>
          <p className="mt-4 text-lg text-muted">
            Beyond everyday care, our team is trained to support more complex conditions and situations across Maryland.
          </p>
        </div>
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 card-shadow"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon name={c.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.subhead}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn More
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
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
    <section className="hero-gradient relative overflow-hidden border-b border-border">
      <Blobs />
      <DotGrid className="right-4 top-8 h-32 w-32 opacity-60" />
      <Container className="relative py-14 sm:py-18">
        <div className="max-w-3xl animate-rise">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export { Button };
