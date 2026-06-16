import MovieGridSimple from "./MovieGridSimple.jsx";

// Renders a row/stack of MovieCardSimple cards. By default the cards stack and
// wrap (no horizontal scroll); pass `horizontal` to lay them out in a single
// horizontally-scrolling row instead.
export default function MovieCarousel({ movies = [], onSelect }) {
  if (!movies.length) return null;

  return (
    <div className={`movie-carousel  movie-carousel--horizontal`}>
      <MovieGridSimple movies={movies} onSelect={onSelect} />
    </div>
  );
}
