<?php
namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

/**
 * Thin wrapper around The Movie DB REST API.
 *
 * Uses Laravel's HTTP client (a Guzzle wrapper) so the TMDB v4 access token
 * stays server-side and never reaches the browser. New endpoints can be added
 * here as the prototype grows.
 */
class TmdbService
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly ?string $accessToken,
    ) {
    }

    /**
     * Search movies by name.
     *
     * @return array{page:int,total_results:int,total_pages:int,results:array<int,array<string,mixed>>}
     */
    public function searchMovies(string $query, int $page = 1): array
    {
        $data = $this->request()
            ->get('/search/movie', [
                'query'         => $query,
                'page'          => $page,
                'include_adult' => false,
            ])
            ->throw()
            ->json();

        return [
            'page'          => $data['page'] ?? 1,
            'total_results' => $data['total_results'] ?? 0,
            'total_pages'   => $data['total_pages'] ?? 0,
            'results'       => array_map($this->mapMovie(...), $data['results'] ?? []),
        ];
    }

    /**
     * GET popular movies - takes no query.
     *
     * @return array{page:int,results:array<int,array<string,mixed>>}
     */
    public function popularMovies(int $page = 1): array
    {
        $data = $this->request()
            ->get('/movie/popular', [
                'page' => $page,
            ])
            ->throw()
            ->json();

        return [
            'page'    => $data['page'] ?? 1,
            'results' => array_map($this->mapMovie(...), $data['results'] ?? []),
        ];
    }

    /**
     * GET upcoming movies - takes no query.
     *
     * @return array{page:int,results:array<int,array<string,mixed>>}
     */
    public function upcomingMovies(int $page = 1): array
    {
        $data = $this->request()
            ->get('/movie/upcoming', [
                'page' => $page,
            ])
            ->throw()
            ->json();

        return [
            'page'    => $data['page'] ?? 1,
            'results' => array_map($this->mapMovie(...), $data['results'] ?? []),
        ];
    }

    /**
     * GET the movie genre list. TMDB returns a flat list; we reshape it into an
     * id => name map, which is what the frontend needs for stats.
     *
     * @return array<int,string>
     */
    public function getGenres(): array
    {
        $genres = $this->request()
            ->get('/genre/movie/list')
            ->throw()
            ->json('genres', []);

        $map = [];
        foreach ($genres as $genre) {
            if (isset($genre['id'], $genre['name'])) {
                $map[$genre['id']] = $genre['name'];
            }
        }

        return $map;
    }

    /**
     * Reduce a raw TMDB movie to the fields the frontend uses — for display
     * (title/poster/overview) and for sorting/stats (rating/genres/popularity).
     *
     * @param  array<string,mixed>  $movie
     * @return array<string,mixed>
     */
    private function mapMovie(array $movie): array
    {
        return [
            'id'           => $movie['id'] ?? null,
            'title'        => $movie['title'] ?? '',
            'release_date' => $movie['release_date'] ?? null,
            'overview'     => $movie['overview'] ?? '',
            'poster_path'  => $movie['poster_path'] ?? null,
            'genre_ids'    => $movie['genre_ids'] ?? [],
            'vote_average' => $movie['vote_average'] ?? 0,
            'vote_count'   => $movie['vote_count'] ?? 0,
            'popularity'   => $movie['popularity'] ?? 0,
        ];
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->withToken($this->accessToken)
            ->acceptJson()
            ->timeout(10);
    }
}
