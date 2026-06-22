import {
    Card,
    Button,
    Spinner,
    SkeletonPage,
    SkeletonBodyText,
    SkeletonDisplayText,
    Text,
    BlockStack,
    Box
}
    from '@shopify/polaris';
import React, { useState } from 'react';

function LoadingSection() {
    const [loading, setLoading] = useState(false);
    return (
        <card>
            <BlockStack gap="400">

                <Text variant='headingMd' as="h2">
                    Loading Components Section
                </Text>

                <Button variant='primary'
                    onClick={() => setLoading(!loading)}
                >
                    {loading ? "Hide Loading State" : "Show Loading State"}
                </Button>

                {loading ? (
                    <>
                        {/* sppiner */}
                        <Box padding='400'>
                            <Spinner
                                accessibilityLabel='Loading Content'
                                size='large'
                            />
                        </Box>
                        {/* Skeleton Display Text */}
                        <SkeletonDisplayText size='medium' />

                        {/* Skeleton Body Text */}
                        <SkeletonBodyText lines={3} />

                        {/* SkeletonPage */}
                        <SkeletonPage
                            primaryAction
                            title='Loading Dashboard'>

                            <Card>
                                <Box padding='400'>
                                    <SkeletonDisplayText size='small' />
                                    <Box paddingBlockStart='300'>
                                        <SkeletonBodyText lines={5} />
                                    </Box>
                                </Box>
                            </Card>
                        </SkeletonPage>
                    </>
                ) : (
                    <Text tone="subdued">
                        Click the button to dispaly loading component.
                    </Text>
                )}
            </BlockStack>
        </card>
    );
}
export default LoadingSection;