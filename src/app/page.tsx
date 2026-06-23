import Link from "next/link";
import { services, serviceImages, site } from "@/lib/site";
import { Container, Section, SectionHeading, Button } from "@/components/ui";
import { ServiceCard, CTASection, Stat } from "@/components/blocks";
import { VideoFeature } from "@/components/VideoFeature";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/icons";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient border-b border-border">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary">
              <Icon name="mapPin" className="h-3.5 w-3.5" /> Serving all of Maryland
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Compassionate <span className="text-primary">home care</span> for the people you love
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Explore Maryland&apos;s finest in-home care services with My Home Cares. From skilled
              nursing to everyday personal care, we deliver quality care that transforms lives —
              right at home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" withArrow>
                Schedule a Free Consultation
              </Button>
              <Button href="/home-care" variant="outline">
                Explore Our Services
              </Button>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <Stat value="Since 2018" label="Caring for Maryland" />
              <Stat value="24+" label="Counties served" />
              <Stat value="7" label="Care services" />
            </div>
          </div>

          <div className="lg:pl-6">
            <div className="rounded-3xl border border-border bg-white p-6 card-shadow sm:p-7">
              <h2 className="text-xl font-bold">Find Your Care</h2>
              <p className="mt-1 text-sm text-muted">
                Tell us about the needs of your loved one and we&apos;ll be in touch.
              </p>
              <div className="mt-5">
                <LeadForm withTime source="home-hero" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Comprehensive Care Services */}
      <Section>
        <SectionHeading
          center
          eyebrow="Comprehensive Care Services"
          title="Personalized home care solutions across Maryland"
          intro="A full range of services designed to meet your unique needs with compassion and professionalism."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              title={s.title}
              description={s.short}
              href={`/${s.slug}`}
              icon={s.icon}
              image={serviceImages[s.slug]}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/home-care" variant="outline" withArrow>
            View All Home Care Services
          </Button>
        </div>
      </Section>

      {/* Video */}
      <VideoFeature />

      {/* About teaser */}
      <Section muted>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">About My Home Cares</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Your trusted Maryland home care provider</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Since 2018, My Home Cares has been dedicated to quality care across Maryland — from
              skilled nursing to personalized home assistance, tailored to the unique needs of those
              we serve. We extend professional caregiving to families and individuals right at their
              doorstep.
            </p>
            <blockquote className="mt-6 border-l-4 border-primary pl-5 text-ink-soft italic">
              &ldquo;{site.signature}&rdquo;
              <footer className="mt-2 text-sm font-semibold not-italic text-muted">
                — {site.signatureBy}
              </footer>
            </blockquote>
            <div className="mt-8">
              <Button href="/about" withArrow>
                Learn More About Us
              </Button>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: "heart-hand", title: "People-first", text: "Care that honors dignity, comfort and independence." },
              { icon: "shield-heart", title: "Trusted & licensed", text: `Maryland licensed — ${site.license}.` },
              { icon: "users", title: "Family-oriented team", text: "Caregivers who treat your loved ones like their own." },
              { icon: "activity", title: "Tech-enabled care", text: "Built from a software company — innovation at our core." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-white p-5 card-shadow">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Careers teaser */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-12 sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(700px 320px at 100% 0%, rgba(82,126,255,0.35), transparent 60%)" }} />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">
              Join our compassionate team
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Build a rewarding career in home care
            </h2>
            <p className="mt-4 text-lg text-white/80">
              We&apos;re seeking dedicated caregivers who embody our core values and commitment to
              excellence. Make a real difference in your community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/careers" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-primary-50">
                Explore Careers <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/carelink-staffing" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                CareLink Staffing
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
