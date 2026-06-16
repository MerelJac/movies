import { POSTER_BASE } from "../constants";


interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function PopularMovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="popular-card" title={movie.title}>
      {movie.poster_path ? (
        <img
          className="popular-card-poster"
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
      ) : (
        <div className="popular-card-poster popular-card-poster--empty">
          {movie.title}
        </div>
      )}
    </div>
  );
}