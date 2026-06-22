import { Card, EmptyState, Text, BlockStack } from '@shopify/polaris';
import React from 'react';

function mptyStateSection() {
    return (
        <Card sectioned>
            <BlockStack gap="400">
                <Text variant='headingMd' as="h2">
                    Empty State Section
                </Text>
                <EmptyState heading='Manage your inventory transfers'
                    action={{
                        content: "Add Transfer",
                        onAction: () => alter("Add Transfer Clicked"),
                    }}
                    secondaryAction={{
                        content: "Learn More",
                        url: "https://help.shopify.com",
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                    <Text>
                        Track and receive your incoming inventory from suppliers.
                    </Text>

                </EmptyState>
            </BlockStack>
        </Card>
    );
}
export default mptyStateSection;