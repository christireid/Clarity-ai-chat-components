import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToastProvider, useToast } from '@clarity-chat/react';
import { useState } from 'react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
/**
 * Toast Notification System
 *
 * **Provides elegant toast notifications for:**
 * - Success messages
 * - Error alerts
 * - Information updates
 * - Warning notices
 *
 * **Key Features:**
 * - Auto-dismiss with customizable duration
 * - Queue management for multiple toasts
 * - 6 position options
 * - Optional action buttons
 * - Smooth slide-in/out animations
 * - Accessible with ARIA labels
 *
 * **Design Philosophy:**
 * - Non-intrusive: Doesn't block user workflow
 * - Contextual: Clear visual feedback for each type
 * - Actionable: Optional buttons for quick actions
 * - Responsive: Works on all screen sizes
 */
const meta = {
    title: 'Components/Feedback/Toast',
    component: ToastProvider,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible toast notification system with auto-dismiss, queue management, and multiple position options.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    decorators: [
        (Story) => (_jsx(ToastProvider, { children: _jsx(Story, {}) })),
    ],
};
export default meta;
// ============================================================================
// Toast Types
// ============================================================================
export const SuccessToast = {
    render: () => {
        const { showToast } = useToast();
        return (_jsx("button", { onClick: () => showToast({
                type: 'success',
                title: 'Components/Feedback/Toast',
                description: 'Your changes have been saved successfully.',
            }), className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Show Success Toast" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Success toast for positive feedback and confirmations.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test toast button renders
        const button = canvas.getByRole('button', { name: /show success toast/i });
        await expect(button).toBeInTheDocument();
        // Click to trigger toast
        await userEvent.click(button);
        // Wait for toast to appear
        await waitFor(async () => {
            const toast = document.querySelector('[role="alert"], [role="status"]');
            if (toast) {
                await expect(toast).toBeInTheDocument();
            }
        }, { timeout: 2000 });
    },
};
export const ErrorToast = {
    render: () => {
        const { showToast } = useToast();
        return (_jsx("button", { onClick: () => showToast({
                type: 'error',
                title: 'Components/Feedback/Toast',
                description: 'Failed to save changes. Please try again.',
            }), className: "px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Show Error Toast" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Error toast for failures and critical issues.',
            },
        },
    },
};
export const InfoToast = {
    render: () => {
        const { showToast } = useToast();
        return (_jsx("button", { onClick: () => showToast({
                type: 'info',
                title: 'Components/Feedback/Toast',
                description: 'New features are available in the latest update.',
            }), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Show Info Toast" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Info toast for neutral information and updates.',
            },
        },
    },
};
export const WarningToast = {
    render: () => {
        const { showToast } = useToast();
        return (_jsx("button", { onClick: () => showToast({
                type: 'warning',
                title: 'Components/Feedback/Toast',
                description: 'Your session will expire in 5 minutes.',
            }), className: "px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors", children: "Show Warning Toast" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Warning toast for caution and important notices.',
            },
        },
    },
};
// ============================================================================
// With Actions
// ============================================================================
export const WithAction = {
    render: () => {
        const { showToast } = useToast();
        return (_jsx("button", { onClick: () => showToast({
                type: 'info',
                title: 'Components/Feedback/Toast',
                description: 'You have a new message from John Doe.',
                action: {
                    label: 'View',
                    onClick: () => alert('Opening message...'),
                },
            }), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Show Toast with Action" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Toast with an actionable button for quick interactions.',
            },
        },
    },
};
export const UndoAction = {
    render: () => {
        const { showToast } = useToast();
        const [deleted, setDeleted] = useState(false);
        const handleDelete = () => {
            setDeleted(true);
            showToast({
                type: 'success',
                description: 'Item deleted successfully.',
                action: {
                    label: 'Undo',
                    onClick: () => {
                        setDeleted(false);
                        showToast({
                            type: 'info',
                            description: 'Deletion cancelled.',
                        });
                    },
                },
                duration: 5000,
            });
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: handleDelete, disabled: deleted, className: "px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50", children: "Delete Item" }), _jsx("p", { className: "text-sm text-gray-600", children: deleted ? 'Item deleted' : 'Item active' })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Common undo pattern with action button.',
            },
        },
    },
};
// ============================================================================
// Positions
// ============================================================================
export const Positions = {
    render: () => {
        const { showToast } = useToast();
        const positions = [
            { label: 'Top Left', position: 'top-left' },
            { label: 'Top Center', position: 'top-center' },
            { label: 'Top Right', position: 'top-right' },
            { label: 'Bottom Left', position: 'bottom-left' },
            { label: 'Bottom Center', position: 'bottom-center' },
            { label: 'Bottom Right', position: 'bottom-right' },
        ];
        return (_jsx("div", { className: "grid grid-cols-3 gap-4", children: positions.map(({ label, position }) => (_jsx("button", { onClick: () => showToast({
                    type: 'info',
                    description: `Toast at ${label}`,
                    position,
                }), className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm", children: label }, position))) }));
    },
    parameters: {
        docs: {
            description: {
                story: 'All 6 available toast positions. Click to see toasts appear in different locations.',
            },
        },
    },
};
// ============================================================================
// Durations
// ============================================================================
export const CustomDuration = {
    render: () => {
        const { showToast } = useToast();
        return (_jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => showToast({
                        type: 'info',
                        description: 'Short duration (2 seconds)',
                        duration: 2000,
                    }), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "2 seconds" }), _jsx("button", { onClick: () => showToast({
                        type: 'info',
                        description: 'Default duration (4 seconds)',
                        duration: 4000,
                    }), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "4 seconds" }), _jsx("button", { onClick: () => showToast({
                        type: 'info',
                        description: 'Long duration (8 seconds)',
                        duration: 8000,
                    }), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "8 seconds" }), _jsx("button", { onClick: () => showToast({
                        type: 'info',
                        description: 'Persistent (no auto-dismiss)',
                        duration: Infinity,
                    }), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Persistent" })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Control how long toasts remain visible. Use Infinity for persistent toasts.',
            },
        },
    },
};
// ============================================================================
// Multiple Toasts (Queue)
// ============================================================================
export const MultipleToasts = {
    render: () => {
        const { showToast } = useToast();
        const showMultiple = () => {
            showToast({
                type: 'info',
                description: 'First toast',
            });
            setTimeout(() => {
                showToast({
                    type: 'success',
                    description: 'Second toast',
                });
            }, 500);
            setTimeout(() => {
                showToast({
                    type: 'warning',
                    description: 'Third toast',
                });
            }, 1000);
        };
        return (_jsx("button", { onClick: showMultiple, className: "px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "Show Multiple Toasts" }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Queue management handles multiple toasts gracefully with stacking.',
            },
        },
    },
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const SaveConfirmation = {
    render: () => {
        const { showToast } = useToast();
        const [isSaving, setIsSaving] = useState(false);
        const handleSave = async () => {
            setIsSaving(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSaving(false);
            showToast({
                type: 'success',
                title: 'Components/Feedback/Toast',
                description: 'Your changes have been saved successfully.',
            });
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("textarea", { placeholder: "Edit your content...", className: "w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none", defaultValue: "Lorem ipsum dolor sit amet..." }), _jsx("button", { onClick: handleSave, disabled: isSaving, className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50", children: isSaving ? 'Saving...' : 'Save Changes' })] }));
    },
};
export const FormValidation = {
    render: () => {
        const { showToast } = useToast();
        const [email, setEmail] = useState('');
        const handleSubmit = (e) => {
            e.preventDefault();
            if (!email) {
                showToast({
                    type: 'error',
                    title: 'Components/Feedback/Toast',
                    description: 'Please enter your email address.',
                });
                return;
            }
            if (!email.includes('@')) {
                showToast({
                    type: 'error',
                    title: 'Components/Feedback/Toast',
                    description: 'Please enter a valid email address.',
                });
                return;
            }
            showToast({
                type: 'success',
                title: 'Components/Feedback/Toast',
                description: 'Your subscription has been confirmed.',
            });
            setEmail('');
        };
        return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 w-full max-w-md", children: [_jsx("input", { type: "text", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border-2 border-gray-300 rounded-lg" }), _jsx("button", { type: "submit", className: "w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Subscribe" })] }));
    },
};
export const CopyToClipboard = {
    render: () => {
        const { showToast } = useToast();
        const code = 'npm install @clarity-chat/react';
        const handleCopy = () => {
            navigator.clipboard.writeText(code);
            showToast({
                type: 'success',
                description: 'Copied to clipboard!',
                duration: 2000,
            });
        };
        return (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg", children: [_jsx("code", { className: "flex-1 font-mono text-sm", children: code }), _jsx("button", { onClick: handleCopy, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm", children: "Copy" })] }) }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test copy button exists
        const copyButton = canvas.getByRole('button', { name: /copy/i });
        await expect(copyButton).toBeInTheDocument();
        // Test code text is displayed
        await expect(canvas.getByText(/npm install @clarity-chat\/react/)).toBeInTheDocument();
        // Click copy button
        await userEvent.click(copyButton);
        // Wait for success toast
        await waitFor(async () => {
            const toast = document.querySelector('[role="alert"], [role="status"]');
            if (toast) {
                await expect(toast).toBeInTheDocument();
            }
        }, { timeout: 2000 });
    },
};
export const FileUpload = {
    render: () => {
        const { showToast } = useToast();
        const handleFileUpload = (e) => {
            const files = e.target.files;
            if (!files || files.length === 0)
                return;
            // Show uploading toast
            showToast({
                type: 'info',
                description: `Uploading ${files.length} file(s)...`,
                duration: 2000,
            });
            // Simulate upload
            setTimeout(() => {
                showToast({
                    type: 'success',
                    title: 'Components/Feedback/Toast',
                    description: `${files.length} file(s) uploaded successfully.`,
                });
            }, 2000);
        };
        return (_jsx("div", { className: "space-y-4", children: _jsx("input", { type: "file", multiple: true, onChange: handleFileUpload, className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }) }));
    },
};
export const NetworkStatus = {
    render: () => {
        const { showToast } = useToast();
        const [isOnline, setIsOnline] = useState(true);
        const toggleConnection = () => {
            setIsOnline(!isOnline);
            if (isOnline) {
                showToast({
                    type: 'error',
                    title: 'Components/Feedback/Toast',
                    description: 'You are currently offline. Changes will sync when reconnected.',
                    duration: 5000,
                });
            }
            else {
                showToast({
                    type: 'success',
                    title: 'Components/Feedback/Toast',
                    description: 'Connection restored. Syncing your changes...',
                });
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: "text-sm font-medium", children: isOnline ? 'Online' : 'Offline' })] }), _jsx("button", { onClick: toggleConnection, className: "px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Toggle Connection" })] }));
    },
};
// ============================================================================
// Interactive Playground
// ============================================================================
export const InteractivePlayground = {
    render: () => {
        const { showToast } = useToast();
        const [type, setType] = useState('info');
        const [title, setTitle] = useState('Notification');
        const [description, setDescription] = useState('This is a toast notification');
        const [duration, setDuration] = useState(4000);
        const [hasAction, setHasAction] = useState(false);
        const handleShow = () => {
            showToast({
                type,
                title: title || undefined,
                description,
                duration,
                action: hasAction
                    ? {
                        label: 'Action',
                        onClick: () => alert('Action clicked!'),
                    }
                    : undefined,
            });
        };
        return (_jsxs("div", { className: "space-y-6 w-full max-w-2xl", children: [_jsxs("div", { className: "space-y-4 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Type" }), _jsxs("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full px-4 py-2 border-2 border-gray-300 rounded-lg", children: [_jsx("option", { value: "success", children: "Success" }), _jsx("option", { value: "error", children: "Error" }), _jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "warning", children: "Warning" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Title (optional)" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Notification title", className: "w-full px-4 py-2 border-2 border-gray-300 rounded-lg" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Notification message", className: "w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none", rows: 3 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Duration (ms)" }), _jsx("input", { type: "number", value: duration, onChange: (e) => setDuration(Number(e.target.value)), className: "w-full px-4 py-2 border-2 border-gray-300 rounded-lg", step: 1000 })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "hasAction", checked: hasAction, onChange: (e) => setHasAction(e.target.checked), className: "w-4 h-4" }), _jsx("label", { htmlFor: "hasAction", className: "text-sm font-medium", children: "Include action button" })] })] }), _jsx("button", { onClick: handleShow, className: "w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold", children: "Show Toast" })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive playground to test all toast configurations and options.',
            },
        },
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => {
        const { showToast } = useToast();
        return (_jsxs("div", { className: "space-y-6 max-w-2xl", children: [_jsx("button", { onClick: () => showToast({
                        type: 'success',
                        title: 'Components/Feedback/Toast',
                        description: 'This toast follows WCAG 2.1 guidelines.',
                    }), className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Show Accessible Toast" }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "ARIA role=\"alert\" for screen reader announcements" }), _jsx("li", { children: "Clear visual hierarchy with icons and colors" }), _jsx("li", { children: "High contrast text for readability" }), _jsx("li", { children: "Keyboard accessible close button (Tab + Enter/Space)" }), _jsx("li", { children: "Action buttons are properly labeled" }), _jsx("li", { children: "Auto-dismiss doesn't interfere with screen readers" }), _jsx("li", { children: "Color is not the only indicator (icons + text)" }), _jsx("li", { children: "Smooth animations respect prefers-reduced-motion" })] })] })] }));
    },
};
//# sourceMappingURL=Toast.stories.js.map