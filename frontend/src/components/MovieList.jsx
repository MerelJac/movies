import { MAX_RESULTS } from '../constants.js';
import MovieCard from './MovieCard.jsx';

export default function MovieList({ movies, ownedIds, onToggleOwn, watchIds, onToggleWatch, onSelect, limit = MAX_RESULTS }) {
  return (
    <div className="movie-list">
      {movies.slice(0, limit).map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isOwned={ownedIds?.has(movie.id) ?? false}
          onToggleOwn={onToggleOwn}
          inWatchlist={watchIds?.has(movie.id) ?? false}
          onToggleWatch={onToggleWatch}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
