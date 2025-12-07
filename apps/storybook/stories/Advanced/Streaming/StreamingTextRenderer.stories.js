import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { StreamingTextRenderer } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Advanced/Streaming/StreamingTextRenderer',
    component: StreamingTextRenderer,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};
export default meta;
const InteractiveWrapper = (args) => {
    const [text, setText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const fullText = args.text || 'This is a streaming text example that demonstrates progressive character-by-character display with smooth animation and cursor feedback.';
    const handleStart = () => {
        setText('');
        setIsStreaming(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText(fullText.slice(0, index + 1));
                index++;
            }
            else {
                clearInterval(interval);
                setIsStreaming(false);
            }
        }, args.typingSpeed || 30);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: handleStart, children: "Start Streaming" }), _jsx("div", { className: "p-4 border rounded-lg min-h-[100px]", children: _jsx(StreamingTextRenderer, { ...args, text: text, isStreaming: isStreaming }) })] }));
};
export const CharacterByCharacter = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'character',
        typingSpeed: 30,
        showCursor: true,
    },
};
export const ChunkBased = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'chunk',
        typingSpeed: 50,
        chunkSize: 5,
        showCursor: true,
    },
};
export const FastTyping = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'character',
        typingSpeed: 10,
        showCursor: true,
    },
};
export const SlowTyping = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'character',
        typingSpeed: 100,
        showCursor: true,
    },
};
export const WithoutCursor = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'character',
        typingSpeed: 30,
        showCursor: false,
    },
};
export const CustomCursor = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'character',
        typingSpeed: 30,
        showCursor: true,
        cursorChar: '|',
    },
};
export const InstantDisplay = {
    render: InteractiveWrapper,
    args: {
        displayMode: 'instant',
        showCursor: false,
    },
};
//# sourceMappingURL=StreamingTextRenderer.stories.js.map