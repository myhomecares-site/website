import type { Metadata } from "next";
import Link from "next/link";
import { careForms } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Care Resources & Forms",
  description:
    "Care documentation and forms used by the My Home Cares team, service plans, assessments, medication records, and daily logs.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation & Forms"
        title="Care resources"
        subtitle="The documentation our team uses to keep care safe, consistent, and clearly communicated with families and providers."
      />
      <Section>
        <SectionHeading title="Forms & care documentation" intro="Learn about the forms behind our personalized, well-documented care." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {careForms.map((f) => (
            <Link
              key={f.slug}
              href={`/${f.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 card-shadow"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 text-lg font-bold group-hover:text-primary">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{f.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
