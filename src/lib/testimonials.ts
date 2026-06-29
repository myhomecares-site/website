export type Testimonial = {
  quote: string;
  name: string;
  location?: string;
  rating?: number; // 1-5, defaults to 5
  date?: string; // ISO date, e.g. "2026-05-01"
};

// Add real client/family reviews here as you collect them. These power both the
// on-site reviews section and the Review/AggregateRating schema that lets star
// ratings appear in Google search results. Only add genuine reviews you've
// received (e.g. copied from your Google Business Profile), never invented ones.
//
// Example:
//   {
//     quote: "They treated my mother like family and kept us informed every day.",
//     name: "Sarah M.",
//     location: "Baltimore County",
//     rating: 5,
//     date: "2026-05-12",
//   },
export const testimonials: Testimonial[] = [];
