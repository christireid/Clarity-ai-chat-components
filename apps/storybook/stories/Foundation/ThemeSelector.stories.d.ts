import type { StoryObj } from '@storybook/react-vite';
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
    argTypes: {
        orientation: {
            control: string;
            options: string[];
        };
        showPreview: {
            control: string;
        };
    };
    args: {
        orientation: string;
        showPreview: boolean;
    };
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Gallery: Story;
export declare const Horizontal: Story;
export declare const DropdownAndSelector: Story;
//# sourceMappingURL=ThemeSelector.stories.d.ts.map