import { MAX_RESULTS } from '../constants.js';
import MovieSquare from './MovieSquare.jsx';

export default function MovieGridSimple({ movies = [], onSelect }) {
  if (!movies.length) return null;

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieSquare
          key={movie.id}
          movie={movie}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
