'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import clsx from 'clsx';
export function PlaygroundControls({ controls, onChange, className, }) {
    const initialValues = controls.reduce((acc, control) => {
        acc[control.name] = control.defaultValue;
        return acc;
    }, {});
    const [values, setValues] = useState(initialValues);
    const handleChange = (name, value) => {
        const newValues = { ...values, [name]: value };
        setValues(newValues);
        onChange(newValues);
    };
    const renderControl = (control) => {
        switch (control.type) {
            case 'text':
                return (_jsx("input", { type: "text", value: values[control.name], onChange: (e) => handleChange(control.name, e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500" }));
            case 'number':
                return (_jsx("input", { type: "number", value: values[control.name], onChange: (e) => handleChange(control.name, Number(e.target.value)), min: control.min, max: control.max, step: control.step || 1, className: "w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500" }));
            case 'boolean':
                return (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: values[control.name], onChange: (e) => handleChange(control.name, e.target.checked), className: "w-4 h-4 text-brand-500 border-border rounded focus:ring-2 focus:ring-brand-500" }), _jsx("span", { className: "text-sm text-text-secondary", children: values[control.name] ? 'Enabled' : 'Disabled' })] }));
            case 'select':
                return (_jsx("select", { value: values[control.name], onChange: (e) => handleChange(control.name, e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500", children: control.options?.map((option) => (_jsx("option", { value: option, children: option }, option))) }));
            case 'color':
                return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", value: values[control.name], onChange: (e) => handleChange(control.name, e.target.value), className: "w-12 h-10 border border-border rounded cursor-pointer" }), _jsx("input", { type: "text", value: values[control.name], onChange: (e) => handleChange(control.name, e.target.value), className: "flex-1 px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm" })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: clsx('p-6 bg-bg-secondary border border-border rounded-lg space-y-4', className), children: [_jsx("h4", { className: "font-semibold text-sm text-text-primary mb-4", children: "Playground Controls" }), controls.map((control) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-text-primary", children: control.label }), renderControl(control)] }, control.name)))] }));
}
//# sourceMappingURL=PlaygroundControls.js.map