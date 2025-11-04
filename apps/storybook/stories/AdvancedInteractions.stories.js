import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CommandPalette, KeyboardHint, Draggable, DropZone, ContextMenu, ThemeSwitcher, useTheme, useUndoRedo, useUndoRedoShortcuts, useHaptic, useKeyboardShortcuts, } from '@clarity-chat/react';
// ============================================================================
// Command Palette Stories
// ============================================================================
const CommandPaletteDemo = () => {
    const [open, setOpen] = React.useState(false);
    const [lastCommand, setLastCommand] = React.useState('');
    const commands = [
        {
            id: 'new-chat',
            label: 'New Chat',
            description: 'Start a new conversation',
            category: 'Actions',
            shortcut: ['⌘', 'N'],
            icon: _jsx("span", { children: "\uD83D\uDCAC" }),
            onSelect: () => setLastCommand('New Chat'),
        },
        {
            id: 'search',
            label: 'Search Messages',
            description: 'Find in conversation history',
            category: 'Actions',
            shortcut: ['⌘', 'F'],
            icon: _jsx("span", { children: "\uD83D\uDD0D" }),
            onSelect: () => setLastCommand('Search'),
        },
        {
            id: 'export',
            label: 'Export Chat',
            description: 'Download conversation as JSON',
            category: 'File',
            shortcut: ['⌘', 'E'],
            icon: _jsx("span", { children: "\uD83D\uDCE5" }),
            onSelect: () => setLastCommand('Export'),
        },
        {
            id: 'settings',
            label: 'Settings',
            description: 'Configure application',
            category: 'System',
            shortcut: ['⌘', ','],
            icon: _jsx("span", { children: "\u2699\uFE0F" }),
            onSelect: () => setLastCommand('Settings'),
        },
        {
            id: 'theme',
            label: 'Toggle Theme',
            description: 'Switch between light and dark',
            category: 'System',
            shortcut: ['⌘', 'T'],
            icon: _jsx("span", { children: "\uD83C\uDFA8" }),
            onSelect: () => setLastCommand('Theme'),
        },
    ];
    // Setup keyboard shortcut
    useKeyboardShortcuts({
        shortcuts: {
            'ctrl+k': () => setOpen(true),
        },
    });
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Command Palette Demo" }), _jsxs("p", { className: "text-muted-foreground", children: ["Press ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Ctrl+K" }), " or click the button to open the command palette"] }), _jsx("button", { onClick: () => setOpen(true), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90", children: "Open Command Palette" }), lastCommand && (_jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsx("strong", { children: "Last Command:" }), " ", lastCommand] }))] }), _jsx(CommandPalette, { items: commands, open: open, onClose: () => setOpen(false) })] }));
};
// ============================================================================
// Keyboard Hints Stories
// ============================================================================
const KeyboardHintsDemo = () => {
    const [visible, setVisible] = React.useState(false);
    const shortcuts = [
        { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
        { keys: ['⌘', 'N'], description: 'New chat', category: 'Actions' },
        { keys: ['⌘', 'F'], description: 'Search messages', category: 'Actions' },
        { keys: ['⌘', 'Z'], description: 'Undo', category: 'Editing' },
        { keys: ['⌘', 'Shift', 'Z'], description: 'Redo', category: 'Editing' },
        { keys: ['Esc'], description: 'Close dialog', category: 'Navigation' },
        { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
    ];
    // Toggle with ? key
    useKeyboardShortcuts({
        shortcuts: {
            '?': () => setVisible(!visible),
        },
    });
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Keyboard Shortcuts" }), _jsxs("p", { className: "text-muted-foreground", children: ["Press ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "?" }), " to toggle the shortcuts panel"] }), _jsxs("button", { onClick: () => setVisible(!visible), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90", children: [visible ? 'Hide' : 'Show', " Shortcuts"] })] }), _jsx(KeyboardHint, { shortcuts: shortcuts, visible: visible, onClose: () => setVisible(false), position: "center" })] }));
};
// ============================================================================
// Drag & Drop Stories
// ============================================================================
const DragDropDemo = () => {
    const [items, setItems] = React.useState([
        { id: '1', text: 'Task 1: Review code' },
        { id: '2', text: 'Task 2: Write tests' },
        { id: '3', text: 'Task 3: Update docs' },
    ]);
    const [dropZones] = React.useState([
        { id: 'todo', label: 'To Do', items: ['1'] },
        { id: 'doing', label: 'Doing', items: ['2'] },
        { id: 'done', label: 'Done', items: ['3'] },
    ]);
    return (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Drag & Drop Demo" }), _jsx("p", { className: "text-muted-foreground", children: "Drag items between columns" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: dropZones.map(zone => (_jsxs(DropZone, { dropId: zone.id, className: "p-4 min-h-[300px]", activeClassName: "border-primary bg-primary/10", children: [_jsx("div", { className: "font-semibold mb-4", children: zone.label }), _jsx("div", { className: "space-y-2", children: items
                                    .filter(item => zone.items.includes(item.id))
                                    .map(item => (_jsx(Draggable, { dragId: item.id, children: _jsx("div", { className: "p-3 bg-card rounded border hover:border-primary transition-colors", children: item.text }) }, item.id))) })] }, zone.id))) })] }) }));
};
// ============================================================================
// Context Menu Stories
// ============================================================================
const ContextMenuDemo = () => {
    const [lastAction, setLastAction] = React.useState('');
    const menuItems = [
        {
            id: 'copy',
            label: 'Copy',
            icon: _jsx("span", { children: "\uD83D\uDCCB" }),
            shortcut: '⌘C',
            onSelect: () => setLastAction('Copy'),
        },
        {
            id: 'paste',
            label: 'Paste',
            icon: _jsx("span", { children: "\uD83D\uDCC4" }),
            shortcut: '⌘V',
            onSelect: () => setLastAction('Paste'),
        },
        { id: 'sep1', label: '', separator: true },
        {
            id: 'edit',
            label: 'Edit',
            icon: _jsx("span", { children: "\u270F\uFE0F" }),
            submenu: [
                {
                    id: 'undo',
                    label: 'Undo',
                    shortcut: '⌘Z',
                    onSelect: () => setLastAction('Undo'),
                },
                {
                    id: 'redo',
                    label: 'Redo',
                    shortcut: '⌘⇧Z',
                    onSelect: () => setLastAction('Redo'),
                },
            ],
        },
        { id: 'sep2', label: '', separator: true },
        {
            id: 'delete',
            label: 'Delete',
            icon: _jsx("span", { children: "\uD83D\uDDD1\uFE0F" }),
            danger: true,
            onSelect: () => setLastAction('Delete'),
        },
    ];
    return (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Context Menu Demo" }), _jsx("p", { className: "text-muted-foreground", children: "Right-click on the box below" }), _jsx(ContextMenu, { items: menuItems, children: _jsx("div", { className: "w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors", children: "Right-click here to open context menu" }) }), lastAction && (_jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsx("strong", { children: "Last Action:" }), " ", lastAction] }))] }) }));
};
// ============================================================================
// Theme Switcher Stories
// ============================================================================
const ThemeSwitcherDemo = () => {
    const { theme, setTheme } = useTheme();
    return (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Theme Switcher" }), _jsxs("p", { className: "text-muted-foreground", children: ["Current theme: ", _jsx("strong", { children: theme })] }), _jsx(ThemeSwitcher, { currentTheme: theme, onThemeChange: setTheme, showPreview: true })] }) }));
};
// ============================================================================
// Undo/Redo Demo
// ============================================================================
const UndoRedoDemo = () => {
    const [text, { set, undo, redo, canUndo, canRedo }] = useUndoRedo({
        initialState: 'Hello World',
    });
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    useUndoRedoShortcuts(() => {
        undo();
        setToastMessage('Undo');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }, () => {
        redo();
        setToastMessage('Redo');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    });
    return (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Undo/Redo Demo" }), _jsxs("p", { className: "text-muted-foreground", children: ["Use ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "\u2318Z" }), " to undo and", ' ', _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "\u2318\u21E7Z" }), " to redo"] }), _jsx("textarea", { value: text, onChange: e => set(e.target.value), className: "w-full h-32 p-4 border rounded-lg" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: undo, disabled: !canUndo, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed", children: "Undo" }), _jsx("button", { onClick: redo, disabled: !canRedo, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed", children: "Redo" })] }), showToast && (_jsx("div", { className: "fixed bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg animate-in slide-in-from-bottom-5", children: toastMessage }))] }) }));
};
// ============================================================================
// Haptic Feedback Demo
// ============================================================================
const HapticDemo = () => {
    const { isSupported, light, medium, heavy, success, warning, error } = useHaptic();
    return (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Haptic Feedback Demo" }), isSupported ? (_jsx("p", { className: "text-muted-foreground", children: "Haptic feedback is supported on this device. Click buttons to feel vibrations." })) : (_jsx("p", { className: "text-destructive", children: "Haptic feedback is not supported on this device." })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("button", { onClick: light, className: "px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors", children: "Light" }), _jsx("button", { onClick: medium, className: "px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors", children: "Medium" }), _jsx("button", { onClick: heavy, className: "px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors", children: "Heavy" }), _jsx("button", { onClick: success, className: "px-4 py-3 bg-success/10 border border-success rounded-lg hover:bg-success/20 transition-colors", children: "Success \u2705" }), _jsx("button", { onClick: warning, className: "px-4 py-3 bg-warning/10 border border-warning rounded-lg hover:bg-warning/20 transition-colors", children: "Warning \u26A0\uFE0F" }), _jsx("button", { onClick: error, className: "px-4 py-3 bg-destructive/10 border border-destructive rounded-lg hover:bg-destructive/20 transition-colors", children: "Error \u274C" })] })] }) }));
};
// ============================================================================
// Combined Interactive Demo
// ============================================================================
const InteractiveDemo = () => {
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const [hintsVisible, setHintsVisible] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const { success, error } = useHaptic();
    const commands = [
        {
            id: 'hints',
            label: 'Show Keyboard Shortcuts',
            icon: _jsx("span", { children: "\u2328\uFE0F" }),
            category: 'Help',
            onSelect: () => setHintsVisible(true),
        },
        {
            id: 'theme-light',
            label: 'Light Theme',
            icon: _jsx("span", { children: "\u2600\uFE0F" }),
            category: 'Theme',
            onSelect: () => {
                setTheme('light');
                success();
            },
        },
        {
            id: 'theme-dark',
            label: 'Dark Theme',
            icon: _jsx("span", { children: "\uD83C\uDF19" }),
            category: 'Theme',
            onSelect: () => {
                setTheme('dark');
                success();
            },
        },
    ];
    const shortcuts = [
        { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
        { keys: ['?'], description: 'Show shortcuts', category: 'Help' },
        { keys: ['Esc'], description: 'Close', category: 'Navigation' },
    ];
    useKeyboardShortcuts({
        shortcuts: {
            'ctrl+k': () => setPaletteOpen(true),
            '?': () => setHintsVisible(!hintsVisible),
        },
    });
    return (_jsxs("div", { className: "p-8 min-h-screen", children: [_jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Advanced Interactions Showcase" }), _jsx("p", { className: "text-muted-foreground", children: "A comprehensive demo of all Phase 8 features working together" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("button", { onClick: () => setPaletteOpen(true), className: "p-6 bg-card border rounded-lg hover:border-primary transition-all group", children: [_jsx("div", { className: "text-4xl mb-2 group-hover:scale-110 transition-transform", children: "\u2318" }), _jsx("h3", { className: "font-semibold mb-1", children: "Command Palette" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Press Ctrl+K" })] }), _jsxs("button", { onClick: () => setHintsVisible(true), className: "p-6 bg-card border rounded-lg hover:border-primary transition-all group", children: [_jsx("div", { className: "text-4xl mb-2 group-hover:scale-110 transition-transform", children: "\u2328\uFE0F" }), _jsx("h3", { className: "font-semibold mb-1", children: "Keyboard Shortcuts" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Press ?" })] })] }), _jsxs("div", { className: "p-6 bg-card border rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Current Theme" }), _jsx(ThemeSwitcher, { currentTheme: theme, onThemeChange: setTheme, compact: true })] })] }), _jsx(CommandPalette, { items: commands, open: paletteOpen, onClose: () => setPaletteOpen(false) }), _jsx(KeyboardHint, { shortcuts: shortcuts, visible: hintsVisible, onClose: () => setHintsVisible(false), position: "bottom-right" })] }));
};
// ============================================================================
// Meta Configuration
// ============================================================================
const meta = {
    title: 'Phase 8/Advanced Interactions',
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
// ============================================================================
// Stories
// ============================================================================
export const CommandPaletteStory = {
    name: '1. Command Palette',
    render: () => _jsx(CommandPaletteDemo, {}),
};
export const KeyboardHintsStory = {
    name: '2. Keyboard Shortcuts',
    render: () => _jsx(KeyboardHintsDemo, {}),
};
export const DragDropStory = {
    name: '3. Drag & Drop',
    render: () => _jsx(DragDropDemo, {}),
};
export const ContextMenuStory = {
    name: '4. Context Menu',
    render: () => _jsx(ContextMenuDemo, {}),
};
export const ThemeSwitcherStory = {
    name: '5. Theme Switcher',
    render: () => _jsx(ThemeSwitcherDemo, {}),
};
export const UndoRedoStory = {
    name: '6. Undo/Redo',
    render: () => _jsx(UndoRedoDemo, {}),
};
export const HapticStory = {
    name: '7. Haptic Feedback',
    render: () => _jsx(HapticDemo, {}),
};
export const InteractiveStory = {
    name: '8. Complete Interactive Demo',
    render: () => _jsx(InteractiveDemo, {}),
};
//# sourceMappingURL=AdvancedInteractions.stories.js.map