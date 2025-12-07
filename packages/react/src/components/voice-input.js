'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn } from '@clarity-chat/primitives';
import { useVoiceInput } from '../hooks/use-voice-input';
/**
 * Variant to button variant mapping
 */
const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
};
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
export function VoiceInput({ onTranscript, lang = 'en-US', showInterim = true, autoSubmit = true, size = 'md', variant = 'ghost', icon, listeningIcon, showTooltip = true, tooltipText = 'Click to speak', disabled = false, className = '', onStart, onStop, onError, }) {
    const [showTranscript, setShowTranscript] = React.useState(false);
    const lastFinalTranscriptRef = React.useRef('');
    // React 19: Config object with callbacks - compiler intelligently handles
    // Note: In production, consider keeping useMemo if this causes re-initialization issues
    const voiceConfig = {
        lang,
        continuous: false,
        interimResults: showInterim,
        autoStopTimeout: autoSubmit ? 2000 : 0,
        onTranscript: (text, isFinal) => {
            if (isFinal) {
                lastFinalTranscriptRef.current = text;
                if (autoSubmit) {
                    onTranscript(text);
                    // Reset handled in handleToggle
                }
            }
        },
        onSpeechStart: () => {
            setShowTranscript(true);
            onStart?.();
        },
        onSpeechEnd: () => {
            onStop?.();
        },
        onError: (error) => {
            setShowTranscript(false);
            onError?.(error);
        },
    };
    const voice = useVoiceInput(voiceConfig);
    /**
     * Toggle listening - memoized to prevent recreation
     */
    // React 19: Compiler optimizes - no useCallback needed
    const handleToggle = () => {
        if (voice.isListening) {
            voice.stopListening();
            // Submit final transcript if not auto-submit
            if (!autoSubmit && voice.finalTranscript) {
                onTranscript(voice.finalTranscript);
            }
            setShowTranscript(false);
        }
        else {
            voice.resetTranscript();
            voice.startListening();
        }
    };
    /**
     * Manual submit - memoized to prevent recreation
     */
    // React 19: Compiler optimizes
    const handleSubmit = () => {
        if (voice.transcript) {
            onTranscript(voice.transcript);
            voice.resetTranscript();
            voice.stopListening();
            setShowTranscript(false);
        }
    };
    /**
     * Cancel - memoized to prevent recreation
     */
    // React 19: Compiler optimizes
    const handleCancel = () => {
        voice.stopListening();
        voice.resetTranscript();
        setShowTranscript(false);
    };
    if (!voice.isSupported) {
        return (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-500", children: "Voice input not supported in this browser" }));
    }
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "relative", children: _jsxs(Button, { size: size === 'sm' ? 'icon' : size === 'lg' ? 'lg' : 'icon', variant: variant === 'primary' ? 'default' : variant === 'secondary' ? 'secondary' : 'ghost', onClick: handleToggle, disabled: disabled, className: cn('rounded-full', className), "aria-label": voice.isListening ? 'Stop recording' : tooltipText || 'Start voice input', title: voice.isListening ? 'Stop recording' : tooltipText, children: [voice.isListening && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "absolute inset-0 rounded-full bg-destructive", initial: { scale: 1, opacity: 0.5 }, animate: { scale: 1.8, opacity: 0 }, transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    } }), _jsx(motion.div, { className: "absolute inset-0 rounded-full bg-destructive", initial: { scale: 1, opacity: 0.3 }, animate: { scale: 1.5, opacity: 0 }, transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: 0.5,
                                    } })] })), _jsx("span", { className: "relative z-10", children: voice.isListening
                                ? listeningIcon || (_jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: [_jsx("rect", { x: "7", y: "6", width: "2", height: "8", rx: "1" }), _jsx("rect", { x: "11", y: "6", width: "2", height: "8", rx: "1" })] }))
                                : icon || (_jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: [_jsx("path", { d: "M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" }), _jsx("path", { d: "M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" })] })) })] }) }), _jsx(AnimatePresence, { children: showTranscript && (voice.transcript || voice.isListening) && (_jsxs(motion.div, { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.96 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: "absolute bottom-full right-0 mb-2 min-w-[280px] max-w-md p-4 bg-card/95 border border-border/40 shadow-xl rounded-2xl z-[var(--z-popover)] backdrop-blur-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [voice.isListening && (_jsx(Badge, { variant: "destructive", pulse: true, children: "Recording" })), !voice.isListening && (_jsxs("span", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [_jsx("svg", { className: "h-4 w-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" }) }), "Voice Input"] }))] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: handleCancel, className: "h-6 w-6 p-0", "aria-label": "Cancel", children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), voice.isListening && (_jsx("div", { className: "mb-3 flex items-center justify-center gap-1.5 h-12", children: [...Array(5)].map((_, i) => (_jsx(motion.div, { className: "w-1 bg-destructive rounded-full", animate: {
                                    height: ['12px', '32px', '12px'],
                                }, transition: {
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: [0.25, 0.1, 0.25, 1],
                                    delay: i * 0.1,
                                } }, i))) })), _jsx("div", { className: "mb-3 min-h-[60px] max-h-[120px] overflow-y-auto p-3 bg-muted/30 border border-border/40 rounded-xl", children: voice.transcript ? (_jsxs("p", { className: "text-sm text-foreground", children: [voice.finalTranscript && (_jsx("span", { className: "font-medium", children: voice.finalTranscript })), voice.interimTranscript && (_jsxs("span", { className: "text-muted-foreground italic", children: [' ', voice.interimTranscript] }))] })) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Start speaking..." })) }), voice.error && (_jsx(motion.div, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, className: "mb-3 p-3 bg-destructive/10 border border-destructive/30 rounded-xl", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("svg", { className: "h-4 w-4 text-destructive shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("p", { className: "text-sm text-destructive", children: voice.error })] }) })), !autoSubmit && voice.transcript && (_jsxs("div", { className: "flex gap-2.5", children: [_jsx(Button, { size: "sm", onClick: handleSubmit, className: "flex-1", children: "Send" }), _jsx(Button, { size: "sm", variant: "outline", onClick: handleCancel, children: "Cancel" })] })), voice.confidence > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-border/40 space-y-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Confidence" }), _jsxs(Badge, { variant: voice.confidence >= 0.8
                                                ? 'success'
                                                : voice.confidence >= 0.5
                                                    ? 'warning'
                                                    : 'secondary', children: [Math.round(voice.confidence * 100), "%"] })] }), _jsx("div", { className: "h-2 bg-muted/30 rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-green-500/80 to-green-500 rounded-full", initial: { width: 0 }, animate: { width: `${voice.confidence * 100}%` }, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }) })] }))] })) }), showTooltip && !voice.isListening && !showTranscript && (_jsx("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl", children: tooltipText }))] }));
}
export function InlineVoiceInput({ value, onChange, lang = 'en-US', position = 'inside', className = '', }) {
    const handleTranscript = (transcript) => {
        // Append to existing value or replace
        const newValue = value ? `${value} ${transcript}` : transcript;
        onChange(newValue);
    };
    if (position === 'outside') {
        return (_jsx(VoiceInput, { onTranscript: handleTranscript, lang: lang, size: "md", variant: "ghost", showInterim: true, autoSubmit: true, className: className }));
    }
    return (_jsx("div", { className: `absolute right-2 top-1/2 transform -translate-y-1/2 ${className}`, children: _jsx(VoiceInput, { onTranscript: handleTranscript, lang: lang, size: "sm", variant: "ghost", showInterim: true, autoSubmit: true }) }));
}
//# sourceMappingURL=voice-input.js.map