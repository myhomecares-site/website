import type { Metadata } from "next";
import { Section, Button } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Careers in Maryland",
  description:
    "A rewarding career in home care awaits. Join My Home Cares — a community where compassion, excellence, and dedication are at the heart of everything we do.",
};

const perks = [
  { icon: "heart-hand", title: "Meaningful work", text: "Make a real difference in the lives of clients and their families every day." },
  { icon: "users", title: "Supportive team", text: "A family-oriented, inclusive culture that celebrates teamwork." },
  { icon: "star", title: "Growth", text: "Continuous improvement, training, and professional development." },
  { icon: "shield-heart", title: "Values-driven", text: "Excellence, integrity, and compassion in everything we do." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Home Care Jobs in Maryland"
        title="A rewarding career in home care awaits"
        subtitle="My Home Cares is more than a workplace — it's a community where compassion, excellence, and dedication are at the heart of everything we do."
      >
        <Button href="/job-application" withArrow>Apply Now</Button>
      </PageHero>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Join our team today</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our team members are valued not just for their skills, but for the unique perspectives
              and passion they bring to our mission of providing outstanding care. We offer a
              supportive, inclusive environment that fosters professional growth and personal
              fulfillment — and the opportunity to make a real difference in your community.
            </p>
            <div className="mt-8">
              <Button href="/job-application" withArrow>View Application</Button>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {perks.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTASection title="Ready to start your journey?" text="Apply now and become part of a team that values compassion, excellence, and a commitment to quality care." />
    </>
  );
}
