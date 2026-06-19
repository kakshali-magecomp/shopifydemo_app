<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

Route::middleware(['verify.shopify'])->group(function () {

    // List Products
    Route::get('/products', [ProductController::class, 'list']);

    // Create Product
    Route::post('/products/create', [ProductController::class, 'create']);

    // Show Single Product
    Route::get('/products/{id}', [ProductController::class, 'show'])
        ->where('id', '.*');

    // Update Product
    Route::post('/products/update', [ProductController::class, 'update']);

    // Delete Product
    Route::delete('/products/delete', [ProductController::class, 'delete']);

    //List Orders
    Route::get('/orders', [OrderController::class, 'list']);
});