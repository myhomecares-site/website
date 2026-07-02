import type { Metadata } from "next";
import Link from "next/link";
import { regions, countySlug, site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Service Areas in Maryland",
  description:
    "Explore My Home Cares service areas across Maryland, including the Western, Capital, Central, Southern, and Eastern Shore Regions.",
  alternates: { canonical: "https://www.myhomecares.com/service-areas/" },
  openGraph: {
    title: "Service Areas in Maryland | My Home Cares",
    description:
      "Explore My Home Cares service areas across Maryland, including the Western, Capital, Central, Southern, and Eastern Shore Regions.",
    url: "https://www.myhomecares.com/service-areas/",
    type: "website",
  },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Statewide Coverage"
        title="Our Maryland service areas"
        subtitle="My Home Cares provides compassionate in-home care across all five regions of Maryland. Find your county below to learn about local care."
      />

      <Section>
        <SectionHeading
          title="Five regions, 24+ counties served"
          intro="Select your region or county to explore home care, skilled nursing, and personal care services near you."
        />
        <div className="mt-12 space-y-10">
          {regions.map((region) => (
            <div key={region.slug} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2.5 text-xl font-bold">
                  <Icon name="mapPin" className="h-5 w-5 text-primary" />
                  {region.name}
                </h3>
                <Link
                  href={`/home-care-services-${region.slug}-md`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  View region <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {region.counties.map((county) => (
                  <Link
                    key={county}
                    href={`/${countySlug(county)}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink-soft transition hover:border-primary/30 hover:text-primary"
                  >
                    {county}
                    <Icon name="arrow" className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/15 bg-primary-50 p-6 text-center">
          <p className="text-ink">
            Don&apos;t see your county? We&apos;re always expanding.{" "}
            <a href={site.phoneHref} className="font-semibold text-primary">Call {site.phone}</a> to ask about care in your area.
          </p>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
