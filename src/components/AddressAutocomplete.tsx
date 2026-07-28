"use client";

import { useEffect, useRef } from "react";

// Google Places address autocomplete for the job application. As the applicant
// types their street address, real addresses drop down and one tap fills the
// street, city, state, and ZIP. If no API key is configured it degrades to
// plain typing — the inputs and form submission work exactly the same.

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";

// Load the Google Maps JS (Places library) once, shared across mounts.
let gmapsPromise: Promise<void> | null = null;
function loadGoogleMaps(key: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).google?.maps?.places) return Promise.resolve();
  if (gmapsPromise) return gmapsPromise;
  gmapsPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&loading=async`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return gmapsPromise;
}

export function AddressAutocomplete() {
  const streetRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key || !streetRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ac: any;
    loadGoogleMaps(key)
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google;
        if (!g?.maps?.places || !streetRef.current) return;
        ac = new g.maps.places.Autocomplete(streetRef.current, {
          fields: ["address_components"],
          types: ["address"],
          componentRestrictions: { country: "us" },
        });
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const comps: any[] = place.address_components || [];
          const get = (type: string, short = false) => {
            const c = comps.find((x) => x.types.includes(type));
            return c ? (short ? c.short_name : c.long_name) : "";
          };
          const line1 = [get("street_number"), get("route")].filter(Boolean).join(" ");
          if (streetRef.current && line1) streetRef.current.value = line1;
          if (cityRef.current) cityRef.current.value = get("locality") || get("sublocality") || get("postal_town") || cityRef.current.value;
          if (stateRef.current) stateRef.current.value = get("administrative_area_level_1", true) || stateRef.current.value;
          if (zipRef.current) zipRef.current.value = get("postal_code") || zipRef.current.value;
        });
      })
      .catch(() => { /* fall back to plain typing */ });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google;
      if (ac && g?.maps?.event) g.maps.event.clearInstanceListeners(ac);
    };
  }, []);

  return (
    <>
      <div>
        <label className={labelCls}>Street address</label>
        <input
          ref={streetRef}
          name="street"
          className={input}
          autoComplete="address-line1"
          placeholder="Start typing your address…"
          onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
        />
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-3">
        <div>
          <label className={labelCls}>City</label>
          <input ref={cityRef} name="city" className={input} autoComplete="address-level2" />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <input ref={stateRef} name="state" className={`${input} w-20`} autoComplete="address-level1" placeholder="MD" maxLength={20} />
        </div>
        <div>
          <label className={labelCls}>ZIP</label>
          <input ref={zipRef} name="zip" className={`${input} w-24`} inputMode="numeric" autoComplete="postal-code" />
        </div>
      </div>
    </>
  );
}
