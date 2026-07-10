import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { DocumentRequestForm } from "@/components/DocumentRequestForm";

export const metadata: Metadata = {
  title: "Request Client Records",
  description:
    "Authorized nurse monitors, case managers, providers, and representatives can request a client's assessment or care records from My Home Cares.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site.url}/document-request/` },
};

export default function DocumentRequestPage() {
  return (
    <>
      <PageHero
        eyebrow="For Authorized Parties"
        title="Request client records"
        subtitle="Nurse monitors, case managers, providers, and authorized representatives can request a client's assessment or care documents here. We verify every request before releasing records."
      />

      <Section>
        <Container className="max-w-3xl">
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm text-ink-soft">
            <Icon name="shield-heart" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              This form is a request only. <strong>Please do not enter protected health information</strong> beyond
              what&apos;s asked. To protect our clients&apos; privacy, we verify each requester&apos;s identity and
              authorization before releasing any records, then arrange secure delivery. Questions? Call{" "}
              <a href={site.phoneHref} className="font-semibold text-primary hover:underline">{site.phone}</a>.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 card-shadow">
            <DocumentRequestForm />
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            My Home Cares · Licensed Maryland RSA {site.license} · {site.phone} · {site.email}
          </p>
        </Container>
      </Section>
    </>
  );
}
