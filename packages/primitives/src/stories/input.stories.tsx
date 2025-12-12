import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Input } from '../components/input'

/**
 * Input component with labels, icons, validation, and full accessibility.
 *
 * ## Features
 * - Built-in label with proper accessibility associations
 * - Left and right icon slots
 * - Clear button for easy value reset
 * - Character count with maxLength support
 * - Error and helper text with proper ARIA
 * - Multiple size and variant options
 *
 * ## Accessibility
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - aria-invalid set when error present
 * - Character count announced to screen readers
 * - Clear button has accessible label
 */
const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An enhanced input component built on shadcn/ui patterns with labels, icons,
clear button, character count, and comprehensive accessibility support.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant for validation states',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button when input has value',
    },
    showCharacterCount: {
      control: 'boolean',
      description: 'Show character count',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

/**
 * Default input state
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Input with label
 */
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Required input with label
 */
export const Required: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    required: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * All input variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input label="Default" placeholder="Default variant" variant="default" />
      <Input
        label="Error"
        placeholder="Error variant"
        variant="error"
        error="This field has an error"
      />
      <Input
        label="Success"
        placeholder="Success variant"
        variant="success"
        helperText="Looking good!"
      />
    </div>
  ),
}

/**
 * All input sizes
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input label="Small" placeholder="Small size" inputSize="sm" />
      <Input label="Default" placeholder="Default size" inputSize="default" />
      <Input label="Large" placeholder="Large size" inputSize="lg" />
    </div>
  ),
}

/**
 * Input with left icon
 */
export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    iconPosition: 'left',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Input with right icon
 */
export const WithRightIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    type: 'email',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    iconPosition: 'right',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Clearable input
 */
export const Clearable: Story = {
  render: function Render() {
    const [value, setValue] = useState('Hello World')

    return (
      <div className="w-[300px]">
        <Input
          label="Clearable Input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
          onClear={() => setValue('')}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Current value: &quot;{value}&quot;
        </p>
      </div>
    )
  },
}

/**
 * Input with character count
 */
export const WithCharacterCount: Story = {
  render: function Render() {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px]">
        <Input
          label="Bio"
          placeholder="Tell us about yourself..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={100}
          showCharacterCount
        />
      </div>
    )
  },
}

/**
 * Input with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters long',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Input with error message
 */
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Cannot edit this',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * All features combined
 */
export const AllFeatures: Story = {
  render: function Render() {
    const [value, setValue] = useState('')

    return (
      <div className="w-[300px]">
        <Input
          label="Message"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          iconPosition="left"
          clearable
          onClear={() => setValue('')}
          maxLength={200}
          showCharacterCount
          helperText="Enter your message (max 200 characters)"
          required
        />
      </div>
    )
  },
}

/**
 * Form validation example
 */
export const FormValidation: Story = {
  render: function Render() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const emailError =
      submitted && !email.includes('@') ? 'Please enter a valid email' : ''
    const passwordError =
      submitted && password.length < 8
        ? 'Password must be at least 8 characters'
        : ''

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitted(true)
      if (!emailError && !passwordError && email && password) {
        alert('Form submitted successfully!')
      }
    }

    return (
      <form onSubmit={handleSubmit} className="w-[300px] space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setSubmitted(false)
          }}
          error={emailError}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setSubmitted(false)
          }}
          error={passwordError}
          helperText={!passwordError ? 'Must be at least 8 characters' : ''}
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
      </form>
    )
  },
}

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input label="Text" type="text" placeholder="Plain text" />
      <Input label="Email" type="email" placeholder="email@example.com" />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Input label="Number" type="number" placeholder="42" />
      <Input label="Tel" type="tel" placeholder="555-1234" />
      <Input label="URL" type="url" placeholder="https://example.com" />
    </div>
  ),
}

/**
 * Hidden label (visually hidden but accessible)
 */
export const HiddenLabel: Story = {
  args: {
    label: 'Search (visually hidden)',
    placeholder: 'Search...',
    hideLabel: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    iconPosition: 'left',
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <p className="text-sm text-muted-foreground mb-2">
          The label is visually hidden but still accessible to screen readers.
        </p>
        <Story />
      </div>
    ),
  ],
}

/**
 * Accessibility demo
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center max-w-md">
      <p className="text-sm text-muted-foreground text-center">
        Use a screen reader to test the accessibility features. Labels are
        properly associated, errors are announced, and character counts use live
        regions.
      </p>
      <div className="w-[300px] space-y-4">
        <Input
          label="Accessible Email"
          type="email"
          placeholder="Enter your email"
          error="This email is already registered"
          aria-describedby="email-help"
        />
        <p id="email-help" className="text-xs text-muted-foreground">
          We&apos;ll never share your email with anyone.
        </p>
        <Input
          label="Character Limited"
          placeholder="Type something..."
          maxLength={50}
          showCharacterCount
          helperText="Characters remaining are announced to screen readers"
        />
      </div>
    </div>
  ),
}
