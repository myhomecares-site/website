import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Section, SectionHeading, Button } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Caregiver Jobs in Maryland, Better Pay & Benefits",
  description:
    "Looking for a home care agency that values you? My Home Cares offers competitive pay, real benefits, flexible scheduling, and a supportive team for caregivers, CNAs, GNAs, CMTs, and nurses across Maryland.",
  alternates: { canonical: "https://www.myhomecares.com/caregivers/" },
};

const reasons = [
  { icon: "star", title: "Competitive pay", text: "We believe great caregivers deserve great pay, and we back it up." },
  { icon: "shield-heart", title: "Real benefits", text: "Meaningful benefits and support, not just a paycheck." },
  { icon: "clock", title: "Flexible scheduling", text: "Hours that fit your life, full-time, part-time, or per diem." },
  { icon: "users", title: "A team that respects you", text: "A family-oriented culture where your voice and your work matter." },
  { icon: "activity", title: "Paid, OHCQ-compliant training", text: "Get certified and grow with training designed by our Director of Nursing." },
  { icon: "heart-hand", title: "Fast, friendly onboarding", text: "A simple application and a team that helps you start with confidence." },
];

export default function CaregiversPage() {
  return (
    <>
      <PageHero
        eyebrow="Now Hiring Across Maryland"
        title="Caregivers deserve better, come grow with us"
        subtitle="If your hard work isn't being valued where you are, there's a better home for it. My Home Cares offers competitive pay, real benefits, and a team that treats you like family, for caregivers, CNAs, GNAs, CMTs, and nurses across Maryland."
      >
        <Button href="/job-application" withArrow>Apply Now</Button>
        <Button href="/careers#openings" variant="outline">View Open Roles</Button>
      </PageHero>

      <Section>
        <SectionHeading
          center
          eyebrow="Why Caregivers Choose Us"
          title="Better pay. Real support. Work that feels like home."
          intro="We know caregiving is demanding, skilled work. Here's how we make sure it's also rewarding."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon name={r.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Already caring for someone, client-choice framing */}
      <Section muted>
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-white p-6 sm:p-10 lg:grid-cols-2 card-shadow">
          <div>
            <p className="eyebrow mb-3">Already Caring for Someone?</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Keep caring for the people you love, with better support behind you</h2>
            <p className="mt-4 leading-relaxed text-muted">
              If you currently support a client through a Maryland community or Medicaid program, ask
              us about continuing that care with My Home Cares. Clients are always free to choose
              their agency, and we make the transition simple, so you can keep caring for the person
              you&apos;ve grown close to, with better pay and a team that has your back.
            </p>
            <p className="mt-3 text-sm text-muted">
              Not sure if it&apos;s possible? Reach out, we&apos;ll walk you through it, no pressure.
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-6">
            <blockquote className="text-lg italic leading-relaxed text-ink-soft">
              &ldquo;We believe in nurturing a family-oriented team of caregivers who are passionate
              about making a difference, and in recognizing their work with the pay, respect, and
              support they deserve.&rdquo;
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-muted">— Lulu H. Mziray, Director of Operations</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 90% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready for a better place to do great work?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Apply in minutes and tell us your availability. We&apos;d love to welcome you to the team.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/job-application" variant="white" withArrow>Apply Now</Button>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
