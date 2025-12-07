import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Advanced Prompt Optimization Example
 *
 * Demonstrates Phase 2 features:
 * - Automatic prompt optimization with compiler-like pipeline
 * - Dynamic model routing
 * - Real-time token visualization
 * - Compression logs and diagnostics
 */
import * as React from 'react';
import { usePromptOptimizer, useDynamicModelRouting, usePromptDebugger, toon, } from '@clarity-chat/react/prompt';
/**
 * Example: Chat with Automatic Optimization
 * Shows how prompts shrink in real time with visualization
 */
export function AdvancedOptimizedChat() {
    const [messages, setMessages] = React.useState([]);
    const [currentModel, setCurrentModel] = React.useState('gpt-4');
    const [userInput, setUserInput] = React.useState('');
    const [targetTokens] = React.useState(4000);
    // Use prompt optimizer
    const optimizer = usePromptOptimizer({
        messages,
        model: currentModel,
        targetTokens,
        autoOptimize: true,
        applyStyleTransformation: true,
        debug: true,
    });
    // Use dynamic model routing
    const routing = useDynamicModelRouting({
        currentModel,
        targetTokens,
        messages: optimizer.optimizedMessages,
    });
    // Use debugger for visualization
    const ;
    debugger;
    usePromptDebugger({
        diagnostics: optimizer.diagnostics,
        routingDecision: routing.routingDecision,
        messagesBefore: messages,
        messagesAfter: optimizer.optimizedMessages,
        detailed: true,
    });
    const handleSend = () => {
        if (!userInput.trim())
            return;
        const newMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: userInput,
        };
        setMessages((prev) => [...prev, newMessage]);
        setUserInput('');
    };
    // Switch model if recommended
    React.useEffect(() => {
        if (routing.routingDecision.shouldSwitch && routing.routingDecision.recommendedModel) {
            console.log('Model switch recommended:', routing.routingDecision.reasoning);
            // In production, you'd show a confirmation dialog
        }
    }, [routing.routingDecision]);
    return (_jsxs("div", { style: { display: 'flex', gap: '20px', padding: '20px' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("h2", { children: "Chat with Automatic Optimization" }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("label", { children: ["Model:", ' ', _jsxs("select", { value: currentModel, onChange: (e) => setCurrentModel(e.target.value), children: [_jsx("option", { value: "gpt-4", children: "GPT-4" }), _jsx("option", { value: "gpt-4-turbo", children: "GPT-4 Turbo" }), _jsx("option", { value: "gpt-3.5-turbo", children: "GPT-3.5 Turbo" }), _jsx("option", { value: "claude-3-opus", children: "Claude 3 Opus" }), _jsx("option", { value: "claude-3-sonnet", children: "Claude 3 Sonnet" }), _jsx("option", { value: "claude-3-haiku", children: "Claude 3 Haiku" }), _jsx("option", { value: "gemini-1.5-pro", children: "Gemini 1.5 Pro" }), _jsx("option", { value: "mistral-large", children: "Mistral Large" })] })] }), routing.routingDecision.shouldSwitch && (_jsxs("div", { style: { marginTop: '10px', padding: '10px', background: '#fff3cd', borderRadius: '4px' }, children: ["\uD83D\uDCA1 Recommendation: Switch to ", routing.routingDecision.recommendedModel, _jsx("br", {}), _jsx("small", { children: routing.routingDecision.reasoning })] }))] }), _jsx("div", { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '10px', minHeight: '300px', marginBottom: '20px' }, children: optimizer.optimizedMessages.map((msg) => (_jsxs("div", { style: {
                                marginBottom: '10px',
                                padding: '8px',
                                background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                                borderRadius: '4px',
                            }, children: [_jsxs("strong", { children: [msg.role, ":"] }), ' ', typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content), msg.metadata?.compressed && (_jsxs("span", { style: { fontSize: '12px', color: '#666', marginLeft: '10px' }, children: ["[Compressed: ", msg.metadata.compressionType, "]"] }))] }, msg.id))) }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx("input", { type: "text", value: userInput, onChange: (e) => setUserInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Type a message...", style: { flex: 1, padding: '8px' } }), _jsx("button", { onClick: handleSend, disabled: optimizer.isOptimizing, children: optimizer.isOptimizing ? 'Optimizing...' : 'Send' })] })] }), _jsxs("div", { style: { width: '400px', border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }, children: [_jsx("h3", { children: "Optimization Debug Panel" }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { children: "Token Statistics" }), _jsxs("div", { children: [_jsxs("div", { children: ["Input Tokens: ", optimizer.tokenStats.inputTokens] }), _jsxs("div", { children: ["Remaining Budget: ", optimizer.tokenStats.remainingBudget] }), _jsxs("div", { children: ["Utilization: ", (optimizer.tokenStats.utilization * 100).toFixed(1), "%"] }), optimizer.costEstimate && (_jsxs("div", { children: ["Cost: $", optimizer.costEstimate.totalCost.toFixed(4)] }))] })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { children: "Token Graph" }), _jsxs("div", { style: { height: '150px', border: '1px solid #ddd', padding: '10px' }, children: [, "debugger.tokenGraph.map((point, idx) => (", _jsx("div", { style: {
                                            display: 'inline-block',
                                            width: `${100 / , debugger: .tokenGraph.length
                                        } % `,
                  height: `, "$": true, ...(point.tokens / Math.max(...)), debugger: true }, idx), ".tokenGraph.map((p) => p.tokens))) * 100}%`, background: '#4CAF50', marginRight: '2px', verticalAlign: 'bottom', }} title=", `${point.stage}: ${point.tokens} tokens`, "/> ))}"] }), _jsxs("div", { style: { fontSize: '12px', marginTop: '5px' }, children: [, "debugger.tokenGraph.map((p, idx) => (", _jsxs("span", { style: { marginRight: '10px' }, children: [p.stage, ": ", p.tokens] }, idx), "))}"] })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { children: "Optimization Stages" }), _jsxs("div", { style: { fontSize: '12px' }, children: [, "debugger.optimizationHistory.map((stage, idx) => (", _jsxs("div", { style: { marginBottom: '8px', padding: '5px', background: '#f9f9f9' }, children: [_jsx("strong", { children: stage.stage }), _jsx("br", {}), stage.tokensBefore, " \u2192 ", stage.tokensAfter, " tokens", stage.tokensSaved > 0 && (_jsxs("span", { style: { color: '#4CAF50' }, children: [" (-", stage.tokensSaved, ")"] })), stage.duration && _jsxs("span", { style: { color: '#666' }, children: [" [", stage.duration, "ms]"] }), stage.details.length > 0 && (_jsx("ul", { style: { margin: '5px 0', paddingLeft: '20px' }, children: stage.details.map((detail, i) => (_jsx("li", { children: detail }, i))) }))] }, idx), "))}"] })] }), , "debugger.compressionLogs.length > 0 && (", _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { children: "Compression Logs" }), _jsxs("div", { style: { fontSize: '12px' }, children: [, "debugger.compressionLogs.map((log, idx) => (", _jsxs("div", { style: { marginBottom: '5px', padding: '5px', background: '#fff3cd' }, children: [_jsx("strong", { children: log.messageId }), _jsx("br", {}), log.originalLength, " \u2192 ", log.compressedLength, " tokens", _jsx("br", {}), "Ratio: ", (log.compressionRatio * 100).toFixed(1), "% (", log.compressionType, ")", log.originalCount && (_jsxs(_Fragment, { children: [_jsx("br", {}), "Grouped ", log.originalCount, " messages"] }))] }, idx), "))}"] })] }), ")}", _jsxs("div", { children: [_jsx("h4", { children: "Summary" }), _jsxs("div", { style: { fontSize: '12px' }, children: [_jsxs("div", { children: ["Total Stages: ", , "debugger.summary.totalStages}"] }), _jsxs("div", { children: ["Tokens Saved: ", , "debugger.summary.totalTokensSaved}"] }), _jsxs("div", { children: ["Compression Ratio: ", (), "debugger.summary.compressionRatio * 100).toFixed(1)}%"] }), _jsxs("div", { children: ["Duration: ", , "debugger.summary.optimizationDuration}ms"] }), _jsxs("div", { children: ["Optimized: ", , "debugger.summary.wasOptimized ? 'Yes' : 'No'}"] })] })] })] })] }));
}
/**
 * Example: Using Toon DSL with Advanced Features
 */
