import type { Metadata } from "next";
import { services, serviceImages, site } from "@/lib/site";
import { Section, SectionHeading, Button } from "@/components/ui";
import { ServiceCard, PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Expert Home Care Services in Maryland",
  description:
    "Compassionate, professional home care tailored to the unique needs of your loved ones across Maryland — skilled nursing, personal care, companionship and more.",
};

export default function HomeCarePage() {
  return (
    <>
      <PageHero
        eyebrow="Our In-Home Care Services"
        title="Expert Home Care in Maryland"
        subtitle="Providing compassionate, professional home care tailored to meet the unique needs of your loved ones across Maryland."
      >
        <Button href="/contact" withArrow>Schedule a Consultation</Button>
        <a href={site.phoneHref} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-primary">
          <Icon name="phone" className="h-4 w-4 text-primary" /> {site.phone}
        </a>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Senior Care Services"
          title="A complete range of home care, all under one trusted team"
          intro="From clinical skilled nursing to everyday companionship, we tailor every service to the individual we serve."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} title={s.title} description={s.short} href={`/${s.slug}`} icon={s.icon} image={serviceImages[s.slug]} />
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
