import { site } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";
import { Container } from "./ui";
import { Stars } from "./blocks";
import { Icon } from "./icons";

export function Reviews() {
  const reviewLink = site.reviewSearchUrl;

  if (testimonials.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
            <Stars className="justify-center" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Families across Maryland trust My Home Cares</h2>
            <blockquote className="mx-auto mt-5 max-w-2xl text-lg italic text-ink-soft">
              &ldquo;{site.signature}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-muted">— {site.signatureBy}</p>
            <a
              href={reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(0,199,0,0.55)] transition hover:-translate-y-0.5 hover:bg-accent-dark"
            >
              <Icon name="star" className="h-4 w-4" /> Leave us a Google review
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Stars className="justify-center" />
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">What families say</h2>
          <p className="mt-3 text-lg text-muted">Real words from the Maryland families we care for.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name + t.quote} className="flex flex-col rounded-2xl border border-border bg-white p-6 card-shadow">
              <Stars />
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.name}
                {t.location && <span className="font-normal text-muted"> · {t.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={reviewLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary-50">
            <Icon name="star" className="h-4 w-4" /> Leave us a Google review
          </a>
        </div>
      </Container>
    </section>
  );
}
