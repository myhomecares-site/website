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
export const testimonials: Testimonial[] = [
  {
    quote:
      "There is an entire team of caring, kind, well trained, professional and helpful people who are willing to go the extra mile at My Home Cares. My family is so appreciative and thankful to have been blessed by such an amazing team of angels.",
    name: "Jamie Anderson",
    rating: 5,
    date: "2026-06-25",
  },
  {
    quote:
      "It has been such a relief for my family finding this company. They have been consistent, caring and a pleasure to work with. I wish we found them sooner! The staff are very responsive and they work with us no matter the circumstances. Thank you again for all that you do!",
    name: "Tykerra Lipscomb",
    rating: 5,
    date: "2026-04-15",
  },
  {
    quote:
      "I was in an accident that left me paralyzed, and at 53 I needed loads of help. Finding home healthcare did not prove to be easy, but after many wrong choices, My Home Cares was the best solution. They have consistent, competent workers who show up, and the customer service is great. I would recommend them to anybody at all.",
    name: "Stephen Nowlan",
    rating: 5,
    date: "2026-02-15",
  },
];
