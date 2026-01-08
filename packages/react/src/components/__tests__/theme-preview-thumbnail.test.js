import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePreviewThumbnail, ThemePreviewGrid, } from '../theme-preview-thumbnail';
import { modernThemes } from '../../theme/modern-presets';
// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));
// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
beforeEach(() => {
    vi.stubGlobal('matchMedia', mockMatchMedia);
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
});
afterEach(() => {
    vi.unstubAllGlobals();
});
describe('ThemePreviewThumbnail', () => {
    describe('basic rendering', () => {
        it('should render with default preset', () => {
            render(_jsx(ThemePreviewThumbnail, {}));
            expect(screen.getByLabelText(/Theme preview/)).toBeInTheDocument();
        });
        it('should render with specified preset', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "neutral-dark" }));
            expect(screen.getByLabelText(/Theme preview: Neutral Dark/)).toBeInTheDocument();
        });
        it('should render with custom theme', () => {
            const customTheme = {
                ...modernThemes['default'],
                name: 'My Custom Theme',
            };
            render(_jsx(ThemePreviewThumbnail, { theme: customTheme }));
            expect(screen.getByLabelText(/Theme preview: My Custom Theme/)).toBeInTheDocument();
        });
        it('should show label by default', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "vibrant" }));
            expect(screen.getByText('Vibrant')).toBeInTheDocument();
        });
        it('should hide label when showLabel is false', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "vibrant", showLabel: false }));
            expect(screen.queryByText('Vibrant')).not.toBeInTheDocument();
        });
    });
    describe('size variations', () => {
        it('should render small size', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, { size: "sm" }));
            const thumbnail = container.querySelector('[style*="width: 64px"]');
            expect(thumbnail).toBeInTheDocument();
        });
        it('should render medium size (default)', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, {}));
            const thumbnail = container.querySelector('[style*="width: 96px"]');
            expect(thumbnail).toBeInTheDocument();
        });
        it('should render large size', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, { size: "lg" }));
            const thumbnail = container.querySelector('[style*="width: 128px"]');
            expect(thumbnail).toBeInTheDocument();
        });
    });
    describe('selection state', () => {
        it('should indicate selected state in aria-label', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "default", selected: true, onClick: () => { } }));
            expect(screen.getByLabelText(/\(selected\)/)).toBeInTheDocument();
        });
        it('should have aria-pressed when clickable and selected', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "default", selected: true, onClick: () => { } }));
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-pressed', 'true');
        });
        it('should have aria-pressed false when clickable but not selected', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: () => { } }));
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-pressed', 'false');
        });
    });
    describe('click handling', () => {
        it('should call onClick when clicked', async () => {
            const handleClick = vi.fn();
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: handleClick }));
            await userEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should not be a button when onClick is not provided', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "default" }));
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
        it('should have tabIndex 0 when clickable', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: () => { } }));
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('tabIndex', '0');
        });
    });
    describe('keyboard navigation', () => {
        it('should trigger onClick on Enter key', async () => {
            const handleClick = vi.fn();
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: handleClick }));
            const button = screen.getByRole('button');
            fireEvent.keyDown(button, { key: 'Enter' });
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should trigger onClick on Space key', async () => {
            const handleClick = vi.fn();
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: handleClick }));
            const button = screen.getByRole('button');
            fireEvent.keyDown(button, { key: ' ' });
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should not trigger onClick on other keys', async () => {
            const handleClick = vi.fn();
            render(_jsx(ThemePreviewThumbnail, { preset: "default", onClick: handleClick }));
            const button = screen.getByRole('button');
            fireEvent.keyDown(button, { key: 'Tab' });
            expect(handleClick).not.toHaveBeenCalled();
        });
    });
    describe('className prop', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, { preset: "default", className: "custom-class" }));
            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });
    describe('display name formatting', () => {
        it('should format preset name correctly', () => {
            render(_jsx(ThemePreviewThumbnail, { preset: "high-contrast-dark" }));
            expect(screen.getByText('High Contrast Dark')).toBeInTheDocument();
        });
        it('should use custom theme name when provided', () => {
            const customTheme = {
                ...modernThemes['default'],
                name: 'Brand Theme',
            };
            render(_jsx(ThemePreviewThumbnail, { theme: customTheme }));
            expect(screen.getByText('Brand Theme')).toBeInTheDocument();
        });
        it('should show "Custom" when no name available', () => {
            const customTheme = {
                ...modernThemes['default'],
                name: '',
            };
            render(_jsx(ThemePreviewThumbnail, { theme: customTheme }));
            expect(screen.getByText('Custom')).toBeInTheDocument();
        });
    });
    describe('visual preview elements', () => {
        it('should render header dots', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, { preset: "default" }));
            // Check for 3 circular elements (traffic light dots)
            const circles = container.querySelectorAll('.rounded-full');
            expect(circles.length).toBe(3);
        });
        it('should render card preview', () => {
            const { container } = render(_jsx(ThemePreviewThumbnail, { preset: "default" }));
            // Should have content "lines" and a button-like block.
            const lines = container.querySelectorAll('.rounded-sm');
            expect(lines.length).toBeGreaterThanOrEqual(3);
        });
    });
});
describe('ThemePreviewGrid', () => {
    describe('basic rendering', () => {
        it('should render all presets by default', () => {
            render(_jsx(ThemePreviewGrid, {}));
            // Should have 8 presets total
            expect(screen.getByText('Default')).toBeInTheDocument();
            expect(screen.getByText('Default Dark')).toBeInTheDocument();
            expect(screen.getByText('Neutral')).toBeInTheDocument();
            expect(screen.getByText('Neutral Dark')).toBeInTheDocument();
            expect(screen.getByText('Vibrant')).toBeInTheDocument();
            expect(screen.getByText('Vibrant Dark')).toBeInTheDocument();
            expect(screen.getByText('High Contrast')).toBeInTheDocument();
            expect(screen.getByText('High Contrast Dark')).toBeInTheDocument();
        });
        it('should have radiogroup role for accessibility', () => {
            render(_jsx(ThemePreviewGrid, {}));
            expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        });
        it('should have accessible label', () => {
            render(_jsx(ThemePreviewGrid, {}));
            expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Theme selection');
        });
    });
    describe('filtering', () => {
        it('should filter to light themes only', () => {
            render(_jsx(ThemePreviewGrid, { filter: "light" }));
            expect(screen.getByText('Default')).toBeInTheDocument();
            expect(screen.getByText('Neutral')).toBeInTheDocument();
            expect(screen.getByText('Vibrant')).toBeInTheDocument();
            expect(screen.getByText('High Contrast')).toBeInTheDocument();
            expect(screen.queryByText('Default Dark')).not.toBeInTheDocument();
            expect(screen.queryByText('Neutral Dark')).not.toBeInTheDocument();
        });
        it('should filter to dark themes only', () => {
            render(_jsx(ThemePreviewGrid, { filter: "dark" }));
            expect(screen.queryByText('Default')).not.toBeInTheDocument();
            expect(screen.queryByText('Neutral')).not.toBeInTheDocument();
            expect(screen.getByText('Default Dark')).toBeInTheDocument();
            expect(screen.getByText('Neutral Dark')).toBeInTheDocument();
            expect(screen.getByText('Vibrant Dark')).toBeInTheDocument();
            expect(screen.getByText('High Contrast Dark')).toBeInTheDocument();
        });
        it('should show all themes when filter is "all"', () => {
            render(_jsx(ThemePreviewGrid, { filter: "all" }));
            // Should have all 8 themes
            const labels = screen.getAllByText(/Default|Neutral|Vibrant|High Contrast/);
            expect(labels.length).toBe(8);
        });
    });
    describe('selection', () => {
        it('should indicate selected preset', () => {
            render(_jsx(ThemePreviewGrid, { selectedPreset: "neutral", onSelect: () => { } }));
            expect(screen.getByLabelText(/Theme preview: Neutral \(selected\)/)).toBeInTheDocument();
        });
        it('should call onSelect when a theme is clicked', async () => {
            const handleSelect = vi.fn();
            render(_jsx(ThemePreviewGrid, { onSelect: handleSelect }));
            await userEvent.click(screen.getByLabelText(/Theme preview: Vibrant Dark/));
            expect(handleSelect).toHaveBeenCalledWith('vibrant-dark');
        });
        it('should not make items clickable when onSelect is not provided', () => {
            render(_jsx(ThemePreviewGrid, {}));
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });
    describe('size prop', () => {
        it('should pass size to children', () => {
            const { container } = render(_jsx(ThemePreviewGrid, { size: "lg" }));
            // Labels use max-width to match the thumbnail width.
            const largeThumbnails = container.querySelectorAll('[style*="max-width: 128px"]');
            expect(largeThumbnails.length).toBe(8);
        });
    });
    describe('className prop', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(ThemePreviewGrid, { className: "custom-grid" }));
            expect(container.querySelector('.custom-grid')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=theme-preview-thumbnail.test.js.map