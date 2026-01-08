import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from '../card';
import { Button } from '../ui/button-enhanced';
describe('Card Component', () => {
    describe('Rendering', () => {
        it('should render Card component', () => {
            render(_jsx(Card, { children: "Card content" }));
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });
        it('should render CardHeader', () => {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: "Header" }) }));
            expect(screen.getByText('Header')).toBeInTheDocument();
        });
        it('should render CardTitle', () => {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardTitle, { children: "Card Title" }) }) }));
            expect(screen.getByText('Card Title')).toBeInTheDocument();
        });
        it('should render CardDescription', () => {
            render(_jsx(Card, { children: _jsx(CardHeader, { children: _jsx(CardDescription, { children: "Card description" }) }) }));
            expect(screen.getByText('Card description')).toBeInTheDocument();
        });
        it('should render CardContent', () => {
            render(_jsx(Card, { children: _jsx(CardContent, { children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should render CardFooter', () => {
            render(_jsx(Card, { children: _jsx(CardFooter, { children: "Footer" }) }));
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
        it('should render complete card structure', () => {
            render(_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Title" }), _jsx(CardDescription, { children: "Description" })] }), _jsx(CardContent, { children: "Content" }), _jsx(CardFooter, { children: _jsx(Button, { children: "Action" }) })] }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        });
    });
    describe('Styling', () => {
        it('should apply default card styles', () => {
            const { container } = render(_jsx(Card, { children: "Content" }));
            const card = container.firstChild;
            expect(card).toHaveClass('rounded-xl');
        });
        it('should accept custom className', () => {
            const { container } = render(_jsx(Card, { className: "custom-card", children: "Content" }));
            const card = container.firstChild;
            expect(card).toHaveClass('custom-card');
        });
        it('should apply header styles', () => {
            const { container } = render(_jsx(Card, { children: _jsx(CardHeader, { children: "Header" }) }));
            const header = container.querySelector('.flex.flex-col.space-y-1\\.5');
            expect(header).toBeInTheDocument();
        });
        it('should apply content styles', () => {
            const { container } = render(_jsx(Card, { children: _jsx(CardContent, { children: "Content" }) }));
            const content = container.querySelector('.p-6');
            expect(content).toBeInTheDocument();
        });
        it('should apply footer styles', () => {
            const { container } = render(_jsx(Card, { children: _jsx(CardFooter, { children: "Footer" }) }));
            const footer = container.querySelector('.flex.items-center');
            expect(footer).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should be accessible with proper structure', () => {
            render(_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Accessible Card" }), _jsx(CardDescription, { children: "This is an accessible card" })] }), _jsx(CardContent, { children: "Card content goes here" })] }));
            expect(screen.getByText('Accessible Card')).toBeInTheDocument();
            expect(screen.getByText('This is an accessible card')).toBeInTheDocument();
            expect(screen.getByText('Card content goes here')).toBeInTheDocument();
        });
        it('should support semantic HTML structure', () => {
            const { container } = render(_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Semantic Card" }) }), _jsx(CardContent, { children: "Content" })] }));
            // Card should have proper structure with rounded-xl
            const card = container.querySelector('.rounded-xl');
            expect(card).toBeInTheDocument();
            // Should have h3 for title
            expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
        });
    });
    describe('Composition', () => {
        it('should work with Button in footer', () => {
            render(_jsx(Card, { children: _jsx(CardFooter, { children: _jsx(Button, { children: "Click me" }) }) }));
            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });
        it('should work with multiple elements', () => {
            render(_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Title" }), _jsx(CardDescription, { children: "Description" })] }), _jsxs(CardContent, { children: [_jsx("p", { children: "Paragraph 1" }), _jsx("p", { children: "Paragraph 2" })] }), _jsxs(CardFooter, { children: [_jsx(Button, { children: "Action 1" }), _jsx(Button, { variant: "outline", children: "Action 2" })] })] }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=card.test.js.map