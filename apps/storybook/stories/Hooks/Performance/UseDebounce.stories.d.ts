import type { StoryObj } from '@storybook/react-vite';
/**
 * **useDebounce Hook**
 *
 * Hook for debouncing values - only updates after delay has passed
 * since last change. Useful for reducing API calls during rapid input.
 *
 * **Key Features:**
 * - Debounce value updates
 * - Configurable delay
 * - Prevents excessive updates
 * - Automatic cleanup
 *
 * **Use Cases:**
 * - Search input with API calls
 * - Form validation
 * - Auto-save functionality
 * - Filtering large lists
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
export declare const SearchInput: Story;
export declare const AutoSave: Story;
export declare const Filtering: Story;
//# sourceMappingURL=UseDebounce.stories.d.ts.map