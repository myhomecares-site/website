"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

// Renders the real brand wordmark (public/brand/mhc-wordmark.png) when present,
// and a clean styled fallback if the image file hasn't been added yet.
export function Logo({ light = false }: { light?: boolean }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label={site.name}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/mhc-wordmark.png"
          alt={`${site.name} logo`}
          className="h-11 w-auto"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className="inline-flex items-center gap-2.5">
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-lg font-extrabold tracking-tight ${
                light ? "text-white" : "text-ink"
              }`}
            >
              My Home Cares
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                light ? "text-white/70" : "text-accent-dark"
              }`}
            >
              Where Service Matters
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}

export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-accent-light to-primary-light text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M3 10.5 12 3l9 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 9.5V20h14V9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17s-3-1.9-3-4.1A1.7 1.7 0 0 1 12 11.5a1.7 1.7 0 0 1 3 1.4c0 2.2-3 4.1-3 4.1Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
