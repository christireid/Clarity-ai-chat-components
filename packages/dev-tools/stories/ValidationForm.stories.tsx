/**
 * Storybook stories for ValidationForm component
 * Demonstrates React 19 useFormStatus functionality
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ValidationForm } from '../src/react/components/validation-form'

const meta: Meta<typeof ValidationForm> = {
  title: 'Dev Tools/Validation Form',
  component: ValidationForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Validation Form using React 19 useFormStatus for form state management.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ValidationForm>

/**
 * Environment Validation
 */
export const EnvironmentValidation: Story = {
  render: () => <ValidationForm type="env" />,
}

/**
 * API Key Validation
 */
export const APIKeyValidation: Story = {
  render: () => <ValidationForm type="api-key" />,
}

/**
 * Chat Config Validation
 */
export const ChatConfigValidation: Story = {
  render: () => <ValidationForm type="chat-config" />,
}
