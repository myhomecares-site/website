"use client";

import { useEffect, useRef, useState } from "react";

// Address autocomplete powered by Photon (OpenStreetMap) — free, no API key,
// no billing. As the applicant types their street address, suggestions drop
// down and one tap fills street, city, state, and ZIP. Every field also stays
// fully typeable, so the form always works even if the lookup is unavailable.

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";

const US_STATES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

type Suggestion = { label: string; line1: string; city: string; state: string; zip: string };

export function AddressAutocomplete() {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateV, setStateV] = useState("");
  const [zip, setZip] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false); // don't re-search right after a pick

  useEffect(() => {
    if (skipRef.current) { skipRef.current = false; return; }
    const q = street.trim();
    if (q.length < 3) { setSuggestions([]); setOpen(false); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        // Bias results toward Maryland; filter to US addresses.
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lang=en&lat=39.05&lon=-76.6`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const feats: any[] = data.features || [];
        const seen = new Set<string>();
        const list: Suggestion[] = [];
        for (const f of feats) {
          const p = f.properties || {};
          if (p.countrycode !== "US") continue;
          const line1 = [p.housenumber, p.street || p.name].filter(Boolean).join(" ");
          if (!line1) continue;
          const cityV = p.city || p.town || p.village || p.municipality || p.district || "";
          const stAbbr = US_STATES[p.state] || p.state || "";
          const label = [line1, cityV, stAbbr, p.postcode].filter(Boolean).join(", ");
          if (seen.has(label)) continue;
          seen.add(label);
          list.push({ label, line1, city: cityV, state: stAbbr, zip: p.postcode || "" });
          if (list.length >= 6) break;
        }
        setSuggestions(list);
        setOpen(list.length > 0);
        setActive(-1);
      } catch { /* network/abort — manual entry still works */ }
    }, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [street]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const choose = (s: Suggestion) => {
    skipRef.current = true;
    setStreet(s.line1);
    setCity(s.city);
    setStateV(s.state);
    setZip(s.zip);
    setSuggestions([]);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") e.preventDefault(); // don't submit the form from the address box
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (active >= 0) choose(suggestions[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <>
      <div className="relative" ref={boxRef}>
        <label className={labelCls}>Street address</label>
        <input
          name="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (suggestions.length) setOpen(true); }}
          autoComplete="address-line1"
          className={input}
          placeholder="Start typing your address…"
        />
        {open && (
          <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg">
            {suggestions.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); choose(s); }}
                  className={`block w-full px-4 py-2 text-left text-sm ${i === active ? "bg-primary-50 text-primary" : "text-ink-soft hover:bg-surface"}`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1 text-[11px] text-muted-light">Start typing to search, or just fill the fields below. Address data © OpenStreetMap.</p>
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-3">
        <div>
          <label className={labelCls}>City</label>
          <input name="city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" className={input} />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <input name="state" value={stateV} onChange={(e) => setStateV(e.target.value)} autoComplete="address-level1" className={`${input} w-20`} placeholder="MD" maxLength={20} />
        </div>
        <div>
          <label className={labelCls}>ZIP</label>
          <input name="zip" value={zip} onChange={(e) => setZip(e.target.value)} autoComplete="postal-code" inputMode="numeric" className={`${input} w-24`} />
        </div>
      </div>
    </>
  );
}
