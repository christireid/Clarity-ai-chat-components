import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { HeroSection } from '@/components/Layout/HeroSection';
import { FeaturesGrid } from '@/components/Layout/FeaturesGrid';
import { CodeExample } from '@/components/Demo/CodeExample';
import { PerformanceComparison } from '@/components/Diagrams/PerformanceComparison';
import { FeatureMatrix } from '@/components/Diagrams/FeatureMatrix';
import { Sparkles, Zap, Palette, Accessibility, Code, Rocket, } from 'lucide-react';
export default function HomePage() {
    return (_jsxs("div", { className: "relative", children: [_jsx(HeroSection, { title: _jsxs(_Fragment, { children: ["Build Beautiful Chat UIs", _jsx("br", {}), _jsx("span", { className: "text-brand-500", children: "Lightning Fast" })] }), description: "A comprehensive React UI library with 70+ components, 30+ hooks, and 150+ animations. Built with TypeScript, Tailwind CSS, and Framer Motion.", primaryCta: {
                    text: 'Get Started',
                    href: '/learn/quick-start',
                }, secondaryCta: {
                    text: 'View Components',
                    href: '/reference/components',
                } }), _jsxs("section", { className: "container-docs py-24", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Start Building in Seconds" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Copy, paste, and customize. It's that simple." })] }), _jsx(CodeExample, { title: "Your First Chat Window", code: `import { ChatWindow, Message } from '@clarity-chat/react'

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
}`, language: "tsx", showLineNumbers: true })] }), _jsxs("section", { className: "bg-bg-secondary py-24", children: [_jsxs("div", { className: "container-docs", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Why Clarity Chat?" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Everything you need to build production-ready chat interfaces" })] }), _jsx(FeaturesGrid, { features: [
                                    {
                                        icon: _jsx(Sparkles, { className: "w-8 h-8" }),
                                        title: '70+ Components',
                                        description: 'From basic messages to advanced patterns like command palettes, drag & drop, and context menus.',
                                    },
                                    {
                                        icon: _jsx(Zap, { className: "w-8 h-8" }),
                                        title: '150+ Animations',
                                        description: 'Smooth, performant animations powered by Framer Motion. Spring physics, stagger effects, and more.',
                                    },
                                    {
                                        icon: _jsx(Palette, { className: "w-8 h-8" }),
                                        title: 'Fully Customizable',
                                        description: 'Built with Tailwind CSS. Override any style with your design tokens. Dark mode included.',
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
                                        icon: _jsx(Rocket, { className: "w-8 h-8" }),
                                        title: 'Production Ready',
                                        description: 'Tree-shakeable, performant, and battle-tested. Used in production by teams worldwide.',
                                    },
                                ] })] }), _jsxs("div", { className: "mt-24", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Optimized for Performance" }), _jsx("p", { className: "text-xl text-text-secondary", children: "After comprehensive React.memo optimization" })] }), _jsx(PerformanceComparison, {})] }), _jsxs("div", { className: "mt-24", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Most Feature-Complete" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Compare Clarity to alternatives" })] }), _jsx(FeatureMatrix, {})] })] }), _jsx("section", { className: "container-docs py-24", children: _jsxs("div", { className: "bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Ready to Get Started?" }), _jsx("p", { className: "text-xl mb-8 opacity-90", children: "Install Clarity Chat and build your first chat interface in minutes." }), _jsxs("div", { className: "flex gap-4 justify-center flex-wrap", children: [_jsx(Link, { href: "/learn/installation", className: "px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors", children: "Installation Guide" }), _jsx(Link, { href: "/examples", className: "px-8 py-3 bg-brand-700 text-white rounded-lg font-semibold hover:bg-brand-800 transition-colors", children: "View Examples" })] })] }) }), _jsx("section", { className: "container-docs py-24 border-t border-border", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Learn" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsx(Link, { href: "/learn/quick-start", className: "text-brand-500 hover:text-brand-600", children: "Quick Start \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "/learn/tutorial", className: "text-brand-500 hover:text-brand-600", children: "Tutorial \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "/learn/concepts", className: "text-brand-500 hover:text-brand-600", children: "Core Concepts \u2192" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Reference" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsx(Link, { href: "/reference/components", className: "text-brand-500 hover:text-brand-600", children: "Components \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "/reference/hooks", className: "text-brand-500 hover:text-brand-600", children: "Hooks \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "/reference/api", className: "text-brand-500 hover:text-brand-600", children: "API Reference \u2192" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Community" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsx(Link, { href: "https://github.com/clarity-chat/ui", className: "text-brand-500 hover:text-brand-600", children: "GitHub \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "https://storybook.clarity-chat.dev", className: "text-brand-500 hover:text-brand-600", children: "Storybook \u2192" }) }), _jsx("li", { children: _jsx(Link, { href: "/examples", className: "text-brand-500 hover:text-brand-600", children: "Examples \u2192" }) })] })] })] }) })] }));
}
//# sourceMappingURL=page.js.map