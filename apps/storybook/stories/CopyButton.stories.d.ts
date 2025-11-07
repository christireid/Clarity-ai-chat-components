import type { StoryObj } from '@storybook/react';
/**
 * Enhanced CopyButton component with success state animation and ripple effect.
 *
 * **Key Features:**
 * - One-click copy to clipboard
 * - Visual success feedback with checkmark
 * - Success state with green color and glow animation
 * - Material Design ripple effect
 * - Accessible with ARIA labels
 * - Customizable text and icons
 * - Icon-only mode for compact layouts
 *
 * **Design Philosophy:**
 * - Delightful by Default: Success animation provides clear feedback
 * - Minimal but Modern: Clean design with purposeful animations
 * - Intuitive: Icon changes from copy to checkmark
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
        text: {
            control: string;
            description: string;
        };
        iconOnly: {
            control: string;
            description: string;
        };
        copyText: {
            control: string;
            description: string;
        };
        copiedText: {
            control: string;
            description: string;
        };
        size: {
            control: string;
            options: string[];
            description: string;
        };
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
export declare const IconOnly: Story;
export declare const CustomText: Story;
export declare const Sizes: Story;
export declare const IconSizes: Story;
export declare const Variants: Story;
export declare const CodeSnippet: Story;
export declare const ShareLink: Story;
export declare const APIKey: Story;
export declare const MessageContent: Story;
export declare const CommandLine: Story;
export declare const MultipleItems: Story;
export declare const WithCallback: Story;
export declare const Accessibility: Story;
export declare const Playground: Story;
//# sourceMappingURL=CopyButton.stories.d.ts.map