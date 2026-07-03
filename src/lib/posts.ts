// Blog posts migrated from myhomecares.com.
// Titles, dates and slugs preserved. Full article bodies to be imported via the
// WordPress export in a follow-up pass; excerpts shown for now.

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string; // featured image (also used as social/OG preview)
};

export const posts: Post[] = [
  {
    slug: "maryland-medicaid-renewal-check-your-mail",
    title: "Maryland Medicaid Renewal: Check Your Mail So You Don't Lose Coverage",
    date: "2026-07-01",
    category: "Paying for Care",
    excerpt:
      "Maryland Medicaid renews every 12 months, and the notice arrives by mail. Here's how to keep your coverage (and any home-care funding) from lapsing, plus who to call.",
    image: "/wp-content/uploads/2024/07/medicaid-renewal-check-your-mail.png",
  },
  {
    slug: "signs-your-parent-needs-home-care",
    title: "10 Signs Your Aging Parent May Need Home Care",
    date: "2026-06-27",
    category: "Family Resources",
    excerpt:
      "Not sure if it's time for help at home? Here are ten common signs that your aging parent could benefit from in-home care in Maryland.",
  },
  {
    slug: "how-to-choose-home-care-agency-maryland",
    title: "How to Choose a Home Care Agency in Maryland: An RSA Checklist",
    date: "2026-06-25",
    category: "Family Resources",
    excerpt:
      "Choosing a home care agency is a big decision. Use this Maryland RSA checklist, licensing, screening, and the right questions to ask.",
  },
  {
    slug: "how-to-pay-for-home-care-maryland",
    title: "How to Pay for Home Care in Maryland: Your Options Explained",
    date: "2026-06-20",
    category: "Paying for Care",
    excerpt:
      "Private pay, long-term care insurance, and Medicaid waivers, a plain-English look at how Maryland families pay for home care.",
  },
  {
    slug: "world-diabetes-day-raising-awareness",
    title: "World Diabetes Day: Raising Awareness and Supporting Health",
    date: "2024-11-14",
    category: "Health",
    excerpt:
      "Raising awareness for diabetes management and how in-home care supports healthier daily living.",
  },
  {
    slug: "celebrating-world-kindness-day",
    title: "Celebrating World Kindness Day: Spreading Compassion",
    date: "2024-11-13",
    category: "Community",
    excerpt: "How small acts of kindness shape compassionate, person-centered care.",
  },
  {
    slug: "future-home-care-trends-2024",
    title: "The Future of Home Care: Trends and Predictions for 2024",
    date: "2024-06-06",
    category: "Industry",
    excerpt: "The trends shaping the future of home care, from technology to personalized models.",
  },
  {
    slug: "supporting-family-caregivers-respite-care",
    title: "Supporting Family Caregivers: Resources and Tips for Respite Care",
    date: "2024-06-06",
    category: "Caregiving",
    excerpt: "Practical resources and tips to help family caregivers rest, recharge, and avoid burnout.",
  },
  {
    slug: "impact-value-based-care-home-health",
    title: "The Impact of Value-Based Care on Home Health Services",
    date: "2024-06-06",
    category: "Industry",
    excerpt: "How value-based care is reshaping outcomes and quality in home health.",
  },
  {
    slug: "enhancing-memory-care-dementia-patients",
    title: "Enhancing Memory Care: Innovative Approaches for Dementia Patients",
    date: "2024-06-06",
    category: "Memory Care",
    excerpt: "Innovative, compassionate approaches that improve quality of life for those with dementia.",
  },
  {
    slug: "holistic-approaches-home-care",
    title: "Holistic Approaches in Home Care: Integrating Social Determinants of Health",
    date: "2024-06-06",
    category: "Care Models",
    excerpt: "Why whole-person care that addresses social determinants leads to better outcomes.",
  },
  {
    slug: "role-occupational-physical-therapy-home-care",
    title: "The Role of Occupational and Physical Therapy in Home Care",
    date: "2024-06-06",
    category: "Therapies",
    excerpt: "How occupational and physical therapy restore independence and mobility at home.",
  },
  {
    slug: "embracing-ai-revolutionizing-home-care",
    title: "Embracing AI: How Artificial Intelligence is Revolutionizing Home Care",
    date: "2024-06-05",
    category: "Technology",
    excerpt: "The ways AI is enhancing care delivery, monitoring, and support for clients and staff.",
  },
  {
    slug: "assistive-robotics-home-care",
    title: "The Rise of Assistive Robotics in Home Care",
    date: "2024-06-06",
    category: "Technology",
    excerpt: "How assistive robotics enhance care while reducing strain on caregivers.",
  },
  {
    slug: "caregiver-recruitment-retention-strategies",
    title: "Caregiver Recruitment and Retention: Strategies for a Sustainable Workforce",
    date: "2024-06-06",
    category: "Workforce",
    excerpt: "Strategies for building and keeping a strong, compassionate caregiving team.",
  },
  {
    slug: "personalized-care-plans-home-care",
    title: "Personalized Care Plans: Tailoring Services to Meet Individual Needs",
    date: "2024-06-06",
    category: "Care Models",
    excerpt: "Why individualized care plans deliver better, more dignified outcomes.",
  },
  {
    slug: "navigating-regulatory-changes-home-care-2024",
    title: "Navigating Regulatory Changes in Home Care: What You Need to Know for 2024",
    date: "2024-06-06",
    category: "Compliance",
    excerpt: "A guide to the regulatory landscape and what it means for home care in 2024.",
  },
  {
    slug: "leveraging-technology-better-home-care",
    title: "Leveraging Technology for Better Home Care: From Wearables to Remote Monitoring",
    date: "2024-06-06",
    category: "Technology",
    excerpt: "From wearables to remote monitoring, technology that improves safety and care.",
  },
];

