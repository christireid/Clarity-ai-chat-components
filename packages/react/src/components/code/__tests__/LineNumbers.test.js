import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LineNumbers } from '../LineNumbers';
describe('LineNumbers', () => {
    describe('rendering', () => {
        it('renders the correct number of lines', () => {
            render(_jsx(LineNumbers, { count: 5 }));
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('4')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });
        it('starts from custom line number', () => {
            render(_jsx(LineNumbers, { count: 3, startFrom: 10 }));
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('11')).toBeInTheDocument();
            expect(screen.getByText('12')).toBeInTheDocument();
            expect(screen.queryByText('1')).not.toBeInTheDocument();
        });
        it('renders with zero count', () => {
            const { container } = render(_jsx(LineNumbers, { count: 0 }));
            const lineContainer = container.querySelector('[aria-hidden="true"]');
            expect(lineContainer?.children.length).toBe(0);
        });
    });
    describe('highlighting', () => {
        it('highlights specified lines', () => {
            const { container } = render(_jsx(LineNumbers, { count: 5, highlightedLines: new Set([2, 4]) }));
            const lines = container.querySelectorAll('[aria-hidden="true"] > div');
            expect(lines[1]).toHaveClass('bg-primary/10');
            expect(lines[3]).toHaveClass('bg-primary/10');
            expect(lines[0]).not.toHaveClass('bg-primary/10');
        });
        it('highlights added lines (diff)', () => {
            const { container } = render(_jsx(LineNumbers, { count: 3, addedLines: new Set([2]) }));
            const lines = container.querySelectorAll('[aria-hidden="true"] > div');
            expect(lines[1]).toHaveClass('bg-green-500/10');
        });
        it('highlights removed lines (diff)', () => {
            const { container } = render(_jsx(LineNumbers, { count: 3, removedLines: new Set([1]) }));
            const lines = container.querySelectorAll('[aria-hidden="true"] > div');
            expect(lines[0]).toHaveClass('bg-red-500/10');
        });
    });
    describe('accessibility', () => {
        it('has aria-hidden attribute', () => {
            const { container } = render(_jsx(LineNumbers, { count: 3 }));
            const lineContainer = container.querySelector('[aria-hidden="true"]');
            expect(lineContainer).toBeInTheDocument();
        });
        it('has presentation role', () => {
            const { container } = render(_jsx(LineNumbers, { count: 3 }));
            const lineContainer = container.querySelector('[role="presentation"]');
            expect(lineContainer).toBeInTheDocument();
        });
    });
    describe('styling', () => {
        it('applies custom className', () => {
            const { container } = render(_jsx(LineNumbers, { count: 3, className: "custom-class" }));
            const lineContainer = container.querySelector('.custom-class');
            expect(lineContainer).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=LineNumbers.test.js.map