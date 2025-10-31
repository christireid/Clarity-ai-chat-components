import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  CollapsibleSection,
  Accordion,
  ExpandableListItem,
} from '../../../packages/react/src/components/collapsible-section'

const meta: Meta<typeof CollapsibleSection> = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animated expand/collapse component with smooth height transitions. Perfect for accordions, FAQ sections, and expandable list items.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CollapsibleSection>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <CollapsibleSection trigger={<span>Click to expand</span>}>
      <p className="text-sm text-muted-foreground">
        This is the collapsible content. It animates smoothly when opening and closing.
      </p>
    </CollapsibleSection>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <CollapsibleSection trigger={<span>Already Open</span>} defaultOpen={true}>
      <p className="text-sm text-muted-foreground">
        This section starts in the open state.
      </p>
    </CollapsibleSection>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
        <CollapsibleSection
          open={open}
          onOpenChange={setOpen}
          trigger={<span>Controlled Section</span>}
        >
          <p className="text-sm text-muted-foreground">
            This section is controlled by external state. Current state: {open ? 'open' : 'closed'}
          </p>
        </CollapsibleSection>
      </div>
    )
  },
}

// ============================================================================
// Animation Speeds
// ============================================================================

export const FastAnimation: Story = {
  render: () => (
    <CollapsibleSection trigger={<span>Fast Animation (0.15s)</span>} duration={0.15}>
      <p className="text-sm text-muted-foreground">
        This section opens and closes quickly with a 150ms duration.
      </p>
    </CollapsibleSection>
  ),
}

export const SlowAnimation: Story = {
  render: () => (
    <CollapsibleSection trigger={<span>Slow Animation (0.6s)</span>} duration={0.6}>
      <p className="text-sm text-muted-foreground">
        This section opens and closes slowly with a 600ms duration.
      </p>
    </CollapsibleSection>
  ),
}

// ============================================================================
// Content Examples
// ============================================================================

