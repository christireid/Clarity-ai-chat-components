import type { StoryObj } from '@storybook/react-vite';
/**
 * Input component for text entry with various states and types.
 *
 * **Key Features:**
 * - Multiple input types (text, email, password, number, etc.)
 * - Disabled and readonly states
 * - Error and success states
 * - Icon support
 * - Accessible labels
 *
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Show clear error messages
 * - Use appropriate input types
 * - Provide placeholder text as hints
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
export declare const Types: Story;
export declare const States: Story;
export declare const WithValidation: Story;
export declare const WithIcons: Story;
export declare const Sizes: Story;
export declare const FormExample: Story;
export declare const SearchInput: Story;
//# sourceMappingURL=Input.stories.d.ts.map