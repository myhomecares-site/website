import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { IncidentReportForm } from "@/components/IncidentReportForm";

export const metadata: Metadata = {
  title: "Incident Report",
  robots: { index: false, follow: false },
};

export default function IncidentReportPage() {
  return (
    <>
      <PageHero
        eyebrow="Confidential · Client Record"
        title="Incident report"
        subtitle="File within 24 hours. Write what was said and done, not who you think is right. Say who told you, quote exact words, and never leave a blank."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <IncidentReportForm />
        </div>
      </Section>
    </>
  );
}
