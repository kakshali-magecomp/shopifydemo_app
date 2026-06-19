import { Card , Text} from "@shopify/polaris";
import React from 'react';

function CardSection()
{
    return(
        <Card>
            <Text as="h2" variant="bodyMd">
                Content inside a card
            </Text>
        </Card>
    )
}
export default CardSection;