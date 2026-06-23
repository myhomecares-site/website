// Central site configuration & content for My Home Cares
// Brand, contact, navigation, services, and Maryland service-area data.

export const site = {
  name: "My Home Cares",
  shortName: "MHC",
  tagline: "Maryland's finest home care services",
  description:
    "Compassionate, personalized in-home care across Maryland — skilled nursing, personal care, companionship, and more.",
  url: "https://www.myhomecares.com",
  phone: "(410) 231-3076",
  phoneHref: "tel:+14102313076",
  email: "info@myhomecares.com",
  emailHref: "mailto:info@myhomecares.com",
  license: "RSA-01229 | HCSA-00845",
  founded: 2018,
  region: "Maryland",
  signature:
    "Through tender hearts and unwavering dedication, we light the path of compassion, ensuring every step of the way feels like home.",
  signatureBy: "David Mziray, Managing Director",
  social: {
    facebook: "https://www.facebook.com/My-Home-Cares-119680482758704/",
    instagram: "https://www.instagram.com/myhomecares",
    linkedin: "https://www.linkedin.com/company/my-home-cares",
    x: "https://twitter.com/MyHomeCares",
    google: "https://www.google.com/search?q=My+Home+Cares+Maryland",
  },
  staffing: {
    name: "CareLink Staffing",
    phone: "(410) 231-3855",
    email: "carelink@myhomecares.com",
  },
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const services = [
  {
    slug: "skilled-nursing",
    title: "Skilled Nursing",
    short:
      "Professional medical care at home — wound care, post-surgery support, respiratory, cardiac and diabetic care, IV therapies and more.",
    hero: "Expert Skilled Nursing in Maryland",
    subhead:
      "The highest standard of skilled nursing care in Maryland, ensuring your loved ones receive professional and compassionate medical attention.",
    intro:
      "My Home Cares delivers professional medical care right in the comfort of your home. Our skilled nurses handle everything from routine assessments and monitoring to complex care needs — with patient safety and comfort always first.",
    features: [
      "Nursing assessments and ongoing health monitoring",
      "Comprehensive wound care and management",
      "Dedicated pre- & post-surgery care",
      "Respiratory care and vent management",
      "Cardiac & diabetic care, trach care, and IV therapies",
    ],
    icon: "stethoscope",
  },
  {
    slug: "personal-care",
    title: "Personal Care",
    short:
      "Respectful help with bathing, dressing, grooming, mobility and medication reminders that protect dignity and independence.",
    hero: "Personal Care Assistance in Maryland",
    subhead:
      "Enhancing daily living with personalized care that ensures dignity and independence for your loved ones.",
    intro:
      "Each person has unique needs, so our personal care assistance is tailored to every individual we serve — always prioritizing dignity, comfort and trust.",
    features: [
      "Assistance with bathing, dressing, and grooming",
      "Mobility support and transfer assistance",
      "Medication reminders and management",
      "Personal hygiene and toileting support",
      "Companionship and emotional support",
    ],
    icon: "heart-hand",
  },
  {
    slug: "companion-care",
    title: "Companion Care",
    short:
      "Genuine connection — conversation, hobbies, outings and emotional support that combat loneliness and isolation.",
    hero: "Companion Care Services in Maryland",
    subhead:
      "Fostering meaningful connections and joyful experiences that enhance quality of life for your loved ones.",
    intro:
      "Companionship is more than presence — it's genuine connection. Our caregivers create a comfortable, stimulating environment tailored to each client's interests.",
    features: [
      "Engaging and meaningful conversation",
      "Participation in hobbies and interests",
      "Accompaniment on outings and social events",
      "Emotional support and companionship",
      "Assistance with light daily activities and errands",
    ],
    icon: "users",
  },
  {
    slug: "respite-care",
    title: "Respite Care",
    short:
      "Temporary, reliable relief for family caregivers — so you can rest and recharge while care continues uninterrupted.",
    hero: "Quality Respite Care in Maryland",
    subhead:
      "Essential breaks for family caregivers, delivered with compassion and continuity of care.",
    intro:
      "Our respite care provides temporary relief so family caregivers can rest, while their loved ones continue to receive high-quality, uninterrupted care that respects their routines and preferences.",
    features: [
      "Temporary relief for family caregivers",
      "Continuation of daily routines and care plans",
      "Personal care and hygiene assistance",
      "Medication management and reminders",
      "Engaging companionship and social interaction",
    ],
    icon: "shield-heart",
  },
  {
    slug: "homemaking",
    title: "Homemaking",
    short:
      "A clean, safe and orderly home — light housekeeping, laundry, meal prep, grocery shopping and errands.",
    hero: "Professional Homemaking Services in Maryland",
    subhead:
      "The comfort and convenience of a well-kept home, designed to enhance your daily living environment.",
    intro:
      "A well-maintained home supports overall well-being. Our homemakers manage daily tasks with care and precision, tailored to each client's preferences.",
    features: [
      "Thorough cleaning and tidying of living spaces",
      "Laundry and linen care, including washing and ironing",
      "Meal planning and preparation for dietary needs",
      "Grocery shopping and errand running",
      "Organization of home spaces for optimal functionality",
    ],
    icon: "home",
  },
  {
    slug: "meal-planning-and-preparation",
    title: "Meal Planning & Preparation",
    short:
      "Nutritious, dietary-tailored meals — from planning and grocery shopping to cooking and clean-up.",
    hero: "Nutritious Meal Planning in Maryland",
    subhead:
      "Tailored meal planning and preparation that ensures healthy, enjoyable meals for you and your loved ones.",
    intro:
      "Nutrition plays a vital role in health, especially for seniors. We create meal plans that satisfy taste buds while supporting health and well-being.",
    features: [
      "Customized meal planning based on dietary needs",
      "Grocery shopping for fresh, quality ingredients",
      "Preparation of healthy and appetizing meals",
      "Dietary management for specific health conditions",
      "Clean-up and kitchen organization after meals",
    ],
    icon: "utensils",
  },
] as const;

export type Service = (typeof services)[number];

// ---- Media / imagery -------------------------------------------------------
// MEDIA_BASE points at where images live. The key assets are now mirrored into
// /public/wp-content/uploads, so we serve everything locally (survives domain
// cutover). Set back to "https://www.myhomecares.com" to pull from the live site.
export const MEDIA_BASE = "";

export function media(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  return MEDIA_BASE + path;
}

export const serviceImages: Record<string, string> = {
  "skilled-nursing": "/wp-content/uploads/2024/01/skilled-nursing-maryland.webp",
  "personal-care": "/wp-content/uploads/2024/01/personal-care.png",
  "companion-care": "/wp-content/uploads/2024/01/companion-care-maryland-1.webp",
  "respite-care": "/wp-content/uploads/2024/01/Respite-care-md.webp",
  "homemaking": "/wp-content/uploads/2024/01/Homemaking-1.webp",
  "meal-planning-and-preparation": "/wp-content/uploads/2024/01/meal-preparation-maryland.webp",
};

export const mediaAssets = {
  heroImage: "/wp-content/uploads/2024/02/home-care-services.webp",
  aboutImage: "/wp-content/uploads/2024/01/caring-nurse-helping-elderly.png",
  homeCareImage: "/wp-content/uploads/2024/02/skilled-nursing-services.webp",
  video: "/wp-content/uploads/2024/01/file.mp4",
  logoWordmark: "/wp-content/uploads/2024/01/MHC-Logo-e1750868871441.png",
  logoSymbol: "/wp-content/uploads/2024/01/MCHsymbol-removebg.png",
};

// Accreditations / association badges shown in the footer.
export const associations = [
  {
    name: "Maryland Department of Health",
    image: "/wp-content/uploads/2024/01/MDHealth.png",
  },
  {
    name: "Maryland-National Capital Homecare Association (MNCHA)",
    image: "/wp-content/uploads/2024/01/IMG_0497.jpeg",
  },
];

export const homeCareSubservices = [
  "skilled-nursing",
  "companion-care",
  "homemaking",
  "meal-planning-and-preparation",
  "personal-care",
  "respite-care",
];

// Maryland service areas — region + counties. Slugs match legacy URLs for SEO.
export const regions = [
  {
    name: "Western Region",
    slug: "western-region",
    counties: ["Garrett County", "Allegany County", "Washington County"],
  },
  {
    name: "Capital Region",
    slug: "capital-region",
    counties: ["Frederick County", "Montgomery County", "Prince George's County"],
  },
  {
    name: "Central Region",
    slug: "central-region",
    counties: [
      "Anne Arundel County",
      "Baltimore City",
      "Baltimore County",
      "Carroll County",
      "Harford County",
      "Howard County",
    ],
  },
  {
    name: "Southern Region",
    slug: "southern-region",
    counties: ["Calvert County", "Charles County", "St. Mary's County"],
  },
  {
    name: "Eastern Shore Region",
    slug: "eastern-shore-region",
    counties: [
      "Kent County",
      "Queen Anne's County",
      "Talbot County",
      "Caroline County",
      "Dorchester County",
      "Wicomico County",
      "Somerset County",
      "Cecil County",
    ],
  },
];

export function countySlug(name: string) {
  return (
    "home-care-services-" +
    name
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/\./g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-md"
  );
}

// All location pages (regions + counties) as { name, slug }
export const locations = [
  ...regions.map((r) => ({ name: r.name, slug: `home-care-services-${r.slug}-md` })),
  ...regions.flatMap((r) =>
    r.counties.map((c) => ({ name: c, slug: countySlug(c) }))
  ),
];

// Care forms & resources — slugs match legacy URLs.
export const careForms = [
  {
    slug: "caregiver-service-plan",
    title: "Caregiver Service Plan",
    summary: "The individualized plan of care that guides every visit.",
    purpose:
      "A documented plan outlining each client's specific care needs, goals, schedule, and the tasks assigned to caregivers — reviewed and updated as needs change.",
    captures: ["Client goals & preferences", "Assigned care tasks", "Visit schedule", "Review dates"],
  },
  {
    slug: "skin-assessment-sheet",
    title: "Skin Assessment Sheet",
    summary: "Tracks skin integrity to prevent and catch pressure injuries early.",
    purpose:
      "A periodic skin check used to monitor for redness, breakdown, or pressure areas, supporting early intervention and wound prevention.",
    captures: ["Skin condition by area", "Pressure / risk areas", "Changes over time", "Action taken"],
  },
  {
    slug: "participant-assessment-form",
    title: "Participant Assessment Form",
    summary: "The intake assessment that establishes a client's baseline.",
    purpose:
      "A comprehensive intake that captures health history, abilities, and support needs to build an appropriate, personalized care plan.",
    captures: ["Health history", "Functional abilities (ADLs)", "Support needs", "Emergency contacts"],
  },
  {
    slug: "pain-evaluation",
    title: "Pain Evaluation",
    summary: "A structured way to assess and monitor client pain.",
    purpose:
      "A standardized pain assessment used to record level, location, and characteristics of pain so care and communication with providers stay informed.",
    captures: ["Pain level (0–10)", "Location & type", "Triggers & relief", "Date & time"],
  },
  {
    slug: "medication-administration-records",
    title: "Medication Administration Records (MAR)",
    summary: "An accurate log of medications, doses, and timing.",
    purpose:
      "The MAR documents each medication, dose, route, and time, supporting safe administration and a clear record for families and providers.",
    captures: ["Medication & dose", "Route & schedule", "Administered / refused", "Initials & date"],
  },
  {
    slug: "emergency-medical-data-sheet",
    title: "Emergency Medical Data Sheet",
    summary: "Critical information ready for any emergency.",
    purpose:
      "A single sheet consolidating key medical information — conditions, medications, allergies, and contacts — to share quickly with first responders.",
    captures: ["Conditions & allergies", "Current medications", "Physician & pharmacy", "Emergency contacts"],
  },
  {
    slug: "caregiver-daily-log-form",
    title: "Caregiver Daily Log",
    summary: "A daily record of care, tasks, and observations.",
    purpose:
      "A visit-by-visit log of tasks completed, meals, activities, and any changes in condition — keeping families informed and care consistent.",
    captures: ["Tasks completed", "Meals & fluids", "Mood & activity", "Notes & changes"],
  },
] as const;

export type CareForm = (typeof careForms)[number];

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/home-care",
    children: services.map((s) => ({ label: s.title, href: `/${s.slug}` })),
  },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Careers", href: "/careers" },
      { label: "CareLink Staffing", href: "/carelink-staffing" },
      { label: "Apply Now", href: "/job-application" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
