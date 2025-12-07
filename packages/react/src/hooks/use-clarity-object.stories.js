import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useClarityObject } from './use-clarity-object';
import { Button, Card, CardContent, CardHeader, Input, Badge } from '@clarity-chat/primitives';
const meta = {
    title: 'Hooks/useClarityObject',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Hook for generating structured objects from AI models with type safety.

## Features
- Generic type support \`<T>\`
- Streaming and non-streaming modes
- Automatic JSON parsing
- Type-safe object generation
- Progress callbacks
- Error handling

## Usage

\`\`\`tsx
interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product>({
  api: '/api/generate-object',
  initialInput: { query: 'laptops' },
})

await run({ query: 'gaming laptops' })
\`\`\`
        `
            }
        }
    }
};
export default meta;
// Mock API handler for Storybook
const mockAPI = async (input) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (input.query === 'error') {
        throw new Error('API Error: Failed to generate object');
    }
    // Return mock structured data based on input
    if (input.type === 'product') {
        return {
            products: [
                {
                    name: 'Gaming Laptop Pro',
                    price: 1299.99,
                    description: 'High-performance gaming laptop with RTX 4070',
                    inStock: true,
                    rating: 4.5
                },
                {
                    name: 'Ultrabook Air',
                    price: 999.99,
                    description: 'Lightweight ultrabook for professionals',
                    inStock: true,
                    rating: 4.8
                }
            ]
        };
    }
    if (input.type === 'weather') {
        return {
            location: input.location || 'San Francisco',
            temperature: 72,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 10,
            forecast: [
                { day: 'Today', high: 72, low: 58, condition: 'Sunny' },
                { day: 'Tomorrow', high: 70, low: 56, condition: 'Partly Cloudy' },
                { day: 'Wednesday', high: 68, low: 54, condition: 'Cloudy' }
            ]
        };
    }
    return {
        message: `Generated object for: ${JSON.stringify(input)}`,
        timestamp: new Date().toISOString()
    };
};
export const BasicUsage = {
    render: () => {
        const [query, setQuery] = useState('gaming laptops');
        const { object, run, isLoading, error, reset } = useClarityObject({
            api: '/api/products',
            initialInput: { query, type: 'product' },
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                const result = await mockAPI(body);
                return new Response(JSON.stringify(result), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Product Recommendations" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Generate structured product recommendations from a query" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Enter product query...", className: "flex-1" }), _jsx(Button, { onClick: () => run({ query, type: 'product' }), disabled: isLoading, children: isLoading ? 'Generating...' : 'Generate' }), object && (_jsx(Button, { variant: "outline", onClick: reset, children: "Reset" }))] }), error && (_jsx(Card, { className: "border-destructive", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-destructive", children: ["Error: ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "text-muted-foreground", children: "Generating recommendations..." }) }) })), object && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h4", { className: "font-semibold", children: "Generated Products" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: object.products.map((product, idx) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h5", { className: "font-semibold", children: product.name }), _jsx(Badge, { variant: product.inStock ? 'default' : 'secondary', children: product.inStock ? 'In Stock' : 'Out of Stock' })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: product.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-lg font-bold", children: ["$", product.price] }), _jsxs("span", { className: "text-sm", children: ["Rating: ", product.rating, " \u2B50"] })] })] }, idx))) }) })] }))] }));
    }
};
export const WeatherObject = {
    render: () => {
        const [location, setLocation] = useState('San Francisco');
        const { object, run, isLoading, error } = useClarityObject({
            api: '/api/weather',
            initialInput: { location, type: 'weather' },
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                const result = await mockAPI(body);
                return new Response(JSON.stringify(result), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Weather Forecast" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Generate structured weather data" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Enter location...", className: "flex-1" }), _jsx(Button, { onClick: () => run({ location, type: 'weather' }), disabled: isLoading, children: isLoading ? 'Loading...' : 'Get Weather' })] }), error && (_jsx(Card, { className: "border-destructive", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-destructive", children: ["Error: ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "text-muted-foreground", children: "Fetching weather data..." }) }) })), object && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("h4", { className: "font-semibold", children: ["Weather in ", object.location] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-3xl font-bold", children: [object.temperature, "\u00B0F"] }), _jsxs("div", { className: "text-muted-foreground", children: ["Condition: ", object.condition, " | Humidity: ", object.humidity, "% | Wind: ", object.windSpeed, " mph"] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("h5", { className: "font-semibold mb-2", children: "Forecast" }), _jsx("div", { className: "space-y-2", children: object.forecast.map((day, idx) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: day.day }), _jsxs("span", { className: "text-muted-foreground", children: [day.high, "\u00B0 / ", day.low, "\u00B0 - ", day.condition] })] }, idx))) })] })] }) })] }))] }));
    }
};
export const ErrorHandling = {
    render: () => {
        const { object, run, isLoading, error, reset } = useClarityObject({
            api: '/api/error',
            initialInput: { query: 'error', type: 'test' },
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                try {
                    const result = await mockAPI(body);
                    return new Response(JSON.stringify(result), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                catch (err) {
                    return new Response(JSON.stringify({ error: err.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Error Handling" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Demonstrates error handling in useClarityObject" })] }), _jsx(Button, { onClick: () => run({ query: 'error', type: 'test' }), disabled: isLoading, variant: "destructive", children: isLoading ? 'Loading...' : 'Trigger Error' }), error && (_jsxs(Card, { className: "border-destructive", children: [_jsx(CardHeader, { children: _jsx("h4", { className: "font-semibold text-destructive", children: "Error" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-destructive", children: error.message }), _jsx(Button, { variant: "outline", onClick: reset, className: "mt-4", children: "Reset" })] })] })), object && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("pre", { className: "text-xs overflow-auto", children: JSON.stringify(object, null, 2) }) }) }))] }));
    }
};
//# sourceMappingURL=use-clarity-object.stories.js.map