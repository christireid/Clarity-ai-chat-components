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
    tags: string[];
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Empty: Story;
export declare const CustomEmptyState: Story;
export declare const WithCustomTitle: Story;
export declare const WithTimezone: Story;
export declare const WithClickHandler: Story;
export declare const ManyEntries: Story;
//# sourceMappingURL=AuditLogViewer.stories.d.ts.map