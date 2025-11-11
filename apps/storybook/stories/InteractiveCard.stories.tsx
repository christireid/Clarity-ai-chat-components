import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InteractiveCard, InteractiveButton } from '@clarity-chat/react'
import { expect, within, userEvent } from '@storybook/test'

const meta = {
  title: 'Foundations/Micro-Interactions/Interactive Card',
  component: InteractiveCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-affordance card surface inspired by Revolut and Pitch storybooks. Demonstrates hover elevation, ripple feedback, and keyboard support for accessible selection grids.',
      },
    },
  },
  argTypes: {
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hoverIntensity: {
      control: 'radio',
      options: ['none', 'subtle', 'medium', 'strong'],
    },
    showRipple: { control: 'boolean' },
  },
  args: {
    interactive: true,
    hoverIntensity: 'medium',
    showRipple: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InteractiveCard>

export default meta
type Story = StoryObj<typeof meta>

export const PricingTiles: Story = {
  render: (args) => {
    const [activeTier, setActiveTier] = React.useState<'starter' | 'growth' | 'scale'>('growth')

    const tiers = [
      {
        id: 'starter' as const,
        name: 'Starter',
        price: '$0',
        badge: 'Free',
        description: 'Playground access with mocked LLM responses.',
      },
      {
        id: 'growth' as const,
        name: 'Growth',
        price: '$99',
        badge: 'Most popular',
        description: 'Production LLM routing, metrics, and guardrails.',
      },
      {
        id: 'scale' as const,
        name: 'Scale',
        price: 'Custom',
        badge: 'Approved vendors',
        description: 'Enterprise SSO, seat management, and white-glove onboarding.',
      },
    ]

    return (
      <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
        {tiers.map((tier) => (
          <InteractiveCard
            key={tier.id}
            {...args}
            interactive
            selected={activeTier === tier.id}
            onCardClick={() => setActiveTier(tier.id)}
            className="flex h-full flex-col gap-4 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {tier.badge}
              </span>
            </div>

            <p className="text-3xl font-bold text-foreground">{tier.price}</p>

            <div className="mt-auto flex items-center justify-between">
              <InteractiveButton
                variant={activeTier === tier.id ? 'primary' : 'ghost'}
                onClick={() => setActiveTier(tier.id)}
              >
                Choose plan
              </InteractiveButton>
              <span className="text-xs text-muted-foreground">Keyboard support: Enter/Space</span>
            </div>
          </InteractiveCard>
        ))}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify cards are visible
    const starterCard = canvas.getByText('Starter')
    await expect(starterCard).toBeVisible()
    
    // Test keyboard navigation
    const growthCard = canvas.getByText('Growth').closest('[role="button"]')
    if (growthCard) {
      await userEvent.tab()
      await userEvent.tab()
      await expect(growthCard).toHaveFocus()
    }
  },
}

export const StatesGallery: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <InteractiveCard interactive hoverIntensity="subtle" className="space-y-2 p-5">
        <h4 className="text-sm font-semibold">Interactive</h4>
        <p className="text-xs text-muted-foreground">Default hover elevation and ripple feedback.</p>
      </InteractiveCard>
      <InteractiveCard interactive selected className="space-y-2 p-5">
        <h4 className="text-sm font-semibold">Selected</h4>
        <p className="text-xs text-muted-foreground">Displays primary ring and top progress bar.</p>
      </InteractiveCard>
      <InteractiveCard interactive disabled className="space-y-2 p-5">
        <h4 className="text-sm font-semibold">Disabled</h4>
        <p className="text-xs text-muted-foreground">No hover or ripple, muted colors for clarity.</p>
      </InteractiveCard>
      <InteractiveCard hoverIntensity="none" className="space-y-2 p-5">
        <h4 className="text-sm font-semibold">Static Card</h4>
        <p className="text-xs text-muted-foreground">Use when you need a neutral informational surface.</p>
      </InteractiveCard>
    </div>
  ),
}
