/**
 * Mention/Command System Demo
 *
 * Interactive demonstration of the enhanced mention system with:
 * - @mention autocomplete for users and agents
 * - /command slash commands
 * - Glassmorphism styled dropdown
 * - Context-aware suggestions
 * - Keyboard navigation
 */

import React, { useState } from 'react'
import {
  MentionInput,
  type MentionableUser,
  type SlashCommand,
  type Mention,
} from '@clarity-chat/react'
import { glassVariants } from '@clarity-chat/primitives'
import { motion } from 'framer-motion'

// Sample users and agents
const sampleUsers: MentionableUser[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    username: 'alice',
    role: 'Product Manager',
    type: 'user',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    username: 'bob',
    role: 'Software Engineer',
    type: 'user',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Claude AI',
    username: 'claude',
    role: 'AI Assistant',
    type: 'agent',
    isOnline: true,
    capabilities: ['Code', 'Analysis', 'Writing'],
  },
  {
    id: '4',
    name: 'GPT-4',
    username: 'gpt4',
    role: 'Language Model',
    type: 'agent',
    isOnline: true,
    capabilities: ['Chat', 'Research', 'Creative'],
  },
  {
    id: '5',
    name: 'Support Bot',
    username: 'supportbot',
    role: 'Customer Support',
    type: 'bot',
    isOnline: true,
    capabilities: ['FAQ', 'Tickets', 'Help'],
  },
  {
    id: '6',
    name: 'Carol Davis',
    username: 'carol',
    role: 'Designer',
    type: 'user',
    isOnline: true,
  },
  {
    id: '7',
    name: 'David Lee',
    username: 'david',
    role: 'Data Scientist',
    type: 'user',
    isOnline: false,
  },
]

// Sample slash commands
const sampleCommands: SlashCommand[] = [
  {
    id: 'help',
    command: 'help',
    description: 'Show available commands and keyboard shortcuts',
    category: 'general',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'search',
    command: 'search',
    description: 'Search through conversation history',
    category: 'search',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    parameters: [
      { name: 'query', type: 'string', required: true, description: 'Search query' },
    ],
  },
  {
    id: 'summarize',
    command: 'summarize',
    description: 'Summarize the conversation or selected text',
    category: 'ai',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 'translate',
    command: 'translate',
    description: 'Translate text to another language',
    category: 'ai',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    ),
    parameters: [
      { name: 'language', type: 'select', required: true, description: 'Target language' },
    ],
  },
  {
    id: 'code',
    command: 'code',
    description: 'Generate code snippet in specified language',
    category: 'ai',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    parameters: [
      { name: 'language', type: 'string', required: true, description: 'Programming language' },
      { name: 'description', type: 'string', required: false, description: 'What to generate' },
    ],
  },
  {
    id: 'export',
    command: 'export',
    description: 'Export conversation in various formats',
    category: 'utility',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    parameters: [
      {
        name: 'format',
        type: 'select',
        required: true,
        description: 'Export format',
        options: ['markdown', 'json', 'pdf'],
      },
    ],
  },
  {
    id: 'clear',
    command: 'clear',
    description: 'Clear the conversation history',
    category: 'utility',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  },
]

