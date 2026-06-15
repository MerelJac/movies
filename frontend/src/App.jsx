import { useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import MovieList from './components/MovieList.jsx';
import { searchMovies } from './api.js';

export default function App() {
  const [results, setResults] = useState(null); // null = no search yet
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(query) {
    setLoading(true);
    setError('');
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

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="message error">{error}</p>}

      {results !== null && !error && (
        <>
          {results.length === 0 ? (
            <p className="message">No movies found.</p>
          ) : (
            <MovieList movies={results} />
          )}
          <footer className="results-total">
            {total.toLocaleString()} total result{total === 1 ? '' : 's'}
          </footer>
        </>
      )}
    </div>
  );
}
