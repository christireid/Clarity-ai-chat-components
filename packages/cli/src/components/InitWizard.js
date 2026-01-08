import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InitWizard - Interactive setup wizard using Ink
 */
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
const frameworks = [
    { label: '⚡ Next.js (Recommended)', value: 'nextjs' },
    { label: '💿 Remix', value: 'remix' },
    { label: '⚡ Vite + React', value: 'vite' },
    { label: '🔺 Astro', value: 'astro' },
];
const templates = [
    { label: '🎯 Basic Chat - Simple chat interface', value: 'basic' },
    { label: '🔀 Model Comparison - Compare multiple AI models', value: 'comparison' },
    { label: '📚 RAG Workbench - Document Q&A with RAG', value: 'rag' },
    { label: '📊 Analytics Console - Token tracking & analytics', value: 'analytics' },
];
const components = [
    { label: '💬 Chat Interface', value: 'chat-interface', selected: true },
    { label: '🤖 Model Selector', value: 'model-selector', selected: true },
    { label: '📊 Token Counter', value: 'token-counter', selected: false },
    { label: '📈 Cost Estimator', value: 'cost-estimator', selected: false },
    { label: '⚡ Streaming Handler', value: 'streaming-handler', selected: true },
    { label: '🔄 Retry Logic', value: 'retry-logic', selected: false },
];
export function InitWizard({ detectedFramework, packageManager, onComplete }) {
    const [step, setStep] = useState('framework');
    const [config, setConfig] = useState({
        framework: detectedFramework || '',
        template: '',
        components: ['chat-interface', 'model-selector', 'streaming-handler'],
        installDeps: true,
        initGit: true,
    });
    const handleFrameworkSelect = (item) => {
        setConfig({ ...config, framework: item.value });
        setStep('template');
    };
    const handleTemplateSelect = (item) => {
        setConfig({ ...config, template: item.value });
        setStep('components');
    };
    const handleComponentsSelect = (item) => {
        // Toggle component selection
        const components = config.components.includes(item.value)
            ? config.components.filter(c => c !== item.value)
            : [...config.components, item.value];
        setConfig({ ...config, components });
    };
    const handleConfirm = () => {
        onComplete(config);
    };
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Box, { marginBottom: 1, children: _jsx(Gradient, { name: "pastel", children: _jsx(Text, { bold: true, children: "\u2728 Clarity Chat Setup Wizard" }) }) }), step === 'framework' && (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { children: detectedFramework
                            ? `📦 Detected: ${detectedFramework} (press Enter to use or select another)`
                            : '🎯 Select your framework:' }), _jsx(Box, { marginTop: 1, children: _jsx(SelectInput, { items: frameworks, onSelect: handleFrameworkSelect }) })] })), step === 'template' && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { children: ["\u2705 Framework: ", config.framework] }), _jsx(Text, { children: "\uD83D\uDCE6 Select a template:" }), _jsx(Box, { children: _jsx(SelectInput, { items: templates, onSelect: handleTemplateSelect }) })] })), step === 'components' && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { children: ["\u2705 Framework: ", config.framework] }), _jsxs(Text, { children: ["\u2705 Template: ", config.template] }), _jsx(Text, { children: "\uD83C\uDFA8 Select components (Space to toggle, Enter to continue):" }), _jsx(Box, { children: _jsx(SelectInput, { items: components.map((c) => ({
                                ...c,
                                label: config.components.includes(c.value)
                                    ? `✅ ${c.label}`
                                    : `⬜ ${c.label}`
                            })), onSelect: handleComponentsSelect }) }), _jsx(Text, { children: "Press Enter when done selecting" }), _jsx(Box, { children: _jsx(Text, { color: "green", bold: true, children: "\u2192 Continue" }) })] })), _jsx(Box, { marginTop: 2, children: _jsxs(Text, { dimColor: true, children: ["\uD83D\uDCE6 Package Manager: ", packageManager] }) })] }));
}
//# sourceMappingURL=InitWizard.js.map