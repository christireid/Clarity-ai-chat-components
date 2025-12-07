import type { StoryObj } from '@storybook/react-vite';
/**
 * DropdownMenu provides a context menu triggered by a button click.
 *
 * **Key Features:**
 * - Keyboard navigation
 * - Customizable items
 * - Accessible
 *
 * **Use Cases:**
 * - Action menus
 * - Navigation menus
 * - Context menus
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
export declare const WithIcons: Story;
export declare const WithLabels: Story;
export declare const UserMenu: Story;
export declare const ChatActions: Story;
export declare const WithGroups: Story;
//# sourceMappingURL=DropdownMenu.stories.d.ts.map