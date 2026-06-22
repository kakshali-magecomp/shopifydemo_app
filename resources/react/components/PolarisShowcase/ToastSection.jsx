import { useState, useCallback } from 'react';
import React from 'react';
import {
    Card,
    Button,
    Toast,
    Frame,
    Text,
    BlockStack,
    InlineStack,
} from '@shopify/polaris';

function ToastSection() {
    const [successActive, setSuccessActive] = useState(false);
    const [errorActive, setErrorActive] = useState(false);

    const toggleSuccess = useCallback(
        () => setSuccessActive((active) => !active),
        []
    );

    const toggleError = useCallback(
        () => setErrorActive((active) => !active),
        []
    );

    const successToast = successActive ? (
        <Toast
            content='Operation complete successfully!'
            onDismiss={toggleSuccess}
        />
    ) : null;

    const errorToast = errorActive ? (
        <Toast
            content='Something wants wrong!'
            errro
            onDismiss={toggleError}
        />
    ) : null;

    return (
        <div style={{ height: "250px" }}>
            <Frame>
                {successToast}
                {errorToast}

                <Card>
                    <BlockStack gap='400'>
                        <Text variant='headingMd' as='h2'>
                            Toast Notifiation Section
                        </Text>

                        <InlineStack gap='300'>
                            <Button
                                variant='primary'
                                onClick={toggleSuccess}
                            >
                                Show Success Toast
                            </Button>

                            <Button
                                variant='critical'
                                onClick={toggleError}
                            >
                                Show Error Toast
                            </Button>

                        </InlineStack>
                    </BlockStack>
                </Card>
            </Frame>
        </div>

    )

}
export default ToastSection;