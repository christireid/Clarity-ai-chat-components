import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePrevious } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **usePrevious Hook**
 *
 * Hook for getting the previous value of state or prop from the last render.
 * Useful for tracking changes and implementing undo/comparison features.
 *
 * **Key Features:**
 * - Track previous value
 * - Compare current vs previous
 * - Undefined on first render
 * - Automatic updates
 * - Memory efficient
 *
 * **Use Cases:**
 * - Tracking value changes
 * - Comparing current vs previous
 * - Animation triggers
 * - Undo functionality
 * - Debugging state changes
 */
const meta = {
    title: 'Hooks/State/UsePrevious',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`usePrevious\` hook gets the previous value of state or prop from
the last render. Useful for tracking changes and implementing undo/comparison features.

## Features

- ✅ Track previous value
- ✅ Compare current vs previous
- ✅ Undefined on first render
- ✅ Automatic updates
- ✅ Memory efficient
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [count, setCount] = useState(0)
const prevCount = usePrevious(count)

return (
  <div>
    <p>Current: {count}</p>
    <p>Previous: {prevCount}</p>
    {prevCount !== undefined && (
      <p>Changed by: {count - prevCount}</p>
    )}
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
)
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function CounterDemo() {
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Count:" }), " ", count] }), _jsxs("div", { children: [_jsx("strong", { children: "Previous Count:" }), " ", prevCount !== undefined ? prevCount : 'N/A (first render)'] }), prevCount !== undefined && (_jsxs("div", { children: [_jsx("strong", { children: "Change:" }), " ", count - prevCount > 0 ? '+' : '', count - prevCount] }))] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setCount((prev) => prev + 1), children: "Increment" }), _jsx(Button, { onClick: () => setCount((prev) => prev - 1), variant: "outline", children: "Decrement" }), _jsx(Button, { onClick: () => setCount(0), variant: "outline", children: "Reset" })] })] }));
}
export const Counter = {
    render: () => _jsx(CounterDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Tracking previous count value to show changes.',
            },
        },
    },
};
function InputChangeDemo() {
    const [input, setInput] = useState('');
    const prevInput = usePrevious(input);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Input:" }), _jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), className: "w-full p-2 border rounded-lg", placeholder: "Type something..." })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Value:" }), " ", input || '(empty)'] }), _jsxs("div", { children: [_jsx("strong", { children: "Previous Value:" }), " ", prevInput !== undefined ? (prevInput || '(empty)') : 'N/A'] }), prevInput !== undefined && prevInput !== input && (_jsxs("div", { className: "text-green-600 dark:text-green-400", children: ["\u2713 Value changed from \"", prevInput, "\" to \"", input, "\""] }))] }) })] }));
}
export const InputChange = {
    render: () => _jsx(InputChangeDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Tracking previous input value to detect changes.',
            },
        },
    },
};
function UndoDemo() {
    const [value, setValue] = useState('Initial value');
    const prevValue = usePrevious(value);
    const [history, setHistory] = useState([]);
    const updateValue = (newValue) => {
        if (value !== newValue) {
            setHistory((prev) => [...prev, value]);
        }
        setValue(newValue);
    };
    const undo = () => {
        if (prevValue !== undefined) {
            setValue(prevValue);
        }
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Value:" }), _jsx("input", { type: "text", value: value, onChange: (e) => updateValue(e.target.value), className: "w-full p-2 border rounded-lg" })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { onClick: undo, disabled: prevValue === undefined, variant: "outline", children: "Undo (Restore Previous)" }) }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Value:" }), " ", value] }), _jsxs("div", { children: [_jsx("strong", { children: "Previous Value:" }), " ", prevValue !== undefined ? prevValue : 'N/A'] }), history.length > 0 && (_jsxs("div", { className: "mt-2", children: [_jsx("strong", { children: "History:" }), _jsx("div", { className: "mt-1 space-y-1", children: history.slice(-5).reverse().map((item, index) => (_jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: item }, index))) })] }))] }) })] }));
}
export const Undo = {
    render: () => _jsx(UndoDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using previous value for undo functionality.',
            },
        },
    },
};
//# sourceMappingURL=UsePrevious.stories.js.map