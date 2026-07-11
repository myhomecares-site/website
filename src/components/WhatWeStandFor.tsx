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
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(700px 340px at 15% 0%, rgba(0,158,230,0.35), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(0,199,0,0.18), transparent 60%)" }} />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">What We Stand For</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{site.mission}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-lg leading-relaxed text-white/80">{site.promise}</p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 110}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/25 text-primary-light">
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
