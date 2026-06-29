import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatDate } from "@/lib/posts";
import { Container, Section } from "@/components/ui";
import { CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";
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
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postMap.get(slug);
  if (!post) notFound();

  return (
    <>
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
