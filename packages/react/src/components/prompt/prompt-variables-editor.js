'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Badge, Checkbox, cn, } from '@clarity-chat/primitives';
import { getMotionSafePreset, useReducedMotion } from '../../animations';
/**
 * Available variable types
 */
const VARIABLE_TYPES = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
];
/**
 * Extract variables from template
 */
function extractVariablesFromTemplate(template) {
    const pattern = /\{\{\s*([\w.]+)\s*\}\}/g;
    const variables = new Set();
    let match;
    while ((match = pattern.exec(template)) !== null) {
        if (match[1]) {
            variables.add(match[1]);
        }
    }
    return Array.from(variables);
}
/**
 * Generate unique key
 */
function generateKey() {
    return `var-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
/**
 * PromptVariablesEditor Component
 *
 * Edit and manage prompt template variables with drag-and-drop reordering,
 * type selection, validation, and auto-detection from templates.
 *
 * Features:
 * - Add, edit, remove variables
 * - Drag-and-drop reordering
 * - Auto-detect variables from template
 * - Type selection (string, number, boolean, array, object)
 * - Required/optional toggle
 * - Default value editing
 * - Description field
 *
 * @example
 * ```tsx
 * const [variables, setVariables] = useState<PromptVariable[]>([])
 *
 * <PromptVariablesEditor
 *   variables={variables}
 *   onChange={setVariables}
 *   template="Hello {{name}}, you are {{age}} years old."
 *   autoDetect
 *   allowReorder
 * />
 * ```
 */
export function PromptVariablesEditor({ variables, onChange, template, autoDetect = true, allowReorder = true, allowAdd = true, allowRemove = true, showTypes = true, showValidation: _showValidation = false, readOnly = false, className, }) {
    // Convert variables to editable format with keys
    const [editableVariables, setEditableVariables] = React.useState(() => variables.map((v) => ({
        ...v,
        _key: generateKey(),
    })));
    // Track detected variables
    const detectedVarNames = React.useMemo(() => {
        if (!template || !autoDetect)
            return [];
        return extractVariablesFromTemplate(template);
    }, [template, autoDetect]);
    // Emit change to parent - defined first to avoid circular dependency
    const emitChange = React.useCallback((vars) => {
        // Strip internal _key before emitting
        const cleaned = vars.map(({ _key, ...rest }) => rest);
        onChange(cleaned);
    }, [onChange]);
    // Ref to track if we should emit changes (to avoid emitting during sync)
    const shouldEmitRef = React.useRef(false);
    // Sync with external variables prop
    React.useEffect(() => {
        setEditableVariables((prevEditableVars) => {
            return variables.map((v) => {
                const existing = prevEditableVars.find((ev) => ev.name === v.name);
                return {
                    ...v,
                    _key: existing?._key || generateKey(),
                };
            });
        });
    }, [variables]);
    // Auto-detect and add missing variables
    React.useEffect(() => {
        if (!autoDetect || !template)
            return;
        const existingNames = new Set(editableVariables.map((v) => v.name));
        const newVars = [];
        detectedVarNames.forEach((name) => {
            if (!existingNames.has(name)) {
                newVars.push({
                    name,
                    type: 'string',
                    required: false,
                    _key: generateKey(),
                });
            }
        });
        if (newVars.length > 0) {
            const updated = [...editableVariables, ...newVars];
            setEditableVariables(updated);
            shouldEmitRef.current = true;
        }
    }, [detectedVarNames, autoDetect, template]); // Intentionally exclude editableVariables to avoid infinite loop
    // Emit changes after auto-detection updates
    React.useEffect(() => {
        if (shouldEmitRef.current) {
            shouldEmitRef.current = false;
            emitChange(editableVariables);
        }
    }, [editableVariables, emitChange]);
    // Update variable
    const updateVariable = React.useCallback((key, updates) => {
        const updated = editableVariables.map((v) => v._key === key ? { ...v, ...updates } : v);
        setEditableVariables(updated);
        emitChange(updated);
    }, [editableVariables, emitChange]);
    // Add new variable
    const addVariable = React.useCallback(() => {
        const newVar = {
            name: `variable${editableVariables.length + 1}`,
            type: 'string',
            required: false,
            _key: generateKey(),
        };
        const updated = [...editableVariables, newVar];
        setEditableVariables(updated);
        emitChange(updated);
    }, [editableVariables, emitChange]);
    // Remove variable
    const removeVariable = React.useCallback((key) => {
        const updated = editableVariables.filter((v) => v._key !== key);
        setEditableVariables(updated);
        emitChange(updated);
    }, [editableVariables, emitChange]);
    // Handle reorder
    const handleReorder = React.useCallback((newOrder) => {
        setEditableVariables(newOrder);
        emitChange(newOrder);
    }, [emitChange]);
    // Check if variable is detected in template
    const isDetected = React.useCallback((name) => detectedVarNames.includes(name), [detectedVarNames]);
    // Find untracked variables
    const untrackedVariables = React.useMemo(() => {
        const trackedNames = new Set(editableVariables.map((v) => v.name));
        return detectedVarNames.filter((name) => !trackedNames.has(name));
    }, [editableVariables, detectedVarNames]);
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs(Card, { className: cn('', className), children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Variables", _jsx(Badge, { variant: "secondary", children: editableVariables.length })] }), _jsx(CardDescription, { children: "Define variables for your prompt template" })] }), allowAdd && !readOnly && (_jsx(Button, { size: "sm", onClick: addVariable, children: "+ Add Variable" }))] }), untrackedVariables.length > 0 && (_jsx("div", { className: "mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg", children: _jsxs("p", { className: "text-xs text-yellow-600 dark:text-yellow-400", children: [_jsx("strong", { children: "Detected in template:" }), ' ', untrackedVariables.map((name) => `{{${name}}}`).join(', ')] }) }))] }), _jsx(CardContent, { children: editableVariables.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx("div", { className: "text-5xl mb-3", children: "\uD83D\uDCDD" }), _jsx("p", { className: "text-sm font-medium", children: "No variables defined" }), _jsx("p", { className: "text-xs mt-1", children: autoDetect
                                ? 'Variables will be auto-detected from your template'
                                : 'Add variables to use in your template' }), allowAdd && !readOnly && (_jsx(Button, { variant: "outline", size: "sm", onClick: addVariable, className: "mt-4", children: "Add First Variable" }))] })) : (_jsx(Reorder.Group, { axis: "y", values: editableVariables, onReorder: handleReorder, className: "space-y-3", children: _jsx(AnimatePresence, { children: editableVariables.map((variable) => (_jsx(Reorder.Item, { value: variable, disabled: !allowReorder || readOnly, className: "list-none", children: _jsxs(motion.div, { ...getMotionSafePreset(prefersReducedMotion, 'slideDown'), transition: prefersReducedMotion ? { duration: 0 } : undefined, className: cn('p-4 border rounded-lg', 'bg-card hover:bg-accent/5', 'transition-colors duration-150', allowReorder &&
                                    !readOnly &&
                                    'cursor-grab active:cursor-grabbing'), children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [allowReorder && !readOnly && (_jsx("div", { className: "text-muted-foreground cursor-grab", children: "\u22EE\u22EE" })), _jsx("div", { className: "flex-1", children: _jsx(Input, { id: `name-${variable._key}`, value: variable.name, onChange: (e) => updateVariable(variable._key, {
                                                        name: e.target.value.replace(/\s/g, '_'),
                                                    }), placeholder: "Variable name", className: "font-mono text-sm", disabled: readOnly, "aria-label": "Variable name" }) }), isDetected(variable.name) && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "In template" })), allowRemove && !readOnly && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => removeVariable(variable._key), className: "text-destructive hover:text-destructive", "aria-label": `Remove variable ${variable.name}`, children: "\u2715" }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [showTypes && (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: `type-${variable._key}`, className: "text-xs text-muted-foreground", children: "Type" }), _jsx("select", { id: `type-${variable._key}`, value: variable.type || 'string', onChange: (e) => updateVariable(variable._key, {
                                                            type: e.target.value,
                                                        }), className: "w-full text-sm border rounded px-2 py-1.5 bg-background", disabled: readOnly, "aria-label": `Type for ${variable.name}`, children: VARIABLE_TYPES.map((type) => (_jsx("option", { value: type.value, children: type.label }, type.value))) })] })), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: `default-${variable._key}`, className: "text-xs text-muted-foreground", children: "Default Value" }), _jsx(Input, { id: `default-${variable._key}`, value: variable.default !== undefined
                                                            ? String(variable.default)
                                                            : '', onChange: (e) => updateVariable(variable._key, {
                                                            default: e.target.value || undefined,
                                                        }), placeholder: "Optional default", className: "text-sm", disabled: readOnly, "aria-label": `Default value for ${variable.name}` })] })] }), _jsxs("div", { className: "mt-3 space-y-1", children: [_jsx("label", { htmlFor: `desc-${variable._key}`, className: "text-xs text-muted-foreground", children: "Description" }), _jsx(Input, { id: `desc-${variable._key}`, value: variable.description || '', onChange: (e) => updateVariable(variable._key, {
                                                    description: e.target.value || undefined,
                                                }), placeholder: "Describe what this variable is for", className: "text-sm", disabled: readOnly, "aria-label": `Description for ${variable.name}` })] }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsx(Checkbox, { id: `required-${variable._key}`, checked: variable.required || false, onCheckedChange: (checked) => updateVariable(variable._key, {
                                                    required: checked === true,
                                                }), disabled: readOnly }), _jsx("label", { htmlFor: `required-${variable._key}`, className: "text-sm text-muted-foreground cursor-pointer", children: "Required" })] })] }) }, variable._key))) }) })) })] }));
}
PromptVariablesEditor.displayName = 'PromptVariablesEditor';
//# sourceMappingURL=prompt-variables-editor.js.map