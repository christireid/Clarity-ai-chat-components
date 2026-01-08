'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
const TabsContext = React.createContext({
    value: '',
    onChange: () => { },
});
export function Tabs({ defaultValue = '', value: controlledValue, onValueChange, children, className, }) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const handleChange = React.useCallback((newValue) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    }, [controlledValue, onValueChange]);
    return (_jsx(TabsContext.Provider, { value: { value, onChange: handleChange }, children: _jsx("div", { className: cn('w-full', className), children: children }) }));
}
export function TabsList({ children, className }) {
    return (_jsx("div", { role: "tablist", className: cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className), children: children }));
}
export function TabsTrigger({ value, children, className, disabled, }) {
    const context = React.useContext(TabsContext);
    const isActive = context.value === value;
    return (_jsx("button", { role: "tab", type: "button", "aria-selected": isActive, disabled: disabled, onClick: () => context.onChange(value), className: cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', isActive
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:bg-background/50', className), children: children }));
}
export function TabsContent({ value, children, className }) {
    const context = React.useContext(TabsContext);
    const isActive = context.value === value;
    if (!isActive)
        return null;
    return (_jsx("div", { role: "tabpanel", className: cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className), children: children }));
}
//# sourceMappingURL=tabs.js.map