<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StockController;
use App\Http\Controllers\UserController;
 
use App\Http\Controllers\ValidateController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
 

Route::post('/stock',[StockController::class,'getStock']);

Route::post('/register',[UserController::class,'userRegister']);

Route::post('/generateToken',[UserController::class,'generateToken']);  

Route::middleware(['auth:sanctum'])->group(function(){   
    Route::post('/logout',[UserController::class,'logout']);
});


/// Bajaj URl


Route::get('/validate/{materialCode}/{serialNumber}/{accessKey}',[ValidateController::class,'validateValue']);