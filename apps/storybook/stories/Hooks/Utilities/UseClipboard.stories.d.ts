import type { StoryObj } from '@storybook/react-vite';
/**
 * **useClipboard Hook**
 *
 * Hook for copying text to clipboard with success tracking
 * and automatic reset.
 *
 * **Key Features:**
 * - Copy text to clipboard
 * - Success state tracking
 * - Automatic reset after timeout
 * - Success/error callbacks
 * - Browser compatibility (modern API + fallback)
 *
 * **Use Cases:**
 * - Copy buttons
 * - Share functionality
 * - Code snippet copying
 * - Link copying
 */
declare const meta: {
    title: string;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const BasicUsage: Story;
export declare const CustomTimeout: Story;
export declare const CodeSnippets: Story;
//# sourceMappingURL=UseClipboard.stories.d.ts.map