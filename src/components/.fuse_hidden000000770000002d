// Decorative, non-interactive graphics used to add visual interest.

export function Blobs({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <span
        className="blob"
        style={{ width: 320, height: 320, top: "-80px", right: "-60px", background: "rgba(0,158,230,0.35)" }}
      />
      <span
        className="blob"
        style={{ width: 280, height: 280, bottom: "-90px", left: "-70px", background: "rgba(0,199,0,0.28)", animationDelay: "3s" }}
      />
    </div>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return <div className={`dot-grid pointer-events-none absolute ${className}`} aria-hidden />;
}

export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`-mb-px ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg className="wave-divider" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 48h1440V20c-160 18-360 26-720 8C420 16 180 12 0 26v22Z" />
      </svg>
    </div>
  );
}

// Subtle watermark of the brand leaf/person mark.
export function LeafWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute opacity-[0.06] ${className}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2c2 3 2 6 0 9-2-3-2-6 0-9Zm-7 5c3 .5 5 2 6 5-3-.5-5-2-6-5Zm14 0c-3 .5-5 2-6 5 3-.5 5-2 6-5Z" />
    </svg>
  );
}
