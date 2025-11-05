import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedList, AnimatedListItem } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof AnimatedList> = {
  title: 'Components/AnimatedList',
  component: AnimatedList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Container for animated list items with stagger effects. Supports slide, fade, and scale animations with customizable timing.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AnimatedList>

const mockItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

export const Default: Story = {
  render: () => (
    <AnimatedList>
      {mockItems.map((item, index) => (
        <AnimatedListItem key={index} variant="slide">
          <div className="p-4 mb-2 bg-muted rounded-lg">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
}

export const FadeVariant: Story = {
  render: () => (
    <AnimatedList>
      {mockItems.map((item, index) => (
        <AnimatedListItem key={index} variant="fade">
          <div className="p-4 mb-2 bg-muted rounded-lg">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
}

export const ScaleVariant: Story = {
  render: () => (
    <AnimatedList>
      {mockItems.map((item, index) => (
        <AnimatedListItem key={index} variant="scale">
          <div className="p-4 mb-2 bg-muted rounded-lg">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [items, setItems] = useState(mockItems)

    const addItem = () => {
      setItems([...items, `Item ${items.length + 1}`])
    }

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index))
    }

    return (
      <div className="space-y-4">
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Item
        </button>
        <AnimatedList>
          {items.map((item, index) => (
            <AnimatedListItem key={item} variant="slide" layout>
              <div className="p-4 mb-2 bg-muted rounded-lg flex justify-between items-center">
                <span>{item}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </div>
    )
  },
}

export const FastStagger: Story = {
  render: () => (
    <AnimatedList stagger="fast">
      {mockItems.map((item, index) => (
        <AnimatedListItem key={index} variant="slide" duration="fast">
          <div className="p-4 mb-2 bg-muted rounded-lg">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
}

export const SlowStagger: Story = {
  render: () => (
    <AnimatedList stagger="slow">
      {mockItems.map((item, index) => (
        <AnimatedListItem key={index} variant="slide" duration="slow">
          <div className="p-4 mb-2 bg-muted rounded-lg">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  ),
}
