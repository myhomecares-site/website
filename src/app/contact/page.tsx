import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with My Home Cares for personalized home care services in Maryland. Fill out our contact form for all inquiries, we're here to help.",
};

export default function ContactPage() {
  return (
    <section className="hero-gradient">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-rise">
            <p className="eyebrow mb-3">We&apos;re here to help</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Get in touch with My Home Cares
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Reach out for personalized care solutions. Contact us today to discuss your needs and
              learn how we can support you and your loved ones.
            </p>

            <div className="mt-10 space-y-4">
              <a href={site.phoneHref} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-primary/30 card-shadow">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name="phone" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-muted">Call us</span>
                  <span className="block font-bold text-ink">{site.phone}</span>
                </span>
              </a>
              <a href={site.emailHref} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-primary/30 card-shadow">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name="mail" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-muted">Email us</span>
                  <span className="block font-bold text-ink">{site.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 card-shadow">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name="mapPin" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-muted">Service area</span>
                  <span className="block font-bold text-ink">Serving all of Maryland</span>
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary-50 p-5">
              <p className="text-sm font-semibold text-ink">Looking for healthcare staffing?</p>
              <p className="mt-1 text-sm text-muted">
                {site.staffing.name}: {site.staffing.phone} · {site.staffing.email}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 card-shadow">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-1 text-muted">For all general inquiries, fill in the form below.</p>
            <div className="mt-6">
              <LeadForm withTime source="contact-page" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
