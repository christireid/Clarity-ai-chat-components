import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Tests for Accessibility utilities
 * Tests screen reader announcer, skip link, focus trap, and keyboard navigation
 */
import * as React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ScreenReaderAnnouncer, SkipLink, VisuallyHidden, useAnnounce, useFocusTrap, useKeyboardNavigation, useReducedMotion, useAriaIds, getFocusableElements, getDescribedByProps, } from '../components/accessibility';
// Mock matchMedia for reduced motion tests
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});
describe('ScreenReaderAnnouncer', () => {
    it('renders with polite politeness by default', () => {
        render(_jsx(ScreenReaderAnnouncer, { message: "Test message" }));
        const announcer = screen.getByRole('status');
        expect(announcer).toBeTruthy();
        expect(announcer.getAttribute('aria-live')).toBe('polite');
        expect(announcer.getAttribute('aria-atomic')).toBe('true');
    });
    it('renders with assertive politeness', () => {
        render(_jsx(ScreenReaderAnnouncer, { message: "Urgent message", politeness: "assertive" }));
        const announcer = screen.getByRole('status');
        expect(announcer.getAttribute('aria-live')).toBe('assertive');
    });
    it('displays the message', () => {
        render(_jsx(ScreenReaderAnnouncer, { message: "Hello screen readers" }));
        expect(screen.getByText('Hello screen readers')).toBeTruthy();
    });
    it('has sr-only class for visual hiding', () => {
        const { container } = render(_jsx(ScreenReaderAnnouncer, { message: "Hidden visually" }));
        expect(container.querySelector('.sr-only')).toBeTruthy();
    });
});
describe('useAnnounce hook', () => {
    function TestComponent() {
        const { announce, Announcer } = useAnnounce();
        return (_jsxs("div", { children: [_jsx("button", { onClick: () => announce('Action completed'), children: "Trigger" }), _jsx("button", { onClick: () => announce('Error!', 'assertive'), children: "Trigger Error" }), _jsx(Announcer, {})] }));
    }
    it('announces messages', async () => {
        vi.useFakeTimers();
        render(_jsx(TestComponent, {}));
        fireEvent.click(screen.getByText('Trigger'));
        await act(async () => {
            vi.advanceTimersByTime(100);
        });
        expect(screen.getByText('Action completed')).toBeTruthy();
        vi.useRealTimers();
    });
});
describe('SkipLink', () => {
    it('renders with default text', () => {
        render(_jsx(SkipLink, { targetId: "main-content" }));
        expect(screen.getByText('Skip to main content')).toBeTruthy();
    });
    it('renders with custom text', () => {
        render(_jsx(SkipLink, { targetId: "main", children: "Skip to navigation" }));
        expect(screen.getByText('Skip to navigation')).toBeTruthy();
    });
    it('has correct href', () => {
        render(_jsx(SkipLink, { targetId: "main-content" }));
        const link = screen.getByRole('link');
        expect(link.getAttribute('href')).toBe('#main-content');
    });
    it('has skip-link class', () => {
        const { container } = render(_jsx(SkipLink, { targetId: "main" }));
        expect(container.querySelector('.skip-link')).toBeTruthy();
    });
    it('focuses and scrolls target on click', () => {
        const mockFocus = vi.fn();
        const mockScrollIntoView = vi.fn();
        const mockElement = {
            focus: mockFocus,
            scrollIntoView: mockScrollIntoView,
        };
        vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);
        render(_jsx(SkipLink, { targetId: "target" }));
        fireEvent.click(screen.getByRole('link'));
        expect(mockFocus).toHaveBeenCalled();
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        vi.restoreAllMocks();
    });
});
describe('VisuallyHidden', () => {
    it('renders with sr-only class', () => {
        const { container } = render(_jsx(VisuallyHidden, { children: "Hidden text" }));
        expect(container.querySelector('.sr-only')).toBeTruthy();
        expect(screen.getByText('Hidden text')).toBeTruthy();
    });
    it('uses hidden attribute when hidden prop is true', () => {
        const { container } = render(_jsx(VisuallyHidden, { hidden: true, children: "Fully hidden" }));
        const span = container.querySelector('span');
        expect(span?.hasAttribute('hidden')).toBe(true);
    });
});
describe('useFocusTrap', () => {
    function TestModal({ enabled = true }) {
        const containerRef = React.useRef(null);
        useFocusTrap(containerRef, { enabled });
        return (_jsxs("div", { ref: containerRef, tabIndex: -1, "data-testid": "modal", children: [_jsx("button", { "data-testid": "first", children: "First" }), _jsx("button", { "data-testid": "second", children: "Second" }), _jsx("button", { "data-testid": "third", children: "Third" })] }));
    }
    it('focuses first focusable element when enabled', () => {
        render(_jsx(TestModal, {}));
        // First button should be focused
        expect(document.activeElement).toBe(screen.getByTestId('first'));
    });
    it('does not trap focus when disabled', () => {
        const initialFocus = document.createElement('button');
        document.body.appendChild(initialFocus);
        initialFocus.focus();
        render(_jsx(TestModal, { enabled: false }));
        // Focus should not have moved
        expect(document.activeElement).toBe(initialFocus);
        document.body.removeChild(initialFocus);
    });
});
describe('useKeyboardNavigation', () => {
    function TestList() {
        const [selectedIndex, setSelectedIndex] = React.useState(0);
        const items = ['Item 1', 'Item 2', 'Item 3'];
        const { onKeyDown } = useKeyboardNavigation({
            items,
            selectedIndex,
            onSelect: setSelectedIndex,
        });
        return (_jsx("ul", { role: "listbox", onKeyDown: onKeyDown, tabIndex: 0, "data-testid": "list", children: items.map((item, i) => (_jsx("li", { role: "option", "aria-selected": i === selectedIndex, "data-testid": `item-${i}`, children: item }, item))) }));
    }
    it('moves selection down on ArrowDown', () => {
        render(_jsx(TestList, {}));
        const list = screen.getByTestId('list');
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe('true');
    });
    it('moves selection up on ArrowUp', () => {
        render(_jsx(TestList, {}));
        const list = screen.getByTestId('list');
        // Move down first
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        // Then up
        fireEvent.keyDown(list, { key: 'ArrowUp' });
        expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe('true');
    });
    it('wraps around at the end', () => {
        render(_jsx(TestList, {}));
        const list = screen.getByTestId('list');
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'ArrowDown' }); // Should wrap to first
        expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe('true');
    });
    it('moves to first on Home', () => {
        render(_jsx(TestList, {}));
        const list = screen.getByTestId('list');
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'Home' });
        expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe('true');
    });
    it('moves to last on End', () => {
        render(_jsx(TestList, {}));
        const list = screen.getByTestId('list');
        fireEvent.keyDown(list, { key: 'End' });
        expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe('true');
    });
});
describe('useReducedMotion', () => {
    function TestComponent() {
        const reducedMotion = useReducedMotion();
        return _jsx("div", { "data-testid": "result", children: reducedMotion.toString() });
    }
    it('returns false by default', () => {
        render(_jsx(TestComponent, {}));
        expect(screen.getByTestId('result').textContent).toBe('false');
    });
});
describe('useAriaIds', () => {
    function TestComponent() {
        const ids = useAriaIds('test');
        return (_jsxs("div", { children: [_jsx("span", { "data-testid": "label", children: ids.labelId }), _jsx("span", { "data-testid": "desc", children: ids.descriptionId }), _jsx("span", { "data-testid": "error", children: ids.errorId }), _jsx("span", { "data-testid": "control", children: ids.controlId })] }));
    }
    it('generates unique IDs with prefix', () => {
        render(_jsx(TestComponent, {}));
        const labelId = screen.getByTestId('label').textContent;
        const descId = screen.getByTestId('desc').textContent;
        const errorId = screen.getByTestId('error').textContent;
        const controlId = screen.getByTestId('control').textContent;
        expect(labelId).toContain('test-label-');
        expect(descId).toContain('test-desc-');
        expect(errorId).toContain('test-error-');
        expect(controlId).toContain('test-control-');
    });
});
describe('getFocusableElements', () => {
    it('returns all focusable elements', () => {
        const container = document.createElement('div');
        container.innerHTML = `
      <button>Button</button>
      <a href="#">Link</a>
      <input type="text" />
      <select><option>Option</option></select>
      <textarea></textarea>
      <div tabindex="0">Focusable div</div>
      <div tabindex="-1">Non-focusable div</div>
      <button disabled>Disabled button</button>
    `;
        const focusable = getFocusableElements(container);
        expect(focusable.length).toBe(6); // Excludes disabled and tabindex=-1
    });
});
describe('getDescribedByProps', () => {
    it('returns empty object when no descriptions', () => {
        const props = getDescribedByProps(false, false, 'error-1', 'desc-1');
        expect(props).toEqual({});
    });
    it('returns error ID when has error', () => {
        const props = getDescribedByProps(true, false, 'error-1', 'desc-1');
        expect(props).toEqual({ 'aria-describedby': 'error-1' });
    });
    it('returns description ID when has description', () => {
        const props = getDescribedByProps(false, true, 'error-1', 'desc-1');
        expect(props).toEqual({ 'aria-describedby': 'desc-1' });
    });
    it('returns both IDs when has error and description', () => {
        const props = getDescribedByProps(true, true, 'error-1', 'desc-1');
        expect(props).toEqual({ 'aria-describedby': 'error-1 desc-1' });
    });
});
//# sourceMappingURL=accessibility.test.js.map