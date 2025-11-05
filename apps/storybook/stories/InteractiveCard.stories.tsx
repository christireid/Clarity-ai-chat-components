import type { Meta, StoryObj } from '@storybook/react'
import { InteractiveCard } from '@clarity-chat/react'

/**
 * InteractiveCard provides an enhanced card with hover effects and interactions.
 * 
 * **Key Features:**
 * - Hover animations
 * - Click interactions
 * - Visual feedback
 * - Customizable actions
 * 
 * **Use Cases:**
 * - Feature showcases
 * - Option selection
 * - Navigation cards
 * - Interactive galleries
 */
const meta = {
  title: 'Components/InteractiveCard',
  component: InteractiveCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced card component with hover effects and interactive behaviors.',
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
} satisfies Meta<typeof InteractiveCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Interactive Card',
    description: 'Hover to see the effect',
    onClick: () => alert('Card clicked!'),
  },
}

export const WithIcon: Story = {
  args: {
    title: 'AI Assistant',
    description: 'Get help from our AI-powered assistant',
    icon: '🤖',
    onClick: () => console.log('AI Assistant clicked'),
  },
}

export const FeatureCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <InteractiveCard
        title="Fast Response"
        description="Get answers in milliseconds"
        icon="⚡"
        onClick={() => console.log('Fast Response')}
      />
      <InteractiveCard
        title="Secure"
        description="Enterprise-grade security"
        icon="🔒"
        onClick={() => console.log('Secure')}
      />
      <InteractiveCard
        title="Scalable"
        description="Grows with your needs"
        icon="📈"
        onClick={() => console.log('Scalable')}
      />
      <InteractiveCard
        title="24/7 Support"
        description="Always here to help"
        icon="💬"
        onClick={() => console.log('Support')}
      />
    </div>
  ),
}

export const WithImage: Story = {
  args: {
    title: 'Product Feature',
    description: 'Explore our latest innovation',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    onClick: () => console.log('Product clicked'),
  },
}

export const SelectableCards: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null)
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Selected: {selected || 'None'}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {['Option A', 'Option B', 'Option C', 'Option D'].map((option) => (
            <InteractiveCard
              key={option}
              title={option}
              description={`Select ${option}`}
              selected={selected === option}
              onClick={() => setSelected(option)}
            />
          ))}
        </div>
      </div>
    )
  },
}
