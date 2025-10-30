import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * Enhanced Button component with ripple effect, loading states, and success/error feedback.
 * 
 * **Key Features:**
 * - Material Design ripple effect on click
 * - Loading state with spinner animation
 * - Success state with checkmark and green glow
 * - Error state with shake animation and red color
 * - All standard button variants (default, destructive, outline, secondary, ghost, link)
 * - Accessible with proper ARIA attributes and keyboard navigation
 * - Automatic state reset after duration
 * 
 * **Design Philosophy:**
 * - Delightful by Default: Tactile feedback makes interactions feel responsive
 * - Minimal but Modern: Clean design with thoughtful animations
 * - Intuitive: Visual feedback confirms actions
 */
const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with enhanced UX through microanimations and state management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'error'],
      description: 'Button visual style',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
    ripple: {
      control: 'boolean',
      description: 'Enable Material Design ripple effect',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Variants
// ============================================================================

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const IconButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="icon" variant="default">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
      <Button size="icon" variant="outline">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
      <Button size="icon" variant="ghost">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </Button>
    </div>
  ),
}

// ============================================================================
// States
// ============================================================================

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const SuccessState: Story = {
  args: {
    children: 'Success!',
    state: 'success',
  },
}

export const ErrorState: Story = {
  args: {
    children: 'Error!',
    state: 'error',
  },
}

// ============================================================================
// Interactive Examples
// ============================================================================

export const InteractiveStates: Story = {
  render: () => {
    const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    
    const handleClick = () => {
      setButtonState('loading')
      
      // Simulate async operation
      setTimeout(() => {
        setButtonState('success')
        
        // Auto-reset after showing success
        setTimeout(() => {
          setButtonState('idle')
        }, 2000)
      }, 2000)
    }
    
    return (
      <div className="flex flex-col gap-4">
        <Button 
          state={buttonState}
          onClick={handleClick}
          disabled={buttonState !== 'idle'}
        >
          {buttonState === 'idle' && 'Click me'}
          {buttonState === 'loading' && 'Processing...'}
          {buttonState === 'success' && 'Done!'}
          {buttonState === 'error' && 'Failed'}
        </Button>
        <p className="text-sm text-gray-600">
          State: <strong>{buttonState}</strong>
        </p>
      </div>
    )
  },
}

export const SimulateError: Story = {
  render: () => {
    const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    
    const handleClick = () => {
      setButtonState('loading')
      
      // Simulate async operation that fails
      setTimeout(() => {
        setButtonState('error')
        
        // Auto-reset after showing error
        setTimeout(() => {
          setButtonState('idle')
        }, 2000)
      }, 2000)
    }
    
    return (
      <div className="flex flex-col gap-4">
        <Button 
          state={buttonState}
          onClick={handleClick}
          disabled={buttonState !== 'idle'}
        >
          {buttonState === 'idle' && 'Submit'}
          {buttonState === 'loading' && 'Submitting...'}
          {buttonState === 'success' && 'Submitted!'}
          {buttonState === 'error' && 'Failed!'}
        </Button>
        <p className="text-sm text-gray-600">
          State: <strong>{buttonState}</strong>
        </p>
      </div>
    )
  },
}

export const ManualStateControl: Story = {
  render: () => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    
    return (
      <div className="flex flex-col gap-4">
        <Button state={state}>
          {state === 'idle' && 'Button'}
          {state === 'loading' && 'Loading...'}
          {state === 'success' && 'Success!'}
          {state === 'error' && 'Error!'}
        </Button>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setState('idle')}>
            Idle
          </Button>
          <Button size="sm" variant="outline" onClick={() => setState('loading')}>
            Loading
          </Button>
          <Button size="sm" variant="outline" onClick={() => setState('success')}>
            Success
          </Button>
          <Button size="sm" variant="outline" onClick={() => setState('error')}>
            Error
          </Button>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Ripple Effect
// ============================================================================

export const RippleEffect: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button ripple>With Ripple (default)</Button>
        <Button ripple={false}>Without Ripple</Button>
      </div>
      <p className="text-sm text-gray-600 max-w-md">
        Click the buttons to see the Material Design ripple effect. 
        The ripple provides tactile feedback and makes interactions feel responsive.
      </p>
    </div>
  ),
}

