export function formatDate(release) {
  if (!release) return 'Release date unknown';
  // TMDB gives YYYY-MM-DD; render it in the user's locale.
  const date = new Date(release);
  return Number.isNaN(date.getTime())
    ? release
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}
