import { jsx as _jsx } from "react/jsx-runtime";
import { ContextMenu } from '@clarity-chat/react';
const meta = {
    title: 'Components/Navigation/ContextMenu',
    component: ContextMenu,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Right-click context menu with support for icons, shortcuts, separators, and submenus. Keyboard accessible with Escape to close.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
const mockItems = [
    {
        id: 'copy',
        label: 'Copy',
        shortcut: 'Ctrl+C',
        onSelect: () => alert('Copy clicked'),
    },
    {
        id: 'paste',
        label: 'Paste',
        shortcut: 'Ctrl+V',
        onSelect: () => alert('Paste clicked'),
    },
    {
        id: 'separator-1',
        separator: true,
    },
    {
        id: 'edit',
        label: 'Edit',
        onSelect: () => alert('Edit clicked'),
    },
    {
        id: 'delete',
        label: 'Delete',
        danger: true,
        onSelect: () => alert('Delete clicked'),
    },
];
export const Default = {
    render: () => (_jsx("div", { className: "p-8 border-2 border-dashed rounded-lg text-center", children: _jsx(ContextMenu, { items: mockItems, children: _jsx("div", { className: "p-4 bg-muted rounded-lg inline-block", children: "Right-click me to open context menu" }) }) })),
};
export const WithIcons = {
    render: () => {
        const itemsWithIcons = [
            {
                id: 'copy',
                label: 'Copy',
                icon: _jsx("span", { children: "\uD83D\uDCCB" }),
                onSelect: () => alert('Copy'),
            },
            {
                id: 'cut',
                label: 'Cut',
                icon: _jsx("span", { children: "\u2702\uFE0F" }),
                onSelect: () => alert('Cut'),
            },
            {
                id: 'paste',
                label: 'Paste',
                icon: _jsx("span", { children: "\uD83D\uDCC4" }),
                onSelect: () => alert('Paste'),
            },
        ];
        return (_jsx("div", { className: "p-8 border-2 border-dashed rounded-lg text-center", children: _jsx(ContextMenu, { items: itemsWithIcons, children: _jsx("div", { className: "p-4 bg-muted rounded-lg inline-block", children: "Right-click for menu with icons" }) }) }));
    },
};
export const WithSubmenu = {
    render: () => {
        const itemsWithSubmenu = [
            {
                id: 'new',
                label: 'New',
                icon: _jsx("span", { children: "\u2795" }),
                submenu: [
                    { id: 'file', label: 'File', onSelect: () => alert('New File') },
                    { id: 'folder', label: 'Folder', onSelect: () => alert('New Folder') },
                ],
            },
            {
                id: 'open',
                label: 'Open',
                icon: _jsx("span", { children: "\uD83D\uDCC2" }),
                onSelect: () => alert('Open'),
            },
            {
                id: 'separator',
                separator: true,
            },
            {
                id: 'export',
                label: 'Export',
                icon: _jsx("span", { children: "\uD83D\uDCBE" }),
                submenu: [
                    { id: 'pdf', label: 'Export as PDF', onSelect: () => alert('PDF') },
                    { id: 'csv', label: 'Export as CSV', onSelect: () => alert('CSV') },
                ],
            },
        ];
        return (_jsx("div", { className: "p-8 border-2 border-dashed rounded-lg text-center", children: _jsx(ContextMenu, { items: itemsWithSubmenu, children: _jsx("div", { className: "p-4 bg-muted rounded-lg inline-block", children: "Right-click for menu with submenus" }) }) }));
    },
};
export const WithDisabledItems = {
    render: () => {
        const itemsWithDisabled = [
            {
                id: 'enabled',
                label: 'Enabled Item',
                onSelect: () => alert('Enabled'),
            },
            {
                id: 'disabled',
                label: 'Disabled Item',
                disabled: true,
                onSelect: () => alert('This should not fire'),
            },
            {
                id: 'another',
                label: 'Another Enabled',
                onSelect: () => alert('Another'),
            },
        ];
        return (_jsx("div", { className: "p-8 border-2 border-dashed rounded-lg text-center", children: _jsx(ContextMenu, { items: itemsWithDisabled, children: _jsx("div", { className: "p-4 bg-muted rounded-lg inline-block", children: "Right-click for menu with disabled items" }) }) }));
    },
};
export const WithDangerItems = {
    render: () => {
        const itemsWithDanger = [
            {
                id: 'normal',
                label: 'Normal Action',
                onSelect: () => alert('Normal'),
            },
            {
                id: 'separator',
                separator: true,
            },
            {
                id: 'delete',
                label: 'Delete',
                danger: true,
                onSelect: () => alert('Delete clicked'),
            },
            {
                id: 'remove',
                label: 'Remove Permanently',
                danger: true,
                onSelect: () => alert('Remove clicked'),
            },
        ];
        return (_jsx("div", { className: "p-8 border-2 border-dashed rounded-lg text-center", children: _jsx(ContextMenu, { items: itemsWithDanger, children: _jsx("div", { className: "p-4 bg-muted rounded-lg inline-block", children: "Right-click for menu with danger items" }) }) }));
    },
};
//# sourceMappingURL=ContextMenu.stories.js.map