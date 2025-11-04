import { SettingsPanel } from '@clarity-chat/react';
const meta = {
    title: 'Components/SettingsPanel',
    component: SettingsPanel,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onUpdate: { action: 'updated' },
        onReset: { action: 'reset' },
    },
};
export default meta;
const defaultSettings = {
    id: 'user-1',
    userId: 'user-1',
    aiPersonality: {
        tone: 'professional',
        verbosity: 'balanced',
        language: 'en',
        customInstructions: 'Be helpful and concise.',
    },
    uiPreferences: {
        theme: 'light',
        fontSize: 'medium',
        messageLayout: 'bubbles',
        showTimestamps: true,
        showAvatars: true,
        compactMode: false,
        animations: true,
    },
    privacy: {
        saveHistory: true,
        enableAnalytics: true,
        shareUsageData: false,
        allowTelemetry: true,
    },
    notifications: {
        email: true,
        push: false,
        desktop: true,
        sound: true,
        newMessage: true,
        systemUpdates: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};
export const Default = {
    args: {
        settings: defaultSettings,
    },
};
export const CasualTone = {
    args: {
        settings: {
            ...defaultSettings,
            aiPersonality: {
                ...defaultSettings.aiPersonality,
                tone: 'casual',
                verbosity: 'detailed',
                customInstructions: 'Use friendly language and emojis when appropriate.',
            },
        },
    },
};
export const TechnicalTone = {
    args: {
        settings: {
            ...defaultSettings,
            aiPersonality: {
                ...defaultSettings.aiPersonality,
                tone: 'technical',
                verbosity: 'comprehensive',
                customInstructions: 'Provide detailed technical explanations with code examples.',
            },
        },
    },
};
export const DarkTheme = {
    args: {
        settings: {
            ...defaultSettings,
            uiPreferences: {
                ...defaultSettings.uiPreferences,
                theme: 'dark',
                fontSize: 'large',
                messageLayout: 'compact',
            },
        },
    },
};
export const PrivacyFocused = {
    args: {
        settings: {
            ...defaultSettings,
            privacy: {
                saveHistory: false,
                enableAnalytics: false,
                shareUsageData: false,
                allowTelemetry: false,
            },
        },
    },
};
export const NotificationsOff = {
    args: {
        settings: {
            ...defaultSettings,
            notifications: {
                email: false,
                push: false,
                desktop: false,
                sound: false,
                newMessage: false,
                systemUpdates: false,
            },
        },
    },
};
export const CompactMode = {
    args: {
        settings: {
            ...defaultSettings,
            uiPreferences: {
                ...defaultSettings.uiPreferences,
                fontSize: 'small',
                messageLayout: 'compact',
                compactMode: true,
                animations: false,
            },
        },
    },
};
//# sourceMappingURL=SettingsPanel.stories.js.map