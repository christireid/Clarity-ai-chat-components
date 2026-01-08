import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextMenu, ContextMenuItem } from '../context-menu';
describe('ContextMenu Component', () => {
    const mockItems = [
        {
            id: 'copy',
            label: 'Copy',
            shortcut: 'mod+c',
            onSelect: vi.fn(),
        },
        {
            id: 'paste',
            label: 'Paste',
            shortcut: 'mod+v',
            onSelect: vi.fn(),
        },
        {
            id: 'delete',
            label: 'Delete',
            danger: true,
            onSelect: vi.fn(),
        },
    ];
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render children', () => {
            render(_jsx(ContextMenu, { items: mockItems, children: _jsx("div", { "data-testid": "trigger", children: "Right-click me" }) }));
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
        });
        it('should not show menu initially', () => {
            render(_jsx(ContextMenu, { items: mockItems, children: _jsx("div", { children: "Content" }) }));
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
        it('should accept aria-label prop', () => {
            render(_jsx(ContextMenu, { items: mockItems, "aria-label": "Custom context menu", children: _jsx("div", { children: "Content" }) }));
            // Component renders but menu is not visible until context menu event
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });
    describe('Component Interface', () => {
        it('should accept items with all properties', () => {
            const itemsWithAllProps = [
                {
                    id: 'test',
                    label: 'Test',
                    icon: _jsx("span", { children: "icon" }),
                    shortcut: 'mod+t',
                    danger: false,
                    disabled: false,
                    separator: false,
                    submenu: [],
                    onSelect: vi.fn(),
                },
            ];
            render(_jsx(ContextMenu, { items: itemsWithAllProps, children: _jsx("div", { "data-testid": "trigger", children: "Content" }) }));
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
        });
        it('should accept className prop', () => {
            render(_jsx(ContextMenu, { items: mockItems, className: "custom-class", children: _jsx("div", { "data-testid": "trigger", children: "Content" }) }));
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
        });
        it('should handle separator items', () => {
            const itemsWithSeparator = [
                { id: '1', label: 'Item 1', onSelect: vi.fn() },
                { id: 'sep', label: '', separator: true },
                { id: '2', label: 'Item 2', onSelect: vi.fn() },
            ];
            render(_jsx(ContextMenu, { items: itemsWithSeparator, children: _jsx("div", { "data-testid": "trigger", children: "Content" }) }));
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
        });
        it('should handle submenu items', () => {
            const itemsWithSubmenu = [
                {
                    id: 'parent',
                    label: 'Parent',
                    submenu: [
                        { id: 'child1', label: 'Child 1', onSelect: vi.fn() },
                        { id: 'child2', label: 'Child 2', onSelect: vi.fn() },
                    ],
                },
            ];
            render(_jsx(ContextMenu, { items: itemsWithSubmenu, children: _jsx("div", { "data-testid": "trigger", children: "Content" }) }));
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=context-menu.test.js.map