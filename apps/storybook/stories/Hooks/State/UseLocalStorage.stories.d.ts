import type { StoryObj } from '@storybook/react-vite';
/**
 * **useLocalStorage Hook**
 *
 * Hook for persisting state in localStorage with automatic serialization
 * and cross-tab synchronization.
 *
 * **Key Features:**
 * - Persist state in localStorage
 * - Automatic serialization/deserialization
 * - Cross-tab synchronization
 * - SSR-safe
 * - Custom serializers
 * - Remove functionality
 *
 * **Use Cases:**
 * - Theme preferences
 * - User settings
 * - Form data persistence
 * - Cache management
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
export declare const ThemeStorage: Story;
export declare const UserPreferences: Story;
export declare const FormPersistence: Story;
//# sourceMappingURL=UseLocalStorage.stories.d.ts.map