import React, { useState } from "react";
import {
  Card,
  Text,
  Button,
  Modal,
  TextField,
  BlockStack,
  InlineStack,
  Banner,
} from "@shopify/polaris";

export default function ModalSection() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleFormSubmit = () => {
    setSubmittedName(name);
    setFormModalOpen(false);
    setName("");
  };

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">
            Modal Components Section
          </Text>

          <InlineStack gap="300">
            <Button
              variant="primary"
              onClick={() => setBasicModalOpen(true)}
            >
              Open Basic Modal
            </Button>

            <Button
              onClick={() => setConfirmModalOpen(true)}
            >
              Open Confirmation Modal
            </Button>

            <Button
              onClick={() => setFormModalOpen(true)}
            >
              Open Form Modal
            </Button>
          </InlineStack>

          {submittedName && (
            <Banner title="Form Submitted" tone="success">
              <p>Name: {submittedName}</p>
            </Banner>
          )}
        </BlockStack>
      </Card>

      {/* Basic Modal */}
      <Modal
        open={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Basic Modal"
        primaryAction={{
          content: "Close",
          onAction: () => setBasicModalOpen(false),
        }}
      >
        <Modal.Section>
          <Text>
            This is a basic Polaris Modal example.
          </Text>
        </Modal.Section>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirmation Modal"
        primaryAction={{
          content: "Confirm",
          onAction: () => {
            alert("Confirmed!");
            setConfirmModalOpen(false);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setConfirmModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text>
            Are you sure you want to perform this action?
          </Text>
        </Modal.Section>
      </Modal>

      {/* Form Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Form Modal"
        primaryAction={{
          content: "Submit",
          onAction: handleFormSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setFormModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <TextField
              label="Full Name"
              value={name}
              onChange={setName}
              autoComplete="off"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}

