import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow } from '@clarity-chat/react'
import { StatusBadge } from '../../.storybook/blocks'
import React, { useState } from 'react'

const meta: Meta = {
  title: 'Welcome/Playground',
  parameters: {
    docs: {
      description: {
        component: `
# Interactive Playground

Try out Clarity Chat components in this interactive playground. Experiment with different configurations, themes, and features to see how they work together.

## What You Can Do

- **Test Components** - Try different component combinations
- **Explore Themes** - Switch between 11+ built-in themes
- **Customize Props** - Adjust component properties in real-time
- **Copy Code** - Copy working examples to your project

## Getting Started

Use the controls below to configure the components and see live updates. All examples are ready to use and can be copied directly into your application.
        `,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const InteractiveChat: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: '1',
        role: 'assistant' as const,
        content: 'Welcome to the Clarity Chat Playground! Try sending a message below.',
        timestamp: new Date(Date.now() - 60000),
      },
    ])

    const handleSubmit = (content: string) => {
      if (!content.trim()) return

      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: `You said: "${content}". This is a demo playground - messages don't actually get sent to an AI. Try exploring other stories to see real examples!`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 500)
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Interactive Playground</h2>
            <StatusBadge status="experimental" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Test drive Clarity Chat components in this live playground. Try sending messages, switching themes, and
            exploring different configurations.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ChatWindow 
            className="h-[600px]"
            messages={messages}
            onSendMessage={handleSubmit}
            isLoading={false}
          />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span> Try These Next
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Components:</strong> Explore individual components in the Components section
            </li>
            <li>
              <strong>Themes:</strong> Check out the Foundation/Colors & Themes story to see all available themes
            </li>
            <li>
              <strong>Hooks:</strong> Learn how to use hooks like useChat and useClarityChat
            </li>
            <li>
              <strong>Examples:</strong> See complete examples of real-world use cases
            </li>
          </ul>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for experimenting with Clarity Chat components.',
      },
    },
  },
}
