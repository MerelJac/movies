// Year out of a TMDB release_date ("YYYY-MM-DD"), or null if missing/invalid.
function releaseYear(release) {
  if (!release) return null;
  const year = Number.parseInt(release.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

// Reorder a list of movies by one of the SORT_OPTIONS keys. Returns a new
// array; movies with no release date sort last for date-based orders.
export function sortMovies(movies, key) {
  const sorted = [...movies];
  switch (key) {
    case "release_desc":
      return sorted.sort(
        (a, b) =>
          (releaseYear(b.release_date) ?? -Infinity) -
          (releaseYear(a.release_date) ?? -Infinity),
      );
    case "release_asc":
      return sorted.sort(
        (a, b) =>
          (releaseYear(a.release_date) ?? Infinity) -
          (releaseYear(b.release_date) ?? Infinity),
      );
    case "rating_desc":
      return sorted.sort(
        (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
      );
    case "popularity_desc":
      return sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    case "title_asc":
      return sorted.sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? ""),
      );
    default:
      return sorted;
  }
}

// Genre names for a single movie's pills. `genres` is the id => name map
// fetched from the API; unknown ids are dropped.
export function movieGenres(movie, genres = {}) {
  return (movie.genre_ids ?? [])
    .map((id) => genres[id])
    .filter(Boolean);
}

// Aggregate stats for the "Your Movies" tab. `genres` is the id => name map
// fetched from the API. Returns null when there's nothing to summarise so the
// caller can skip rendering.
export function computeOwnedStats(movies, genres = {}) {
  if (!movies.length) return null;

  const rated = movies.filter((m) => (m.vote_count ?? 0) > 0 && m.vote_average);
  const averageRating = rated.length
    ? rated.reduce((sum, m) => sum + m.vote_average, 0) / rated.length
    : null;

  const years = movies
    .map((m) => releaseYear(m.release_date))
    .filter((y) => y !== null);

  // Tally genres across every owned movie, then sort most-common first.
  const genreCounts = new Map();
  for (const movie of movies) {
    for (const id of movie.genre_ids ?? []) {
      const name = genres[id];
      if (name) genreCounts.set(name, (genreCounts.get(name) ?? 0) + 1);
    }
  }
  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return {
    count: movies.length,
    averageRating,
    topGenres,
    earliestYear: years.length ? Math.min(...years) : null,
    latestYear: years.length ? Math.max(...years) : null,
  };
}

// Whether a movie has been released as of today. Unreleased (upcoming) movies
// can't be owned, so callers use this to hide the "I own this" control.
// Movies with no/invalid release date are treated as released.
export function isReleased(movie) {
  const release = movie?.release_date;
  if (!release) return true;
  const date = new Date(release);
  if (Number.isNaN(date.getTime())) return true;
  return date <= new Date();
}

export function formatDate(release) {
  if (!release) return "Release date unknown";
  // TMDB gives YYYY-MM-DD, which Date parses as UTC midnight. Render in UTC too
  // so the calendar day never shifts in timezones behind UTC (e.g. 2026-06-03
  // stays "June 3, 2026" rather than slipping to June 2).
  const date = new Date(release);
  return Number.isNaN(date.getTime())
    ? release
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
}
