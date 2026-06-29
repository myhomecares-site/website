import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { services, locations, careForms, serviceImages, site, type Service, type CareForm } from "@/lib/site";
import { Container, Section, Button } from "@/components/ui";
import { FeatureList, CTASection, ServiceCard } from "@/components/blocks";
import { SiteImage } from "@/components/SiteImage";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/icons";

type Params = { slug: string };

const serviceMap = new Map<string, Service>(services.map((s) => [s.slug, s]));
const locationMap = new Map<string, { name: string; slug: string }>(
  locations.map((l) => [l.slug, l])
);
const careFormMap = new Map<string, CareForm>(careForms.map((f) => [f.slug, f]));

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...services.map((s) => ({ slug: s.slug })),
    ...locations.map((l) => ({ slug: l.slug })),
    ...careForms.map((f) => ({ slug: f.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceMap.get(slug);
  if (service) {
    return {
      title: `${service.hero}`,
      description: service.subhead,
    };
  }
  const loc = locationMap.get(slug);
  if (loc) {
    const title = `Home Care Services in ${loc.name}, MD`;
    const description = `Compassionate in-home care in ${loc.name}, Maryland — skilled nursing, personal care, companion care, respite, and homemaking from My Home Cares. Call ${site.phone} for a free consultation.`;
    return {
      title,
      description,
      alternates: { canonical: `${site.url}/${loc.slug}/` },
      openGraph: { title: `${title} | ${site.name}`, description, url: `${site.url}/${loc.slug}/`, type: "website" },
    };
  }
  const form = careFormMap.get(slug);
  if (form) {
    return { title: form.title, description: form.summary };
  }
  return {};
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = serviceMap.get(slug);
  if (service) return <ServiceTemplate service={service} />;
  const loc = locationMap.get(slug);
  if (loc) return <LocationTemplate name={loc.name} />;
  const form = careFormMap.get(slug);
  if (form) return <CareFormTemplate form={form} />;
  notFound();
}

/* ---------------- Care form template ---------------- */

function CareFormTemplate({ form }: { form: CareForm }) {
  const others = careForms.filter((f) => f.slug !== form.slug);
  return (
    <>
      <section className="hero-gradient border-b border-border">
        <Container className="py-14 sm:py-18">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/resources" className="hover:text-primary">Resources</Link>
            <span>/</span>
            <span className="text-ink">{form.title}</span>
          </nav>
          <div className="max-w-3xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary">
              Care Documentation
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{form.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{form.purpose}</p>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold">What this form captures</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Our care team uses the {form.title.toLowerCase()} to keep care consistent, safe, and
              clearly communicated with families and providers. It typically records:
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
              <FeatureList items={form.captures} />
            </div>
            <p className="mt-6 leading-relaxed text-muted">
              Need a copy of this form, or have questions about our documentation and care planning?
              Our team is happy to help — reach out any time.
            </p>
            <div className="mt-6">
              <Button href="/contact" withArrow>Contact Our Care Team</Button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Other Resources</h3>
              <ul className="mt-3 space-y-1">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/${o.slug}`} className="block rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-primary-50 hover:text-primary">
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

/* ---------------- Service template ---------------- */

function ServiceTemplate({ service }: { service: Service }) {
  const others = services.filter((s) => s.slug !== service.slug);
  return (
    <>
      <section className="hero-gradient border-b border-border">
        <Container className="py-14 sm:py-18">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/home-care" className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-ink">{service.title}</span>
          </nav>
          <div className="max-w-3xl animate-rise">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {service.hero}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{service.subhead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/contact" withArrow>Schedule a Consultation</Button>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-primary">
                <Icon name="phone" className="h-4 w-4 text-primary" /> Call {site.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            {serviceImages[service.slug] && (
              <SiteImage
                path={serviceImages[service.slug]}
                alt={`${service.title} in Maryland`}
                className="mb-8 aspect-[16/9] w-full rounded-2xl"
              />
            )}
            <h2 className="text-2xl font-bold sm:text-3xl">Specialized {service.title} Care</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{service.intro}</p>

            <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="text-lg font-bold">What&apos;s included</h3>
              <div className="mt-5">
                <FeatureList items={service.features} />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold">Why choose My Home Cares</h3>
              <p className="mt-3 leading-relaxed text-muted">
                Choosing My Home Cares means entrusting your loved ones to a team renowned for
                expertise and compassion across Maryland. Our caregivers are highly qualified and
                deeply committed to care that goes beyond the basics — coordinating closely with
                families and providers to enhance quality of life. It&apos;s a personal touch that
                sets us apart as a leading provider of {service.title.toLowerCase()}.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <h3 className="font-bold">Request a consultation</h3>
              <p className="mt-1 text-sm text-muted">We&apos;ll respond promptly.</p>
              <div className="mt-4">
                <LeadForm compact source={`service-${service.slug}`} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Other Services</h3>
              <ul className="mt-3 space-y-1">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/${o.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-primary-50 hover:text-primary">
                      <Icon name={o.icon} className="h-4 w-4 text-primary" /> {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

/* ---------------- Location template ---------------- */

function LocationTemplate({ name }: { name: string }) {
  const cards = [
    {
      title: `Skilled Nursing in ${name}`,
      description: `For ${name} seniors needing skilled nursing at home — wound care, respiratory support, trach management, pre/post-surgery assistance and more.`,
      href: "/skilled-nursing",
      icon: "stethoscope",
    },
    {
      title: `Home Care Services in ${name}`,
      description: `Our caregiving team helps ${name} seniors maintain independence and dignity through respectful personal care, light housekeeping and companionship.`,
      href: "/home-care",
      icon: "heart-hand",
    },
    {
      title: `Personal Care in ${name}`,
      description: `Respectful, dignified help with bathing, dressing, grooming, mobility and medication reminders for ${name} seniors at home.`,
      href: "/personal-care",
      icon: "shield-heart",
    },
  ];

  return (
    <>
      <section className="hero-gradient border-b border-border">
        <Container className="py-14 sm:py-18">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/service-areas" className="hover:text-primary">Service Areas</Link>
            <span>/</span>
            <span className="text-ink">{name}</span>
          </nav>
          <div className="max-w-3xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary">
              <Icon name="mapPin" className="h-3.5 w-3.5" /> {name}, Maryland
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Trusted In-Home Care Services in {name}, MD
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Access skilled nursing, personal care assistance and everyday support through My
              Home Cares. Our professional team delivers compassionate home health care tailored for
              your loved one in {name}.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" withArrow>Get Started</Button>
              <Button href="/home-care" variant="outline">Explore Services</Button>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Comprehensive Home Health Services</p>
          <h2 className="text-3xl font-bold">Care for {name} families, delivered at home</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {name} families rely on My Home Cares for a full range of professional in-home health
            services delivered with expertise and care. Our skilled nurses provide wound management,
            IV therapies, catheter training and more. Caregivers promote independence by assisting
            with grooming, bathing, meal preparation and daily tasks — bringing skilled nursing and
            personal care tailored to each individual&apos;s needs, right at home.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {cards.map((c) => (
            <ServiceCard key={c.title} {...c} />
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow mb-3">Compassionate, people-focused care</p>
            <h2 className="text-3xl font-bold">About My Home Cares in {name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              With years of experience serving {name}, My Home Cares is a trusted provider of skilled
              nursing and personalized home care assistance. Our
              local team delivers professional home health care tailored to each client&apos;s unique
              needs — enabling independence and elevating quality of life, brought directly to your
              door.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="outline" withArrow>Learn More About Us</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 card-shadow">
            <h3 className="text-lg font-bold">Find Your Care in {name}</h3>
            <p className="mt-1 text-sm text-muted">Fill out the form with the needs of your loved one.</p>
            <div className="mt-4">
              <LeadForm compact source={`location-${name}`} />
            </div>
          </div>
        </div>
      </Section>

      <CTASection title={`Get in Touch — Serving ${name}, MD`} />
    </>
  );
}
