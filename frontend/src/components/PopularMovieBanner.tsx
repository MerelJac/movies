// Automatic slow horizontal scroll of popular movies.
import PopularMovieCard from './PopularMovieCard.tsx';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function PopularMovieBanner({
  popularMovies,
}: {
  popularMovies: Movie[];
}) {
  if (!popularMovies?.length) return null;

  // Render the list twice so the track can scroll seamlessly: when the
  // first copy has fully scrolled off, the second copy is in its place
  // and the animation loops without a visible jump.
  const reel = [...popularMovies, ...popularMovies];

  return (
    <div className="popular-banner" aria-label="Popular movies">
      <div className="popular-banner-track">
        {reel.map((movie, i) => (
          <PopularMovieCard key={`${movie.id}-${i}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}
