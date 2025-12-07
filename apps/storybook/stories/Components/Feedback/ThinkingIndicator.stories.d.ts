import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThinkingIndicator } from '@clarity-chat/react';
/**
 * **ThinkingIndicator Component**
 *
 * Animated thinking indicator showing AI processing stages
 * with progress tracking and estimated time.
 *
 * **Key Features:**
 * - Multiple thinking stages (thinking, researching, compiling, generating, finalizing)
 * - Progress percentage display
 * - Estimated time remaining
 * - Topic and detail text
 * - Smooth animations
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - AI response generation
 * - Long-running operations
 * - Processing indicators
 * - Status feedback
 */
declare const meta: Meta<typeof ThinkingIndicator>;
export default meta;
type Story = StoryObj<typeof ThinkingIndicator>;
export declare const Thinking: Story;
export declare const Researching: Story;
export declare const Compiling: Story;
export declare const Generating: Story;
export declare const Finalizing: Story;
export declare const WithAllDetails: Story;
//# sourceMappingURL=ThinkingIndicator.stories.d.ts.map