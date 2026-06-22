import React from "react";
import {
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  Box,
} from "@shopify/polaris";

export default function OrderTableSkeleton() {
  return (
    <Card>
      <Box padding="400">
        <SkeletonDisplayText size="small" />

        <div style={{ marginTop: "20px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} paddingBlockEnd="300">
              <SkeletonBodyText lines={1} />
            </Box>
          ))}
        </div>
      </Box>
    </Card>
  );
}

