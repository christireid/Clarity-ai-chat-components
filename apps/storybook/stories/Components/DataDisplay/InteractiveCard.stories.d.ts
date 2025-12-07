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
        interactive: {
            control: string;
        };
        selected: {
            control: string;
        };
        disabled: {
            control: string;
        };
        hoverIntensity: {
            control: string;
            options: string[];
        };
        showRipple: {
            control: string;
        };
    };
    args: {
        interactive: boolean;
        hoverIntensity: string;
        showRipple: boolean;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const PricingTiles: Story;
export declare const StatesGallery: Story;
//# sourceMappingURL=InteractiveCard.stories.d.ts.map