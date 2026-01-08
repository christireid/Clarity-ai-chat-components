/**
 * Confirmation Dialog Component
 * Accessible modal dialog for confirming destructive actions
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { AlertTriangleIcon, CloseIcon } from './icons';
import { LoadingButton } from './loading-state';
/**
 * Confirmation Dialog Component
 * Modal dialog for confirming actions with accessibility support
 */
export function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default', className, isLoading = false, icon, }) {
    const dialogRef = React.useRef(null);
    const previousActiveElement = React.useRef(null);
    // Handle escape key
    React.useEffect(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, isLoading]);
    // Focus management
    React.useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            // Focus the dialog after a brief delay for animation
            setTimeout(() => {
                dialogRef.current?.focus();
            }, 50);
        }
        else {
            // Restore focus when closing
            previousActiveElement.current?.focus();
        }
    }, [isOpen]);
    // Lock body scroll when open
    React.useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
        return undefined;
    }, [isOpen]);
    // Handle confirm
    const handleConfirm = async () => {
        await onConfirm();
    };
    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    const defaultIcon = variant === 'danger' ? _jsx(AlertTriangleIcon, { size: "lg" }) : null;
    return (_jsx("div", { className: `confirmation-dialog-overlay ${className || ''}`, onClick: handleBackdropClick, role: "presentation", children: _jsxs("div", { ref: dialogRef, className: `confirmation-dialog confirmation-dialog-${variant}`, role: "alertdialog", "aria-modal": "true", "aria-labelledby": "confirmation-dialog-title", "aria-describedby": "confirmation-dialog-description", tabIndex: -1, children: [_jsxs("header", { className: "confirmation-dialog-header", children: [(icon || defaultIcon) && (_jsx("div", { className: `confirmation-dialog-icon confirmation-dialog-icon-${variant}`, children: icon || defaultIcon })), _jsx("h2", { id: "confirmation-dialog-title", className: "confirmation-dialog-title", children: title }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon confirmation-dialog-close", onClick: onClose, "aria-label": "Close dialog", disabled: isLoading, children: _jsx(CloseIcon, { size: 20 }) })] }), _jsx("div", { id: "confirmation-dialog-description", className: "confirmation-dialog-body", children: _jsx("p", { children: message }) }), _jsxs("footer", { className: "confirmation-dialog-footer", children: [_jsx("button", { className: "dt-btn dt-btn-ghost", onClick: onClose, disabled: isLoading, children: cancelText }), _jsx(LoadingButton, { variant: variant === 'danger' ? 'danger' : 'primary', onClick: handleConfirm, isLoading: isLoading, loadingText: confirmText, children: confirmText })] })] }) }));
}
export function useConfirmationDialog(options) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const open = React.useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = React.useCallback(() => {
        if (!isLoading) {
            setIsOpen(false);
            options.onCancel?.();
        }
    }, [isLoading, options]);
    const confirm = React.useCallback(async () => {
        setIsLoading(true);
        try {
            await options.onConfirm();
            setIsOpen(false);
        }
        finally {
            setIsLoading(false);
        }
    }, [options]);
    return {
        isOpen,
        isLoading,
        open,
        close,
        confirm,
        dialogProps: {
            isOpen,
            isLoading,
            onClose: close,
            onConfirm: confirm,
        },
    };
}
export default ConfirmationDialog;
//# sourceMappingURL=confirmation-dialog.js.map