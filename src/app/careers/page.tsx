import type { Metadata } from "next";
import { site } from "@/lib/site";
import { jobs } from "@/lib/jobs";
import { Section, SectionHeading, Button } from "@/components/ui";
import { PageHero } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Caregiver, CNA & GNA Jobs in Maryland",
  description:
    "Now hiring caregivers, CNAs, GNAs, CMTs, and nurses across Maryland. Competitive pay, real benefits, and flexible schedules. Apply online for home care jobs with My Home Cares.",
  alternates: { canonical: "https://www.myhomecares.com/careers/" },
  openGraph: {
    title: "Caregiver, CNA & GNA Jobs in Maryland | My Home Cares",
    description:
      "Now hiring caregivers, CNAs, GNAs, CMTs, and nurses across Maryland. Competitive pay, real benefits, and flexible schedules. Apply online for home care jobs with My Home Cares.",
    url: "https://www.myhomecares.com/careers/",
    type: "website",
  },
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
        subtitle="My Home Cares is more than a workplace, it's a community where compassion, excellence, and dedication are at the heart of everything we do."
      >
        <Button href="/job-application" withArrow>Apply Now</Button>
        <Button href="#openings" variant="outline">View Job Postings</Button>
      </PageHero>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Join our team today</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our team members are valued not just for their skills, but for the unique perspectives
              and passion they bring to our mission of providing outstanding care. We offer a
              supportive, inclusive environment that fosters professional growth and personal
              fulfillment, and the opportunity to make a real difference in your community.
            </p>
            <div className="mt-8">
              <Button href="#openings" withArrow>View Job Postings</Button>
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

      {/* Job postings */}
      <Section id="openings" muted>
        <SectionHeading
          center
          eyebrow="Open Positions"
          title="Current job postings"
          intro="Find your fit below and apply in minutes, tell us your availability and we'll be in touch."
        />
        <div className="mx-auto mt-12 max-w-4xl space-y-6">
          {jobs.map((job) => (
            <div key={job.slug} className="rounded-2xl border border-border bg-white p-6 sm:p-8 card-shadow">
              <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-dark">
                      <Icon name="briefcase" className="h-3.5 w-3.5" /> {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
                      <Icon name="clock" className="h-3.5 w-3.5" /> {job.schedule}
                    </span>
                  </div>
                </div>
                <Button href={`/job-application?role=${job.slug}`} className="shrink-0">Apply Now</Button>
              </div>

              <p className="mt-5 leading-relaxed text-muted">{job.summary}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-bold text-ink">Responsibilities</h4>
                  <ul className="mt-3 space-y-2">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" strokeWidth={2.5} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">What we&apos;re looking for</h4>
                  <ul className="mt-3 space-y-2">
                    {job.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">What we offer</p>
                <p className="mt-1.5 text-sm text-ink-soft">{job.benefits.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-white p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr] card-shadow">
          <div>
            <p className="eyebrow mb-3">For Our Caregivers</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Complete your OHCQ-compliant training online</h2>
            <p className="mt-4 leading-relaxed text-muted">
              New and current caregivers complete our Maryland RSA training through short video
              modules, designed by our Director of Nursing and finished with a certification check.
              About 30 minutes, right from your phone.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Button href="/training" withArrow>View Training Details</Button>
            <a href={site.trainingUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:text-primary-dark">
              Or start training now →
            </a>
          </div>
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 90% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to start your journey?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Apply now and become part of a team that values compassion, excellence, and a commitment to quality care.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/job-application" variant="white" withArrow>Apply Now</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
