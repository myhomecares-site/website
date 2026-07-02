import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatDate, postImage } from "@/lib/posts";
import { site, media } from "@/lib/site";
import { Container, Section } from "@/components/ui";
import { CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import bodies from "@/lib/blog-bodies.json";

const postMap = new Map(posts.map((p) => [p.slug, p]));
const bodyMap = bodies as Record<string, string[]>;

function isHeading(line: string) {
  const t = line.trim();
  return t.length < 70 && !/[.!?:,]$/.test(t) && !t.startsWith("Together") && !t.startsWith("Happy");
}

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postMap.get(slug);
  if (!post) return {};
  const url = `${site.url}/blog/${post.slug}/`;
  const ogImage = `${site.url}${postImage(post)}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | ${site.name}`,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${site.name}`,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postMap.get(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}/`;
  return (
    <>
      <JsonLd data={breadcrumbLd([
        { name: "Home", url: site.url },
        { name: "Blog", url: `${site.url}/blog/` },
        { name: post.title, url },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: `${site.url}/brand/mhc-wordmark.png` },
        },
        mainEntityOfPage: url,
        image: `${site.url}${postImage(post)}`,
      }} />
      <section className="hero-gradient border-b border-border">
        <Container className="py-14 sm:py-18">
          <Link href="/blog" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to blog
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary">{post.category}</span>
              <span className="text-muted-light">{formatDate(post.date)}</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
          </div>
        </Container>
      </section>

      <Container className="pt-10 sm:pt-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media(postImage(post))}
          alt={post.title}
          width={1200}
          height={630}
          className="mx-auto w-full max-w-3xl rounded-2xl border border-border card-shadow"
        />
      </Container>

      <Section>
        <article className="prose-care mx-auto max-w-2xl">
          {(() => {
            const body = bodyMap[post.slug];
            // Skip a leading line that just repeats the title.
            const lines = body
              ? body.filter((l, i) => !(i === 0 && l.trim().toLowerCase().startsWith(post.title.slice(0, 20).toLowerCase())))
              : null;
            if (lines && lines.length > 1) {
              return (
                <div className="space-y-5">
                  {lines.map((line, i) =>
                    isHeading(line) ? (
                      <h2 key={i} className="!mt-8 text-xl font-bold text-ink">{line}</h2>
                    ) : (
                      <p key={i} className="leading-relaxed text-ink-soft">{line}</p>
                    )
                  )}
                </div>
              );
            }
            return (
              <>
                <p className="text-lg text-ink-soft">{post.excerpt}</p>
                <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
                  The full article is being migrated from our previous site. In the meantime, our care
                  team is happy to answer any questions on this topic, reach out any time.
                </div>
              </>
            );
          })()}
        </article>
      </Section>

      <CTASection />
    </>
  );
}
