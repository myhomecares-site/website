"use client";

import { useState } from "react";
import { Container } from "./ui";
import { Icon } from "./icons";

export function TrainingGate() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const code = new FormData(e.currentTarget).get("code");
    try {
      const res = await fetch("/api/training-access/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Incorrect access code.");
      window.location.reload();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Incorrect access code.");
    }
  }

  return (
    <section className="hero-gradient flex min-h-[70vh] items-center">
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Icon name="shield-heart" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">Caregiver Training</h1>
          <p className="mt-2 text-sm text-muted">
            This area is private to My Home Cares caregivers and staff. Enter the access code provided
            by the office to continue.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              name="code"
              required
              autoFocus
              placeholder="Access code"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-center text-sm tracking-wide text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {status === "error" && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "loading" ? "Checking…" : "Continue"}
            </button>
          </form>
          <p className="mt-4 text-xs text-muted-light">
            Don&apos;t have a code? Contact the office at info@myhomecares.com.
          </p>
        </div>
      </Container>
    </section>
  );
}
