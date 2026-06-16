import { MAX_RESULTS } from '../constants.js';
import MovieSquare from './MovieSquare.jsx';

export default function MovieGrid({ movies, ownedIds, onToggleOwn, limit = MAX_RESULTS }) {
  return (
    <div className="movie-grid">
      {movies.slice(0, limit).map((movie) => (
        <MovieSquare
          key={movie.id}
          movie={movie}
          isOwned={ownedIds?.has(movie.id) ?? false}
          onToggleOwn={onToggleOwn}
        />
      ))}
    </div>
  );
}
