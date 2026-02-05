/**
 * FollowUpSuggestions Interactive Demonstrations
 *
 * Comprehensive showcase of context-aware follow-up prompts with:
 * - Multiple suggestion categories
 * - Interactive selection
 * - Glassmorphism styled chips
 * - Smooth animations and transitions
 * - Different conversation contexts
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FollowUpSuggestions,
  PromptSuggestions,
  type PromptSuggestion,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

// Icons for different categories
const CategoryIcons = {
  question: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  action: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  explore: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  code: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

// Context-aware suggestion scenarios
const ConversationScenarios = {
  'Getting Started': {
    messages: [
      {
        id: '1',
        role: 'assistant' as const,
        content: 'Hi! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ],
    suggestions: [
      {
        id: 'start-1',
        text: 'What features do you have?',
        label: 'Features',
        type: 'follow-up' as const,
        icon: CategoryIcons.info,
        category: 'Questions',
        confidence: 0.95,
        description: 'Learn about available capabilities',
      },
      {
        id: 'start-2',
        text: 'Help me write code',
        label: 'Code Help',
        type: 'follow-up' as const,
        icon: CategoryIcons.code,
        category: 'Actions',
        confidence: 0.9,
        description: 'Get coding assistance',
      },
      {
        id: 'start-3',
        text: 'Analyze this document',
        label: 'Analyze',
        type: 'follow-up' as const,
        icon: CategoryIcons.document,
        category: 'Actions',
        confidence: 0.85,
        description: 'Upload and analyze files',
      },
      {
        id: 'start-4',
        text: 'Show me examples',
        label: 'Examples',
        type: 'follow-up' as const,
        icon: CategoryIcons.explore,
        category: 'Explore',
        confidence: 0.8,
        description: 'Browse example use cases',
      },
    ],
  },
  'Code Discussion': {
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: 'How do I implement a binary search tree in TypeScript?',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant' as const,
        content: 'Here\'s a TypeScript implementation of a binary search tree with insert, search, and delete operations...',
        timestamp: new Date(),
      },
    ],
    suggestions: [
      {
        id: 'code-1',
        text: 'Explain the time complexity',
        label: 'Time Complexity',
        type: 'follow-up' as const,
        icon: CategoryIcons.info,
        category: 'Understanding',
        confidence: 0.95,
        description: 'Analyze algorithm performance',
      },
      {
        id: 'code-2',
        text: 'Add unit tests',
        label: 'Unit Tests',
        type: 'follow-up' as const,
        icon: CategoryIcons.code,
        category: 'Actions',
        confidence: 0.92,
        description: 'Generate test cases',
      },
      {
        id: 'code-3',
        text: 'Show me how to balance the tree',
        label: 'Balance Tree',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.88,
        description: 'Implement AVL or Red-Black tree',
      },
      {
        id: 'code-4',
        text: 'Compare with other data structures',
        label: 'Compare',
        type: 'follow-up' as const,
        icon: CategoryIcons.explore,
        category: 'Explore',
        confidence: 0.85,
        description: 'BST vs Hash Table vs Array',
      },
      {
        id: 'code-5',
        text: 'Optimize for my use case',
        label: 'Optimize',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.82,
        description: 'Tailor to specific needs',
      },
    ],
  },
  'Customer Support': {
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: 'I\'m having trouble with my order #12345',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant' as const,
        content: 'I found your order. It appears to be in transit and should arrive by tomorrow. Would you like tracking details?',
        timestamp: new Date(),
      },
    ],
    suggestions: [
      {
        id: 'support-1',
        text: 'Yes, send me tracking info',
        label: 'Track Order',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Quick Reply',
        confidence: 0.98,
        description: 'Get tracking number and link',
      },
      {
        id: 'support-2',
        text: 'What if it doesn\'t arrive?',
        label: 'Delivery Issues',
        type: 'follow-up' as const,
        icon: CategoryIcons.question,
        category: 'Questions',
        confidence: 0.85,
        description: 'Learn about guarantees',
      },
      {
        id: 'support-3',
        text: 'Modify my delivery address',
        label: 'Change Address',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.8,
        description: 'Update shipping details',
      },
      {
        id: 'support-4',
        text: 'Talk to a human agent',
        label: 'Human Support',
        type: 'follow-up' as const,
        icon: CategoryIcons.info,
        category: 'Escalate',
        confidence: 0.75,
        description: 'Connect with support team',
      },
    ],
  },
  'Research Assistant': {
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: 'Tell me about the impact of AI on healthcare',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant' as const,
        content: 'AI is transforming healthcare in multiple ways: diagnostic imaging, drug discovery, personalized treatment, and administrative efficiency...',
        timestamp: new Date(),
      },
    ],
    suggestions: [
      {
        id: 'research-1',
        text: 'Focus on diagnostic applications',
        label: 'Diagnostics',
        type: 'follow-up' as const,
        icon: CategoryIcons.explore,
        category: 'Deep Dive',
        confidence: 0.9,
        description: 'Radiology, pathology, and more',
      },
      {
        id: 'research-2',
        text: 'What are the ethical concerns?',
        label: 'Ethics',
        type: 'follow-up' as const,
        icon: CategoryIcons.question,
        category: 'Questions',
        confidence: 0.88,
        description: 'Privacy, bias, and accountability',
      },
      {
        id: 'research-3',
        text: 'Show recent research papers',
        label: 'Papers',
        type: 'follow-up' as const,
        icon: CategoryIcons.document,
        category: 'Sources',
        confidence: 0.85,
        description: 'Latest academic publications',
      },
      {
        id: 'research-4',
        text: 'Compare different countries\' approaches',
        label: 'International',
        type: 'follow-up' as const,
        icon: CategoryIcons.explore,
        category: 'Explore',
        confidence: 0.82,
        description: 'Global AI adoption in medicine',
      },
      {
        id: 'research-5',
        text: 'Create a summary document',
        label: 'Summarize',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.8,
        description: 'Generate structured overview',
      },
    ],
  },
  'Creative Writing': {
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: 'Help me write a sci-fi short story about time travel',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant' as const,
        content: 'Here\'s an opening scene: Dr. Sarah Chen stood before the temporal displacement device, her hands trembling as she initialized the countdown...',
        timestamp: new Date(),
      },
    ],
    suggestions: [
      {
        id: 'writing-1',
        text: 'Continue the story',
        label: 'Continue',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.95,
        description: 'Generate next paragraphs',
      },
      {
        id: 'writing-2',
        text: 'Add more character depth',
        label: 'Develop Characters',
        type: 'follow-up' as const,
        icon: CategoryIcons.explore,
        category: 'Enhance',
        confidence: 0.9,
        description: 'Enrich personalities and motivations',
      },
      {
        id: 'writing-3',
        text: 'Suggest plot twists',
        label: 'Plot Twists',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Actions',
        confidence: 0.88,
        description: 'Add unexpected turns',
      },
      {
        id: 'writing-4',
        text: 'Make it more suspenseful',
        label: 'Build Tension',
        type: 'follow-up' as const,
        icon: CategoryIcons.action,
        category: 'Enhance',
        confidence: 0.85,
        description: 'Increase dramatic tension',
      },
      {
        id: 'writing-5',
        text: 'Analyze the pacing',
        label: 'Review Pacing',
        type: 'follow-up' as const,
        icon: CategoryIcons.info,
        category: 'Feedback',
        confidence: 0.8,
        description: 'Evaluate story flow',
      },
    ],
  },
}

export function FollowUpSuggestionsDemo() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof ConversationScenarios>('Getting Started')
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [layout, setLayout] = useState<'chips' | 'cards' | 'list'>('chips')
  const [showCategories, setShowCategories] = useState(true)

  const scenario = ConversationScenarios[selectedScenario]

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    setSelectedSuggestions((prev) => [...prev, suggestion.text])

    // Simulate adding to conversation
    setTimeout(() => {
      setSelectedSuggestions([])
    }, 2000)
  }

  return (
    <div className="follow-up-demo-container">
      <div className="demo-header">
        <h1 className="demo-title">FollowUpSuggestions Interactive Demo</h1>
        <p className="demo-subtitle">
          Context-aware follow-up prompts with glassmorphism styling and smooth animations
        </p>
      </div>

      {/* Control Panel */}
      <div className="demo-controls">
        <div className="control-group">
          <label className="control-label">Scenario</label>
          <select
            className="control-select"
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value as keyof typeof ConversationScenarios)}
          >
            {Object.keys(ConversationScenarios).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">Layout</label>
          <select
            className="control-select"
            value={layout}
            onChange={(e) => setLayout(e.target.value as 'chips' | 'cards' | 'list')}
          >
            <option value="chips">Chips</option>
            <option value="cards">Cards</option>
            <option value="list">List</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-checkbox">
            <input
              type="checkbox"
              checked={showCategories}
              onChange={(e) => setShowCategories(e.target.checked)}
            />
            Show Categories
          </label>
        </div>
      </div>

      {/* Demo Content */}
      <div className="demo-content">
        {/* Conversation Context */}
        <div className="conversation-context">
          <h2 className="section-title">Conversation Context</h2>
          <div className="message-list">
            {scenario.messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message message-${message.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-role">{message.role}</div>
                <div className="message-content">{message.content}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Follow-Up Suggestions */}
        <div className="suggestions-container">
          <h2 className="section-title">Context-Aware Follow-Ups</h2>

          <div className="suggestions-wrapper glassmorphism">
            <PromptSuggestions
              suggestions={scenario.suggestions}
              onSelect={handleSuggestionSelect}
              suggestionType="follow-up"
              layout={layout}
              showCategories={showCategories}
              maxSuggestions={6}
            />
          </div>

          {/* Selection Feedback */}
          <AnimatePresence>
            {selectedSuggestions.length > 0 && (
              <motion.div
                className="selection-feedback"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="feedback-icon">✓</div>
                <div className="feedback-text">
                  Selected: "{selectedSuggestions[selectedSuggestions.length - 1]}"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="feature-grid">
        <div className="feature-card glassmorphism">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Context-Aware</h3>
          <p className="feature-description">
            Suggestions dynamically adapt based on conversation content and user intent
          </p>
        </div>

        <div className="feature-card glassmorphism">
          <div className="feature-icon">🎨</div>
          <h3 className="feature-title">Glassmorphism Design</h3>
          <p className="feature-description">
            Modern, translucent styling with backdrop blur effects
          </p>
        </div>

        <div className="feature-card glassmorphism">
          <div className="feature-icon">✨</div>
          <h3 className="feature-title">Smooth Animations</h3>
          <p className="feature-description">
            Spring physics and staggered entrance animations for polish
          </p>
        </div>

        <div className="feature-card glassmorphism">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Confidence Scores</h3>
          <p className="feature-description">
            AI-powered relevance scoring for intelligent suggestion ranking
          </p>
        </div>

        <div className="feature-card glassmorphism">
          <div className="feature-icon">🏷️</div>
          <h3 className="feature-title">Categories</h3>
          <p className="feature-description">
            Organized by type (Questions, Actions, Explore) for easy navigation
          </p>
        </div>

        <div className="feature-card glassmorphism">
          <div className="feature-icon">📱</div>
          <h3 className="feature-title">Responsive Layouts</h3>
          <p className="feature-description">
            Chips, cards, or list views adapt to screen size and use case
          </p>
        </div>
      </div>

      {/* Code Examples */}
      <div className="code-examples">
        <h2 className="section-title">Implementation Examples</h2>

        <div className="code-example-card glassmorphism">
          <h3 className="code-title">Basic Usage</h3>
          <pre className="code-block"><code>{`import { FollowUpSuggestions } from '@clarity-chat/react'

const suggestions = [
  {
    id: '1',
    text: 'Tell me more',
    type: 'follow-up',
    confidence: 0.9,
  },
]

<FollowUpSuggestions
  showFollowUp={true}
  followUpSuggestions={suggestions}
  onPromptSelect={(suggestion) => {
    console.log('Selected:', suggestion.text)
  }}
/>`}</code></pre>
        </div>

        <div className="code-example-card glassmorphism">
          <h3 className="code-title">With Categories</h3>
          <pre className="code-block"><code>{`<PromptSuggestions
  suggestions={suggestions}
  onSelect={handleSelect}
  suggestionType="follow-up"
  layout="chips"
  showCategories={true}
  maxSuggestions={6}
/>`}</code></pre>
        </div>

        <div className="code-example-card glassmorphism">
          <h3 className="code-title">Context-Aware Hook</h3>
          <pre className="code-block"><code>{`import { usePromptSuggestions } from '@clarity-chat/react'

function ChatInterface({ messages }) {
  const suggestions = usePromptSuggestions(messages, {
    maxSuggestions: 6,
    suggestionType: 'follow-up',
  })

  return (
    <PromptSuggestions
      suggestions={suggestions}
      onSelect={handleSelect}
    />
  )
}`}</code></pre>
        </div>
      </div>

      <style jsx>{`
        .follow-up-demo-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .demo-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .demo-subtitle {
          font-size: 1.125rem;
          color: hsl(var(--muted-foreground));
        }

        .demo-controls {
          display: flex;
          gap: 2rem;
          padding: 1.5rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .control-select {
          padding: 0.5rem 1rem;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-select:hover {
          border-color: hsl(var(--primary));
        }

        .control-select:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }

        .control-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
        }

        .control-checkbox input {
          cursor: pointer;
        }

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (max-width: 1024px) {
          .demo-content {
            grid-template-columns: 1fr;
          }
        }

        .conversation-context {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          padding: 1rem;
          border-radius: 8px;
          animation: fadeIn 0.3s ease-out;
        }

        .message-user {
          background: hsl(var(--primary) / 0.1);
          border-left: 3px solid hsl(var(--primary));
        }

        .message-assistant {
          background: hsl(var(--muted));
          border-left: 3px solid hsl(var(--muted-foreground));
        }

        .message-role {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.5rem;
        }

        .message-content {
          font-size: 0.875rem;
          line-height: 1.6;
          color: hsl(var(--foreground));
        }

        .suggestions-container {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 1.5rem;
        }

        .suggestions-wrapper {
          margin-bottom: 1rem;
          padding: 1.5rem;
          border-radius: 12px;
        }

        .glassmorphism {
          background: linear-gradient(
            135deg,
            hsl(var(--card) / 0.9) 0%,
            hsl(var(--card) / 0.7) 100%
          );
          backdrop-filter: blur(10px);
          border: 1px solid hsl(var(--border) / 0.3);
          box-shadow:
            0 4px 24px -4px hsl(var(--foreground) / 0.08),
            inset 0 1px 0 0 hsl(var(--foreground) / 0.05);
        }

        .selection-feedback {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
          color: hsl(var(--primary-foreground));
          border-radius: 8px;
          box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.3);
        }

        .feedback-icon {
          font-size: 1.5rem;
          animation: bounceIn 0.4s ease-out;
        }

        .feedback-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          padding: 1.5rem;
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px -8px hsl(var(--foreground) / 0.15);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .feature-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
        }

        .code-examples {
          margin-top: 3rem;
        }

        .code-example-card {
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .code-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        .code-block {
          background: hsl(var(--muted));
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
        }

        .code-block code {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: hsl(var(--foreground));
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