// Featured image for a post: use its explicit image, otherwise fall back to the
// auto-generated branded title card (one per slug in /uploads/2024/07/cards/).
// Used for the blog index cards and social/Open Graph previews.
export function postImage(post: Post) {
  return post.image || `/wp-content/uploads/2024/07/cards/${post.slug}.png`;
}

// Real photographs (already licensed and used elsewhere on the site) mapped to
// each post by topic. Shown as the in-article hero image when a reader opens a
// post. Posts not listed here fall back to their branded card.
export const postPhotos: Record<string, string> = {
  "signs-your-parent-needs-home-care": "/wp-content/uploads/2024/02/home-care-services.webp",
  "how-to-choose-home-care-agency-maryland": "/wp-content/uploads/2024/02/skilled-nursing-services.webp",
  "how-to-pay-for-home-care-maryland": "/wp-content/uploads/2024/01/caring-nurse-helping-elderly.png",
  "world-diabetes-day-raising-awareness": "/wp-content/uploads/2024/01/meal-preparation-maryland.webp",
  "celebrating-world-kindness-day": "/wp-content/uploads/2024/01/companion-care-maryland-1.webp",
  "future-home-care-trends-2024": "/wp-content/uploads/2024/02/skilled-nursing-services.webp",
  "supporting-family-caregivers-respite-care": "/wp-content/uploads/2024/01/Respite-care-md.webp",
  "impact-value-based-care-home-health": "/wp-content/uploads/2024/01/skilled-nursing-maryland.webp",
  "enhancing-memory-care-dementia-patients": "/wp-content/uploads/2024/01/companion-care-maryland-1.webp",
  "holistic-approaches-home-care": "/wp-content/uploads/2024/02/home-care-services.webp",
  "role-occupational-physical-therapy-home-care": "/wp-content/uploads/2024/01/skilled-nursing-maryland.webp",
  "embracing-ai-revolutionizing-home-care": "/wp-content/uploads/2024/02/skilled-nursing-services.webp",
  "assistive-robotics-home-care": "/wp-content/uploads/2024/02/home-care-services.webp",
  "caregiver-recruitment-retention-strategies": "/wp-content/uploads/2024/01/companion-care-maryland-1.webp",
  "personalized-care-plans-home-care": "/wp-content/uploads/2024/01/personal-care.png",
  "navigating-regulatory-changes-home-care-2024": "/wp-content/uploads/2024/01/skilled-nursing-maryland.webp",
  "leveraging-technology-better-home-care": "/wp-content/uploads/2024/02/skilled-nursing-services.webp",
  "world-kindness-day": "/wp-content/uploads/2024/01/companion-care-maryland-1.webp",
};

// In-article hero image: a real topic photo if one is mapped, else the branded
// card (also covers posts like the Medicaid one that set an explicit image).
export function postHeroImage(post: Post) {
  return post.image || postPhotos[post.slug] || postImage(post);
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
