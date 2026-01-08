/**
 * Validation Form Component
 * Premium configuration validation with visual feedback
 * React 19 component with client-side form state management
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { useEnvValidation, useAPIKeyValidation, useChatConfigValidation, } from '../hooks/use-validation';
import { ShieldIcon, CheckIcon, AlertTriangleIcon, XCircleIcon, CheckCircleIcon, InfoIcon, KeyIcon, SettingsIcon, GlobeIcon, } from './icons';
/**
 * Validation Form Component
 * Uses client-side state management for form submission state
 */
export function ValidationForm({ className, type = 'env', showHints = true, autoValidate = false, }) {
    const envValidation = useEnvValidation();
    const apiKeyValidation = useAPIKeyValidation();
    const chatConfigValidation = useChatConfigValidation();
    // Auto-validate on mount if enabled
    React.useEffect(() => {
        if (autoValidate && type === 'env') {
            envValidation.validate();
        }
    }, [autoValidate, type]);
    const typeConfig = {
        env: {
            icon: _jsx(GlobeIcon, {}),
            title: 'Environment Validation',
            description: 'Validate your environment variables and configuration',
        },
        'api-key': {
            icon: _jsx(KeyIcon, {}),
            title: 'API Key Validation',
            description: 'Verify your AI provider API keys are correctly configured',
        },
        'chat-config': {
            icon: _jsx(SettingsIcon, {}),
            title: 'Chat Configuration',
            description: 'Validate your chat settings and model parameters',
        },
    };
    const config = typeConfig[type];
    return (_jsxs("div", { className: `validation-form ${className || ''}`, "data-testid": "validation-form", children: [_jsxs("header", { className: "validation-header", children: [_jsxs("div", { className: "validation-title", children: [config.icon, _jsx("h2", { children: config.title })] }), _jsx("p", { className: "validation-description", children: config.description })] }), _jsxs("div", { className: "validation-content", children: [type === 'env' && (_jsx(EnvValidationForm, { validation: envValidation, showHints: showHints })), type === 'api-key' && (_jsx(APIKeyValidationForm, { validation: apiKeyValidation, showHints: showHints })), type === 'chat-config' && (_jsx(ChatConfigValidationForm, { validation: chatConfigValidation, showHints: showHints }))] })] }));
}
function EnvValidationForm({ validation, showHints }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        validation.validate();
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "validation-form-inner", children: [showHints && (_jsxs("div", { className: "form-hint", children: [_jsx(InfoIcon, { size: "sm" }), _jsx("span", { children: "This will validate environment variables like API keys and configuration settings." })] })), _jsx(SubmitButton, { isPending: validation.isPending, label: "Validate Environment" }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
function APIKeyValidationForm({ validation, showHints, }) {
    const [provider, setProvider] = React.useState('openai');
    const [apiKey, setApiKey] = React.useState('');
    const [showKey, setShowKey] = React.useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        validation.validate(provider, apiKey || undefined);
    };
    const providerOptions = [
        { value: 'openai', label: 'OpenAI', color: '#10a37f' },
        { value: 'anthropic', label: 'Anthropic', color: '#d97706' },
        { value: 'google', label: 'Google AI', color: '#4285f4' },
    ];
    return (_jsxs("form", { onSubmit: handleSubmit, className: "validation-form-inner", children: [showHints && (_jsxs("div", { className: "form-hint", children: [_jsx(InfoIcon, { size: "sm" }), _jsx("span", { children: "Leave the API key field empty to use the environment variable." })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "provider", children: "Provider" }), _jsxs("div", { className: "provider-select-wrapper", children: [_jsx("select", { id: "provider", value: provider, onChange: (e) => setProvider(e.target.value), className: "provider-select", children: providerOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), _jsx("span", { className: "provider-indicator", style: {
                                    backgroundColor: providerOptions.find((p) => p.value === provider)
                                        ?.color,
                                } })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "apiKey", children: "API Key" }), _jsxs("div", { className: "api-key-input-wrapper", children: [_jsx("input", { id: "apiKey", type: showKey ? 'text' : 'password', value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "Optional - uses environment variable if empty", className: "api-key-input", autoComplete: "off" }), _jsx("button", { type: "button", className: "toggle-visibility-btn", onClick: () => setShowKey(!showKey), "aria-label": showKey ? 'Hide API key' : 'Show API key', children: showKey ? 'Hide' : 'Show' })] })] }), _jsx(SubmitButton, { isPending: validation.isPending, label: "Validate API Key" }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
function ChatConfigValidationForm({ validation, showHints, }) {
    const [config, setConfig] = React.useState({
        provider: 'openai',
        model: 'gpt-4-turbo',
        temperature: '',
        maxTokens: '',
        topP: '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        validation.validate({
            provider: config.provider,
            model: config.model,
            temperature: config.temperature
                ? parseFloat(config.temperature)
                : undefined,
            maxTokens: config.maxTokens ? parseInt(config.maxTokens) : undefined,
            topP: config.topP ? parseFloat(config.topP) : undefined,
        });
    };
    const updateConfig = (key, value) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "validation-form-inner", children: [showHints && (_jsxs("div", { className: "form-hint", children: [_jsx(InfoIcon, { size: "sm" }), _jsx("span", { children: "Configure model settings and validate the configuration." })] })), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "config-provider", children: "Provider" }), _jsxs("select", { id: "config-provider", value: config.provider, onChange: (e) => updateConfig('provider', e.target.value), children: [_jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "google", children: "Google AI" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "config-model", children: "Model" }), _jsx("input", { id: "config-model", type: "text", value: config.model, onChange: (e) => updateConfig('model', e.target.value), placeholder: "e.g., gpt-4-turbo", required: true })] })] }), _jsxs("div", { className: "form-row form-row-3", children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "config-temperature", children: ["Temperature", _jsx("span", { className: "label-hint", children: "(0-2)" })] }), _jsx("input", { id: "config-temperature", type: "number", min: "0", max: "2", step: "0.1", value: config.temperature, onChange: (e) => updateConfig('temperature', e.target.value), placeholder: "0.7" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "config-maxTokens", children: "Max Tokens" }), _jsx("input", { id: "config-maxTokens", type: "number", min: "1", value: config.maxTokens, onChange: (e) => updateConfig('maxTokens', e.target.value), placeholder: "4096" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "config-topP", children: ["Top P", _jsx("span", { className: "label-hint", children: "(0-1)" })] }), _jsx("input", { id: "config-topP", type: "number", min: "0", max: "1", step: "0.1", value: config.topP, onChange: (e) => updateConfig('topP', e.target.value), placeholder: "1.0" })] })] }), _jsx(SubmitButton, { isPending: validation.isPending, label: "Validate Configuration" }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
/**
 * Submit button component
 */
function SubmitButton({ isPending, label, }) {
    return (_jsx("button", { type: "submit", className: "dt-btn dt-btn-primary submit-btn", disabled: isPending, children: isPending ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner small", "aria-hidden": "true" }), _jsx("span", { children: "Validating..." })] })) : (_jsxs(_Fragment, { children: [_jsx(ShieldIcon, { size: "lg" }), _jsx("span", { children: label })] })) }));
}
function ValidationResults({ valid, errors, warnings, }) {
    const hasIssues = errors.length > 0 || warnings.length > 0;
    if (valid && !hasIssues) {
        return (_jsxs("div", { className: "validation-results success", role: "alert", children: [_jsxs("div", { className: "result-header", children: [_jsx(CheckCircleIcon, {}), _jsx("span", { children: "All validations passed" })] }), _jsx("p", { className: "result-description", children: "Your configuration is valid and ready to use." })] }));
    }
    return (_jsxs("div", { className: `validation-results ${valid ? 'warning' : 'error'}`, role: "alert", children: [_jsxs("div", { className: "result-header", children: [valid ? _jsx(AlertTriangleIcon, {}) : _jsx(XCircleIcon, {}), _jsx("span", { children: valid ? 'Validation passed with warnings' : 'Validation failed' })] }), errors.length > 0 && (_jsxs("div", { className: "result-section errors", children: [_jsxs("h4", { children: [_jsx(XCircleIcon, {}), "Errors (", errors.length, ")"] }), _jsx("ul", { className: "issues-list", children: errors.map((error, index) => (_jsxs("li", { className: "issue-item error", children: [_jsx("span", { className: "issue-field", children: error.field }), _jsx("span", { className: "issue-message", children: error.message })] }, index))) })] })), warnings.length > 0 && (_jsxs("div", { className: "result-section warnings", children: [_jsxs("h4", { children: [_jsx(AlertTriangleIcon, {}), "Warnings (", warnings.length, ")"] }), _jsx("ul", { className: "issues-list", children: warnings.map((warning, index) => (_jsxs("li", { className: "issue-item warning", children: [_jsx("span", { className: "issue-field", children: warning.field }), _jsx("span", { className: "issue-message", children: warning.message })] }, index))) })] }))] }));
}
//# sourceMappingURL=validation-form.js.map