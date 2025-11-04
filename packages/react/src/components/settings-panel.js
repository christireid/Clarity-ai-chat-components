import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Textarea, Badge, ScrollArea, cn, } from '@clarity-chat/primitives';
export const SettingsPanel = React.memo(function SettingsPanel({ settings, onUpdate, onReset, className, }) {
    const [activeTab, setActiveTab] = React.useState('ai');
    const [hasChanges, setHasChanges] = React.useState(false);
    const tabs = [
        { id: 'ai', label: 'AI Behavior', icon: '🤖' },
        { id: 'ui', label: 'Appearance', icon: '🎨' },
        { id: 'privacy', label: 'Privacy', icon: '🔒' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ];
    const handleUpdateAI = (updates) => {
        onUpdate({ aiPersonality: { ...settings.aiPersonality, ...updates } });
        setHasChanges(true);
    };
    const handleUpdateUI = (updates) => {
        onUpdate({ uiPreferences: { ...settings.uiPreferences, ...updates } });
        setHasChanges(true);
    };
    const handleUpdatePrivacy = (updates) => {
        onUpdate({ privacy: { ...settings.privacy, ...updates } });
        setHasChanges(true);
    };
    const handleUpdateNotifications = (updates) => {
        onUpdate({ notifications: { ...settings.notifications, ...updates } });
        setHasChanges(true);
    };
    const handleReset = () => {
        if (confirm('Reset all settings to defaults?')) {
            onReset?.();
            setHasChanges(false);
        }
    };
    return (_jsxs(Card, { className: cn('h-full flex flex-col', className), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Settings" }), _jsx(CardDescription, { children: "Customize your AI chat experience" })] }), hasChanges && (_jsx(Badge, { variant: "default", className: "animate-pulse", children: "Unsaved Changes" }))] }), _jsx("div", { className: "flex gap-2 mt-4 overflow-x-auto", children: tabs.map((tab) => (_jsxs(Button, { variant: activeTab === tab.id ? 'default' : 'outline', size: "sm", onClick: () => setActiveTab(tab.id), className: "whitespace-nowrap", children: [tab.icon, " ", tab.label] }, tab.id))) })] }), _jsx(CardContent, { className: "flex-1 overflow-hidden", children: _jsx(ScrollArea, { className: "h-full", children: _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.2 }, className: "space-y-6 pb-4", children: [activeTab === 'ai' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Response Style" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Tone" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                                                    'professional',
                                                                    'casual',
                                                                    'technical',
                                                                    'friendly',
                                                                    'creative',
                                                                ].map((tone) => (_jsx(Button, { variant: settings.aiPersonality.tone === tone
                                                                        ? 'default'
                                                                        : 'outline', size: "sm", onClick: () => handleUpdateAI({ tone }), className: "justify-start", children: tone.charAt(0).toUpperCase() + tone.slice(1) }, tone))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Verbosity" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                                                    'concise',
                                                                    'balanced',
                                                                    'detailed',
                                                                    'comprehensive',
                                                                ].map((level) => (_jsx(Button, { variant: settings.aiPersonality.verbosity === level
                                                                        ? 'default'
                                                                        : 'outline', size: "sm", onClick: () => handleUpdateAI({ verbosity: level }), className: "justify-start", children: level.charAt(0).toUpperCase() + level.slice(1) }, level))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Response Language" }), _jsxs("select", { value: settings.aiPersonality.responseLanguage || 'en', onChange: (e) => handleUpdateAI({ responseLanguage: e.target.value }), className: "w-full text-sm border rounded px-3 py-2 bg-background", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Spanish" }), _jsx("option", { value: "fr", children: "French" }), _jsx("option", { value: "de", children: "German" }), _jsx("option", { value: "zh", children: "Chinese" }), _jsx("option", { value: "ja", children: "Japanese" })] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Custom Instructions" }), _jsx(Textarea, { value: settings.aiPersonality.customInstructions || '', onChange: (e) => handleUpdateAI({ customInstructions: e.target.value }), placeholder: "Add custom instructions for how the AI should respond to you...", rows: 6 }), _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "These instructions will be included in every conversation to personalize responses." })] }), _jsxs("div", { className: "p-4 bg-muted/50 rounded-lg", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "\uD83D\uDCA1 Pro Tips" }), _jsxs("ul", { className: "text-xs space-y-1 text-muted-foreground", children: [_jsx("li", { children: "\u2022 Use \"professional\" tone for work-related tasks" }), _jsx("li", { children: "\u2022 Set \"concise\" for quick answers" }), _jsx("li", { children: "\u2022 Add custom instructions like \"Always explain like I'm 5\"" })] })] })] })), activeTab === 'ui' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Theme" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['light', 'dark', 'system'].map((theme) => (_jsxs(Button, { variant: settings.uiPreferences.theme === theme
                                                        ? 'default'
                                                        : 'outline', size: "sm", onClick: () => {
                                                        handleUpdateUI({ theme: theme });
                                                        // Apply theme
                                                        if (theme === 'dark') {
                                                            document.documentElement.classList.add('dark');
                                                        }
                                                        else if (theme === 'light') {
                                                            document.documentElement.classList.remove('dark');
                                                        }
                                                    }, className: "flex flex-col items-center py-4", children: [theme === 'light' && '☀️', theme === 'dark' && '🌙', theme === 'system' && '💻', _jsx("span", { className: "mt-1 text-xs", children: theme.charAt(0).toUpperCase() + theme.slice(1) })] }, theme))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Text Size" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: ['small', 'medium', 'large', 'extra-large'].map((size) => (_jsxs(Button, { variant: settings.uiPreferences.fontSize === size
                                                        ? 'default'
                                                        : 'outline', size: "sm", onClick: () => handleUpdateUI({ fontSize: size }), children: [size === 'small' && 'S', size === 'medium' && 'M', size === 'large' && 'L', size === 'extra-large' && 'XL'] }, size))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Message Layout" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['bubbles', 'compact', 'spacious'].map((layout) => (_jsx(Button, { variant: settings.uiPreferences.messageLayout === layout
                                                        ? 'default'
                                                        : 'outline', size: "sm", onClick: () => handleUpdateUI({ messageLayout: layout }), children: layout.charAt(0).toUpperCase() + layout.slice(1) }, layout))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Display Options" }), [
                                                { key: 'showTimestamps', label: 'Show Timestamps' },
                                                { key: 'showAvatars', label: 'Show Avatars' },
                                                { key: 'enableAnimations', label: 'Enable Animations' },
                                                {
                                                    key: 'enableSoundEffects',
                                                    label: 'Enable Sound Effects',
                                                },
                                                { key: 'compactMode', label: 'Compact Mode' },
                                            ].map(({ key, label }) => (_jsxs("label", { className: "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer", children: [_jsx("span", { className: "text-sm", children: label }), _jsx("input", { type: "checkbox", checked: settings.uiPreferences[key], onChange: (e) => handleUpdateUI({ [key]: e.target.checked }), className: "w-4 h-4" })] }, key)))] })] })), activeTab === 'privacy' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Data Collection" }), [
                                                {
                                                    key: 'saveHistory',
                                                    label: 'Save Chat History',
                                                    description: 'Store your conversations for future reference',
                                                },
                                                {
                                                    key: 'enableAnalytics',
                                                    label: 'Enable Analytics',
                                                    description: 'Help us improve by sharing usage data',
                                                },
                                                {
                                                    key: 'shareUsageData',
                                                    label: 'Share Usage Data',
                                                    description: 'Contribute to AI training and improvements',
                                                },
                                                {
                                                    key: 'allowTelemetry',
                                                    label: 'Allow Telemetry',
                                                    description: 'Send crash reports and performance data',
                                                },
                                            ].map(({ key, label, description }) => (_jsxs("label", { className: "flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: label }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description })] }), _jsx("input", { type: "checkbox", checked: settings.privacy[key], onChange: (e) => handleUpdatePrivacy({ [key]: e.target.checked }), className: "w-4 h-4 mt-1 ml-4" })] }, key)))] }), _jsxs("div", { className: "p-4 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg shadow-sm", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "\u26A0\uFE0F Privacy Notice" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "We take your privacy seriously. Your data is encrypted and never shared with third parties without your explicit consent. You can export or delete your data at any time." })] })] })), activeTab === 'notifications' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Notification Channels" }), [
                                                { key: 'email', label: 'Email Notifications', icon: '📧' },
                                                { key: 'push', label: 'Push Notifications', icon: '🔔' },
                                                {
                                                    key: 'desktop',
                                                    label: 'Desktop Notifications',
                                                    icon: '💻',
                                                },
                                                { key: 'sound', label: 'Sound Alerts', icon: '🔊' },
                                            ].map(({ key, label, icon }) => (_jsxs("label", { className: "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer", children: [_jsxs("span", { className: "text-sm", children: [icon, " ", label] }), _jsx("input", { type: "checkbox", checked: settings.notifications[key], onChange: (e) => handleUpdateNotifications({ [key]: e.target.checked }), className: "w-4 h-4" })] }, key)))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Notify Me About" }), [
                                                { key: 'newMessage', label: 'New Messages' },
                                                { key: 'systemUpdates', label: 'System Updates' },
                                            ].map(({ key, label }) => (_jsxs("label", { className: "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer", children: [_jsx("span", { className: "text-sm", children: label }), _jsx("input", { type: "checkbox", checked: settings.notifications[key], onChange: (e) => handleUpdateNotifications({ [key]: e.target.checked }), className: "w-4 h-4" })] }, key)))] })] }))] }, activeTab) }) }), _jsxs("div", { className: "p-4 border-t flex items-center justify-between", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: handleReset, disabled: !onReset, children: "Reset to Defaults" }), hasChanges && (_jsx(Button, { size: "sm", onClick: () => setHasChanges(false), children: "Save Changes" }))] })] }));
});
SettingsPanel.displayName = 'SettingsPanel';
//# sourceMappingURL=settings-panel.js.map