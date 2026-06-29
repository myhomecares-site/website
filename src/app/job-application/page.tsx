import type { Metadata } from "next";
import Link from "next/link";
import { jobs } from "@/lib/jobs";
import { Container } from "@/components/ui";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Job Application",
  description:
    "Apply to join the My Home Cares team. Tell us your availability and a member of our team will be in touch.",
};

export default async function JobApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const job = jobs.find((j) => j.slug === role);

  return (
    <section className="hero-gradient">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to Careers
          </Link>

          <div className="mt-5">
            <p className="eyebrow mb-2">Join Our Team</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Apply to My Home Cares</h1>
            {job ? (
              <p className="mt-3 text-lg text-muted">
                You&apos;re applying for{" "}
                <span className="font-semibold text-ink">{job.title}</span>. Fill out the application
                below, including your availability, and we&apos;ll be in touch.
              </p>
            ) : (
              <p className="mt-3 text-lg text-muted">
                Tell us about yourself and your availability. A member of our team will review your
                application and reach out soon.
              </p>
            )}
          </div>

          {job ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <aside className="space-y-6">
                <div className="rounded-2xl border border-border bg-white p-6 card-shadow">
                  <h2 className="text-lg font-bold">{job.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-dark">
                      <Icon name="briefcase" className="h-3.5 w-3.5" /> {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
                      <Icon name="clock" className="h-3.5 w-3.5" /> {job.schedule}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{job.summary}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-6 card-shadow">
                  <h3 className="text-sm font-bold text-ink">What we&apos;re looking for</h3>
                  <ul className="mt-3 space-y-2">
                    {job.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
              <div className="rounded-3xl border border-border bg-white p-6 shadow-xl sm:p-8">
                <ApplicationForm defaultPosition={job.title} />
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <aside className="rounded-2xl border border-border bg-white p-6 card-shadow lg:self-start">
                <h2 className="text-lg font-bold">Open positions</h2>
                <ul className="mt-3 space-y-2">
                  {jobs.map((j) => (
                    <li key={j.slug}>
                      <Link href={`/job-application?role=${j.slug}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-primary-50 hover:text-primary">
                        {j.title}
                        <Icon name="arrow" className="h-4 w-4 opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 px-3 text-xs text-muted">Not sure which role? Submit a general application and we&apos;ll help find your fit.</p>
              </aside>
              <div className="rounded-3xl border border-border bg-white p-6 shadow-xl sm:p-8">
                <ApplicationForm />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
