import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Tests for MarkdownRendererEnhanced component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRendererEnhanced, validateLatex, extractMathExpressions } from '../markdown-renderer-enhanced';
describe('MarkdownRendererEnhanced', () => {
    it('renders basic markdown', () => {
        const content = '# Hello World\n\nThis is **bold** text.';
        render(_jsx(MarkdownRendererEnhanced, { content: content }));
        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
        expect(screen.getByText(/bold/)).toBeInTheDocument();
    });
    it('renders inline code', () => {
        const content = 'Use `npm install` to install packages.';
        render(_jsx(MarkdownRendererEnhanced, { content: content }));
        expect(screen.getByText('npm install')).toBeInTheDocument();
    });
    it('renders code blocks', () => {
        const content = '```javascript\nconst x = 42;\n```';
        render(_jsx(MarkdownRendererEnhanced, { content: content, enableHighlight: true }));
        expect(screen.getByText(/const x = 42/)).toBeInTheDocument();
    });
    it('renders tables with GFM', () => {
        const content = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
        render(_jsx(MarkdownRendererEnhanced, { content: content, enableGFM: true }));
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Cell 1')).toBeInTheDocument();
    });
    it('can disable math rendering', () => {
        const content = 'The formula $E = mc^2$ is famous.';
        render(_jsx(MarkdownRendererEnhanced, { content: content, enableMath: false }));
        // Should render as plain text when math is disabled
        expect(screen.getByText(/E = mc\^2/)).toBeInTheDocument();
    });
});
describe('validateLatex', () => {
    it('validates correct LaTeX', () => {
        expect(validateLatex('E = mc^2').valid).toBe(true);
        expect(validateLatex('\\frac{1}{2}').valid).toBe(true);
    });
    it('detects unmatched braces', () => {
        const result = validateLatex('E = mc^2}');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('braces');
    });
    it('detects unmatched dollar signs', () => {
        const result = validateLatex('$E = mc^2');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('dollar');
    });
});
describe('extractMathExpressions', () => {
    it('extracts inline math', () => {
        const content = 'The equation $E = mc^2$ is famous.';
        const result = extractMathExpressions(content);
        expect(result.inline).toHaveLength(1);
        expect(result.inline[0]).toBe('E = mc^2');
        expect(result.block).toHaveLength(0);
    });
    it('extracts block math', () => {
        const content = '$$\\int_{0}^{1} x dx$$';
        const result = extractMathExpressions(content);
        expect(result.inline).toHaveLength(0);
        expect(result.block).toHaveLength(1);
        expect(result.block[0]).toContain('\\int');
    });
    it('extracts both inline and block math', () => {
        const content = 'Inline: $a + b$ and block: $$c = d$$';
        const result = extractMathExpressions(content);
        expect(result.inline).toHaveLength(1);
        expect(result.block).toHaveLength(1);
    });
});
//# sourceMappingURL=markdown-renderer-enhanced.test.js.map