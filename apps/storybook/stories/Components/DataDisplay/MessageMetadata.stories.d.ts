import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageMetadata } from '@clarity-chat/react';
/**
 * **MessageMetadata Component**
 *
 * Component for displaying message metadata including tokens,
 * cost, response time, model, confidence, and sources.
 *
 * **Key Features:**
 * - Token usage display (input/output)
 * - Cost calculation
 * - Response time tracking
 * - Model information
 * - Confidence scores
 * - Source citations
 * - Expandable details
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Token usage tracking
 * - Cost monitoring
 * - Performance metrics
 * - Model information display
 * - Source attribution
 */
declare const meta: Meta<typeof MessageMetadata>;
export default meta;
type Story = StoryObj<typeof MessageMetadata>;
export declare const FullMetadata: Story;
export declare const MinimalMetadata: Story;
export declare const CostAndTokens: Story;
export declare const PerformanceMetrics: Story;
export declare const ConfidenceScore: Story;
export declare const LowConfidence: Story;
export declare const WithSources: Story;
export declare const CompactMode: Story;
//# sourceMappingURL=MessageMetadata.stories.d.ts.map