"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";
import { Container } from "@/components/ui";
import { Stars } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { CountUp } from "@/components/CountUp";

type Stat = { label: string } & ({ fixed: string } | { end: number; suffix?: string });

const STATS: Stat[] = [
  { fixed: "2018", label: "Caring since" },
  { end: 24, suffix: "+", label: "Counties served" },
  { end: 7, label: "Home care services" },
  { end: 5, label: "Maryland regions" },
];

export function ReviewsShowcase() {
  const [i, setI] = useState(0);
  const hasReviews = testimonials.length > 0;

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        {/* Animated trust stats */}
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface p-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold text-primary sm:text-5xl">
                {"fixed" in s ? s.fixed : <CountUp end={s.end} suffix={s.suffix} />}
              </div>
              <div className="mt-1 text-sm font-medium text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="mx-auto mt-14 max-w-3xl text-center">
          <Stars className="justify-center" />
          <p className="mt-3 text-sm font-semibold text-ink">
            Rated {site.googleReviews.rating.toFixed(1)} from {site.googleReviews.count} Google reviews
          </p>
          {hasReviews ? (
            <>
              <blockquote className="mx-auto mt-6 flex min-h-[7rem] items-center justify-center text-xl italic leading-relaxed text-ink-soft">
                &ldquo;{testimonials[i].quote}&rdquo;
              </blockquote>
              <p className="mt-3 font-semibold text-ink">
                {testimonials[i].name}
                {testimonials[i].location && <span className="font-normal text-muted"> · {testimonials[i].location}</span>}
              </p>
              {testimonials.length > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                  {testimonials.map((_, j) => (
                    <button key={j} onClick={() => setI(j)} aria-label={`Show review ${j + 1}`}
                      className={`h-2.5 rounded-full transition-all ${j === i ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted-light"}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Families across Maryland trust My Home Cares</h2>
              <blockquote className="mx-auto mt-5 max-w-2xl text-lg italic text-ink-soft">&ldquo;{site.trustLine}&rdquo;</blockquote>
            </>
          )}
          <div className="mt-8">
            <a href={site.reviewSearchUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(0,199,0,0.55)] transition hover:-translate-y-0.5 hover:bg-accent-dark">
              <Icon name="star" className="h-4 w-4" /> {hasReviews ? "Read more on Google" : "Leave us a Google review"}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
