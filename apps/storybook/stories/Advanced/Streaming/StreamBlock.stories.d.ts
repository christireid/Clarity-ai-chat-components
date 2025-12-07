import type { StoryObj } from '@storybook/react-vite';
/**
 * **StreamBlock Component**
 *
 * A flexible component for rendering streaming content from various sources.
 *
 * **Key Features:**
 * - Supports multiple stream sources (StreamableValue, async iterable, promise, ReadableStream)
 * - Append or replace accumulation modes
 * - Custom render functions
 * - Error handling with fallbacks
 * - Live streaming indicator
 * - Accessible with ARIA attributes
 *
 * **Use Cases:**
 * - AI chat streaming responses
 * - Real-time data feeds
 * - Progressive content loading
 * - Streaming API responses
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
        mode: {
            control: string;
            options: string[];
            description: string;
        };
        spacing: {
            control: string;
            options: string[];
            description: string;
        };
        showIndicator: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const BasicUsage: Story;
export declare const WithAsyncIterable: Story;
export declare const ReplaceMode: Story;
export declare const ErrorHandling: Story;
export declare const SpacingOptions: Story;
export declare const CustomElement: Story;
//# sourceMappingURL=StreamBlock.stories.d.ts.map