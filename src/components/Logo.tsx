import Link from "next/link";
import { site } from "@/lib/site";
import { LOGO_SYMBOL_DATA } from "@/lib/logoData";

// Header/footer lockup: the colorful leaf/person symbol (embedded so it always
// renders) paired with the brand name for recognition.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label={site.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SYMBOL_DATA} alt={`${site.name} logo`} className="h-12 w-auto" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.2rem] font-extrabold tracking-tight ${
            light ? "text-white" : "text-ink"
          }`}
        >
          My Home Cares
        </span>
        <span
          className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${
            light ? "text-white/70" : "text-accent-dark"
          }`}
        >
          Where Service Matters
        </span>
      </span>
    </Link>
  );
}
