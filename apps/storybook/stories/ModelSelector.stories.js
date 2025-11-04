import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ModelSelector } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Components/ModelSelector',
    component: ModelSelector,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
**Model Selector** - Beautiful AI model picker with rich comparison metrics:

- 🤖 Support for OpenAI, Anthropic, and Google models
- ⚡ Speed ratings (fast/medium/slow)
- 💰 Cost indicators (low/medium/high)
- ⭐ Quality ratings (good/excellent/best)
- 🔍 Model capabilities (vision, tools, context window)
- 📊 Real-time comparison while browsing
- 🎨 Color-coded badges for quick scanning
- ♿ Full keyboard navigation
- 🌙 Dark mode support

Perfect for multi-model AI applications where users need to choose the best model for their task.
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        showMetrics: {
            control: 'boolean',
            description: 'Show speed, cost, and quality badges',
        },
        showDescription: {
            control: 'boolean',
            description: 'Show model descriptions in dropdown',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable model selection',
        },
    },
};
export default meta;
// Mock model data
const openAIModels = [
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        speed: 'fast',
        cost: 'high',
        quality: 'best',
        contextWindow: 128000,
        description: 'Most capable GPT-4 model with vision, JSON mode, and function calling. Optimized for complex tasks.',
        streaming: true,
        toolCalling: true,
        vision: true,
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        speed: 'medium',
        cost: 'high',
        quality: 'best',
        contextWindow: 8192,
        description: 'Original GPT-4 with excellent reasoning and creative capabilities.',
        streaming: true,
        toolCalling: true,
        vision: false,
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        speed: 'fast',
        cost: 'low',
        quality: 'good',
        contextWindow: 16384,
        description: 'Fast and cost-effective model for simple tasks and high-volume applications.',
        streaming: true,
        toolCalling: true,
        vision: false,
    },
];
const anthropicModels = [
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        speed: 'medium',
        cost: 'high',
        quality: 'best',
        contextWindow: 200000,
        description: 'Most intelligent Claude model with superior performance on complex tasks and extended thinking.',
        streaming: true,
        toolCalling: true,
        vision: true,
    },
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        speed: 'fast',
        cost: 'medium',
        quality: 'excellent',
        contextWindow: 200000,
        description: 'Balanced model offering great performance at lower cost. Best for most production use cases.',
        streaming: true,
        toolCalling: true,
        vision: true,
    },
    {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        speed: 'fast',
        cost: 'low',
        quality: 'good',
        contextWindow: 200000,
        description: 'Fastest and most cost-effective Claude model. Ideal for high-volume, simple tasks.',
        streaming: true,
        toolCalling: true,
        vision: true,
    },
];
const googleModels = [
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        speed: 'fast',
        cost: 'medium',
        quality: 'excellent',
        contextWindow: 32768,
        description: 'Google\'s flagship model with strong reasoning and multimodal capabilities.',
        streaming: true,
        toolCalling: true,
        vision: false,
    },
    {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        provider: 'google',
        speed: 'medium',
        cost: 'medium',
        quality: 'excellent',
        contextWindow: 32768,
        description: 'Gemini Pro with advanced vision capabilities for image understanding.',
        streaming: true,
        toolCalling: true,
        vision: true,
    },
];
const allModels = [
    ...openAIModels,
    ...anthropicModels,
    ...googleModels,
];
// Basic Stories
export const Default = {
    args: {
        models: allModels,
        value: 'gpt-4-turbo',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const OpenAIModels = {
    args: {
        models: openAIModels,
        value: 'gpt-4-turbo',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const AnthropicModels = {
    args: {
        models: anthropicModels,
        value: 'claude-3-opus',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const GoogleModels = {
    args: {
        models: googleModels,
        value: 'gemini-pro',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const WithoutMetrics = {
    args: {
        models: allModels,
        value: 'gpt-4-turbo',
        showMetrics: false,
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const WithoutDescriptions = {
    args: {
        models: allModels,
        value: 'gpt-4-turbo',
        showDescription: false,
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const Disabled = {
    args: {
        models: allModels,
        value: 'gpt-4-turbo',
        disabled: true,
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const MinimalUI = {
    args: {
        models: allModels,
        value: 'gpt-3.5-turbo',
        showMetrics: false,
        showDescription: false,
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
// Interactive Stories
const InteractiveExample = () => {
    const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
    const [config, setConfig] = useState(null);
    const handleChange = (modelId, newConfig) => {
        setSelectedModel(modelId);
        setConfig(newConfig);
    };
    const currentModel = allModels.find((m) => m.id === selectedModel);
    return (_jsxs("div", { className: "space-y-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Select AI Model" }), _jsx(ModelSelector, { models: allModels, value: selectedModel, onChange: handleChange })] }), currentModel && (_jsxs("div", { className: "p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Selected Model Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Model Name" }), _jsx("p", { className: "font-medium", children: currentModel.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Provider" }), _jsx("p", { className: "font-medium capitalize", children: currentModel.provider })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Speed" }), _jsx("p", { className: "font-medium capitalize", children: currentModel.speed })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Cost" }), _jsx("p", { className: "font-medium capitalize", children: currentModel.cost })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Quality" }), _jsx("p", { className: "font-medium capitalize", children: currentModel.quality })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Context Window" }), _jsxs("p", { className: "font-medium", children: [(currentModel.contextWindow / 1000).toFixed(0), "K tokens"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Capabilities" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [currentModel.streaming && (_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", children: "\u26A1 Streaming" })), currentModel.toolCalling && (_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", children: "\uD83D\uDD27 Tool Calling" })), currentModel.vision && (_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", children: "\uD83D\uDC41\uFE0F Vision" }))] })] }), config && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Config" }), _jsx("pre", { className: "bg-white dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto", children: JSON.stringify(config, null, 2) })] }))] }))] }));
};
export const InteractiveWithDetails = {
    render: () => _jsx(InteractiveExample, {}),
};
const ModelComparison = () => {
    const [model1, setModel1] = useState('gpt-4-turbo');
    const [model2, setModel2] = useState('claude-3-opus');
    const getModel = (id) => allModels.find((m) => m.id === id);
    const model1Data = getModel(model1);
    const model2Data = getModel(model2);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-blue-900 dark:text-blue-100 mb-2", children: "Model Comparison Tool" }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Compare two models side-by-side to make informed decisions" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Model 1" }), _jsx(ModelSelector, { models: allModels, value: model1, onChange: (id) => setModel1(id) }), model1Data && (_jsxs("div", { className: "mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Speed:" }), " ", model1Data.speed] }), _jsxs("p", { children: [_jsx("strong", { children: "Cost:" }), " ", model1Data.cost] }), _jsxs("p", { children: [_jsx("strong", { children: "Quality:" }), " ", model1Data.quality] }), _jsxs("p", { children: [_jsx("strong", { children: "Context:" }), " ", (model1Data.contextWindow / 1000).toFixed(0), "K"] })] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Model 2" }), _jsx(ModelSelector, { models: allModels, value: model2, onChange: (id) => setModel2(id) }), model2Data && (_jsxs("div", { className: "mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Speed:" }), " ", model2Data.speed] }), _jsxs("p", { children: [_jsx("strong", { children: "Cost:" }), " ", model2Data.cost] }), _jsxs("p", { children: [_jsx("strong", { children: "Quality:" }), " ", model2Data.quality] }), _jsxs("p", { children: [_jsx("strong", { children: "Context:" }), " ", (model2Data.contextWindow / 1000).toFixed(0), "K"] })] }))] })] }), model1Data && model2Data && (_jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-green-900 dark:text-green-100 mb-2", children: "Comparison Summary" }), _jsxs("ul", { className: "text-sm text-green-800 dark:text-green-200 space-y-1", children: [_jsxs("li", { children: [_jsx("strong", { children: "Faster:" }), " ", model1Data.speed === 'fast' && model2Data.speed !== 'fast'
                                        ? model1Data.name
                                        : model2Data.speed === 'fast' && model1Data.speed !== 'fast'
                                            ? model2Data.name
                                            : 'Tie'] }), _jsxs("li", { children: [_jsx("strong", { children: "Lower Cost:" }), " ", model1Data.cost === 'low' && model2Data.cost !== 'low'
                                        ? model1Data.name
                                        : model2Data.cost === 'low' && model1Data.cost !== 'low'
                                            ? model2Data.name
                                            : 'Tie'] }), _jsxs("li", { children: [_jsx("strong", { children: "Higher Quality:" }), " ", model1Data.quality === 'best' && model2Data.quality !== 'best'
                                        ? model1Data.name
                                        : model2Data.quality === 'best' && model1Data.quality !== 'best'
                                            ? model2Data.name
                                            : 'Tie'] }), _jsxs("li", { children: [_jsx("strong", { children: "Larger Context:" }), " ", model1Data.contextWindow > model2Data.contextWindow
                                        ? model1Data.name
                                        : model2Data.contextWindow > model1Data.contextWindow
                                            ? model2Data.name
                                            : 'Tie'] })] })] }))] }));
};
export const ComparisonTool = {
    render: () => _jsx(ModelComparison, {}),
};
// Edge Cases
export const SingleModel = {
    args: {
        models: [openAIModels[0]],
        value: 'gpt-4-turbo',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const LongModelNames = {
    args: {
        models: [
            {
                id: 'very-long-model-name',
                name: 'SuperAdvancedAI Model v4.5 Pro Max Ultra (Extended Context Version)',
                provider: 'openai',
                speed: 'fast',
                cost: 'high',
                quality: 'best',
                contextWindow: 128000,
                description: 'This is an extremely long model name to test how the UI handles overflow and text truncation in various scenarios.',
            },
        ],
        value: 'very-long-model-name',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const ManyModels = {
    args: {
        models: [
            ...allModels,
            ...allModels.map((m, i) => ({ ...m, id: `${m.id}-copy-${i}`, name: `${m.name} (Copy ${i + 1})` })),
        ],
        value: 'gpt-4-turbo',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
export const NoModelSelected = {
    args: {
        models: allModels,
        value: '',
        onChange: (modelId, config) => console.log('Selected:', modelId, config),
    },
};
//# sourceMappingURL=ModelSelector.stories.js.map