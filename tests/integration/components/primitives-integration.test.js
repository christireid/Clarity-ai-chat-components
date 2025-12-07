/**
 * Primitives Package Integration Tests
 *
 * Tests verifying primitives components work together
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Input, Card } from '@clarity-chat/primitives';
describe('Primitives Integration', () => {
    describe('Button + Input Integration', () => {
        it('renders button and input together', () => {
            render(placeholder, "Enter text" /  >
                Submit < /Button>
                < /div>);
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        });
        it('applies consistent focus styles', () => {
            render(data - testid, "input" /  >
                data - testid, "button" > Click < /Button>
                < /div>);
            const input = screen.getByTestId('input');
            const button = screen.getByTestId('button');
            // Both should use consistent focus ring classes
            expect(input.className).toContain('focus-visible:ring');
            expect(button.className).toContain('focus-visible:ring');
        });
    });
    describe('Card + Content Integration', () => {
        it('renders card with nested components', () => {
            render(Title < /h2>
                < p > Description < /p>
                < Button > Action < /Button>
                < /Card>);
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
        it('applies consistent shadow and border styles', () => {
            const { container } = render(data - testid, "card" > Content < /Card>);
            const card = screen.getByTestId('card');
            // Card should have consistent border/shadow
            expect(card.className).toContain('rounded');
            expect(card.className).toContain('ring');
        });
    });
    describe('Theme Consistency', () => {
        it('all components use design tokens', () => {
            const { container } = render(className, "test-button" > Button < /Button>
                < Input, className = "test-input" /  >
                className, "test-card" > Card < /Card>
                < /div>);
            const button = container.querySelector('.test-button');
            const input = container.querySelector('.test-input');
            const card = container.querySelector('.test-card');
            // All should support transitions
            expect(button?.className).toContain('transition');
            expect(input?.className).toContain('transition');
            // All should have consistent sizing
            expect(button?.className).toMatch(/h-\d+/);
            expect(input?.className).toMatch(/h-\d+/);
        });
    });
});
//# sourceMappingURL=primitives-integration.test.js.map