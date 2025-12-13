'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Accessibility,
  ChevronLeft,
  Check,
  Keyboard,
  Eye,
  Volume2,
  Moon,
  Sun,
  ArrowRight,
  Play,
  Pause,
  SkipForward
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { trackDemoViewed } from '@/lib/demos/analytics'

interface AccessibilityFeature {
  id: string
  title: string
  description: string
  icon: typeof Keyboard
  demo: string
  keyboardShortcut?: string
}

const features: AccessibilityFeature[] = [
  {
    id: 'keyboard-nav',
    title: 'Full Keyboard Navigation',
    description: 'Navigate the entire chat interface without a mouse. Tab through elements, Enter to send, Escape to cancel.',
    icon: Keyboard,
    demo: 'keyboard',
    keyboardShortcut: 'Tab, Enter, Esc',
  },
  {
    id: 'screen-reader',
    title: 'Screen Reader Support',
    description: 'ARIA labels, live regions, and semantic HTML ensure screen readers announce messages correctly.',
    icon: Volume2,
    demo: 'screenreader',
  },
  {
    id: 'focus-management',
    title: 'Focus Management',
    description: 'Focus automatically moves to new messages and returns to input after actions.',
    icon: Eye,
    demo: 'focus',
  },
  {
    id: 'high-contrast',
    title: 'High Contrast Mode',
    description: 'WCAG 2.1 AA compliant colors with support for system high contrast preferences.',
    icon: Moon,
    demo: 'contrast',
  },
]

interface KeyboardStep {
  key: string
  action: string
  element: string
}

const keyboardDemo: KeyboardStep[] = [
  { key: 'Tab', action: 'Navigate to input field', element: 'input' },
  { key: 'Type', action: 'Enter message text', element: 'input' },
  { key: 'Tab', action: 'Navigate to send button', element: 'send' },
  { key: 'Enter', action: 'Send the message', element: 'send' },
  { key: 'Tab', action: 'Navigate to message actions', element: 'actions' },
  { key: 'Enter', action: 'Trigger copy action', element: 'copy' },
  { key: 'Esc', action: 'Close any open dialogs', element: 'none' },
]

