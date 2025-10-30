import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from '@clarity-chat/react'

/**
 * Enhanced CopyButton component with success state animation and ripple effect.
 * 
 * **Key Features:**
 * - One-click copy to clipboard
 * - Visual success feedback with checkmark
 * - Success state with green color and glow animation
 * - Material Design ripple effect
 * - Accessible with ARIA labels
 * - Customizable text and icons
 * - Icon-only mode for compact layouts
 * 
 * **Design Philosophy:**
 * - Delightful by Default: Success animation provides clear feedback
 * - Minimal but Modern: Clean design with purposeful animations
 * - Intuitive: Icon changes from copy to checkmark
 */
const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A button that copies text to clipboard with visual feedback. Perfect for code snippets, sharing links, and any content users might want to copy.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to copy to clipboard',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Show only icon without text labels',
    },
    copyText: {
      control: 'text',
      description: 'Custom text for copy state',
    },
    copiedText: {
      control: 'text',
      description: 'Custom text for copied state',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Button size',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'secondary'],
      description: 'Button visual style',
    },
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    text: 'Hello, World!',
  },
}

export const IconOnly: Story = {
  args: {
    text: 'This is the text that will be copied',
    iconOnly: true,
  },
}

export const CustomText: Story = {
  args: {
    text: 'npx create-clarity-chat-app',
    copyText: 'Copy Command',
    copiedText: 'Command Copied!',
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CopyButton text="Small" size="sm" />
      <CopyButton text="Default" size="default" />
      <CopyButton text="Large" size="lg" />
    </div>
  ),
}

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CopyButton text="Small icon" size="sm" iconOnly />
      <CopyButton text="Default icon" size="default" iconOnly />
      <CopyButton text="Large icon" size="lg" iconOnly />
    </div>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CopyButton text="Default variant" variant="default" />
      <CopyButton text="Outline variant" variant="outline" />
      <CopyButton text="Ghost variant" variant="ghost" />
      <CopyButton text="Secondary variant" variant="secondary" />
    </div>
  ),
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const CodeSnippet: Story = {
  render: () => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg pr-14">
        <code>
{`npm install @clarity-chat/react
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  return <ChatWindow />
}`}
        </code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton 
          text={`npm install @clarity-chat/react
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  return <ChatWindow />
}`}
          iconOnly
          variant="ghost"
        />
      </div>
    </div>
  ),
}

export const ShareLink: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold">Share this page</h3>
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value="https://clarity-chat.com/docs/getting-started"
          readOnly
          className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
        />
        <CopyButton 
          text="https://clarity-chat.com/docs/getting-started"
          iconOnly
        />
      </div>
    </div>
  ),
}

export const APIKey: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 border rounded-lg max-w-md">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">API Key</h3>
        <span className="text-xs text-green-600 font-medium">Active</span>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono overflow-hidden text-ellipsis">
          sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
        </code>
        <CopyButton 
          text="sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
          iconOnly
        />
      </div>
      <p className="text-xs text-gray-600">
        Keep this key secret. Anyone with this key can make API requests on your behalf.
      </p>
    </div>
  ),
}

export const MessageContent: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4 border rounded-lg max-w-lg bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <p className="text-gray-700">
            Here's a solution to your problem: You can use the useState hook to manage local component state. 
            Import it from React like this: import  useState  from 'react'
          </p>
        </div>
        <CopyButton 
          text="Here's a solution to your problem: You can use the useState hook to manage local component state. Import it from React like this: import { useState } from 'react'"
          iconOnly
          variant="ghost"
          size="sm"
        />
      </div>
    </div>
  ),
}

export const CommandLine: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm">
        <span>$ npm install @clarity-chat/react</span>
        <CopyButton 
          text="npm install @clarity-chat/react"
          iconOnly
          variant="ghost"
        />
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm">
        <span>$ pnpm add @clarity-chat/react</span>
        <CopyButton 
          text="pnpm add @clarity-chat/react"
          iconOnly
          variant="ghost"
        />
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm">
        <span>$ yarn add @clarity-chat/react</span>
        <CopyButton 
          text="yarn add @clarity-chat/react"
          iconOnly
          variant="ghost"
        />
      </div>
    </div>
  ),
}

export const MultipleItems: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 max-w-2xl">
      <div className="flex items-center gap-2 p-3 border rounded">
        <div className="flex-1">
          <div className="text-sm font-medium">User ID</div>
          <div className="text-xs text-gray-600 font-mono">user_abc123</div>
        </div>
        <CopyButton text="user_abc123" iconOnly />
      </div>
      
      <div className="flex items-center gap-2 p-3 border rounded">
        <div className="flex-1">
          <div className="text-sm font-medium">Session ID</div>
          <div className="text-xs text-gray-600 font-mono">sess_def456</div>
        </div>
        <CopyButton text="sess_def456" iconOnly />
      </div>
      
      <div className="flex items-center gap-2 p-3 border rounded">
        <div className="flex-1">
          <div className="text-sm font-medium">Auth Token</div>
          <div className="text-xs text-gray-600 font-mono">tok_ghi789...</div>
        </div>
        <CopyButton text="tok_ghi789jkl012mno345" iconOnly />
      </div>
      
      <div className="flex items-center gap-2 p-3 border rounded">
        <div className="flex-1">
          <div className="text-sm font-medium">Webhook URL</div>
          <div className="text-xs text-gray-600 font-mono">https://...</div>
        </div>
        <CopyButton text="https://api.example.com/webhooks/abc123" iconOnly />
      </div>
    </div>
  ),
}

// ============================================================================
// Callback Example
// ============================================================================

export const WithCallback: Story = {
  render: () => {
    const handleCopy = () => {
      console.log('Text copied to clipboard!')
      // Could also show a toast notification, track analytics, etc.
    }
    
    return (
      <div className="flex flex-col gap-3">
        <CopyButton 
          text="This triggers a callback when copied"
          onCopy={handleCopy}
        />
        <p className="text-sm text-gray-600">
          Open the browser console to see the callback in action
        </p>
      </div>
    )
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center gap-2">
        <CopyButton text="Accessible button with proper ARIA labels" />
      </div>
      
      <div className="flex items-center gap-2">
        <CopyButton text="Icon only also has ARIA labels" iconOnly />
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm">
        <strong>Accessibility Features:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Proper ARIA labels for screen readers</li>
          <li>Keyboard accessible (Tab to focus, Enter/Space to activate)</li>
          <li>Clear visual feedback on focus</li>
          <li>Success state announced to screen readers</li>
          <li>Color-independent feedback (icon changes)</li>
        </ul>
      </div>
    </div>
  ),
}

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 border rounded-lg">
      <h3 className="font-semibold">Try it yourself!</h3>
      <textarea 
        className="w-full h-32 px-3 py-2 border rounded"
        placeholder="Enter text to copy..."
        id="playground-text"
        defaultValue="Edit this text and click the copy button below"
      />
      <CopyButton 
        text={(typeof document !== 'undefined' && (document.getElementById('playground-text') as HTMLTextAreaElement)?.value) || 'Default text'}
      />
    </div>
  ),
}
