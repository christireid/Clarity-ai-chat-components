import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnhancedCodeBlock } from '../enhanced-code-block';
// Mock icons to avoid rendering issues
vi.mock('../icons', () => ({
    ChevronDownIcon: () => _jsx("span", { "data-testid": "icon-chevron-down" }),
    ChevronUpIcon: () => _jsx("span", { "data-testid": "icon-chevron-up" }),
    DownloadIcon: () => _jsx("span", { "data-testid": "icon-download" }),
    WrapTextIcon: () => _jsx("span", { "data-testid": "icon-wrap" }),
}));
// Mock copy button
vi.mock('../copy-button', () => ({
    CopyButton: () => _jsx("button", { "data-testid": "copy-button", children: "Copy" }),
}));
// Mock PrismJS via MarkdownCodeBlock
vi.mock('../message/markdown-code-block', () => ({
    MarkdownCodeBlock: ({ children, className, }) => (_jsx("code", { "data-testid": "markdown-code-block", className: className, children: children })),
}));
describe('EnhancedCodeBlock', () => {
    const sampleCode = `function hello() {
  logger.debug("Hello world");
  return true;
}`;
    it('renders code content', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode }));
        expect(screen.getByTestId('markdown-code-block')).toHaveTextContent(sampleCode);
    });
    it('displays line numbers by default', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode }));
        // 3 lines in sampleCode
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
    it('hides line numbers when showLineNumbers is false', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode, showLineNumbers: false }));
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
    it('detects language from props', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode, language: "javascript" }));
        const codeBlock = screen.getByTestId('markdown-code-block');
        expect(codeBlock).toHaveClass('language-javascript');
    });
    it('shows window controls in header', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode }));
        expect(screen.getByTestId('copy-button')).toBeInTheDocument();
        expect(screen.getByTestId('icon-download')).toBeInTheDocument();
    });
    it('handles folding interactions', () => {
        // create long code
        const longCode = Array(30).fill('line').join('\n');
        render(_jsx(EnhancedCodeBlock, { code: longCode, maxHeight: 5, initiallyFolded: true }));
        // Should show fold indicator
        expect(screen.getByText(/more lines/)).toBeInTheDocument();
        // Expand
        const expandButton = screen.getByTitle('Expand code');
        fireEvent.click(expandButton);
        // Should hide fold indicator
        expect(screen.queryByText(/more lines/)).not.toBeInTheDocument();
    });
    it('toggles word wrap', () => {
        render(_jsx(EnhancedCodeBlock, { code: sampleCode }));
        const wrapButton = screen.getByTitle('Toggle word wrap');
        // Initial state: whitespace-pre
        const pre = screen.getByTestId('markdown-code-block').parentElement;
        expect(pre).toHaveClass('whitespace-pre');
        // Toggle
        fireEvent.click(wrapButton);
        expect(pre).toHaveClass('whitespace-pre-wrap');
    });
    it('handles empty code gracefully', () => {
        render(_jsx(EnhancedCodeBlock, { code: "" }));
        expect(screen.getByTestId('markdown-code-block')).toBeInTheDocument();
    });
});
//# sourceMappingURL=enhanced-code-block.test.js.map