export default function AccessibilityAuditDemo() {
  const [activeFeature, setActiveFeature] = useState<string>('keyboard-nav')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [focusedElement, setFocusedElement] = useState<string | null>(null)
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Track demo view
  useEffect(() => {
    trackDemoViewed('accessibility-audit')
  }, [])

  // Keyboard demo playback
  useEffect(() => {
    if (!isPlaying || activeFeature !== 'keyboard-nav') return

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= keyboardDemo.length - 1) {
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isPlaying, activeFeature])

  // Update focused element based on current step
  useEffect(() => {
    if (activeFeature === 'keyboard-nav' && isPlaying) {
      setFocusedElement(keyboardDemo[currentStep].element)
    }
  }, [currentStep, activeFeature, isPlaying])

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
  }

  const announceToScreenReader = (message: string) => {
    setScreenReaderAnnouncement(message)
    setTimeout(() => setScreenReaderAnnouncement(''), 3000)
  }

  return (
    <div className={`container-docs py-12 ${highContrast ? 'contrast-more' : ''}`}>
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-6">
              <Accessibility className="w-4 h-4" />
              WCAG 2.1 AA Compliant
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Accessibility{' '}
              <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                Live Audit
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Full keyboard navigation, screen reader support, focus management,
              and high contrast mode. Enterprise-ready accessibility.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature List */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-4">Accessibility Features</h3>
              {features.map((feature) => {
                const Icon = feature.icon
                const isActive = activeFeature === feature.id

                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setActiveFeature(feature.id)
                      setIsPlaying(false)
                      setCurrentStep(0)
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                        : 'border-transparent bg-bg-secondary hover:bg-bg-secondary/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-teal-500 text-white'
                          : 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{feature.title}</div>
                        <div className="text-sm text-text-secondary mt-1">
                          {feature.description}
                        </div>
                        {feature.keyboardShortcut && (
                          <div className="mt-2 flex gap-1">
                            {feature.keyboardShortcut.split(', ').map((key) => (
                              <kbd
                                key={key}
                                className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Demo Area */}
          <ScrollReveal delay={0.2}>
            <div className="lg:col-span-2">
              <div className={`rounded-2xl border-2 shadow-xl overflow-hidden ${
                highContrast
                  ? 'border-black dark:border-white bg-white dark:bg-black'
                  : 'border-border bg-bg-primary'
              }`}>
                {/* Demo Header */}
                <div className="bg-gradient-to-r from-teal-500 to-green-600 px-6 py-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Accessibility className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {features.find(f => f.id === activeFeature)?.title}
                      </div>
                      <div className="text-xs opacity-90">Interactive Demo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Toggle high contrast mode"
                    >
                      {highContrast ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="p-6 min-h-[400px]">
                  {/* Keyboard Navigation Demo */}
                  {activeFeature === 'keyboard-nav' && (
                    <div className="space-y-6">
                      {/* Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={isPlaying ? () => setIsPlaying(false) : startDemo}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isPlaying ? 'Pause' : 'Play Demo'}
                        </button>
                        <div className="text-sm text-text-secondary">
                          Step {currentStep + 1} of {keyboardDemo.length}
                        </div>
                      </div>

                      {/* Current Step Info */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800"
                        >
                          <div className="flex items-center gap-3">
                            <kbd className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow text-sm font-mono">
                              {keyboardDemo[currentStep].key}
                            </kbd>
                            <span className="text-sm">{keyboardDemo[currentStep].action}</span>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Simulated Chat */}
                      <div className="border border-border rounded-xl overflow-hidden">
                        {/* Messages */}
                        <div className="p-4 space-y-3 bg-bg-secondary">
                          <div className={`p-3 rounded-lg bg-bg-primary border-2 transition-all ${
                            focusedElement === 'actions' || focusedElement === 'copy'
                              ? 'border-teal-500 ring-2 ring-teal-500/50'
                              : 'border-transparent'
                          }`}>
                            <p className="text-sm">Here's a response with accessible actions.</p>
                            <div className="flex gap-2 mt-2">
                              <button className={`px-3 py-1 text-xs rounded transition-all ${
                                focusedElement === 'copy'
                                  ? 'bg-teal-500 text-white ring-2 ring-teal-500/50'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                Copy
                              </button>
                              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                                Regenerate
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border flex gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                              focusedElement === 'input'
                                ? 'border-teal-500 ring-2 ring-teal-500/50'
                                : 'border-border'
                            } bg-bg-secondary`}
                            aria-label="Chat message input"
                          />
                          <button
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              focusedElement === 'send'
                                ? 'bg-teal-600 text-white ring-2 ring-teal-500/50'
                                : 'bg-teal-500 text-white'
                            }`}
                            aria-label="Send message"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen Reader Demo */}
                  {activeFeature === 'screen-reader' && (
                    <div className="space-y-6">
                      <p className="text-text-secondary">
                        Screen reader users hear announcements as new messages arrive.
                        Click the buttons below to simulate announcements.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'New Message', text: 'New message from Assistant: Hello! How can I help you today?' },
                          { label: 'Typing Indicator', text: 'Assistant is typing...' },
                          { label: 'Error State', text: 'Error: Message failed to send. Retry button available.' },
                          { label: 'Message Sent', text: 'Your message was sent successfully.' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => announceToScreenReader(item.text)}
                            className="p-4 text-left rounded-lg bg-bg-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-border"
                          >
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-text-secondary mt-1">Click to announce</div>
                          </button>
                        ))}
                      </div>

                      {/* Live Region Demo */}
                      <AnimatePresence>
                        {screenReaderAnnouncement && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                            role="status"
                            aria-live="polite"
                          >
                            <div className="flex items-center gap-2">
                              <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Screen Reader: "{screenReaderAnnouncement}"
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <h4 className="font-medium mb-2">ARIA Attributes Used</h4>
                        <ul className="text-sm text-text-secondary space-y-1">
                          <li>• <code>role="log"</code> on message list</li>
                          <li>• <code>aria-live="polite"</code> for new messages</li>
                          <li>• <code>aria-label</code> on all interactive elements</li>
                          <li>• <code>aria-busy</code> during loading states</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Focus Management Demo */}
                  {activeFeature === 'focus-management' && (
                    <div className="space-y-6">
                      <p className="text-text-secondary">
                        Focus automatically moves to relevant elements, ensuring users
                        always know where they are in the interface.
                      </p>

                      <div className="space-y-4">
                        {[
                          { scenario: 'New message arrives', behavior: 'Focus moves to message, then returns to input' },
                          { scenario: 'Modal opens', behavior: 'Focus trapped inside modal until closed' },
                          { scenario: 'Error occurs', behavior: 'Focus moves to error message with retry option' },
                          { scenario: 'Dialog closes', behavior: 'Focus returns to the element that opened it' },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-bg-secondary border border-border"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 font-medium text-sm flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-medium">{item.scenario}</div>
                                <div className="text-sm text-text-secondary mt-1">{item.behavior}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High Contrast Demo */}
                  {activeFeature === 'high-contrast' && (
                    <div className="space-y-6">
                      <p className="text-text-secondary">
                        All colors meet WCAG 2.1 AA contrast requirements. Toggle high contrast
                        mode to see enhanced visibility.
                      </p>

                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2"
                      >
                        {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {highContrast ? 'Disable' : 'Enable'} High Contrast
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="font-medium">Color Contrast Ratios</div>
                          <div className="space-y-2 text-sm">
                            {[
                              { label: 'Primary Text', ratio: '15.8:1', status: 'AAA' },
                              { label: 'Secondary Text', ratio: '7.2:1', status: 'AA' },
                              { label: 'Links', ratio: '4.6:1', status: 'AA' },
                              { label: 'Buttons', ratio: '5.1:1', status: 'AA' },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between">
                                <span>{item.label}</span>
                                <span className="flex items-center gap-2">
                                  <span className="text-text-secondary">{item.ratio}</span>
                                  <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                                    {item.status}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Features</div>
                          <ul className="text-sm text-text-secondary space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              System preference detection
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              Reduced motion support
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              Focus visible styles
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              Scalable text (up to 200%)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Compliance Badge */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950 border border-teal-200 dark:border-teal-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Accessibility className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">WCAG 2.1 AA Certified</div>
                  <div className="text-text-secondary">
                    Tested with VoiceOver, NVDA, and JAWS screen readers
                  </div>
                </div>
              </div>
              <Link
                href="/guides/accessibility"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
              >
                Accessibility Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
