import { site } from "@/lib/site";

// Print-only letterhead shown at the top of a printed / saved-as-PDF care form.
// Hidden on screen; gives the printout a professional clinical-document look.
export function PrintLetterhead({ title }: { title: string }) {
  return (
    <div className="hidden print:block">
      <div className="flex items-end justify-between border-b-2 border-ink pb-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mhc-wordmark.png" alt={site.name} className="mb-1.5 h-12 w-auto" />
          <p className="text-[11px] leading-snug text-ink-soft">Licensed Maryland Residential Service Agency</p>
          <p className="text-[11px] leading-snug text-ink-soft">
            License {site.license} · {site.phone} · {site.email}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Care Documentation</p>
          <p className="text-base font-bold leading-tight text-ink">{title}</p>
        </div>
      </div>
      <div className="mt-1.5 mb-4 flex items-center justify-between text-[10px] text-muted">
        <span>Serving all of Maryland</span>
        <span className="italic">Confidential — contains protected health information</span>
      </div>
    </div>
  );
}
