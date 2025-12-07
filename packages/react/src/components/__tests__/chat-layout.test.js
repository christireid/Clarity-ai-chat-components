import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ChatLayout Component Tests
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatLayout } from '../chat-layout';
describe('ChatLayout', () => {
    describe('Basic rendering', () => {
        it('should render children in main area', () => {
            render(_jsx(ChatLayout, { children: _jsx("div", { children: "Main content" }) }));
            expect(screen.getByText('Main content')).toBeInTheDocument();
        });
        it('should render with default variant', () => {
            const { container } = render(_jsx(ChatLayout, { children: _jsx("div", { children: "Content" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'flex-col', 'h-full');
        });
    });
    describe('Header', () => {
        it('should render header when provided', () => {
            render(_jsx(ChatLayout, { header: _jsx("div", { children: "Header content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Header content')).toBeInTheDocument();
        });
        it('should wrap header in header element', () => {
            render(_jsx(ChatLayout, { header: _jsx("span", { children: "Header text" }), children: _jsx("div", { children: "Main" }) }));
            const header = screen.getByText('Header text').closest('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('flex-shrink-0', 'border-b');
        });
        it('should not render header when not provided', () => {
            const { container } = render(_jsx(ChatLayout, { children: _jsx("div", { children: "Main" }) }));
            expect(container.querySelector('header')).not.toBeInTheDocument();
        });
    });
    describe('Footer', () => {
        it('should render footer when provided', () => {
            render(_jsx(ChatLayout, { footer: _jsx("div", { children: "Footer content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Footer content')).toBeInTheDocument();
        });
        it('should wrap footer in footer element', () => {
            render(_jsx(ChatLayout, { footer: _jsx("span", { children: "Footer text" }), children: _jsx("div", { children: "Main" }) }));
            const footer = screen.getByText('Footer text').closest('footer');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass('flex-shrink-0', 'border-t');
        });
        it('should not render footer when not provided', () => {
            const { container } = render(_jsx(ChatLayout, { children: _jsx("div", { children: "Main" }) }));
            expect(container.querySelector('footer')).not.toBeInTheDocument();
        });
    });
    describe('Sidebar', () => {
        it('should render sidebar when provided', () => {
            render(_jsx(ChatLayout, { sidebar: _jsx("div", { children: "Sidebar content" }), children: _jsx("div", { children: "Main" }) }));
            expect(screen.getByText('Sidebar content')).toBeInTheDocument();
        });
        it('should wrap sidebar in aside element', () => {
            render(_jsx(ChatLayout, { sidebar: _jsx("span", { children: "Sidebar text" }), children: _jsx("div", { children: "Main" }) }));
            const aside = screen.getByText('Sidebar text').closest('aside');
            expect(aside).toBeInTheDocument();
            expect(aside).toHaveClass('flex-shrink-0', 'border-r');
        });
        it('should not render sidebar when not provided', () => {
            const { container } = render(_jsx(ChatLayout, { children: _jsx("div", { children: "Main" }) }));
            expect(container.querySelector('aside')).not.toBeInTheDocument();
        });
        it('should have default width for sidebar', () => {
            render(_jsx(ChatLayout, { sidebar: _jsx("div", { children: "Sidebar" }), children: _jsx("div", { children: "Main" }) }));
            const aside = screen.getByText('Sidebar').closest('aside');
            expect(aside).toHaveClass('w-64');
        });
    });
    describe('Layout variants', () => {
        it('should apply split variant styles with sidebar', () => {
            const { container } = render(_jsx(ChatLayout, { variant: "split", sidebar: _jsx("div", { children: "Sidebar" }), children: _jsx("div", { children: "Main" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex-row');
            const aside = screen.getByText('Sidebar').closest('aside');
            expect(aside).toHaveClass('w-80');
        });
        it('should not apply flex-row without sidebar in split variant', () => {
            const { container } = render(_jsx(ChatLayout, { variant: "split", children: _jsx("div", { children: "Main" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).not.toHaveClass('flex-row');
        });
        it('should render full variant', () => {
            const { container } = render(_jsx(ChatLayout, { variant: "full", children: _jsx("div", { children: "Main" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'flex-col', 'h-full');
        });
    });
    describe('Custom className', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(ChatLayout, { className: "custom-class", children: _jsx("div", { children: "Main" }) }));
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('custom-class');
        });
        it('should merge custom className with default classes', () => {
            const { container } = render(_jsx(ChatLayout, { className: "my-custom-class bg-gray-100", children: _jsx("div", { children: "Main" }) }));
            const wrapper = container.firstChild;
            // Default classes should be present
            expect(wrapper).toHaveClass('flex', 'flex-col');
            // Custom classes should be added
            expect(wrapper).toHaveClass('my-custom-class', 'bg-gray-100');
        });
    });
    describe('Full layout composition', () => {
        it('should render all sections together', () => {
            render(_jsx(ChatLayout, { header: _jsx("div", { children: "Header" }), sidebar: _jsx("div", { children: "Sidebar" }), footer: _jsx("div", { children: "Footer" }), children: _jsx("div", { children: "Main content" }) }));
            expect(screen.getByText('Header')).toBeInTheDocument();
            expect(screen.getByText('Sidebar')).toBeInTheDocument();
            expect(screen.getByText('Main content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
        it('should maintain correct DOM order', () => {
            const { container } = render(_jsx(ChatLayout, { header: _jsx("div", { "data-testid": "header", children: "Header" }), sidebar: _jsx("div", { "data-testid": "sidebar", children: "Sidebar" }), footer: _jsx("div", { "data-testid": "footer", children: "Footer" }), children: _jsx("div", { "data-testid": "main", children: "Main" }) }));
            const elements = container.querySelectorAll('[data-testid]');
            const order = Array.from(elements).map((el) => el.getAttribute('data-testid'));
            // Header should come first, then sidebar/main, then footer
            expect(order[0]).toBe('header');
            expect(order[order.length - 1]).toBe('footer');
        });
    });
    describe('Main content area', () => {
        it('should wrap main content in main element', () => {
            render(_jsx(ChatLayout, { children: _jsx("span", { children: "Main text" }) }));
            const main = screen.getByText('Main text').closest('main');
            expect(main).toBeInTheDocument();
            expect(main).toHaveClass('flex-1', 'overflow-hidden');
        });
        it('should render complex children', () => {
            render(_jsx(ChatLayout, { children: _jsxs("div", { children: [_jsx("h1", { children: "Title" }), _jsx("p", { children: "Paragraph" }), _jsx("button", { children: "Click me" })] }) }));
            expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(ChatLayout.displayName).toBe('ChatLayout');
        });
    });
});
//# sourceMappingURL=chat-layout.test.js.map