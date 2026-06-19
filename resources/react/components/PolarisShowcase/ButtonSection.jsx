import React, { useState } from "react";
import {
  Card,
  BlockStack,
  InlineStack,
  Button,
  Text,
} from "@shopify/polaris";

function ButtonSection() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = (buttonType) => {
    setMessage(`${buttonType} button clicked`);
  };

  const handleLoadingButton = () => {
    setLoading(true);
    setMessage("Loading button clicked");

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Buttons Section
        </Text>

        <InlineStack gap="300" wrap>
          {/* Primary Button */}
          <Button
            variant="primary"
            onClick={() => handleClick("Primary")}
          >
            Primary Button
          </Button>

          {/* Secondary Button */}
          <Button
            onClick={() => handleClick("Secondary")}
          >
            Secondary Button
          </Button>

          {/* Destructive Button */}
          <Button
            tone="critical"
            onClick={() => handleClick("Destructive")}
          >
            Destructive Button
          </Button>

          {/* Plain Button */}
          <Button
            variant="plain"
            onClick={() => handleClick("Plain")}
          >
            Plain Button
          </Button>

          {/* Loading Button */}
          <Button
            loading={loading}
            onClick={handleLoadingButton}
          >
            Loading Button
          </Button>

          {/* Disabled Button */}
          <Button disabled>
            Disabled Button
          </Button>
        </InlineStack>

        {message && (
          <Text variant="bodyMd" tone="subdued">
            {message}
          </Text>
        )}
      </BlockStack>
    </Card>
  );
}

export default ButtonSection;