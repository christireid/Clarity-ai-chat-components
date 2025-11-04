/**
 * ModelSelector Storybook Stories
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ModelSelector } from './model-selector';
declare const meta: Meta<typeof ModelSelector>;
export default meta;
type Story = StoryObj<typeof ModelSelector>;
export declare const Default: Story;
export declare const WithoutMetrics: Story;
export declare const WithoutDescriptions: Story;
export declare const Disabled: Story;
export declare const OpenAIOnly: Story;
export declare const AnthropicOnly: Story;
export declare const GoogleOnly: Story;
export declare const CustomWidth: Story;
//# sourceMappingURL=model-selector.stories.d.ts.map