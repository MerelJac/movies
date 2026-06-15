import { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import { searchMovies } from "./api.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function App() {
  const [results, setResults] = useState(null); // null = no search yet
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const ownedIds = new Set(owned.keys());
  const ownedMovies = [...owned.values()];
  const filteredOwned = ownedQuery.trim()
    ? ownedMovies.filter((m) =>
        m.title.toLowerCase().includes(ownedQuery.trim().toLowerCase()),
      )
    : ownedMovies;

  async function handleSearch(query) {
    setLoading(true);
    setError("");
    try {
      const data = await searchMovies(query);
      setResults(data.results);
      setTotal(data.total_results);
    } catch (err) {
      setError(err.message);
      setResults(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
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
        <Tab eventKey="all" title="Search Results">
          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && <p className="message error">{error}</p>}

          {results !== null && !error && (
            <>
              {results.length === 0 ? (
                <p className="message">No movies found.</p>
              ) : (
                <MovieList
                  movies={results}
                  ownedIds={ownedIds}
                  onToggleOwn={toggleOwned}
                />
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
              Search Results tab.
            </p>
          ) : filteredOwned.length === 0 ? (
            <p className="message">No marked movies match “{ownedQuery}”.</p>
          ) : (
            <MovieList
              movies={filteredOwned}
              ownedIds={ownedIds}
              onToggleOwn={toggleOwned}
              limit={Infinity}
            />
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
