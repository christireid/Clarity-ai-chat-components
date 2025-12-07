import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
        layout: string;
    };
    argTypes: {
        placeholder: {
            control: string;
        };
    };
    args: {
        placeholder: string;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithSuspenseBoundary: Story;
//# sourceMappingURL=MessageSearch.stories.d.ts.map