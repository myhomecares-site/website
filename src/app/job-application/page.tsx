import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ApplicationForm } from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Job Application",
  description: "Apply to join the My Home Cares team. Start your rewarding career in home care across Maryland.",
};

export default function JobApplicationPage() {
  return (
    <section className="hero-gradient">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="eyebrow mb-3">Join Our Team</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Apply to My Home Cares</h1>
            <p className="mt-4 text-lg text-muted">
              Embark on a rewarding career filled with opportunities for growth, learning, and making
              a significant impact in the community.
            </p>
          </div>
          <div className="mt-10 rounded-3xl border border-border bg-white p-6 sm:p-8 card-shadow">
            <ApplicationForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
