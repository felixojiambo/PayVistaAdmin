<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SalaryDetailController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// User route to create or update their own record
Route::post('/salaries', [SalaryDetailController::class, 'storeOrUpdate']);

// Admin routes to get all and update a specific record
Route::get('/salaries', [SalaryDetailController::class, 'index']);
Route::put('/salaries/{salaryDetail}', [SalaryDetailController::class, 'update']);
