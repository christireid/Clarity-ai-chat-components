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
        showEditor: {
            control: string;
        };
    };
    args: {
        showEditor: boolean;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const PreviewOnly: Story;
//# sourceMappingURL=ThemePreview.stories.d.ts.map