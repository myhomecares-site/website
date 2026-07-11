import { site } from "@/lib/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";

const VALUES = [
  { icon: "heart-hand", title: "Compassion", text: "We lead with kindness, meeting every person where they are with patience and warmth." },
  { icon: "shield-heart", title: "Dignity", text: "We protect independence and respect, so your loved one always feels seen and in control." },
  { icon: "star", title: "Excellence", text: "Screened, trained caregivers held to Maryland RSA standards, and then some." },
  { icon: "users", title: "Family", text: "We treat the people we serve like our own, and walk alongside families every step." },
];

export function WhatWeStandFor() {
  return (
    <section className="hero-gradient border-y border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What We Stand For</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">{site.mission}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-lg leading-relaxed text-muted">{site.promise}</p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} variant="scale" delay={i * 110}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 card-shadow transition-transform hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
