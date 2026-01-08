'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/cn';
import { announce } from '../lib/aria';
import { ErrorMessage } from './error-message';
import { Checkbox as ShadcnCheckbox } from './ui/checkbox';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
// ============================================================================
// Component
// ============================================================================
/**
 * Enhanced Checkbox component with accessibility features
 *
 * @description
 * A fully-featured checkbox component built on Radix UI primitives with:
 * - Built-in label with proper accessibility associations
 * - Helper text and description support
 * - Error state handling
 * - Screen reader announcements for state changes
 * - Indeterminate state support
 *
 * @example
 * ```tsx
 * // Basic checkbox with label
 * <Checkbox label="Accept terms" />
 *
 * // With description
 * <Checkbox
 *   label="Marketing emails"
 *   description="Receive updates about new features and promotions"
 * />
 *
 * // With state change announcements
 * <Checkbox
 *   label="Newsletter"
 *   announceStateChange
 *   announcements={{
 *     checked: "Subscribed to newsletter",
 *     unchecked: "Unsubscribed from newsletter"
 *   }}
 * />
 * ```
 *
 * @accessibility
 * - Uses Radix UI primitives for proper keyboard navigation
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - Optional screen reader announcements for state changes
 * - Supports indeterminate state
 */
export const Checkbox = React.forwardRef(({ className, id, label, error, helperText, required, disabled, labelPosition = 'right', announceStateChange = false, announcements, description, wrapperClassName, 'aria-label': ariaLabel, checked, onCheckedChange, ...props }, ref) => {
    // Generate stable ID for label association
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helperText ? `${checkboxId}-helper` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    // Combine describedby IDs
    const describedBy = [errorId, helperId, descriptionId].filter(Boolean).join(' ') || undefined;
    // Handle state change with optional announcement
    const handleCheckedChange = React.useCallback((newChecked) => {
        if (announceStateChange) {
            const defaultAnnouncements = {
                checked: `${label || 'Checkbox'} checked`,
                unchecked: `${label || 'Checkbox'} unchecked`,
                indeterminate: `${label || 'Checkbox'} indeterminate`,
            };
            const effectiveAnnouncements = {
                ...defaultAnnouncements,
                ...announcements,
            };
            if (newChecked === true) {
                announce(effectiveAnnouncements.checked, { assertive: false });
            }
            else if (newChecked === false) {
                announce(effectiveAnnouncements.unchecked, { assertive: false });
            }
            else if (newChecked === 'indeterminate') {
                announce(effectiveAnnouncements.indeterminate, { assertive: false });
            }
        }
        onCheckedChange?.(newChecked);
    }, [announceStateChange, announcements, label, onCheckedChange]);
    const checkboxElement = (_jsx(ShadcnCheckbox, { ref: ref, id: checkboxId, disabled: disabled, checked: checked, onCheckedChange: handleCheckedChange, "aria-required": required || undefined, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-label": !label ? ariaLabel : undefined, className: cn(error && 'border-destructive focus-visible:ring-destructive/50', className), "data-slot": "checkbox", ...props }));
    // Simple checkbox without label
    if (!label) {
        return (_jsxs("div", { className: cn('inline-flex flex-col', wrapperClassName), "data-slot": "checkbox-wrapper", children: [checkboxElement, helperText && !error && (_jsx("p", { id: helperId, className: "mt-1 text-xs text-muted-foreground", "data-slot": "checkbox-helper", children: helperText })), _jsx(ErrorMessage, { error: error, id: errorId })] }));
    }
    // Checkbox with label
    return (_jsxs("div", { className: cn('flex flex-col gap-1', wrapperClassName), "data-slot": "checkbox-wrapper", children: [_jsxs("div", { className: cn('flex items-start gap-2', labelPosition === 'left' && 'flex-row-reverse justify-end'), children: [_jsx("div", { className: "mt-0.5", children: checkboxElement }), _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsxs("label", { htmlFor: checkboxId, className: cn('text-sm font-medium leading-none select-none', disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'), "data-slot": "checkbox-label", children: [label, required && (_jsx("span", { className: "text-destructive ml-0.5", "aria-hidden": "true", children: "*" }))] }), description && (_jsx("p", { id: descriptionId, className: "text-xs text-muted-foreground", "data-slot": "checkbox-description", children: description }))] })] }), helperText && !error && (_jsx("p", { id: helperId, className: "text-xs text-muted-foreground ml-6", "data-slot": "checkbox-helper", children: helperText })), _jsx(ErrorMessage, { error: error, id: errorId, className: "ml-6" })] }));
});
Checkbox.displayName = 'Checkbox';
export default Checkbox;
//# sourceMappingURL=checkbox.js.map