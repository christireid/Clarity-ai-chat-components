import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, } from '../ui/dropdown-menu';
describe('DropdownMenu Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render dropdown menu when open', () => {
            render(_jsxs(DropdownMenu, { open: true, children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item 1" }) })] }));
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });
        it('should not render dropdown menu when closed', () => {
            render(_jsxs(DropdownMenu, { open: false, children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item 1" }) })] }));
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        });
        it('should render trigger', () => {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Trigger" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) })] }));
            expect(screen.getByText('Trigger')).toBeInTheDocument();
        });
        it('should render all menu items', () => {
            render(_jsx(DropdownMenu, { open: true, children: _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuLabel, { children: "Label" }), _jsx(DropdownMenuItem, { children: "Item 1" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Item 2" })] }) }));
            expect(screen.getByText('Label')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });
    });
    describe('Interactions', () => {
        it('should open dropdown when trigger is clicked', async () => {
            const user = userEvent.setup();
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: "Open" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) })] }));
            const trigger = screen.getByText('Open');
            await user.click(trigger);
            expect(screen.getByText('Item')).toBeInTheDocument();
        });
        it('should call onClick when menu item is clicked', async () => {
            const user = userEvent.setup();
            const mockOnClick = vi.fn();
            render(_jsx(DropdownMenu, { open: true, children: _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { onClick: mockOnClick, children: "Click me" }) }) }));
            const item = screen.getByText('Click me');
            await user.click(item);
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
    });
    describe('Controlled vs Uncontrolled', () => {
        it('should work as controlled component', () => {
            const mockOnOpenChange = vi.fn();
            render(_jsxs(DropdownMenu, { open: true, onOpenChange: mockOnOpenChange, children: [_jsx(DropdownMenuTrigger, { children: "Trigger" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) })] }));
            expect(screen.getByText('Item')).toBeInTheDocument();
        });
        it('should work as uncontrolled component', () => {
            render(_jsxs(DropdownMenu, { defaultOpen: true, children: [_jsx(DropdownMenuTrigger, { children: "Trigger" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) })] }));
            expect(screen.getByText('Item')).toBeInTheDocument();
        });
    });
    describe('Disabled State', () => {
        it('should disable trigger when disabled', () => {
            render(_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { disabled: true, children: "Disabled" }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) })] }));
            const trigger = screen.getByText('Disabled');
            expect(trigger).toBeDisabled();
        });
        it('should disable menu item when disabled', () => {
            render(_jsx(DropdownMenu, { open: true, children: _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { disabled: true, children: "Disabled Item" }) }) }));
            // Radix UI uses aria-disabled and data-disabled instead of disabled attribute
            const item = screen.getByRole('menuitem', { name: 'Disabled Item' });
            expect(item).toHaveAttribute('aria-disabled', 'true');
            expect(item).toHaveAttribute('data-disabled');
        });
    });
    describe('Error Handling', () => {
        it('should throw error when used outside DropdownMenu context', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                render(_jsx(DropdownMenuTrigger, { children: "Trigger" }));
            }).toThrow('DropdownMenuTrigger');
            consoleSpy.mockRestore();
        });
    });
    describe('Accessibility', () => {
        it('should have proper menu role', () => {
            render(_jsx(DropdownMenu, { open: true, children: _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) }) }));
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });
        it('should have proper menuitem role', () => {
            render(_jsx(DropdownMenu, { open: true, children: _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { children: "Item" }) }) }));
            expect(screen.getByRole('menuitem')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=dropdown-menu.test.js.map