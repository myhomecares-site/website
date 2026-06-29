import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Section, SectionHeading, Button } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "CareLink Staffing — Healthcare Staffing in Maryland",
  description:
    "CareLink Staffing connects Maryland healthcare facilities with top-tier nurses, CNAs, medical technicians, and speech pathologists. 24/7 support.",
};

const facilities = [
  "Hospitals",
  "Nursing Homes",
  "Assisted Living Facilities",
  "Rehabilitation Centers",
  "Urgent Care Centers",
  "Clinics",
  "Senior Care Centers",
  "Doctor's Offices",
];

const professionals = [
  { title: "Registered Nurses (RNs)", text: "Expert clinical care and leadership ensuring quality medical support." },
  { title: "Licensed Practical Nurses (LPNs)", text: "Dedicated hands-on patient care, critical to daily operations." },
  { title: "Certified Nursing Assistants (CNAs)", text: "Compassionate, attentive caregivers who make daily life more comfortable." },
  { title: "Speech Pathologists", text: "Skilled in diagnosing and treating communication and swallowing disorders." },
  { title: "Certified Medical Technicians (CMTs)", text: "Experts in medication administration and health monitoring." },
];

const why = [
  { icon: "shield-heart", title: "Qualified professionals", text: "Every professional is thoroughly vetted and trained." },
  { icon: "heart-hand", title: "Customized solutions", text: "Staffing tailored to each facility and setting." },
  { icon: "check", title: "Compliance & quality", text: "Strict adherence to industry standards and exceptional care." },
  { icon: "clock", title: "24/7 support", text: "Our team is available around the clock." },
];

export default function CareLinkPage() {
  return (
    <>
      <PageHero
        eyebrow="Healthcare Staffing Agency"
        title="CareLink Staffing: your premier healthcare staffing partner in Maryland"
        subtitle="We bring Maryland healthcare facilities and talented professionals together — connecting top-tier nurses, CNAs, medical technicians, and speech pathologists with facilities across the state."
      >
        <a href={`tel:${site.staffing.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
          <Icon name="phone" className="h-4 w-4" /> {site.staffing.phone}
        </a>
        <Button href="/job-application" variant="outline">Join the Team</Button>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Our Mission"
          title="Raising the standard for healthcare staffing in Maryland"
          intro="We elevate healthcare by matching skilled, compassionate professionals with facilities in need — benefiting facilities, staff, and most importantly, patients."
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Who we serve</h3>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {facilities.map((f) => (
                <div key={f} className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink-soft">
                  <Icon name="check" className="h-4 w-4 text-primary" strokeWidth={2.5} /> {f}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">The professionals we provide</h3>
            <ul className="mt-5 space-y-4">
              {professionals.map((p) => (
                <li key={p.title} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading center eyebrow="Why CareLink" title="Why choose CareLink Staffing?" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon name={w.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Connect with CareLink Staffing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Whether you&apos;re securing reliable staffing for your facility or exploring career
            opportunities, CareLink Staffing is here to help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={`tel:${site.staffing.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary-50">
              <Icon name="phone" className="h-4 w-4" /> {site.staffing.phone}
            </a>
            <a href={`mailto:${site.staffing.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              <Icon name="mail" className="h-4 w-4" /> {site.staffing.email}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
