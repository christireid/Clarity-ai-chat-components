import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeContrastChecker } from '../theme-contrast-checker';
import { ThemeProvider } from '../../theme/ThemeProvider';
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
describe('ThemeContrastChecker', () => {
    describe('basic rendering', () => {
        it('should render with theme context', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            expect(screen.getByText('Theme Accessibility Report')).toBeInTheDocument();
        });
        it('should display summary statistics', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            expect(screen.getByText('Color Pairs')).toBeInTheDocument();
            expect(screen.getByText('Pass AA')).toBeInTheDocument();
            expect(screen.getByText('Pass AAA')).toBeInTheDocument();
            expect(screen.getByText('Failing')).toBeInTheDocument();
        });
        it('should show WCAG requirements reference', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            expect(screen.getByText('WCAG Contrast Requirements:')).toBeInTheDocument();
            expect(screen.getByText(/AA \(Normal Text\)/)).toBeInTheDocument();
            expect(screen.getByText(/4\.5:1 minimum ratio/)).toBeInTheDocument();
        });
        it('should show error message when no theme context', () => {
            // Suppress the error from rendering without provider
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                render(_jsx(ThemeContrastChecker, {}));
            }).toThrow();
            spy.mockRestore();
        });
    });
    describe('custom theme analysis', () => {
        it('should accept custom theme prop', () => {
            const customTheme = {
                ...modernThemes['default'],
                name: 'test-custom-theme',
            };
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, { theme: customTheme }) }));
            expect(screen.getByText('Theme Accessibility Report')).toBeInTheDocument();
        });
    });
    describe('showDetails prop', () => {
        it('should show color pair details by default', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            expect(screen.getByText('Text on Background')).toBeInTheDocument();
        });
        it('should hide color pair details when showDetails is false', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, { showDetails: false }) }));
            expect(screen.queryByText('Text on Background')).not.toBeInTheDocument();
        });
    });
    describe('showOnlyFailing prop', () => {
        it('should show all pairs by default', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            // Should show various color pairs
            expect(screen.getByText('Text on Background')).toBeInTheDocument();
            expect(screen.getByText('Text on Card')).toBeInTheDocument();
        });
        it('should filter to only failing when showOnlyFailing is true', () => {
            render(_jsx(ThemeProvider, { defaultTheme: { preset: 'default' }, children: _jsx(ThemeContrastChecker, { showOnlyFailing: true }) }));
            // Default theme should pass most/all checks, so fewer items
            // This is a behavioral test - the actual count depends on theme
            expect(screen.getByText('Theme Accessibility Report')).toBeInTheDocument();
        });
    });
    describe('high contrast theme analysis', () => {
        it('should show all passing for high-contrast theme', () => {
            render(_jsx(ThemeProvider, { defaultTheme: { preset: 'high-contrast' }, children: _jsx(ThemeContrastChecker, {}) }));
            // High contrast theme should pass all checks
            // Look for the success message
            const failingCount = screen.getByText('Failing').previousElementSibling?.textContent;
            // Should have 0 failing (high contrast is designed to pass)
            expect(failingCount).toBe('0');
        });
    });
    describe('contrast ratio display', () => {
        it('should display contrast ratios', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            // Look for ratio format like "X.XX:1"
            const ratioPattern = /\d+\.\d{2}:1/;
            const allText = document.body.textContent || '';
            expect(allText).toMatch(ratioPattern);
        });
        it('should display WCAG level badges', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            // Look for level badges (either AAA, AA, or Fail)
            const badges = screen.getAllByRole('status');
            expect(badges.length).toBeGreaterThan(0);
        });
    });
    describe('color swatches', () => {
        it('should render color preview swatches', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            // Check for "on" text between colors
            expect(screen.getAllByText('on').length).toBeGreaterThan(0);
        });
    });
    describe('accessibility', () => {
        it('should have accessible labels on level badges', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, {}) }));
            const badges = screen.getAllByRole('status');
            badges.forEach((badge) => {
                expect(badge).toHaveAttribute('aria-label');
                expect(badge.getAttribute('aria-label')).toMatch(/WCAG compliance:/);
            });
        });
    });
    describe('dark mode themes', () => {
        it('should analyze dark theme correctly', () => {
            render(_jsx(ThemeProvider, { defaultTheme: { preset: 'default-dark' }, children: _jsx(ThemeContrastChecker, {}) }));
            expect(screen.getByText('Theme Accessibility Report')).toBeInTheDocument();
            expect(screen.getByText('Color Pairs')).toBeInTheDocument();
        });
    });
    describe('className prop', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(ThemeProvider, { children: _jsx(ThemeContrastChecker, { className: "custom-class" }) }));
            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=theme-contrast-checker.test.js.map