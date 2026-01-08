'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/cn';
import { ErrorMessage } from './error-message';
import { Switch as BaseSwitch } from './ui/switch';
export const Switch = React.forwardRef(({ id, label, description, error, className, containerClassName, labelSrOnly = false, align = 'center', name, value, required, disabled, checked, defaultChecked, onChange, onCheckedChange, ...rest }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;
    const labelId = label ? `${switchId}-label` : undefined;
    const descriptionId = description ? `${switchId}-description` : undefined;
    const errorId = error ? `${switchId}-error` : undefined;
    const hiddenInputRef = React.useRef(null);
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const resolvedChecked = (isControlled ? checked : internalChecked) ?? false;
    React.useEffect(() => {
        if (!isControlled && defaultChecked !== undefined) {
            setInternalChecked(defaultChecked);
        }
    }, [defaultChecked, isControlled]);
    React.useEffect(() => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.checked = !!resolvedChecked;
        }
    }, [resolvedChecked]);
    const emitNativeChange = React.useCallback((nextState) => {
        if (!onChange || !hiddenInputRef.current) {
            return;
        }
        hiddenInputRef.current.checked = nextState;
        const syntheticEvent = {
            target: hiddenInputRef.current,
            currentTarget: hiddenInputRef.current,
            bubbles: true,
            cancelable: false,
            defaultPrevented: false,
            isTrusted: false,
            preventDefault() { },
            stopPropagation() { },
            nativeEvent: undefined,
            eventPhase: 0,
            isDefaultPrevented: () => false,
            isPropagationStopped: () => false,
            persist: () => { },
            timeStamp: Date.now(),
            type: 'change',
        };
        onChange(syntheticEvent);
    }, [onChange]);
    const handleCheckedChange = (nextState) => {
        if (!isControlled) {
            setInternalChecked(nextState);
        }
        onCheckedChange?.(nextState);
        emitNativeChange(nextState);
    };
    const describedByIds = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
    const hiddenInput = (_jsx("input", { ref: hiddenInputRef, type: "checkbox", tabIndex: -1, "aria-hidden": "true", name: name, value: value ?? 'on', required: required, disabled: disabled, className: "sr-only", "data-switch-hidden-input": true, readOnly: true }));
    return (_jsxs("div", { className: cn('space-y-1.5', containerClassName), children: [_jsxs("div", { className: cn('flex items-center justify-between gap-4', align === 'start' && 'items-start'), children: [(label || description) && (_jsxs("div", { className: "flex-1", children: [label && (_jsx("label", { id: labelId, htmlFor: switchId, className: cn('text-sm font-medium text-foreground', labelSrOnly && 'sr-only'), children: label })), description && (_jsx("p", { id: descriptionId, className: cn('text-xs text-muted-foreground mt-1', labelSrOnly && 'mt-0'), children: description }))] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BaseSwitch, { id: switchId, ref: ref, disabled: disabled, "aria-required": required || undefined, "aria-labelledby": labelId, "aria-describedby": describedByIds, checked: resolvedChecked, onCheckedChange: handleCheckedChange, className: className, ...rest }), hiddenInput] })] }), _jsx(ErrorMessage, { error: error, id: errorId })] }));
});
Switch.displayName = 'Switch';
//# sourceMappingURL=switch.js.map