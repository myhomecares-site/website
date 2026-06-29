import Link from "next/link";
import { site } from "@/lib/site";
import { LOGO_WORDMARK_DATA } from "@/lib/logoData";

// The full brand wordmark (symbol + MYHOMECARES + "Where Service Matters"),
// embedded as a data URI so it always renders crisply.
export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label={site.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_WORDMARK_DATA} alt={`${site.name}, Where Service Matters`} className="h-14 w-auto sm:h-16" />
    </Link>
  );
}
