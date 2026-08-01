"use client";

import { useRef, useState } from "react";
import { media, mediaAssets } from "@/lib/site";
import { Container } from "./ui";
import { Icon } from "./icons";

// Promo video that autoplays muted and loops (so it never blasts sound), with
// a clear unmute button for anyone who wants to hear it. Poster shows instantly
// while it buffers.
export function InteractivePromo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  }

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
            <video
              ref={ref}
              className="aspect-video w-full object-cover"
              poster={media(mediaAssets.promoPoster)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={media(mediaAssets.promoVideo)} type="video/mp4" />
            </video>

            {/* Unmute / mute control */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink shadow-md backdrop-blur transition hover:bg-white"
            >
              {muted ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m23 9-6 6" /><path d="m17 9 6 6" /></svg>
                  Tap for sound
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a9 9 0 0 1 0 14" /></svg>
                  Mute
                </>
              )}
            </button>
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
