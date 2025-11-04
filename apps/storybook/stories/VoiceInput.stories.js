import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VoiceInput, InlineVoiceInput } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Phase 4/Voice Input',
    component: VoiceInput,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Voice input component with Web Speech API support. Enables voice-to-text functionality with real-time transcription.',
            },
        },
    },
};
export default meta;
export const Default = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
            alert(`You said: ${transcript}`);
        },
    },
};
export const WithInterimResults = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        showInterim: true,
        autoSubmit: true,
    },
};
export const ManualSubmit = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
            alert(`Submitted: ${transcript}`);
        },
        showInterim: true,
        autoSubmit: false,
    },
};
export const SmallSize = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        size: 'sm',
    },
};
export const LargeSize = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        size: 'lg',
    },
};
export const PrimaryVariant = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        variant: 'primary',
        size: 'lg',
    },
};
export const SecondaryVariant = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        variant: 'secondary',
        size: 'lg',
    },
};
export const SpanishLanguage = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript (es-ES):', transcript);
            alert(`Dijiste: ${transcript}`);
        },
        lang: 'es-ES',
        tooltipText: 'Haz clic para hablar',
    },
};
export const WithCallbacks = {
    args: {
        onTranscript: (transcript) => {
            console.log('Transcript:', transcript);
        },
        onStart: () => {
            console.log('Started listening');
        },
        onStop: () => {
            console.log('Stopped listening');
        },
        onError: (error) => {
            console.error('Voice error:', error);
        },
    },
};
export const InlineExample = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: value, onChange: (e) => setValue(e.target.value), placeholder: "Type or speak...", className: "w-full pr-12 px-4 py-2 border border-gray-300 rounded-lg" }), _jsx(InlineVoiceInput, { value: value, onChange: setValue, position: "inside" })] }), _jsxs("div", { className: "p-4 bg-gray-100 rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Current Value:" }), _jsx("p", { children: value || '(empty)' })] })] }));
    },
};
export const ChatIntegrationExample = {
    render: () => {
        const [messages, setMessages] = useState([]);
        const [input, setInput] = useState('');
        const handleSend = () => {
            if (input.trim()) {
                setMessages([...messages, input]);
                setInput('');
            }
        };
        return (_jsxs("div", { className: "max-w-md space-y-4", children: [_jsx("div", { className: "h-64 border border-gray-300 rounded-lg p-4 overflow-y-auto space-y-2", children: messages.map((msg, i) => (_jsx("div", { className: "p-2 bg-blue-100 rounded", children: msg }, i))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Type or speak your message...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg" }), _jsx(VoiceInput, { onTranscript: (transcript) => {
                                setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
                            }, size: "lg", variant: "primary" }), _jsx("button", { onClick: handleSend, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Send" })] })] }));
    },
};
//# sourceMappingURL=VoiceInput.stories.js.map