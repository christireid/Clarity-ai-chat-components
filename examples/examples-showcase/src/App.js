import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clarity Chat Components Showcase
 *
 * Interactive demonstration of all components, themes, and features
 */
import { useState } from 'react';
import { ThemeProvider, ChatWindow, CustomerSupportTemplate, defaultLightTheme, defaultDarkTheme, oceanTheme, sunsetTheme, forestTheme, corporateTheme, minimalLightTheme, minimalDarkTheme, vibrantLightTheme, vibrantDarkTheme, } from '@clarity-chat/react';
const themes = {
    'Default Light': defaultLightTheme,
    'Default Dark': defaultDarkTheme,
    'Ocean': oceanTheme,
    'Sunset': sunsetTheme,
    'Forest': forestTheme,
    'Corporate': corporateTheme,
    'Minimal Light': minimalLightTheme,
    'Minimal Dark': minimalDarkTheme,
    'Vibrant Light': vibrantLightTheme,
    'Vibrant Dark': vibrantDarkTheme,
};
export default function App() {
    const [currentView, setCurrentView] = useState('playground');
    const [selectedTheme, setSelectedTheme] = useState(defaultLightTheme);
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant',
            content: `# Welcome to Clarity Chat Showcase! 🎉

This is an interactive demonstration of all the features and components available in Clarity Chat.

## Features You Can Try:
- 🎨 **Theme Switching** - Try all 10 built-in themes
- 💬 **Rich Messages** - Markdown, code highlighting, and more
- 🎤 **Voice Input** - Click the microphone to speak
- 📁 **File Upload** - Drag & drop or click to upload
- 📊 **Usage Tracking** - See token counts and costs
- ⚡ **Performance** - Monitor real-time performance

## Code Example:
\`\`\`typescript
import { ChatWindow } from '@clarity-chat/react'

function App() {
  return <ChatWindow messages={messages} />
}
\`\`\`

Try sending a message below!`,
            timestamp: new Date(),
        },
    ]);
    const handleSendMessage = async (content) => {
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I received your message: "${content}". This is a demo response showcasing the chat interface. Try exploring different themes and features!`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };
    const renderView = () => {
        switch (currentView) {
            case 'playground':
                return (_jsx("div", { className: "playground", children: _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage, enableFileUpload: true, enableVoiceInput: true }) }));
            case 'templates':
                return (_jsxs("div", { className: "templates-view", children: [_jsx("h2", { children: "Pre-built Templates" }), _jsxs("div", { className: "template-grid", children: [_jsxs("div", { className: "template-card", children: [_jsx("h3", { children: "Customer Support" }), _jsx("p", { children: "Professional support chat with FAQ and escalation" }), _jsx(CustomerSupportTemplate, { companyName: "Demo Corp" })] }), _jsxs("div", { className: "template-card", children: [_jsx("h3", { children: "AI Assistant" }), _jsx("p", { children: "General-purpose AI assistant with multiple models" })] }), _jsxs("div", { className: "template-card", children: [_jsx("h3", { children: "Code Helper" }), _jsx("p", { children: "Programming assistant with syntax highlighting" })] })] })] }));
            case 'themes':
                return (_jsxs("div", { className: "themes-view", children: [_jsx("h2", { children: "Theme Gallery" }), _jsx("div", { className: "theme-grid", children: Object.entries(themes).map(([name, theme]) => (_jsxs("div", { className: "theme-preview-card", onClick: () => setSelectedTheme(theme), children: [_jsx("h3", { children: name }), _jsx("div", { className: "mini-chat-preview", children: _jsx(ThemeProvider, { theme: theme, children: _jsxs("div", { className: "mini-messages", children: [_jsx("div", { className: "mini-message user", children: "Hello!" }), _jsx("div", { className: "mini-message assistant", children: "Hi there!" })] }) }) })] }, name))) })] }));
            case 'components':
                return (_jsxs("div", { className: "components-view", children: [_jsx("h2", { children: "Component Library" }), _jsxs("div", { className: "component-sections", children: [_jsxs("section", { children: [_jsx("h3", { children: "Chat Components" }), _jsxs("ul", { children: [_jsx("li", { children: "ChatWindow - Full chat interface" }), _jsx("li", { children: "MessageList - Message container" }), _jsx("li", { children: "Message - Individual messages" }), _jsx("li", { children: "ChatInput - Message input field" }), _jsx("li", { children: "StreamingMessage - Real-time streaming" })] })] }), _jsxs("section", { children: [_jsx("h3", { children: "AI Features" }), _jsxs("ul", { children: [_jsx("li", { children: "ModelSelector - Choose AI models" }), _jsx("li", { children: "TokenCounter - Track token usage" }), _jsx("li", { children: "ThinkingIndicator - AI processing states" }), _jsx("li", { children: "ToolInvocationCard - Function calling UI" })] })] }), _jsxs("section", { children: [_jsx("h3", { children: "Utility Components" }), _jsxs("ul", { children: [_jsx("li", { children: "VoiceInput - Speech to text" }), _jsx("li", { children: "FileUpload - File handling" }), _jsx("li", { children: "ContextManager - Document context" }), _jsx("li", { children: "ExportDialog - Export conversations" })] })] })] })] }));
            default:
                return null;
        }
    };
    return (_jsx(ThemeProvider, { theme: selectedTheme, children: _jsxs("div", { className: "showcase-app", children: [_jsxs("header", { className: "showcase-header", children: [_jsx("h1", { children: "Clarity Chat Components" }), _jsx("p", { children: "Production-ready AI chat components for React" })] }), _jsxs("nav", { className: "showcase-nav", children: [_jsx("button", { className: currentView === 'playground' ? 'active' : '', onClick: () => setCurrentView('playground'), children: "Playground" }), _jsx("button", { className: currentView === 'components' ? 'active' : '', onClick: () => setCurrentView('components'), children: "Components" }), _jsx("button", { className: currentView === 'templates' ? 'active' : '', onClick: () => setCurrentView('templates'), children: "Templates" }), _jsx("button", { className: currentView === 'themes' ? 'active' : '', onClick: () => setCurrentView('themes'), children: "Themes" })] }), _jsx("div", { className: "showcase-controls", children: _jsxs("label", { children: ["Current Theme:", _jsx("select", { value: Object.entries(themes).find(([_, t]) => t === selectedTheme)?.[0], onChange: (e) => setSelectedTheme(themes[e.target.value]), children: Object.keys(themes).map(name => (_jsx("option", { value: name, children: name }, name))) })] }) }), _jsx("main", { className: "showcase-main", children: renderView() }), _jsx("footer", { className: "showcase-footer", children: _jsxs("p", { children: ["\u00A9 2024 Clarity Chat \u2022", ' ', _jsx("a", { href: "https://github.com/christireid/Clarity-ai-chat-components", children: "GitHub" }), " \u2022", ' ', _jsx("a", { href: "/docs", children: "Documentation" })] }) })] }) }));
}
//# sourceMappingURL=App.js.map