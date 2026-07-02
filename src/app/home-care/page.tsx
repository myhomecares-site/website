import type { Metadata } from "next";
import { services, serviceImages, site } from "@/lib/site";
import { Section, SectionHeading, Button } from "@/components/ui";
import { ServiceCard, PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Expert Home Care Services in Maryland",
  description:
    "Compassionate, professional home care tailored to the unique needs of your loved ones across Maryland, skilled nursing, personal care, companionship and more.",
  alternates: { canonical: "https://www.myhomecares.com/home-care/" },
  openGraph: {
    title: "Expert Home Care Services in Maryland | My Home Cares",
    description:
      "Compassionate, professional home care tailored to the unique needs of your loved ones across Maryland, skilled nursing, personal care, companionship and more.",
    url: "https://www.myhomecares.com/home-care/",
    type: "website",
  },
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
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {services.map((s) => (
            <div key={s.slug} className="w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]">
              <ServiceCard title={s.title} description={s.short} href={`/${s.slug}`} icon={s.icon} image={serviceImages[s.slug]} />
            </div>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
