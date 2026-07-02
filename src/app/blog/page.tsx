import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatDate } from "@/lib/posts";
import { Section } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tips, and stories on home care, caregiving, and healthy aging from My Home Cares.",
  alternates: { canonical: "https://www.myhomecares.com/blog/" },
  openGraph: {
    title: "Blog | My Home Cares",
    description: "Insights, tips, and stories on home care, caregiving, and healthy aging from My Home Cares.",
    url: "https://www.myhomecares.com/blog/",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights & Resources"
        title="The My Home Cares blog"
        subtitle="Stories, tips, and industry insights on home care, caregiving, and healthy aging in Maryland."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 card-shadow"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary">{post.category}</span>
                <span className="text-muted-light">{formatDate(post.date)}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold leading-snug group-hover:text-primary">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
