import type { Metadata } from "next";
import { faqs } from "@/lib/faq";
import { Section } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { FaqList } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about home care in Maryland, services, licensing, cost and payment options (private pay, Medicaid waiver), service areas, and getting started with My Home Cares.",
  alternates: { canonical: "https://www.myhomecares.com/faq/" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions & Answers"
        title="Frequently asked questions"
        subtitle="Everything Maryland families ask about home care, costs, licensing, and getting started. Don't see your question? Reach out, we're happy to help."
      />
      <Section>
        <FaqList items={faqs} withSchema />
      </Section>
      <CTASection />
    </>
  );
}
