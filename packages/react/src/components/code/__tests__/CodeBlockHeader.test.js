import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeBlockHeader } from '../CodeBlockHeader';
describe('CodeBlockHeader', () => {
    describe('rendering', () => {
        it('renders title', () => {
            render(_jsx(CodeBlockHeader, { title: "example.ts" }));
            expect(screen.getByText('example.ts')).toBeInTheDocument();
        });
        it('renders language badge', () => {
            render(_jsx(CodeBlockHeader, { language: "typescript", showLanguageBadge: true }));
            expect(screen.getByText('TypeScript')).toBeInTheDocument();
        });
        it('renders both title and language', () => {
            render(_jsx(CodeBlockHeader, { title: "example.ts", language: "typescript", showLanguageBadge: true }));
            expect(screen.getByText('example.ts')).toBeInTheDocument();
            expect(screen.getByText('TypeScript')).toBeInTheDocument();
        });
        it('renders children', () => {
            render(_jsx(CodeBlockHeader, { children: _jsx("button", { children: "Copy" }) }));
            expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
        });
        it('renders actions', () => {
            render(_jsx(CodeBlockHeader, { actions: _jsx("button", { children: "Action" }) }));
            expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        });
        it('returns null when nothing to display', () => {
            const { container } = render(_jsx(CodeBlockHeader, {}));
            expect(container.firstChild).toBeNull();
        });
    });
    describe('language badge', () => {
        it('hides badge when showLanguageBadge is false', () => {
            render(_jsx(CodeBlockHeader, { language: "typescript", showLanguageBadge: false }));
            expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        });
        it('hides badge for text/plaintext languages', () => {
            render(_jsx(CodeBlockHeader, { language: "text", showLanguageBadge: true }));
            expect(screen.queryByText('Plain Text')).not.toBeInTheDocument();
        });
    });
    describe('styling', () => {
        it('applies custom className', () => {
            const { container } = render(_jsx(CodeBlockHeader, { title: "test", className: "custom-class" }));
            expect(container.firstChild).toHaveClass('custom-class');
        });
        it('has proper border styling', () => {
            const { container } = render(_jsx(CodeBlockHeader, { title: "test" }));
            expect(container.firstChild).toHaveClass('border-b');
        });
    });
    describe('title truncation', () => {
        it('has title attribute for long titles', () => {
            const longTitle = 'very-long-file-name-that-should-be-truncated.tsx';
            render(_jsx(CodeBlockHeader, { title: longTitle }));
            const titleElement = screen.getByText(longTitle);
            expect(titleElement).toHaveAttribute('title', longTitle);
        });
    });
});
//# sourceMappingURL=CodeBlockHeader.test.js.map