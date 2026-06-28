import Link from "next/link";
import { site } from "@/lib/site";
import { LOGO_SYMBOL_DATA } from "@/lib/logoData";

// Header/footer lockup: the colorful leaf/person symbol (embedded so it always
// renders) paired with the wordmark styled to match the brand logo.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label={site.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SYMBOL_DATA} alt={`${site.name} logo`} className="h-14 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-logo text-[1.5rem] font-extrabold uppercase leading-none tracking-tight">
          <span className={light ? "text-white" : "text-[#3f4651]"}>MY</span>
          <span className={light ? "text-white/80" : "text-[#737b86]"}>HOMECARES</span>
        </span>
        <span
          className={`font-logo mt-1.5 text-[8px] font-semibold uppercase tracking-[0.34em] ${
            light ? "text-white/70" : "text-[#99a0aa]"
          }`}
        >
          Where Service Matters
        </span>
      </span>
    </Link>
  );
}
