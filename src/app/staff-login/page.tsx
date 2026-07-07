"use client";

import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";

export default function StaffLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [next, setNext] = useState("/resources");

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("next");
      if (p && p.startsWith("/")) setNext(p);
    } catch { /* ignore */ }
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await res.json().catch(() => ({}));
      setBusy(false);
      if (res.ok && d.ok) {
        window.location.href = next;
      } else {
        setError(d.error || "Login failed.");
      }
    } catch {
      setBusy(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <section className="hero-gradient flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 card-shadow">
        <div className="mb-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
            <Icon name="shield-heart" className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold text-ink">Staff sign in</h1>
          <p className="mt-1 text-sm text-muted">This area is for My Home Cares staff only.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-soft">Staff password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          {error && <p className="text-sm font-medium text-primary-dark">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Questions? Call {site.phone}.</p>
      </div>
    </section>
  );
}
