<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
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
            ->get('/discover/movie', [
                'query' => $query,
                'page' => $page,
                'include_adult' => false,
            ])
            ->throw()
            ->json();

        return [
            'page' => $data['page'] ?? 1,
            'total_results' => $data['total_results'] ?? 0,
            'total_pages' => $data['total_pages'] ?? 0,
            'results' => array_map(
                fn (array $movie) => [
                    'id' => $movie['id'] ?? null,
                    'title' => $movie['title'] ?? '',
                    'release_date' => $movie['release_date'] ?? null,
                    'overview' => $movie['overview'] ?? '',
                    'poster_path' => $movie['poster_path'] ?? null,
                ],
                $data['results'] ?? [],
            ),
        ];
    }

        /**
     * GET popular movies
     *
     * @return array{page:int,total_results:int,total_pages:int,results:array<int,array<string,mixed>>}
     */
    public function searchMovies(string $query, int $page = 1): array
    {
        $data = $this->request()
            ->get('/discover/movie', [
                'query' => $query,
                'page' => $page,
                'include_adult' => false,
            ])
            ->throw()
            ->json();

        return [
            'page' => $data['page'] ?? 1,
            'total_results' => $data['total_results'] ?? 0,
            'total_pages' => $data['total_pages'] ?? 0,
            'results' => array_map(
                fn (array $movie) => [
                    'id' => $movie['id'] ?? null,
                    'title' => $movie['title'] ?? '',
                    'release_date' => $movie['release_date'] ?? null,
                    'overview' => $movie['overview'] ?? '',
                    'poster_path' => $movie['poster_path'] ?? null,
                ],
                $data['results'] ?? [],
            ),
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
