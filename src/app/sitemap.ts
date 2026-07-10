import type { MetadataRoute } from "next";
import { site, services, locations, cityLocations, conditions } from "@/lib/site";
import { posts } from "@/lib/posts";

// Full sitemap so Google can discover & index every service, region, and county page.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const u = (path: string) => `${base}${path}`;

  const core: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/home-care/", priority: 0.9, freq: "monthly" },
    { path: "/service-areas/", priority: 0.9, freq: "monthly" },
    { path: "/about/", priority: 0.7, freq: "monthly" },
    { path: "/reviews/", priority: 0.6, freq: "monthly" },
    { path: "/contact/", priority: 0.8, freq: "monthly" },
    { path: "/careers/", priority: 0.6, freq: "monthly" },
    { path: "/caregivers/", priority: 0.7, freq: "monthly" },
    { path: "/carelink-staffing/", priority: 0.6, freq: "monthly" },
    { path: "/faq/", priority: 0.6, freq: "monthly" },
    { path: "/blog/", priority: 0.5, freq: "weekly" },
  ];

  const entries: MetadataRoute.Sitemap = core.map((c) => ({
    url: u(c.path),
    lastModified: now,
    changeFrequency: c.freq,
    priority: c.priority,
  }));

  // Service pages
  for (const s of services) {
    entries.push({ url: u(`/${s.slug}/`), lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  }

  // Specialized / condition-specific pages
  for (const c of conditions) {
    entries.push({ url: u(`/${c.slug}/`), lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  }

  // Region + county service-area pages (the local-SEO landing pages)
  for (const l of locations) {
    entries.push({ url: u(`/${l.slug}/`), lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }

  // City / town landing pages
  for (const c of cityLocations) {
    entries.push({ url: u(`/${c.slug}/`), lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }

  // Blog posts
  for (const p of posts) {
    entries.push({ url: u(`/blog/${p.slug}/`), lastModified: new Date(p.date), changeFrequency: "monthly", priority: 0.5 });
  }

  return entries;
}
