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
        providerName: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        steps: {
            control: string;
            description: string;
        };
        metadata: {
            control: string;
            description: string;
        };
        notes: {
            control: string;
            description: string;
        };
        onNotesChange: {
            action: string;
            description: string;
        };
        onDownloadMetadata: {
            action: string;
            description: string;
        };
        onSubmit: {
            action: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const OktaConfiguration: Story;
export declare const AzureADConfiguration: Story;
export declare const Auth0Configuration: Story;
export declare const AllPending: Story;
export declare const InProgress: Story;
export declare const AllComplete: Story;
export declare const InteractiveSetup: Story;
export declare const CompleteIntegrationFlow: Story;
export declare const MultiProviderDashboard: Story;
//# sourceMappingURL=SSOConfigWizard.stories.d.ts.map