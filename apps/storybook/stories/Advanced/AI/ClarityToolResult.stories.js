import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react';
import { Card, CardHeader, CardContent, Badge } from '@clarity-chat/primitives';
/**
 * **ClarityToolResult Component (Tool UI Registry)**
 *
 * Automatic rendering of tool results with custom components.
 *
 * **Key Features:**
 * - Type-safe component mapping
 * - Automatic tool result rendering
 * - Fallback rendering for unregistered tools
 * - Message context integration
 * - Customizable props and styling
 *
 * **Use Cases:**
 * - Weather displays
 * - Search results
 * - Data visualizations
 * - Custom tool outputs
 * - Generative UI patterns
 */
const meta = {
    title: 'Advanced/AI/ClarityToolResult',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`ClarityToolResult\` component automatically renders tool results using
registered UI components, enabling generative UI patterns.

## Features

- ✅ Type-safe component mapping
- ✅ Automatic tool result rendering
- ✅ Fallback rendering for unregistered tools
- ✅ Message context integration
- ✅ Customizable props and styling

## Example

\`\`\`tsx
// Define tool UI components
const WeatherResult = ({ data }) => (
  <Card>
    <CardHeader>Weather in {data.location}</CardHeader>
    <CardContent>{data.temperature}°C</CardContent>
  </Card>
)

// Create registry
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Render tool results
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Weather Tool Component
function WeatherResult({ data }) {
    return (_jsxs(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "font-semibold text-lg", children: ["Weather in ", data.location] }), _jsx(Badge, { variant: "secondary", children: data.condition })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-3xl font-bold", children: [data.temperature, "\u00B0C"] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Humidity: ", data.humidity, "%"] })] }) })] }));
}
// Search Tool Component
function SearchResult({ data }) {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("h3", { className: "font-semibold", children: ["Search Results for \"", data.query, "\""] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: data.results.map((result, index) => (_jsxs("div", { className: "border-b pb-3 last:border-0", children: [_jsx("a", { href: result.url, className: "text-blue-600 hover:underline font-medium", children: result.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: result.snippet })] }, index))) }) })] }));
}
// Calculator Tool Component
function CalculatorResult({ data }) {
    return (_jsxs(Card, { className: "bg-green-50", children: [_jsx(CardHeader, { children: _jsx("h3", { className: "font-semibold", children: "Calculation Result" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Expression: ", data.expression] }), _jsxs("div", { className: "text-2xl font-bold text-green-700", children: ["= ", data.result] })] }) })] }));
}
// Create tool registry
const toolRegistry = createToolUIRegistry({
    get_weather: WeatherResult,
    search: SearchResult,
    calculator: CalculatorResult,
});
const mockMessages = [
    { role: 'user', content: 'What is the weather in San Francisco?' },
    { role: 'assistant', content: 'Let me check the weather for you.' },
];
export const WeatherTool = {
    render: () => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
            name: 'get_weather',
            args: { location: 'San Francisco' },
            id: 'weather-1',
        }, result: {
            location: 'San Francisco',
            temperature: 18,
            condition: 'Partly Cloudy',
            humidity: 65,
        }, messages: mockMessages })),
    parameters: {
        docs: {
            description: {
                story: 'Rendering weather tool results with a custom WeatherResult component.',
            },
        },
    },
};
export const SearchTool = {
    render: () => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
            name: 'search',
            args: { query: 'React hooks' },
            id: 'search-1',
        }, result: {
            query: 'React hooks',
            results: [
                {
                    title: 'Advanced/AI/ClarityToolResult',
                    url: 'https://react.dev/reference/react',
                    snippet: 'Hooks let you use state and other React features without writing a class.',
                },
                {
                    title: 'Advanced/AI/ClarityToolResult',
                    url: 'https://react.dev/reference/react/useState',
                    snippet: 'useState is a React Hook that lets you add a state variable to your component.',
                },
            ],
        }, messages: mockMessages })),
    parameters: {
        docs: {
            description: {
                story: 'Rendering search tool results with a custom SearchResult component.',
            },
        },
    },
};
export const CalculatorTool = {
    render: () => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
            name: 'calculator',
            args: { expression: '15 * 23' },
            id: 'calc-1',
        }, result: {
            expression: '15 * 23',
            result: 345,
        }, messages: mockMessages })),
    parameters: {
        docs: {
            description: {
                story: 'Rendering calculator tool results with a custom CalculatorResult component.',
            },
        },
    },
};
export const UnregisteredTool = {
    render: () => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
            name: 'unknown_tool',
            args: { data: 'some data' },
            id: 'unknown-1',
        }, result: { data: 'some result data' }, messages: mockMessages })),
    parameters: {
        docs: {
            description: {
                story: 'Fallback rendering for unregistered tools using the default component.',
            },
        },
    },
};
export const CustomFallback = {
    render: () => {
        const CustomFallback = ({ toolCall, result }) => (_jsx(Card, { className: "border-yellow-200 bg-yellow-50", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("p", { className: "text-yellow-800", children: ["Custom fallback for tool: ", _jsx("strong", { children: toolCall.name })] }), _jsx("pre", { className: "mt-2 text-xs bg-yellow-100 p-2 rounded", children: JSON.stringify(result, null, 2) })] }) }));
        return (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
                name: 'custom_tool',
                args: { custom: 'data' },
                id: 'custom-1',
            }, result: { custom: 'result data' }, messages: mockMessages, fallback: CustomFallback }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Using a custom fallback component for unregistered tools.',
            },
        },
    },
};
export const WithHeader = {
    render: () => (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
            name: 'get_weather',
            args: { location: 'New York' },
            id: 'weather-2',
        }, result: {
            location: 'New York',
            temperature: 22,
            condition: 'Sunny',
            humidity: 55,
        }, messages: mockMessages, showHeader: true })),
    parameters: {
        docs: {
            description: {
                story: 'Rendering tool result with a header showing tool name and call ID.',
            },
        },
    },
};
export const MultipleTools = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
                    name: 'get_weather',
                    args: { location: 'London' },
                    id: 'weather-3',
                }, result: {
                    location: 'London',
                    temperature: 12,
                    condition: 'Rainy',
                    humidity: 80,
                }, messages: mockMessages }), _jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
                    name: 'calculator',
                    args: { expression: '100 / 4' },
                    id: 'calc-2',
                }, result: {
                    expression: '100 / 4',
                    result: 25,
                }, messages: mockMessages }), _jsx(ClarityToolResult, { registry: toolRegistry, toolCall: {
                    name: 'search',
                    args: { query: 'TypeScript' },
                    id: 'search-2',
                }, result: {
                    query: 'TypeScript',
                    results: [
                        {
                            title: 'Advanced/AI/ClarityToolResult',
                            url: 'https://www.typescriptlang.org/docs/',
                            snippet: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
                        },
                    ],
                }, messages: mockMessages })] })),
    parameters: {
        docs: {
            description: {
                story: 'Rendering multiple tool results in sequence.',
            },
        },
    },
};
//# sourceMappingURL=ClarityToolResult.stories.js.map