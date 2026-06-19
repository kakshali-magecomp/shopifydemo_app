import {Toast, Frame, Page, Button} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import React from 'react';
 
function ToastSection()
{
    const[active,setActive] = useState(false);
    const ToggleActive = useCallback(() => setActive((active) => !active),[]);
    const toastMarkup = active ?(
        <Tost content = "Message sent" onDismiss={ToggleActive} /> 
    ):null;

    return(
        <div style={{height : '250px'}}>
            <Frame>
                <Page title="Toast example">
                    <Button onClick={ToggleActive}>Show Toast</Button>
                </Page>
            </Frame>
        </div>
    );

}
export default ToastSection;