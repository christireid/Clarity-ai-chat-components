import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar } from '@clarity-chat/primitives';
import { expect, within } from 'storybook/test';
/**
 * Avatar component displays user profile pictures with fallback support.
 *
 * **Key Features:**
 * - Automatic fallback to initials
 * - Multiple sizes
 * - Status indicators
 * - Accessible with proper labels
 *
 * **Best Practices:**
 * - Always provide alt text for images
 * - Use initials as fallback
 * - Consider color contrast for text
 */
const meta = {
    title: 'Components/DataDisplay/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Display user or bot avatars with automatic fallbacks and status indicators.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
};
export default meta;
export const Default = {
    args: {
        src: 'https://github.com/shadcn.png',
        alt: 'User avatar',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test avatar image renders with correct alt text
        const avatar = canvas.getByRole('img', { name: /user avatar/i });
        await expect(avatar).toBeInTheDocument();
        await expect(avatar).toHaveAttribute('alt', 'User avatar');
    },
};
export const WithFallback = {
    args: {
        src: 'invalid-url',
        alt: 'John Doe',
        fallback: 'JD',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test fallback text displays when image fails to load
        await expect(canvas.getByText(/JD/i)).toBeInTheDocument();
    },
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-end gap-4", children: [_jsx(Avatar, { size: "xs", src: "https://github.com/shadcn.png", alt: "Extra Small" }), _jsx(Avatar, { size: "sm", src: "https://github.com/shadcn.png", alt: "Small" }), _jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Default" }), _jsx(Avatar, { size: "lg", src: "https://github.com/shadcn.png", alt: "Large" }), _jsx(Avatar, { size: "xl", src: "https://github.com/shadcn.png", alt: "Extra Large" }), _jsx(Avatar, { size: "2xl", src: "https://github.com/shadcn.png", alt: "2X Large" })] })),
};
export const ChatParticipants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "John Doe" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "John Doe" }), _jsx("div", { className: "text-sm text-gray-500", children: "Software Engineer" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { fallback: "AI", alt: "AI Assistant" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "AI Assistant" }), _jsx("div", { className: "text-sm text-gray-500", children: "Always ready to help" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { src: "https://github.com/vercel.png", alt: "Support Bot", fallback: "SB" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Support Bot" }), _jsx("div", { className: "text-sm text-gray-500", children: "Customer Support" })] })] })] })),
};
export const WithStatus = {
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Online user", status: "online" }), _jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Away user", status: "away" }), _jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Busy user", status: "busy" }), _jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Offline user", status: "offline" })] })),
};
export const AvatarGroup = {
    render: () => (_jsxs("div", { className: "flex -space-x-2", children: [_jsx(Avatar, { size: "lg", src: "https://github.com/shadcn.png", alt: "User 1", className: "ring-2 ring-white" }), _jsx(Avatar, { size: "lg", src: "https://github.com/vercel.png", alt: "User 2", className: "ring-2 ring-white" }), _jsx(Avatar, { size: "lg", fallback: "U3", alt: "User 3", className: "ring-2 ring-white" }), _jsx(Avatar, { size: "lg", fallback: "+5", alt: "+5 more", className: "ring-2 ring-white bg-gray-200" })] })),
};
export const BotAvatars = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsx(Avatar, { fallback: "\uD83E\uDD16", alt: "Bot" }), _jsx(Avatar, { fallback: "\u26A1", alt: "Fast Bot" }), _jsx(Avatar, { fallback: "\uD83C\uDF1F", alt: "Premium Bot" }), _jsx(Avatar, { fallback: "\uD83D\uDE80", alt: "Rocket Bot" })] })),
};
export const Hoverable = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Hoverable", hoverable: true }), _jsx(Avatar, { fallback: "AI", alt: "Hoverable AI", hoverable: true })] })),
};
export const OnlyFallback = {
    args: {
        fallback: 'AB',
        alt: 'Alice Brown',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test avatar displays fallback text
        await expect(canvas.getByText(/AB/i)).toBeInTheDocument();
    },
};
//# sourceMappingURL=Avatar.stories.js.map