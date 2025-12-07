'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ModelSelector, StreamingMessage, } from '@clarity-chat/react';
import { useStreamingChat } from '@/hooks/useStreamingChat';
// Stub for missing exports
const allModels = [];
export default function Home() {
    const [leftModel, setLeftModel] = useState('gpt-4-turbo');
    const [rightModel, setRightModel] = useState('claude-3-opus');
    const [prompt, setPrompt] = useState('');
    const [leftResponse, setLeftResponse] = useState('');
    const [rightResponse, setRightResponse] = useState('');
    const [isLeftStreaming, setIsLeftStreaming] = useState(false);
    const [isRightStreaming, setIsRightStreaming] = useState(false);
    const [leftCost, setLeftCost] = useState(0);
    const [rightCost, setRightCost] = useState(0);
    const [leftTime, setLeftTime] = useState(0);
    const [rightTime, setRightTime] = useState(0);
    const [leftError, setLeftError] = useState(null);
    const [rightError, setRightError] = useState(null);
    if (typeof window === 'undefined') {
        return null;
    }
    const getModelMetadata = (modelId) => {
        return allModels.find(m => m.id === modelId);
    };
    // Create streaming hooks for both models
    const leftStream = useStreamingChat({
        onToken: (token) => setLeftResponse(prev => prev + token),
        onComplete: (data) => {
            setLeftCost(data.cost);
            setLeftTime(data.duration);
            setIsLeftStreaming(false);
            setLeftError(null);
        },
        onError: (error) => {
            console.error('Left model error:', error);
            setLeftError(error);
            setIsLeftStreaming(false);
        }
    });
    const rightStream = useStreamingChat({
        onToken: (token) => setRightResponse(prev => prev + token),
        onComplete: (data) => {
            setRightCost(data.cost);
            setRightTime(data.duration);
            setIsRightStreaming(false);
            setRightError(null);
        },
        onError: (error) => {
            console.error('Right model error:', error);
            setRightError(error);
            setIsRightStreaming(false);
        }
    });
    const handleCompare = async () => {
        if (!prompt.trim())
            return;
        setLeftResponse('');
        setRightResponse('');
        setLeftCost(0);
        setRightCost(0);
        setLeftTime(0);
        setRightTime(0);
        setLeftError(null);
        setRightError(null);
        setIsLeftStreaming(true);
        setIsRightStreaming(true);
        // Create messages array
        const messages = [
            {
                role: 'user',
                content: prompt
            }
        ];
        // Get model metadata
        const leftModelData = getModelMetadata(leftModel);
        const rightModelData = getModelMetadata(rightModel);
        if (!leftModelData || !rightModelData) {
            console.error('Model metadata not found');
            setIsLeftStreaming(false);
            setIsRightStreaming(false);
            return;
        }
        // Stream from both models simultaneously
        try {
            await Promise.all([
                leftStream.stream(messages, {
                    provider: leftModelData.provider,
                    model: leftModel,
                    temperature: 0.7,
                    maxTokens: 1000
                }),
                rightStream.stream(messages, {
                    provider: rightModelData.provider,
                    model: rightModel,
                    temperature: 0.7,
                    maxTokens: 1000
                })
            ]);
        }
        catch (error) {
            console.error('Comparison error:', error);
            setIsLeftStreaming(false);
            setIsRightStreaming(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCompare();
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800", children: [_jsx("header", { className: "border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "AI Model Comparison" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Compare responses from different AI models side-by-side" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "https://github.com/yourusername/clarity-chat", target: "_blank", rel: "noopener noreferrer", className: "text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white", children: "GitHub" }), _jsx("a", { href: "/docs", className: "text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white", children: "Documentation" })] })] }) }) }), _jsxs("main", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6", children: [_jsx("label", { htmlFor: "prompt", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Enter your prompt" }), _jsx("textarea", { id: "prompt", value: prompt, onChange: (e) => setPrompt(e.target.value), onKeyPress: handleKeyPress, placeholder: "What is the future of artificial intelligence?", className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none", rows: 3 }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Press Enter to compare, Shift+Enter for new line" }), _jsx("button", { onClick: handleCompare, disabled: !prompt.trim() || isLeftStreaming || isRightStreaming, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium", children: isLeftStreaming || isRightStreaming ? 'Comparing...' : 'Compare Models' })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-3", children: "Model A" }), _jsx(ModelSelector, { models: allModels, value: leftModel, onChange: (modelId) => setLeftModel(modelId), showMetrics: true })] }), leftResponse && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "border-t dark:border-gray-700 pt-4", children: _jsx(StreamingMessage, { content: leftResponse, isStreaming: isLeftStreaming }) }), !isLeftStreaming && (_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Time:" }), ' ', _jsxs("span", { className: "text-gray-900 dark:text-white", children: [(leftTime / 1000).toFixed(2), "s"] })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Cost:" }), ' ', _jsxs("span", { className: "text-gray-900 dark:text-white", children: ["$", leftCost.toFixed(4)] })] })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [leftResponse.split(' ').length, " tokens (approx)"] })] }))] })), leftError && (_jsx("div", { className: "mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-red-800 dark:text-red-300 mb-1", children: "Error" }), _jsx("p", { className: "text-sm text-red-700 dark:text-red-400", children: leftError })] })] }) })), !leftResponse && !isLeftStreaming && !leftError && (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400 py-12", children: "Enter a prompt and click \"Compare Models\" to see results" }))] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-3", children: "Model B" }), _jsx(ModelSelector, { models: allModels, value: rightModel, onChange: (modelId) => setRightModel(modelId), showMetrics: true })] }), rightResponse && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "border-t dark:border-gray-700 pt-4", children: _jsx(StreamingMessage, { content: rightResponse, isStreaming: isRightStreaming }) }), !isRightStreaming && (_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Time:" }), ' ', _jsxs("span", { className: "text-gray-900 dark:text-white", children: [(rightTime / 1000).toFixed(2), "s"] })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Cost:" }), ' ', _jsxs("span", { className: "text-gray-900 dark:text-white", children: ["$", rightCost.toFixed(4)] })] })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [rightResponse.split(' ').length, " tokens (approx)"] })] }))] })), rightError && (_jsx("div", { className: "mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-red-800 dark:text-red-300 mb-1", children: "Error" }), _jsx("p", { className: "text-sm text-red-700 dark:text-red-400", children: rightError })] })] }) })), !rightResponse && !isRightStreaming && !rightError && (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400 py-12", children: "Enter a prompt and click \"Compare Models\" to see results" }))] })] }), leftResponse && rightResponse && !isLeftStreaming && !isRightStreaming && (_jsxs("div", { className: "mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Comparison Summary" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Faster Model" }), _jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: leftTime < rightTime ? getModelMetadata(leftModel)?.name : getModelMetadata(rightModel)?.name }), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [Math.abs(leftTime - rightTime).toFixed(0), "ms difference"] })] }), _jsxs("div", { className: "text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Lower Cost" }), _jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: leftCost < rightCost ? getModelMetadata(leftModel)?.name : getModelMetadata(rightModel)?.name }), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: ["$", Math.abs(leftCost - rightCost).toFixed(4), " saved"] })] }), _jsxs("div", { className: "text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Cost Difference" }), _jsxs("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: [Math.abs((leftCost - rightCost) / Math.max(leftCost, rightCost) * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: leftCost < rightCost ? 'Model A cheaper' : 'Model B cheaper' })] })] })] })), _jsxs("div", { className: "mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: "Powered by Clarity Chat" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Model-Agnostic" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Switch between OpenAI, Anthropic, and Google AI with just 3 lines of code" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Real-time Streaming" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Token-by-token streaming with AsyncGenerator for all providers" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Cost Tracking" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Accurate cost estimation for 9 AI models across 3 providers" })] })] })] })] }), _jsx("footer", { className: "border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-12", children: _jsx("div", { className: "container mx-auto px-4 py-6", children: _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("p", { children: ["Built with ", _jsx("span", { className: "text-red-500", children: "\u2665" }), " using Clarity Chat"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "/docs", className: "hover:text-gray-900 dark:hover:text-white", children: "Documentation" }), _jsx("a", { href: "/storybook", className: "hover:text-gray-900 dark:hover:text-white", children: "Storybook" }), _jsx("a", { href: "https://github.com/yourusername/clarity-chat", className: "hover:text-gray-900 dark:hover:text-white", children: "GitHub" })] })] }) }) })] }));
}
//# sourceMappingURL=page.js.map