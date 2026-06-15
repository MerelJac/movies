import MovieCard from './MovieCard.jsx';

// Requirement: show at most the first 10 results.
const MAX_RESULTS = 10;

export default function MovieList({ movies }) {
  return (
    <div className="movie-list">
      {movies.slice(0, MAX_RESULTS).map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}