import { Card , Text , BlockStack} from "@shopify/polaris";
import React from 'react';


function CardSection()
{
    return(
        <Card>
            <Text variant="headingMd" as='h2'>
                Card Section
            </Text>

            <Text as='p' variant="bodyMd">
                Content inside a card . This  is a sample card Component for the polarise 
                showcase page.
            </Text>
        </Card>
    )
}
export default CardSection;