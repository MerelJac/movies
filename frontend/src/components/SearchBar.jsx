import { useState } from 'react';

export default function SearchBar({
  onSearch,
  loading,
  placeholder = 'Search movies by name…',
  onChange,
}) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const query = value.trim();
    if (query) onSearch(query);
  }

  function handleChange(e) {
    setValue(e.target.value);
    // Optional live filtering (used by the owned-movies tab).
    if (onChange) onChange(e.target.value);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={placeholder}
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}