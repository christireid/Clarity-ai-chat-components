import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        triggerLabel: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        roles: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        defaultRole: {
            control: string;
            description: string;
        };
        onInvite: {
            action: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const CustomRoles: Story;
export declare const SingleRole: Story;
export declare const WithTeamList: Story;
export declare const EnterpriseSetup: Story;
export declare const PermissionLevels: Story;
export declare const InteractiveDemo: Story;
//# sourceMappingURL=SeatInviteDialog.stories.d.ts.map