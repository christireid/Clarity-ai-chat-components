/**
 * Advanced FollowUpSuggestions Demo
 *
 * Enhanced demonstration with:
 * - Real-time suggestion generation
 * - Multiple layout comparisons
 * - Advanced glassmorphism effects
 * - Animated transitions between contexts
 * - Interactive confidence adjustment
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptSuggestions, type PromptSuggestion } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

// Layout comparison component
function LayoutComparison() {
  const [activeLayout, setActiveLayout] = useState<'chips' | 'cards' | 'list'>('chips')

  const exampleSuggestions: PromptSuggestion[] = [
    {
      id: '1',
      text: 'Tell me more about this',
      label: 'Learn More',
      type: 'follow-up',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'Questions',
      confidence: 0.95,
      description: 'Get detailed information about this topic',
    },
    {
      id: '2',
      text: 'Show me an example',
      label: 'Example',
      type: 'follow-up',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      category: 'Actions',
      confidence: 0.88,
      description: 'See practical examples and code snippets',
    },
    {
      id: '3',
      text: 'What are the best practices?',
      label: 'Best Practices',
      type: 'follow-up',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'Questions',
      confidence: 0.82,
      description: 'Learn recommended approaches and patterns',
    },
  ]

  return (
    <div className="layout-comparison">
      <div className="layout-tabs">
        {(['chips', 'cards', 'list'] as const).map((layout) => (
          <button
            key={layout}
            className={`layout-tab ${activeLayout === layout ? 'active' : ''}`}
            onClick={() => setActiveLayout(layout)}
          >
            {layout.charAt(0).toUpperCase() + layout.slice(1)}
          </button>
        ))}
      </div>

      <div className="layout-preview glassmorphism-strong">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayout}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PromptSuggestions
              suggestions={exampleSuggestions}
              onSelect={(s) => console.log('Selected:', s.text)}
              suggestionType="follow-up"
              layout={activeLayout}
              maxSuggestions={3}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .layout-comparison {
          margin: 2rem 0;
        }

        .layout-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background: hsl(var(--card) / 0.5);
          border-radius: 12px;
          backdrop-filter: blur(8px);
        }

        .layout-tab {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .layout-tab:hover {
          background: hsl(var(--accent) / 0.5);
          color: hsl(var(--foreground));
        }

        .layout-tab.active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.3);
        }

        .layout-preview {
          padding: 2rem;
          border-radius: 16px;
          min-height: 200px;
        }

        .glassmorphism-strong {
          background: linear-gradient(
            135deg,
            hsl(var(--card) / 0.95) 0%,
            hsl(var(--card) / 0.85) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid hsl(var(--border) / 0.2);
          box-shadow:
            0 8px 32px -8px hsl(var(--foreground) / 0.12),
            inset 0 2px 0 0 hsl(var(--foreground) / 0.08);
        }
      `}</style>
    </div>
  )
}

// Confidence adjuster component
function ConfidenceAdjuster() {
  const [minConfidence, setMinConfidence] = useState(0.7)

  const allSuggestions: PromptSuggestion[] = [
    {
      id: '1',
      text: 'Highly relevant suggestion',
      label: 'Top Match',
      type: 'follow-up',
      confidence: 0.95,
      category: 'Best',
    },
    {
      id: '2',
      text: 'Very relevant suggestion',
      label: 'Great Match',
      type: 'follow-up',
      confidence: 0.85,
      category: 'Good',
    },
    {
      id: '3',
      text: 'Somewhat relevant suggestion',
      label: 'Decent Match',
      type: 'follow-up',
      confidence: 0.75,
      category: 'OK',
    },
    {
      id: '4',
      text: 'Possibly relevant suggestion',
      label: 'Maybe',
      type: 'follow-up',
      confidence: 0.65,
      category: 'Uncertain',
    },
    {
      id: '5',
      text: 'Low relevance suggestion',
      label: 'Low Match',
      type: 'follow-up',
      confidence: 0.55,
      category: 'Weak',
    },
  ]

  const filteredSuggestions = allSuggestions.filter(
    (s) => (s.confidence || 0) >= minConfidence
  )

  return (
    <div className="confidence-adjuster">
      <div className="adjuster-controls">
        <label className="adjuster-label">
          Minimum Confidence: {Math.round(minConfidence * 100)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={minConfidence}
          onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
          className="confidence-slider"
        />
        <div className="slider-labels">
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="suggestions-display glassmorphism-strong">
        <AnimatePresence mode="popLayout">
          {filteredSuggestions.length > 0 ? (
            <PromptSuggestions
              suggestions={filteredSuggestions}
              onSelect={(s) => console.log('Selected:', s.text)}
              suggestionType="follow-up"
              layout="chips"
              maxSuggestions={10}
            />
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p>No suggestions meet the confidence threshold</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="suggestions-count">
        Showing {filteredSuggestions.length} of {allSuggestions.length} suggestions
      </div>

      <style jsx>{`
        .confidence-adjuster {
          margin: 2rem 0;
        }

        .adjuster-controls {
          padding: 1.5rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .adjuster-label {
          display: block;
          font-weight: 600;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        .confidence-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            hsl(var(--destructive) / 0.5) 0%,
            hsl(var(--warning) / 0.5) 50%,
            hsl(var(--success) / 0.5) 100%
          );
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        .confidence-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          box-shadow: 0 2px 8px -2px hsl(var(--primary) / 0.4);
          transition: transform 0.2s;
        }

        .confidence-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .suggestions-display {
          padding: 2rem;
          border-radius: 16px;
          min-height: 150px;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: hsl(var(--muted-foreground));
        }

        .suggestions-count {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

// Animated context switcher
function AnimatedContextSwitcher() {
  const [activeContext, setActiveContext] = useState(0)

  const contexts = [
    {
      name: 'Shopping',
      icon: '🛍️',
      suggestions: [
        {
          id: 's1',
          text: 'View similar products',
          label: 'Similar Items',
          type: 'follow-up' as const,
          confidence: 0.9,
        },
        {
          id: 's2',
          text: 'Check reviews',
          label: 'Reviews',
          type: 'follow-up' as const,
          confidence: 0.85,
        },
        {
          id: 's3',
          text: 'Add to cart',
          label: 'Add to Cart',
          type: 'follow-up' as const,
          confidence: 0.8,
        },
      ],
    },
    {
      name: 'Learning',
      icon: '📚',
      suggestions: [
        {
          id: 'l1',
          text: 'Explain in simpler terms',
          label: 'Simplify',
          type: 'follow-up' as const,
          confidence: 0.92,
        },
        {
          id: 'l2',
          text: 'Give me a quiz',
          label: 'Test Knowledge',
          type: 'follow-up' as const,
          confidence: 0.88,
        },
        {
          id: 'l3',
          text: 'Show related topics',
          label: 'Related',
          type: 'follow-up' as const,
          confidence: 0.82,
        },
      ],
    },
    {
      name: 'Support',
      icon: '💬',
      suggestions: [
        {
          id: 'su1',
          text: 'Talk to agent',
          label: 'Human Support',
          type: 'follow-up' as const,
          confidence: 0.95,
        },
        {
          id: 'su2',
          text: 'Check order status',
          label: 'Track Order',
          type: 'follow-up' as const,
          confidence: 0.9,
        },
        {
          id: 'su3',
          text: 'View FAQ',
          label: 'FAQ',
          type: 'follow-up' as const,
          confidence: 0.75,
        },
      ],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveContext((prev) => (prev + 1) % contexts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [contexts.length])

  return (
    <div className="context-switcher">
      <div className="context-tabs">
        {contexts.map((context, idx) => (
          <button
            key={context.name}
            className={`context-tab ${activeContext === idx ? 'active' : ''}`}
            onClick={() => setActiveContext(idx)}
          >
            <span className="context-icon">{context.icon}</span>
            <span className="context-name">{context.name}</span>
          </button>
        ))}
      </div>

      <div className="context-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeContext}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="context-panel glassmorphism-strong"
          >
            <h3 className="context-title">
              <span className="context-emoji">{contexts[activeContext].icon}</span>
              {contexts[activeContext].name} Context
            </h3>
            <PromptSuggestions
              suggestions={contexts[activeContext].suggestions}
              onSelect={(s) => console.log('Selected:', s.text)}
              suggestionType="follow-up"
              layout="chips"
              maxSuggestions={3}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="auto-switch-indicator">
        <div className="progress-dots">
          {contexts.map((_, idx) => (
            <div
              key={idx}
              className={`progress-dot ${activeContext === idx ? 'active' : ''}`}
            />
          ))}
        </div>
        <p className="auto-switch-text">Auto-switching every 5 seconds</p>
      </div>

      <style jsx>{`
        .context-switcher {
          margin: 2rem 0;
        }

        .context-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .context-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--card));
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .context-tab:hover {
          border-color: hsl(var(--primary) / 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px -2px hsl(var(--primary) / 0.2);
        }

        .context-tab.active {
          border-color: hsl(var(--primary));
          background: linear-gradient(
            135deg,
            hsl(var(--primary) / 0.1) 0%,
            hsl(var(--primary) / 0.05) 100%
          );
          box-shadow: 0 8px 24px -6px hsl(var(--primary) / 0.3);
        }

        .context-icon {
          font-size: 2rem;
        }

        .context-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .context-content {
          position: relative;
          min-height: 200px;
        }

        .context-panel {
          padding: 2rem;
          border-radius: 16px;
        }

        .context-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .context-emoji {
          font-size: 1.5rem;
        }

        .auto-switch-indicator {
          margin-top: 1.5rem;
          text-align: center;
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: hsl(var(--muted-foreground) / 0.3);
          transition: all 0.3s;
        }

        .progress-dot.active {
          background: hsl(var(--primary));
          width: 24px;
          border-radius: 4px;
        }

        .auto-switch-text {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  )
}

export function FollowUpSuggestionsAdvanced() {
  return (
    <div className="advanced-demo">
      <div className="demo-header">
        <h1 className="demo-title">Advanced FollowUpSuggestions</h1>
        <p className="demo-subtitle">
          Interactive demonstrations of context-aware suggestions with glassmorphism design
        </p>
      </div>

      <section className="demo-section">
        <h2 className="section-heading">Layout Comparison</h2>
        <p className="section-description">
          Compare different layout styles: chips, cards, and list views
        </p>
        <LayoutComparison />
      </section>

      <section className="demo-section">
        <h2 className="section-heading">Confidence Filtering</h2>
        <p className="section-description">
          Adjust the minimum confidence threshold to filter suggestions
        </p>
        <ConfidenceAdjuster />
      </section>

      <section className="demo-section">
        <h2 className="section-heading">Animated Context Switching</h2>
        <p className="section-description">
          Watch suggestions adapt to different conversation contexts
        </p>
        <AnimatedContextSwitcher />
      </section>

      <style jsx>{`
        .advanced-demo {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .demo-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            hsl(var(--primary)) 0%,
            hsl(var(--primary) / 0.6) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
        }

        .demo-subtitle {
          font-size: 1.125rem;
          color: hsl(var(--muted-foreground));
        }

        .demo-section {
          margin-bottom: 4rem;
          padding: 2rem;
          background: hsl(var(--card) / 0.5);
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 16px;
          backdrop-filter: blur(8px);
        }

        .section-heading {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .section-description {
          color: hsl(var(--muted-foreground));
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  )
}
