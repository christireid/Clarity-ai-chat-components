import type { StoryObj } from '@storybook/react-vite';
/**
 * **useClarityObject Hook (Structured Output)**
 *
 * Type-safe structured object generation from AI models.
 *
 * **Key Features:**
 * - Generic type support for type-safe object generation
 * - Streaming and non-streaming modes
 * - Automatic JSON parsing from streams
 * - Error handling and loading states
 * - Input management and reset functionality
 * - Callback support (onFinish, onError, onProgress)
 *
 * **Use Cases:**
 * - Product recommendations
 * - Data extraction
 * - Form generation
 * - Structured data generation
 * - API response formatting
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
export declare const FormGeneration: Story;
export declare const StreamingMode: Story;
//# sourceMappingURL=UseClarityObject.stories.d.ts.map