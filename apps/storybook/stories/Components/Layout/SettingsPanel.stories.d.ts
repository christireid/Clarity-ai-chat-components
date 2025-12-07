import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        onUpdate: {
            action: string;
        };
        onReset: {
            action: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const CasualTone: Story;
export declare const TechnicalTone: Story;
export declare const DarkTheme: Story;
export declare const PrivacyFocused: Story;
export declare const NotificationsOff: Story;
export declare const CompactMode: Story;
//# sourceMappingURL=SettingsPanel.stories.d.ts.map