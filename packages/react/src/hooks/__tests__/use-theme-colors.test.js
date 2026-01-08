import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { useThemeColors } from '../use-theme-colors';
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
function createWrapper(mode) {
    return function Wrapper({ children }) {
        return (_jsx(ThemeProvider, { defaultTheme: { mode: mode || 'light' }, children: children }));
    };
}
describe('useThemeColors', () => {
    describe('basic functionality', () => {
        it('should return theme colors', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.primary).toBeDefined();
            expect(result.current.background).toBeDefined();
            expect(result.current.foreground).toBeDefined();
        });
        it('should return all required color properties', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            const requiredColors = [
                'primary',
                'primaryForeground',
                'secondary',
                'secondaryForeground',
                'background',
                'foreground',
                'muted',
                'mutedForeground',
                'accent',
                'accentForeground',
                'card',
                'cardForeground',
                'border',
                'input',
                'ring',
                'destructive',
                'destructiveForeground',
                'popover',
                'popoverForeground',
            ];
            for (const color of requiredColors) {
                expect(result.current[color]).toBeDefined();
            }
        });
    });
    describe('mode detection', () => {
        it('should detect light mode', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.isLight).toBe(true);
            expect(result.current.isDark).toBe(false);
            expect(result.current.mode).toBe('light');
        });
        it('should detect dark mode', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('dark'),
            });
            expect(result.current.isLight).toBe(false);
            expect(result.current.isDark).toBe(true);
            expect(result.current.mode).toBe('dark');
        });
    });
    describe('hex conversion', () => {
        it('should provide hex values for all colors', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.hex).toBeDefined();
            expect(result.current.hex.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(result.current.hex.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
    });
    describe('utility functions', () => {
        it('should provide getCSSVar function', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.getCSSVar).toBeDefined();
            expect(typeof result.current.getCSSVar).toBe('function');
        });
        it('should format CSS variable names correctly', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.getCSSVar('primary')).toBe('var(--clarity-primary)');
            expect(result.current.getCSSVar('primaryForeground')).toBe('var(--clarity-primary-foreground)');
            expect(result.current.getCSSVar('cardForeground')).toBe('var(--clarity-card-foreground)');
        });
        it('should provide getHSL function', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.getHSL).toBeDefined();
            expect(typeof result.current.getHSL).toBe('function');
        });
        it('should format HSL values correctly', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            const hslValue = result.current.getHSL('primary');
            expect(hslValue).toMatch(/^hsl\(.+\)$/);
        });
    });
    describe('theme name', () => {
        it('should provide theme name', () => {
            const { result } = renderHook(() => useThemeColors(), {
                wrapper: createWrapper('light'),
            });
            expect(result.current.themeName).toBeDefined();
            expect(typeof result.current.themeName).toBe('string');
        });
    });
    describe('error handling', () => {
        it('should throw when used outside ThemeProvider', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                renderHook(() => useThemeColors());
            }).toThrow('useTheme must be used within a ThemeProvider');
            spy.mockRestore();
        });
    });
});
//# sourceMappingURL=use-theme-colors.test.js.map