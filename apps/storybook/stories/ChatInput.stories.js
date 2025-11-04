import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatInput } from '@clarity-chat/react';
import { useState } from 'react';
/**
 * Enhanced ChatInput component with delightful microanimations and state management.
 *
 * **Key Features:**
 * - Smooth expand/contract animation as user types
 * - Character counter with color-coded feedback (blue → yellow → red)
 * - Progress bar showing character limit visually
 * - Glowing focus ring with pulse animation
 * - Send button state transitions (idle → loading → success → error)
 * - Auto-resize textarea up to 6 lines
 * - Error shake animation when over limit
 * - Helpful keyboard hints on focus
 * - Accessible with ARIA labels
 *
 * **Design Philosophy:**
 * - Delightful by Default: Every interaction provides clear feedback
 * - Progressive Disclosure: Advanced features appear contextually
 * - Forgiving UX: Clear warnings before errors, shake on invalid submit
 * - Accessible First: Keyboard shortcuts, screen reader support
 */
const meta = {
    title: 'Components/ChatInput',
    component: ChatInput,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A delightful chat input component with smooth animations, character counting, and comprehensive state management.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        maxLength: {
            control: { type: 'number', min: 10, max: 2000, step: 10 },
            description: 'Maximum character length',
        },
        showCharCounter: {
            control: 'boolean',
            description: 'Show character counter and progress bar',
        },
        warningThreshold: {
            control: { type: 'number', min: 0, max: 1, step: 0.05 },
            description: 'Warning threshold (0-1) for character counter color change',
        },
        animateHeight: {
            control: 'boolean',
            description: 'Enable smooth height animation',
        },
        glowOnFocus: {
            control: 'boolean',
            description: 'Enable focus ring glow animation',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable input',
        },
    },
};
export default meta;
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsx("div", { className: "max-w-2xl", children: _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                    console.log('Submitted:', val);
                    setValue('');
                } }) }));
    },
};
export const WithCharacterLimit = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    }, maxLength: 200 }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Try typing to see the character counter and progress bar" })] }));
    },
};
export const CustomPlaceholder = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsx("div", { className: "max-w-2xl", children: _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                    console.log('Submitted:', val);
                    setValue('');
                }, placeholder: "Ask me anything..." }) }));
    },
};
// ============================================================================
// Character Counter Variations
// ============================================================================
export const CharacterCounterStates = {
    render: () => {
        const [value1, setValue1] = useState('This is a short message');
        const [value2, setValue2] = useState('This message is getting close to the limit and will show warning colors soon');
        const [value3, setValue3] = useState('This message is way too long and exceeds the maximum character limit! You cannot send this message until you shorten it.');
        return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Normal (Blue)" }), _jsx(ChatInput, { value: value1, onChange: setValue1, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue1('');
                            }, maxLength: 100 })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Warning (Yellow) - 80% of limit" }), _jsx(ChatInput, { value: value2, onChange: setValue2, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue2('');
                            }, maxLength: 100 })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Error (Red) - Over limit" }), _jsx(ChatInput, { value: value3, onChange: setValue3, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue3('');
                            }, maxLength: 100 }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Try pressing Enter to see the shake animation" })] })] }));
    },
};
export const CustomWarningThreshold = {
    render: () => {
        const [value, setValue] = useState('Testing custom warning threshold');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    }, maxLength: 100, warningThreshold: 0.5 }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Warning shows at 50% (50 characters) instead of 80%" })] }));
    },
};
export const NoCharacterCounter = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    }, maxLength: 200, showCharCounter: false }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Character limit enforced but counter hidden" })] }));
    },
};
// ============================================================================
// Send Button States
// ============================================================================
export const SendButtonStates = {
    render: () => {
        const [value, setValue] = useState('Test message');
        const [delay, setDelay] = useState(2000);
        const [shouldFail, setShouldFail] = useState(false);
        const handleSubmit = async (val) => {
            console.log('Submitting:', val);
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (shouldFail) {
                        reject(new Error('Simulated error'));
                    }
                    else {
                        resolve(val);
                    }
                }, delay);
            });
            if (!shouldFail) {
                setValue('');
            }
        };
        return (_jsxs("div", { className: "flex flex-col gap-4 max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: handleSubmit }), _jsxs("div", { className: "flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Delay (ms)" }), _jsx("input", { type: "range", min: "500", max: "5000", step: "500", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-32" }), _jsxs("span", { className: "text-xs text-gray-600", children: [delay, "ms"] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("label", { className: "text-sm", children: [_jsx("input", { type: "checkbox", checked: shouldFail, onChange: (e) => setShouldFail(e.target.checked), className: "mr-2" }), "Simulate error"] }) })] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Watch the send button transition through states: idle \u2192 loading \u2192 ", shouldFail ? 'error' : 'success'] })] }));
    },
};
// ============================================================================
// Focus & Animation Features
// ============================================================================
export const FocusGlowAnimation = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "With focus glow (default)" }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue('');
                            }, glowOnFocus: true }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Click inside to see the glowing focus ring animation" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Without focus glow" }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue('');
                            }, glowOnFocus: false })] })] }));
    },
};
export const HeightAnimation = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "With height animation (default)" }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue('');
                            }, animateHeight: true }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Type multiple lines (Shift + Enter) to see smooth expansion" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Without height animation" }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                                console.log('Submitted:', val);
                                setValue('');
                            }, animateHeight: false })] })] }));
    },
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const ChatConversation = {
    render: () => {
        const [value, setValue] = useState('');
        const [messages, setMessages] = useState([
            { id: 1, text: 'Hello! How can I help you today?', isUser: false },
            { id: 2, text: 'I have a question about your product', isUser: true },
        ]);
        const handleSubmit = async (val) => {
            // Add user message
            const userMsg = { id: Date.now(), text: val, isUser: true };
            setMessages((prev) => [...prev, userMsg]);
            setValue('');
            // Simulate AI response
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const aiMsg = {
                id: Date.now() + 1,
                text: `You said: "${val}". This is a simulated response.`,
                isUser: false,
            };
            setMessages((prev) => [...prev, aiMsg]);
        };
        return (_jsxs("div", { className: "flex flex-col h-[500px] border rounded-lg max-w-2xl", children: [_jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: messages.map((msg) => (_jsx("div", { className: `flex ${msg.isUser ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.isUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: msg.text }) }, msg.id))) }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: handleSubmit, maxLength: 500 })] }));
    },
};
export const SupportTicket = {
    render: () => {
        const [value, setValue] = useState('');
        const [submitted, setSubmitted] = useState(false);
        const handleSubmit = async (val) => {
            console.log('Ticket submitted:', val);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setValue('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        };
        return (_jsxs("div", { className: "flex flex-col gap-4 max-w-2xl p-6 border rounded-lg", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Submit a Support Ticket" }), _jsx("p", { className: "text-sm text-gray-600", children: "Describe your issue in detail. We'll get back to you within 24 hours." }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: handleSubmit, placeholder: "Describe your issue...", maxLength: 1000 }), submitted && (_jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200", children: "\u2713 Your ticket has been submitted successfully!" }))] }));
    },
};
export const CommentSystem = {
    render: () => {
        const [value, setValue] = useState('');
        const [comments, setComments] = useState([
            { id: 1, author: 'Alice', text: 'Great article!', time: '2h ago' },
            { id: 2, author: 'Bob', text: 'Very informative, thanks for sharing.', time: '1h ago' },
        ]);
        const handleSubmit = async (val) => {
            const newComment = {
                id: Date.now(),
                author: 'You',
                text: val,
                time: 'Just now',
            };
            setComments((prev) => [...prev, newComment]);
            setValue('');
        };
        return (_jsxs("div", { className: "flex flex-col gap-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "font-semibold", children: ["Comments (", comments.length, ")"] }), comments.map((comment) => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: comment.author }), _jsx("p", { className: "text-xs text-gray-600", children: comment.time })] })] }), _jsx("p", { className: "text-sm", children: comment.text })] }, comment.id)))] }), _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: handleSubmit, placeholder: "Add a comment...", maxLength: 500 })] }));
    },
};
// ============================================================================
// Edge Cases & States
// ============================================================================
export const Disabled = {
    render: () => {
        const [value, setValue] = useState('This input is disabled');
        return (_jsx("div", { className: "max-w-2xl", children: _jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => console.log('Submitted:', val), disabled: true }) }));
    },
};
export const LongContent = {
    render: () => {
        const [value, setValue] = useState('This is a very long message that spans multiple lines.\n\nIt demonstrates how the textarea automatically expands as you type more content.\n\nThe component handles this gracefully with smooth animations.\n\nYou can add even more lines (up to 6) and it will keep expanding!');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    } }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "The textarea auto-expands up to 6 lines, then becomes scrollable" })] }));
    },
};
export const VeryShortLimit = {
    render: () => {
        const [value, setValue] = useState('Hi!');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    }, maxLength: 50, warningThreshold: 0.6 }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Short limit (50 chars) demonstrates quick color transitions" })] }));
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "flex flex-col gap-4 max-w-2xl", children: [_jsx(ChatInput, { value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    }, maxLength: 200 }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Keyboard shortcuts visible on focus" }), _jsx("li", { children: "Send button has descriptive ARIA labels for all states" }), _jsx("li", { children: "Character counter is announced to screen readers" }), _jsx("li", { children: "Error messages clearly visible and announced" }), _jsx("li", { children: "Focus ring clearly visible for keyboard navigation" }), _jsx("li", { children: "Color-independent feedback (progress bar + text)" }), _jsx("li", { children: "Shake animation provides tactile feedback" })] })] })] }));
    },
};
// ============================================================================
// Playground
// ============================================================================
export const Playground = {
    args: {
        placeholder: 'Type a message...',
        maxLength: 200,
        showCharCounter: true,
        warningThreshold: 0.8,
        animateHeight: true,
        glowOnFocus: true,
        disabled: false,
    },
    render: (args) => {
        const [value, setValue] = useState('');
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx(ChatInput, { ...args, value: value, onChange: setValue, onSubmit: (val) => {
                        console.log('Submitted:', val);
                        setValue('');
                    } }), _jsx("p", { className: "mt-4 text-sm text-gray-600", children: "Adjust the controls to experiment with different settings" })] }));
    },
};
//# sourceMappingURL=ChatInput.stories.js.map