export const RippleColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default" rippleColor="rgba(255, 255, 255, 0.5)">
        White Ripple
      </Button>
      <Button variant="outline" rippleColor="rgba(59, 130, 246, 0.3)">
        Blue Ripple
      </Button>
      <Button variant="destructive" rippleColor="rgba(255, 255, 255, 0.4)">
        Default Ripple
      </Button>
      <Button variant="ghost" rippleColor="rgba(0, 0, 0, 0.2)">
        Dark Ripple
      </Button>
    </div>
  ),
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const FormSubmit: Story = {
  render: () => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    
    const handleSubmit = async () => {
      setState('loading')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Random success/error
      const success = Math.random() > 0.3
      setState(success ? 'success' : 'error')
      
      // Reset after 2 seconds
      setTimeout(() => setState('idle'), 2000)
    }
    
    return (
      <div className="flex flex-col gap-4 p-6 border rounded-lg">
        <h3 className="font-semibold">Contact Form</h3>
        <input 
          type="text" 
          placeholder="Name" 
          className="px-3 py-2 border rounded"
          disabled={state !== 'idle'}
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="px-3 py-2 border rounded"
          disabled={state !== 'idle'}
        />
        <textarea 
          placeholder="Message" 
          className="px-3 py-2 border rounded"
          rows={3}
          disabled={state !== 'idle'}
        />
        <Button 
          state={state}
          onClick={handleSubmit}
          disabled={state !== 'idle'}
        >
          {state === 'idle' && 'Submit'}
          {state === 'loading' && 'Sending...'}
          {state === 'success' && 'Sent!'}
          {state === 'error' && 'Failed to send'}
        </Button>
      </div>
    )
  },
}

export const SaveAction: Story = {
  render: () => {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    
    const handleSave = async () => {
      setIsSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    
    return (
      <div className="flex items-center gap-4">
        <Button 
          state={isSaving ? 'loading' : saved ? 'success' : 'idle'}
          onClick={handleSave}
          disabled={isSaving || saved}
        >
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 animate-[fadeIn_0.3s_ease-out]">
            Your changes have been saved
          </span>
        )}
      </div>
    )
  },
}

export const DeleteConfirmation: Story = {
  render: () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleted, setDeleted] = useState(false)
    
    const handleDelete = async () => {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsDeleting(false)
      setDeleted(true)
      setTimeout(() => {
        setDeleted(false)
        setShowConfirm(false)
      }, 2000)
    }
    
    if (deleted) {
      return (
        <div className="flex items-center gap-2 text-green-600 animate-[fadeIn_0.3s_ease-out]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Item deleted successfully
        </div>
      )
    }
    
    if (!showConfirm) {
      return (
        <Button 
          variant="destructive"
          onClick={() => setShowConfirm(true)}
        >
          Delete Item
        </Button>
      )
    }
    
    return (
      <div className="flex flex-col gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-sm font-medium text-red-900">
          Are you sure you want to delete this item?
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            state={isDeleting ? 'loading' : 'idle'}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Button Groups
// ============================================================================

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">1</Button>
        <Button>2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
      
      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <Button size="icon" variant="outline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  ),
}

// ============================================================================
// With Icons
// ============================================================================

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </Button>
      
      <Button variant="destructive">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </Button>
      
      <Button variant="outline">
        Download
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </Button>
    </div>
  ),
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button aria-label="Save document">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </Button>
      
      <Button disabled aria-label="This action is currently unavailable">
        Disabled with aria-label
      </Button>
      
      <Button loading aria-label="Loading content, please wait">
        Loading with aria-label
      </Button>
      
      <p className="text-sm text-gray-600 max-w-md">
        All buttons have proper focus states (try pressing Tab), 
        ARIA labels for screen readers, and keyboard navigation support (Enter/Space to activate).
      </p>
    </div>
  ),
}
