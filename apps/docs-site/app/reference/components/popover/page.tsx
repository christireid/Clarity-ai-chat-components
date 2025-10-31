import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Popover Component - Clarity Chat Components',
  description: 'A flexible floating content container that displays rich contextual information relative to a trigger element.',
};

export default function PopoverPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Popover</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A flexible floating content container that displays rich contextual information relative to a trigger element.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Popover component creates a floating content panel that can contain any rich content including
          text, images, forms, and interactive elements. Unlike tooltips (which are for simple text),
          popovers are ideal for complex contextual information that requires user interaction.
        </p>

        <Callout type="info" title="When to Use">
          Use Popover for rich interactive content. Use Tooltip for simple text hints.
          Use Dropdown for action menus. Use Modal for content requiring full attention.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Popover, Button } from '@clarity/chat-components';

export default function BasicPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button onClick={() => setIsOpen(!isOpen)}>
          Click me
        </Button>
      }
      content={
        <div className="p-4">
          <h3 className="font-semibold mb-2">Popover Title</h3>
          <p className="text-sm text-gray-600">
            This is a popover with rich content. It can contain
            any HTML elements including buttons, links, and forms.
          </p>
        </div>
      }
    />
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Popover Props"
          data={[
            {
              prop: 'trigger',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Element that triggers the popover'
            },
            {
              prop: 'content',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Content to display in the popover'
            },
            {
              prop: 'isOpen',
              type: 'boolean',
              default: 'undefined',
              description: 'Controlled open state'
            },
            {
              prop: 'onOpenChange',
              type: '(isOpen: boolean) => void',
              default: 'undefined',
              description: 'Callback when open state changes'
            },
            {
              prop: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: 'Initial open state for uncontrolled usage'
            },
            {
              prop: 'placement',
              type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'",
              default: "'bottom'",
              description: 'Placement of popover relative to trigger'
            },
            {
              prop: 'offset',
              type: 'number',
              default: '8',
              description: 'Distance in pixels from trigger'
            },
            {
              prop: 'flip',
              type: 'boolean',
              default: 'true',
              description: 'Whether to flip placement when there is insufficient space'
            },
            {
              prop: 'arrow',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show arrow pointing to trigger'
            },
            {
              prop: 'triggerOn',
              type: "'click' | 'hover' | 'focus'",
              default: "'click'",
              description: 'How the popover is triggered'
            },
            {
              prop: 'closeOnClickOutside',
              type: 'boolean',
              default: 'true',
              description: 'Whether clicking outside closes the popover'
            },
            {
              prop: 'closeOnEsc',
              type: 'boolean',
              default: 'true',
              description: 'Whether pressing Escape closes the popover'
            },
            {
              prop: 'hoverDelay',
              type: 'number',
              default: '200',
              description: 'Delay in ms before opening on hover'
            },
            {
              prop: 'hoverLeaveDelay',
              type: 'number',
              default: '300',
              description: 'Delay in ms before closing when leaving hover'
            },
            {
              prop: 'width',
              type: 'number | string',
              default: "'auto'",
              description: 'Width of the popover'
            },
            {
              prop: 'maxWidth',
              type: 'number',
              default: '320',
              description: 'Maximum width in pixels'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes for popover container'
            },
            {
              prop: 'portal',
              type: 'boolean',
              default: 'true',
              description: 'Whether to render in a portal (for proper z-index stacking)'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Placement Options</h2>
        <p>
          Position the popover in 12 different locations relative to the trigger element.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function PopoverPlacement() {
  const placements = [
    'top-start', 'top', 'top-end',
    'bottom-start', 'bottom', 'bottom-end',
    'left-start', 'left', 'left-end',
    'right-start', 'right', 'right-end'
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {placements.map(placement => (
        <Popover
          key={placement}
          placement={placement}
          trigger={
            <Button size="sm" variant="secondary">
              {placement}
            </Button>
          }
          content={
            <div className="p-3">
              <p className="text-sm">Popover at {placement}</p>
            </div>
          }
        />
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Trigger Methods</h2>
        <p>
          Open popovers on click, hover, or focus events.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function PopoverTriggers() {
  return (
    <div className="flex gap-3 flex-wrap">
      <Popover
        triggerOn="click"
        trigger={<Button>Click Trigger</Button>}
        content={
          <div className="p-3">
            <p className="text-sm">Opens on click</p>
          </div>
        }
      />

      <Popover
        triggerOn="hover"
        trigger={<Button variant="secondary">Hover Trigger</Button>}
        content={
          <div className="p-3">
            <p className="text-sm">Opens on hover</p>
          </div>
        }
      />

      <Popover
        triggerOn="focus"
        trigger={
          <button className="px-4 py-2 border rounded hover:bg-gray-50">
            Focus Trigger
          </button>
        }
        content={
          <div className="p-3">
            <p className="text-sm">Opens on focus (Tab to me)</p>
          </div>
        }
      />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Rich Content</h2>
        <p>
          Popovers can contain complex content including images, forms, and interactive elements.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function RichPopover() {
  return (
    <Popover
      trigger={<Button>User Info</Button>}
      width={300}
      content={
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">John Doe</h3>
              <p className="text-sm text-gray-600">Software Engineer</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔗</span>
              <a href="#" className="text-blue-600 hover:underline">
                github.com/johndoe
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="primary" fullWidth>
              Message
            </Button>
            <Button size="sm" variant="secondary" fullWidth>
              Follow
            </Button>
          </div>
        </div>
      }
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Form in Popover</h2>
        <p>
          Use popovers for inline forms and input collection.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Popover, Button } from '@clarity/chat-components';

export default function FormPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Submitted: \${name}, \${email}\`);
    setIsOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={<Button>Add Contact</Button>}
      width={300}
      content={
        <form onSubmit={handleSubmit} className="p-4">
          <h3 className="font-semibold mb-3">New Contact</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary" fullWidth>
                Add
              </Button>
            </div>
          </div>
        </form>
      }
    />
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>With Arrow</h2>
        <p>
          Add an arrow indicator pointing from the popover to the trigger element.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function PopoverWithArrow() {
  return (
    <div className="flex gap-3">
      <Popover
        arrow={true}
        trigger={<Button>With Arrow</Button>}
        content={
          <div className="p-3">
            <p className="text-sm">Popover with arrow indicator</p>
          </div>
        }
      />

      <Popover
        arrow={false}
        trigger={<Button variant="secondary">No Arrow</Button>}
        content={
          <div className="p-3">
            <p className="text-sm">Popover without arrow</p>
          </div>
        }
      />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Controlled vs Uncontrolled</h2>
        <p>
          Use controlled mode for programmatic control or uncontrolled for simpler usage.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Popover, Button } from '@clarity/chat-components';

export default function ControlledPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Open Popover
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setIsOpen(false)}>
          Close Popover
        </Button>
      </div>

      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        trigger={
          <Button variant="primary">
            Controlled Popover
          </Button>
        }
        content={
          <div className="p-4">
            <h3 className="font-semibold mb-2">Controlled Popover</h3>
            <p className="text-sm text-gray-600 mb-3">
              This popover's state is controlled externally.
            </p>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        }
      />

      <p className="text-sm text-gray-600">
        Popover is {isOpen ? 'open' : 'closed'}
      </p>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Nested Popovers</h2>
        <p>
          Open popovers from within other popovers for hierarchical content.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function NestedPopovers() {
  return (
    <Popover
      trigger={<Button>First Popover</Button>}
      content={
        <div className="p-4">
          <h3 className="font-semibold mb-3">First Level</h3>
          <p className="text-sm text-gray-600 mb-3">
            This popover contains another popover inside.
          </p>
          <Popover
            trigger={<Button size="sm">Open Second</Button>}
            placement="right"
            content={
              <div className="p-3">
                <h4 className="font-semibold mb-2">Second Level</h4>
                <p className="text-sm text-gray-600">
                  Nested popover content
                </p>
              </div>
            }
          />
        </div>
      }
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Info Card Popover</h3>
        <p>
          Display detailed information cards on hover or click.
        </p>
        <LiveDemo
          code={`import { Popover } from '@clarity/chat-components';

export default function InfoCardPopover() {
  return (
    <div className="p-4 bg-gray-50 rounded">
      <p className="text-gray-700">
        Hover over{' '}
        <Popover
          triggerOn="hover"
          trigger={
            <span className="text-blue-600 underline decoration-dotted cursor-help">
              technical terms
            </span>
          }
          content={
            <div className="p-4 max-w-xs">
              <h4 className="font-semibold mb-2">Technical Term</h4>
              <p className="text-sm text-gray-600 mb-2">
                A detailed explanation of this technical concept with
                examples and usage guidelines.
              </p>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Learn more →
              </a>
            </div>
          }
        />{' '}
        to see their definitions inline without leaving the page.
      </p>
    </div>
  );
}`}
        />

        <h3>Share Popover</h3>
        <p>
          Create social sharing popovers with multiple options.
        </p>
        <LiveDemo
          code={`import { Popover, Button } from '@clarity/chat-components';

export default function SharePopover() {
  const shareOptions = [
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { name: 'Email', icon: '📧', color: 'bg-gray-600' }
  ];

  return (
    <Popover
      trigger={
        <Button variant="secondary">
          Share
        </Button>
      }
      content={
        <div className="p-4">
          <h3 className="font-semibold mb-3">Share this content</h3>
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map(option => (
              <button
                key={option.name}
                className={\`flex items-center gap-2 px-3 py-2 \${option.color} text-white rounded hover:opacity-90 transition-opacity\`}
              >
                <span>{option.icon}</span>
                <span className="text-sm">{option.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t">
            <label className="block text-xs text-gray-600 mb-1">
              Copy link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://example.com/share"
                readOnly
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <Button size="sm">Copy</Button>
            </div>
          </div>
        </div>
      }
    />
  );
}`}
        />

        <h3>Color Picker Popover</h3>
        <p>
          Use popovers for inline selectors and pickers.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Popover } from '@clarity/chat-components';

export default function ColorPickerPopover() {
  const [color, setColor] = useState('#3b82f6');

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ];

  return (
    <div className="flex items-center gap-3">
      <Popover
        trigger={
          <button
            className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
            style={{ backgroundColor: color }}
          />
        }
        content={
          <div className="p-3">
            <h4 className="text-sm font-semibold mb-2">Choose Color</h4>
            <div className="grid grid-cols-8 gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={\`w-8 h-8 rounded hover:scale-110 transition-transform \${
                    color === c ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                  }\`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        }
      />
      <div className="text-sm text-gray-600">
        Selected: <code className="bg-gray-100 px-2 py-1 rounded">{color}</code>
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Popover component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="dialog"</code> - For interactive popovers</li>
          <li><code>aria-haspopup="dialog"</code> - On trigger element</li>
          <li><code>aria-expanded</code> - Indicates open/closed state</li>
          <li><code>aria-controls</code> - Links trigger to popover content</li>
          <li><code>aria-labelledby</code> - If popover has a title</li>
          <li><code>aria-describedby</code> - Links to popover content</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Open popover (when trigger is focused)</li>
          <li><kbd>Esc</kbd> - Close popover</li>
          <li><kbd>Tab</kbd> - Navigate through focusable elements inside popover</li>
          <li>Focus is trapped within interactive popovers</li>
          <li>Focus returns to trigger when popover closes</li>
        </ul>

        <h3>Focus Management</h3>
        <ul>
          <li>Trigger element is always keyboard accessible</li>
          <li>First focusable element receives focus when popover opens (for interactive content)</li>
          <li>Focus is restored to trigger when popover closes</li>
          <li>Non-interactive popovers (hover) don't trap focus</li>
        </ul>

        <Callout type="warning" title="Interactive Content">
          For popovers with interactive content (forms, buttons), use <code>triggerOn="click"</code>
          to ensure keyboard users can access the content. Hover-only popovers should contain
          only non-interactive information.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Rich contextual information that needs more space than a tooltip</li>
          <li>✅ Inline forms and quick actions without navigating away</li>
          <li>✅ User profile cards and detailed previews</li>
          <li>✅ Color pickers, date pickers, and other inline selectors</li>
          <li>✅ Help text with formatting, images, or links</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Simple text hints - use Tooltip instead</li>
          <li>❌ Action menus - use Dropdown instead</li>
          <li>❌ Content requiring full attention - use Modal instead</li>
          <li>❌ Primary navigation - use dedicated nav components</li>
          <li>❌ Critical information - ensure it's also available elsewhere</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Keep popover content focused and concise</li>
          <li>Use appropriate <code>maxWidth</code> to prevent overly wide popovers</li>
          <li>Position popovers to avoid covering important content</li>
          <li>Include a clear way to dismiss (X button, Cancel button, or click outside)</li>
          <li>For forms, include both submit and cancel actions</li>
          <li>Use arrows to visually connect popover to trigger</li>
          <li>Don't nest popovers more than 2 levels deep</li>
          <li>Ensure popover content is readable with sufficient contrast</li>
        </ul>

        <h3>Interaction Guidelines</h3>
        <ul>
          <li>Use <code>triggerOn="click"</code> for interactive content</li>
          <li>Use <code>triggerOn="hover"</code> for informational content only</li>
          <li>Use <code>triggerOn="focus"</code> for form field help text</li>
          <li>Don't auto-open popovers on page load</li>
          <li>Allow clicking outside to close for non-critical popovers</li>
          <li>For mobile, consider using Modal instead of Popover</li>
        </ul>

        <Callout type="info" title="Mobile Considerations">
          Popovers may not work well on mobile devices with limited screen space.
          Consider alternative patterns like bottom sheets, modals, or inline expansion
          for mobile-first experiences.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Popover component is fully typed with TypeScript:
        </p>
        <pre><code>{`import { ReactNode } from 'react';

type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

type PopoverTrigger = 'click' | 'hover' | 'focus';

interface PopoverProps {
  // Content
  trigger: ReactNode;
  content: ReactNode;
  
  // State Control
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  
  // Positioning
  placement?: PopoverPlacement;
  offset?: number;
  flip?: boolean;
  arrow?: boolean;
  
  // Behavior
  triggerOn?: PopoverTrigger;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  hoverDelay?: number;
  hoverLeaveDelay?: number;
  
  // Sizing
  width?: number | string;
  maxWidth?: number;
  
  // Rendering
  portal?: boolean;
  className?: string;
}

export default function Popover(props: PopoverProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/tooltip">Tooltip</a> - Simple text hints</li>
          <li><a href="/reference/components/dropdown">Dropdown</a> - Action menus</li>
          <li><a href="/reference/components/modal">Modal</a> - Full-page dialogs</li>
          <li><a href="/reference/components/drawer">Drawer</a> - Side panel overlays</li>
        </ul>
      </section>
    </div>
  );
}
