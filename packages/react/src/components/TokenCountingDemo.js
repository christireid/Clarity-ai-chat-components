import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { TokenCounter } from '@clarity-chat/token-optimization';
import { smartCountTokens } from './smart-fallback';
import { tokenAnalyticsMonitor } from './token-analytics';
export const MODELS = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        inputCost: 0.03,
        outputCost: 0.06,
        contextWindow: 8192,
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        inputCost: 0.01,
        outputCost: 0.03,
        contextWindow: 128000,
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        inputCost: 0.005,
        outputCost: 0.015,
        contextWindow: 128000,
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        inputCost: 0.0005,
        outputCost: 0.0015,
        contextWindow: 16384,
    },
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        inputCost: 0.015,
        outputCost: 0.075,
        contextWindow: 200000,
    },
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        inputCost: 0.003,
        outputCost: 0.015,
        contextWindow: 200000,
    },
    {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        inputCost: 0.00025,
        outputCost: 0.00125,
        contextWindow: 200000,
    },
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        inputCost: 0.0005,
        outputCost: 0.001,
        contextWindow: 128000,
    },
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        inputCost: 0.0002,
        outputCost: 0.0004,
        contextWindow: 128000,
    },
];
export const TokenCountingDemo = ({ defaultText = 'Hello World! This is a token counting demo. Try typing your own text to see how many tokens it uses across different AI models.', showModelSelector = true, showRealTimeCounting = true, showComparison = true, showAnalytics = true, }) => {
    const [text, setText] = useState(defaultText);
    const [selectedModel, setSelectedModel] = useState('gpt-4');
    const [tokenCount, setTokenCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [comparisons, setComparisons] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    // Real-time counting effect
    useEffect(() => {
        if (!showRealTimeCounting)
            return;
        const timer = setTimeout(() => {
            setIsCounting(true);
            try {
                const count = TokenCounter.count(text);
                setTokenCount(count);
                // Record for analytics
                tokenAnalyticsMonitor.recordUsage({
                    tokens: count,
                    model: selectedModel,
                    type: 'input',
                });
            }
            catch (error) {
                console.warn('Token counting error:', error);
                setTokenCount(0);
            }
            finally {
                setIsCounting(false);
            }
        }, 300); // Debounce for 300ms
        return () => clearTimeout(timer);
    }, [text, selectedModel, showRealTimeCounting]);
    // Update comparisons when text changes
    useEffect(() => {
        if (!showComparison)
            return;
        const newComparisons = MODELS.map((model) => {
            const tokens = smartCountTokens(text, { model: model.id });
            const estimatedCost = (tokens / 1000) * model.inputCost;
            return {
                model: model.name,
                tokens,
                estimatedCost,
                contextWindow: model.contextWindow,
            };
        }).sort((a, b) => a.tokens - b.tokens);
        setComparisons(newComparisons);
    }, [text, showComparison]);
    // Update analytics
    useEffect(() => {
        if (!showAnalytics)
            return;
        const updateAnalytics = () => {
            const analyticsData = tokenAnalyticsMonitor.getAnalytics();
            setAnalytics(analyticsData);
        };
        updateAnalytics();
        const interval = setInterval(updateAnalytics, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, [showAnalytics]);
    const handleTextChange = useCallback((e) => {
        setText(e.target.value);
    }, []);
    const handleModelChange = useCallback((e) => {
        setSelectedModel(e.target.value);
    }, []);
    const handleClear = useCallback(() => {
        setText('');
    }, []);
    const handleSampleText = useCallback((sampleText) => {
        setText(sampleText);
    }, []);
    const getTokenEfficiency = (tokens, chars) => {
        return chars > 0 ? ((tokens / chars) * 100).toFixed(1) : '0';
    };
    const getCostColor = (cost) => {
        if (cost < 0.001)
            return 'text-green-600';
        if (cost < 0.01)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Token Counting Demo" }), _jsx("p", { className: "text-gray-600", children: "Real-time token counting across different AI models with cost estimation" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Enter your text:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleClear, className: "px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors", children: "Clear" }), _jsx("button", { onClick: () => setShowAdvanced(!showAdvanced), className: "px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors", children: showAdvanced ? 'Hide Advanced' : 'Show Advanced' })] })] }), _jsx("textarea", { value: text, onChange: handleTextChange, className: "w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical", rows: 4, placeholder: "Type your text here to see token counting in action..." }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Quick samples:" }), [
                                'Hello World',
                                'The quick brown fox jumps over the lazy dog.',
                                'function hello() { console.log("Hello World"); }',
                                'Can you help me write a React component?',
                                'What is the weather like today?',
                            ].map((sample, index) => (_jsx("button", { onClick: () => handleSampleText(sample), className: "px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors", children: sample.length > 30 ? `${sample.substring(0, 30)}...` : sample }, index)))] })] }), showModelSelector && (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Model:" }), _jsx("select", { value: selectedModel, onChange: handleModelChange, className: "p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500", children: MODELS.map((model) => (_jsx("option", { value: model.id, children: model.name }, model.id))) })] })), _jsx("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900", children: "Current Count" }), _jsx("p", { className: "text-blue-700", children: isCounting ? (_jsxs("span", { className: "inline-flex items-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Counting..."] })) : (_jsxs("span", { className: "text-2xl font-bold", children: [tokenCount, " tokens"] })) }), _jsxs("p", { className: "text-sm text-blue-600", children: [text.length, " characters \u2022", ' ', getTokenEfficiency(tokenCount, text.length), "% efficiency"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-blue-600", children: "Estimated Cost" }), _jsxs("p", { className: "text-xl font-bold text-blue-900", children: ["$", ((tokenCount / 1000) *
                                            (MODELS.find((m) => m.id === selectedModel)?.inputCost || 0)).toFixed(4)] })] })] }) }), showComparison && comparisons.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Model Comparisons" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: comparisons
                            .slice(0, showAdvanced ? comparisons.length : 3)
                            .map((comparison, index) => (_jsxs("div", { className: "p-3 border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: comparison.model }), _jsxs("span", { className: `text-sm font-semibold ${getCostColor(comparison.estimatedCost)}`, children: ["$", comparison.estimatedCost.toFixed(4)] })] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsxs("p", { children: [comparison.tokens, " tokens"] }), _jsxs("p", { children: ["Context: ", comparison.contextWindow.toLocaleString()] }), _jsxs("p", { children: ["Efficiency:", ' ', getTokenEfficiency(comparison.tokens, text.length), "%"] })] })] }, index))) }), !showAdvanced && comparisons.length > 3 && (_jsxs("button", { onClick: () => setShowAdvanced(true), className: "mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium", children: ["Show all ", comparisons.length, " models \u2192"] }))] })), showAnalytics && analytics && (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Usage Analytics" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Requests" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: analytics.totalRequests })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Tokens" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: analytics.totalTokens.toLocaleString() })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Average" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: Math.round(analytics.averageTokens) })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Peak" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: analytics.maxTokens })] })] })] })), showAdvanced && (_jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Advanced Features" }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Token Budget Simulator" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "range", min: "10", max: "10000", value: tokenCount, onChange: (e) => {
                                            const budget = parseInt(e.target.value, 10);
                                            const percentage = Math.min(100, (tokenCount / budget) * 100);
                                            // You could add budget validation logic here
                                        }, className: "flex-1" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["Budget: ", tokenCount, " tokens"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Characters" }), _jsx("p", { className: "font-semibold", children: text.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Words" }), _jsx("p", { className: "font-semibold", children: text.split(/\s+/).filter((w) => w.length > 0).length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Sentences" }), _jsx("p", { className: "font-semibold", children: text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Paragraphs" }), _jsx("p", { className: "font-semibold", children: text.split('\n').filter((p) => p.trim().length > 0).length })] })] })] })), _jsxs("div", { className: "text-sm text-gray-500 border-t pt-4", children: [_jsxs("p", { className: "mb-2", children: [_jsx("strong", { children: "How it works:" }), " Token counting uses the Tiktoken library to accurately count tokens that would be used by different AI models. The cost estimates are based on current pricing and may vary by region and usage volume."] }), _jsxs("p", { children: [_jsx("strong", { children: "Tips:" }), " Use shorter, more concise text to reduce token usage. Consider using cheaper models like GPT-3.5 Turbo for simpler tasks, and reserve expensive models like GPT-4 for complex reasoning tasks."] })] })] }));
};
export default TokenCountingDemo;
//# sourceMappingURL=TokenCountingDemo.js.map