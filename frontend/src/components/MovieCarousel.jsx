import { useRef } from "react";
import MovieGridSimple from "./MovieGridSimple.jsx";

// Renders a single horizontally-scrolling row of movie squares with smooth
// prev/next buttons. Clicking a button scrolls by ~80% of the visible width.
export default function MovieCarousel({ movies = [], onSelect }) {
  const trackRef = useRef(null);

  if (!movies.length) return null;

  // Scroll the track by most of a viewport width in the given direction.
  // `behavior: "smooth"` (plus scroll-snap in CSS) makes the motion glide.
  function scrollByPage(direction) {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="movie-carousel-wrap">
      <button
        type="button"
        className="carousel-nav carousel-nav--prev"
        aria-label="Scroll left"
        onClick={() => scrollByPage(-1)}
      >
        ‹
      </button>

      <div
        ref={trackRef}
        className="movie-carousel movie-carousel--horizontal"
      >
        <MovieGridSimple movies={movies} onSelect={onSelect} />
      </div>

      <button
        type="button"
        className="carousel-nav carousel-nav--next"
        aria-label="Scroll right"
        onClick={() => scrollByPage(1)}
      >
        ›
      </button>
    </div>
  );
}
