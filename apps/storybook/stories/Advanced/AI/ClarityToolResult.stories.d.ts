import type { StoryObj } from '@storybook/react-vite';
/**
 * **ClarityToolResult Component (Tool UI Registry)**
 *
 * Automatic rendering of tool results with custom components.
 *
 * **Key Features:**
 * - Type-safe component mapping
 * - Automatic tool result rendering
 * - Fallback rendering for unregistered tools
 * - Message context integration
 * - Customizable props and styling
 *
 * **Use Cases:**
 * - Weather displays
 * - Search results
 * - Data visualizations
 * - Custom tool outputs
 * - Generative UI patterns
 */
declare const meta: {
    title: string;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const WeatherTool: Story;
export declare const SearchTool: Story;
export declare const CalculatorTool: Story;
export declare const UnregisteredTool: Story;
export declare const CustomFallback: Story;
export declare const WithHeader: Story;
export declare const MultipleTools: Story;
//# sourceMappingURL=ClarityToolResult.stories.d.ts.map