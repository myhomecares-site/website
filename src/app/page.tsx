import Link from "next/link";
import { services, serviceImages, site, mediaAssets, media } from "@/lib/site";
import { posts, postImage, formatDate } from "@/lib/posts";
import { Container, Section, SectionHeading, Button } from "@/components/ui";
import { ServiceCard, CTASection, Stat, TrustBand, HowItWorks, Stars, WhatSetsUsApart, SpecializedCare } from "@/components/blocks";
import { VideoFeature } from "@/components/VideoFeature";
import { CareFinder } from "@/components/CareFinder";
import { MarylandMap } from "@/components/MarylandMap";
import { SiteImage } from "@/components/SiteImage";
import { ReviewsShowcase } from "@/components/ReviewsShowcase";
import { WhatWeStandFor } from "@/components/WhatWeStandFor";
import { FaqList } from "@/components/Faq";
import { faqs } from "@/lib/faq";
import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Decor";
import { Icon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.myhomecares.com/" },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <Blobs />
        <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Serving all of Maryland
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[3.25rem]">
              Compassionate <span className="text-primary">home care</span> for the people you love
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Explore Maryland&apos;s finest in-home care services with My Home Cares. From skilled
              nursing to everyday personal care, we deliver quality care that transforms lives —
              right at home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Button href="/contact" withArrow>
                Schedule a Free Consultation
              </Button>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-50"
              >
                <Icon name="phone" className="h-4 w-4" /> {site.phone}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Stars />
              <span className="text-sm text-muted">
                Trusted by Maryland families · <span className="font-semibold text-ink">Licensed &amp; insured</span>
              </span>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-7">
              <Stat value="Since 2018" label="Caring for Maryland" />
              <Stat value="24+" label="Counties served" />
              <Stat value="7" label="Care services" />
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="group relative overflow-hidden rounded-[2rem] ring-1 ring-black/5 shadow-2xl">
              <SiteImage
                path={mediaAssets.aboutImage}
                alt="A compassionate My Home Cares caregiver supporting an elderly client at home"
                className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]"
                imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-accent/10" />
            </div>
            {/* Floating trust card */}
            <div className="absolute -bottom-5 -left-3 max-w-[15rem] rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:-left-5">
              <div className="flex items-center gap-2">
                <Stars className="scale-90" />
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink">Care families trust</p>
              <p className="text-xs text-muted">Compassionate, professional caregivers across Maryland.</p>
            </div>
            {/* Floating licensed badge */}
            <div className="absolute -right-2 top-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg">
              <Icon name="shield-heart" className="h-4 w-4" /> Licensed
            </div>
          </div>
        </Container>
      </section>

      <TrustBand />

      {/* Find Your Care, interactive finder */}
      <Section>
        <SectionHeading
          center
          eyebrow="Free & No-Obligation"
          title="Not sure where to start? Let's find the right care"
          intro="Answer three quick questions and we'll point you to the right services, then help you take the next step."
        />
        <div className="mt-10">
          <CareFinder />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Prefer to talk?{" "}
          <a href={site.phoneHref} className="font-semibold text-primary">Call {site.phone}</a> for a free consultation.
        </p>
      </Section>

      {/* Comprehensive Care Services */}
      <Section reveal={false}>
        <Reveal>
          <SectionHeading
            center
            eyebrow="Comprehensive Care Services"
            title="Personalized home care solutions across Maryland"
            intro="A full range of services designed to meet your unique needs with compassion and professionalism."
          />
        </Reveal>
        <div className="mt-11 flex flex-wrap justify-center gap-5">
          {services.map((s, i) => (
            <Reveal key={s.slug} className="h-full w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(25%_-_0.9375rem)]" delay={(i % 4) * 90}>
              <ServiceCard
                title={s.title}
                description={s.short}
                href={`/${s.slug}`}
                icon={s.icon}
                image={serviceImages[s.slug]}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/home-care" variant="outline" withArrow>
            View All Home Care Services
          </Button>
        </div>
      </Section>

      {/* How it works */}
      <div className="bg-surface">
        <HowItWorks />
      </div>

      {/* Specialized care */}
      <SpecializedCare />

      {/* What sets us apart */}
      <div className="bg-surface">
        <WhatSetsUsApart />
      </div>

      {/* Interactive Maryland map */}
      <Section>
        <SectionHeading
          center
          eyebrow="Statewide, Local to You"
          title="Find home care in your Maryland county"
          intro="Tap your county on the map to see the towns we serve nearby and jump to your local care page."
        />
        <div className="mt-10">
          <MarylandMap />
        </div>
      </Section>

      {/* Video */}
      <VideoFeature />

      {/* What we stand for */}
      <WhatWeStandFor />

      {/* About teaser */}
      <Section muted>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">About My Home Cares</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Your trusted Maryland home care provider</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Since 2018, My Home Cares has been dedicated to quality care across Maryland, from
              skilled nursing to personalized home assistance, tailored to the unique needs of those
              we serve. We extend professional caregiving to families and individuals right at their
              doorstep.
            </p>
            <blockquote className="mt-6 border-l-4 border-primary pl-5 text-ink-soft italic">
              &ldquo;{site.promise}&rdquo;
              <footer className="mt-2 text-sm font-semibold not-italic text-muted">
                Our promise to every family we serve
              </footer>
            </blockquote>
            <div className="mt-8">
              <Button href="/about" withArrow>
                Learn More About Us
              </Button>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: "heart-hand", title: "People-first", text: "Care that honors dignity, comfort and independence." },
              { icon: "shield-heart", title: "Trusted & licensed", text: `Maryland licensed, ${site.license}.` },
              { icon: "users", title: "Family-oriented team", text: "Caregivers who treat your loved ones like their own." },
              { icon: "activity", title: "Tech-enabled care", text: "Built from a software company, innovation at our core." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-white p-5 card-shadow">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Reviews & trust showcase */}
      <ReviewsShowcase />

      {/* Latest from the blog */}
      <Section muted>
        <SectionHeading
          center
          eyebrow="Insights & Resources"
          title="Latest from our blog"
          intro="Tips and guidance on home care, caregiving, and healthy aging in Maryland."
        />
        <div className="mx-auto mt-11 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-primary/30 card-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media(postImage(post))}
                alt={post.title}
                width={1200}
                height={630}
                className="aspect-[1200/630] w-full border-b border-border object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary">{post.category}</span>
                  <span className="text-muted-light">{formatDate(post.date)}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/blog" variant="outline" withArrow>View All Articles</Button>
        </div>
      </Section>

      {/* Careers teaser */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-12 sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(700px 320px at 100% 0%, rgba(0,158,230,0.4), transparent 60%)" }} />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">
              Join our compassionate team
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Build a rewarding career in home care
            </h2>
            <p className="mt-4 text-lg text-white/80">
              We&apos;re seeking dedicated caregivers who embody our core values and commitment to
              excellence. Make a real difference in your community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/careers" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-primary-50">
                Explore Careers <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/carelink-staffing" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                CareLink Staffing
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section muted>
        <SectionHeading
          center
          eyebrow="Questions & Answers"
          title="Frequently asked questions"
          intro="Quick answers about home care in Maryland, services, cost, and getting started."
        />
        <div className="mt-10">
          <FaqList items={faqs.slice(0, 5)} />
        </div>
        <div className="mt-8 text-center">
          <Button href="/faq" variant="outline" withArrow>See all FAQs</Button>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
