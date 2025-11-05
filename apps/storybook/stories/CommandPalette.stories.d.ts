import type { StoryObj } from '@storybook/react';
/**
 * Command Palette
 *
 * **A powerful command interface for:**
 * - Quick actions and navigation
 * - Keyboard-first workflows
 * - Search and discovery
 * - Command execution
 * - Productivity shortcuts
 *
 * **Key Features:**
 * - Fuzzy search across commands
 * - Keyboard navigation (↑↓ arrows, Enter, Esc)
 * - Category grouping
 * - Keyboard shortcuts display
 * - Custom icons
 * - Fast and responsive
 *
 * **Design Philosophy:**
 * - Speed: Access any action instantly
 * - Discoverability: Find commands by searching
 * - Keyboard-First: Designed for power users
 * - Beautiful: Smooth animations and modern design
 */
declare const meta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    argTypes: {
        open: {
            control: string;
            description: string;
        };
        placeholder: {
            control: string;
            description: string;
        };
        items: {
            control: boolean;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithCategories: Story;
export declare const SearchDemo: Story;
export declare const KeyboardShortcuts: Story;
export declare const ChatApplication: Story;
export declare const ThemeSwitch: Story;
export declare const QuickActions: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=CommandPalette.stories.d.ts.map