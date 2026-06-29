"use client";

import { useState } from "react";
import { media } from "@/lib/site";

// Renders a real photo from MEDIA_BASE; if it fails to load, falls back to a
// soft brand gradient so the layout never shows a broken image.
export function SiteImage({
  path,
  alt,
  className = "",
  imgClassName = "",
}: {
  path: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`relative block overflow-hidden bg-surface-2 ${className}`}>
      {failed ? (
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,158,230,0.18), rgba(0,199,0,0.16))",
          }}
          aria-hidden
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media(path)}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </span>
  );
}
