import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { services, locations, careForms, conditions, serviceImages, site, type Service, type CareForm, type Condition } from "@/lib/site";
import { Container, Section, Button } from "@/components/ui";
import { FeatureList, CTASection, ServiceCard } from "@/components/blocks";
import { SiteImage } from "@/components/SiteImage";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/icons";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

type Params = { slug: string };

const serviceMap = new Map<string, Service>(services.map((s) => [s.slug, s]));
const locationMap = new Map<string, { name: string; slug: string }>(
  locations.map((l) => [l.slug, l])
);
const careFormMap = new Map<string, CareForm>(careForms.map((f) => [f.slug, f]));
const conditionMap = new Map<string, Condition>(conditions.map((c) => [c.slug, c]));

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...services.map((s) => ({ slug: s.slug })),
    ...locations.map((l) => ({ slug: l.slug })),
    ...careForms.map((f) => ({ slug: f.slug })),
    ...conditions.map((c) => ({ slug: c.slug })),
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
      alternates: { canonical: `${site.url}/${service.slug}/` },
      openGraph: { title: `${service.hero} | ${site.name}`, description: service.subhead, url: `${site.url}/${service.slug}/`, type: "website" },
    };
  }
  const loc = locationMap.get(slug);
  if (loc) {
    const title = `Home Care & Senior Care in ${loc.name}, MD`;
    const description = `Home care and senior care in ${loc.name}, Maryland. In-home skilled nursing, personal care, companion care, respite, dementia care, and 24-hour caregivers from My Home Cares, a licensed Maryland RSA. Call ${site.phone} for a free consultation.`;
    return {
      title,
      description,
      alternates: { canonical: `${site.url}/${loc.slug}/` },
      openGraph: { title: `${title} | ${site.name}`, description, url: `${site.url}/${loc.slug}/`, type: "website" },
    };
  }
  const form = careFormMap.get(slug);
  if (form) {
    return {
      title: form.title,
      description: form.summary,
      alternates: { canonical: `${site.url}/${form.slug}/` },
      openGraph: { title: `${form.title} | ${site.name}`, description: form.summary, url: `${site.url}/${form.slug}/`, type: "website" },
    };
  }
  const condition = conditionMap.get(slug);
  if (condition) {
    return {
      title: condition.metaTitle,
      description: condition.metaDescription,
      alternates: { canonical: `${site.url}/${condition.slug}/` },
      openGraph: { title: condition.metaTitle, description: condition.metaDescription, url: `${site.url}/${condition.slug}/`, type: "website" },
    };
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
  if (loc) return <LocationTemplate name={loc.name} slug={loc.slug} />;
  const form = careFormMap.get(slug);
  if (form) return <CareFormTemplate form={form} />;
  const condition = conditionMap.get(slug);
  if (condition) return <ConditionTemplate condition={condition} />;
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
              Our team is happy to help, reach out any time.
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
  const url = `${site.url}/${service.slug}/`;
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "Home", url: site.url },
        { name: "Services", url: `${site.url}/home-care/` },
        { name: service.title, url },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: service.subhead,
        provider: { "@type": "HomeHealthCareBusiness", name: site.name, telephone: site.phone, url: site.url },
        areaServed: { "@type": "State", name: "Maryland" },
        url,
      }} />
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
            <h2 className="text-2xl font-bold sm:text-3xl">Specialized {service.title}</h2>
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
                deeply committed to care that goes beyond the basics, coordinating closely with
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

function LocationTemplate({ name, slug }: { name: string; slug: string }) {
  const cards = [
    {
      title: `Skilled Nursing in ${name}`,
      description: `For ${name} seniors needing skilled nursing at home, wound care, respiratory support, trach management, pre/post-surgery assistance and more.`,
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
      <JsonLd data={breadcrumbLd([
        { name: "Home", url: site.url },
        { name: "Service Areas", url: `${site.url}/service-areas/` },
        { name, url: `${site.url}/${slug}/` },
      ])} />
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
          <h2 className="text-3xl font-bold">Home care and senior care for {name} families</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {name} families rely on My Home Cares for a full range of professional in-home health
            services delivered with expertise and care. Our skilled nurses provide wound management,
            IV therapies, catheter training and more. Caregivers promote independence by assisting
            with grooming, bathing, meal preparation and daily tasks, bringing skilled nursing and
            personal care tailored to each individual&apos;s needs, right at home.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Whether you are searching for home care, senior care, elderly care, home health aides, or
            a trusted caregiver near you in {name}, we can help. We also provide specialized{" "}
            <Link href="/alzheimers-dementia-care-maryland" className="font-medium text-primary hover:underline">dementia and Alzheimer&apos;s care</Link>,{" "}
            <Link href="/parkinsons-care-maryland" className="font-medium text-primary hover:underline">Parkinson&apos;s care</Link>, and{" "}
            <Link href="/24-hour-live-in-care-maryland" className="font-medium text-primary hover:underline">24-hour and live-in care</Link>{" "}
            across {name}, with private pay and Maryland Medicaid waiver options.
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
              needs, enabling independence and elevating quality of life, brought directly to your
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

      <CTASection title={`Get in Touch, Serving ${name}, MD`} />
    </>
  );
}

/* ---------------- Condition template ---------------- */

function ConditionTemplate({ condition }: { condition: Condition }) {
  const related = services.filter((s) => (condition.relatedServices as readonly string[]).includes(s.slug));
  const otherConditions = conditions.filter((c) => c.slug !== condition.slug);
  const url = `${site.url}/${condition.slug}/`;
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "Home", url: site.url },
        { name: "Services", url: `${site.url}/home-care/` },
        { name: condition.name, url },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: condition.name,
        serviceType: condition.name,
        description: condition.subhead,
        provider: { "@type": "HomeHealthCareBusiness", name: site.name, telephone: site.phone, url: site.url },
        areaServed: { "@type": "State", name: "Maryland" },
        url,
      }} />
      <section className="hero-gradient border-b border-border">
        <Container className="py-14 sm:py-18">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/home-care" className="hover:text-primary">Services</Link>
            <span>/</span>
            <span className="text-ink">{condition.name}</span>
          </nav>
          <div className="max-w-3xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary">
              <Icon name="heart-hand" className="h-3.5 w-3.5" /> Specialized Care
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {condition.hero}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{condition.subhead}</p>
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
            <p className="text-lg leading-relaxed text-muted">{condition.intro}</p>

            <h2 className="mt-10 text-2xl font-bold sm:text-3xl">How we help</h2>
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <FeatureList items={condition.helpWith} />
            </div>

            <h3 className="mt-10 text-lg font-bold">Our approach</h3>
            <p className="mt-3 leading-relaxed text-muted">{condition.approach}</p>

            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold">Related services</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-3">
                  {related.map((s) => (
                    <ServiceCard
                      key={s.slug}
                      title={s.title}
                      description={s.short}
                      href={`/${s.slug}`}
                      icon={s.icon}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <h3 className="font-bold">Request a consultation</h3>
              <p className="mt-1 text-sm text-muted">We&apos;ll respond promptly.</p>
              <div className="mt-4">
                <LeadForm compact source={`condition-${condition.slug}`} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">More Specialized Care</h3>
              <ul className="mt-3 space-y-1">
                {otherConditions.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/${o.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-soft hover:bg-primary-50 hover:text-primary">
                      <Icon name={o.icon} className="h-4 w-4 text-primary" /> {o.navLabel}
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
