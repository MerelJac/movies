import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import ViewToggle from "./components/ViewToggle.jsx";
import Pagination from "react-bootstrap/Pagination";
import PopularMovieBanner from "./components/PopularMovieBanner.tsx";
import { popularMovies, searchMovies } from "./api.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function App() {
  const [results, setResults] = useState(null); // null = no search yet
  const [popularResults, setPopularResults] = useState(null);
  const [movieDisplay, setMovieDisplay] = useState("list");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Pagination state for the search results.
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // Movies the user marked as owned, keyed by id so the list survives
  // across searches. Persistence to a backend is not required
  // but API call would be the option
  const [owned, setOwned] = useState(() => new Map());

  function toggleOwned(movie) {
    setOwned((prev) => {
      const next = new Map(prev);
      if (next.has(movie.id)) {
        next.delete(movie.id);
      } else {
        next.set(movie.id, movie);
      }
      return next;
    });
  }

  // Local filter for the "Your Movies" tab — searches the owned list
  // in-memory, no API call.
  const [ownedQuery, setOwnedQuery] = useState("");

  // Pick the layout component from the toggle state. Both share the same
  // { movies, ownedIds, onToggleOwn, limit } props.
  const MovieView = movieDisplay === "grid" ? MovieGrid : MovieList;

  const ownedIds = new Set(owned.keys());
  const ownedMovies = [...owned.values()];
  const filteredOwned = ownedQuery.trim()
    ? ownedMovies.filter((m) =>
        m.title.toLowerCase().includes(ownedQuery.trim().toLowerCase()),
      )
    : ownedMovies;

  async function runSearch(q, p = 1) {
    setLoading(true);
    setError("");
    try {
      const data = await searchMovies(q, p);
      setResults(data.results);
      setTotal(data.total_results);
      setTotalPages(data.total_pages ?? 0);
      setPage(data.page ?? p);
      setQuery(q);
    } catch (err) {
      setError(err.message);
      setResults(null);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  // New search from the search bar always starts at page 1.
  function handleSearch(q) {
    runSearch(q, 1);
  }

  // Re-run the current query for a different page.
  function handlePageChange(p) {
    if (p >= 1 && p <= totalPages && p !== page) {
      runSearch(query, p);
    }
  }

  // Windowed page items for the react-bootstrap Pagination control.
  function pageItems() {
    const WINDOW = 2; // pages on each side of the current page
    const items = [];
    const start = Math.max(1, page - WINDOW);
    const end = Math.min(totalPages, page + WINDOW);

    if (start > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>,
      );
      if (start > 2)
        items.push(<Pagination.Ellipsis key="start-gap" disabled />);
    }

    for (let p = start; p <= end; p += 1) {
      items.push(
        <Pagination.Item
          key={p}
          active={p === page}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Pagination.Item>,
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        items.push(<Pagination.Ellipsis key="end-gap" disabled />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>,
      );
    }

    return items;
  }

  // Popular movies feed the banner. Fetched once on mount; no query needed.
  useEffect(() => {
    let active = true;
    popularMovies()
      .then((data) => {
        if (active) setPopularResults(data.results);
      })
      .catch(() => {
        // Banner is non-critical; ignore failures so search still works.
        if (active) setPopularResults(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {popularResults && <PopularMovieBanner popularMovies={popularResults} />}
      <section className="app">
        <header className="app-header">
          <h1>The Movie DB Prototype</h1>
          <p className="subtitle">Search movies by name.</p>
        </header>

        <Tabs
          defaultActiveKey="all"
          id="movies-tabs"
          transition={false}
          className="movie-tabs"
        >
          <Tab eventKey="all" title="Search Movies">
            <SearchBar onSearch={handleSearch} loading={loading} />

            {error && <p className="message error">{error}</p>}

            {results !== null && !error && (
              <>
                {results.length === 0 ? (
                  <p className="message">No movies found.</p>
                ) : (
                  <>
                    <ViewToggle
                      value={movieDisplay}
                      onChange={setMovieDisplay}
                    />
                    <MovieView
                      movies={results}
                      ownedIds={ownedIds}
                      onToggleOwn={toggleOwned}
                    />
                  </>
                )}
                {totalPages > 1 && (
                  <Pagination className="movie-pagination justify-content-center">
                    <Pagination.Prev
                      onClick={() => handlePageChange(page - 1)}
                      disabled={loading || page <= 1}
                    />
                    {pageItems()}
                    <Pagination.Next
                      onClick={() => handlePageChange(page + 1)}
                      disabled={loading || page >= totalPages}
                    />
                  </Pagination>
                )}
                <footer className="results-total">
                  {total.toLocaleString()} total result{total === 1 ? "" : "s"}
                </footer>
              </>
            )}
          </Tab>
          <Tab eventKey="owned" title={`Your Movies (${ownedMovies.length})`}>
            <SearchBar
              placeholder="Filter your movies…"
              onChange={setOwnedQuery}
              onSearch={setOwnedQuery}
            />

            {ownedMovies.length === 0 ? (
              <p className="message">
                You haven't marked any movies yet. Mark movies as owned from the
                Search Movies tab.
              </p>
            ) : filteredOwned.length === 0 ? (
              <p className="message">No marked movies match “{ownedQuery}”.</p>
            ) : (
              <>
                <ViewToggle value={movieDisplay} onChange={setMovieDisplay} />
                <MovieView
                  movies={filteredOwned}
                  ownedIds={ownedIds}
                  onToggleOwn={toggleOwned}
                  limit={Infinity}
                />
              </>
            )}
          </Tab>
        </Tabs>
      </section>
    </div>
  );
}
