import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ResizableChatLayout Component Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResizableChatLayout, useResizableLayout, } from '../resizable-chat-layout';
// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => ({
    Panel: ({ children, className }) => (_jsx("div", { "data-testid": "panel", className: className, children: children })),
    PanelGroup: ({ children, className, direction }) => (_jsx("div", { "data-testid": "panel-group", "data-direction": direction, className: className, children: children })),
    PanelResizeHandle: ({ className }) => (_jsx("div", { "data-testid": "resize-handle", className: className })),
}));
describe('ResizableChatLayout', () => {
    describe('Basic rendering', () => {
        it('should render children in main area', () => {
            render(_jsx(ResizableChatLayout, { children: _jsx("div", { children: "Main content" }) }));
            expect(screen.getByText('Main content')).toBeInTheDocument();
        });
        it('should apply custom className', () => {
            const { container } = render(_jsx(ResizableChatLayout, { className: "custom-class", children: _jsx("div", { children: "Content" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('custom-class');
        });
    });
    describe('Header', () => {
        it('should render header when provided', () => {
            render(_jsx(ResizableChatLayout, { header: _jsx("div", { children: "Header content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Header content')).toBeInTheDocument();
        });
        it('should wrap header in header element', () => {
            render(_jsx(ResizableChatLayout, { header: _jsx("span", { children: "Header text" }), children: _jsx("div", { children: "Main" }) }));
            const header = screen.getByText('Header text').closest('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('flex-shrink-0', 'border-b');
        });
        it('should not render header when not provided', () => {
            const { container } = render(_jsx(ResizableChatLayout, { children: _jsx("div", { children: "Main" }) }));
            expect(container.querySelector('header')).not.toBeInTheDocument();
        });
    });
    describe('Footer', () => {
        it('should render footer when provided', () => {
            render(_jsx(ResizableChatLayout, { footer: _jsx("div", { children: "Footer content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Footer content')).toBeInTheDocument();
        });
        it('should wrap footer in footer element', () => {
            render(_jsx(ResizableChatLayout, { footer: _jsx("span", { children: "Footer text" }), children: _jsx("div", { children: "Main" }) }));
            const footer = screen.getByText('Footer text').closest('footer');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass('flex-shrink-0', 'border-t');
        });
    });
    describe('Sidebar', () => {
        it('should render sidebar when provided', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Sidebar content')).toBeInTheDocument();
        });
        it('should render PanelGroup when sidebar is provided', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByTestId('panel-group')).toBeInTheDocument();
        });
        it('should render resize handle between panels', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByTestId('resize-handle')).toBeInTheDocument();
        });
        it('should not render PanelGroup when no sidebar', () => {
            render(_jsx(ResizableChatLayout, { children: _jsx("div", { children: "Main" }) }));
            expect(screen.queryByTestId('panel-group')).not.toBeInTheDocument();
        });
    });
    describe('Direction', () => {
        it('should default to horizontal direction', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), children: _jsx("div", { children: "Main" }) }));
            const panelGroup = screen.getByTestId('panel-group');
            expect(panelGroup).toHaveAttribute('data-direction', 'horizontal');
        });
        it('should support vertical direction', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), direction: "vertical", children: _jsx("div", { children: "Main" }) }));
            const panelGroup = screen.getByTestId('panel-group');
            expect(panelGroup).toHaveAttribute('data-direction', 'vertical');
        });
    });
    describe('Sidebar position', () => {
        it('should default to left sidebar', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), sidebarPosition: "left", children: _jsx("div", { children: "Main" }) }));
            // Just verify it renders without error
            expect(screen.getByText('Sidebar')).toBeInTheDocument();
            expect(screen.getByText('Main')).toBeInTheDocument();
        });
        it('should support right sidebar position', () => {
            render(_jsx(ResizableChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), sidebarPosition: "right", children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Sidebar')).toBeInTheDocument();
            expect(screen.getByText('Main')).toBeInTheDocument();
        });
    });
    describe('Full layout composition', () => {
        it('should render all sections together', () => {
            render(_jsx(ResizableChatLayout, { header: _jsx("div", { children: "Header" }), sidebar: _jsx("div", { children: "Sidebar" }), footer: _jsx("div", { children: "Footer" }), children: _jsx("div", { children: "Main content" }) }));
            expect(screen.getByText('Header')).toBeInTheDocument();
            expect(screen.getByText('Sidebar')).toBeInTheDocument();
            expect(screen.getByText('Main content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(ResizableChatLayout.displayName).toBe('ResizableChatLayout');
        });
    });
});
describe('useResizableLayout', () => {
    it('should return layout control functions', () => {
        // This is a basic test to ensure the hook returns expected shape
        const TestComponent = () => {
            const layout = useResizableLayout();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "has-ref", children: layout.ref ? 'yes' : 'no' }), _jsx("span", { "data-testid": "has-collapse", children: typeof layout.collapse }), _jsx("span", { "data-testid": "has-expand", children: typeof layout.expand }), _jsx("span", { "data-testid": "has-resize", children: typeof layout.resize })] }));
        };
        render(_jsx(TestComponent, {}));
        expect(screen.getByTestId('has-collapse')).toHaveTextContent('function');
        expect(screen.getByTestId('has-expand')).toHaveTextContent('function');
        expect(screen.getByTestId('has-resize')).toHaveTextContent('function');
    });
});
//# sourceMappingURL=resizable-chat-layout.test.js.map