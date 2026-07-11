// Central site configuration & content for My Home Cares
// Brand, contact, navigation, services, and Maryland service-area data.

export const site = {
  name: "My Home Cares",
  shortName: "MHC",
  tagline: "Maryland's finest home care services",
  description:
    "Compassionate, personalized in-home care across Maryland, skilled nursing, personal care, companionship, and more.",
  url: "https://www.myhomecares.com",
  trainingUrl: "https://myhomecares-training.vercel.app/",
  // Replace with your Google Business Profile "write a review" short link once claimed
  // (Google Business Profile → Ask for reviews → copy link). Falls back to a search.
  reviewUrl: "https://search.google.com/local/writereview?placeid=",
  reviewSearchUrl: "https://www.google.com/search?q=My+Home+Cares+Maryland+reviews",
  // Verified from Google Business Profile. Update as the count/rating grows.
  googleReviews: { rating: 5.0, count: 7 },
  phone: "(410) 231-3076",
  phoneHref: "tel:+14102313076",
  email: "info@myhomecares.com",
  emailHref: "mailto:info@myhomecares.com",
  license: "RSA-01229 | HCSA-00845",
  founded: 2018,
  region: "Maryland",
  // Founder signature, used ONLY on the About page (leadership section).
  signature:
    "Through tender hearts and unwavering dedication, we light the path of compassion, ensuring every step of the way feels like home.",
  signatureBy: "David Mziray, Managing Director",
  // Brand statements used elsewhere so the founder signature stays unique to About.
  mission:
    "Licensed, compassionate home care across Maryland, delivered with the dignity, warmth, and respect every family deserves.",
  promise:
    "We believe care should feel personal. Every plan is built around the person, not a checklist, so your loved one stays safe, comfortable, and independent at home.",
  trustLine:
    "Maryland families trust My Home Cares to care for the people they love, with skilled, screened caregivers and a team that treats every client like family.",
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
      "Professional medical care at home, wound care, post-surgery support, respiratory, cardiac and diabetic care, IV therapies and more.",
    hero: "Expert Skilled Nursing in Maryland",
    subhead:
      "The highest standard of skilled nursing care in Maryland, ensuring your loved ones receive professional and compassionate medical attention.",
    intro:
      "My Home Cares delivers professional medical care right in the comfort of your home. Our skilled nurses handle everything from routine assessments and monitoring to complex care needs, with patient safety and comfort always first.",
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
      "Each person has unique needs, so our personal care assistance is tailored to every individual we serve, always prioritizing dignity, comfort and trust.",
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
      "Genuine connection, conversation, hobbies, outings and emotional support that combat loneliness and isolation.",
    hero: "Companion Care Services in Maryland",
    subhead:
      "Fostering meaningful connections and joyful experiences that enhance quality of life for your loved ones.",
    intro:
      "Companionship is more than presence, it's genuine connection. Our caregivers create a comfortable, stimulating environment tailored to each client's interests.",
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
      "Temporary, reliable relief for family caregivers, so you can rest and recharge while care continues uninterrupted.",
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
      "A clean, safe and orderly home, light housekeeping, laundry, meal prep, grocery shopping and errands.",
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
      "Nutritious, dietary-tailored meals, from planning and grocery shopping to cooking and clean-up.",
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

// Maryland service areas, region + counties. Slugs match legacy URLs for SEO.
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
      "Worcester County",
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

// City / town landing pages. People search cities more than counties, so each
// gets its own optimized page (e.g. "home care Glen Burnie MD"). Each has a
// unique local blurb so no two pages read the same. County matches the names in
// `regions` so we can link a city to its county page.
export type City = { name: string; county: string; region: string; blurb: string };

export const cities: City[] = [
  // Central region (current focus)
  { name: "Glen Burnie", county: "Anne Arundel County", region: "Central",
    blurb: "Glen Burnie is one of the largest communities in northern Anne Arundel County, just south of Baltimore and close to BWI Marshall Airport." },
  { name: "Annapolis", county: "Anne Arundel County", region: "Central",
    blurb: "Annapolis, Maryland's state capital and the seat of Anne Arundel County, sits on the Chesapeake Bay and is home to a large, close-knit senior community." },
  { name: "Severn", county: "Anne Arundel County", region: "Central",
    blurb: "Severn is a growing Anne Arundel County community near Fort Meade and BWI, where many families balance busy work schedules with caring for aging parents." },
  { name: "Pasadena", county: "Anne Arundel County", region: "Central",
    blurb: "Pasadena is a peninsula community in northern Anne Arundel County, stretching between Baltimore and the waters of the Chesapeake Bay." },
  { name: "Severna Park", county: "Anne Arundel County", region: "Central",
    blurb: "Severna Park is a residential Anne Arundel County community along the B&A Trail, roughly midway between Baltimore and Annapolis." },
  { name: "Odenton", county: "Anne Arundel County", region: "Central",
    blurb: "Odenton is a fast-growing Anne Arundel County community anchored by Fort Meade, with many multigenerational households." },
  { name: "Baltimore", county: "Baltimore City", region: "Central",
    blurb: "Baltimore is Maryland's largest city, a collection of historic neighborhoods where many seniors have lived for decades and wish to age in place." },
  { name: "Towson", county: "Baltimore County", region: "Central",
    blurb: "Towson is the seat of Baltimore County, just north of the city, with a strong network of hospitals and senior services." },
  { name: "Dundalk", county: "Baltimore County", region: "Central",
    blurb: "Dundalk is a close-knit community in southeastern Baltimore County along the Patapsco River, known for its tight-knit, family-oriented neighborhoods." },
  { name: "Catonsville", county: "Baltimore County", region: "Central",
    blurb: "Catonsville sits in southwestern Baltimore County near UMBC, a leafy community with many longtime residents." },
  { name: "Owings Mills", county: "Baltimore County", region: "Central",
    blurb: "Owings Mills is a growing community in northwestern Baltimore County with a mix of established and newer neighborhoods." },
  { name: "Essex", county: "Baltimore County", region: "Central",
    blurb: "Essex is a waterfront community in eastern Baltimore County along the Chesapeake, home to many retirees." },
  { name: "Columbia", county: "Howard County", region: "Central",
    blurb: "Columbia is a planned community in Howard County set between Baltimore and Washington, organized into villages with strong senior resources." },
  { name: "Ellicott City", county: "Howard County", region: "Central",
    blurb: "Ellicott City, the historic seat of Howard County, lines the Patapsco River valley and blends historic charm with a large residential population." },
  { name: "Bel Air", county: "Harford County", region: "Central",
    blurb: "Bel Air is the seat of Harford County and a hub for the surrounding communities of northeastern Maryland." },
  { name: "Westminster", county: "Carroll County", region: "Central",
    blurb: "Westminster is the seat of Carroll County, a historic town anchoring a largely rural, family-oriented part of central Maryland." },
  // Capital region (high population)
  { name: "Silver Spring", county: "Montgomery County", region: "Capital",
    blurb: "Silver Spring is a large, diverse Montgomery County community just north of Washington, DC, with many seniors aging in place near family." },
  { name: "Rockville", county: "Montgomery County", region: "Capital",
    blurb: "Rockville, the seat of Montgomery County, is one of Maryland's largest cities and a center for medical care in the DC suburbs." },
  { name: "Bethesda", county: "Montgomery County", region: "Capital",
    blurb: "Bethesda is an affluent Montgomery County community near Washington, DC, and home to major medical institutions including the NIH." },
  { name: "Gaithersburg", county: "Montgomery County", region: "Capital",
    blurb: "Gaithersburg is a diverse Montgomery County city with a large, growing senior population in the upper DC suburbs." },
  { name: "Frederick", county: "Frederick County", region: "Capital",
    blurb: "Frederick is the seat of Frederick County in western Maryland, a historic city serving a broad surrounding region." },
  { name: "Bowie", county: "Prince George's County", region: "Capital",
    blurb: "Bowie is one of Maryland's largest cities, a residential Prince George's County community between Washington and Annapolis." },
  // Eastern Shore region (established clients)
  { name: "Easton", county: "Talbot County", region: "Eastern Shore",
    blurb: "Easton is the seat of Talbot County, a historic Eastern Shore town near the Chesapeake Bay with a large, established senior community." },
  { name: "Tilghman", county: "Talbot County", region: "Eastern Shore",
    blurb: "Tilghman, on Tilghman Island at the tip of Talbot County, is a close-knit Chesapeake Bay watermen's community." },
  { name: "Wye Mills", county: "Talbot County", region: "Eastern Shore",
    blurb: "Wye Mills is a small historic community on the Talbot and Queen Anne's county line, known for the Wye Oak and its quiet, rural setting." },
  { name: "Chestertown", county: "Kent County", region: "Eastern Shore",
    blurb: "Chestertown is the historic seat of Kent County on the Chester River, home to Washington College and a tight-knit riverfront community." },
  { name: "Rock Hall", county: "Kent County", region: "Eastern Shore",
    blurb: "Rock Hall is a Chesapeake Bay waterfront town in Kent County, a harbor community where many retirees have settled near the water." },
  { name: "Federalsburg", county: "Caroline County", region: "Eastern Shore",
    blurb: "Federalsburg is a small town in southern Caroline County on Marshyhope Creek, anchoring a rural, family-oriented part of the Eastern Shore." },
  { name: "Greensboro", county: "Caroline County", region: "Eastern Shore",
    blurb: "Greensboro sits along the Choptank River in Caroline County, a small town serving the surrounding rural Eastern Shore." },
  { name: "Henderson", county: "Caroline County", region: "Eastern Shore",
    blurb: "Henderson is a small town in northern Caroline County, part of the rural upper Eastern Shore near the Delaware line." },
  { name: "Cambridge", county: "Dorchester County", region: "Eastern Shore",
    blurb: "Cambridge is the historic seat of Dorchester County on the Choptank River, one of the oldest towns on Maryland's Eastern Shore." },
  { name: "Salisbury", county: "Wicomico County", region: "Eastern Shore",
    blurb: "Salisbury is the largest city on Maryland's Eastern Shore and the seat of Wicomico County, a regional hub for medical care and services." },
  { name: "Pocomoke City", county: "Worcester County", region: "Eastern Shore",
    blurb: "Pocomoke City sits along the Pocomoke River in Worcester County, near the southern end of Maryland's Eastern Shore." },
  { name: "Cecilton", county: "Cecil County", region: "Eastern Shore",
    blurb: "Cecilton is a small town in southern Cecil County on the upper Eastern Shore, at the top of the Chesapeake Bay." },
  // Central region
  { name: "Windsor Mill", county: "Baltimore County", region: "Central",
    blurb: "Windsor Mill is a community in western Baltimore County, just outside Baltimore, with many families caring for aging parents at home." },
];

export function citySlug(name: string) {
  return (
    "home-care-" +
    name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
    "-md"
  );
}

export const cityLocations = cities.map((c) => ({ ...c, slug: citySlug(c.name) }));

// Care forms & resources, slugs match legacy URLs.
export const careForms = [
  {
    slug: "caregiver-service-plan",
    title: "Caregiver Service Plan",
    summary: "The individualized plan of care that guides every visit.",
    purpose:
      "A documented plan outlining each client's specific care needs, goals, schedule, and the tasks assigned to caregivers, reviewed and updated as needs change.",
    captures: ["Client goals & preferences", "Assigned care tasks", "Visit schedule", "Review dates"],
  },
  {
    slug: "participant-assessment-form",
    title: "Participant Assessment",
    summary: "The full head-to-toe assessment, including skin and pressure-ulcer review.",
    purpose:
      "A comprehensive participant assessment covering vitals, every body system, sensory and mental health, skin and pressure ulcers, activities of daily living, medications, and RN certification, all in one form.",
    captures: ["Vitals & body systems", "Skin & pressure ulcers", "ADLs & mobility", "Medications & RN certification"],
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
      "A single sheet consolidating key medical information, conditions, medications, allergies, and contacts, to share quickly with first responders.",
    captures: ["Conditions & allergies", "Current medications", "Physician & pharmacy", "Emergency contacts"],
  },
  {
    slug: "caregiver-daily-log-form",
    title: "Caregiver Monthly Log",
    summary: "A monthly visit log saved per caregiver by name and number.",
    purpose:
      "A month-long record of a caregiver's visits, tasks, meals, and changes in condition, saved and searchable by the caregiver's name and number.",
    captures: ["Caregiver name & number", "Daily visits & hours", "Tasks & observations", "Caregiver signature"],
  },
  {
    slug: "unlicensed-aide-skills-assessment",
    title: "Aide Skills Assessment Checklist",
    summary: "The RN's competency checklist for CNAs and unlicensed aides.",
    purpose:
      "A skills, assessment, and demonstration checklist the RN uses to observe and certify an aide's competency across more than fifty patient-care skills, with satisfactory Yes/No, date, and observing RN for each.",
    captures: ["50+ patient-care skills", "Satisfactory Yes/No", "Date demonstrated", "Observing RN & sign-off"],
  },
] as const;

export type CareForm = (typeof careForms)[number];

// ---- Specialized / condition-specific care pages ---------------------------
// These capture high-intent, need-based searches (e.g. "dementia care in
// Maryland", "live-in care") that the general service pages don't target.
export const conditions = [
  {
    slug: "alzheimers-dementia-care-maryland",
    name: "Alzheimer's & Dementia Care",
    navLabel: "Alzheimer's & Dementia Care",
    icon: "heart-hand",
    hero: "Alzheimer's & Dementia Care at Home in Maryland",
    subhead:
      "Patient, specialized memory care that keeps your loved one safe, calm, and comfortable in the home they know best.",
    metaTitle: "Alzheimer's & Dementia Home Care in Maryland | My Home Cares",
    metaDescription:
      "Compassionate in-home Alzheimer's and dementia care across Maryland. Trained caregivers provide routine, safety, and memory support so your loved one can stay home. Call for a free consultation.",
    intro:
      "A dementia diagnosis changes daily life for the whole family. Familiar surroundings, gentle routines, and a caregiver who understands memory loss can make all the difference. Our caregivers are trained to support people living with Alzheimer's and other forms of dementia at every stage, with patience, structure, and genuine warmth.",
    approach:
      "We build a calm, predictable daily routine, reduce fall and wandering risks at home, and use proven techniques to ease confusion and agitation. We also support families with guidance and regular updates, so you always know how your loved one is doing.",
    helpWith: [
      "Consistent daily routines that reduce confusion and anxiety",
      "Supervision and safety to lower wandering and fall risks",
      "Help with bathing, dressing, grooming, and meals",
      "Medication reminders and coordination with providers",
      "Meaningful activities and gentle cognitive engagement",
      "Respite so family caregivers can rest and recharge",
    ],
    relatedServices: ["personal-care", "companion-care", "respite-care"],
  },
  {
    slug: "parkinsons-care-maryland",
    name: "Parkinson's Care",
    navLabel: "Parkinson's Care",
    icon: "activity",
    hero: "In-Home Parkinson's Care in Maryland",
    subhead:
      "Mobility, medication, and daily-living support that helps people with Parkinson's live safely and confidently at home.",
    metaTitle: "Parkinson's Home Care in Maryland | My Home Cares",
    metaDescription:
      "Specialized in-home Parkinson's care in Maryland. Our caregivers support mobility, medication timing, fall prevention, and daily activities. Call for a free consultation.",
    intro:
      "Parkinson's affects movement, balance, and daily routines in ways that change over time. The right in-home support helps your loved one stay independent and safe while protecting their dignity. Our caregivers understand the practical challenges of Parkinson's and adapt care as needs evolve.",
    approach:
      "We focus on safe mobility and transfers, careful medication timing, and a home set up to prevent falls. We encourage the movement and activity that support quality of life, and we keep families and providers informed of any changes.",
    helpWith: [
      "Safe mobility, transfers, and fall prevention",
      "On-time medication reminders to keep symptoms managed",
      "Help with eating, dressing, grooming, and hygiene",
      "Encouragement with prescribed exercises and activity",
      "Meal preparation tailored to swallowing and nutrition needs",
      "Skilled nursing support for more complex needs",
    ],
    relatedServices: ["skilled-nursing", "personal-care", "companion-care"],
  },
  {
    slug: "post-surgery-home-care-maryland",
    name: "Post-Surgery & Hospital-to-Home Care",
    navLabel: "Post-Surgery Recovery Care",
    icon: "stethoscope",
    hero: "Post-Surgery & Hospital-to-Home Care in Maryland",
    subhead:
      "A safe, supported recovery at home, so you can heal comfortably and avoid a return trip to the hospital.",
    metaTitle: "Post-Surgery & Hospital-to-Home Care in Maryland | My Home Cares",
    metaDescription:
      "In-home recovery care after surgery or a hospital stay in Maryland. Skilled nursing, wound care, medication management, and daily support to help you heal safely at home.",
    intro:
      "The days and weeks after surgery or a hospital stay are when support matters most. A smooth transition home, with the right help in place, lowers the risk of complications and readmission and lets you focus on getting better. We coordinate care quickly so support is ready the day you come home.",
    approach:
      "Our nurses and caregivers follow your discharge plan closely, manage wounds and medications, watch for warning signs, and handle the everyday tasks that are hard during recovery. We stay in close contact with your family and care providers throughout.",
    helpWith: [
      "Skilled nursing, wound care, and post-operative monitoring",
      "Medication management and symptom tracking",
      "Help with bathing, dressing, and safe mobility",
      "Meal preparation and light housekeeping while you heal",
      "Transportation reminders and follow-up coordination",
      "Watchful support to help prevent hospital readmission",
    ],
    relatedServices: ["skilled-nursing", "personal-care", "homemaking"],
  },
  {
    slug: "24-hour-live-in-care-maryland",
    name: "24-Hour & Live-In Care",
    navLabel: "24-Hour & Live-In Care",
    icon: "clock",
    hero: "24-Hour & Live-In Home Care in Maryland",
    subhead:
      "Around-the-clock support and peace of mind, with a caregiver present day and night for those who need constant care.",
    metaTitle: "24-Hour & Live-In Home Care in Maryland | My Home Cares",
    metaDescription:
      "Around-the-clock and live-in home care across Maryland. Continuous, attentive support day and night for loved ones who need constant supervision and assistance.",
    intro:
      "Some loved ones need more than a few hours of help. When safety, supervision, or comfort calls for someone present at all times, 24-hour and live-in care provides continuous support in the place they feel most at home. Families gain peace of mind knowing care never stops.",
    approach:
      "We coordinate dependable caregiver coverage so there is always a trained, compassionate professional on hand, overnight and throughout the day. Care plans cover everything from personal care and medication to companionship and overnight safety, and we adapt as needs change.",
    helpWith: [
      "Continuous day-and-night supervision and assistance",
      "Overnight safety, repositioning, and toileting support",
      "Personal care, meals, and medication reminders",
      "Companionship and engagement throughout the day",
      "Rapid response to changing or urgent needs",
      "Reliable coverage and consistent, familiar caregivers",
    ],
    relatedServices: ["personal-care", "skilled-nursing", "companion-care"],
  },
] as const;

export type Condition = (typeof conditions)[number];

// What makes My Home Cares stand out, used in the differentiators section.
export const differentiators = [
  {
    icon: "activity",
    title: "OHCQ-compliant caregiver training",
    text: "Our caregivers complete a training program built by our Director of Nursing, so the people in your home meet Maryland's standards and then some.",
  },
  {
    icon: "shield-heart",
    title: "Medicaid waiver welcome",
    text: "Beyond private pay, we work with Maryland Medicaid home- and community-based waiver programs, and help you understand what may cover your care.",
  },
  {
    icon: "clock",
    title: "Care can start in days",
    text: "After a quick assessment, we build your plan and match a caregiver fast, so support is in place when you need it, not weeks later.",
  },
  {
    icon: "star",
    title: "Licensed Maryland RSA",
    text: `A licensed Residential Service Agency regulated by OHCQ (${"RSA-01229 | HCSA-00845"}). Caregivers are screened, background-checked, and insured.`,
  },
];

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/home-care",
    children: [
      ...services.map((s) => ({ label: s.title, href: `/${s.slug}` })),
      ...conditions.map((c) => ({ label: c.navLabel, href: `/${c.slug}` })),
    ],
  },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Careers", href: "/careers" },
      { label: "Caregiver Jobs", href: "/caregivers" },
      { label: "CareLink Staffing", href: "/carelink-staffing" },
      { label: "Apply Now", href: "/job-application" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
