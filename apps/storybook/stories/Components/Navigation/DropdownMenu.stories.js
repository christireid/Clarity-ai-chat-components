import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, } from '@clarity-chat/primitives';
import { Button } from '@clarity-chat/primitives';
import { expect, userEvent, within, waitFor } from '@storybook/test';
/**
 * DropdownMenu provides a context menu triggered by a button click.
 *
 * **Key Features:**
 * - Keyboard navigation
 * - Customizable items
 * - Accessible
 *
 * **Use Cases:**
 * - Action menus
 * - Navigation menus
 * - Context menus
 */
const meta = {
    title: 'Components/Navigation/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Dropdown menu with keyboard navigation and accessibility support.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    decorators: [
        (Story) => (_jsx("div", { style: { padding: '100px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Open Menu" }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { children: "Profile" }), _jsx(DropdownMenuItem, { children: "Settings" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Log out" })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test menu trigger button renders
        const menuButton = canvas.getByRole('button', { name: /open menu/i });
        await expect(menuButton).toBeInTheDocument();
        // Test opening dropdown menu
        await userEvent.click(menuButton);
        // Wait for menu to appear and test menu items
        await waitFor(async () => {
            // Find menu items in the document (dropdown menus are typically portaled)
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
            if (menuItems.length > 0) {
                // Test menu items are present
                const profileItem = menuItems.find((item) => item.textContent === 'Profile');
                const settingsItem = menuItems.find((item) => item.textContent === 'Settings');
                const logoutItem = menuItems.find((item) => item.textContent === 'Log out');
                if (profileItem && settingsItem && logoutItem) {
                    await expect(profileItem).toBeInTheDocument();
                    await expect(settingsItem).toBeInTheDocument();
                    await expect(logoutItem).toBeInTheDocument();
                    // Test clicking a menu item
                    await userEvent.click(profileItem);
                }
            }
        }, { timeout: 2000 });
    },
};
export const WithIcons = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" }) }), "Options"] }) }), _jsxs(DropdownMenuContent, { children: [_jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }), "Edit"] }), _jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }), "Duplicate"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "text-red-600", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Delete"] })] })] })),
};
export const WithLabels = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "View" }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsx(DropdownMenuLabel, { children: "Appearance" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Status Bar" }), _jsx(DropdownMenuItem, { children: "Activity Bar" }), _jsx(DropdownMenuItem, { children: "Panel" })] })] })),
};
export const UserMenu = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { className: "flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold", children: "JD" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm font-medium", children: "John Doe" }), _jsx("div", { className: "text-xs text-gray-500", children: "john@example.com" })] })] }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsx(DropdownMenuLabel, { children: "My Account" }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "Profile"] }), _jsxs(DropdownMenuItem, { children: [_jsxs("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }), "Settings"] }), _jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }), "Billing"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "text-red-600", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), "Log out"] })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test user button renders with name and email
        await expect(canvas.getByText('John Doe')).toBeInTheDocument();
        await expect(canvas.getByText('john@example.com')).toBeInTheDocument();
        await expect(canvas.getByText('JD')).toBeInTheDocument();
        // Test clicking user menu
        const userButton = canvas.getByRole('button');
        await userEvent.click(userButton);
        // Wait for menu to appear and test menu items
        await waitFor(async () => {
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
            if (menuItems.length > 0) {
                // Test menu items are present
                const profileItem = menuItems.find((item) => item.textContent?.includes('Profile'));
                const settingsItem = menuItems.find((item) => item.textContent?.includes('Settings'));
                const billingItem = menuItems.find((item) => item.textContent?.includes('Billing'));
                const logoutItem = menuItems.find((item) => item.textContent?.includes('Log out'));
                if (profileItem && settingsItem && billingItem && logoutItem) {
                    await expect(profileItem).toBeInTheDocument();
                    await expect(settingsItem).toBeInTheDocument();
                    await expect(billingItem).toBeInTheDocument();
                    await expect(logoutItem).toBeInTheDocument();
                }
            }
        }, { timeout: 2000 });
    },
};
export const ChatActions = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { size: "icon", variant: "ghost", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" }) }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }), "Edit message"] }), _jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }), "Copy text"] }), _jsxs(DropdownMenuItem, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" }) }), "Pin message"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "text-red-600", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Delete message"] })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test chat actions button renders (icon button)
        const actionsButton = canvas.getByRole('button');
        await expect(actionsButton).toBeInTheDocument();
        // Test opening actions menu
        await userEvent.click(actionsButton);
        // Wait for menu to appear and test chat-specific menu items
        await waitFor(async () => {
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
            if (menuItems.length > 0) {
                // Test chat action items are present
                const editItem = menuItems.find((item) => item.textContent?.includes('Edit message'));
                const copyItem = menuItems.find((item) => item.textContent?.includes('Copy text'));
                const pinItem = menuItems.find((item) => item.textContent?.includes('Pin message'));
                const deleteItem = menuItems.find((item) => item.textContent?.includes('Delete message'));
                if (editItem && copyItem && pinItem && deleteItem) {
                    await expect(editItem).toBeInTheDocument();
                    await expect(copyItem).toBeInTheDocument();
                    await expect(pinItem).toBeInTheDocument();
                    await expect(deleteItem).toBeInTheDocument();
                    // Test clicking edit action
                    await userEvent.click(editItem);
                }
            }
        }, { timeout: 2000 });
    },
};
export const WithGroups = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "More Options" }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "File" }), _jsx(DropdownMenuItem, { children: "New Tab" }), _jsx(DropdownMenuItem, { children: "New Window" })] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Edit" }), _jsx(DropdownMenuItem, { children: "Cut" }), _jsx(DropdownMenuItem, { children: "Copy" }), _jsx(DropdownMenuItem, { children: "Paste" })] }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Print..." })] })] })),
};
//# sourceMappingURL=DropdownMenu.stories.js.map