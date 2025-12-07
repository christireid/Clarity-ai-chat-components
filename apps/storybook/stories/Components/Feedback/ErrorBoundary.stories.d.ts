import type { StoryObj } from '@storybook/react-vite';
/**
 * **ErrorBoundary Component**
 *
 * Production-ready React error boundaries with enhanced reporting
 * and recovery mechanisms.
 *
 * **Key Features:**
 * - Default and custom fallback UIs
 * - Error reporting integration
 * - Reset functionality
 * - Reset keys for automatic recovery
 * - Enhanced error boundary with telemetry
 * - Error context preservation
 *
 * **Use Cases:**
 * - Application-wide error handling
 * - Component-level error boundaries
 * - Error reporting and monitoring
 * - Graceful degradation
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
    };
    tags: string[];
    argTypes: {
        fallback: {
            description: string;
            control: {
                type: string;
            };
        };
        resetKeys: {
            description: string;
            control: {
                type: string;
            };
        };
        onError: {
            description: string;
            action: string;
        };
        onReset: {
            description: string;
            action: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const DefaultFallback: Story;
export declare const CustomFallback: Story;
export declare const EnhancedWithTelemetry: Story;
//# sourceMappingURL=ErrorBoundary.stories.d.ts.map