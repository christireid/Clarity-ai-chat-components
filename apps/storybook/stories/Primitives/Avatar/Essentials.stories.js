import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar } from '@clarity-chat/primitives';
const meta = {
    title: 'Primitives/Avatar/Essentials',
    component: Avatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The Avatar component displays user profile pictures with automatic fallback
support. This track shows the essential patterns you'll use in 90% of cases.

## When to Use Avatar

- ✅ User profile pictures
- ✅ Bot/assistant avatars
- ✅ Chat participants
- ✅ User lists

## Key Features

- **Automatic Fallback** - Falls back to initials if image fails
- **Multiple Sizes** - xs, sm, default, lg, xl, 2xl
- **Status Indicators** - Show online/offline status
- **Accessibility** - WCAG AAA compliant
        `,
            },
        },
    },
    argTypes: {
        src: {
            description: 'Image source URL',
            control: { type: 'text' },
        },
        alt: {
            description: 'Alt text for accessibility',
            control: { type: 'text' },
        },
        fallback: {
            description: 'Fallback text (usually initials)',
            control: { type: 'text' },
        },
        size: {
            description: 'Avatar size',
            control: 'select',
            options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
        },
    },
};
export default meta;
export const WithImage = {
    args: {
        src: 'https://github.com/shadcn.png',
        alt: 'User avatar',
    },
    parameters: {
        docs: {
            description: {
                story: `
Avatar with image. The most common pattern.

**Key Points:**
- Always provide alt text
- Use high-quality images
- Ensure images are square (1:1 aspect ratio)

This pattern works for 90% of use cases.
        `,
            },
        },
    },
};
export const WithFallback = {
    args: {
        src: 'invalid-url',
        alt: 'John Doe',
        fallback: 'JD',
    },
    parameters: {
        docs: {
            description: {
                story: `
Avatar with fallback initials. Automatically shows when image fails to load.

**Best Practice:** Always provide fallback initials for better UX.

**Usage:**
- Extract initials from user name
- Use 1-2 characters
- Ensure good contrast
        `,
            },
        },
    },
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-end gap-4", children: [_jsx(Avatar, { size: "xs", src: "https://github.com/shadcn.png", alt: "Extra Small" }), _jsx(Avatar, { size: "sm", src: "https://github.com/shadcn.png", alt: "Small" }), _jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "Default" }), _jsx(Avatar, { size: "lg", src: "https://github.com/shadcn.png", alt: "Large" }), _jsx(Avatar, { size: "xl", src: "https://github.com/shadcn.png", alt: "Extra Large" }), _jsx(Avatar, { size: "2xl", src: "https://github.com/shadcn.png", alt: "2X Large" })] })),
    parameters: {
        docs: {
            description: {
                story: `
Different avatar sizes for various contexts.

**Sizes:**
- **xs** - Compact lists, notifications
- **sm** - Small lists, inline avatars
- **default** - Standard size, most common
- **lg** - Profile pages, headers
- **xl** - Hero sections, prominent displays
- **2xl** - Large displays, featured content
        `,
            },
        },
    },
};
export const ChatParticipants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { src: "https://github.com/shadcn.png", alt: "John Doe" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "John Doe" }), _jsx("div", { className: "text-sm text-gray-500", children: "Software Engineer" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { fallback: "AI", alt: "AI Assistant" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "AI Assistant" }), _jsx("div", { className: "text-sm text-gray-500", children: "Always ready to help" })] })] })] })),
    parameters: {
        docs: {
            description: {
                story: `
Common pattern for chat participants. Shows avatar with user information.

**Pattern:**
- Avatar on the left
- Name and description on the right
- Consistent spacing
- Clear hierarchy
        `,
            },
        },
    },
};
export const InitialsOnly = {
    args: {
        alt: 'Jane Smith',
        fallback: 'JS',
    },
    parameters: {
        docs: {
            description: {
                story: `
Avatar with only initials (no image). Use when user hasn't uploaded a picture.

**Best Practice:** Extract initials from user's name automatically.
        `,
            },
        },
    },
};
//# sourceMappingURL=Essentials.stories.js.map