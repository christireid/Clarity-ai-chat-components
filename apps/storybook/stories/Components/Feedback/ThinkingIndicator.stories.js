import { ThinkingIndicator } from '@clarity-chat/react';
import { expect, within } from '@storybook/test';
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
const meta = {
    title: 'Components/Feedback/ThinkingIndicator',
    component: ThinkingIndicator,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Animated thinking indicator showing AI processing stages
with progress tracking and estimated time.

## Features

- ✅ Multiple thinking stages (thinking, researching, compiling, generating, finalizing)
- ✅ Progress percentage display
- ✅ Estimated time remaining
- ✅ Topic and detail text
- ✅ Smooth animations
- ✅ Accessible with ARIA labels
- ✅ Visual feedback for different stages

## Basic Usage

\`\`\`tsx
<ThinkingIndicator
  stage="generating"
  progress={65}
  estimatedTime={10}
  topic="React Tutorial"
  detail="Creating code examples"
/>
\`\`\`
        `,
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    argTypes: {
        stage: {
            description: 'Current thinking stage',
            control: 'select',
            options: ['thinking', 'researching', 'compiling', 'generating', 'finalizing'],
        },
        progress: {
            description: 'Progress percentage (0-100)',
            control: { type: 'number', min: 0, max: 100 },
        },
        estimatedTime: {
            description: 'Estimated time remaining in seconds',
            control: { type: 'number', min: 0, max: 300 },
        },
        topic: {
            description: 'Topic or subject being processed',
            control: 'text',
        },
        detail: {
            description: 'Additional detail about current operation',
            control: 'text',
        },
    },
};
export default meta;
export const Thinking = {
    args: {
        stage: 'thinking',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test thinking indicator renders
        const indicator = canvas.getByRole('status');
        await expect(indicator).toBeInTheDocument();
        // Test thinking stage is displayed
        await expect(canvas.getByText(/thinking/i)).toBeInTheDocument();
    },
};
export const Researching = {
    args: {
        stage: 'researching',
        topic: 'React hooks documentation',
    },
};
export const Compiling = {
    args: {
        stage: 'compiling',
        detail: 'Analyzing code patterns',
    },
};
export const Generating = {
    args: {
        stage: 'generating',
        progress: 65,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test generating stage is displayed
        await expect(canvas.getByText(/generating/i)).toBeInTheDocument();
        // Test progress percentage is displayed
        await expect(canvas.getByText(/65%/)).toBeInTheDocument();
    },
};
export const Finalizing = {
    args: {
        stage: 'finalizing',
        progress: 95,
        estimatedTime: 5,
    },
};
export const WithAllDetails = {
    args: {
        stage: 'generating',
        topic: 'Comprehensive React Tutorial',
        detail: 'Creating detailed examples with code',
        progress: 50,
        estimatedTime: 15,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test stage is displayed
        await expect(canvas.getByText(/generating/i)).toBeInTheDocument();
        // Test topic is displayed
        await expect(canvas.getByText('Comprehensive React Tutorial')).toBeInTheDocument();
        // Test detail is displayed
        await expect(canvas.getByText('Creating detailed examples with code')).toBeInTheDocument();
        // Test progress percentage is displayed
        await expect(canvas.getByText(/50%/)).toBeInTheDocument();
        // Test estimated time is displayed (15 seconds)
        await expect(canvas.getByText(/15/)).toBeInTheDocument();
    },
};
//# sourceMappingURL=ThinkingIndicator.stories.js.map