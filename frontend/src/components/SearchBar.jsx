import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const query = value.trim();
    if (query) onSearch(query);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-input"
        placeholder="Search movies by name…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search movies by name"
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}