"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mdCounties, MD_MAP } from "@/lib/md-map";
import { cityLocations } from "@/lib/site";
import { Icon } from "@/components/icons";

const REGION_FILL: Record<string, string> = {
  Central: "#009ee6",
  Capital: "#66c7ee",
  Southern: "#a9dff5",
  Western: "#cfeefb",
  "Eastern Shore": "#7ed69a",
};
const REGIONS = ["Central", "Capital", "Southern", "Western", "Eastern Shore"];

export function MarylandMap() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const cur = active ? mdCounties.find((c) => c.slug === active) || null : null;
  const cities = cur ? cityLocations.filter((c) => c.county === cur.name) : [];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <svg viewBox={`0 0 ${MD_MAP.width} ${MD_MAP.height}`} className="h-auto w-full" role="img" aria-label="Interactive map of Maryland counties served by My Home Cares">
          {mdCounties.map((c) => (
            <path
              key={c.slug}
              d={c.d}
              fill={REGION_FILL[c.region]}
              stroke="#ffffff"
              strokeWidth={active === c.slug ? 2 : 1}
              className="cursor-pointer transition-[filter]"
              style={{ filter: active === c.slug ? "brightness(0.85)" : "none" }}
              onMouseEnter={() => setActive(c.slug)}
              onFocus={() => setActive(c.slug)}
              onClick={() => router.push(`/${c.slug}`)}
              tabIndex={0}
              role="button"
              aria-label={`Home care in ${c.name}`}
            >
              <title>{c.name}</title>
            </path>
          ))}
          {mdCounties.map((c) => (
            <text key={c.slug + "-t"} x={c.cx} y={c.cy} textAnchor="middle" className="pointer-events-none fill-[#123047] text-[8.5px] font-semibold">
              {c.name.replace(" County", "")}
            </text>
          ))}
        </svg>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {REGIONS.map((r) => (
            <span key={r} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className="h-3 w-3 rounded-sm" style={{ background: REGION_FILL[r] }} /> {r}
            </span>
          ))}
        </div>

        {cur ? (
          <div className="rounded-2xl border border-border bg-white p-5 card-shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{cur.region} region</p>
            <h3 className="mt-1 text-xl font-bold text-ink">{cur.name}</h3>
            {cities.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted">Towns we serve here:</p>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((ci) => (
                    <Link key={ci.slug} href={`/${ci.slug}`} className="rounded-full border border-border px-2.5 py-1 text-xs text-ink-soft transition hover:border-primary/30 hover:text-primary">
                      {ci.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link href={`/${cur.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
              See home care in {cur.name} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p className="font-semibold text-ink-soft">Find care in your area</p>
            <p className="mt-1 text-sm text-muted">Hover or tap your county on the map to see the towns we serve nearby and jump to your local care page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
