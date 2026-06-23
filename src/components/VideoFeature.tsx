"use client";

import { useRef, useState } from "react";
import { media, mediaAssets } from "@/lib/site";
import { Container } from "./ui";
import { Icon } from "./icons";

export function VideoFeature() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  if (failed) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">See How We Care</p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Compassionate care, in action
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
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

          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink card-shadow">
            <video
              ref={ref}
              className="aspect-video w-full bg-ink"
              playsInline
              controls={playing}
              preload="metadata"
              onError={() => setFailed(true)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={media(mediaAssets.video)} type="video/mp4" />
            </video>
            {!playing && (
              <button
                onClick={toggle}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center bg-ink/30 transition hover:bg-ink/20"
              >
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition group-hover:scale-105">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-9 w-9">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
