import React, { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import {
  Page,
  Card,
  IndexTable,
  Text,
  Spinner,
  Banner,
  Thumbnail,
  Button,
  ButtonGroup,
  EmptyState,
  Badge,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";

export default function ListPage() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //to open modal
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };


  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      console.log("FETCH PRODUCTS START");
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const json = await response.json();
      console.log("PRODUCT RESPONSE FROM BACKEND:", json);

      if (!json?.status) {
        throw new Error(json?.error || "Failed to fetch products");
      }

      // FIX: Read the clean, flattened array directly from our updated Laravel API
      const backendProducts = json?.products ?? [];

      const formattedProducts = backendProducts.map((p) => {
        const images = [];

        if (p.featuredImage?.url) {
          images.push(p.featuredImage.url);
        }

        if (Array.isArray(p.media)) {
          p.media.forEach((item) => {
            if (
              item?.status === "READY" &&
              item?.image?.url &&
              !images.includes(item.image.url)
            ) {
              images.push(item.image.url);
            }
          });
        }

        return {
          id: p.id,
          title: p.title || "Untitled Product",
          status: p.status || "ACTIVE",
          images,
        };
      });

      setProducts(formattedProducts);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(err.message || "Failed to load products");
      shopify.toast.show(err.message || "Failed to load Product",
        {
          isError: true,
        }
      );
    } compression: {
      setLoading(false);
      console.log("FETCH PRODUCTS END");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  // DELETE PRODUCT
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      setDeletingId(selectedProduct.id);

      const response = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: selectedProduct.id,
        }),
      });

      const json = await response.json();

      if (!json.status) {
        throw new Error(json.error || "Delete failed");
      }

      setProducts((prev) =>
        prev.filter((item) => item.id !== selectedProduct.id)
      );

      shopify.toast.show("Product deleted successfully");

      setModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);

      shopify.toast.show(err.message || "Delete failed", {
        isError: true,
      });
    } finally {
      setDeletingId(null);
    }
  };


  // EDIT PRODUCT
  const editProduct = (id) => {
    navigate(`/edit?id=${encodeURIComponent(id)}`);
  };

  // Helper to color-code Shopify statuses nicely using Badges
  const renderStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge tone="success">Active</Badge>;
      case "DRAFT":
        return <Badge tone="info">Draft</Badge>;
      case "ARCHIVED":
        return <Badge tone="warning">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };


  // EMPTY STATE
  if (!loading && products.length === 0) {
    return (
      <Page
        title="Products"
        primaryAction={{
          content: "Create Product",
          onAction: () => navigate("/create"),
        }}
      >
        <Card>
          <EmptyState
            heading="No Products Found"
            action={{
              content: 'Create Product',
              onAction: () => navigate("/create"),
            }}
            image="https://shopify.com"
          >
            <p>Create products in Shopify Admin or click above to make your first one.</p>
          </EmptyState>
        </Card>
      </Page>
    );
  }


  // TABLE ROWS
  const rowMarkup = products.map((product, index) => (
    <IndexTable.Row
      id={product.id}
      key={product.id}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {product.id?.split("/").pop()}
        </Text>
      </IndexTable.Cell>

      <IndexTable.Cell>
        {product.images?.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              maxWidth: "220px",
            }}
          >
            {product.images.slice(0, 4).map((img, i) => (
              <Thumbnail
                key={i}
                source={img}
                alt={`${product.title}-${i}`}
                size="small"
              />
            ))}

            {product.images.length > 4 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                +{product.images.length - 4}
              </span>
            )}
          </div>
        ) : (
          <Thumbnail
            source={ImageIcon}
            alt="No Image"
            size="small"
          />
        )}
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {product.title}
        </Text>
      </IndexTable.Cell>

      <IndexTable.Cell>
        {renderStatusBadge(product.status)}
      </IndexTable.Cell>

      <IndexTable.Cell>
        <ButtonGroup variant="segmented">
          <Button
            size="slim"
            onClick={() => editProduct(product.id)}
          >
            Edit
          </Button>
          <Button
            size="slim"
            tone="critical"
            loading={deletingId === product.id}
            onClick={() => openDeleteModal(product)}
          >
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page
      title="Products"
      primaryAction={{
        content: "Create Product",
        onAction: () => navigate("/create"),
      }}
      secondaryActions={[
        {
          content: "Refresh",
          onAction: fetchProducts,
        },
      ]}
    >
      {error && (
        <div style={{ marginBottom: "15px" }}>
          <Banner tone="critical">
            <p>{error}</p>
          </Banner>
        </div>
      )}

      {loading ? (
        <Card>
          <div style={{ padding: "60px", display: "flex", justifyContent: "center" }}>
            <Spinner size="large" accessibilityLabel="Loading products list" />
          </div>
        </Card>
      ) : (
        <Card padding="0">
          <IndexTable
            resourceName={{
              singular: "product",
              plural: "products",
            }}
            itemCount={products.length}
            selectable={false}
            headings={[
              { title: "ID" },
              { title: "Image" },
              { title: "Title" },
              { title: "Status" },
              { title: "Actions" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      )}
      <DeleteConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={deleteProduct}
        loading={deletingId === selectedProduct?.id}
        productTitle={selectedProduct?.title || ""}
      />
    </Page>
  );
}