export const WithRichContent: Story = {
  render: () => (
    <CollapsibleSection
      trigger={
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <div>
            <div className="font-semibold">Product Details</div>
            <div className="text-xs text-muted-foreground">Click to see specifications</div>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">Brand:</div>
          <div className="text-muted-foreground">Acme Corp</div>
          <div className="font-medium">Model:</div>
          <div className="text-muted-foreground">XR-2000</div>
          <div className="font-medium">Color:</div>
          <div className="text-muted-foreground">Space Gray</div>
          <div className="font-medium">Weight:</div>
          <div className="text-muted-foreground">1.2 kg</div>
        </div>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Add to Cart
        </button>
      </div>
    </CollapsibleSection>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <CollapsibleSection trigger={<span>Long Content Example</span>}>
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur.
        </p>
      </div>
    </CollapsibleSection>
  ),
}

// ============================================================================
// Accordion Examples
// ============================================================================

export const BasicAccordion: Story = {
  render: () => {
    const items = [
      {
        id: '1',
        trigger: <span>What is React?</span>,
        content: (
          <p className="text-sm text-muted-foreground">
            React is a JavaScript library for building user interfaces, maintained by Facebook
            and a community of developers.
          </p>
        ),
      },
      {
        id: '2',
        trigger: <span>What is Framer Motion?</span>,
        content: (
          <p className="text-sm text-muted-foreground">
            Framer Motion is a production-ready motion library for React that makes it easy to
            create smooth animations.
          </p>
        ),
      },
      {
        id: '3',
        trigger: <span>What is TypeScript?</span>,
        content: (
          <p className="text-sm text-muted-foreground">
            TypeScript is a typed superset of JavaScript that compiles to plain JavaScript,
            providing better tooling and type safety.
          </p>
        ),
      },
    ]

    return <Accordion items={items} />
  },
}

export const MultipleOpenAccordion: Story = {
  render: () => {
    const items = [
      {
        id: '1',
        trigger: <span>Section 1 (Multiple can be open)</span>,
        content: <p className="text-sm text-muted-foreground">Content for section 1</p>,
      },
      {
        id: '2',
        trigger: <span>Section 2</span>,
        content: <p className="text-sm text-muted-foreground">Content for section 2</p>,
      },
      {
        id: '3',
        trigger: <span>Section 3</span>,
        content: <p className="text-sm text-muted-foreground">Content for section 3</p>,
      },
    ]

    return <Accordion items={items} allowMultiple={true} defaultOpenId="1" />
  },
}

// ============================================================================
// Expandable List Item
// ============================================================================

export const ExpandableList: Story = {
  render: () => (
    <div className="space-y-2">
      <ExpandableListItem
        icon={<span className="text-xl">📧</span>}
        title="New Messages"
        badge={<span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">3</span>}
      >
        <div className="space-y-2">
          <div className="p-2 bg-muted rounded text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-xs text-muted-foreground">Meeting at 3pm?</div>
          </div>
          <div className="p-2 bg-muted rounded text-sm">
            <div className="font-medium">Jane Smith</div>
            <div className="text-xs text-muted-foreground">Code review complete</div>
          </div>
          <div className="p-2 bg-muted rounded text-sm">
            <div className="font-medium">Bob Johnson</div>
            <div className="text-xs text-muted-foreground">Deployment successful</div>
          </div>
        </div>
      </ExpandableListItem>

      <ExpandableListItem
        icon={<span className="text-xl">📁</span>}
        title="Recent Files"
        badge={<span className="text-xs text-muted-foreground">5 items</span>}
        defaultOpen={true}
      >
        <div className="space-y-1 text-sm">
          <div className="p-2 hover:bg-muted rounded cursor-pointer">document.pdf</div>
          <div className="p-2 hover:bg-muted rounded cursor-pointer">image.png</div>
          <div className="p-2 hover:bg-muted rounded cursor-pointer">spreadsheet.xlsx</div>
        </div>
      </ExpandableListItem>

      <ExpandableListItem
        icon={<span className="text-xl">⚙️</span>}
        title="Settings"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">Enable notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Dark mode</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">Auto-save</span>
          </label>
        </div>
      </ExpandableListItem>
    </div>
  ),
}

// ============================================================================
// Real-World Examples
// ============================================================================

export const FAQSection: Story = {
  render: () => {
    const faqItems = [
      {
        id: 'shipping',
        trigger: (
          <div className="text-left">
            <div className="font-semibold">How long does shipping take?</div>
          </div>
        ),
        content: (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Standard shipping typically takes 5-7 business days.</p>
            <p>Express shipping is available and takes 2-3 business days.</p>
            <p>Free shipping is available on orders over $50.</p>
          </div>
        ),
      },
      {
        id: 'returns',
        trigger: (
          <div className="text-left">
            <div className="font-semibold">What is your return policy?</div>
          </div>
        ),
        content: (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>We accept returns within 30 days of purchase.</p>
            <p>Items must be in original condition with tags attached.</p>
            <p>Return shipping is free for defective items.</p>
          </div>
        ),
      },
      {
        id: 'warranty',
        trigger: (
          <div className="text-left">
            <div className="font-semibold">Do products come with a warranty?</div>
          </div>
        ),
        content: (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>All products come with a 1-year manufacturer warranty.</p>
            <p>Extended warranties are available for purchase.</p>
            <p>Warranty covers manufacturing defects and malfunctions.</p>
          </div>
        ),
      },
    ]

    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion items={faqItems} />
      </div>
    )
  },
}

export const ProductFeatures: Story = {
  render: () => (
    <div className="max-w-2xl space-y-2">
      <CollapsibleSection
        trigger={
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="text-left">
              <div className="font-semibold">Performance</div>
              <div className="text-xs text-muted-foreground">Lightning-fast speeds</div>
            </div>
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>50% faster than previous generation</li>
          <li>Optimized for modern workflows</li>
          <li>Hardware acceleration support</li>
          <li>Efficient memory usage</li>
        </ul>
      </CollapsibleSection>

      <CollapsibleSection
        trigger={
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div className="text-left">
              <div className="font-semibold">Design</div>
              <div className="text-xs text-muted-foreground">Beautiful and modern</div>
            </div>
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Sleek minimalist interface</li>
          <li>Dark mode support</li>
          <li>Customizable themes</li>
          <li>Responsive layout</li>
        </ul>
      </CollapsibleSection>

      <CollapsibleSection
        trigger={
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div className="text-left">
              <div className="font-semibold">Security</div>
              <div className="text-xs text-muted-foreground">Enterprise-grade protection</div>
            </div>
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>End-to-end encryption</li>
          <li>Two-factor authentication</li>
          <li>Regular security audits</li>
          <li>SOC 2 Type II certified</li>
        </ul>
      </CollapsibleSection>
    </div>
  ),
}
