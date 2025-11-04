import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { CollapsibleSection, Accordion, ExpandableListItem, } from '../../../packages/react/src/components/collapsible-section';
const meta = {
    title: 'Components/CollapsibleSection',
    component: CollapsibleSection,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Animated expand/collapse component with smooth height transitions. Perfect for accordions, FAQ sections, and expandable list items.',
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsx("span", { children: "Click to expand" }), children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This is the collapsible content. It animates smoothly when opening and closing." }) })),
};
export const DefaultOpen = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsx("span", { children: "Already Open" }), defaultOpen: true, children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This section starts in the open state." }) })),
};
export const Controlled = {
    render: () => {
        const [open, setOpen] = React.useState(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setOpen(true), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Open" }), _jsx("button", { onClick: () => setOpen(false), className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700", children: "Close" })] }), _jsx(CollapsibleSection, { open: open, onOpenChange: setOpen, trigger: _jsx("span", { children: "Controlled Section" }), children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["This section is controlled by external state. Current state: ", open ? 'open' : 'closed'] }) })] }));
    },
};
// ============================================================================
// Animation Speeds
// ============================================================================
export const FastAnimation = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsx("span", { children: "Fast Animation (0.15s)" }), duration: 0.15, children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This section opens and closes quickly with a 150ms duration." }) })),
};
export const SlowAnimation = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsx("span", { children: "Slow Animation (0.6s)" }), duration: 0.6, children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This section opens and closes slowly with a 600ms duration." }) })),
};
// ============================================================================
// Content Examples
// ============================================================================
export const WithRichContent = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDCE6" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Product Details" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Click to see specifications" })] })] }), children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsx("div", { className: "font-medium", children: "Brand:" }), _jsx("div", { className: "text-muted-foreground", children: "Acme Corp" }), _jsx("div", { className: "font-medium", children: "Model:" }), _jsx("div", { className: "text-muted-foreground", children: "XR-2000" }), _jsx("div", { className: "font-medium", children: "Color:" }), _jsx("div", { className: "text-muted-foreground", children: "Space Gray" }), _jsx("div", { className: "font-medium", children: "Weight:" }), _jsx("div", { className: "text-muted-foreground", children: "1.2 kg" })] }), _jsx("button", { className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: "Add to Cart" })] }) })),
};
export const WithLongContent = {
    render: () => (_jsx(CollapsibleSection, { trigger: _jsx("span", { children: "Long Content Example" }), children: _jsxs("div", { className: "space-y-4 text-sm text-muted-foreground", children: [_jsx("p", { children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }), _jsx("p", { children: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }), _jsx("p", { children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." })] }) })),
};
// ============================================================================
// Accordion Examples
// ============================================================================
export const BasicAccordion = {
    render: () => {
        const items = [
            {
                id: '1',
                trigger: _jsx("span", { children: "What is React?" }),
                content: (_jsx("p", { className: "text-sm text-muted-foreground", children: "React is a JavaScript library for building user interfaces, maintained by Facebook and a community of developers." })),
            },
            {
                id: '2',
                trigger: _jsx("span", { children: "What is Framer Motion?" }),
                content: (_jsx("p", { className: "text-sm text-muted-foreground", children: "Framer Motion is a production-ready motion library for React that makes it easy to create smooth animations." })),
            },
            {
                id: '3',
                trigger: _jsx("span", { children: "What is TypeScript?" }),
                content: (_jsx("p", { className: "text-sm text-muted-foreground", children: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript, providing better tooling and type safety." })),
            },
        ];
        return _jsx(Accordion, { items: items });
    },
};
export const MultipleOpenAccordion = {
    render: () => {
        const items = [
            {
                id: '1',
                trigger: _jsx("span", { children: "Section 1 (Multiple can be open)" }),
                content: _jsx("p", { className: "text-sm text-muted-foreground", children: "Content for section 1" }),
            },
            {
                id: '2',
                trigger: _jsx("span", { children: "Section 2" }),
                content: _jsx("p", { className: "text-sm text-muted-foreground", children: "Content for section 2" }),
            },
            {
                id: '3',
                trigger: _jsx("span", { children: "Section 3" }),
                content: _jsx("p", { className: "text-sm text-muted-foreground", children: "Content for section 3" }),
            },
        ];
        return _jsx(Accordion, { items: items, allowMultiple: true, defaultOpenId: "1" });
    },
};
// ============================================================================
// Expandable List Item
// ============================================================================
export const ExpandableList = {
    render: () => (_jsxs("div", { className: "space-y-2", children: [_jsx(ExpandableListItem, { icon: _jsx("span", { className: "text-xl", children: "\uD83D\uDCE7" }), title: "New Messages", badge: _jsx("span", { className: "px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full", children: "3" }), children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "p-2 bg-muted rounded text-sm", children: [_jsx("div", { className: "font-medium", children: "John Doe" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Meeting at 3pm?" })] }), _jsxs("div", { className: "p-2 bg-muted rounded text-sm", children: [_jsx("div", { className: "font-medium", children: "Jane Smith" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Code review complete" })] }), _jsxs("div", { className: "p-2 bg-muted rounded text-sm", children: [_jsx("div", { className: "font-medium", children: "Bob Johnson" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Deployment successful" })] })] }) }), _jsx(ExpandableListItem, { icon: _jsx("span", { className: "text-xl", children: "\uD83D\uDCC1" }), title: "Recent Files", badge: _jsx("span", { className: "text-xs text-muted-foreground", children: "5 items" }), defaultOpen: true, children: _jsxs("div", { className: "space-y-1 text-sm", children: [_jsx("div", { className: "p-2 hover:bg-muted rounded cursor-pointer", children: "document.pdf" }), _jsx("div", { className: "p-2 hover:bg-muted rounded cursor-pointer", children: "image.png" }), _jsx("div", { className: "p-2 hover:bg-muted rounded cursor-pointer", children: "spreadsheet.xlsx" })] }) }), _jsx(ExpandableListItem, { icon: _jsx("span", { className: "text-xl", children: "\u2699\uFE0F" }), title: "Settings", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { className: "text-sm", children: "Enable notifications" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox" }), _jsx("span", { className: "text-sm", children: "Dark mode" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { className: "text-sm", children: "Auto-save" })] })] }) })] })),
};
// ============================================================================
// Real-World Examples
// ============================================================================
export const FAQSection = {
    render: () => {
        const faqItems = [
            {
                id: 'shipping',
                trigger: (_jsx("div", { className: "text-left", children: _jsx("div", { className: "font-semibold", children: "How long does shipping take?" }) })),
                content: (_jsxs("div", { className: "text-sm text-muted-foreground space-y-2", children: [_jsx("p", { children: "Standard shipping typically takes 5-7 business days." }), _jsx("p", { children: "Express shipping is available and takes 2-3 business days." }), _jsx("p", { children: "Free shipping is available on orders over $50." })] })),
            },
            {
                id: 'returns',
                trigger: (_jsx("div", { className: "text-left", children: _jsx("div", { className: "font-semibold", children: "What is your return policy?" }) })),
                content: (_jsxs("div", { className: "text-sm text-muted-foreground space-y-2", children: [_jsx("p", { children: "We accept returns within 30 days of purchase." }), _jsx("p", { children: "Items must be in original condition with tags attached." }), _jsx("p", { children: "Return shipping is free for defective items." })] })),
            },
            {
                id: 'warranty',
                trigger: (_jsx("div", { className: "text-left", children: _jsx("div", { className: "font-semibold", children: "Do products come with a warranty?" }) })),
                content: (_jsxs("div", { className: "text-sm text-muted-foreground space-y-2", children: [_jsx("p", { children: "All products come with a 1-year manufacturer warranty." }), _jsx("p", { children: "Extended warranties are available for purchase." }), _jsx("p", { children: "Warranty covers manufacturing defects and malfunctions." })] })),
            },
        ];
        return (_jsxs("div", { className: "max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Frequently Asked Questions" }), _jsx(Accordion, { items: faqItems })] }));
    },
};
export const ProductFeatures = {
    render: () => (_jsxs("div", { className: "max-w-2xl space-y-2", children: [_jsx(CollapsibleSection, { trigger: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: "\u26A1" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-semibold", children: "Performance" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Lightning-fast speeds" })] })] }), children: _jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground list-disc list-inside", children: [_jsx("li", { children: "50% faster than previous generation" }), _jsx("li", { children: "Optimized for modern workflows" }), _jsx("li", { children: "Hardware acceleration support" }), _jsx("li", { children: "Efficient memory usage" })] }) }), _jsx(CollapsibleSection, { trigger: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: "\uD83C\uDFA8" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-semibold", children: "Design" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Beautiful and modern" })] })] }), children: _jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground list-disc list-inside", children: [_jsx("li", { children: "Sleek minimalist interface" }), _jsx("li", { children: "Dark mode support" }), _jsx("li", { children: "Customizable themes" }), _jsx("li", { children: "Responsive layout" })] }) }), _jsx(CollapsibleSection, { trigger: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDD12" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-semibold", children: "Security" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Enterprise-grade protection" })] })] }), children: _jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground list-disc list-inside", children: [_jsx("li", { children: "End-to-end encryption" }), _jsx("li", { children: "Two-factor authentication" }), _jsx("li", { children: "Regular security audits" }), _jsx("li", { children: "SOC 2 Type II certified" })] }) })] })),
};
//# sourceMappingURL=CollapsibleSection.stories.js.map