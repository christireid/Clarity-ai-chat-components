import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Tests for Icon components
 * Tests rendering, size props, and accessibility
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchIcon, ZapIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon, TrashIcon, PlayIcon, PauseIcon, InspectorIcon, ProfilerIcon, ValidationIcon, TimeTravelIcon, ComparisonIcon, KeyboardIcon, CloseIcon, ChevronDownIcon, DownloadIcon, SettingsIcon, InfoIcon, ArrowRightIcon, HistoryIcon, } from '../components/icons';
describe('Icon Components', () => {
    describe('SearchIcon', () => {
        it('renders with default size', () => {
            render(_jsx(SearchIcon, { "data-testid": "search-icon" }));
            const svg = document.querySelector('svg');
            expect(svg).toBeTruthy();
            expect(svg?.getAttribute('width')).toBe('16');
            expect(svg?.getAttribute('height')).toBe('16');
        });
        it('renders with sm size', () => {
            render(_jsx(SearchIcon, { size: "sm" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('width')).toBe('14');
            expect(svg?.getAttribute('height')).toBe('14');
        });
        it('renders with md size', () => {
            render(_jsx(SearchIcon, { size: "md" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('width')).toBe('16');
            expect(svg?.getAttribute('height')).toBe('16');
        });
        it('renders with lg size', () => {
            render(_jsx(SearchIcon, { size: "lg" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('width')).toBe('18');
            expect(svg?.getAttribute('height')).toBe('18');
        });
        it('renders with xl size', () => {
            render(_jsx(SearchIcon, { size: "xl" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('width')).toBe('48');
            expect(svg?.getAttribute('height')).toBe('48');
        });
        it('renders with custom number size', () => {
            render(_jsx(SearchIcon, { size: 24 }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('width')).toBe('24');
            expect(svg?.getAttribute('height')).toBe('24');
        });
        it('applies custom className', () => {
            render(_jsx(SearchIcon, { className: "custom-class" }));
            const svg = document.querySelector('svg');
            expect(svg?.classList.contains('custom-class')).toBe(true);
        });
        it('applies aria-label for accessibility', () => {
            render(_jsx(SearchIcon, { "aria-label": "Search" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('aria-label')).toBe('Search');
        });
    });
    describe('All stroke-based icons render correctly', () => {
        const strokeIcons = [
            { name: 'ZapIcon', Component: ZapIcon },
            { name: 'ClockIcon', Component: ClockIcon },
            { name: 'CheckCircleIcon', Component: CheckCircleIcon },
            { name: 'AlertTriangleIcon', Component: AlertTriangleIcon },
            { name: 'TrashIcon', Component: TrashIcon },
            { name: 'InspectorIcon', Component: InspectorIcon },
            { name: 'ProfilerIcon', Component: ProfilerIcon },
            { name: 'ValidationIcon', Component: ValidationIcon },
            { name: 'TimeTravelIcon', Component: TimeTravelIcon },
            { name: 'ComparisonIcon', Component: ComparisonIcon },
            { name: 'KeyboardIcon', Component: KeyboardIcon },
            { name: 'CloseIcon', Component: CloseIcon },
            { name: 'ChevronDownIcon', Component: ChevronDownIcon },
            { name: 'DownloadIcon', Component: DownloadIcon },
            { name: 'SettingsIcon', Component: SettingsIcon },
            { name: 'InfoIcon', Component: InfoIcon },
            { name: 'ArrowRightIcon', Component: ArrowRightIcon },
            { name: 'HistoryIcon', Component: HistoryIcon },
        ];
        strokeIcons.forEach(({ name, Component }) => {
            it(`${name} renders`, () => {
                const { container } = render(_jsx(Component, {}));
                const svg = container.querySelector('svg');
                expect(svg).toBeTruthy();
                expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
                expect(svg?.getAttribute('stroke')).toBe('currentColor');
                expect(svg?.getAttribute('fill')).toBe('none');
            });
            it(`${name} respects size prop`, () => {
                const { container } = render(_jsx(Component, { size: 32 }));
                const svg = container.querySelector('svg');
                expect(svg?.getAttribute('width')).toBe('32');
                expect(svg?.getAttribute('height')).toBe('32');
            });
        });
    });
    describe('Fill-based icons render correctly', () => {
        const fillIcons = [
            { name: 'PlayIcon', Component: PlayIcon },
            { name: 'PauseIcon', Component: PauseIcon },
        ];
        fillIcons.forEach(({ name, Component }) => {
            it(`${name} renders with fill`, () => {
                const { container } = render(_jsx(Component, {}));
                const svg = container.querySelector('svg');
                expect(svg).toBeTruthy();
                expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
                expect(svg?.getAttribute('fill')).toBe('currentColor');
            });
            it(`${name} respects size prop`, () => {
                const { container } = render(_jsx(Component, { size: 32 }));
                const svg = container.querySelector('svg');
                expect(svg?.getAttribute('width')).toBe('32');
                expect(svg?.getAttribute('height')).toBe('32');
            });
        });
    });
    describe('Icon accessibility', () => {
        it('has aria-hidden when no aria-label', () => {
            render(_jsx(SearchIcon, {}));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('aria-hidden')).toBe('true');
        });
        it('is accessible when aria-label is provided', () => {
            render(_jsx(SearchIcon, { "aria-label": "Search button" }));
            const svg = document.querySelector('svg');
            expect(svg?.getAttribute('aria-label')).toBe('Search button');
        });
    });
});
//# sourceMappingURL=icons.test.js.map