export function ToonDSLAdvancedExample() {
    const [variables, setVariables] = React.useState({
        userName: 'Alice',
        userQuery: 'What is the weather today?',
    });
    // Create a toon prompt with importance tags and compression hints
    const toonPrompt = React.useMemo(() => toon()
        .roleWithMetadata('system', (b) => b.text('You are a helpful assistant.')
        .importantText('Always be concise and accurate.', 8)
        .text('Provide clear, actionable responses.'), { importance: 9, compressStrategy: 'none' })
        .scopedSection('UserContext', 'user-context', (b) => b.variable('userName').text(' is asking: ').variable('userQuery'), { importance: 5, compressible: true })
        .longResponse('assistant', (b) => b.variable('response'), 'semantic')
        .build(), []);
    const optimizer = usePromptOptimizer({
        toon: toonPrompt,
        variables,
        model: 'gpt-4',
        targetTokens: 2000,
        autoOptimize: true,
    });
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h2", { children: "Toon DSL with Advanced Features" }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("label", { children: ["User Name:", ' ', _jsx("input", { value: variables.userName, onChange: (e) => setVariables({ ...variables, userName: e.target.value }) })] }), _jsx("br", {}), _jsxs("label", { children: ["Query:", ' ', _jsx("input", { value: variables.userQuery, onChange: (e) => setVariables({ ...variables, userQuery: e.target.value }), style: { width: '300px' } })] })] }), _jsxs("div", { children: [_jsxs("h3", { children: ["Optimized Messages (", optimizer.tokenStats.inputTokens, " tokens)"] }), optimizer.optimizedMessages.map((msg) => (_jsxs("div", { style: { marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }, children: [_jsxs("strong", { children: [msg.role, ":"] }), ' ', typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)] }, msg.id)))] }), optimizer.diagnostics.wasOptimized && (_jsxs("div", { style: { marginTop: '20px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }, children: [_jsx("strong", { children: "Optimization Applied:" }), " ", optimizer.diagnostics.reason, _jsx("br", {}), _jsxs("small", { children: ["Saved ", optimizer.diagnostics.totalTokensSaved, " tokens"] })] }))] }));
}
/**
 * Example: Model Switching Visualization
 */
