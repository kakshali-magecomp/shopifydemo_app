import {Badge , Card , Text , BlockStack , InlineStack} from '@shopify/polaris';
import React from 'react';

function BadgeSection()
{
    return(
        <Card>
            <BlockStack gap="400">
                <Text variant='headingMd' as='h2'>
                    Badge Component Section
                </Text>

                <InlineStack gap='300' wrap>
                    <Badge tone="success">Fulfilled</Badge>
                    <Badge tone= "warning">Pending</Badge>
                    <Badge tone="critical">Failed</Badge>
                    <Badge tone="attention">Draft</Badge>
                </InlineStack>
            </BlockStack>
        </Card>
    );
}
export default BadgeSection;