import React, { useEffect, useState } from "react";
import OrderTableSkeleton from "../components/OrderTableSkeleton";
import ErrorBanner from "../components/ErrorBanner";
import {
  Page,
  Card,
  IndexTable,
  Text,
  Spinner,
  Banner,
  EmptyState,
  Badge,
  Box,
} from "@shopify/polaris";

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("ORDER RESPONSE FROM BACKEND:", data);

      if (data.status) {
        setOrders(data.orders || []);
      } else {
        setError(
          data.message || "Unable to load orders. Please try again later."
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders. Please try again later.");
      shopify.toast.show(err.message || "Failed to load orders",
        {
          isError: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getFinancialTone = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "REFUNDED":
        return "critical";
      default:
        return "info";
    }
  };

  const getFulfillmentTone = (status) => {
    switch (status?.toUpperCase()) {
      case "FULFILLED":
        return "success";
      case "UNFULFILLED":
        return "warning";
      case "PARTIALLY_FULFILLED":
        return "info";
      default:
        return "info";
    }
  };

  // Error State
  // if (error) {
  //   return (
  //     <Page title="Order Dashboard">
  //       <Banner tone="critical">
  //         <p>{error}</p>
  //       </Banner>
  //     </Page>
  //   );
  // }
  <Page title="Order Dashboard">

    {error && (
      <ErrorBanner
        message={error}
        onDismiss={() => setError("")}
      />
    )}

    {/* Rest of your page */}

  </Page>

  // Loading State
  // if (loading) {
  //   return (
  //     <Page title="Order Dashboard">
  //       <Card>
  //         <Box padding="600">
  //           <div style={{ textAlign: "center" }}>
  //             <Spinner
  //               accessibilityLabel="Loading orders"
  //               size="large"
  //             />
  //           </div>
  //         </Box>
  //       </Card>
  //     </Page>
  //   );
  // }
  if (loading) {
    return (
      <Page title="Order Dashboard">
        <OrderTableSkeleton />
      </Page>
    );
  }

  // Empty State
  if (!orders.length) {
    return (
      <Page title="Order Dashboard">
        <Card>
          <EmptyState
            heading="No orders found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>No orders are available for this store.</p>
          </EmptyState>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Order Dashboard">
      <Card>
        <IndexTable
          resourceName={{
            singular: "order",
            plural: "orders",
          }}
          itemCount={orders.length}
          selectable={false}
          headings={[
            { title: "Order Number" },
            { title: "Customer Name" },
            { title: "Total Amount" },
            { title: "Payment Status" },
            { title: "Fulfillment Status" },
            { title: "Order Date" },
          ]}
        >
          {orders.map(({ node }, index) => {
            const customerName = node.customer
              ? `${node.customer.firstName || ""} ${node.customer.lastName || ""
                }`.trim()
              : "Guest";

            const amount =
              node.currentTotalPriceSet?.shopMoney?.amount || "0.00";

            const currency =
              node.currentTotalPriceSet?.shopMoney?.currencyCode || "";

            return (
              <IndexTable.Row id={node.id} key={node.id} position={index}>

                <IndexTable.Cell>
                  <Text variant="bodyMd" fontWeight="semibold">
                    {node.name}
                  </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                  {customerName}
                </IndexTable.Cell>

                <IndexTable.Cell>
                  {currency} {amount}
                </IndexTable.Cell>

                <IndexTable.Cell>
                  <Badge
                    tone={getFinancialTone(
                      node.displayFinancialStatus
                    )}
                  >
                    {node.displayFinancialStatus}
                  </Badge>
                </IndexTable.Cell>

                <IndexTable.Cell>
                  <Badge
                    tone={getFulfillmentTone(
                      node.displayFulfillmentStatus
                    )}
                  >
                    {node.displayFulfillmentStatus || "UNFULFILLED"}
                  </Badge>
                </IndexTable.Cell>

                <IndexTable.Cell>
                  {new Date(node.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </IndexTable.Cell>
              </IndexTable.Row>
            );
          })}
        </IndexTable>
      </Card>
    </Page>
  );
}

export default OrderDashboard;