export function MentionCommandDemo() {
  const [inputValue, setInputValue] = useState('')
  const [mentions, setMentions] = useState<Mention[]>([])
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; mentions: Mention[] }>
  >([])
  const [executedCommand, setExecutedCommand] = useState<string | null>(null)

  const handleChange = (value: string, newMentions: Mention[]) => {
    setInputValue(value)
    setMentions(newMentions)
  }

  const handleCommandExecute = (command: SlashCommand) => {
    setExecutedCommand(`Executed: /${command.command}`)
    setTimeout(() => setExecutedCommand(null), 3000)
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: inputValue, mentions },
      ])
      setInputValue('')
      setMentions([])
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div
        className={glassVariants({
          intensity: 'medium',
          gradient: 'purple',
          border: 'light',
          animated: 'gradient',
        })}
      >
        <div className="p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Mention & Command System
          </h2>
          <p className="text-sm text-muted-foreground">
            Try typing <code className="px-1.5 py-0.5 bg-primary/10 rounded">@</code> to mention
            users or agents, or <code className="px-1.5 py-0.5 bg-primary/10 rounded">/</code> for
            commands
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className={glassVariants({
            intensity: 'subtle',
            gradient: 'blue',
            border: 'light',
            hover: 'lift',
          })}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 rounded-lg">
            <div className="text-2xl mb-2">@</div>
            <h3 className="font-semibold mb-1">Mentions</h3>
            <p className="text-xs text-muted-foreground">
              Mention users, AI agents, or bots with fuzzy search
            </p>
          </div>
        </motion.div>

        <motion.div
          className={glassVariants({
            intensity: 'subtle',
            gradient: 'pink',
            border: 'light',
            hover: 'lift',
          })}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 rounded-lg">
            <div className="text-2xl mb-2">/</div>
            <h3 className="font-semibold mb-1">Commands</h3>
            <p className="text-xs text-muted-foreground">
              Execute slash commands with parameters
            </p>
          </div>
        </motion.div>

        <motion.div
          className={glassVariants({
            intensity: 'subtle',
            gradient: 'green',
            border: 'light',
            hover: 'lift',
          })}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 rounded-lg">
            <div className="text-2xl mb-2">⌨️</div>
            <h3 className="font-semibold mb-1">Keyboard Nav</h3>
            <p className="text-xs text-muted-foreground">
              ↑↓ navigate, ↵ or Tab select, Esc close
            </p>
          </div>
        </motion.div>
      </div>

      {/* Input Area */}
      <div
        className={glassVariants({
          intensity: 'medium',
          gradient: 'none',
          border: 'light',
        })}
      >
        <div className="p-6 rounded-xl">
          <MentionInput
            users={sampleUsers}
            commands={sampleCommands}
            value={inputValue}
            onChange={handleChange}
            onCommandExecute={handleCommandExecute}
            onSubmit={handleSubmit}
            placeholder="Type @ to mention or / for commands..."
            enableFuzzySearch
            enableContextFiltering
            maxSuggestions={8}
          />

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
            <div>
              Characters: <span className="font-mono">{inputValue.length}</span>
            </div>
            <div>
              Mentions: <span className="font-mono">{mentions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Command Executed Notification */}
      {executedCommand && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={glassVariants({
            intensity: 'strong',
            gradient: 'amber',
            border: 'light',
          })}
        >
          <div className="p-4 rounded-lg">
            <p className="text-sm font-medium">{executedCommand}</p>
          </div>
        </motion.div>
      )}

      {/* Messages Display */}
      {messages.length > 0 && (
        <div
          className={glassVariants({
            intensity: 'subtle',
            gradient: 'none',
            border: 'light',
          })}
        >
          <div className="p-6 rounded-xl space-y-3">
            <h3 className="font-semibold mb-3">Sent Messages</h3>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 rounded-lg bg-white/30 dark:bg-background/30"
              >
                <p className="text-sm">{msg.text}</p>
                {msg.mentions.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {msg.mentions.map((mention) => {
                      const user = sampleUsers.find((u) => u.id === mention.userId)
                      return (
                        <span
                          key={mention.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                        >
                          @{user?.username}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentation */}
      <div
        className={glassVariants({
          intensity: 'subtle',
          gradient: 'none',
          border: 'light',
        })}
      >
        <div className="p-6 rounded-xl">
          <h3 className="font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✨ Glassmorphism styled dropdown with backdrop blur</li>
            <li>🔍 Fuzzy search for flexible matching</li>
            <li>🎯 Context-aware filtering (prioritizes online users and agents)</li>
            <li>⌨️ Full keyboard navigation support</li>
            <li>🤖 Supports users, AI agents, and bots</li>
            <li>⚡ Real-time mention extraction and validation</li>
            <li>♿ ARIA attributes for accessibility</li>
            <li>🎨 Respects reduced motion preferences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
