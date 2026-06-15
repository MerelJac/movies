<?php

namespace App\Http\Controllers;

use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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

    /**
     * GET /api/movies/popular?page=1
     */
    public function popular(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $page = $validated['page'] ?? 1;
        $cacheKey = "tmdb.popular.page.{$page}";

        // TMDB's popular list changes slowly, so cache it to avoid hitting the
        // API on every request. The file store needs no database.
        $cached = Cache::store('file')->has($cacheKey);

        try {
            $results = Cache::store('file')->remember(
                $cacheKey,
                now()->addHours(6),
                fn () => $this->tmdb->popularMovies($page),
            );
        } catch (RequestException $e) {
            return response()->json(
                ['message' => 'Unable to reach The Movie DB. Please try again.'],
                502,
            );
        }

        Log::info('Popular movies served', [
            'page' => $page,
            'count' => count($results['results'] ?? []),
            'source' => $cached ? 'cache' : 'api',
        ]);

        return response()->json($results);
    }
}
