import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CommandPalette } from '@clarity-chat/react';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
/**
 * Command Palette
 *
 * **A powerful command interface for:**
 * - Quick actions and navigation
 * - Keyboard-first workflows
 * - Search and discovery
 * - Command execution
 * - Productivity shortcuts
 *
 * **Key Features:**
 * - Fuzzy search across commands
 * - Keyboard navigation (↑↓ arrows, Enter, Esc)
 * - Category grouping
 * - Keyboard shortcuts display
 * - Custom icons
 * - Fast and responsive
 *
 * **Design Philosophy:**
 * - Speed: Access any action instantly
 * - Discoverability: Find commands by searching
 * - Keyboard-First: Designed for power users
 * - Beautiful: Smooth animations and modern design
 */
const meta = {
    title: 'Components/Navigation/CommandPalette',
    component: CommandPalette,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A keyboard-first command palette for quick actions, search, and navigation with fuzzy matching and category grouping.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Whether the command palette is open',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for search input',
        },
        items: {
            control: false,
            description: 'Array of command items',
        },
    },
};
export default meta;
// ============================================================================
// Sample Commands
// ============================================================================
const basicCommands = [
    {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        shortcut: ['⌘', 'N'],
        category: 'Actions',
        onSelect: () => console.log('New chat'),
    },
    {
        id: 'search',
        label: 'Search Messages',
        description: 'Search through your message history',
        shortcut: ['⌘', 'F'],
        category: 'Actions',
        onSelect: () => console.log('Search'),
    },
    {
        id: 'settings',
        label: 'Open Settings',
        description: 'Configure your preferences',
        shortcut: ['⌘', ','],
        category: 'Navigation',
        onSelect: () => console.log('Settings'),
    },
    {
        id: 'export',
        label: 'Export Conversation',
        description: 'Download conversation as file',
        category: 'Actions',
        onSelect: () => console.log('Export'),
    },
];
// ============================================================================
// Basic Example
// ============================================================================
export const Default = {
    render: () => {
        const [open, setOpen] = useState(true);
        return (_jsxs("div", { className: "w-full", children: [_jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Open Command Palette (\u2318K)" }), _jsx(CommandPalette, { items: basicCommands, open: open, onClose: () => setOpen(false) })] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test command items render
        await expect(canvas.getByText('New Chat')).toBeInTheDocument();
        await expect(canvas.getByText('Search Messages')).toBeInTheDocument();
        await expect(canvas.getByText('Open Settings')).toBeInTheDocument();
        // Test descriptions render
        await expect(canvas.getByText(/Start a new conversation/)).toBeInTheDocument();
        // Test keyboard shortcuts display
        await expect(canvas.getByText('⌘')).toBeInTheDocument();
        await expect(canvas.getByText('N')).toBeInTheDocument();
    },
};
// ============================================================================
// With Categories
// ============================================================================
export const WithCategories = {
    render: () => {
        const [open, setOpen] = useState(true);
        const categorizedCommands = [
            // File Operations
            {
                id: 'new-file',
                label: 'New File',
                description: 'Create a new file',
                shortcut: ['⌘', 'N'],
                category: 'File',
                onSelect: () => alert('New file'),
            },
            {
                id: 'open-file',
                label: 'Open File',
                description: 'Open an existing file',
                shortcut: ['⌘', 'O'],
                category: 'File',
                onSelect: () => alert('Open file'),
            },
            {
                id: 'save',
                label: 'Save',
                description: 'Save current file',
                shortcut: ['⌘', 'S'],
                category: 'File',
                onSelect: () => alert('Save'),
            },
            // Edit Operations
            {
                id: 'copy',
                label: 'Copy',
                description: 'Copy selected text',
                shortcut: ['⌘', 'C'],
                category: 'Edit',
                onSelect: () => alert('Copy'),
            },
            {
                id: 'paste',
                label: 'Paste',
                description: 'Paste from clipboard',
                shortcut: ['⌘', 'V'],
                category: 'Edit',
                onSelect: () => alert('Paste'),
            },
            // View Operations
            {
                id: 'zoom-in',
                label: 'Zoom In',
                description: 'Increase zoom level',
                shortcut: ['⌘', '+'],
                category: 'View',
                onSelect: () => alert('Zoom in'),
            },
            {
                id: 'zoom-out',
                label: 'Zoom Out',
                description: 'Decrease zoom level',
                shortcut: ['⌘', '-'],
                category: 'View',
                onSelect: () => alert('Zoom out'),
            },
            // Help
            {
                id: 'docs',
                label: 'Documentation',
                description: 'Open documentation',
                category: 'Help',
                onSelect: () => alert('Open docs'),
            },
            {
                id: 'shortcuts',
                label: 'Keyboard Shortcuts',
                description: 'View all shortcuts',
                shortcut: ['⌘', '/'],
                category: 'Help',
                onSelect: () => alert('Show shortcuts'),
            },
        ];
        return (_jsxs("div", { className: "w-full", children: [_jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Open Command Palette" }), _jsx(CommandPalette, { items: categorizedCommands, open: open, onClose: () => setOpen(false) })] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test category headers render
        await expect(canvas.getByText('File')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        await expect(canvas.getByText('View')).toBeInTheDocument();
        await expect(canvas.getByText('Help')).toBeInTheDocument();
        // Test commands from different categories
        await expect(canvas.getByText('New File')).toBeInTheDocument();
        await expect(canvas.getByText('Copy')).toBeInTheDocument();
        await expect(canvas.getByText('Zoom In')).toBeInTheDocument();
        await expect(canvas.getByText('Documentation')).toBeInTheDocument();
    },
    parameters: {
        docs: {
            description: {
                story: 'Commands organized by category for better organization.',
            },
        },
    },
};
// ============================================================================
// Search & Filter
// ============================================================================
export const SearchDemo = {
    render: () => {
        const [open, setOpen] = useState(false);
        const searchableCommands = [
            {
                id: 'new-conversation',
                label: 'New Conversation',
                description: 'Start a fresh chat',
                category: 'Chat',
                onSelect: () => console.log('New conversation'),
            },
            {
                id: 'find-conversation',
                label: 'Find Conversation',
                description: 'Search your chat history',
                category: 'Chat',
                onSelect: () => console.log('Find'),
            },
            {
                id: 'delete-conversation',
                label: 'Delete Conversation',
                description: 'Remove a conversation',
                category: 'Chat',
                onSelect: () => console.log('Delete'),
            },
            {
                id: 'export-data',
                label: 'Export Data',
                description: 'Download your conversations',
                category: 'Data',
                onSelect: () => console.log('Export'),
            },
            {
                id: 'import-data',
                label: 'Import Data',
                description: 'Upload conversations',
                category: 'Data',
                onSelect: () => console.log('Import'),
            },
        ];
        return (_jsxs("div", { className: "w-full space-y-4", children: [_jsx("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: _jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Try searching:" }), " Type \"new\", \"find\", \"export\", or any part of a command name or description. The palette uses fuzzy matching to find relevant commands."] }) }), _jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Open Command Palette" }), _jsx(CommandPalette, { items: searchableCommands, open: open, onClose: () => setOpen(false), placeholder: "Search commands..." })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Fuzzy search filters commands by label, description, or category.',
            },
        },
    },
};
// ============================================================================
// Keyboard Shortcuts
// ============================================================================
export const KeyboardShortcuts = {
    render: () => {
        const [open, setOpen] = useState(false);
        // Simulate Cmd+K to open
        React.useEffect(() => {
            const handleKeyDown = (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    setOpen(true);
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, []);
        return (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-4", children: [_jsx("h3", { className: "font-semibold text-lg", children: "Keyboard Shortcuts" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Open Command Palette" }), _jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border", children: "\u2318K" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Navigate Up/Down" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border", children: "\u2191" }), _jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border", children: "\u2193" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Select Command" }), _jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border", children: "Enter" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Close Palette" }), _jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border", children: "Esc" })] })] })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Press", ' ', _jsx("kbd", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border text-xs", children: "\u2318K" }), ' ', "or click the button"] }), _jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Open Palette" }), _jsx(CommandPalette, { items: basicCommands, open: open, onClose: () => setOpen(false) })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Full keyboard navigation support. Press ⌘K to open, arrow keys to navigate, Enter to select, Esc to close.',
            },
        },
    },
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const ChatApplication = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [action, setAction] = useState('');
        const chatCommands = [
            {
                id: 'new-chat',
                label: 'New Chat',
                description: 'Start a new conversation',
                shortcut: ['⌘', 'N'],
                category: 'Actions',
                onSelect: () => setAction('Started new chat'),
            },
            {
                id: 'search',
                label: 'Search Messages',
                description: 'Search through all conversations',
                shortcut: ['⌘', 'F'],
                category: 'Actions',
                onSelect: () => setAction('Opened search'),
            },
            {
                id: 'clear-history',
                label: 'Clear History',
                description: 'Delete all conversations',
                category: 'Actions',
                onSelect: () => setAction('Cleared history'),
            },
            {
                id: 'export',
                label: 'Export Chat',
                description: 'Download conversation as JSON/PDF',
                category: 'File',
                onSelect: () => setAction('Exported chat'),
            },
            {
                id: 'dark-mode',
                label: 'Toggle Dark Mode',
                description: 'Switch between light and dark themes',
                shortcut: ['⌘', 'D'],
                category: 'Settings',
                onSelect: () => setAction('Toggled dark mode'),
            },
            {
                id: 'settings',
                label: 'Settings',
                description: 'Configure application preferences',
                shortcut: ['⌘', ','],
                category: 'Settings',
                onSelect: () => setAction('Opened settings'),
            },
        ];
        return (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold", children: "Chat Application" }), _jsx("button", { onClick: () => setOpen(true), className: "px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", children: "\u2318K" })] }), action && (_jsxs("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm", children: ["\u2713 ", action] }))] }), _jsx(CommandPalette, { items: chatCommands, open: open, onClose: () => setOpen(false), placeholder: "Type a command or search..." })] }));
    },
};
export const ThemeSwitch = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [theme, setTheme] = useState('System');
        const themeCommands = [
            {
                id: 'theme-light',
                label: 'Light Theme',
                description: 'Use light color scheme',
                category: 'Theme',
                onSelect: () => {
                    setTheme('Light');
                    setOpen(false);
                },
            },
            {
                id: 'theme-dark',
                label: 'Dark Theme',
                description: 'Use dark color scheme',
                category: 'Theme',
                onSelect: () => {
                    setTheme('Dark');
                    setOpen(false);
                },
            },
            {
                id: 'theme-system',
                label: 'System Theme',
                description: 'Follow system preferences',
                category: 'Theme',
                onSelect: () => {
                    setTheme('System');
                    setOpen(false);
                },
            },
        ];
        return (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Current Theme" }), _jsx("p", { className: "text-2xl font-bold", children: theme })] }), _jsx("button", { onClick: () => setOpen(true), className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Change Theme" })] }), _jsx(CommandPalette, { items: themeCommands, open: open, onClose: () => setOpen(false), placeholder: "Choose a theme..." })] }));
    },
};
export const QuickActions = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [log, setLog] = useState([]);
        const addLog = (message) => {
            setLog((prev) => [
                ...prev,
                `${new Date().toLocaleTimeString()}: ${message}`,
            ]);
        };
        const quickActions = [
            {
                id: 'copy-link',
                label: 'Copy Share Link',
                description: 'Copy shareable link to clipboard',
                shortcut: ['⌘', 'L'],
                category: 'Quick Actions',
                onSelect: () => addLog('Copied share link'),
            },
            {
                id: 'refresh',
                label: 'Refresh Data',
                description: 'Reload latest information',
                shortcut: ['⌘', 'R'],
                category: 'Quick Actions',
                onSelect: () => addLog('Refreshed data'),
            },
            {
                id: 'print',
                label: 'Print',
                description: 'Print current page',
                shortcut: ['⌘', 'P'],
                category: 'Quick Actions',
                onSelect: () => addLog('Opened print dialog'),
            },
            {
                id: 'help',
                label: 'Help & Support',
                description: 'Get help or contact support',
                shortcut: ['?'],
                category: 'Help',
                onSelect: () => addLog('Opened help'),
            },
        ];
        return (_jsxs("div", { className: "w-full space-y-4", children: [_jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "Quick Actions (\u2318K)" }), log.length > 0 && (_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsx("h4", { className: "font-medium text-sm mb-2", children: "Action Log" }), _jsx("div", { className: "space-y-1 text-xs font-mono", children: log.slice(-5).map((entry, i) => (_jsx("div", { className: "text-muted-foreground", children: entry }, i))) })] })), _jsx(CommandPalette, { items: quickActions, open: open, onClose: () => setOpen(false) })] }));
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (_jsxs("div", { className: "w-full space-y-6", children: [_jsx("button", { onClick: () => setOpen(true), className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Open Command Palette" }), _jsx(CommandPalette, { items: basicCommands, open: open, onClose: () => setOpen(false) }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Full keyboard navigation (\u2191\u2193 arrows, Enter, Esc)" }), _jsx("li", { children: "ARIA labels and roles for screen readers" }), _jsx("li", { children: "Focus management and keyboard trapping" }), _jsx("li", { children: "Clear visual focus indicators" }), _jsx("li", { children: "High contrast mode support" }), _jsx("li", { children: "Keyboard shortcuts displayed visually" }), _jsx("li", { children: "Search input auto-focused on open" }), _jsx("li", { children: "Smooth animations respect prefers-reduced-motion" })] })] })] }));
    },
};
//# sourceMappingURL=CommandPalette.stories.js.map