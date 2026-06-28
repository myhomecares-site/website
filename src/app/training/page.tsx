import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Caregiver Training",
  description:
    "Maryland OHCQ-compliant RSA caregiver training for My Home Cares staff — short video modules covering the required competencies, with a certification check. Works on your phone.",
};

function StartButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.trainingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(0,199,0,0.55)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_12px_28px_-8px_rgba(0,199,0,0.6)] active:scale-[0.98] ${className}`}
    >
      Start Training
      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

const steps = [
  { icon: "phone", title: "Sign in", text: "Enter your phone number — we text you a 6-digit code. No password needed." },
  { icon: "activity", title: "Watch the modules", text: "Short video segments covering each OHCQ-required competency. Go at your own pace." },
  { icon: "check", title: "Pass the check", text: "Score 80% or higher on a short quiz to receive your training certificate." },
];

const highlights = [
  { icon: "shield-heart", title: "OHCQ-compliant", text: "Meets Maryland Residential Service Agency training requirements (OHCQ license RSA-01229)." },
  { icon: "heart-hand", title: "Built by our nurses", text: "Designed by our Director of Nursing, Courtney Dawkins, RN BSN." },
  { icon: "clock", title: "Quick & mobile", text: "About 30 minutes, and you can complete it right on your phone." },
  { icon: "star", title: "Certificate included", text: "Earn a certificate of completion you can keep for your records." },
];

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="OHCQ-Compliant Caregiver Training"
        title="RSA caregiver training, made simple"
        subtitle="Maryland OHCQ-compliant Residential Service Agency training for My Home Cares caregivers — short video modules covering the required competencies, ending with a quick certification check. We'll guide you the whole way."
      >
        <StartButton />
        <span className="self-center text-sm text-muted">Takes about 30 minutes · works on your phone</span>
      </PageHero>

      <Section>
        <SectionHeading center eyebrow="Three Simple Steps" title="How the training works" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-accent-50">{i + 1}</span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading center eyebrow="Why It Matters" title="Training you can trust" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon name={h.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{h.title}</h3>
              <p className="mt-2 text-sm text-muted">{h.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 85% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              New caregivers and current team members can complete the training any time, from any device.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <StartButton className="bg-white !text-accent-dark shadow-md hover:bg-accent-50" />
              <a href={`mailto:courtney@myhomecares.com`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <Icon name="mail" className="h-4 w-4" /> Questions? Email our Director of Nursing
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
