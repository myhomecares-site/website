import Link from "next/link";
import { site } from "@/lib/site";
import { LOGO_WORDMARK_DATA } from "@/lib/logoData";

// The full brand wordmark (symbol + MYHOMECARES + "Where Service Matters"),
// embedded as a data URI so it always renders crisply.
// `className` controls the logo height (defaults to the footer size).
export function Logo({ className = "h-14 w-auto sm:h-16" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={site.name}
      className="group inline-flex origin-left items-center transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95"
    >
      <span className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_WORDMARK_DATA}
          alt={`${site.name}, Where Service Matters`}
          className={`logo-reveal block w-auto transition duration-300 ease-out group-hover:drop-shadow-[0_8px_16px_rgba(0,158,230,0.28)] ${className}`}
        />
        {/* Light sweep, masked to the exact logo shape so it glints only on the mark */}
        <span
          aria-hidden
          className="logo-shimmer pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: `url(${LOGO_WORDMARK_DATA})`,
            maskImage: `url(${LOGO_WORDMARK_DATA})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        />
      </span>
    </Link>
  );
}
