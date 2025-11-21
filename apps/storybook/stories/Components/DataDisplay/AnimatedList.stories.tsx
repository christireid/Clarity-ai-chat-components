import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  AnimatedList,
  AnimatedListItem,
  FadePresence,
  SlidePresence,
  ScalePresence,
  ConditionalPresence,
} from '@clarity-chat/react'

const demoItems = ['Define success metrics', 'Sync with product', 'Review transcripts', 'Ship updates']

const meta = {
  title: 'Components/DataDisplay/AnimatedList',
  component: AnimatedList,
  subcomponents: {
    AnimatedListItem,
    FadePresence,
    SlidePresence,
    ScalePresence,
    ConditionalPresence,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Motion primitives for sequencing chat UI affordances. Inspired by Storybook Design System, Linear, and GitHub Copilot Playbooks—each story highlights interactive guidance, accessibility, and motion guidelines.',
      },
    },
  },
  argTypes: {
    stagger: {
      control: 'select',
      options: ['instant', 'fast', 'normal', 'slow'],
      description: 'Timing between child animations',
    },
    delay: {
      control: 'number',
      description: 'Delay (ms) before the animation starts',
    },
    className: {
      control: false,
    },
  },
  args: {
    stagger: 'normal',
    delay: 0,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatedList>

export default meta
type Story = StoryObj<typeof meta>

export const TaskQueue: Story = {
  render: (args) => {
    const [items, setItems] = React.useState(demoItems)

    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 bg-muted/40 p-10">
        <AnimatedList {...args} className="w-full max-w-lg space-y-3">
          {items.map((item, index) => (
            <AnimatedListItem
              key={item}
              variant={index % 2 === 0 ? 'slide' : 'fade'}
              duration={index % 2 === 0 ? 'fast' : 'normal'}
              className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <p className="text-xs text-muted-foreground">Sequenced with {index % 2 === 0 ? 'slide' : 'fade'} motion</p>
                </div>
              </div>
            </AnimatedListItem>
          ))}
        </AnimatedList>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1 text-sm hover:bg-accent"
            onClick={() =>
              setItems((prev) => [
                `New insight ${prev.length + 1}`,
                ...prev,
              ])
            }
          >
            Prepend Item
          </button>
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1 text-sm hover:bg-accent"
            onClick={() =>
              setItems((prev) => [...prev, `New follow-up ${prev.length + 1}`])
            }
          >
            Append Item
          </button>
          <button
            type="button"
            className="rounded-lg border border-destructive bg-background px-3 py-1 text-sm text-destructive hover:bg-destructive/10"
            onClick={() => setItems((prev) => prev.slice(1))}
          >
            Remove Oldest
          </button>
        </div>
      </div>
    )
  },
}

export const PresencePatterns: Story = {
  name: 'Presence Wrappers',
  render: () => {
    const [active, setActive] = React.useState<'fade' | 'slide' | 'scale'>('fade')
    const [showDetails, setShowDetails] = React.useState(true)

    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
        <div className="flex flex-wrap items-center gap-3">
          {(['fade', 'slide', 'scale'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full border px-4 py-1 text-sm capitalize transition ${
                active === option
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setActive(option)}
            >
              {option}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={() => setShowDetails((prev) => !prev)}
            />
            Toggle content
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FadePresence className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div>
              <h3 className="mb-2 text-sm font-semibold">FadePresence</h3>
              {showDetails && <p className="text-xs text-muted-foreground">Use for low-affordance UI such as toolbars.</p>}
            </div>
          </FadePresence>
          <SlidePresence
            direction={active === 'slide' ? 'up' : 'right'}
            className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"
          >
            <div>
              <h3 className="mb-2 text-sm font-semibold">SlidePresence</h3>
              {showDetails && (
                <p className="text-xs text-muted-foreground">Ideal for banners, toasts, and drawers.</p>
              )}
            </div>
          </SlidePresence>
          <ScalePresence className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div>
              <h3 className="mb-2 text-sm font-semibold">ScalePresence</h3>
              {showDetails && (
                <p className="text-xs text-muted-foreground">Use sparingly for celebratory UI moments.</p>
              )}
            </div>
          </ScalePresence>
        </div>

        <ConditionalPresence
          show={showDetails}
          variant={active}
          className="rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Conditional presence ensures exit transitions respect accessibility preferences and user intent.
          </p>
        </ConditionalPresence>
      </div>
    )
  },
}
