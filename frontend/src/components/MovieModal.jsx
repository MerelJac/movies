import Modal from "react-bootstrap/Modal";
import { POSTER_BASE } from "../constants";
import { formatDate, movieGenres, isReleased } from "../utils";
import PopularityIcon from "./PopularityIcon";

// Reusable detail modal. Driven by the `movie` prop: when it's null the modal
// is hidden, otherwise it shows that movie. Closing calls onClose.
export default function MovieModal({
  movie,
  isOwned = false,
  onToggleOwn,
  onClose,
  genres = {},
}) {
  const genreNames = movie ? movieGenres(movie, genres) : [];

  return (
    <Modal
      show={movie !== null}
      onHide={onClose}
      centered
      contentClassName="movie-modal"
    >
      {movie && (
        <div>
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>{movie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="movie-modal__body">
            <div className="flex flex-col gap-2 max-w-[50%]">
              {movie.poster_path ? (
                <img
                  className="movie-modal__poster"
                  src={`${POSTER_BASE}${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div className="movie-modal__poster movie-modal__poster--empty">
                  No image
                </div>
              )}
              <PopularityIcon popularity={movie.popularity} />

              {genreNames.length > 0 && (
                <div className="movie-modal__genres">
                  {genreNames.map((name) => (
                    <span key={name} className="genre-pill">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="movie-modal__info">
              <p className="movie-modal__date">
                {formatDate(movie.release_date)}
              </p>

              <p className="movie-modal__overview">
                {movie.overview || "No overview available."}
              </p>
              {onToggleOwn && isReleased(movie) && (
                <button
                  type="button"
                  className={`own-button${isOwned ? " own-button--owned" : ""}`}
                  aria-pressed={isOwned}
                  onClick={() => onToggleOwn(movie)}
                >
                  {isOwned ? "✓ Owned" : "+ I own this"}
                </button>
              )}
            </div>
          </Modal.Body>
        </div>
      )}
    </Modal>
  );
}
