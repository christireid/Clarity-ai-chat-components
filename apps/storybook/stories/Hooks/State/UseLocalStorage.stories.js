import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocalStorage } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
/**
 * **useLocalStorage Hook**
 *
 * Hook for persisting state in localStorage with automatic serialization
 * and cross-tab synchronization.
 *
 * **Key Features:**
 * - Persist state in localStorage
 * - Automatic serialization/deserialization
 * - Cross-tab synchronization
 * - SSR-safe
 * - Custom serializers
 * - Remove functionality
 *
 * **Use Cases:**
 * - Theme preferences
 * - User settings
 * - Form data persistence
 * - Cache management
 */
const meta = {
    title: 'Hooks/State/UseLocalStorage',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useLocalStorage\` hook persists state in localStorage with automatic
serialization and cross-tab synchronization.

## Features

- ✅ Persist state in localStorage
- ✅ Automatic serialization/deserialization
- ✅ Cross-tab synchronization
- ✅ SSR-safe
- ✅ Custom serializers
- ✅ Remove functionality
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

// Syncs across tabs automatically
<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle theme
</button>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function ThemeDemo() {
    const [theme, setTheme, removeTheme] = useLocalStorage('demo-theme', 'light');
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Theme:" }), " ", theme] }), _jsxs("div", { children: [_jsx("strong", { children: "Stored in localStorage:" }), " ", localStorage.getItem('demo-theme') || 'None'] })] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'), children: "Toggle Theme" }), _jsx(Button, { onClick: () => setTheme('light'), variant: "outline", children: "Set Light" }), _jsx(Button, { onClick: () => setTheme('dark'), variant: "outline", children: "Set Dark" }), _jsx(Button, { onClick: removeTheme, variant: "outline", children: "Remove" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Open another tab and change the theme to see cross-tab synchronization. The value persists even after page refresh." })] }));
}
export const ThemeStorage = {
    render: () => _jsx(ThemeDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Storing theme preference in localStorage with cross-tab synchronization.',
            },
        },
    },
};
function UserPreferencesDemo() {
    const [preferences, setPreferences, removePreferences] = useLocalStorage('user-preferences', {
        language: 'en',
        notifications: true,
        fontSize: 14,
    });
    const updatePreference = (key, value) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Language:" }), " ", preferences.language] }), _jsxs("div", { children: [_jsx("strong", { children: "Notifications:" }), " ", preferences.notifications ? 'Enabled' : 'Disabled'] }), _jsxs("div", { children: [_jsx("strong", { children: "Font Size:" }), " ", preferences.fontSize, "px"] })] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Language:" }), _jsxs("select", { value: preferences.language, onChange: (e) => updatePreference('language', e.target.value), className: "w-full p-2 border rounded-lg", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Spanish" }), _jsx("option", { value: "fr", children: "French" }), _jsx("option", { value: "de", children: "German" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "notifications", checked: preferences.notifications, onChange: (e) => updatePreference('notifications', e.target.checked), className: "w-4 h-4" }), _jsx("label", { htmlFor: "notifications", className: "text-sm", children: "Enable Notifications" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium", children: ["Font Size: ", preferences.fontSize, "px"] }), _jsx("input", { type: "range", min: "12", max: "24", value: preferences.fontSize, onChange: (e) => updatePreference('fontSize', Number(e.target.value)), className: "w-full" })] }), _jsx(Button, { onClick: removePreferences, variant: "outline", children: "Reset Preferences" })] }));
}
export const UserPreferences = {
    render: () => _jsx(UserPreferencesDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Storing complex user preferences object in localStorage.',
            },
        },
    },
};
function FormPersistenceDemo() {
    const [formData, setFormData, removeFormData] = useLocalStorage('form-data', {
        name: '',
        email: '',
        message: '',
    });
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Name:" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })), className: "w-full p-2 border rounded-lg", placeholder: "Enter your name" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email:" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })), className: "w-full p-2 border rounded-lg", placeholder: "Enter your email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Message:" }), _jsx("textarea", { value: formData.message, onChange: (e) => setFormData((prev) => ({ ...prev, message: e.target.value })), className: "w-full p-2 border rounded-lg resize-none", rows: 4, placeholder: "Enter your message" })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { onClick: removeFormData, variant: "outline", children: "Clear Form" }) }), _jsx("p", { className: "text-xs text-gray-500", children: "Form data is automatically saved to localStorage. Try refreshing the page to see persistence." })] }));
}
export const FormPersistence = {
    render: () => _jsx(FormPersistenceDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Persisting form data in localStorage to prevent data loss on page refresh.',
            },
        },
    },
};
//# sourceMappingURL=UseLocalStorage.stories.js.map