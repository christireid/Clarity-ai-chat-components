/**
 * Voice recognition state
 */
export interface VoiceInputState {
    /** Whether voice recognition is currently listening */
    isListening: boolean;
    /** Current transcript (interim + final) */
    transcript: string;
    /** Final transcript (confirmed text) */
    finalTranscript: string;
    /** Interim transcript (real-time, may change) */
    interimTranscript: string;
    /** Whether speech recognition is supported */
    isSupported: boolean;
    /** Error message if any */
    error: string | null;
    /** Confidence score (0-1) of last recognition */
    confidence: number;
}
/**
 * Voice recognition options
 */
export interface UseVoiceInputOptions {
    /** Language code (e.g., 'en-US', 'es-ES') */
    lang?: string;
    /** Continuous listening mode */
    continuous?: boolean;
    /** Return interim results */
    interimResults?: boolean;
    /** Maximum alternatives to return */
    maxAlternatives?: number;
    /** Auto-stop after silence (ms) */
    autoStopTimeout?: number;
    /** Callback when transcript updates */
    onTranscript?: (transcript: string, isFinal: boolean) => void;
    /** Callback when speech starts */
    onSpeechStart?: () => void;
    /** Callback when speech ends */
    onSpeechEnd?: () => void;
    /** Callback on error */
    onError?: (error: string) => void;
}
/**
 * Production-ready voice input hook with Web Speech API.
 *
 * **Features:**
 * - Real-time speech-to-text
 * - Continuous and single-shot modes
 * - Interim and final transcripts
 * - Multi-language support
 * - Confidence scores
 * - Auto-stop on silence
 * - Browser compatibility detection
 *
 * **Browser Support:**
 * - ✅ Chrome/Edge (best support)
 * - ✅ Safari (iOS 14.5+, macOS 14.3+)
 * - ❌ Firefox (not yet supported)
 * - ❌ Mobile Firefox/Samsung Internet
 *
 * **Use Cases:**
 * - Voice-to-text input for chat
 * - Voice commands
 * - Accessibility features
 * - Hands-free operation
 *
 * @example
 * ```tsx
 * // Basic usage
 * function VoiceButton() {
 *   const {
 *     isListening,
 *     transcript,
 *     startListening,
 *     stopListening,
 *     isSupported
 *   } = useVoiceInput()
 *
 *   if (!isSupported) {
 *     return <div>Voice input not supported</div>
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={isListening ? stopListening : startListening}>
 *         {isListening ? 'Stop' : 'Start'} Listening
 *       </button>
 *       <p>{transcript}</p>
 *     </div>
 *   )
 * }
 *
 * // Continuous mode with callbacks
 * function VoiceChat() {
 *   const [messages, setMessages] = useState<string[]>([])
 *
 *   const voice = useVoiceInput({
 *     continuous: true,
 *     interimResults: true,
 *     onTranscript: (text, isFinal) => {
 *       if (isFinal) {
 *         setMessages(prev => [...prev, text])
 *       }
 *     }
 *   })
 *
 *   return <div>...</div>
 * }
 *
 * // Multi-language support
 * function MultilingualVoice() {
 *   const [lang, setLang] = useState('en-US')
 *
 *   const voice = useVoiceInput({
 *     lang,
 *     continuous: true,
 *     autoStopTimeout: 3000
 *   })
 *
 *   return (
 *     <div>
 *       <select value={lang} onChange={e => setLang(e.target.value)}>
 *         <option value="en-US">English (US)</option>
 *         <option value="es-ES">Spanish</option>
 *         <option value="fr-FR">French</option>
 *         <option value="zh-CN">Chinese</option>
 *       </select>
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useVoiceInput(options?: UseVoiceInputOptions): {
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    /** Whether voice recognition is currently listening */
    isListening: boolean;
    /** Current transcript (interim + final) */
    transcript: string;
    /** Final transcript (confirmed text) */
    finalTranscript: string;
    /** Interim transcript (real-time, may change) */
    interimTranscript: string;
    /** Whether speech recognition is supported */
    isSupported: boolean;
    /** Error message if any */
    error: string | null;
    /** Confidence score (0-1) of last recognition */
    confidence: number;
};
/**
 * Simplified voice input hook for basic use cases
 * Automatically manages start/stop state
 */
export declare function useSimpleVoiceInput(lang?: string): {
    isActive: boolean;
    transcript: string;
    toggle: () => void;
    isSupported: boolean;
    error: string | null;
};
//# sourceMappingURL=use-voice-input.d.ts.map