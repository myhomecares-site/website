import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { HrOnboarding } from "@/components/HrOnboarding";

export const metadata: Metadata = {
  title: "HR Onboarding (Staff)",
  robots: { index: false, follow: false },
};

export default function HrPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <HrOnboarding />
      </Container>
    </Section>
  );
}
