<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SortController;
use App\Http\Controllers\BoxClouserSortController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/register', [UserController::class, 'userRegister']);
Route::post('/generateToken', [UserController::class, 'generateToken']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/crate-clourser', [ApiController::class, 'crateClourser']);
    Route::post('/sort', [SortController::class, 'sortMethod']);
    Route::post('/box-clouser-sort', [BoxClouserSortController::class, 'boxClouserSortMethodd']);
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
});