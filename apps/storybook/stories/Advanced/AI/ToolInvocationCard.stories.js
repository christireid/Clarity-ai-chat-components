import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToolInvocationCard } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Advanced/AI/ToolInvocationCard',
    component: ToolInvocationCard,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
**Tool Invocation Card** - Professional function/tool call visualization with approval workflow:

- 🔧 Function call display with formatted arguments
- ✅ Approval/rejection workflow for human-in-the-loop
- 🔄 Status tracking (pending → executing → success/error)
- 📊 Result visualization with expandable sections
- 🎨 Color-coded status indicators
- 🔁 Retry functionality for failed executions
- 🌙 Full dark mode support
- ♿ Fully accessible with keyboard navigation

Perfect for AI agents, function calling, tool use, and human-in-the-loop workflows with ChatGPT, Claude, or custom models.
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'select',
            options: ['pending', 'approved', 'rejected', 'executing', 'success', 'error'],
            description: 'Current status of the tool invocation',
        },
        requiresApproval: {
            control: 'boolean',
            description: 'Whether the tool requires user approval before execution',
        },
        formatArguments: {
            control: 'boolean',
            description: 'Format JSON arguments with pretty-printing',
        },
        expandableResult: {
            control: 'boolean',
            description: 'Make result section expandable/collapsible',
        },
    },
};
export default meta;
// Mock tool calls
const searchTool = {
    id: 'tool_search_1',
    type: 'function',
    function: {
        name: 'search_documentation',
        arguments: JSON.stringify({
            query: 'React hooks best practices',
            limit: 10,
            includeExamples: true,
        }),
    },
};
const weatherTool = {
    id: 'tool_weather_1',
    type: 'function',
    function: {
        name: 'get_weather',
        arguments: JSON.stringify({
            location: 'San Francisco, CA',
            units: 'fahrenheit',
            forecast: true,
        }),
    },
};
const databaseTool = {
    id: 'tool_db_1',
    type: 'function',
    function: {
        name: 'query_database',
        arguments: JSON.stringify({
            table: 'users',
            filters: { role: 'admin', active: true },
            limit: 50,
        }),
    },
};
const complexTool = {
    id: 'tool_complex_1',
    type: 'function',
    function: {
        name: 'process_image',
        arguments: JSON.stringify({
            imageUrl: 'https://example.com/image.jpg',
            operations: [
                { type: 'resize', width: 800, height: 600 },
                { type: 'filter', name: 'sharpen', intensity: 0.5 },
                { type: 'watermark', text: 'Copyright 2024', position: 'bottom-right' },
            ],
            outputFormat: 'webp',
            quality: 85,
        }),
    },
};
// Basic Stories
export const Pending = {
    args: {
        toolCall: searchTool,
        status: 'pending',
    },
};
export const PendingWithApproval = {
    args: {
        toolCall: searchTool,
        status: 'pending',
        requiresApproval: true,
        onApprove: (tool) => console.log('Approved:', tool),
        onReject: (tool) => console.log('Rejected:', tool),
    },
};
export const Approved = {
    args: {
        toolCall: searchTool,
        status: 'approved',
    },
};
export const Rejected = {
    args: {
        toolCall: searchTool,
        status: 'rejected',
    },
};
export const Executing = {
    args: {
        toolCall: weatherTool,
        status: 'executing',
    },
};
export const Success = {
    args: {
        toolCall: weatherTool,
        status: 'success',
        result: {
            location: 'San Francisco, CA',
            current: {
                temperature: 68,
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12,
            },
            forecast: [
                { day: 'Tomorrow', high: 72, low: 58, condition: 'Sunny' },
                { day: 'Wednesday', high: 70, low: 56, condition: 'Cloudy' },
            ],
        },
    },
};
export const SuccessWithString = {
    args: {
        toolCall: searchTool,
        status: 'success',
        result: 'Found 10 relevant documentation articles about React hooks best practices.',
    },
};
export const Error = {
    args: {
        toolCall: databaseTool,
        status: 'error',
        error: 'Database connection timeout. Unable to execute query after 30 seconds.',
        onRetry: (tool) => console.log('Retrying:', tool),
    },
};
export const ErrorWithStackTrace = {
    args: {
        toolCall: databaseTool,
        status: 'error',
        error: `Error: Database connection failed
  at Database.connect (database.ts:45)
  at executeQuery (api.ts:123)
  at processToolCall (agent.ts:89)
  
Caused by: Connection refused - ECONNREFUSED 127.0.0.1:5432`,
        onRetry: (tool) => console.log('Retrying:', tool),
    },
};
// Different Tool Types
export const SearchTool = {
    args: {
        toolCall: searchTool,
        status: 'success',
        result: [
            { title: 'Advanced/AI/ToolInvocationCard', url: 'https://react.dev/reference/react/useState', relevance: 0.95 },
            { title: 'Advanced/AI/ToolInvocationCard', url: 'https://react.dev/reference/react/useEffect', relevance: 0.92 },
            { title: 'Advanced/AI/ToolInvocationCard', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks', relevance: 0.88 },
        ],
    },
};
export const WeatherTool = {
    args: {
        toolCall: weatherTool,
        status: 'success',
        result: {
            location: 'San Francisco, CA',
            temperature: 68,
            condition: 'Partly Cloudy',
            humidity: 65,
        },
    },
};
export const DatabaseTool = {
    args: {
        toolCall: databaseTool,
        status: 'success',
        result: {
            count: 23,
            users: [
                { id: 1, name: 'Alice Johnson', role: 'admin' },
                { id: 5, name: 'Bob Smith', role: 'admin' },
                { id: 12, name: 'Carol Williams', role: 'admin' },
            ],
        },
    },
};
export const ComplexTool = {
    args: {
        toolCall: complexTool,
        status: 'success',
        result: {
            success: true,
            outputUrl: 'https://cdn.example.com/processed/image_abc123.webp',
            dimensions: { width: 800, height: 600 },
            fileSize: '245KB',
            processingTime: '2.3s',
        },
    },
};
// Formatting Options
export const FormattedArguments = {
    args: {
        toolCall: complexTool,
        status: 'pending',
        formatArguments: true,
    },
};
export const UnformattedArguments = {
    args: {
        toolCall: complexTool,
        status: 'pending',
        formatArguments: false,
    },
};
export const ExpandableResult = {
    args: {
        toolCall: databaseTool,
        status: 'success',
        expandableResult: true,
        result: {
            query: 'SELECT * FROM users WHERE role = $1 AND active = $2 LIMIT $3',
            executionTime: '45ms',
            rowCount: 23,
            data: [
                { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', active: true },
                { id: 2, name: 'Bob', email: 'bob@example.com', role: 'admin', active: true },
                // More rows...
            ],
        },
    },
};
export const NonExpandableResult = {
    args: {
        toolCall: weatherTool,
        status: 'success',
        expandableResult: false,
        result: { temperature: 68, condition: 'Sunny' },
    },
};
// Interactive Stories
const ApprovalWorkflow = () => {
    const [status, setStatus] = useState('pending');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(undefined);
    const handleApprove = () => {
        setStatus('executing');
        setError(undefined);
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            if (success) {
                setStatus('success');
                setResult({
                    found: 10,
                    articles: [
                        'React Hooks Best Practices',
                        'Custom Hook Patterns',
                        'Hook Optimization Tips',
                    ],
                });
            }
            else {
                setStatus('error');
                setError('Network request failed. Please check your connection and try again.');
            }
        }, 2000);
    };
    const handleReject = () => {
        setStatus('rejected');
        setResult(null);
        setError(undefined);
    };
    const handleRetry = () => {
        setStatus('pending');
        setResult(null);
        setError(undefined);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: _jsx("p", { className: "text-sm text-blue-900 dark:text-blue-100", children: "\uD83D\uDCA1 Try approving the tool call to see the complete workflow. There's a 30% chance it will fail (to demonstrate error handling)." }) }), _jsx(ToolInvocationCard, { toolCall: searchTool, status: status, result: result, error: error, requiresApproval: status === 'pending', onApprove: handleApprove, onReject: handleReject, onRetry: handleRetry, expandableResult: true }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-medium mb-2", children: "Current Status:" }), _jsx("p", { className: "text-sm", children: _jsx("span", { className: "font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded", children: status }) })] })] }));
};
export const InteractiveApprovalWorkflow = {
    render: () => _jsx(ApprovalWorkflow, {}),
};
const MultipleTools = () => {
    const [toolStates, setToolStates] = useState({
        [searchTool.id]: { status: 'pending' },
        [weatherTool.id]: { status: 'pending' },
        [databaseTool.id]: { status: 'pending' },
    });
    const handleApprove = (tool) => {
        setToolStates((prev) => ({
            ...prev,
            [tool.id]: { status: 'executing' },
        }));
        setTimeout(() => {
            setToolStates((prev) => ({
                ...prev,
                [tool.id]: {
                    status: 'success',
                    result: `${tool.function.name} executed successfully!`,
                },
            }));
        }, 2000);
    };
    const handleReject = (tool) => {
        setToolStates((prev) => ({
            ...prev,
            [tool.id]: { status: 'rejected' },
        }));
    };
    const tools = [searchTool, weatherTool, databaseTool];
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "Multiple Tool Invocations" }), _jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: ["The AI wants to execute ", tools.length, " tools. Review and approve each one individually."] })] }), tools.map((tool) => (_jsx(ToolInvocationCard, { toolCall: tool, status: toolStates[tool.id].status, result: toolStates[tool.id].result, error: toolStates[tool.id].error, requiresApproval: toolStates[tool.id].status === 'pending', onApprove: handleApprove, onReject: handleReject, expandableResult: true }, tool.id)))] }));
};
export const MultipleToolInvocations = {
    render: () => _jsx(MultipleTools, {}),
};
// Edge Cases
export const VeryLongArguments = {
    args: {
        toolCall: {
            id: 'tool_long_1',
            type: 'function',
            function: {
                name: 'generate_report',
                arguments: JSON.stringify({
                    title: 'Advanced/AI/ToolInvocationCard',
                    sections: [
                        'Executive Summary',
                        'Revenue Analysis',
                        'Expense Breakdown',
                        'Profit Margins',
                        'Growth Projections',
                        'Market Comparison',
                        'Risk Assessment',
                        'Recommendations',
                    ],
                    filters: {
                        dateRange: { start: '2024-10-01', end: '2024-12-31' },
                        departments: ['Sales', 'Marketing', 'Engineering', 'Operations'],
                        includeSubcontractors: true,
                        currencyConversion: 'USD',
                    },
                    formatting: {
                        pageSize: 'letter',
                        orientation: 'portrait',
                        includeCharts: true,
                        includeTableOfContents: true,
                        footerText: 'Confidential - Internal Use Only',
                    },
                }),
            },
        },
        status: 'pending',
        requiresApproval: true,
        onApprove: (tool) => console.log('Approved:', tool),
    },
};
export const LargeResult = {
    args: {
        toolCall: databaseTool,
        status: 'success',
        expandableResult: true,
        result: {
            query: 'SELECT * FROM users',
            totalCount: 1547,
            page: 1,
            pageSize: 50,
            users: Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                role: i % 5 === 0 ? 'admin' : 'user',
                createdAt: new Date(2024, 0, i + 1).toISOString(),
            })),
        },
    },
};
export const InvalidJSON = {
    args: {
        toolCall: {
            id: 'tool_invalid_1',
            type: 'function',
            function: {
                name: 'parse_data',
                arguments: '{ invalid json here }',
            },
        },
        status: 'error',
        error: 'Invalid JSON in tool arguments',
    },
};
//# sourceMappingURL=ToolInvocationCard.stories.js.map