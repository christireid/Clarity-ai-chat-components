import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useClarityObject } from '@clarity-chat/react';
import { Button, Card, CardHeader, CardContent, Badge } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useClarityObject Hook (Structured Output)**
 *
 * Type-safe structured object generation from AI models.
 *
 * **Key Features:**
 * - Generic type support for type-safe object generation
 * - Streaming and non-streaming modes
 * - Automatic JSON parsing from streams
 * - Error handling and loading states
 * - Input management and reset functionality
 * - Callback support (onFinish, onError, onProgress)
 *
 * **Use Cases:**
 * - Product recommendations
 * - Data extraction
 * - Form generation
 * - Structured data generation
 * - API response formatting
 */
const meta = {
    title: 'Hooks/State/UseClarityObject',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useClarityObject\` hook provides type-safe structured object generation
from AI models, supporting both streaming and non-streaming modes.

## Features

- ✅ Generic type support for type-safe object generation
- ✅ Streaming and non-streaming modes
- ✅ Automatic JSON parsing from streams
- ✅ Error handling and loading states
- ✅ Input management and reset functionality
- ✅ Callback support (onFinish, onError, onProgress)

## Example

\`\`\`tsx
interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  initialInput: { query: 'laptops' },
})

await run({ query: 'gaming laptops' })
// object is now Product[] | null
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Mock API endpoint (in real usage, this would be your backend)
const mockApiCall = async (input) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock product data
    return {
        products: [
            {
                name: 'Gaming Laptop Pro',
                price: 1299.99,
                description: 'High-performance gaming laptop with RTX 4070',
            },
            {
                name: 'Ultrabook Elite',
                price: 999.99,
                description: 'Lightweight ultrabook for professionals',
            },
            {
                name: 'Budget Laptop',
                price: 499.99,
                description: 'Affordable laptop for everyday use',
            },
        ],
    };
};
function ProductRecommendations() {
    const [query, setQuery] = useState('gaming laptops');
    const { object, run, isLoading, error, reset } = useClarityObject({
        api: '/api/generate-products',
        initialInput: { query },
        stream: false,
        onFinish: (obj) => {
            console.log('Generated products:', obj);
        },
        onError: (err) => {
            console.error('Error generating products:', err);
        },
    });
    const handleGenerate = async () => {
        // In real usage, this would call your API
        // For demo, we'll simulate it
        try {
            const result = await mockApiCall({ query });
            // In real usage, the hook handles this via the API endpoint
            console.log('Would call API with:', { query });
        }
        catch (err) {
            console.error('Error:', err);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Enter product query", className: "flex-1 px-3 py-2 border rounded" }), _jsx(Button, { onClick: handleGenerate, disabled: isLoading, children: isLoading ? 'Generating...' : 'Generate Products' }), object && (_jsx(Button, { onClick: reset, variant: "outline", children: "Reset" }))] }), error && (_jsx(Card, { className: "border-red-200 bg-red-50", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("p", { className: "text-red-800", children: ["Error: ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("p", { className: "text-gray-600", children: "Generating product recommendations..." }) }) })), object?.products && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Recommended Products" }), object.products.map((product, index) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h4", { className: "font-semibold", children: product.name }), _jsxs(Badge, { variant: "secondary", children: ["$", product.price.toFixed(2)] })] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-600", children: product.description }) })] }, index)))] }))] }));
}
export const BasicUsage = {
    render: () => _jsx(ProductRecommendations, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic usage of useClarityObject for generating structured product recommendations.',
            },
        },
    },
};
function FormGenerator() {
    const { object, run, isLoading, error } = useClarityObject({
        api: '/api/generate-form',
        initialInput: { purpose: 'user registration' },
        stream: false,
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: () => run({ purpose: 'user registration' }), disabled: isLoading, children: isLoading ? 'Generating Form...' : 'Generate Registration Form' }), error && (_jsx(Card, { className: "border-red-200 bg-red-50", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("p", { className: "text-red-800", children: ["Error: ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("p", { className: "text-gray-600", children: "Generating form structure..." }) }) })), object?.fields && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h3", { className: "font-semibold", children: "Generated Form Fields" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: object.fields.map((field, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", children: field.type }), _jsx("span", { className: "font-medium", children: field.label }), field.required && _jsx(Badge, { variant: "destructive", children: "Required" })] }, index))) }) })] }))] }));
}
export const FormGeneration = {
    render: () => _jsx(FormGenerator, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using useClarityObject to generate form structures dynamically.',
            },
        },
    },
};
function StreamingExample() {
    const { object, run, isLoading, error } = useClarityObject({
        api: '/api/stream-list',
        initialInput: { topic: 'AI technologies' },
        stream: true,
        onProgress: (chunk) => {
            console.log('Received chunk:', chunk);
        },
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: () => run({ topic: 'AI technologies' }), disabled: isLoading, children: isLoading ? 'Streaming...' : 'Stream List' }), error && (_jsx(Card, { className: "border-red-200 bg-red-50", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("p", { className: "text-red-800", children: ["Error: ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("p", { className: "text-gray-600", children: "Streaming data..." }) }) })), object?.items && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h3", { className: "font-semibold", children: "Streamed Items" }) }), _jsx(CardContent, { children: _jsx("ul", { className: "list-disc list-inside space-y-1", children: object.items.map((item, index) => (_jsx("li", { children: item }, index))) }) })] }))] }));
}
export const StreamingMode = {
    render: () => _jsx(StreamingExample, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using useClarityObject with streaming mode for real-time updates.',
            },
        },
    },
};
//# sourceMappingURL=UseClarityObject.stories.js.map