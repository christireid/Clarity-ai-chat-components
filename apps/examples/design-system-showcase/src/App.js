import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Design System Showcase
 *
 * Comprehensive demonstration of all enhanced components and design patterns
 */
import { useState } from 'react';
import { Button } from '@clarity-chat/primitives';
import { ToastProvider } from '@clarity-chat/react';
// Showcase sections
import { DesignTokens } from './sections/DesignTokens';
import { ButtonShowcase } from './sections/ButtonShowcase';
import { FormShowcase } from './sections/FormShowcase';
import { CardShowcase } from './sections/CardShowcase';
import { OverlayShowcase } from './sections/OverlayShowcase';
import { ChatShowcase } from './sections/ChatShowcase';
import { AnimationShowcase } from './sections/AnimationShowcase';
export default function App() {
    const [activeSection, setActiveSection] = useState('tokens');
    const sections = [
        { id: 'tokens', label: 'Design Tokens', icon: '🎨' },
        { id: 'buttons', label: 'Buttons', icon: '🔘' },
        { id: 'forms', label: 'Forms', icon: '📝' },
        { id: 'cards', label: 'Cards', icon: '🎴' },
        { id: 'overlays', label: 'Overlays', icon: '🪟' },
        { id: 'chat', label: 'Chat Components', icon: '💬' },
        { id: 'animations', label: 'Animations', icon: '✨' },
    ];
    return (_jsx(ToastProvider, { children: _jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Clarity Chat Components" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Design System Showcase v2.0" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Documentation" }), _jsx(Button, { size: "sm", children: "Get Started" })] })] }) }) }), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "grid grid-cols-12 gap-8", children: [_jsx("aside", { className: "col-span-12 lg:col-span-3", children: _jsx("nav", { className: "sticky top-24 space-y-1", children: sections.map((section) => (_jsxs("button", { onClick: () => setActiveSection(section.id), className: `w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all duration-200 ${activeSection === section.id
                                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-xs'
                                            : 'hover:bg-muted/30 text-foreground'}`, children: [_jsx("span", { className: "text-xl", children: section.icon }), _jsx("span", { className: "font-medium", children: section.label })] }, section.id))) }) }), _jsx("main", { className: "col-span-12 lg:col-span-9", children: _jsxs("div", { className: "space-y-8", children: [activeSection === 'tokens' && _jsx(DesignTokens, {}), activeSection === 'buttons' && _jsx(ButtonShowcase, {}), activeSection === 'forms' && _jsx(FormShowcase, {}), activeSection === 'cards' && _jsx(CardShowcase, {}), activeSection === 'overlays' && _jsx(OverlayShowcase, {}), activeSection === 'chat' && _jsx(ChatShowcase, {}), activeSection === 'animations' && _jsx(AnimationShowcase, {})] }) })] }) }), _jsx("footer", { className: "mt-16 border-t border-border/50 bg-muted/30", children: _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: [_jsx("p", { children: "Clarity Chat Components v2.0" }), _jsx("p", { children: "Enhanced UI/UX \u2022 50+ Components \u2022 Production Ready" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("a", { href: "#", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "GitHub" }), _jsx("a", { href: "#", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Documentation" }), _jsx("a", { href: "#", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Examples" })] })] }) }) })] }) }));
}
//# sourceMappingURL=App.js.map