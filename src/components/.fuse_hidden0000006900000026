"use client";

import { useEffect, useState } from "react";
import { ApplicationForm } from "./ApplicationForm";
import { Icon } from "./icons";

type Props = {
  label?: string;
  defaultPosition?: string;
  variant?: "primary" | "outline" | "link";
  className?: string;
};

export function ApplyButton({ label = "Apply Now", defaultPosition = "", variant = "primary", className = "" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const styles: Record<string, string> = {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(0,199,0,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark active:scale-[0.98]",
    outline:
      "inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-7 py-3.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-50",
    link: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark",
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${styles[variant]} ${className}`}>
        {label}
        {variant !== "link" && <Icon name="arrow" className="h-4 w-4" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative my-8 w-full max-w-xl animate-rise rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <div className="mb-5 pr-8">
              <p className="eyebrow mb-1">Join Our Team</p>
              <h2 className="text-2xl font-bold">Job Application</h2>
              {defaultPosition && <p className="mt-1 text-sm text-muted">Applying for: <span className="font-semibold text-ink">{defaultPosition}</span></p>}
            </div>
            <ApplicationForm defaultPosition={defaultPosition} onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
