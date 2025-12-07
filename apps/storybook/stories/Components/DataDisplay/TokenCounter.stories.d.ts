import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenCounter } from '@clarity-chat/react/components/token-counter';
/**
 * **TokenCounter Component**
 *
 * Component for displaying token usage with cost tracking
 * and limit warnings.
 *
 * **Key Features:**
 * - Token count display
 * - Maximum token limit
 * - Cost calculation
 * - Visual warnings when near/over limit
 * - Progress indicator
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Token usage tracking
 * - Cost monitoring
 * - Limit enforcement
 * - Budget management
 */
declare const meta: Meta<typeof TokenCounter>;
export default meta;
type Story = StoryObj<typeof TokenCounter>;
export declare const Default: Story;
export declare const NearLimit: Story;
export declare const OverLimit: Story;
//# sourceMappingURL=TokenCounter.stories.d.ts.map