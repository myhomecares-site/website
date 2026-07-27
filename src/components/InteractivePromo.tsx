"use client";

import { useState } from "react";
import { media, mediaAssets } from "@/lib/site";
import { Container } from "./ui";
import { Icon } from "./icons";

// Click-to-play promo video. Shows a lightweight poster until the visitor
// chooses to watch — nothing loads or plays (and no sound) until they click,
// so it never slows the page or surprises anyone.
export function InteractivePromo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-24">
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Watch Our Story</p>
          <h2 className="text-3xl font-bold sm:text-4xl">See what compassionate home care looks like</h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            A short look at how My Home Cares supports Maryland families, the people, the services, and
            the care behind everything we do.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="group relative overflow-hidden rounded-3xl bg-ink ring-1 ring-black/5 shadow-xl">
            {playing ? (
              <video
                className="aspect-video w-full"
                src={media(mediaAssets.promoVideo)}
                poster={media(mediaAssets.promoPoster)}
                controls
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Play the My Home Cares promo video"
                className="relative block w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media(mediaAssets.promoPoster)}
                  alt="My Home Cares caregiver supporting a client at home"
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-xl transition duration-300 group-hover:scale-105 group-hover:bg-white">
                    <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow backdrop-blur">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-primary" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                  Watch our story · 2 min
                </span>
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Schedule a free consultation <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
