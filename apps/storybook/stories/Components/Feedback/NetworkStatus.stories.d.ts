import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetworkStatus } from '@clarity-chat/react';
/**
 * **NetworkStatus Component**
 *
 * Component for displaying network connection status
 * with latency tracking and reconnection attempts.
 *
 * **Key Features:**
 * - Online/offline status detection
 * - Network latency display
 * - Reconnection attempt tracking
 * - Slow connection detection
 * - Visual status indicators
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Network monitoring
 * - Connection status display
 * - Offline mode indicators
 * - Connection quality feedback
 */
declare const meta: Meta<typeof NetworkStatus>;
export default meta;
type Story = StoryObj<typeof NetworkStatus>;
export declare const Online: Story;
export declare const Offline: Story;
export declare const Slow: Story;
export declare const Reconnecting: Story;
//# sourceMappingURL=NetworkStatus.stories.d.ts.map