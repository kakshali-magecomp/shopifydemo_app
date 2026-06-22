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
import Colorpicker from "../components/PolarisShowcase/Colorpicker";
import AutocompleteSection from "../components/PolarisShowcase/AutocompleteSection";

export default function PolarisShowcase() {
  return (
    <Page title="Polaris Component Showcase">
      <BlockStack gap="500">

        <ButtonSection />

        <AutocompleteSection />

        <FormSection />

        <CardSection />

        <ModalSection />

        <LoadingSection />

        <EmptyStateSection />

        <ToastSection />

        <BadgeSection />

        <Colorpicker />

      </BlockStack>

    </Page>
  );
}

