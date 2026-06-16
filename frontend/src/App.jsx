import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import ViewToggle from "./components/ViewToggle.jsx";
import MovieModal from "./components/MovieModal.jsx";
import MovieStats from "./components/MovieStats.jsx";
import Pagination from "react-bootstrap/Pagination";
import PopularMovieBanner from "./components/PopularMovieBanner.tsx";
import {
  popularMovies,
  searchMovies,
  fetchGenres,
  upcomingMovies,
} from "./api.js";
import { sortMovies, movieGenres } from "./utils.js";
import { SORT_OPTIONS } from "./constants.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import MovieCarousel from "./components/MovieCarousel.jsx";

export default function App() {
  const [results, setResults] = useState(null); // null = no search yet
  const [popularResults, setPopularResults] = useState(null);
  const [upcomingResults, setUpcomingResults] = useState(null);
  const [movieDisplay, setMovieDisplay] = useState("list");
  // Which tab is active; drives whether the Popular/Upcoming sections show.
  const [activeTab, setActiveTab] = useState("all");
  // Client-side sort for search results; defaults to newest first.
  const [sortKey, setSortKey] = useState("release_desc");
  // TMDB genre id => name map, fetched once on mount for the owned stats.
  const [genres, setGenres] = useState({});
  // Movie shown in the detail modal; null = modal closed.
  const [selectedMovie, setSelectedMovie] = useState(null);
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
  // Genre to filter the owned list by, set by clicking a stats pill.
  // null = no genre filter.
  const [genreFilter, setGenreFilter] = useState(null);

  // Pick the layout component from the toggle state. Both share the same
  // { movies, ownedIds, onToggleOwn, limit } props.
  const MovieView = movieDisplay === "grid" ? MovieGrid : MovieList;

  // Sort the current page of results client-side (TMDB search can't sort).
  const sortedResults = results ? sortMovies(results, sortKey) : results;

  const ownedIds = new Set(owned.keys());
  const ownedMovies = [...owned.values()];
  const ownedSearch = ownedQuery.trim().toLowerCase();
  const filteredOwned = ownedMovies.filter((m) => {
    const matchesQuery =
      !ownedSearch || m.title.toLowerCase().includes(ownedSearch);
    const matchesGenre =
      !genreFilter || movieGenres(m, genres).includes(genreFilter);
    return matchesQuery && matchesGenre;
  });

  // Toggle the genre filter: clicking the active genre clears it.
  function toggleGenreFilter(name) {
    setGenreFilter((current) => (current === name ? null : name));
  }

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

    upcomingMovies()
      .then((data) => {
        if (active) setUpcomingResults(data.results);
      })
      .catch(() => {
        // Banner is non-critical; ignore failures so search still works.
        if (active) setUpcomingResults(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // Genre map for the owned-movie stats. Fetched once; cached on the backend.
  useEffect(() => {
    let active = true;
    fetchGenres()
      .then((map) => {
        if (active) setGenres(map);
      })
      .catch(() => {
        // Stats degrade gracefully without genres; leave the map empty.
        if (active) setGenres({});
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
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key ?? "all")}
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
                    <div className="results-controls">
                      <ViewToggle
                        value={movieDisplay}
                        onChange={setMovieDisplay}
                      />
                      <label className="sort-select">
                        Sort by
                        <select
                          value={sortKey}
                          onChange={(e) => setSortKey(e.target.value)}
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <MovieView
                      movies={sortedResults}
                      ownedIds={ownedIds}
                      onToggleOwn={toggleOwned}
                      onSelect={setSelectedMovie}
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
            <MovieStats
              movies={ownedMovies}
              genres={genres}
              activeGenre={genreFilter}
              onSelectGenre={toggleGenreFilter}
            />

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
              <p className="message">
                No marked movies match
                {ownedQuery.trim() && ` “${ownedQuery}”`}
                {ownedQuery.trim() && genreFilter && " in"}
                {genreFilter && ` ${genreFilter}`}.
              </p>
            ) : (
              <>
                <ViewToggle value={movieDisplay} onChange={setMovieDisplay} />
                <MovieView
                  movies={filteredOwned}
                  ownedIds={ownedIds}
                  onToggleOwn={toggleOwned}
                  onSelect={setSelectedMovie}
                  limit={Infinity}
                />
              </>
            )}
          </Tab>
        </Tabs>
      </section>
      {activeTab === "all" && (
      <section className="px-10">
        {popularResults && (
          <div>
            <header className="app-header">
              <h1 className="pb-4">Popular Movies</h1>
            </header>
            <MovieCarousel
              movies={popularResults}
              onSelect={setSelectedMovie}
            />
          </div>
        )}

        {upcomingResults && (
          <div>
            <header className="app-header">
              <h1 className="py-4">Upcoming Movies</h1>
            </header>
            <MovieCarousel
              movies={upcomingResults}
              onSelect={setSelectedMovie}
            />
          </div>
        )}
      </section>
      )}

      <MovieModal
        movie={selectedMovie}
        isOwned={selectedMovie ? ownedIds.has(selectedMovie.id) : false}
        onToggleOwn={toggleOwned}
        onClose={() => setSelectedMovie(null)}
        genres={genres}
      />
    </div>
  );
}
