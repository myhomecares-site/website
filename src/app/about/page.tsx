import type { Metadata } from "next";
import { site, mediaAssets } from "@/lib/site";
import { Section, SectionHeading, Button } from "@/components/ui";
import { PageHero, CTASection } from "@/components/blocks";
import { SiteImage } from "@/components/SiteImage";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "My Home Cares offers trusted home care services in Maryland. Our nurses deliver personalized care with expertise, warmth, and compassion.",
  alternates: { canonical: "https://www.myhomecares.com/about/" },
  openGraph: {
    title: "About Us | My Home Cares",
    description:
      "My Home Cares offers trusted home care services in Maryland. Our nurses deliver personalized care with expertise, warmth, and compassion.",
    url: "https://www.myhomecares.com/about/",
    type: "website",
  },
};

// Ordered by leadership seniority so the team reads top-down.
const leadership = [
  { name: "David Mziray", role: "Managing Director" },
  { name: "Lulu H. Mziray, MBA-HCM", role: "Director of Operations" },
  { name: "Courtney Dawkins, RN-BSN", role: "Director of Nursing" },
  { name: "Gillead-Gary Mziray", role: "Director of Tech" },
  { name: "Perina Gaines, RN", role: "Clinical Assessment Administrator" },
];

const values = [
  { icon: "heart-hand", title: "Compassion", text: "Care delivered from the heart, treating every client like family." },
  { icon: "shield-heart", title: "Integrity", text: "Honest, reliable, and accountable care you can trust." },
  { icon: "star", title: "Excellence", text: "High-quality, client-centered home health care in every visit." },
  { icon: "activity", title: "Innovation", text: "Technology-enabled care that improves communication and outcomes." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Trusted Home Care in Maryland"
        title="About My Home Cares"
        subtitle="Launched in 2018, My Home Cares was born from the success of our software application, combining technology with compassionate care to help individuals of all ages live with dignity and comfort at home."
      >
        <Button href="/contact" withArrow>Schedule a Consultation</Button>
      </PageHero>

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SiteImage
              path={mediaAssets.aboutImage}
              alt="A caring My Home Cares nurse helping an elderly client"
              className="mb-8 aspect-[4/3] w-full rounded-2xl card-shadow"
            />
            <p className="eyebrow mb-3">Our Story</p>
            <h2 className="text-3xl font-bold">Personalized care that transforms lives</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our foundation rests on a dedicated team&apos;s deep commitment to delivering
              exceptional care to individuals across all age groups, enabling them to experience
              dignified and comfortable living. This journey reflects our belief in the
              transformative impact of combining technology with compassionate care.
            </p>
            <blockquote className="mt-6 border-l-4 border-primary pl-5 italic text-ink-soft">
              &ldquo;At My Home Cares, we believe in the transformative power of personalized care.
              We&apos;re not just nurses, we&apos;re care companions on your journey to health and
              happiness.&rdquo;
              <footer className="mt-2 text-sm font-semibold not-italic text-muted">
               , Perina Gaines, RN, Clinical Assessment Administrator
              </footer>
            </blockquote>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-lg font-bold">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-muted">
                To act as an extended branch of care, offering peace of mind and enabling your
                cherished ones, at any age, to thrive within the comforting embrace of their own
                homes. We foster an environment where love and support serve as the foundation for
                transformative care.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-lg font-bold">Innovation in Care</h3>
              <p className="mt-3 leading-relaxed text-muted">
                We are developing a state-of-the-art software application to revolutionize how we
                support patients, staff and families, enhancing communication, streamlining
                processes, and providing valuable resources across our care network.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading center eyebrow="What Drives Us" title="Our core values" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-white p-6 card-shadow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon name={v.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading center eyebrow="Our People" title="Leadership team" intro="Experienced, compassionate professionals dedicated to exceptional home health care." />
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-5">
          {leadership.map((p) => (
            <div key={p.name} className="w-full rounded-2xl border border-border bg-white p-6 text-center card-shadow sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.84rem)]">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <h3 className="mt-4 font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.role}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-lg italic text-ink-soft">
          &ldquo;{site.signature}&rdquo;
          <span className="mt-2 block text-sm font-semibold not-italic text-muted">— {site.signatureBy}</span>
        </p>
      </Section>

      <CTASection />
    </>
  );
}
