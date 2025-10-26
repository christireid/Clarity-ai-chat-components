/**
 * AI Features System
 * 
 * Complete AI functionality for chat applications:
 * - Smart suggestions (quick replies, completions, commands)
 * - Content moderation (profanity, PII, toxicity)
 * - Sentiment analysis
 * 
 * @example
 * ```tsx
 * import { 
 *   AIProvider,
 *   useAI,
 *   useSuggestions,
 *   useModeration,
 *   createQuickReplyProvider,
 *   createProfanityFilter,
 * } from '@/ai'
 * 
 * // Setup
 * const quickReplies = createQuickReplyProvider([
 *   { text: 'Yes', triggers: ['?'] },
 *   { text: 'No', triggers: ['?'] },
 *   { text: 'Maybe', triggers: ['?'] }
 * ])
 * 
 * const moderation = createProfanityFilter()
 * 
 * <AIProvider
 *   config={{
 *     enableSuggestions: true,
 *     enableModeration: true,
 *     suggestionProviders: [quickReplies],
 *     moderationProvider: moderation,
 *   }}
 * >
 *   <App />
 * </AIProvider>
 * 
 * // Usage
 * function ChatInput() {
 *   const [input, setInput] = useState('')
 *   const { suggestions } = useSuggestions({ input })
 *   const { moderateMessage } = useModeration()
 *   
 *   const handleSubmit = async () => {
 *     const result = await moderateMessage(input)
 *     if (result.action === 'block') {
 *       alert('Message blocked')
 *       return
 *     }
 *     // Send message
 *   }
 *   
 *   return (
 *     <>
 *       <input value={input} onChange={e => setInput(e.target.value)} />
 *       {suggestions.map(s => (
 *         <button onClick={() => setInput(s.text)}>{s.text}</button>
 *       ))}
 *       <button onClick={handleSubmit}>Send</button>
 *     </>
 *   )
 * }
 * ```
 */

// Core
export * from './types'
export * from './AIProvider'
export * from './providers'
export * from './hooks'
