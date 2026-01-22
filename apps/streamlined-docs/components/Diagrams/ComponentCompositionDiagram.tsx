/**
 * Component Composition Diagram
 * 
 * Shows how components compose together
 */

'use client'

import { motion } from 'framer-motion'
import { MessageSquare, User, Send, List } from 'lucide-react'

interface ComponentCompositionDiagramProps {
  components: Array<{
    name: string
    description: string
    children?: string[]
  }>
}

export function ComponentCompositionDiagram({ components }: ComponentCompositionDiagramProps) {
  return (
    <div className="not-prose my-12">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-6 text-center">
          Component Composition
        </h3>

        <div className="flex flex-col items-center gap-6">
          {components.map((component, index) => (
            <div key={component.name} className="w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                {/* Indent level */}
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
                      <div className="w-4 h-px bg-slate-300 dark:bg-slate-600" />
                    </div>
                  )}
                </div>

                {/* Component card */}
                <div className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-mono text-xs font-bold">
                      &lt;/&gt;
                    </div>
                    <div className="flex-1">
                      <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {component.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {component.description}
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  {component.children && component.children.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2">
                      {component.children.map((child, childIndex) => (
                        <motion.div
                          key={child}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 + (childIndex + 1) * 0.08 }}
                          className="text-xs font-mono text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-purple-600 dark:text-purple-400">└─</span> {child}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector */}
              {index < components.length - 1 && (
                <div className="ml-6 my-2">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 12 0 L 12 24" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Default ChatWindow composition example
export function ChatWindowComposition() {
  return (
    <ComponentCompositionDiagram
      components={[
        {
          name: 'ChatWindow',
          description: 'Main container',
          children: ['MessageList', 'ThinkingIndicator', 'ChatInput'],
        },
        {
          name: 'MessageList',
          description: 'Message display area',
          children: ['Message (repeated)', 'ScrollArea', 'EmptyState'],
        },
        {
          name: 'Message',
          description: 'Individual message',
          children: ['Avatar', 'Content', 'Actions (CopyButton, Feedback)'],
        },
        {
          name: 'ChatInput',
          description: 'User input',
          children: ['Textarea', 'Button', 'CharCounter'],
        },
      ]}
    />
  )
}

