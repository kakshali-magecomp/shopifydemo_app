import { Page, BlockStack } from "@shopify/polaris";
import React from 'react';

import ButtonSection from "../components/PolarisShowcase/ButtonSection";
import FormSection from "../components/PolarisShowcase/FormSection";
import CardSection from "../components/PolarisShowcase/CardSection";
import ModalSection from "../components/PolarisShowcase/ModalSection";
import LoadingSection from "../components/PolarisShowcase/LoadingSection";
import EmptyStateSection from "../components/PolarisShowcase/EmptyStateSection";
import ToastSection from "../components/PolarisShowcase/ToastSection";
import BadgeSection from "../components/PolarisShowcase/BadgeSection";

function PolarisShowcase() {
  return (
    <Page title="Polaris Component Showcase">
      <BlockStack gap="500">

        <ButtonSection />

        <FormSection />

        <CardSection />

        <ModalSection />

        <LoadingSection />

        <EmptyStateSection />

        <ToastSection />

        <BadgeSection />

      </BlockStack>
    </Page>
  );
}

export default PolarisShowcase;