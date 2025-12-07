import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Primitives/Button/Essentials',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The Button component is a versatile, accessible button with multiple variants
and states. This track shows the essential patterns you'll use in 90% of cases.

## When to Use Button

- ✅ User actions (submit, cancel, confirm)
- ✅ Navigation (links styled as buttons)
- ✅ Destructive actions (delete, remove)
- ✅ Secondary actions (cancel, back)

## Key Features

- **Variants** - Default, destructive, outline, secondary, ghost, link
- **Sizes** - Default, sm, lg, icon
- **States** - Loading, disabled, success, error
- **Accessibility** - WCAG AAA compliant
        `,
            },
        },
    },
    argTypes: {
        variant: {
            description: 'Button visual style',
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            description: 'Button size',
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
        },
        loading: {
            description: 'Show loading spinner',
            control: { type: 'boolean' },
        },
        disabled: {
            description: 'Disable button interaction',
            control: { type: 'boolean' },
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: 'Button',
        variant: 'default',
    },
    parameters: {
        docs: {
            description: {
                story: `
The default button style. Use for primary actions.

**When to Use:**
- Primary actions (Submit, Save, Continue)
- Important user actions
- Call-to-action buttons
        `,
            },
        },
    },
};
export const Destructive = {
    args: {
        children: 'Delete',
        variant: 'destructive',
    },
    parameters: {
        docs: {
            description: {
                story: `
Destructive variant for dangerous actions. Use sparingly and with caution.

**When to Use:**
- Delete actions
- Remove actions
- Irreversible operations

**Best Practice:** Always confirm destructive actions.
        `,
            },
        },
    },
};
export const Outline = {
    args: {
        children: 'Cancel',
        variant: 'outline',
    },
    parameters: {
        docs: {
            description: {
                story: `
Outline variant for secondary actions. Less prominent than default.

**When to Use:**
- Cancel actions
- Secondary options
- Alternative actions
        `,
            },
        },
    },
};
export const Secondary = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
    parameters: {
        docs: {
            description: {
                story: `
Secondary variant for less prominent actions.

**When to Use:**
- Secondary actions
- Alternative options
- Less important actions
        `,
            },
        },
    },
};
export const Loading = {
    args: {
        children: 'Loading...',
        loading: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Loading state shows a spinner and disables interaction. Use during async operations.

**Usage:**
1. Set \`loading={true}\` when operation starts
2. Set \`loading={false}\` when operation completes
3. Button automatically disables during loading
        `,
            },
        },
    },
};
export const Disabled = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Disabled state prevents interaction. Use when action is not available.

**When to Use:**
- Form validation (disable until valid)
- Permission restrictions
- Conditional availability
        `,
            },
        },
    },
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { size: "sm", children: "Small" }), _jsx(Button, { children: "Default" }), _jsx(Button, { size: "lg", children: "Large" })] })),
    parameters: {
        docs: {
            description: {
                story: `
Different button sizes for various contexts. Use appropriately for your layout.

**Sizes:**
- **sm** - Compact spaces, dense layouts
- **default** - Standard size, most common
- **lg** - Prominent actions, hero sections
        `,
            },
        },
    },
};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "default", children: "Default" }), _jsx(Button, { variant: "destructive", children: "Destructive" }), _jsx(Button, { variant: "outline", children: "Outline" }), _jsx(Button, { variant: "secondary", children: "Secondary" }), _jsx(Button, { variant: "ghost", children: "Ghost" }), _jsx(Button, { variant: "link", children: "Link" })] })),
    parameters: {
        docs: {
            description: {
                story: `
All button variants. Choose the appropriate variant for your use case.

**Variants:**
- **default** - Primary actions
- **destructive** - Dangerous actions
- **outline** - Secondary actions
- **secondary** - Less prominent actions
- **ghost** - Subtle actions
- **link** - Link-styled buttons
        `,
            },
        },
    },
};
//# sourceMappingURL=Essentials.stories.js.map