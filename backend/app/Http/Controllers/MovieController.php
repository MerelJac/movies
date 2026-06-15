<?php

namespace App\Http\Controllers;

use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function __construct(private readonly TmdbService $tmdb)
    {
    }

    /**
     * GET /api/movies/search?query=...&page=1
     */
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:1'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        try {
            $results = $this->tmdb->searchMovies(
                $validated['query'],
                $validated['page'] ?? 1,
            );
        } catch (RequestException $e) {
            return response()->json(
                ['message' => 'Unable to reach The Movie DB. Please try again.'],
                502,
            );
        }

        return response()->json($results);
    }
}
