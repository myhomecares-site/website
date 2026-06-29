import type { Faq } from "@/lib/faq";

// Renders an accessible FAQ list (native <details>) and, optionally, FAQPage
// structured data for Google rich results.
export function FaqList({ items, withSchema = false }: { items: Faq[]; withSchema?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-ink transition hover:bg-surface">
            {f.q}
            <svg className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}

      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
