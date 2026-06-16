// TMDB returns relative image paths; prefix with the image CDN + a size.
// See https://developer.themoviedb.org/docs/image-basics
export const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';
// Max movie results per requirments
export const MAX_RESULTS = 10;

// Client-side sort options for search results. TMDB's /search/movie endpoint
// can't sort, so we reorder the fetched page in the browser.
export const SORT_OPTIONS = [
  { key: "release_desc", label: "Newest first" },
  { key: "release_asc", label: "Oldest first" },
  { key: "rating_desc", label: "Highest rated" },
  { key: "popularity_desc", label: "Most popular" },
  { key: "title_asc", label: "Title (A–Z)" },
];