import type { StoryObj } from '@storybook/react-vite';
/**
 * Textarea component for multi-line text input.
 *
 * **Key Features:**
 * - Auto-resizing capability
 * - Character count
 * - Disabled and readonly states
 * - Validation support
 *
 * **Use Cases:**
 * - Message composition
 * - Comments and feedback
 * - Long-form content
 * - Notes and descriptions
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
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithLabel: Story;
export declare const WithRows: Story;
export declare const WithCharacterCount: Story;
export declare const States: Story;
export declare const WithValidation: Story;
export declare const CommentBox: Story;
export declare const MessageComposer: Story;
export declare const AutoGrowing: Story;
//# sourceMappingURL=Textarea.stories.d.ts.map