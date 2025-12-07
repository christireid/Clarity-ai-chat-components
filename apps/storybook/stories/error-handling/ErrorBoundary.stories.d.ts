import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from '@clarity-chat/error-handling';
declare const meta: Meta<typeof ErrorBoundary>;
export default meta;
type Story = StoryObj<typeof ErrorBoundary>;
export declare const DefaultFallback: Story;
export declare const CustomFallback: Story;
export declare const WithConfigurationError: Story;
export declare const WithAPIError: Story;
export declare const InteractiveTrigger: Story;
export declare const WithErrorCallback: Story;
//# sourceMappingURL=ErrorBoundary.stories.d.ts.map