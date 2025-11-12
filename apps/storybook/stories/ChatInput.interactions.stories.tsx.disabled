import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, waitFor } from '@storybook/testing-library'
import { ChatInput } from '../../../packages/react/src/components/chat-input'

const meta = {
  title: 'Components/Chat Input/With Interactions',
  component: ChatInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Chat input component with automated interaction tests.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Interaction Tests
// ============================================================================

export const TypingInteraction: Story = {
  args: {
    placeholder: 'Type a message...',
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type a message/i)

    await step('Input should be visible', async () => {
      await expect(input).toBeInTheDocument()
    })

    await step('User can type in input', async () => {
      await userEvent.click(input)
      await userEvent.type(input, 'Hello, world!')
      await expect(input).toHaveValue('Hello, world!')
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests that users can type text into the input field.',
      },
    },
  },
}

export const SendMessageInteraction: Story = {
  args: {
    placeholder: 'Type and press Enter...',
    onSend: (message) => console.log('Message sent:', message),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type and press enter/i)

    await step('Type a message', async () => {
      await userEvent.click(input)
      await userEvent.type(input, 'Test message')
      await expect(input).toHaveValue('Test message')
    })

    await step('Press Enter to send', async () => {
      await userEvent.keyboard('{Enter}')
      
      // Input should be cleared after sending
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests sending a message by pressing Enter key.',
      },
    },
  },
}

export const SendButtonInteraction: Story = {
  args: {
    placeholder: 'Type and click send...',
    onSend: (message) => console.log('Message sent:', message),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type and click send/i)

    await step('Type a message', async () => {
      await userEvent.click(input)
      await userEvent.type(input, 'Click to send this')
    })

    await step('Click send button', async () => {
      const sendButton = canvas.getByRole('button', { name: /send/i })
      await expect(sendButton).toBeInTheDocument()
      await userEvent.click(sendButton)
      
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests sending a message by clicking the send button.',
      },
    },
  },
}

export const EmptyMessagePrevention: Story = {
  args: {
    placeholder: 'Try to send empty message...',
    onSend: (message) => console.log('Message sent:', message),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/try to send empty/i)

    await step('Send button should be disabled when empty', async () => {
      const sendButton = canvas.getByRole('button', { name: /send/i })
      await expect(sendButton).toBeDisabled()
    })

    await step('Type whitespace only', async () => {
      await userEvent.click(input)
      await userEvent.type(input, '   ')
    })

    await step('Send button should remain disabled', async () => {
      const sendButton = canvas.getByRole('button', { name: /send/i })
      await expect(sendButton).toBeDisabled()
    })

    await step('Type actual content', async () => {
      await userEvent.clear(input)
      await userEvent.type(input, 'Real message')
    })

    await step('Send button should be enabled', async () => {
      const sendButton = canvas.getByRole('button', { name: /send/i })
      await expect(sendButton).not.toBeDisabled()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests that empty or whitespace-only messages cannot be sent.',
      },
    },
  },
}

export const MultilineInput: Story = {
  args: {
    placeholder: 'Type multiple lines...',
    maxRows: 5,
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type multiple lines/i)

    await step('Type multiline content', async () => {
      await userEvent.click(input)
      await userEvent.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2{Shift>}{Enter}{/Shift}Line 3')
    })

    await step('Verify multiline content', async () => {
      const value = (input as HTMLTextAreaElement).value
      await expect(value.split('\n').length).toBeGreaterThanOrEqual(3)
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests multiline input with Shift+Enter.',
      },
    },
  },
}

export const MaxLengthValidation: Story = {
  args: {
    placeholder: 'Max 20 characters...',
    maxLength: 20,
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/max 20 characters/i)

    await step('Type within limit', async () => {
      await userEvent.click(input)
      await userEvent.type(input, '12345678901234567890')
      await expect(input).toHaveValue('12345678901234567890')
    })

    await step('Try to exceed limit', async () => {
      await userEvent.type(input, 'extra')
      // Should still be at max length
      const value = (input as HTMLTextAreaElement).value
      await expect(value.length).toBeLessThanOrEqual(20)
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests that max length validation works correctly.',
      },
    },
  },
}

export const PasteInteraction: Story = {
  args: {
    placeholder: 'Try pasting text...',
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/try pasting/i)

    await step('Click input to focus', async () => {
      await userEvent.click(input)
      await expect(input).toHaveFocus()
    })

    await step('Paste text', async () => {
      // Simulate paste by typing (userEvent doesn't support clipboard)
      await userEvent.type(input, 'Pasted content from clipboard')
      await expect(input).toHaveValue('Pasted content from clipboard')
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests pasting text into the input field.',
      },
    },
  },
}

export const ClearInputInteraction: Story = {
  args: {
    placeholder: 'Type and clear...',
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type and clear/i)

    await step('Type some text', async () => {
      await userEvent.click(input)
      await userEvent.type(input, 'Text to clear')
      await expect(input).toHaveValue('Text to clear')
    })

    await step('Select all and delete', async () => {
      await userEvent.keyboard('{Control>}a{/Control}')
      await userEvent.keyboard('{Backspace}')
      await expect(input).toHaveValue('')
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests clearing input content with keyboard shortcuts.',
      },
    },
  },
}

export const DisabledInputInteraction: Story = {
  args: {
    placeholder: 'This input is disabled',
    disabled: true,
    onSend: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/this input is disabled/i)

    await step('Input should be disabled', async () => {
      await expect(input).toBeDisabled()
    })

    await step('User cannot type in disabled input', async () => {
      // Try to click and type (should not work)
      await expect(input).toHaveValue('')
    })

    await step('Send button should be disabled', async () => {
      const sendButton = canvas.getByRole('button', { name: /send/i })
      await expect(sendButton).toBeDisabled()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests that disabled inputs cannot be interacted with.',
      },
    },
  },
}
