'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Badge, Textarea, cn, Tabs, TabsList, TabsTrigger, TabsContent, } from '@clarity-chat/primitives';
import { getMotionSafePreset, useReducedMotion } from '../../animations';
import { usePromptPlayground, MODEL_PRICING, } from '../../prompts/hooks/use-prompt-playground';
/**
 * PromptPlayground Component
 *
 * Interactive playground for testing and experimenting with prompt templates.
 * Provides real-time rendering, token counting, cost estimation, and variable editing.
 *
 * Features:
 * - Live template editing with syntax highlighting hints
 * - Variable extraction and inline editing
 * - Real-time rendering preview
 * - Token count and cost estimation
 * - Multiple model support
 * - Template validation
 *
 * @example
 * ```tsx
 * <PromptPlayground
 *   template={myTemplate}
 *   model="gpt-4o"
 *   showCostEstimate
 *   onSave={(template) => saveTemplate(template)}
 * />
 * ```
 */
export function PromptPlayground({ template, templates = [], onTemplateChange, onSave, showModelSelector = true, showCostEstimate = true, showTokenCount = true, showValidation = true, readOnly = false, height = 600, className, ...options }) {
    const { state, setTemplate, setVariable, extractVariables, render, validate, loadTemplate, getEstimatedCost, pricing, setModel, } = usePromptPlayground({
        initialTemplate: template?.template || '',
        initialVariables: template?.variables?.reduce((acc, v) => ({ ...acc, [v.name]: v.default ?? '' }), {}),
        autoRender: true,
        ...options,
    });
    const [activeTab, setActiveTab] = React.useState('editor');
    const [selectedTemplateId, setSelectedTemplateId] = React.useState(template?.id || '');
    const [promptName, setPromptName] = React.useState(template?.name || '');
    const [promptDescription, setPromptDescription] = React.useState(template?.description || '');
    const prefersReducedMotion = useReducedMotion();
    // Extract variables from template
    const detectedVariables = React.useMemo(() => extractVariables(), [extractVariables]);
    // Validation state
    const validation = React.useMemo(() => {
        if (!showValidation)
            return { valid: true };
        return validate();
    }, [validate, showValidation]);
    // Cost estimation
    const cost = React.useMemo(() => getEstimatedCost(500), [getEstimatedCost]);
    // Handle template text change
    const handleTemplateChange = React.useCallback((value) => {
        setTemplate(value);
        onTemplateChange?.(value);
    }, [setTemplate, onTemplateChange]);
    // Handle template selection
    const handleSelectTemplate = React.useCallback((id) => {
        const selected = templates.find((t) => t.id === id);
        if (selected) {
            setSelectedTemplateId(id);
            setPromptName(selected.name);
            setPromptDescription(selected.description || '');
            loadTemplate(selected);
        }
    }, [templates, loadTemplate]);
    // Handle save
    const handleSave = React.useCallback(() => {
        if (!promptName.trim())
            return;
        const templateToSave = {
            id: selectedTemplateId || `template-${Date.now()}`,
            name: promptName,
            description: promptDescription,
            template: state.template,
            variables: detectedVariables.map((name) => ({
                name,
                type: 'string',
                required: false,
            })),
        };
        onSave?.(templateToSave);
    }, [
        promptName,
        promptDescription,
        state.template,
        detectedVariables,
        selectedTemplateId,
        onSave,
    ]);
    return (_jsxs(Card, { className: cn('flex flex-col overflow-hidden', className), style: { height: typeof height === 'number' ? `${height}px` : height }, children: [_jsxs(CardHeader, { className: "flex-shrink-0 pb-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Prompt Playground", !validation.valid && showValidation && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: "Invalid" }))] }), _jsx(CardDescription, { children: "Test and iterate on your prompts with live preview" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [showTokenCount && (_jsxs(Badge, { variant: "outline", className: "font-mono text-xs", children: [state.tokenCount, " tokens"] })), showCostEstimate && (_jsxs(Badge, { variant: "secondary", className: "font-mono text-xs", children: ["~$", cost.total.toFixed(4)] }))] })] }), _jsxs("div", { className: "flex items-center gap-3 mt-3", children: [showModelSelector && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "playground-model-select", className: "sr-only", children: "Select AI model" }), _jsx("select", { id: "playground-model-select", value: pricing.id, onChange: (e) => setModel(e.target.value), className: "text-sm border rounded px-2 py-1 bg-background", disabled: readOnly, "aria-label": "Select AI model for cost estimation", children: Object.values(MODEL_PRICING).map((m) => (_jsx("option", { value: m.id, children: m.name }, m.id))) })] })), templates.length > 0 && (_jsxs("div", { className: "flex-1 flex items-center gap-2", children: [_jsx("label", { htmlFor: "playground-template-select", className: "sr-only", children: "Select template" }), _jsxs("select", { id: "playground-template-select", value: selectedTemplateId, onChange: (e) => handleSelectTemplate(e.target.value), className: "flex-1 text-sm border rounded px-2 py-1 bg-background", disabled: readOnly, "aria-label": "Select a prompt template", children: [_jsx("option", { value: "", children: "Select a template..." }), templates.map((t) => (_jsx("option", { value: t.id, children: t.name }, t.id)))] })] }))] })] }), _jsx(CardContent, { className: "flex-1 overflow-hidden p-0", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "h-full flex flex-col", children: [_jsxs(TabsList, { className: "mx-4", children: [_jsx(TabsTrigger, { value: "editor", children: "Editor" }), _jsxs(TabsTrigger, { value: "variables", children: ["Variables (", detectedVariables.length, ")"] }), _jsx(TabsTrigger, { value: "preview", children: "Preview" })] }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [_jsx(TabsContent, { value: "editor", className: "h-full p-4 mt-0", children: _jsxs("div", { className: "h-full flex flex-col gap-3", children: [onSave && (_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "playground-prompt-name", className: "sr-only", children: "Prompt name" }), _jsx(Input, { id: "playground-prompt-name", placeholder: "Prompt name", value: promptName, onChange: (e) => setPromptName(e.target.value), className: "w-full", disabled: readOnly, "aria-label": "Prompt name", "aria-required": "true" })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "playground-prompt-description", className: "sr-only", children: "Description" }), _jsx(Input, { id: "playground-prompt-description", placeholder: "Description (optional)", value: promptDescription, onChange: (e) => setPromptDescription(e.target.value), className: "w-full", disabled: readOnly, "aria-label": "Prompt description (optional)" })] })] })), _jsxs("div", { className: "flex-1 relative", children: [_jsx("label", { htmlFor: "playground-template-editor", className: "sr-only", children: "Prompt template editor" }), _jsx(Textarea, { id: "playground-template-editor", value: state.template, onChange: (e) => handleTemplateChange(e.target.value), placeholder: "Enter your prompt template here...\n\nUse {{variable}} syntax for variables.", className: cn('h-full resize-none font-mono text-sm', 'leading-relaxed', !validation.valid && 'border-destructive'), disabled: readOnly, "aria-label": "Prompt template editor", "aria-describedby": !validation.valid
                                                            ? 'playground-validation-errors'
                                                            : undefined, "aria-invalid": !validation.valid }), state.isRendering && (_jsx("div", { className: "absolute top-2 right-2", "aria-live": "polite", children: _jsx(Badge, { variant: "secondary", className: "animate-pulse", children: "Rendering..." }) }))] }), !validation.valid && validation.errors && (_jsxs("div", { id: "playground-validation-errors", role: "alert", "aria-live": "polite", className: "text-sm text-destructive space-y-1", children: [_jsx("span", { className: "sr-only", children: "Validation errors:" }), validation.errors.map((error, i) => (_jsxs("p", { children: ["\u2022 ", error] }, i)))] })), onSave && (_jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => render(), children: "Render" }), _jsx(Button, { size: "sm", onClick: handleSave, disabled: !promptName.trim() || readOnly, children: "Save Template" })] }))] }) }), _jsx(TabsContent, { value: "variables", className: "h-full p-4 mt-0 overflow-auto", children: _jsx("div", { className: "space-y-4", role: "group", "aria-label": "Template variables", children: detectedVariables.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx("div", { className: "text-4xl mb-2", "aria-hidden": "true", children: '{ }' }), _jsx("p", { className: "text-sm", children: "No variables detected" }), _jsxs("p", { className: "text-xs mt-1", children: ["Use ", '{{variable}}', " syntax in your template"] })] })) : (_jsx(AnimatePresence, { mode: "popLayout", children: detectedVariables.map((varName, index) => {
                                                const variants = getMotionSafePreset(prefersReducedMotion, 'slideDown');
                                                return (_jsxs(motion.div, { ...variants, transition: prefersReducedMotion
                                                        ? { duration: 0 }
                                                        : { delay: index * 0.05 }, className: "space-y-1", children: [_jsxs("label", { htmlFor: `playground-var-${varName}`, className: "text-sm font-medium flex items-center gap-2", children: [_jsx("code", { className: "px-1.5 py-0.5 bg-muted rounded text-xs", "aria-hidden": "true", children: `{{${varName}}}` }), _jsxs("span", { className: "sr-only", children: ["Variable ", varName] })] }), _jsx(Input, { id: `playground-var-${varName}`, value: state.variables[varName] || '', onChange: (e) => setVariable(varName, e.target.value), placeholder: `Enter value for ${varName}`, disabled: readOnly, "aria-label": `Value for variable ${varName}` })] }, varName));
                                            }) })) }) }), _jsx(TabsContent, { value: "preview", className: "h-full p-4 mt-0 overflow-auto", children: _jsxs("div", { className: "space-y-4", children: [showCostEstimate && (_jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-3 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Input" }), _jsxs("p", { className: "text-lg font-semibold font-mono", children: ["$", cost.input.toFixed(5)] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-3 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Output (est.)" }), _jsxs("p", { className: "text-lg font-semibold font-mono", children: ["$", cost.output.toFixed(5)] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-3 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Total" }), _jsxs("p", { className: "text-lg font-semibold font-mono text-primary", children: ["$", cost.total.toFixed(5)] })] }) })] })), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { id: "playground-output-label", className: "text-sm font-medium", children: "Rendered Output" }), _jsxs(Badge, { variant: "outline", className: "font-mono text-xs", children: [_jsx("span", { className: "sr-only", children: "Token count:" }), state.tokenCount, " tokens"] })] }), _jsx("div", { role: "region", "aria-labelledby": "playground-output-label", "aria-live": "polite", className: cn('p-4 rounded-lg border bg-muted/30', 'font-mono text-sm whitespace-pre-wrap', 'min-h-[200px] max-h-[400px] overflow-auto'), children: state.output || (_jsx("span", { className: "text-muted-foreground italic", children: "No output yet. Edit template and variables to see preview." })) })] }), state.errors.length > 0 && (_jsxs("div", { role: "alert", "aria-live": "assertive", className: "p-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [_jsx("h4", { className: "text-sm font-medium text-destructive mb-2", children: "Errors" }), _jsx("ul", { className: "text-sm text-destructive space-y-1", "aria-label": "Render errors", children: state.errors.map((error, i) => (_jsxs("li", { children: ["\u2022 ", error] }, i))) })] }))] }) })] })] }) })] }));
}
PromptPlayground.displayName = 'PromptPlayground';
//# sourceMappingURL=prompt-playground.js.map