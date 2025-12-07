import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter, DrawerClose, Button, Badge, } from '@clarity-chat/primitives';
import { expect, userEvent, within, waitFor } from 'storybook/test';
const meta = {
    title: 'Components/Layout/Drawer',
    component: Drawer,
    tags: ['autodocs', 'stable'],
    parameters: {
        docs: {
            description: {
                component: 'A drawer component that slides in from the edge of the screen. Supports left, right, top, and bottom positions with smooth animations, focus trap, and keyboard navigation.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
};
export default meta;
// ============================================================================
// Basic Examples by Side
// ============================================================================
export const RightSide = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Open Right Drawer (Default)" }) }), _jsxs(DrawerContent, { side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Right Drawer" }), _jsx(DrawerDescription, { children: "Slides in from the right side" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This is the default drawer position, commonly used for navigation, settings, or details panels." }) }), _jsxs(DrawerFooter, { children: [_jsx(DrawerClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Close" }) }), _jsx(Button, { children: "Save" })] })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test drawer trigger button renders
        const openButton = canvas.getByRole('button', { name: /open right drawer/i });
        await expect(openButton).toBeInTheDocument();
        // Test opening drawer
        await userEvent.click(openButton);
        // Wait for drawer to appear and test content
        await waitFor(async () => {
            const drawer = document.querySelector('[role="dialog"]');
            if (drawer) {
                const drawerCanvas = within(drawer);
                await expect(drawerCanvas.getByText('Right Drawer')).toBeInTheDocument();
                await expect(drawerCanvas.getByText(/Slides in from the right side/i)).toBeInTheDocument();
                // Test action buttons
                const closeButton = drawerCanvas.getByRole('button', { name: /close/i });
                const saveButton = drawerCanvas.getByRole('button', { name: /save/i });
                await expect(closeButton).toBeInTheDocument();
                await expect(saveButton).toBeInTheDocument();
                // Test closing drawer
                await userEvent.click(closeButton);
            }
        }, { timeout: 2000 });
    },
};
export const LeftSide = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Open Left Drawer" }) }), _jsxs(DrawerContent, { side: "left", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Left Drawer" }), _jsx(DrawerDescription, { children: "Slides in from the left side" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Perfect for navigation menus or sidebars on mobile devices." }) })] })] })),
};
export const TopSide = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Open Top Drawer" }) }), _jsxs(DrawerContent, { side: "top", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Top Drawer" }), _jsx(DrawerDescription, { children: "Slides in from the top" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Useful for notifications, banners, or search interfaces." }) })] })] })),
};
export const BottomSide = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Open Bottom Drawer" }) }), _jsxs(DrawerContent, { side: "bottom", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Bottom Drawer" }), _jsx(DrawerDescription, { children: "Slides in from the bottom" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Great for mobile sheets, quick actions, or additional options." }) })] })] })),
};
// ============================================================================
// Sizes
// ============================================================================
export const SmallSize = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Small Drawer (256px)" }) }), _jsxs(DrawerContent, { size: "sm", side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Small Drawer" }), _jsx(DrawerDescription, { children: "256px width" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Compact drawer for simple content." }) })] })] })),
};
export const MediumSize = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Medium Drawer (320px)" }) }), _jsxs(DrawerContent, { size: "md", side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Medium Drawer" }), _jsx(DrawerDescription, { children: "320px width (default)" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Standard drawer size for most use cases." }) })] })] })),
};
export const LargeSize = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Large Drawer (384px)" }) }), _jsxs(DrawerContent, { size: "lg", side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Large Drawer" }), _jsx(DrawerDescription, { children: "384px width" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Larger drawer for detailed content." }) })] })] })),
};
export const ExtraLargeSize = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Extra Large Drawer (480px)" }) }), _jsxs(DrawerContent, { size: "xl", side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Extra Large Drawer" }), _jsx(DrawerDescription, { children: "480px width" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Extra large for complex layouts." }) })] })] })),
};
export const FullSize = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Full Size Drawer" }) }), _jsxs(DrawerContent, { size: "full", side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Full Size Drawer" }), _jsx(DrawerDescription, { children: "Takes full screen width/height" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Useful for immersive experiences on mobile." }) })] })] })),
};
// ============================================================================
// Real-World Examples
// ============================================================================
export const NavigationDrawer = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "\u2630 Navigation Menu" }) }), _jsxs(DrawerContent, { side: "left", size: "md", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Navigation" }), _jsx(DrawerDescription, { children: "Browse sections" })] }), _jsx(DrawerBody, { children: _jsx("nav", { className: "space-y-1", children: ['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Settings', 'Help'].map((item) => (_jsx("button", { className: "w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm", children: item }, item))) }) })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test navigation menu button renders
        const menuButton = canvas.getByRole('button', { name: /navigation menu/i });
        await expect(menuButton).toBeInTheDocument();
        // Test opening navigation drawer
        await userEvent.click(menuButton);
        // Wait for drawer and test navigation items
        await waitFor(async () => {
            const drawer = document.querySelector('[role="dialog"]');
            if (drawer) {
                const drawerCanvas = within(drawer);
                // Test navigation header
                await expect(drawerCanvas.getByText('Navigation')).toBeInTheDocument();
                await expect(drawerCanvas.getByText('Browse sections')).toBeInTheDocument();
                // Test all navigation items are present
                const navItems = ['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Settings', 'Help'];
                for (const item of navItems) {
                    await expect(drawerCanvas.getByRole('button', { name: item })).toBeInTheDocument();
                }
                // Test clicking a navigation item
                const dashboardButton = drawerCanvas.getByRole('button', { name: 'Dashboard' });
                await userEvent.click(dashboardButton);
            }
        }, { timeout: 2000 });
    },
};
export const SettingsDrawer = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "\u2699\uFE0F Settings" }) }), _jsxs(DrawerContent, { side: "right", size: "lg", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Settings" }), _jsx(DrawerDescription, { children: "Manage your preferences" })] }), _jsxs(DrawerBody, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Appearance" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { className: "text-sm", children: "Dark mode" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox" }), _jsx("span", { className: "text-sm", children: "Reduce animations" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Notifications" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { className: "text-sm", children: "Email notifications" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { className: "text-sm", children: "Push notifications" })] })] })] })] }), _jsxs(DrawerFooter, { children: [_jsx(DrawerClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { children: "Save Changes" })] })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test settings button renders
        const settingsButton = canvas.getByRole('button', { name: /settings/i });
        await expect(settingsButton).toBeInTheDocument();
        // Test opening settings drawer
        await userEvent.click(settingsButton);
        // Wait for drawer and test settings content
        await waitFor(async () => {
            const drawer = document.querySelector('[role="dialog"]');
            if (drawer) {
                const drawerCanvas = within(drawer);
                // Test settings header
                await expect(drawerCanvas.getByText('Settings')).toBeInTheDocument();
                await expect(drawerCanvas.getByText('Manage your preferences')).toBeInTheDocument();
                // Test section headers
                await expect(drawerCanvas.getByText('Appearance')).toBeInTheDocument();
                await expect(drawerCanvas.getByText('Notifications')).toBeInTheDocument();
                // Test checkboxes are present
                const checkboxes = drawerCanvas.getAllByRole('checkbox');
                await expect(checkboxes.length).toBe(4);
                // Test specific checkbox labels
                await expect(drawerCanvas.getByText('Dark mode')).toBeInTheDocument();
                await expect(drawerCanvas.getByText('Email notifications')).toBeInTheDocument();
                // Test action buttons
                const saveButton = drawerCanvas.getByRole('button', { name: /save changes/i });
                const cancelButton = drawerCanvas.getByRole('button', { name: /cancel/i });
                await expect(saveButton).toBeInTheDocument();
                await expect(cancelButton).toBeInTheDocument();
            }
        }, { timeout: 2000 });
    },
};
export const FilterDrawer = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "\uD83D\uDD0D Filters" }) }), _jsxs(DrawerContent, { side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Filter Results" }), _jsx(DrawerDescription, { children: "Refine your search" })] }), _jsxs(DrawerBody, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Status" }), _jsx("div", { className: "space-y-2", children: ['All', 'Active', 'Completed', 'Archived'].map((status) => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "status", defaultChecked: status === 'All' }), _jsx("span", { className: "text-sm", children: status })] }, status))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Priority" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { children: "High" }), _jsx(Badge, { variant: "secondary", children: "Medium" }), _jsx(Badge, { variant: "outline", children: "Low" })] })] })] }), _jsxs(DrawerFooter, { children: [_jsx(Button, { variant: "outline", children: "Reset" }), _jsx(Button, { children: "Apply Filters" })] })] })] })),
};
export const NotificationDrawer = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsxs(Button, { children: ["\uD83D\uDD14 Notifications ", _jsx(Badge, { className: "ml-2", children: "3" })] }) }), _jsxs(DrawerContent, { side: "right", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Notifications" }), _jsx(DrawerDescription, { children: "3 unread notifications" })] }), _jsx(DrawerBody, { className: "space-y-3", children: [
                            { title: 'Components/Layout/Drawer', time: '2 min ago', unread: true },
                            { title: 'Components/Layout/Drawer', time: '1 hour ago', unread: true },
                            { title: 'Components/Layout/Drawer', time: '3 hours ago', unread: true },
                            { title: 'Components/Layout/Drawer', time: '1 day ago', unread: false },
                        ].map((notification, i) => (_jsxs("div", { className: cn('p-3 rounded-lg border', notification.unread && 'bg-primary/5 border-primary/20'), children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("p", { className: "text-sm font-medium", children: notification.title }), notification.unread && (_jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }))] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: notification.time })] }, i))) }), _jsx(DrawerFooter, { children: _jsx(Button, { variant: "outline", className: "w-full", children: "Mark all as read" }) })] })] })),
};
export const MobileSheet = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "Open Mobile Sheet" }) }), _jsxs(DrawerContent, { side: "bottom", size: "lg", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Share Options" }), _jsx(DrawerDescription, { children: "Choose how to share" })] }), _jsx(DrawerBody, { children: _jsx("div", { className: "grid grid-cols-4 gap-4 text-center", children: ['Copy Link', 'Email', 'Twitter', 'Facebook', 'WhatsApp', 'Telegram', 'More'].map((option) => (_jsxs("button", { className: "flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl", children: "\uD83D\uDCE4" }), _jsx("span", { className: "text-xs", children: option })] }, option))) }) })] })] })),
};
// ============================================================================
// Configuration Examples
// ============================================================================
export const NoBackdropBlur = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "No Backdrop Blur" }) }), _jsxs(DrawerContent, { blurBackdrop: false, children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Without Backdrop Blur" }), _jsx(DrawerDescription, { children: "Solid backdrop overlay" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Performance-friendly option." }) })] })] })),
};
export const NoClickOutsideClose = {
    render: () => (_jsxs(Drawer, { children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { children: "No Click Outside Close" }) }), _jsxs(DrawerContent, { closeOnClickOutside: false, children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Click Outside Disabled" }), _jsx(DrawerDescription, { children: "Must use close button or Escape" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "Prevents accidental closes." }) })] })] })),
};
// ============================================================================
// Controlled Example
// ============================================================================
export const ControlledDrawer = {
    render: () => {
        const [open, setOpen] = React.useState(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open" }), _jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Close Programmatically" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Drawer is ", open ? 'open' : 'closed'] }), _jsx(Drawer, { open: open, onOpenChange: setOpen, children: _jsxs(DrawerContent, { children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Controlled Drawer" }), _jsx(DrawerDescription, { children: "State managed externally" })] }), _jsx(DrawerBody, { children: _jsx("p", { className: "text-sm", children: "External state control example." }) })] }) })] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test controlled state indicator shows closed initially
        await expect(canvas.getByText('Drawer is closed')).toBeInTheDocument();
        // Test opening with external button
        const openButton = canvas.getByRole('button', { name: /^open$/i });
        await userEvent.click(openButton);
        // Wait for drawer to appear
        await waitFor(async () => {
            const drawer = document.querySelector('[role="dialog"]');
            if (drawer) {
                const drawerCanvas = within(drawer);
                await expect(drawerCanvas.getByText('Controlled Drawer')).toBeInTheDocument();
                await expect(drawerCanvas.getByText(/State managed externally/i)).toBeInTheDocument();
            }
        }, { timeout: 2000 });
        // Test programmatic close button
        const closeProgrammatically = canvas.getByRole('button', { name: /close programmatically/i });
        await userEvent.click(closeProgrammatically);
        // Verify state indicator updates
        await waitFor(async () => {
            await expect(canvas.getByText('Drawer is closed')).toBeInTheDocument();
        }, { timeout: 1000 });
    },
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
//# sourceMappingURL=Drawer.stories.js.map