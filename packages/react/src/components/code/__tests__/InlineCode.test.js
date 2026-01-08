import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InlineCode } from '../InlineCode';
describe('InlineCode', () => {
    describe('rendering', () => {
        it('renders children correctly', () => {
            render(_jsx(InlineCode, { children: "npm install" }));
            expect(screen.getByText('npm install')).toBeInTheDocument();
        });
        it('renders as a code element', () => {
            render(_jsx(InlineCode, { children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement.tagName).toBe('CODE');
        });
        it('applies custom className', () => {
            render(_jsx(InlineCode, { className: "custom-class", children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('custom-class');
        });
    });
    describe('variants', () => {
        it('renders default variant correctly', () => {
            render(_jsx(InlineCode, { variant: "default", children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('bg-muted/80');
        });
        it('renders subtle variant correctly', () => {
            render(_jsx(InlineCode, { variant: "subtle", children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('bg-muted/50');
        });
        it('renders highlighted variant correctly', () => {
            render(_jsx(InlineCode, { variant: "highlighted", children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('bg-primary/10');
        });
    });
    describe('ref forwarding', () => {
        it('forwards ref to code element', () => {
            const ref = { current: null };
            render(_jsx(InlineCode, { ref: ref, children: "npm install" }));
            expect(ref.current).toBeInstanceOf(HTMLElement);
            expect(ref.current?.tagName).toBe('CODE');
        });
    });
    describe('props forwarding', () => {
        it('forwards additional props to code element', () => {
            render(_jsx(InlineCode, { "data-testid": "inline-code", children: "npm install" }));
            expect(screen.getByTestId('inline-code')).toBeInTheDocument();
        });
        it('forwards title attribute', () => {
            render(_jsx(InlineCode, { title: "Package manager command", children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveAttribute('title', 'Package manager command');
        });
    });
    describe('styling', () => {
        it('has monospace font', () => {
            render(_jsx(InlineCode, { children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('font-mono');
        });
        it('has rounded borders', () => {
            render(_jsx(InlineCode, { children: "npm install" }));
            const codeElement = screen.getByText('npm install');
            expect(codeElement).toHaveClass('rounded-md');
        });
    });
});
//# sourceMappingURL=InlineCode.test.js.map