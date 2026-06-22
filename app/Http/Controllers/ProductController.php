<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Helpers\ShopifyQueryHelper;

class ProductController extends Controller
{

    // LIST PRODUCTS
    public function list(Request $request)
    {
        Log::info('PRODUCT LIST START');

        try {
            $shop = Auth::user();

            if (!$shop) {
                Log::warning('LIST FAILED - Unauthenticated');
                return response()->json([
                    "status" => 0,
                    "error" => "Unauthenticated"
                ], 401);
            }

            // call function which are in Helper folder
            $query = ShopifyQueryHelper::productShow();



            Log::info('SHOPIFY LIST QUERY SENT');

            // Execute Shopify Graph API Call
            $rawResponse = $shop->api()->graph($query);

            Log::info('SHOPIFY RESPONSE', [
                'response' => json_decode(json_encode($rawResponse), true)
            ]);

            // CRITICAL FIX: Explicitly cast ResponseAccess object to array for safe logging
            $responseArray = (array) $rawResponse;

            Log::info('SHOPIFY LIST RESPONSE RECEIVED', [
                'response' => $responseArray
            ]);

            // Extract products safely from the response array layer
            $productsEdges = $responseArray['body']['data']['products']['edges'] ?? [];

            $formattedProducts = [];
            Log::info('formattedProducts', $formattedProducts);
            // Flatten the data so it's clean and simple for your React frontend
            foreach ($productsEdges as $edge) {
                if (isset($edge['node'])) {
                    $node = $edge['node'];

                    $formattedProducts[] = [
                        'id' => $node['id'] ?? '',
                        'title' => $node['title'] ?? '',
                        'status' => $node['status'] ?? 'ACTIVE',
                        'descriptionHtml' => $node['descriptionHtml'] ?? '',
                        'vendor' => $node['vendor'] ?? '',
                        'productType' => $node['productType'] ?? '',
                        'tags' => $node['tags'] ?? [],
                        'featuredImage' => $node['featuredImage'] ?? null,
                        'media' => $node['media']['nodes'] ?? []
                    ];
                }
            }

            return response()->json([
                "status" => 1,
                "products" => $formattedProducts
            ]);

        } catch (\Exception $e) {
            Log::error('LIST PRODUCTS ERROR', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                "status" => 0,
                "error" => $e->getMessage()
            ], 500);
        }
    }



    // CREATE PRODUCT
    public function create(Request $request)
    {
        Log::info('CREATE PRODUCT START', [
            'request' => $request->all()
        ]);

        try {

            $shop = Auth::user();

            if (!$shop) {
                return response()->json([
                    "status" => 0,
                    "error" => "Unauthenticated"
                ], 401);
            }


            // PRODUCT INPUT
            $variables = [
                "input" => [
                    "title" => $request->title,
                    "descriptionHtml" => $request->description ?? "",
                    "vendor" => $request->vendor ?? "",
                    "productType" => $request->productType ?? "",
                    "status" => $request->status ?? "ACTIVE",
                    "tags" => !empty($request->tags)
                        ? array_map('trim', explode(',', $request->tags))
                        : [],
                ]
            ];

            //call staticfunction from ShopifyQueryHelper
            $mutation = ShopifyQueryHelper::productcreate();

            $response = $shop->api()->graph($mutation, $variables);

            Log::info('SHOPIFY CREATE RESPONSE', [
                'response' => $response
            ]);

            $product = $response['body']['data']['productCreate']['product'] ?? null;

            if (!$product) {
                return response()->json([
                    "status" => 0,
                    "error" => "Product creation failed"
                ]);
            }

            $productId = $product['id'];

            Log::info('PRODUCT CREATED', ['productId' => $productId]);


            // IMAGE UPLOAD (MULTIPLE STYLE LIKE REMIX)
            if ($request->hasFile('image')) {

                $paths = [];

                // allow single OR multiple uploads
                $images = is_array($request->file('image'))
                    ? $request->file('image')
                    : [$request->file('image')];

                foreach ($images as $file) {

                    $path = $file->store('products', 'public');
                    $imageUrl = str_replace(
                        'http://',
                        'https://',
                        url('/storage/' . $path)
                    );
                    Log::info('IMAGE URL', [
                        'url' => $imageUrl
                    ]);

                    $paths[] = [
                        "alt" => $request->title ?? "Product Image",
                        "mediaContentType" => "IMAGE",
                        "originalSource" => $imageUrl
                    ];
                }

                Log::info('MEDIA PAYLOAD READY', $paths);

                //call static function from ShopifyQueryHelper:
                $mediaMutation = ShopifyQueryHelper::productCreateMedia();

                $mediaResponse = $shop->api()->graph($mediaMutation, [
                    "productId" => $productId,
                    "media" => $paths
                ]);

                Log::info('MEDIA UPLOAD RESPONSE', [
                    'response' => $mediaResponse
                ]);


                // OPTIONAL: SET FIRST IMAGE AS FEATURED
                $mediaId = $mediaResponse['body']['data']['productCreateMedia']['media'][0]['id'] ?? null;

                if ($mediaId) {

                    $featuredMutation = ShopifyQueryHelper::productSetFeaturedMedia();

                    $shop->api()->graph($featuredMutation, [
                        "productId" => $productId,
                        "mediaId" => $mediaId
                    ]);

                    Log::info('FEATURED IMAGE SET', [
                        'mediaId' => $mediaId
                    ]);
                }
            }

            return response()->json([
                "status" => 1,
                "message" => "Product created successfully",
                "productId" => $productId
            ]);

        } catch (\Exception $e) {

            Log::error('CREATE PRODUCT ERROR', [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                "status" => 0,
                "error" => $e->getMessage()
            ], 500);
        }
    }


    // SHOW PRODUCT
    public function show(Request $request, $id)
    {
        Log::info('SHOW PRODUCT START', [
            'id' => $id
        ]);

        try {

            $shop = Auth::user();

            if (!$shop) {
                return response()->json([
                    'status' => 0,
                    'error' => 'Unauthenticated'
                ], 401);
            }

            //call static function which are in ShopifyQueryHelper
            $query = ShopifyQueryHelper::showproduct();

            $response = $shop->api()->graph(
                $query,
                [
                    "id" => $id
                ]
            );

            $responseArray = json_decode(
                json_encode($response),
                true
            );

            Log::info(
                'SHOPIFY SHOW RESPONSE',
                $responseArray
            );

            $product =
                $responseArray['body']['data']['product']
                ?? null;

            if (!$product) {
                return response()->json([
                    'status' => 0,
                    'error' => 'Product not found'
                ]);
            }

            return response()->json([
                'status' => 1,
                'product' => [
                    'id' => $product['id'] ?? '',
                    'title' => $product['title'] ?? '',
                    'descriptionHtml' => $product['descriptionHtml'] ?? '',
                    'vendor' => $product['vendor'] ?? '',
                    'productType' => $product['productType'] ?? '',
                    'status' => $product['status'] ?? '',
                    'tags' => $product['tags'] ?? [],
                    'featuredImage' => $product['featuredImage'] ?? null,

                    'media' => [
                        'nodes' => collect(
                            $product['media']['nodes'] ?? []
                        )->map(function ($item) {
                            return [
                                'id' => $item['id'] ?? '',
                                'status' => $item['status'] ?? '',
                                'image' => [
                                    'url' => $item['image']['url'] ?? '',
                                    'altText' => $item['image']['altText'] ?? '',
                                ]
                            ];
                        })->values()
                    ]
                ]
            ]);

        } catch (\Exception $e) {

            Log::error(
                'SHOW PRODUCT ERROR',
                [
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile()
                ]
            );

            return response()->json([
                'status' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // UPDATE PRODUCT
    public function update(Request $request)
    {
        try {

            $shop = Auth::user();

            if (!$shop) {
                return response()->json([
                    'status' => 0,
                    'error' => 'Unauthenticated'
                ], 401);
            }

            //remove image
            if ($request->filled('removeImages')) {

                $removeImages = json_decode(
                    $request->removeImages,
                    true
                );

                if (!empty($removeImages)) {

                    $deleteMutation = shopifyQueryHelper::deleteMedia();

                    $deleteResponse = $shop->api()->graph(
                        $deleteMutation,
                        [
                            "productId" => $request->id,
                            "mediaIds" => $removeImages
                        ]
                    );

                    Log::info(
                        'DELETE IMAGE RESPONSE',
                        json_decode(
                            json_encode($deleteResponse),
                            true
                        )
                    );
                }
            }

            //product update

            $tagsArray = !empty($request->tags)
                ? array_map('trim', explode(',', $request->tags))
                : [];

            $mutation = ShopifyQueryHelper::productUpdate();

            $variables = [
                "input" => [
                    "id" => $request->id,
                    "title" => $request->title,
                    "descriptionHtml" => $request->description ?? "",
                    "vendor" => $request->vendor ?? "",
                    "productType" => $request->productType ?? "",
                    "tags" => $tagsArray,
                    "status" => $request->status ?? "ACTIVE",
                ]
            ];

            $updateResponse = $shop->api()->graph(
                $mutation,
                $variables
            );

            Log::info(
                'PRODUCT UPDATE RESPONSE',
                json_decode(
                    json_encode($updateResponse),
                    true
                )
            );

            //multiple image upload

            if ($request->hasFile('images')) {

                $media = [];

                foreach ($request->file('images') as $file) {

                    $path = $file->store(
                        'products',
                        'public'
                    );

                    $imageUrl = asset(
                        'storage/' . $path
                    );

                    $imageUrl = str_replace(
                        'http://',
                        'https://',
                        $imageUrl
                    );

                    $media[] = [
                        "originalSource" => $imageUrl,
                        "mediaContentType" => "IMAGE",
                        "alt" => $request->title
                    ];
                }

                //call a static function which are in ShopifyQueryHelper
                $imageMutation = ShopifyQueryHelper::createMedia();

                $imageResponse = $shop->api()->graph(
                    $imageMutation,
                    [
                        "productId" => $request->id,
                        "media" => $media
                    ]
                );

                $imageResponseArray = json_decode(
                    json_encode($imageResponse),
                    true
                );

                Log::info(
                    'IMAGE RESPONSE',
                    $imageResponseArray
                );

                $mediaItems =
                    $imageResponseArray['body']['data']['productCreateMedia']['media']
                    ?? [];

                //fetured image

                if (!empty($mediaItems)) {

                    sleep(2);

                    $firstMediaId =
                        $mediaItems[0]['id'] ?? null;

                    if ($firstMediaId) {

                        $featuredMutation = <<<'GRAPHQL'
                    mutation productSetFeaturedMedia(
                      $productId: ID!,
                      $mediaId: ID!
                    ) {
                      productSetFeaturedMedia(
                        productId: $productId,
                        mediaId: $mediaId
                      ) {
                        product {
                          id
                        }
                        userErrors {
                          message
                        }
                      }
                    }
                    GRAPHQL;

                        $shop->api()->graph(
                            $featuredMutation,
                            [
                                "productId" => $request->id,
                                "mediaId" => $firstMediaId
                            ]
                        );
                    }
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Product updated successfully'
            ]);

        } catch (\Exception $e) {

            Log::error(
                'UPDATE PRODUCT ERROR',
                [
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile()
                ]
            );

            return response()->json([
                'status' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // DELETE PRODUCT
    public function delete(Request $request)
    {
        Log::info('DELETE PRODUCT START', [
            'request' => $request->all()
        ]);

        try {

            $shop = Auth::user();

            if (!$shop) {
                Log::warning('DELETE FAILED - Unauthenticated');

                return response()->json([
                    'status' => 0,
                    'error' => 'Unauthenticated'
                ]);
            }

            Log::info('DELETE REQUEST ID', [
                'id' => $request->id
            ]);

            //call a static function which are in ShopifyQueryHelper 
            $mutation = ShopifyQueryHelper::deleteProduct();

            $response = $shop->api()->graph($mutation, [
                "input" => [
                    "id" => $request->id
                ]
            ]);

            Log::info('DELETE RESPONSE', [
                'response' => $response
            ]);

            return response()->json([
                "status" => 1,
                "message" => "Product deleted"
            ]);

        } catch (\Exception $e) {

            Log::error('DELETE PRODUCT ERROR', [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                "status" => 0,
                "error" => $e->getMessage()
            ]);
        }
    }
}