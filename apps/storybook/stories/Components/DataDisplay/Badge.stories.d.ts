import type { StoryObj } from '@storybook/react-vite';
/**
 * Badge component for displaying small count indicators, status labels, and tags.
 *
 * **Key Features:**
 * - Multiple variants (default, secondary, destructive, outline)
 * - Compact and readable
 * - Can be used with icons
 *
 * **Use Cases:**
 * - Status indicators
 * - Notification counts
 * - Tags and labels
 * - Category markers
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
        status: {
            type: string;
        };
        badges: string[];
    };
    tags: string[];
    argTypes: {
        variant: {
            control: string;
            options: string[];
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Variants: Story;
export declare const StatusIndicators: Story;
export declare const WithCounts: Story;
export declare const Tags: Story;
export declare const WithIcons: Story;
export declare const Sizes: Story;
export declare const InContext: Story;
//# sourceMappingURL=Badge.stories.d.ts.map