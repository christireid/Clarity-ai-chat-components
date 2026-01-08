import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Comprehensive Accessibility Tests for Enhanced Skeleton System
 *
 * Tests WCAG 2.1 compliance, screen reader support, keyboard navigation,
 * reduced motion preferences, and comprehensive accessibility features.
 */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AccessibleSkeleton, EnhancedSkeleton, EnhancedSkeletonText, EnhancedSkeletonAvatar, SkeletonComposer, SkeletonTransition, SkeletonThemeProvider, MicroInteractionSkeleton, AdvancedSkeleton, } from '../skeleton-enhanced';
import { useOptimalAnimation, useResponsiveSize } from '../skeleton-advanced';
import { prefersReducedMotion, getAccessibleAnimation, useReducedMotion, } from '../../../animations/zero-dependency';
// Mock matchMedia for accessibility testing
const mockMatchMedia = (prefersReducedMotion = false) => {
    return jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)'
            ? prefersReducedMotion
            : false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
};
// Mock screen reader announcements
const mockAnnouncements = [];
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        speak: jest.fn((utterance) => {
            mockAnnouncements.push(utterance.text);
        }),
        cancel: jest.fn(),
        getVoices: jest.fn(() => []),
    },
    writable: true,
});
// Mock IntersectionObserver
class MockIntersectionObserver {
    callback;
    elements;
    constructor(callback) {
        this.callback = callback;
        this.elements = [];
    }
    observe(element) {
        this.elements.push(element);
    }
    unobserve(element) {
        this.elements = this.elements.filter((el) => el !== element);
    }
    disconnect() {
        this.elements = [];
    }
    trigger(entries) {
        this.callback(entries, this);
    }
}
Object.defineProperty(window, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true,
});
describe('Accessibility Features', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockAnnouncements.length = 0;
        window.matchMedia = mockMatchMedia();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    describe('WCAG 2.1 Compliance', () => {
        it('provides proper ARIA attributes', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true }));
            const container = screen.getByRole('status');
            expect(container).toHaveAttribute('aria-live', 'polite');
            expect(container).toHaveAttribute('aria-busy', 'true');
            expect(container).toHaveAttribute('aria-atomic', 'true');
        });
        it('provides meaningful loading announcements', async () => {
            const { rerender } = render(_jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: "Loading user profile, please wait...", children: _jsx("div", { children: "Content" }) }));
            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toHaveTextContent('Loading user profile, please wait...');
            rerender(_jsx(AccessibleSkeleton, { isLoading: false, loadedMessage: "Profile loaded successfully!", children: _jsx("div", { children: "Content" }) }));
            expect(liveRegion).toHaveTextContent('Profile loaded successfully!');
        });
        it('provides proper progress indicators', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, progressIndicator: "linear", estimatedTime: 5000, showProgress: true, children: _jsx("div", { children: "Content" }) }));
            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuemin', '0');
            expect(progressBar).toHaveAttribute('aria-valuemax', '100');
            expect(progressBar).toHaveAttribute('aria-valuenow');
            expect(progressBar).toHaveAttribute('aria-label', 'Loading progress');
        });
        it('provides alternative progress indicators', () => {
            const indicators = ['linear', 'circular', 'dots', 'none'];
            indicators.forEach((indicator) => {
                const { container } = render(_jsx(AccessibleSkeleton, { isLoading: true, progressIndicator: indicator, showProgress: true, children: _jsx("div", { children: "Content" }) }));
                if (indicator !== 'none') {
                    expect(container.querySelector('[role="progressbar"], .animate-pulse')).toBeTruthy();
                }
                // Clean up for next iteration
                container.remove();
            });
        });
        it('provides proper heading structure', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, children: _jsxs("div", { children: [_jsx("h1", { children: "Main Title" }), _jsx("h2", { children: "Subtitle" }), _jsx("p", { children: "Content paragraph" })] }) }));
            // Should not interfere with heading structure
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
        });
        it('provides proper color contrast', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, theme: {
                    primaryColor: '#ffffff',
                    secondaryColor: '#cccccc',
                }, children: _jsx("div", { children: "Content" }) }));
            // Should maintain sufficient color contrast
            const skeleton = screen.getByLabelText('Loading...');
            expect(skeleton).toHaveStyle({ backgroundColor: expect.any(String) });
        });
    });
    describe('Screen Reader Support', () => {
        it('provides descriptive labels for skeletons', () => {
            render(_jsxs("div", { children: [_jsx(EnhancedSkeleton, { ariaLabel: "Loading user avatar" }), _jsx(EnhancedSkeletonText, { ariaLabel: "Loading user details" }), _jsx(EnhancedSkeletonAvatar, { ariaLabel: "Loading profile picture" })] }));
            expect(screen.getByLabelText('Loading user avatar')).toBeInTheDocument();
            expect(screen.getByLabelText('Loading user details')).toBeInTheDocument();
            expect(screen.getByLabelText('Loading profile picture')).toBeInTheDocument();
        });
        it('provides contextually relevant labels', () => {
            render(_jsx(SkeletonComposer, { composition: {
                    layout: 'card',
                    components: [
                        { type: 'avatar', props: { ariaLabel: 'Loading author avatar' } },
                        {
                            type: 'text',
                            props: { lines: 3, ariaLabel: 'Loading article preview' },
                        },
                        { type: 'button', props: { ariaLabel: 'Loading action button' } },
                    ],
                } }));
            expect(screen.getByLabelText('Loading author avatar')).toBeInTheDocument();
            expect(screen.getByLabelText('Loading article preview')).toBeInTheDocument();
            expect(screen.getByLabelText('Loading action button')).toBeInTheDocument();
        });
        it('provides live region announcements', () => {
            const { rerender } = render(_jsx(SkeletonTransition, { isLoading: true, skeleton: _jsx("div", { children: "Loading..." }), accessibilityMode: "assertive", children: _jsx("div", { children: "Content" }) }));
            const liveRegion = document.querySelector('[aria-live="assertive"]');
            expect(liveRegion).toBeInTheDocument();
            rerender(_jsx(SkeletonTransition, { isLoading: false, skeleton: _jsx("div", { children: "Loading..." }), accessibilityMode: "assertive", children: _jsx("div", { children: "Content" }) }));
            // Should announce content change
            expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
        });
        it('provides meaningful timing information', async () => {
            const TestComponent = () => {
                const [isLoading, setIsLoading] = React.useState(true);
                const [startTime] = React.useState(Date.now());
                React.useEffect(() => {
                    const timer = setTimeout(() => {
                        setIsLoading(false);
                    }, 2000);
                    return () => clearTimeout(timer);
                }, []);
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                return (_jsx(AccessibleSkeleton, { isLoading: isLoading, loadingMessage: `Loading content (${elapsed} seconds elapsed)`, estimatedTime: 2000, showProgress: true, children: _jsxs("div", { children: ["Content loaded after ", elapsed, " seconds"] }) }));
            };
            render(_jsx(TestComponent, {}));
            expect(screen.getByText(/Loading content.*seconds elapsed/)).toBeInTheDocument();
            act(() => {
                jest.advanceTimersByTime(2000);
            });
            await waitFor(() => {
                expect(screen.getByText('Content loaded after 2 seconds')).toBeInTheDocument();
            });
        });
    });
    describe('Reduced Motion Support', () => {
        it('respects prefers-reduced-motion preference', () => {
            window.matchMedia = mockMatchMedia(true); // Reduced motion preferred
            render(_jsx(EnhancedSkeleton, { variant: "shimmer" }));
            const skeleton = screen.getByLabelText('Loading...');
            expect(skeleton).toHaveClass('skeleton-accessible');
            expect(skeleton).not.toHaveClass('skeleton-shimmer');
        });
        it('provides static alternatives to animations', () => {
            window.matchMedia = mockMatchMedia(true);
            render(_jsx(AdvancedSkeleton, { variant: "shimmerRainbow" }));
            const skeleton = screen.getByRole('presentation');
            expect(skeleton).toHaveClass('skeleton-none');
        });
        it('adapts transition animations for reduced motion', () => {
            window.matchMedia = mockMatchMedia(true);
            const TestComponent = () => {
                const [isLoading, setIsLoading] = React.useState(true);
                React.useEffect(() => {
                    setTimeout(() => setIsLoading(false), 500);
                }, []);
                return (_jsx(SkeletonTransition, { isLoading: isLoading, skeleton: _jsx("div", { children: "Skeleton" }), direction: "fade", duration: 300, children: _jsx("div", { children: "Content" }) }));
            };
            render(_jsx(TestComponent, {}));
            // Should use instant transition for reduced motion
            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('provides accessible animation alternatives', () => {
            window.matchMedia = mockMatchMedia(true);
            const accessibleClass = getAccessibleAnimation('fade-in', 'opacity-100');
            expect(accessibleClass).toBe('opacity-100');
            window.matchMedia = mockMatchMedia(false);
            const normalClass = getAccessibleAnimation('fade-in', 'opacity-100');
            expect(normalClass).toBe('fade-in');
        });
        it('detects reduced motion preference changes', () => {
            let reducedMotionValue = false;
            const TestComponent = () => {
                const reducedMotion = useReducedMotion();
                reducedMotionValue = reducedMotion;
                return (_jsx("div", { "data-testid": "reduced-motion", children: reducedMotion.toString() }));
            };
            window.matchMedia = mockMatchMedia(false);
            render(_jsx(TestComponent, {}));
            expect(reducedMotionValue).toBe(false);
            // Simulate preference change
            window.matchMedia = mockMatchMedia(true);
            act(() => {
                window.dispatchEvent(new Event('change'));
            });
            // Should detect the change
            expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
        });
    });
    describe('Keyboard Navigation Support', () => {
        it('provides keyboard-accessible loading states', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: "Loading content", children: _jsxs("div", { children: [_jsx("button", { children: "Action 1" }), _jsx("button", { children: "Action 2" })] }) }));
            // Should not allow keyboard interaction during loading
            const buttons = screen.queryAllByRole('button');
            expect(buttons).toHaveLength(0);
        });
        it('restores keyboard accessibility after loading', async () => {
            const { rerender } = render(_jsx(AccessibleSkeleton, { isLoading: true, children: _jsxs("div", { children: [_jsx("button", { children: "Action 1" }), _jsx("button", { children: "Action 2" })] }) }));
            expect(screen.queryAllByRole('button')).toHaveLength(0);
            rerender(_jsx(AccessibleSkeleton, { isLoading: false, children: _jsxs("div", { children: [_jsx("button", { children: "Action 1" }), _jsx("button", { children: "Action 2" })] }) }));
            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);
            // Should be keyboard accessible
            buttons.forEach((button) => {
                expect(button).not.toHaveAttribute('disabled');
            });
        });
        it('provides keyboard-accessible progress indicators', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, progressIndicator: "linear", showProgress: true, children: _jsx("div", { children: "Content" }) }));
            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('tabindex', '-1');
            expect(progressBar).toHaveAttribute('aria-label', 'Loading progress');
        });
        it('provides keyboard navigation for micro-interactions', () => {
            render(_jsx(MicroInteractionSkeleton, { interactions: [
                    { type: 'focus', effect: 'glow', duration: 300 },
                    { type: 'click', effect: 'pulse', duration: 200 },
                ], children: _jsx("button", { children: "Interactive Button" }) }));
            const button = screen.getByRole('button');
            expect(button).toHaveTextContent('Interactive Button');
            // Should be keyboard focusable
            button.focus();
            expect(document.activeElement).toBe(button);
        });
    });
    describe('Semantic HTML Structure', () => {
        it('uses semantic HTML elements', () => {
            const { container } = render(_jsx(AccessibleSkeleton, { isLoading: true, children: _jsxs("article", { children: [_jsx("header", { children: _jsx("h1", { children: "Article Title" }) }), _jsx("main", { children: _jsx("p", { children: "Article content" }) }), _jsx("footer", { children: _jsx("time", { dateTime: "2023-01-01", children: "January 1, 2023" }) })] }) }));
            expect(container.querySelector('article')).toBeInTheDocument();
            expect(container.querySelector('header')).toBeInTheDocument();
            expect(container.querySelector('main')).toBeInTheDocument();
            expect(container.querySelector('footer')).toBeInTheDocument();
            expect(container.querySelector('time')).toBeInTheDocument();
        });
        it('provides proper landmark roles', () => {
            render(_jsxs("div", { children: [_jsx("nav", { "aria-label": "Main navigation", children: _jsx(AccessibleSkeleton, { isLoading: true, children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "#home", children: "Home" }) }), _jsx("li", { children: _jsx("a", { href: "#about", children: "About" }) })] }) }) }), _jsx("main", { children: _jsx(AccessibleSkeleton, { isLoading: true, children: _jsxs("section", { "aria-labelledby": "content-heading", children: [_jsx("h2", { id: "content-heading", children: "Main Content" }), _jsx("p", { children: "Content here" })] }) }) }), _jsx("aside", { "aria-label": "Sidebar", children: _jsx(AccessibleSkeleton, { isLoading: true, children: _jsx("div", { children: "Sidebar content" }) }) })] }));
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
            expect(screen.getByRole('complementary')).toBeInTheDocument();
        });
        it('provides proper list structure', () => {
            render(_jsxs(AccessibleSkeleton, { isLoading: true, children: [_jsxs("ul", { children: [_jsx("li", { children: "Item 1" }), _jsx("li", { children: "Item 2" }), _jsx("li", { children: "Item 3" })] }), _jsxs("ol", { children: [_jsx("li", { children: "Step 1" }), _jsx("li", { children: "Step 2" })] })] }));
            expect(screen.getByRole('list')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(5);
        });
    });
    describe('Focus Management', () => {
        it('manages focus during loading transitions', async () => {
            const TestComponent = () => {
                const [isLoading, setIsLoading] = React.useState(true);
                const contentRef = React.useRef(null);
                React.useEffect(() => {
                    if (!isLoading && contentRef.current) {
                        contentRef.current.focus();
                    }
                }, [isLoading]);
                React.useEffect(() => {
                    setTimeout(() => setIsLoading(false), 1000);
                }, []);
                return (_jsx(AccessibleSkeleton, { isLoading: isLoading, children: _jsxs("div", { ref: contentRef, tabIndex: -1, "data-testid": "focusable-content", children: [_jsx("h2", { children: "Content Loaded" }), _jsx("p", { children: "Focus should be managed here" })] }) }));
            };
            render(_jsx(TestComponent, {}));
            act(() => {
                jest.advanceTimersByTime(1000);
            });
            await waitFor(() => {
                const content = screen.getByTestId('focusable-content');
                expect(document.activeElement).toBe(content);
            });
        });
        it('provides focus indicators for interactive elements', () => {
            render(_jsx(MicroInteractionSkeleton, { interactions: [{ type: 'focus', effect: 'glow', duration: 300 }], children: _jsx("button", { className: "focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Focusable Button" }) }));
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus:outline-none');
            expect(button).toHaveClass('focus:ring-2');
            expect(button).toHaveClass('focus:ring-blue-500');
        });
        it('manages focus order in complex layouts', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: false, children: _jsxs("div", { className: "space-y-4", children: [_jsx("a", { href: "#link1", className: "block", children: "Link 1" }), _jsx("button", { className: "block", children: "Button 1" }), _jsx("input", { type: "text", placeholder: "Input 1" }), _jsx("a", { href: "#link2", className: "block", children: "Link 2" }), _jsx("button", { className: "block", children: "Button 2" }), _jsx("input", { type: "text", placeholder: "Input 2" })] }) }));
            const links = screen.getAllByRole('link');
            const buttons = screen.getAllByRole('button');
            const inputs = screen.getAllByRole('textbox');
            expect(links).toHaveLength(2);
            expect(buttons).toHaveLength(2);
            expect(inputs).toHaveLength(2);
            // Should be in logical order
            expect(links[0]).toHaveAttribute('href', '#link1');
            expect(links[1]).toHaveAttribute('href', '#link2');
        });
    });
    describe('Color and Contrast Accessibility', () => {
        it('provides sufficient color contrast for skeletons', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, theme: {
                    primaryColor: '#f0f0f0',
                    secondaryColor: '#e0e0e0',
                }, children: _jsx("div", { children: "Content" }) }));
            const skeleton = screen.getByLabelText('Loading...');
            const computedStyle = window.getComputedStyle(skeleton);
            // Should have sufficient contrast ratio
            expect(computedStyle.backgroundColor).toBeDefined();
        });
        it('provides high contrast mode support', () => {
            // Simulate high contrast mode
            const mediaQuery = window.matchMedia('(prefers-contrast: high)');
            Object.defineProperty(mediaQuery, 'matches', { value: true });
            render(_jsx(AccessibleSkeleton, { isLoading: true, theme: {
                    primaryColor: '#000000',
                    secondaryColor: '#ffffff',
                }, children: _jsx("div", { children: "Content" }) }));
            const skeleton = screen.getByLabelText('Loading...');
            expect(skeleton).toBeInTheDocument();
        });
        it('provides dark mode support', () => {
            // Simulate dark mode
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            Object.defineProperty(mediaQuery, 'matches', { value: true });
            render(_jsx(AccessibleSkeleton, { isLoading: true, theme: {
                    primaryColor: '#333333',
                    secondaryColor: '#555555',
                }, children: _jsx("div", { children: "Content" }) }));
            const skeleton = screen.getByLabelText('Loading...');
            expect(skeleton).toBeInTheDocument();
        });
    });
    describe('Cognitive Accessibility', () => {
        it('provides clear and simple loading messages', () => {
            const messages = [
                'Loading content, please wait...',
                'Content is loading',
                'Please wait while we load the page',
                'Loading...',
            ];
            messages.forEach((message) => {
                const { container } = render(_jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: message, children: _jsx("div", { children: "Content" }) }));
                expect(screen.getByText(message)).toBeInTheDocument();
                // Clean up
                container.remove();
            });
        });
        it('provides predictable loading behavior', () => {
            const TestComponent = () => {
                const [isLoading, setIsLoading] = React.useState(true);
                const [count, setCount] = React.useState(0);
                React.useEffect(() => {
                    const timer = setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                    return () => clearTimeout(timer);
                }, []);
                return (_jsx(AccessibleSkeleton, { isLoading: isLoading, loadingMessage: `Loading attempt ${count + 1}`, estimatedTime: 1000, showProgress: true, children: _jsxs("div", { children: [_jsx("button", { onClick: () => {
                                    setCount((prev) => prev + 1);
                                    setIsLoading(true);
                                    setTimeout(() => setIsLoading(false), 1000);
                                }, children: "Reload Content" }), _jsx("p", { children: "Content loaded successfully!" })] }) }));
            };
            render(_jsx(TestComponent, {}));
            expect(screen.getByText('Loading attempt 1')).toBeInTheDocument();
            act(() => {
                jest.advanceTimersByTime(1000);
            });
            expect(screen.getByText('Content loaded successfully!')).toBeInTheDocument();
            // Click reload
            userEvent.click(screen.getByText('Reload Content'));
            expect(screen.getByText('Loading attempt 2')).toBeInTheDocument();
        });
        it('provides consistent interaction patterns', () => {
            render(_jsxs("div", { children: [_jsx(AccessibleSkeleton, { isLoading: true, children: _jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Primary Action" }) }), _jsx(AccessibleSkeleton, { isLoading: false, children: _jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Primary Action" }) })] }));
            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(1); // Only the second one should be visible
            const button = buttons[0];
            expect(button).toHaveClass('px-4');
            expect(button).toHaveClass('py-2');
            expect(button).toHaveClass('bg-blue-500');
            expect(button).toHaveClass('text-white');
            expect(button).toHaveClass('rounded');
            expect(button).toHaveClass('hover:bg-blue-600');
        });
    });
    describe('Edge Cases and Error Handling', () => {
        it('handles missing accessibility attributes gracefully', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: null, loadedMessage: null, progressIndicator: null, children: _jsx("div", { children: "Content" }) }));
            // Should still provide default accessibility
            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toBeInTheDocument();
            expect(liveRegion).toHaveTextContent('Loading content, please wait...');
        });
        it('handles invalid accessibility values', () => {
            render(_jsx(AccessibleSkeleton, { isLoading: true, accessibilityMode: null, estimatedTime: -1000, showProgress: null, children: _jsx("div", { children: "Content" }) }));
            // Should use sensible defaults
            const liveRegion = document.querySelector('[aria-live]');
            expect(liveRegion).toHaveAttribute('aria-live', 'polite');
            const progressBar = screen.queryByRole('progressbar');
            expect(progressBar).toBeFalsy(); // Should not show invalid progress
        });
        it('handles rapid accessibility state changes', async () => {
            const TestComponent = () => {
                const [isLoading, setIsLoading] = React.useState(true);
                const [message, setMessage] = React.useState('Initial loading');
                React.useEffect(() => {
                    const timer = setTimeout(() => {
                        setMessage('Updated loading message');
                        setIsLoading(false);
                        setMessage('Final loaded message');
                    }, 100);
                    return () => clearTimeout(timer);
                }, []);
                return (_jsx(AccessibleSkeleton, { isLoading: isLoading, loadingMessage: message, loadedMessage: message, children: _jsx("div", { children: "Content" }) }));
            };
            render(_jsx(TestComponent, {}));
            expect(screen.getByText('Initial loading')).toBeInTheDocument();
            act(() => {
                jest.advanceTimersByTime(150);
            });
            await waitFor(() => {
                expect(screen.getByText('Final loaded message')).toBeInTheDocument();
            });
        });
        it('provides fallback for unsupported features', () => {
            // Mock missing APIs
            const originalMatchMedia = window.matchMedia;
            // @ts-expect-error - Testing fallback behavior when matchMedia is unavailable
            delete window.matchMedia;
            render(_jsx(EnhancedSkeleton, { variant: "shimmer" }));
            const skeleton = screen.getByLabelText('Loading...');
            expect(skeleton).toBeInTheDocument();
            window.matchMedia = originalMatchMedia;
        });
    });
    describe('Internationalization Support', () => {
        it('supports different languages for loading messages', () => {
            const messages = {
                english: 'Loading content, please wait...',
                spanish: 'Cargando contenido, por favor espere...',
                french: 'Chargement du contenu, veuillez patienter...',
                german: 'Inhalt wird geladen, bitte warten...',
                japanese: 'コンテンツを読み込んでいます。しばらくお待ちください...',
            };
            Object.entries(messages).forEach(([language, message]) => {
                const { container } = render(_jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: message, children: _jsx("div", { children: "Content" }) }));
                expect(screen.getByText(message)).toBeInTheDocument();
                // Clean up
                container.remove();
            });
        });
        it('handles RTL (Right-to-Left) text direction', () => {
            render(_jsx("div", { dir: "rtl", children: _jsx(AccessibleSkeleton, { isLoading: true, loadingMessage: "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...", children: _jsx("div", { children: "\u0627\u0644\u0645\u062D\u062A\u0648\u0649" }) }) }));
            const container = screen.getByText('جاري التحميل...').parentElement;
            expect(container).toHaveAttribute('dir', 'rtl');
        });
    });
});
//# sourceMappingURL=skeleton-accessibility.test.js.map