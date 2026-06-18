<?php

namespace App\Helpers;

Class ShopifyQueryHelper
{
    public static function productshow(){
        return <<<'GRAPHQL'
        query {
            products(first: 50) {
                edges {
                    node {
                        id
                        title
                        status
                        descriptionHtml
                        vendor
                        productType
                        tags
                        featuredImage {
                            id
                            url
                            altText
                        }
                        media(first: 10) {
                            nodes {
                                ... on MediaImage {
                                    id
                                    status
                                    image {
                                        url
                                        altText
                                    }
                                }
                            }
                        }     
                    }
                }
            }
        }
        GRAPHQL;
    }
    public static function productUpdate()
    {
        return <<<'GRAPHQL'
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
        GRAPHQL;
    }
    public static function createMedia()
    {
        return <<<'GRAPHQL'
            mutation productCreateMedia(
              $productId: ID!,
              $media: [CreateMediaInput!]!
            ) {
              productCreateMedia(
                productId: $productId,
                media: $media
              ) {
                media {
                  id
                  status
                }
                mediaUserErrors {
                  field
                  message
                }
              }
            }
            GRAPHQL;
    }
    public static function deleteMedia()
    {
        return <<<'GRAPHQL'
            mutation productDeleteMedia(
                  $productId: ID!,
                  $mediaIds: [ID!]!
                ) {
                  productDeleteMedia(
                    productId: $productId,
                    mediaIds: $mediaIds
                  ) {
                    deletedMediaIds
                    mediaUserErrors {
                      field
                      message
                    }
                  }
                }
            GRAPHQL;
    }
    public static function deleteProduct()
    {
        return <<<'GRAPHQL'
        mutation productDelete($input: ProductDeleteInput!) {
              productDelete(input: $input) {
                deletedProductId
                userErrors {
                  message
                }
              }
            }
        GRAPHQL;
    }
    public static function showproduct()
    {
          return <<<'GRAPHQL'
          query getProduct($id: ID!) {
          product(id: $id) {
            id
            title
            descriptionHtml
            status
            vendor
            productType
            tags

            featuredImage {
              id
              url
              altText
            }

            media(first: 50) {
              nodes {
                ... on MediaImage {
                  id
                  status
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        GRAPHQL;
    }

    public static function showOrder()
    {
      return <<<'GRAPHQL'
            {
              orders(first: 60, sortKey: CREATED_AT, reverse: true) {
                edges {
                  node {
                    id
                    name
                    createdAt
                    displayFinancialStatus
                    displayFulfillmentStatus

                    currentTotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }

                    customer {
                      firstName
                      lastName
                    }
                  }
                }
              }
            }
            GRAPHQL;
    }
}