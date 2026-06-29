import { site, regions } from "@/lib/site";

// LocalBusiness / HomeHealthCare schema. Listing every Maryland county under
// areaServed helps Google connect regional/county searches to My Home Cares.
export function StructuredData() {
  const counties = regions.flatMap((r) => r.counties);

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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
