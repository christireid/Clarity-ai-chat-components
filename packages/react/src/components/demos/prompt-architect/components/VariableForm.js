'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * VariableForm Component
 *
 * Auto-generates input fields based on detected variables.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { VariableField } from './VariableField';
/**
 * Dynamic form for template variables
 */
export function VariableForm({ variables, values, onChange, disabled = false, showTypeHints = true, className, }) {
    if (variables.length === 0) {
        return (_jsxs("div", { className: cn('p-4 text-center text-muted-foreground', className), children: [_jsx("p", { className: "text-sm", children: "No variables detected" }), _jsxs("p", { className: "text-xs mt-1", children: ["Add", ' ', _jsx("code", { className: "px-1 py-0.5 bg-muted rounded text-cyan-600 dark:text-cyan-400", children: '{{ variable }}' }), ' ', "to your prompts"] })] }));
    }
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-foreground", children: "Variables" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [variables.length, " detected"] })] }), _jsx("div", { className: "space-y-3", children: variables.map((variable) => (_jsx(VariableField, { variable: variable, value: values[variable.name] ?? '', onChange: (value) => onChange(variable.name, value), disabled: disabled, showTypeHint: showTypeHints }, variable.name))) }), variables.length > 0 && (_jsx("button", { type: "button", onClick: () => {
                    for (const v of variables) {
                        onChange(v.name, '');
                    }
                }, disabled: disabled, className: cn('w-full py-2 text-xs text-muted-foreground', 'hover:text-foreground transition-colors', 'disabled:opacity-50 disabled:cursor-not-allowed'), children: "Clear all variables" }))] }));
}
export default VariableForm;
//# sourceMappingURL=VariableForm.js.map