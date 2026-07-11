import { site, regions } from "@/lib/site";
import { testimonials } from "@/lib/testimonials";

// LocalBusiness / HomeHealthCare schema. Listing every Maryland county under
// areaServed helps Google connect regional/county searches to My Home Cares.
export function StructuredData() {
  const counties = regions.flatMap((r) => r.counties);

  // Only emit review markup when real reviews exist (never fabricate ratings).
  // Aggregate reflects the verified Google Business Profile total (5.0 / 7).
  const reviewData =
    testimonials.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.googleReviews.rating.toFixed(1),
            reviewCount: site.googleReviews.count,
            bestRating: 5,
            worstRating: 1,
          },
          review: testimonials.map((t) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: t.rating ?? 5, bestRating: 5, worstRating: 1 },
            author: { "@type": "Person", name: t.name },
            ...(t.date ? { datePublished: t.date } : {}),
            reviewBody: t.quote,
          })),
        }
      : {};

  const data = {
    "@context": "https://schema.org",
    "@type": ["HomeHealthCareBusiness", "LocalBusiness"],
    name: site.name,
    legalName: "My Home Cares, LLC",
    url: site.url,
    telephone: site.phone,
    email: site.email,
    description: site.description,
    slogan: "Where Service Matters",
    foundingDate: "2018",
    image: `${site.url}/brand/mhc-wordmark.png`,
    address: {
      "@type": "PostalAddress",
      addressRegion: "MD",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "State", name: "Maryland" },
      ...regions.map((r) => ({ "@type": "AdministrativeArea", name: `${r.name}, Maryland` })),
      ...counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c}, Maryland` })),
    ],
    knowsLanguage: "en",
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.linkedin,
      site.social.x,
    ],
    hasCredential: "Maryland OHCQ License RSA-01229 | HCSA-00845",
    ...reviewData,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
