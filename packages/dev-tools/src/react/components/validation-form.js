/**
 * Validation Form Component
 * React 19 component with client-side form state management
 * Note: useFormStatus requires Server Actions (Next.js/Remix) - using client-side state instead
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
// Note: useFormStatus is from react-dom, but we'll use a client-side alternative
// import { useFormStatus } from 'react-dom'
import { useEnvValidation, useAPIKeyValidation, useChatConfigValidation } from '../hooks/use-validation';
/**
 * Validation Form Component
 * Uses client-side state management for form submission state
 */
export function ValidationForm({ className, type = 'env' }) {
    const envValidation = useEnvValidation();
    const apiKeyValidation = useAPIKeyValidation();
    const chatConfigValidation = useChatConfigValidation();
    const validation = type === 'env'
        ? envValidation
        : type === 'api-key'
            ? apiKeyValidation
            : chatConfigValidation;
    return (_jsxs("div", { className: className, "data-testid": "validation-form", children: [_jsx("h2", { children: "Configuration Validation" }), type === 'env' && (_jsx(EnvValidationForm, { validation: envValidation })), type === 'api-key' && (_jsx(APIKeyValidationForm, { validation: apiKeyValidation })), type === 'chat-config' && (_jsx(ChatConfigValidationForm, { validation: chatConfigValidation }))] }));
}
function EnvValidationForm({ validation }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        validation.validate();
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx(SubmitButton, { isPending: validation.isPending }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
function APIKeyValidationForm({ validation }) {
    const [provider, setProvider] = React.useState('openai');
    const [apiKey, setApiKey] = React.useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        validation.validate(provider, apiKey || undefined);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Provider:", _jsxs("select", { value: provider, onChange: (e) => setProvider(e.target.value), children: [_jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "google", children: "Google" })] })] }) }), _jsx("div", { className: "form-group", children: _jsxs("label", { children: ["API Key:", _jsx("input", { type: "password", value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "Optional - uses environment variable if not provided" })] }) }), _jsx(SubmitButton, { isPending: validation.isPending }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
function ChatConfigValidationForm({ validation }) {
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
            temperature: config.temperature ? parseFloat(config.temperature) : undefined,
            maxTokens: config.maxTokens ? parseInt(config.maxTokens) : undefined,
            topP: config.topP ? parseFloat(config.topP) : undefined,
        });
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Provider:", _jsxs("select", { value: config.provider, onChange: (e) => setConfig({ ...config, provider: e.target.value }), children: [_jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "google", children: "Google" })] })] }) }), _jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Model:", _jsx("input", { type: "text", value: config.model, onChange: (e) => setConfig({ ...config, model: e.target.value }), required: true })] }) }), _jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Temperature (0-2):", _jsx("input", { type: "number", min: "0", max: "2", step: "0.1", value: config.temperature, onChange: (e) => setConfig({ ...config, temperature: e.target.value }) })] }) }), _jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Max Tokens:", _jsx("input", { type: "number", min: "1", value: config.maxTokens, onChange: (e) => setConfig({ ...config, maxTokens: e.target.value }) })] }) }), _jsx("div", { className: "form-group", children: _jsxs("label", { children: ["Top P (0-1):", _jsx("input", { type: "number", min: "0", max: "1", step: "0.1", value: config.topP, onChange: (e) => setConfig({ ...config, topP: e.target.value }) })] }) }), _jsx(SubmitButton, { isPending: validation.isPending }), validation.result && (_jsx(ValidationResults, { valid: validation.isValid, errors: validation.errors, warnings: validation.warnings }))] }));
}
function SubmitButton({ isPending }) {
    // Note: useFormStatus requires Server Actions - using isPending prop instead
    // const { pending } = useFormStatus()
    return (_jsx("button", { type: "submit", disabled: isPending, children: isPending ? 'Validating...' : 'Validate' }));
}
function ValidationResults({ valid, errors, warnings }) {
    if (valid && warnings.length === 0) {
        return (_jsx("div", { className: "validation-results success", children: _jsx("p", { children: "\u2705 All validations passed" }) }));
    }
    return (_jsxs("div", { className: `validation-results ${valid ? 'warning' : 'error'}`, children: [errors.length > 0 && (_jsxs("div", { className: "errors", children: [_jsx("h4", { children: "Errors:" }), _jsx("ul", { children: errors.map((error, index) => (_jsxs("li", { children: [_jsxs("strong", { children: [error.field, ":"] }), " ", error.message] }, index))) })] })), warnings.length > 0 && (_jsxs("div", { className: "warnings", children: [_jsx("h4", { children: "Warnings:" }), _jsx("ul", { children: warnings.map((warning, index) => (_jsxs("li", { children: [_jsxs("strong", { children: [warning.field, ":"] }), " ", warning.message] }, index))) })] }))] }));
}
//# sourceMappingURL=validation-form.js.map