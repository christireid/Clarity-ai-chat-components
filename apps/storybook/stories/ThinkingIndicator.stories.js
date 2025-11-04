import { ThinkingIndicator } from '@clarity-chat/react';
const meta = {
    title: 'Components/ThinkingIndicator',
    component: ThinkingIndicator,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Animated thinking indicator showing AI processing stages.',
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
export const Thinking = {
    args: {
        stage: 'thinking',
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
};
//# sourceMappingURL=ThinkingIndicator.stories.js.map