<?php

use App\Http\Controllers\MovieController;
use Illuminate\Support\Facades\Route;

// search proxies straight to TMDB (rate-limited upstream), so keep it tighter.
Route::get('/movies/search', [MovieController::class, 'search'])
    ->middleware('throttle:30,1');

// popular is cached for 6h, so it rarely hits TMDB — a looser cap is fine.
Route::get('/movies/popular', [MovieController::class, 'popular'])
    ->middleware('throttle:60,1');

// genres is cached for 6h, so it rarely hits TMDB — a looser cap is fine.
Route::get('/genre/movie/list', [MovieController::class, 'getGenres'])
    ->middleware('throttle:60,1');
