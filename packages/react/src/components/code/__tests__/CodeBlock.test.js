import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from '../CodeBlock';
// Mock Shiki since it requires async loading
vi.mock('shiki', () => ({
    codeToHtml: vi
        .fn()
        .mockResolvedValue('<pre class="shiki"><code>const x = 1;</code></pre>'),
}));
// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
describe('CodeBlock', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock clipboard API for each test
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: mockWriteText,
            },
            writable: true,
            configurable: true,
        });
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('rendering', () => {
        it('renders code content', async () => {
            render(_jsx(CodeBlock, { children: "const x = 1;" }));
            await waitFor(() => {
                expect(screen.getByRole('region')).toBeInTheDocument();
            });
        });
        it('renders with title', async () => {
            render(_jsx(CodeBlock, { title: "example.ts", children: "const x = 1;" }));
            await waitFor(() => {
                expect(screen.getByText('example.ts')).toBeInTheDocument();
            });
        });
        it('renders with language badge', async () => {
            render(_jsx(CodeBlock, { language: "typescript", showLanguageBadge: true, children: "const x: number = 1;" }));
            await waitFor(() => {
                expect(screen.getByText('TypeScript')).toBeInTheDocument();
            });
        });
        it('renders line numbers when enabled', async () => {
            render(_jsx(CodeBlock, { showLineNumbers: true, startingLineNumber: 1, children: 'line1\nline2\nline3' }));
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
                expect(screen.getByText('2')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument();
            });
        });
        it('hides line numbers by default', async () => {
            render(_jsx(CodeBlock, { children: "const x = 1;" }));
            await waitFor(() => {
                // Line numbers should not be present
                expect(screen.queryByText('1')).not.toBeInTheDocument();
            });
        });
    });
    describe('copy functionality', () => {
        it('renders copy button by default', async () => {
            render(_jsx(CodeBlock, { children: "const x = 1;" }));
            await waitFor(() => {
                expect(screen.getByLabelText('Copy code to clipboard')).toBeInTheDocument();
            });
        });
        it('hides copy button when showCopyButton is false', async () => {
            render(_jsx(CodeBlock, { showCopyButton: false, children: "const x = 1;" }));
            await waitFor(() => {
                expect(screen.queryByLabelText('Copy code to clipboard')).not.toBeInTheDocument();
            });
        });
        it('calls onCopy callback when copy button clicked', async () => {
            const user = userEvent.setup();
            const onCopy = vi.fn();
            const code = 'const x = 1;';
            render(_jsx(CodeBlock, { onCopy: onCopy, children: code }));
            await waitFor(async () => {
                const copyButton = screen.getByLabelText('Copy code to clipboard');
                await user.click(copyButton);
            });
            // Give time for async clipboard operation
            await waitFor(() => {
                expect(onCopy).toHaveBeenCalled();
            }, { timeout: 3000 });
        });
    });
    describe('expand/collapse', () => {
        it('shows expand button for long code blocks', async () => {
            const longCode = Array(20).fill('const x = 1;').join('\n');
            render(_jsx(CodeBlock, { maxHeight: 100, children: longCode }));
            await waitFor(() => {
                expect(screen.getByText(/Show all \d+ lines/)).toBeInTheDocument();
            });
        });
        it('toggles expanded state on click', async () => {
            const user = userEvent.setup();
            const longCode = Array(20).fill('const x = 1;').join('\n');
            render(_jsx(CodeBlock, { maxHeight: 100, children: longCode }));
            await waitFor(async () => {
                const expandButton = screen.getByText(/Show all \d+ lines/);
                await user.click(expandButton);
            });
            await waitFor(() => {
                expect(screen.getByText('Show less')).toBeInTheDocument();
            });
        });
    });
    describe('accessibility', () => {
        it('has proper aria-label', async () => {
            render(_jsx(CodeBlock, { title: "example.ts", language: "typescript", children: "const x = 1;" }));
            await waitFor(() => {
                const codeRegion = screen.getByRole('region');
                expect(codeRegion).toHaveAttribute('aria-label', expect.stringContaining('example.ts'));
            });
        });
        it('makes code block focusable', async () => {
            render(_jsx(CodeBlock, { children: "const x = 1;" }));
            await waitFor(() => {
                const codeRegion = screen.getByRole('region');
                expect(codeRegion).toHaveAttribute('tabIndex', '0');
            });
        });
    });
    describe('themes', () => {
        it('applies theme data attribute', async () => {
            render(_jsx(CodeBlock, { theme: "github-dark", children: "const x = 1;" }));
            await waitFor(() => {
                const codeBlock = screen.getByRole('region').closest('.code-block');
                expect(codeBlock).toHaveAttribute('data-theme', 'github-dark');
            });
        });
    });
    describe('language detection', () => {
        it('auto-detects TypeScript', async () => {
            render(_jsx(CodeBlock, { autoDetectLanguage: true, children: 'interface Foo { x: number }' }));
            await waitFor(() => {
                const codeBlock = screen.getByRole('region').closest('.code-block');
                expect(codeBlock).toHaveAttribute('data-language', 'typescript');
            });
        });
        it('uses provided language over auto-detection', async () => {
            render(_jsx(CodeBlock, { language: "python", children: 'def foo(): pass' }));
            await waitFor(() => {
                const codeBlock = screen.getByRole('region').closest('.code-block');
                expect(codeBlock).toHaveAttribute('data-language', 'python');
            });
        });
    });
});
//# sourceMappingURL=CodeBlock.test.js.map