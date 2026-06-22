import { Banner } from "@shopify/polaris";

export default function ErrorBanner({ message, onDismiss }) {
  return (
    <Banner
      title="Unable to load orders"
      tone="critical"
      onDismiss={onDismiss}
    >
      <p>{message || "Unable to load orders. Please try again later."}</p>
    </Banner>
  );
}

