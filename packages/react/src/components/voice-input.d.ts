import * as React from 'react';
/**
 * Voice input component props
 */
export interface VoiceInputProps {
    /** Callback when transcript is finalized */
    onTranscript: (transcript: string) => void;
    /** Language code (e.g., 'en-US', 'es-ES') */
    lang?: string;
    /** Show real-time interim results */
    showInterim?: boolean;
    /** Auto-submit on speech end */
    autoSubmit?: boolean;
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'ghost';
    /** Custom icon when not listening */
    icon?: React.ReactNode;
    /** Custom icon when listening */
    listeningIcon?: React.ReactNode;
    /** Show tooltip */
    showTooltip?: boolean;
    /** Tooltip text */
    tooltipText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Custom CSS class */
    className?: string;
    /** Callback when listening starts */
    onStart?: () => void;
    /** Callback when listening stops */
    onStop?: () => void;
    /** Callback on error */
    onError?: (error: string) => void;
}
/**
 * Production-ready Voice Input component with Web Speech API.
 *
 * **Features:**
 * - One-click voice recording
 * - Real-time transcription display
 * - Visual feedback (pulse animation)
 * - Auto-submit on speech end
 * - Multi-language support
 * - Error handling with user feedback
 * - Accessibility support
 *
 * **Use Cases:**
 * - Voice message input
 * - Hands-free chat
 * - Accessibility feature
 * - Mobile-friendly input
 *
 * @example
 * ```tsx
 * // Basic usage
 * <VoiceInput
 *   onTranscript={(text) => {
 *     console.log('Voice input:', text)
 *     sendMessage(text)
 *   }}
 * />
 *
 * // With custom styling
 * <VoiceInput
 *   onTranscript={handleVoiceInput}
 *   size="lg"
 *   variant="primary"
 *   showInterim={true}
 *   autoSubmit={true}
 * />
 *
 * // Multi-language
 * <VoiceInput
 *   onTranscript={handleInput}
 *   lang="es-ES"
 *   tooltipText="Habla en español"
 * />
 *
 * // With callbacks
 * <VoiceInput
 *   onTranscript={handleInput}
 *   onStart={() => console.log('Started listening')}
 *   onStop={() => console.log('Stopped listening')}
 *   onError={(err) => console.error('Voice error:', err)}
 * />
 * ```
 */
export declare function VoiceInput({ onTranscript, lang, showInterim, autoSubmit, size, variant, icon, listeningIcon, showTooltip, tooltipText, disabled, className, onStart, onStop, onError, }: VoiceInputProps): import("react/jsx-runtime").JSX.Element;
/**
 * Inline voice input component
 * Integrates with text input fields
 */
export interface InlineVoiceInputProps {
    /** Current input value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
    /** Language code */
    lang?: string;
    /** Show in input field */
    position?: 'inside' | 'outside';
    /** Custom CSS class */
    className?: string;
}
export declare function InlineVoiceInput({ value, onChange, lang, position, className, }: InlineVoiceInputProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=voice-input.d.ts.map