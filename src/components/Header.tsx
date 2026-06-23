"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNav, site } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
              >
                {item.label}
                {item.children && (
                  <svg className="h-3.5 w-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="w-60 rounded-2xl border border-border bg-white p-2 card-shadow">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-xl px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-primary-50 hover:text-primary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
          >
            <Icon name="phone" className="h-4 w-4 text-primary" />
            {site.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark hover:shadow-md"
          >
            Schedule a Consultation
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {mainNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-medium text-ink"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-muted"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <a href={site.phoneHref} className="flex items-center gap-2 px-3 font-semibold text-primary">
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mx-3 rounded-full bg-accent px-5 py-3 text-center font-semibold text-white"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
