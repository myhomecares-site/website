import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Section } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { Reviews } from "@/components/Reviews";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Reviews & Testimonials",
  description:
    "Read what Maryland families say about My Home Cares, and share your own experience. Compassionate, licensed in-home care across Maryland.",
  alternates: { canonical: "https://www.myhomecares.com/reviews/" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews & Testimonials"
        title="What Maryland families say about us"
        subtitle="The trust of the families we serve means everything. Read their words, and if we've cared for your loved one, we'd be grateful if you shared your experience."
      />

      <Reviews />

      <Section muted>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Had a good experience with My Home Cares?</h2>
          <p className="mt-4 leading-relaxed text-muted">
            A quick review helps other Maryland families find compassionate care for their loved ones,
            and it means the world to our caregivers. It only takes a minute.
          </p>
          <a
            href={site.reviewSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(0,199,0,0.55)] transition hover:-translate-y-0.5 hover:bg-accent-dark"
          >
            <Icon name="star" className="h-4 w-4" /> Leave us a Google review
          </a>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
