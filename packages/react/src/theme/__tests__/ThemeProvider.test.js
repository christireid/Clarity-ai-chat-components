import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme, ThemeToggle } from '../ThemeProvider';
import { modernThemes } from '../modern-presets';
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
/**
 * Test component that consumes theme context
 */
function ThemeConsumer() {
    const { mode, resolvedTheme, theme, availablePresets } = useTheme();
    return (_jsxs("div", { children: [_jsx("span", { "data-testid": "mode", children: mode }), _jsx("span", { "data-testid": "theme-name", children: resolvedTheme?.name ?? 'none' }), _jsx("span", { "data-testid": "theme-mode", children: theme.mode }), _jsx("span", { "data-testid": "preset-count", children: availablePresets.length })] }));
}
describe('ThemeProvider', () => {
    describe('basic rendering', () => {
        it('should render children', () => {
            render(_jsx(ThemeProvider, { children: _jsx("div", { "data-testid": "child", children: "Hello" }) }));
            expect(screen.getByTestId('child')).toHaveTextContent('Hello');
        });
        it('should provide default theme context', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeConsumer, {}) }));
            // Default mode is 'system', which resolves based on matchMedia mock (returns dark)
            expect(screen.getByTestId('mode')).toHaveTextContent('dark');
        });
        it('should provide all 8 available presets', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeConsumer, {}) }));
            expect(screen.getByTestId('preset-count')).toHaveTextContent('8');
        });
    });
    describe('preset selection', () => {
        it('should apply preset theme', async () => {
            render(_jsx(ThemeProvider, { defaultTheme: { preset: 'neutral' }, children: _jsx(ThemeConsumer, {}) }));
            // Wait for theme to be applied
            await waitFor(() => {
                expect(screen.getByTestId('theme-name')).toHaveTextContent('neutral');
            });
        });
        it('should apply dark preset', async () => {
            render(_jsx(ThemeProvider, { defaultTheme: { preset: 'neutral-dark' }, children: _jsx(ThemeConsumer, {}) }));
            await waitFor(() => {
                expect(screen.getByTestId('theme-name')).toHaveTextContent('neutral-dark');
            });
        });
    });
    describe('custom theme', () => {
        it('should accept CompleteThemeConfig directly', async () => {
            const customTheme = {
                ...modernThemes['default'],
                name: 'my-custom-theme',
            };
            render(_jsx(ThemeProvider, { defaultTheme: customTheme, children: _jsx(ThemeConsumer, {}) }));
            await waitFor(() => {
                expect(screen.getByTestId('theme-name')).toHaveTextContent('my-custom-theme');
            });
        });
        it('should accept customTheme in config object', async () => {
            const customTheme = {
                ...modernThemes['default'],
                name: 'wrapped-custom',
            };
            render(_jsx(ThemeProvider, { defaultTheme: { customTheme }, children: _jsx(ThemeConsumer, {}) }));
            await waitFor(() => {
                expect(screen.getByTestId('theme-name')).toHaveTextContent('wrapped-custom');
            });
        });
    });
    describe('mode switching', () => {
        it('should start with system mode by default', () => {
            render(_jsx(ThemeProvider, { children: _jsx(ThemeConsumer, {}) }));
            expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
        });
        it('should respect explicit light mode', async () => {
            render(_jsx(ThemeProvider, { defaultTheme: { mode: 'light' }, children: _jsx(ThemeConsumer, {}) }));
            expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
            expect(screen.getByTestId('mode')).toHaveTextContent('light');
        });
        it('should respect explicit dark mode', async () => {
            render(_jsx(ThemeProvider, { defaultTheme: { mode: 'dark' }, children: _jsx(ThemeConsumer, {}) }));
            expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
            expect(screen.getByTestId('mode')).toHaveTextContent('dark');
        });
    });
});
describe('useTheme', () => {
    it('should throw when used outside ThemeProvider', () => {
        // Suppress console.error for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        expect(() => {
            render(_jsx(ThemeConsumer, {}));
        }).toThrow('useTheme must be used within a ThemeProvider');
        spy.mockRestore();
    });
    it('should provide setTheme function', async () => {
        function ThemeUpdater() {
            const { setTheme, theme } = useTheme();
            return (_jsxs("div", { children: [_jsx("button", { onClick: () => setTheme({ preset: 'vibrant' }), "data-testid": "set-preset", children: "Set Vibrant" }), _jsx("span", { "data-testid": "current-preset", children: theme.preset ?? 'none' })] }));
        }
        const user = userEvent.setup();
        render(_jsx(ThemeProvider, { children: _jsx(ThemeUpdater, {}) }));
        await user.click(screen.getByTestId('set-preset'));
        await waitFor(() => {
            expect(screen.getByTestId('current-preset')).toHaveTextContent('vibrant');
        });
    });
    it('should provide toggleMode function', async () => {
        function ModeToggler() {
            const { toggleMode, mode } = useTheme();
            return (_jsxs("div", { children: [_jsx("button", { onClick: toggleMode, "data-testid": "toggle", children: "Toggle" }), _jsx("span", { "data-testid": "current-mode", children: mode })] }));
        }
        const user = userEvent.setup();
        render(_jsx(ThemeProvider, { defaultTheme: { mode: 'light' }, children: _jsx(ModeToggler, {}) }));
        expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
        await user.click(screen.getByTestId('toggle'));
        await waitFor(() => {
            expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
        });
    });
    it('should provide setPreset function', async () => {
        function PresetSetter() {
            const { setPreset, resolvedTheme } = useTheme();
            return (_jsxs("div", { children: [_jsx("button", { onClick: () => setPreset('high-contrast'), "data-testid": "set-preset", children: "High Contrast" }), _jsx("span", { "data-testid": "theme-name", children: resolvedTheme?.name ?? 'none' })] }));
        }
        const user = userEvent.setup();
        render(_jsx(ThemeProvider, { children: _jsx(PresetSetter, {}) }));
        await user.click(screen.getByTestId('set-preset'));
        await waitFor(() => {
            expect(screen.getByTestId('theme-name')).toHaveTextContent('high-contrast');
        });
    });
});
describe('ThemeToggle', () => {
    it('should render toggle button', () => {
        render(_jsx(ThemeProvider, { children: _jsx(ThemeToggle, {}) }));
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('should have accessible label', () => {
        render(_jsx(ThemeProvider, { defaultTheme: { mode: 'light' }, children: _jsx(ThemeToggle, {}) }));
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
    it('should toggle mode when clicked', async () => {
        const user = userEvent.setup();
        function ModeDisplay() {
            const { mode } = useTheme();
            return _jsx("span", { "data-testid": "current-mode", children: mode });
        }
        render(_jsxs(ThemeProvider, { defaultTheme: { mode: 'light' }, children: [_jsx(ThemeToggle, {}), _jsx(ModeDisplay, {})] }));
        // Initially in light mode
        expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
        // Click to toggle
        await user.click(screen.getByRole('button'));
        // Should switch to dark mode
        await waitFor(() => {
            expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
        });
    });
    it('should show label when showLabel prop is true', () => {
        render(_jsx(ThemeProvider, { defaultTheme: { mode: 'light' }, children: _jsx(ThemeToggle, { showLabel: true }) }));
        expect(screen.getByText('Dark')).toBeInTheDocument();
    });
});
describe('localStorage persistence', () => {
    it('should persist mode to localStorage', async () => {
        const user = userEvent.setup();
        function ModeChanger() {
            const { setTheme } = useTheme();
            return (_jsx("button", { onClick: () => setTheme({ mode: 'dark' }), "data-testid": "change", children: "Dark" }));
        }
        render(_jsx(ThemeProvider, { storageKey: "test-theme", children: _jsx(ModeChanger, {}) }));
        // Wait for hydration
        await waitFor(() => {
            expect(localStorageMock.getItem).toHaveBeenCalled();
        });
        await user.click(screen.getByTestId('change'));
        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith('test-theme', expect.stringContaining('"mode":"dark"'));
        });
    });
    it('should restore mode from localStorage', async () => {
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify({ mode: 'dark' }));
        render(_jsx(ThemeProvider, { storageKey: "test-theme", children: _jsx(ThemeConsumer, {}) }));
        await waitFor(() => {
            expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
        });
    });
    it('should handle corrupted localStorage gracefully', async () => {
        localStorageMock.getItem.mockReturnValueOnce('not valid json');
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        render(_jsx(ThemeProvider, { storageKey: "test-theme", children: _jsx(ThemeConsumer, {}) }));
        // Should render without crashing, falling back to defaults
        expect(screen.getByTestId('mode')).toBeInTheDocument();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
//# sourceMappingURL=ThemeProvider.test.js.map