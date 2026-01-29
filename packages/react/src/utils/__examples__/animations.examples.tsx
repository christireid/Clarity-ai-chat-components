/**
 * Animation Utilities - Usage Examples
 *
 * This file contains practical examples of using the animation utilities
 * in common Clarity Chat scenarios.
 *
 * @module animations.examples
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  fadeIn,
  slideInUp,
  slideInLeft,
  messageEnter,
  thinkingPulse,
  DURATION,
  TRANSITION_PRESETS,
  useMessageAnimation,
  useStreamingAnimation,
  useStatusAnimation,
  useReducedMotion,
  stagger,
} from '../animations'

/**
 * Example 1: Basic Message List with Staggered Animation
 *
 * Shows how to animate a list of messages with stagger effect
 */
export function BasicMessageListExample() {
  const messages = [
    { id: 1, content: 'Hello!' },
    { id: 2, content: 'How are you?' },
    { id: 3, content: 'This is a message' },
  ]

  const containerVariants = stagger(slideInUp, {
    stagger: 0.1,
    delayChildren: 0,
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {messages.map((message) => (
        <motion.div
          key={message.id}
          variants={slideInUp}
          className="p-4 bg-blue-100 rounded"
        >
          {message.content}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * Example 2: Message with Index-Based Stagger
 *
 * Shows how to use the useMessageAnimation hook for automatic
 * staggering based on message index
 */
export function MessageWithIndexStaggerExample() {
  const messages = [
    { id: 1, role: 'user', content: 'What is the weather?' },
    { id: 2, role: 'assistant', content: 'The weather is sunny' },
    { id: 3, role: 'user', content: 'Thanks!' },
  ]

  return (
    <div className="space-y-2">
      {messages.map((message, index) => {
        const { variant, transition } = useMessageAnimation(index, 50)

        return (
          <motion.div
            key={message.id}
            variants={variant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className={`p-4 rounded ${
              message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <strong>{message.role}:</strong> {message.content}
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * Example 3: Streaming Text Animation
 *
 * Shows how to animate text as it streams in with a cursor
 */
export function StreamingTextExample() {
  const [text, setText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)

  const handleStartStream = () => {
    setIsStreaming(true)
    setText('')
    const fullText = 'This is streamed text that appears character by character.'
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)
  }

  const streaming = useStreamingAnimation(isStreaming, true)

  return (
    <div>
      <button
        onClick={handleStartStream}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Start Streaming
      </button>

      <div className="p-4 bg-gray-100 rounded">
        <span>{text}</span>
        <motion.span
          animate={streaming.cursorAnimation}
          className="text-blue-600 font-bold"
        >
          │
        </motion.span>
      </div>
    </div>
  )
}

/**
 * Example 4: Status-Based Animation
 *
 * Shows how to animate based on loading, success, and error states
 */
export function StatusAnimationExample() {
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const { variant, transition } = useStatusAnimation(status, {
    pulse: true,
    scale: true,
  })

  const handleAction = async (newStatus: typeof status) => {
    setStatus('loading')
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus(newStatus)
    // Reset after 2 seconds
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('success')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Trigger Success
        </button>
        <button
          onClick={() => handleAction('error')}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Trigger Error
        </button>
      </div>

      <motion.div
        variants={variant}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className={`p-4 rounded text-center ${
          status === 'success'
            ? 'bg-green-100 text-green-700'
            : status === 'error'
              ? 'bg-red-100 text-red-700'
              : status === 'loading'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100'
        }`}
      >
        {status === 'idle' && 'Click a button to see animation'}
        {status === 'loading' && 'Processing...'}
        {status === 'success' && 'Success!'}
        {status === 'error' && 'Error occurred'}
      </motion.div>
    </div>
  )
}

/**
 * Example 5: Thinking Indicator with Pulse
 *
 * Shows how to use the thinkingPulse animation for loading states
 */
export function ThinkingIndicatorExample() {
  const [isThinking, setIsThinking] = React.useState(false)

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsThinking(!isThinking)}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        {isThinking ? 'Stop' : 'Start'} Thinking
      </button>

      <AnimatePresence>
        {isThinking && (
          <motion.div
            variants={thinkingPulse}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            className="flex items-center gap-2 p-4 bg-purple-100 rounded"
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>AI is thinking...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Example 6: AnimatePresence with Exit Animations
 *
 * Shows how to properly handle exit animations when removing items
 */
export function AnimatePresenceExample() {
  const [items, setItems] = React.useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ])

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random(), text: `Item ${items.length + 1}` },
    ])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      <button
        onClick={addItem}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Item
      </button>

      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className="flex justify-between items-center p-4 bg-gray-100 rounded"
          >
            <span>{item.text}</span>
            <button
              onClick={() => removeItem(item.id as any)}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Example 7: Reduced Motion Support
 *
 * Shows how to properly respect user's reduced motion preference
 */
export function ReducedMotionExample() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-100 rounded">
        <p>
          {prefersReducedMotion
            ? 'Reduced motion is preferred - animations are minimal'
            : 'Full animations enabled'}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : TRANSITION_PRESETS.normal
        }
        className="p-4 bg-gray-100 rounded"
      >
        This animation respects your motion preference
      </motion.div>
    </div>
  )
}

/**
 * Example 8: Complete Chat Interface Example
 *
 * A realistic example combining multiple animation utilities
 */
export function ChatInterfaceExample() {
  const [messages, setMessages] = React.useState([
    { id: 1, role: 'user' as const, content: 'Hello!' },
    { id: 2, role: 'assistant' as const, content: 'Hi there! How can I help?' },
  ])

  const [inputValue, setInputValue] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Math.random(),
      role: 'user' as const,
      content: inputValue,
    }
    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate loading
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add assistant message
    const assistantMessage = {
      id: Math.random(),
      role: 'assistant' as const,
      content: 'This is a simulated response.',
    }
    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const containerVariants = stagger(messageEnter, {
    stagger: 0.05,
    delayChildren: 0,
  })

  return (
    <div className="flex flex-col h-96 bg-white rounded border">
      {/* Messages */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => {
            const { variant, transition } = useMessageAnimation(index, 30)

            return (
              <motion.div
                key={message.id}
                variants={variant}
                transition={transition}
                layout
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            )
          })}

          {isLoading && (
            <motion.div
              key="thinking"
              variants={thinkingPulse}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1, repeat: Infinity }}
              className="flex gap-1 p-3"
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}

/**
 * Example 9: Combined Animation Presets
 *
 * Shows how to combine multiple animation utilities
 */
export function CombinedAnimationExample() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-indigo-500 text-white rounded"
      >
        {isOpen ? 'Close' : 'Open'} Panel
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={TRANSITION_PRESETS.spring}
            className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded"
          >
            <h3 className="font-bold mb-2">Animated Panel</h3>
            <p>
              This panel uses a combination of animation utilities including
              transitions and presets.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
