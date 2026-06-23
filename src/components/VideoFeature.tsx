"use client";

import { useRef, useState } from "react";
import { media, mediaAssets } from "@/lib/site";
import { Container } from "./ui";
import { Icon } from "./icons";

export function VideoFeature() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  function toggleMute() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play();
  }

  if (failed) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(900px 420px at 80% 30%, rgba(0,158,230,0.08), transparent 60%), radial-gradient(700px 400px at 10% 80%, rgba(0,199,0,0.07), transparent 60%)" }}
        aria-hidden
      />
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow mb-3">See How We Care</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Compassionate care, in action</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Watch how My Home Cares brings skilled, heartfelt support into the homes of Maryland
              families — helping your loved ones live with comfort, dignity, and independence.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Personalized, one-on-one care at home",
                "Trained, compassionate caregivers",
                "Serving families across Maryland",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink-soft">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-accent-dark">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            {/* soft brand glow behind the video for a blended look */}
            <div
              className="absolute -inset-4 -z-10 rounded-[2rem] opacity-70 blur-2xl"
              style={{ background: "linear-gradient(135deg, rgba(0,158,230,0.25), rgba(0,199,0,0.22))" }}
              aria-hidden
            />
            <div className="group relative overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-xl">
              <video
                ref={ref}
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={() => setFailed(true)}
              >
                <source src={media(mediaAssets.video)} type="video/mp4" />
              </video>
              {/* gentle gradient blend at the edges */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(17,23,30,0.18), transparent 35%)" }}
                aria-hidden
              />
              <button
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur transition hover:bg-white"
              >
                {muted ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m23 9-6 6" /><path d="m17 9 6 6" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a9 9 0 0 1 0 14" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
