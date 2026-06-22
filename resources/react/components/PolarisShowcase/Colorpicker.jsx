import { ColorPicker , Card , Text , BlockStack , Box} from "@shopify/polaris";
import React,{useState} from 'react';

export default function Colorpicker()
{
    const [color , setColor] = useState({
        hue:300,
        brightness:1,
        saturation:0.7,
        alpha:0.7,
    });

    return(
        <Card>
            <BlockStack gap='400'>
                <Text variant="headingMd" as='h2'>
                    Color picker Section 
                </Text>

                <Box padding='400'>
                    <ColorPicker
                    color={color}
                    onChange={setColor}
                    allowAlpha />
                </Box>
            </BlockStack>
        </Card>
    );
}