export function ModelSwitchingExample() {
    const [messages, setMessages] = React.useState([]);
    const [selectedModel, setSelectedModel] = React.useState('gpt-4');
    const [costBudget, setCostBudget] = React.useState(0.1);
    const routing = useDynamicModelRouting({
        currentModel: selectedModel,
        targetTokens: 4000,
        costBudget,
        messages,
    });
    const availableModels = routing.getAvailableModels();
    const modelsInBudget = routing.getModelsWithinBudget(costBudget, 4000);
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h2", { children: "Dynamic Model Routing" }), _jsx("div", { style: { marginBottom: '20px' }, children: _jsxs("label", { children: ["Cost Budget (USD):", ' ', _jsx("input", { type: "number", value: costBudget, onChange: (e) => setCostBudget(parseFloat(e.target.value)), step: "0.01", min: "0" })] }) }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("h3", { children: ["Current Model: ", routing.currentModelProfile.name] }), _jsxs("div", { children: ["Max Tokens: ", routing.currentModelProfile.maxTokens.toLocaleString(), _jsx("br", {}), "Cost: $", routing.currentModelProfile.costPer1K, "/1K input, $", routing.currentModelProfile.outputCostPer1K, "/1K output"] })] }), routing.routingDecision.shouldSwitch && (_jsxs("div", { style: { padding: '15px', background: '#fff3cd', borderRadius: '4px', marginBottom: '20px' }, children: [_jsx("h4", { children: "\uD83D\uDCA1 Model Switch Recommended" }), _jsxs("p", { children: [_jsx("strong", { children: "Recommended:" }), " ", routing.routingDecision.recommendedModel, _jsx("br", {}), _jsx("strong", { children: "Reason:" }), " ", routing.routingDecision.reasoning, routing.routingDecision.costSavings && (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsx("strong", { children: "Cost Savings:" }), " $", routing.routingDecision.costSavings.toFixed(4)] })), routing.routingDecision.tokenCapacityImprovement && (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsx("strong", { children: "Token Capacity Improvement:" }), ' ', routing.routingDecision.tokenCapacityImprovement.toLocaleString(), " tokens"] }))] })] })), _jsxs("div", { children: [_jsxs("h3", { children: ["Available Models (", availableModels.length, ")"] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }, children: availableModels.map((model) => (_jsxs("div", { style: {
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                background: model.name === selectedModel ? '#e3f2fd' : 'white',
                                cursor: 'pointer',
                            }, onClick: () => setSelectedModel(model.name), children: [_jsx("strong", { children: model.name }), _jsx("br", {}), "Max: ", model.maxTokens.toLocaleString(), " tokens", _jsx("br", {}), "$", model.costPer1K, "/1K input", _jsx("br", {}), "Style: ", model.optimalPromptStyle, modelsInBudget.some((m) => m.name === model.name) && (_jsx("div", { style: { marginTop: '5px', color: '#4CAF50', fontSize: '12px' }, children: "\u2713 Within budget" }))] }, model.name))) })] })] }));
}
//# sourceMappingURL=advanced-prompt-optimization-example.js.map