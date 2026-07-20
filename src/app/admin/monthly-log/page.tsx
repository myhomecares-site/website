import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { MonthlyLog } from "@/components/MonthlyLog";

export const metadata: Metadata = {
  title: "Monthly Log (Staff)",
  robots: { index: false, follow: false },
};

export default function MonthlyLogPage() {
  return (
    <Section>
      <Container className="max-w-5xl">
        <MonthlyLog />
      </Container>
    </Section>
  );
}
