import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { AdminRecords } from "@/components/AdminRecords";

export const metadata: Metadata = {
  title: "Form Records (Staff)",
  robots: { index: false, follow: false },
};

export default function AdminRecordsPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <AdminRecords />
      </Container>
    </Section>
  );
}
