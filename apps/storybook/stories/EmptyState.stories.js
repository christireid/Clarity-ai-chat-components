import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmptyState, NoDataEmptyState, NoSearchResultsEmptyState, NoConversationsEmptyState, ErrorEmptyState, SuccessEmptyState, } from '@clarity-chat/react';
/**
 * Empty State Components
 *
 * **Comprehensive empty states for all scenarios:**
 * - No data or content
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 *
 * **Design Philosophy:**
 * - Clear Communication: Users always know what's happening
 * - Actionable: Provide clear next steps
 * - Delightful: Smooth animations and friendly icons
 * - Contextual: Different states for different scenarios
 */
const meta = {
    title: 'Components/EmptyState',
    component: EmptyState,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Empty state components that gracefully handle no-data scenarios with clear messaging and actionable next steps.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Main heading for the empty state',
        },
        description: {
            control: 'text',
            description: 'Supporting description text',
        },
        icon: {
            control: false,
            description: 'Custom icon element (React node)',
        },
        action: {
            control: false,
            description: 'Primary action button configuration',
        },
        secondaryAction: {
            control: false,
            description: 'Secondary action button configuration',
        },
    },
};
export default meta;
// ============================================================================
// Base Empty State
// ============================================================================
export const Default = {
    args: {
        title: 'No items found',
        description: 'Get started by creating your first item.',
        action: {
            label: 'Create Item',
            onClick: () => alert('Create clicked!'),
            variant: 'default',
        },
    },
};
// ============================================================================
// Preset Empty States
// ============================================================================
export const NoData = {
    render: () => (_jsx(NoDataEmptyState, { onAction: () => alert('Get started clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Pre-configured empty state for when there is no data to display.',
            },
        },
    },
};
export const NoSearchResults = {
    render: () => (_jsx(NoSearchResultsEmptyState, { query: "artificial intelligence", onClear: () => alert('Clear clicked!'), onTryAgain: () => alert('Try again clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Empty state shown when a search returns no results.',
            },
        },
    },
};
export const NoConversations = {
    render: () => (_jsx(NoConversationsEmptyState, { onStartConversation: () => alert('Start conversation clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Empty state for chat applications with no active conversations.',
            },
        },
    },
};
export const ErrorState = {
    render: () => (_jsx(ErrorEmptyState, { title: "Failed to load data", description: "We couldn't load the requested content. Please try again.", onRetry: () => alert('Retry clicked!'), onGoBack: () => alert('Go back clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Error state with retry and navigation options.',
            },
        },
    },
};
export const SuccessState = {
    render: () => (_jsx(SuccessEmptyState, { title: "All done!", description: "You've completed all tasks. Great job!", onContinue: () => alert('Continue clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Success state to celebrate completion or achievements.',
            },
        },
    },
};
// ============================================================================
// Variations
// ============================================================================
export const WithoutDescription = {
    args: {
        title: 'No messages',
        action: {
            label: 'Send a message',
            onClick: () => console.log('Action clicked'),
        },
    },
};
export const WithoutAction = {
    args: {
        title: 'Loading complete',
        description: 'All your data has been successfully loaded.',
    },
};
export const WithSecondaryAction = {
    args: {
        title: 'No files uploaded',
        description: 'Upload your first file to get started.',
        action: {
            label: 'Upload File',
            onClick: () => alert('Upload clicked!'),
            variant: 'default',
        },
        secondaryAction: {
            label: 'Learn More',
            onClick: () => alert('Learn more clicked!'),
        },
    },
};
export const PrimaryActionVariant = {
    args: {
        title: 'Ready to begin?',
        description: 'Click below to start your first project.',
        action: {
            label: 'Get Started',
            onClick: () => console.log('Get started!'),
            variant: 'primary',
        },
    },
};
export const DestructiveActionVariant = {
    args: {
        title: 'Delete all data?',
        description: 'This action cannot be undone. All your data will be permanently deleted.',
        action: {
            label: 'Delete Everything',
            onClick: () => alert('Delete clicked!'),
            variant: 'destructive',
        },
        secondaryAction: {
            label: 'Cancel',
            onClick: () => alert('Cancelled'),
        },
    },
};
export const SuccessActionVariant = {
    args: {
        title: 'Setup Complete',
        description: 'Your account has been successfully configured.',
        action: {
            label: 'Continue to Dashboard',
            onClick: () => console.log('Continue clicked'),
            variant: 'success',
        },
    },
};
// ============================================================================
// Real-World Scenarios
// ============================================================================
export const EmptyInbox = {
    render: () => (_jsx(NoDataEmptyState, { title: "Inbox Zero! \uD83C\uDF89", description: "You're all caught up. There are no new messages to review.", actionLabel: "Compose Message", onAction: () => alert('Compose clicked!') })),
    parameters: {
        docs: {
            description: {
                story: 'Empty state for an inbox with no messages.',
            },
        },
    },
};
export const NoNotifications = {
    render: () => (_jsx(EmptyState, { title: "No notifications", description: "You're all caught up! We'll notify you when something new happens." })),
};
export const NoFavorites = {
    render: () => (_jsx(EmptyState, { title: "No favorites yet", description: "Items you mark as favorite will appear here for quick access.", action: {
            label: 'Browse Items',
            onClick: () => alert('Browse clicked!'),
        } })),
};
export const NoHistory = {
    render: () => (_jsx(EmptyState, { title: "No history", description: "Your conversation history will appear here once you start chatting.", action: {
            label: 'Start New Chat',
            onClick: () => alert('Start chat clicked!'),
            variant: 'primary',
        } })),
};
export const ConnectionError = {
    render: () => (_jsx(ErrorEmptyState, { title: "Connection lost", description: "Unable to connect to the server. Please check your internet connection and try again.", onRetry: () => alert('Retry connection') })),
};
export const PermissionDenied = {
    render: () => (_jsx(ErrorEmptyState, { title: "Access denied", description: "You don't have permission to view this content. Contact your administrator if you believe this is an error.", onGoBack: () => alert('Go back') })),
};
export const NotFound = {
    render: () => (_jsx(ErrorEmptyState, { title: "Page not found", description: "The page you're looking for doesn't exist or has been moved.", onGoBack: () => alert('Go to home') })),
};
// ============================================================================
// Animation Showcase
// ============================================================================
export const AnimatedEntry = {
    render: () => {
        const [show, setShow] = React.useState(true);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => {
                        setShow(false);
                        setTimeout(() => setShow(true), 100);
                    }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Replay Animation" }), show && (_jsx(NoDataEmptyState, { onAction: () => alert('Action clicked!') }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Watch the smooth scale and icon rotation animations on entry.',
            },
        },
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [scenario, setScenario] = React.useState('data');
        const renderState = () => {
            switch (scenario) {
                case 'data':
                    return _jsx(NoDataEmptyState, { onAction: () => console.log('Create clicked') });
                case 'search':
                    return _jsx(NoSearchResultsEmptyState, { query: "test query", onClear: () => console.log('Clear') });
                case 'conversation':
                    return _jsx(NoConversationsEmptyState, { onStartConversation: () => console.log('Start') });
                case 'error':
                    return _jsx(ErrorEmptyState, { onRetry: () => console.log('Retry') });
                case 'success':
                    return _jsx(SuccessEmptyState, { onContinue: () => console.log('Continue') });
                default:
                    return null;
            }
        };
        return (_jsxs("div", { className: "space-y-6 w-full max-w-2xl", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => setScenario('data'), className: `px-4 py-2 rounded-lg transition-colors ${scenario === 'data'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`, children: "No Data" }), _jsx("button", { onClick: () => setScenario('search'), className: `px-4 py-2 rounded-lg transition-colors ${scenario === 'search'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`, children: "No Results" }), _jsx("button", { onClick: () => setScenario('conversation'), className: `px-4 py-2 rounded-lg transition-colors ${scenario === 'conversation'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`, children: "No Chats" }), _jsx("button", { onClick: () => setScenario('error'), className: `px-4 py-2 rounded-lg transition-colors ${scenario === 'error'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`, children: "Error" }), _jsx("button", { onClick: () => setScenario('success'), className: `px-4 py-2 rounded-lg transition-colors ${scenario === 'success'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`, children: "Success" })] }), _jsx("div", { className: "min-h-[400px] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 flex items-center justify-center", children: renderState() })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing all empty state variations. Toggle between scenarios to see different states.',
            },
        },
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => (_jsxs("div", { className: "space-y-8 max-w-2xl", children: [_jsx(NoDataEmptyState, { onAction: () => console.log('Action') }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Semantic HTML structure with proper heading hierarchy" }), _jsx("li", { children: "Focusable buttons with clear labels" }), _jsx("li", { children: "ARIA attributes for screen readers" }), _jsx("li", { children: "Keyboard navigation support (Tab, Enter, Space)" }), _jsx("li", { children: "High contrast color scheme" }), _jsx("li", { children: "Clear visual hierarchy with proper spacing" }), _jsx("li", { children: "Smooth animations respect prefers-reduced-motion" })] })] })] })),
};
//# sourceMappingURL=EmptyState.stories.js.map