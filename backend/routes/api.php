<?php

use App\Http\Controllers\MovieController;
use Illuminate\Support\Facades\Route;

Route::get('/movies/search', [MovieController::class, 'search']);
Route::get('/movies/popular', [MovieController::class, 'popular']);
