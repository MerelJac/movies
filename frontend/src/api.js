// Thin client for the Laravel backend, which proxies The Movie DB.
// In dev, /api is proxied to http://127.0.0.1:8000 (see vite.config.js).

export async function searchMovies(query, page = 1) {
  const params = new URLSearchParams({ query, page: String(page) });
  const res = await fetch(`/api/movies/search?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Search failed (${res.status})`);
  }

  return res.json();
}
