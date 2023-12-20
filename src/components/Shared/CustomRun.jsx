import React from 'react';
import {
    SandpackCodeEditor,
    SandpackPreview,
    SandpackProvider,
    SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import Split from 'react-split';

function ReactIde({ problemType, files, theme }) {
    return (
        <SandpackProvider
            template={'vanilla'}
            startRoute='/'
            autorun={true}
        >
            <SandpackThemeProvider theme={theme === 'vs-light' ? 'light' : 'dark'} fontSize='large'>
                <Split
                    className='split2 h-screen -z-10 custom-tab bg-white'
                    direction='vertical'
                    minSize={10}
                    gutterSize={5}
                >
                    <SandpackCodeEditor
                        showTabs
                        showLineNumbers={false}
                        showInlineErrors
                        showRunButton
                    />
                    <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton={false} />
                </Split>
            </SandpackThemeProvider>
        </SandpackProvider>
    );
}

export default ReactIde;