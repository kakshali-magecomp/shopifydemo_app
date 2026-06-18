<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Helpers\ShopifyQueryHelper;

class OrderController extends Controller
{
    public function list()
    {
        try {

            Log::info('ORDER LIST API START');

            $shop = Auth::user();

            if (!$shop) {
                Log::error('No authenticated shop found.');

                return response()->json([
                    'status' => 0,
                    'message' => 'Shop not authenticated'
                ], 401);
            }

            Log::info('Shop Found', [
                'shop_id' => $shop->id ?? null,
                'shop' => $shop->name ?? null,
            ]);

            $query = ShopifyQueryHelper::showOrder();

            $response = $shop->api()->graph($query);

            $errors = data_get($response, 'body.errors');

            if (!empty($errors)) {
                Log::error('SHOPIFY GRAPHQL ERROR', [
                    'errors' => $errors,
                ]);

                return response()->json([
                    'status' => 0,
                    'message' => $errors[0]['message'] ?? 'GraphQL Error'
                ], 403);
            }

            Log::info('Shopify Response Received', [
                'response' => $response
            ]);

            $orders = data_get(
                $response,
                'body.data.orders.edges',
                []
            );

            Log::info('Orders Count', [
                'count' => count($orders)
            ]);

            return response()->json([
                'status' => 1,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {

            Log::error('ORDER FETCH ERROR', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 0,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}