import { ThemePreview } from '@clarity-chat/react';
const meta = {
    title: 'Foundation/ThemePreview',
    component: ThemePreview,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Live preview and editor for theme tokens. Mirrors the approach used in Adobe Spectrum and Lightning Design System storybooks—great for design/dev collaboration during theming workshops.',
            },
        },
    },
    argTypes: {
        showEditor: { control: 'boolean' },
    },
    args: {
        showEditor: true,
    },
    tags: ['autodocs'],
};
export default meta;
export const Playground = {};
export const PreviewOnly = {
    args: {
        showEditor: false,
    },
};
//# sourceMappingURL=ThemePreview.stories.js.map