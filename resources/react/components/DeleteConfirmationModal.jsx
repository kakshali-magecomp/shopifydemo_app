import React from "react";
import { Modal, Text } from "@shopify/polaris";

 export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  loading,
  productTitle,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Product"
      primaryAction={{
        content: "Delete",
        tone: "critical",
        loading,
        onAction: onConfirm,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <Text as="p" variant="bodyMd">
          Are you sure you want to delete{" "}
          <strong>{productTitle}</strong>?
        </Text>

        <Text as="p" variant="bodyMd">
          This action cannot be undone.
        </Text>
      </Modal.Section>
    </Modal>
  );
}

