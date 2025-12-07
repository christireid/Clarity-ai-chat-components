import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { HeroSection } from '@/components/Layout/HeroSection';
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid';
import { LiveChatDemo } from '@/components/Layout/LiveChatDemo';
import { CodeExample } from '@/components/Demo/CodeExample';
import { PerformanceComparison } from '@/components/Diagrams/PerformanceComparison';
import { FeatureMatrix } from '@/components/Diagrams/FeatureMatrix';
import { Zap, Palette, Accessibility, Code, Heart, Layers, Smartphone, } from 'lucide-react';
export default function HomePage() {
    return (_jsxs("div", { className: "relative", children: [_jsx(HeroSection, { title: _jsxs(_Fragment, { children: ["Beautiful AI Chat UIs", _jsx("br", {}), _jsx("span", { className: "text-brand-500", children: "Built for React" })] }), description: "Production-ready React components for building stunning chat interfaces. Type-safe, accessible, and ridiculously customizable.", primaryCta: {
                    text: 'Get Started',
                    href: '/learn/quick-start',
                }, secondaryCta: {
                    text: 'Live Demo',
                    href: '#demo',
                } }), _jsxs("section", { id: "demo", className: "container-docs py-24 scroll-mt-20", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "See It In Action" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Experience the power of Clarity Chat. Try the interactive demo below." })] }), _jsx(LiveChatDemo, {})] }), _jsx("section", { className: "bg-bg-secondary py-24", children: _jsxs("div", { className: "container-docs", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Start Building in Seconds" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Copy, paste, and customize. It's that simple." })] }), _jsx(CodeExample, { title: "Your First Chat Window", code: `import { ChatWindow, Message } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(text) => {
        setMessages([...messages, {
          id: Date.now().toString(),
          text,
          sender: 'user',
          timestamp: new Date(),
        }])
      }}
      placeholder="Type your message..."
      height="600px"
    />
  )
}`, language: "tsx", showLineNumbers: true })] }) }), _jsxs("section", { className: "container-docs py-24", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Why Clarity Chat?" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Everything you need to build production-ready chat interfaces" })] }), _jsx(FeaturesGrid, { features: [
                            {
                                icon: _jsx(Layers, { className: "w-8 h-8" }),
                                title: '70+ Components',
                                description: 'From basic messages to advanced patterns like command palettes, drag & drop, and context menus.',
                            },
                            {
                                icon: _jsx(Zap, { className: "w-8 h-8" }),
                                title: 'Lightning Fast',
                                description: 'Virtual scrolling for 1000+ messages. Tree-shakeable. Optimized with React.memo. Instant performance.',
                            },
                            {
                                icon: _jsx(Palette, { className: "w-8 h-8" }),
                                title: 'Fully Customizable',
                                description: 'Built with Tailwind CSS. 11 themes included. Override any style. Dark mode by default.',
                            },
                            {
                                icon: _jsx(Accessibility, { className: "w-8 h-8" }),
                                title: 'Accessible by Default',
                                description: 'WCAG AAA compliant. Full keyboard navigation, screen reader support, and ARIA attributes.',
                            },
                            {
                                icon: _jsx(Code, { className: "w-8 h-8" }),
                                title: 'TypeScript First',
                                description: 'Comprehensive type definitions. IntelliSense for every prop. Catch errors at compile time.',
                            },
                            {
                                icon: _jsx(Smartphone, { className: "w-8 h-8" }),
                                title: 'Mobile Optimized',
                                description: 'Touch gestures. Virtual keyboard handling. Responsive design. Perfect on any device.',
                            },
                        ] }), _jsxs("div", { className: "mt-24", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Optimized for Performance" }), _jsx("p", { className: "text-xl text-text-secondary", children: "After comprehensive React.memo optimization" })] }), _jsx(PerformanceComparison, {})] }), _jsxs("div", { className: "mt-24", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Most Feature-Complete" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Compare Clarity to alternatives" })] }), _jsx(FeatureMatrix, {})] })] }), _jsx("section", { className: "container-docs py-24", children: _jsxs("div", { className: "bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-10", children: _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" }) }), _jsxs("div", { className: "relative", children: [_jsx(Heart, { className: "w-12 h-12 mx-auto mb-4 fill-current" }), _jsx("h2", { className: "text-4xl font-bold mb-4", children: "Ready to Get Started?" }), _jsx("p", { className: "text-xl mb-8 opacity-90 max-w-2xl mx-auto", children: "Install Clarity Chat and build your first chat interface in minutes. Join thousands of developers building beautiful experiences." }), _jsxs("div", { className: "flex gap-4 justify-center flex-wrap", children: [_jsx(Link, { href: "/learn/quick-start", className: "px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg", children: "Quick Start \u2192" }), _jsx(Link, { href: "/reference/components", className: "px-8 py-3 bg-brand-700 text-white rounded-lg font-semibold hover:bg-brand-800 transition-colors border border-white/20", children: "Browse Components" })] })] })] }) }), _jsx("section", { className: "container-docs py-24 border-t border-border", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Learn" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsxs(Link, { href: "/learn/quick-start", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Quick Start" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/learn/tutorial", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Tutorial" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/learn/concepts", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Core Concepts" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Reference" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsxs(Link, { href: "/reference/components", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Components" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/reference/hooks", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Hooks" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/reference/api", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "API Reference" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Community" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsxs(Link, { href: "https://github.com/christireid/Clarity-ai-chat-components", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "GitHub" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/cookbook", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Cookbook" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) }), _jsx("li", { children: _jsxs(Link, { href: "/examples", className: "text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-2 group", children: [_jsx("span", { children: "Examples" }), _jsx("span", { className: "transition-transform group-hover:translate-x-1", children: "\u2192" })] }) })] })] })] }) })] }));
}
//# sourceMappingURL=page.js.map