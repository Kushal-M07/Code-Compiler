import { useSandpack } from '@codesandbox/sandpack-react/hooks'
import React from 'react'

const MsgListener = () => {
    const { sandpack } = useSandpack();

    // Methods 
    const sender = () => {
        Object.values(sandpack.clients).forEach((client) => {
            client.iframe.contentWindow.postMessage("Hello world", "*");
        });
    };
    return <button onClick={sender}>Send message</button>;

}

export default MsgListener