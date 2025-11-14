import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * Input component for text entry with various states and types.
 * 
 * **Key Features:**
 * - Multiple input types (text, email, password, number, etc.)
 * - Disabled and readonly states
 * - Error and success states
 * - Icon support
 * - Accessible labels
 * 
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Show clear error messages
 * - Use appropriate input types
 * - Provide placeholder text as hints
 */
const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text input component with support for various types and states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text</label>
        <Input type="text" placeholder="Enter text" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="you@example.com" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Number</label>
        <Input type="number" placeholder="123" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <Input type="search" placeholder="Search..." />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Input placeholder="Default state" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Disabled</label>
        <Input placeholder="Disabled" disabled />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Readonly</label>
        <Input value="Read-only value" readOnly />
      </div>
    </div>
  ),
}

export const WithValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    
    const validateEmail = (value: string) => {
      if (!value) {
        setError('Email is required')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError('Please enter a valid email')
      } else {
        setError('')
      }
    }
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            validateEmail(e.target.value)
          }}
          onBlur={() => validateEmail(email)}
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {email && !error && (
          <p className="text-sm text-green-500">✓ Valid email</p>
        )}
      </div>
    )
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input className="pl-10" placeholder="Search messages..." />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <Input className="pl-10" type="email" placeholder="you@example.com" />
        </div>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input className="h-8 text-sm" placeholder="Small" />
      <Input placeholder="Default" />
      <Input className="h-12 text-lg" placeholder="Large" />
    </div>
  ),
}

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
    })
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>
        
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create Account
        </button>
      </div>
    )
  },
}

export const SearchInput: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    
    return (
      <div className="space-y-2">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            className="pl-10 pr-10"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {query && (
          <p className="text-sm text-gray-500">Searching for "{query}"...</p>
        )}
      </div>
    )
  },
}
