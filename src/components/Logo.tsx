import Link from "next/link";
import { site } from "@/lib/site";
import { LOGO_WORDMARK_DATA, LOGO_SYMBOL_DATA } from "@/lib/logoData";

// Brand logo. `variant` chooses the full wordmark (symbol + MYHOMECARES + tagline)
// or the symbol-only mark. `className` controls the height.
export function Logo({
  variant = "wordmark",
  className = "h-14 w-auto sm:h-16",
}: {
  variant?: "wordmark" | "symbol";
  className?: string;
}) {
  const src = variant === "symbol" ? LOGO_SYMBOL_DATA : LOGO_WORDMARK_DATA;
  return (
    <Link
      href="/"
      aria-label={site.name}
      className="group inline-flex origin-left items-center transition-transform duration-300 ease-out hover:scale-[1.06] active:scale-95"
    >
      <span className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${site.name}, Where Service Matters`}
          className={`logo-reveal block w-auto transition duration-300 ease-out group-hover:drop-shadow-[0_10px_18px_rgba(0,158,230,0.32)] ${className}`}
        />
        {/* Light sweep, masked to the exact logo shape so it glints only on the mark */}
        <span
          aria-hidden
          className="logo-shimmer pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
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
