import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Clarity Chat Playground
 *
 * A world-class interactive component testing and experimentation environment.
 * Features:
 * - Live code preview with hot reloading
 * - Console output interception
 * - URL sharing with compression
 * - Export to CodeSandbox/StackBlitz
 * - Command palette with keyboard shortcuts
 * - Auto-save to localStorage
 * - Beautiful UI with smooth animations
 */
import { useRef, useCallback, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Toaster } from 'sonner';
import { Play, Copy, Download, Share2, RefreshCw, Settings, ExternalLink, Terminal, Keyboard, Moon, Sun, Code2, Sparkles, Search, Command, Check, Zap, FileCode, BookOpen, } from 'lucide-react';
import { LivePreview } from './components/LivePreview';
import { ComponentLibrary } from './components/ComponentLibrary';
import { ConsolePanel } from './components/ConsolePanel';
import { ErrorBoundary, PreviewErrorBoundary } from './components/ErrorBoundary';
import { PlaygroundProvider, usePlayground } from './contexts/PlaygroundContext';
import { useKeyboardShortcuts, getShortcutLabel, KEYBOARD_SHORTCUTS, } from './hooks/useKeyboardShortcuts';
// Logo component with gradient
function Logo() {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30", children: _jsx(Sparkles, { className: "w-5 h-5 text-white" }) }), _jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center", children: _jsx("span", { className: "text-[8px] text-white font-bold", children: "AI" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent", children: "Clarity Chat" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide", children: "PLAYGROUND" })] })] }));
}
// Status badge component
function StatusBadge({ status, lastSaved, }) {
    if (status === 'success') {
        return (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-fade-in", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), "Ready"] }));
    }
    if (lastSaved) {
        return (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium", children: [_jsx(Check, { className: "w-3 h-3" }), "Saved", ' ', lastSaved.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })] }));
    }
    return null;
}
// Command Palette Modal
function CommandPalette({ isOpen, onClose, actions, }) {
    const [search, setSearch] = useState('');
    const commands = [
        {
            id: 'run',
            label: 'Run Preview',
            icon: Play,
            shortcut: getShortcutLabel('run'),
            action: actions.run,
        },
        {
            id: 'share',
            label: 'Share Playground',
            icon: Share2,
            shortcut: getShortcutLabel('share'),
            action: actions.share,
        },
        {
            id: 'copy',
            label: 'Copy Code',
            icon: Copy,
            shortcut: getShortcutLabel('copy'),
            action: actions.copyCode,
        },
        {
            id: 'reset',
            label: 'Reset to Template',
            icon: RefreshCw,
            shortcut: getShortcutLabel('reset'),
            action: actions.reset,
        },
        {
            id: 'theme',
            label: 'Toggle Theme',
            icon: Moon,
            shortcut: getShortcutLabel('theme'),
            action: actions.toggleTheme,
        },
        {
            id: 'console',
            label: 'Toggle Console',
            icon: Terminal,
            shortcut: getShortcutLabel('console'),
            action: actions.toggleConsole,
        },
        {
            id: 'settings',
            label: 'Toggle Settings',
            icon: Settings,
            shortcut: getShortcutLabel('settings'),
            action: actions.toggleSettings,
        },
        {
            id: 'codesandbox',
            label: 'Open in CodeSandbox',
            icon: ExternalLink,
            action: actions.exportToCodeSandbox,
        },
        {
            id: 'stackblitz',
            label: 'Open in StackBlitz',
            icon: Zap,
            action: actions.exportToStackBlitz,
        },
        {
            id: 'download',
            label: 'Download as File',
            icon: Download,
            action: actions.downloadZip,
        },
    ];
    const filteredCommands = commands.filter((cmd) => cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.id.toLowerCase().includes(search.toLowerCase()));
    const handleSelect = (action) => {
        action();
        onClose();
        setSearch('');
    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
                setSearch('');
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[15vh]", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in", onClick: () => {
                    onClose();
                    setSearch('');
                } }), _jsxs("div", { className: "relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in", children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx(Search, { className: "w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search commands...", className: "flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm", autoFocus: true }), _jsx("kbd", { className: "kbd text-xs", children: "ESC" })] }), _jsx("div", { className: "max-h-80 overflow-y-auto py-2", children: filteredCommands.length === 0 ? (_jsx("div", { className: "py-8 text-center text-gray-500 dark:text-gray-400 text-sm", children: "No commands found" })) : (filteredCommands.map((cmd) => (_jsxs("button", { onClick: () => handleSelect(cmd.action), className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: [_jsx(cmd.icon, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "flex-1 text-left text-sm text-gray-700 dark:text-gray-300", children: cmd.label }), cmd.shortcut && (_jsx("kbd", { className: "kbd text-xs", children: cmd.shortcut }))] }, cmd.id)))) }), _jsx("div", { className: "px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "kbd", children: "\u2191\u2193" }), " Navigate"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "kbd", children: "\u21B5" }), " Select"] })] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Command, { className: "w-3 h-3" }), "K to open"] })] }) })] })] }));
}
// Header Action Button
function HeaderButton({ onClick, title, children, active = false, badge, }) {
    return (_jsxs("button", { onClick: onClick, className: `relative btn-icon ${active ? 'active' : ''}`, title: title, "aria-label": title, children: [children, badge !== undefined && badge > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center", children: badge > 99 ? '99+' : badge }))] }));
}
/**
 * Main Playground Content
 * Uses the PlaygroundContext for all state management
 */
function PlaygroundContent() {
    const { state, actions } = usePlayground();
    const runPreviewRef = useRef(null);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    // Keyboard shortcuts
    useKeyboardShortcuts({
        onShare: actions.share,
        onRun: () => runPreviewRef.current?.(),
        onCopy: actions.copyCode,
        onReset: actions.reset,
        onToggleTheme: actions.toggleTheme,
        onToggleConsole: actions.toggleConsole,
        onToggleSettings: actions.toggleSettings,
        onEscape: () => {
            actions.closeExportMenu();
            setShowCommandPalette(false);
        },
    });
    // Command palette shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowCommandPalette((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    const handleEditorChange = useCallback((value) => {
        actions.setCode(value || '');
    }, [actions]);
    const handleConsoleEntry = useCallback((entry) => {
        actions.addConsoleEntry(entry);
    }, [actions]);
    const handlePreviewStatus = useCallback((status) => {
        actions.setPreviewStatus(status);
    }, [actions]);
    return (_jsxs("div", { className: `h-screen flex flex-col gradient-mesh ${state.theme === 'dark' ? 'dark' : ''}`, children: [_jsxs("header", { className: "glass border-b border-gray-200/50 dark:border-gray-700/50 px-4 lg:px-6 py-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx(Logo, {}), _jsx(StatusBadge, { status: state.previewStatus, lastSaved: state.lastSaved })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("button", { onClick: () => setShowCommandPalette(true), className: "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm transition-colors", children: [_jsx(Search, { className: "w-4 h-4" }), _jsx("span", { className: "text-gray-400", children: "Search commands..." }), _jsx("kbd", { className: "kbd text-xs ml-2", children: "\u2318K" })] }), _jsx("div", { className: "hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" }), _jsx(HeaderButton, { onClick: actions.reset, title: `Reset to template (${getShortcutLabel('reset')})`, children: _jsx(RefreshCw, { className: "w-5 h-5" }) }), _jsx(HeaderButton, { onClick: actions.copyCode, title: `Copy code (${getShortcutLabel('copy')})`, children: _jsx(Copy, { className: "w-5 h-5" }) }), _jsx(HeaderButton, { onClick: actions.downloadZip, title: "Download as file", children: _jsx(Download, { className: "w-5 h-5" }) }), _jsx(HeaderButton, { onClick: actions.share, title: `Share (${getShortcutLabel('share')})`, children: _jsx(Share2, { className: "w-5 h-5" }) }), _jsxs("div", { className: "relative", children: [_jsx(HeaderButton, { onClick: actions.toggleExportMenu, title: "Export options", children: _jsx(ExternalLink, { className: "w-5 h-5" }) }), state.showExportMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: actions.closeExportMenu }), _jsxs("div", { className: "dropdown-menu right-0 mt-2", children: [_jsxs("button", { onClick: actions.exportToCodeSandbox, className: "dropdown-item", children: [_jsx(Code2, { className: "dropdown-item-icon" }), "Open in CodeSandbox"] }), _jsxs("button", { onClick: actions.exportToStackBlitz, className: "dropdown-item", children: [_jsx(Zap, { className: "dropdown-item-icon" }), "Open in StackBlitz"] })] })] }))] }), _jsx("div", { className: "h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" }), _jsx(HeaderButton, { onClick: actions.toggleConsole, title: `Toggle console (${getShortcutLabel('console')})`, active: state.showConsole, badge: state.consoleEntries.filter((e) => e.level === 'error').length, children: _jsx(Terminal, { className: "w-5 h-5" }) }), _jsx(HeaderButton, { onClick: actions.toggleSettings, title: `Settings (${getShortcutLabel('settings')})`, active: state.showSettings, children: _jsx(Settings, { className: "w-5 h-5" }) }), _jsxs("button", { onClick: actions.toggleTheme, className: "ml-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40", title: `Toggle theme (${getShortcutLabel('theme')})`, children: [state.theme === 'light' ? (_jsx(Moon, { className: "w-4 h-4" })) : (_jsx(Sun, { className: "w-4 h-4" })), _jsx("span", { className: "hidden lg:inline", children: state.theme === 'light' ? 'Dark' : 'Light' })] })] })] }), state.showSettings && (_jsxs("div", { className: "mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in-down", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("label", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors", children: [_jsx("input", { type: "checkbox", checked: state.settings.autoRun, onChange: (e) => actions.updateSettings({ autoRun: e.target.checked }), className: "w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Auto-run" })] }), _jsxs("label", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors", children: [_jsx("input", { type: "checkbox", checked: state.settings.lineNumbers, onChange: (e) => actions.updateSettings({ lineNumbers: e.target.checked }), className: "w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Line numbers" })] }), _jsxs("label", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors", children: [_jsx("input", { type: "checkbox", checked: state.settings.wordWrap, onChange: (e) => actions.updateSettings({ wordWrap: e.target.checked }), className: "w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Word wrap" })] }), _jsxs("label", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors", children: [_jsx("input", { type: "checkbox", checked: state.settings.minimap, onChange: (e) => actions.updateSettings({ minimap: e.target.checked }), className: "w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Minimap" })] })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3", children: [_jsx(Keyboard, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: "Keyboard Shortcuts" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (_jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gray-100/50 dark:bg-gray-700/50", children: [_jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: shortcut.description }), _jsx("kbd", { className: "kbd text-xs", children: getShortcutLabel(key) })] }, key))) })] })] }))] }), _jsxs("div", { className: "flex-1 flex overflow-hidden p-4 gap-4", children: [_jsx("aside", { className: "w-72 hidden lg:block flex-shrink-0", children: _jsxs("div", { className: "h-full card overflow-hidden flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white", children: [_jsx(BookOpen, { className: "w-4 h-4 text-indigo-500" }), "Templates"] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(ComponentLibrary, { selectedTemplate: state.selectedTemplate, onTemplateChange: actions.setTemplate }) })] }) }), _jsx("div", { className: "flex-1 flex flex-col min-w-0", children: _jsxs("div", { className: "flex-1 card overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileCode, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Code Editor" }), _jsx("span", { className: "badge badge-neutral text-xs", children: "TypeScript" })] }), _jsx("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: _jsxs("span", { children: [state.code.split('\n').length, " lines"] }) })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(Editor, { height: "100%", defaultLanguage: "typescript", value: state.code, onChange: handleEditorChange, theme: state.theme === 'dark' ? 'vs-dark' : 'light', options: {
                                            minimap: { enabled: state.settings.minimap },
                                            fontSize: state.settings.fontSize,
                                            lineNumbers: state.settings.lineNumbers ? 'on' : 'off',
                                            roundedSelection: true,
                                            scrollBeyondLastLine: false,
                                            readOnly: false,
                                            automaticLayout: true,
                                            tabSize: state.settings.tabSize,
                                            formatOnPaste: true,
                                            formatOnType: true,
                                            wordWrap: state.settings.wordWrap ? 'on' : 'off',
                                            padding: { top: 16, bottom: 16 },
                                            cursorBlinking: 'smooth',
                                            cursorSmoothCaretAnimation: 'on',
                                            smoothScrolling: true,
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            fontLigatures: true,
                                        } }) })] }) }), _jsxs("div", { className: "w-[45%] hidden md:flex flex-col gap-4", children: [_jsxs("div", { className: "flex-1 card overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Play, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Preview" }), state.previewStatus === 'success' && (_jsx("span", { className: "badge badge-success text-xs", children: "Running" })), state.previewStatus === 'error' && (_jsx("span", { className: "badge badge-error text-xs", children: "Error" })), (state.previewStatus === 'compiling' ||
                                                        state.previewStatus === 'rendering') && (_jsx("span", { className: "badge badge-primary text-xs animate-pulse", children: "Loading..." }))] }), _jsxs("button", { onClick: () => runPreviewRef.current?.(), className: "btn-primary text-sm py-1.5 px-3 flex items-center gap-2", title: `Run preview (${getShortcutLabel('run')})`, children: [_jsx(Play, { className: "w-3.5 h-3.5" }), "Run"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900", children: _jsx(ErrorBoundary, { onReset: () => runPreviewRef.current?.(), children: _jsx(PreviewErrorBoundary, { onRetry: () => runPreviewRef.current?.(), children: _jsx(LivePreview, { code: state.code, theme: state.theme, autoRun: state.settings.autoRun, onRunRef: runPreviewRef, onConsoleEntry: handleConsoleEntry, onError: actions.setError, onPreviewStatus: handlePreviewStatus }) }) }) })] }), state.showConsole && (_jsx("div", { className: "animate-fade-in-up", children: _jsx(ConsolePanel, { entries: state.consoleEntries, onClear: actions.clearConsole, maxHeight: "250px", className: "card" }) }))] })] }), _jsx(CommandPalette, { isOpen: showCommandPalette, onClose: () => setShowCommandPalette(false), actions: {
                    share: actions.share,
                    copyCode: actions.copyCode,
                    reset: actions.reset,
                    toggleTheme: actions.toggleTheme,
                    toggleConsole: actions.toggleConsole,
                    toggleSettings: actions.toggleSettings,
                    exportToCodeSandbox: actions.exportToCodeSandbox,
                    exportToStackBlitz: actions.exportToStackBlitz,
                    downloadZip: actions.downloadZip,
                    run: () => runPreviewRef.current?.(),
                } }), _jsx(Toaster, { position: "bottom-right", theme: state.theme, toastOptions: {
                    className: 'card',
                    style: {
                        background: state.theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: `1px solid ${state.theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    },
                } })] }));
}
/**
 * Main App Component
 * Wraps everything with the PlaygroundProvider
 */
export default function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(PlaygroundProvider, { children: _jsx(PlaygroundContent, {}) }) }));
}
//# sourceMappingURL=App.js.map