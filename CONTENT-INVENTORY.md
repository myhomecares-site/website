# My Home Cares — Site Inventory (source: myhomecares.com sitemaps, June 2026)

Source platform: WordPress + Elementor, All in One SEO plugin. REST API is public
(https://www.myhomecares.com/wp-json/wp/v2/), so content can be pulled programmatically.

## Pages (37)

### Core
- / (Home)
- /about/
- /contact/

### Services (8)
- /home-care/
- /skilled-nursing/
- /personal-care/
- /companion-care/
- /respite-care/
- /homemaking/
- /meal-planning-and-preparation/
- /therapies/

### Staffing & Careers (4)
- /carelink-staffing/
- /careers/
- /job-application/
- /apply/

### Care forms / resources (7)
- /caregiver-service-plan/
- /skin-assessment-sheet/
- /participant-assessment-form/
- /pain-evaluation/
- /medication-administration-records/
- /emergency-medical-data-sheet/
- /caregiver-daily-log-form/

### Service areas — Maryland (29)
- /service-areas/ (index)
- /home-care-services-harford-county-md/
- /home-care-services-southern-region-md/
- /home-care-services-kent-county-md/
- /home-care-services-talbot-county-md/
- /home-care-services-allegany-county-md/
- /home-care-services-dorchester-county-md/
- /home-care-services-caroline-county-md/
- /home-care-services-capital-region-md/
- /home-care-services-baltimore-county-md/
- /home-care-services-st-marys-county-md/
- /home-care-services-frederick-county-md/
- /home-care-services-eastern-shore-region-md/
- /home-care-services-charles-county-md/
- /home-care-services-howard-county-md/
- /home-care-services-montgomery-county-md/
- /home-care-services-calvert-county-md/
- /home-care-services-queen-annes-county-md/
- /home-care-services-central-region-md/
- /home-care-services-carroll-county-md/
- /home-care-services-washington-county-md/
- /home-care-services-western-region-md/
- /home-care-services-anne-arundel-county-md/
- /home-care-services-garrett-county-md/
- /home-care-services-baltimore-city-md/
- /home-care-services-prince-georges-county-md/
- /home-care-services-cecil-county-md/
- /home-care-services-somerset-county-md/
- /home-care-services-wicomico-county-md/

## Blog (1 index + 15 posts)
- /blog/
- Honoring Veterans Through Compassionate Home Care
- World Diabetes Day: Raising Awareness
- Celebrating World Kindness Day
- The Future of Home Care: Trends and Predictions for 2024
- Supporting Family Caregivers: Respite Care
- The Impact of Value-Based Care on Home Health Services
- Enhancing Memory Care: Innovative Approaches for Dementia Patients
- Holistic Approaches in Home Care
- The Role of Occupational and Physical Therapy in Home Care
- Embracing AI in Home Care Services
- The Rise of Assistive Robotics in Home Care
- Caregiver Recruitment and Retention Strategies
- Personalized Care Plans
- Navigating Regulatory Changes in Home Care 2024
- Leveraging Technology for Better Home Care

## Rebuild plan
- Stack: Next.js (App Router) + Tailwind, deployed on Vercel, repo on GitHub.
- Dynamic: contact/lead form + booking/scheduling backed by Supabase.
- Service-area pages: generate from a single template + Maryland county data.
- Migration: pull canonical content via WordPress export (WXR) + REST API; download media from /wp-content/uploads/.
