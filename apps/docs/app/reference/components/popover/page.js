import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
;
import { ApiTable } from '@/components/Demo/ApiTable';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Popover Component - Clarity Chat Components',
    description: 'A flexible floating content container that displays rich contextual information relative to a trigger element.',
};
export default function PopoverPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Popover" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A flexible floating content container that displays rich contextual information relative to a trigger element." })] }) }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "The Popover component creates a floating content panel that can contain any rich content including text, images, forms, and interactive elements. Unlike tooltips (which are for simple text), popovers are ideal for complex contextual information that requires user interaction." }), _jsx(Callout, { type: "info", title: "When to Use", children: "Use Popover for rich interactive content. Use Tooltip for simple text hints. Use Dropdown for action menus. Use Modal for content requiring full attention." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
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
}

render(<BasicPopover />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Popover Props", data: [
                            {
                                name: 'trigger',
                                type: 'ReactNode',
                                default: 'undefined',
                                description: 'Element that triggers the popover'
                            },
                            {
                                name: 'content',
                                type: 'ReactNode',
                                default: 'undefined',
                                description: 'Content to display in the popover'
                            },
                            {
                                name: 'isOpen',
                                type: 'boolean',
                                default: 'undefined',
                                description: 'Controlled open state'
                            },
                            {
                                name: 'onOpenChange',
                                type: '(isOpen: boolean) => void',
                                default: 'undefined',
                                description: 'Callback when open state changes'
                            },
                            {
                                name: 'defaultOpen',
                                type: 'boolean',
                                default: 'false',
                                description: 'Initial open state for uncontrolled usage'
                            },
                            {
                                name: 'placement',
                                type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'",
                                default: "'bottom'",
                                description: 'Placement of popover relative to trigger'
                            },
                            {
                                name: 'offset',
                                type: 'number',
                                default: '8',
                                description: 'Distance in pixels from trigger'
                            },
                            {
                                name: 'flip',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether to flip placement when there is insufficient space'
                            },
                            {
                                name: 'arrow',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether to show arrow pointing to trigger'
                            },
                            {
                                name: 'triggerOn',
                                type: "'click' | 'hover' | 'focus'",
                                default: "'click'",
                                description: 'How the popover is triggered'
                            },
                            {
                                name: 'closeOnClickOutside',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether clicking outside closes the popover'
                            },
                            {
                                name: 'closeOnEsc',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether pressing Escape closes the popover'
                            },
                            {
                                name: 'hoverDelay',
                                type: 'number',
                                default: '200',
                                description: 'Delay in ms before opening on hover'
                            },
                            {
                                name: 'hoverLeaveDelay',
                                type: 'number',
                                default: '300',
                                description: 'Delay in ms before closing when leaving hover'
                            },
                            {
                                name: 'width',
                                type: 'number | string',
                                default: "'auto'",
                                description: 'Width of the popover'
                            },
                            {
                                name: 'maxWidth',
                                type: 'number',
                                default: '320',
                                description: 'Maximum width in pixels'
                            },
                            {
                                name: 'className',
                                type: 'string',
                                default: 'undefined',
                                description: 'Additional CSS classes for popover container'
                            },
                            {
                                name: 'portal',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether to render in a portal (for proper z-index stacking)'
                            }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Placement Options" }), _jsx("p", { children: "Position the popover in 12 different locations relative to the trigger element." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<PopoverPlacement />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Trigger Methods" }), _jsx("p", { children: "Open popovers on click, hover, or focus events." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<PopoverTriggers />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Rich Content" }), _jsx("p", { children: "Popovers can contain complex content including images, forms, and interactive elements." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<RichPopover />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Form in Popover" }), _jsx("p", { children: "Use popovers for inline forms and input collection." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
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
}

render(<FormPopover />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Arrow" }), _jsx("p", { children: "Add an arrow indicator pointing from the popover to the trigger element." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<PopoverWithArrow />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Controlled vs Uncontrolled" }), _jsx("p", { children: "Use controlled mode for programmatic control or uncontrolled for simpler usage." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
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
}

render(<ControlledPopover />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Nested Popovers" }), _jsx("p", { children: "Open popovers from within other popovers for hierarchical content." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<NestedPopovers />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Info Card Popover" }), _jsx("p", { children: "Display detailed information cards on hover or click." }), _jsx(CodePlayground, { initialCode: `import { Popover } from '@clarity/chat-components';

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
}

render(<InfoCardPopover />)` }), _jsx("h3", { children: "Share Popover" }), _jsx("p", { children: "Create social sharing popovers with multiple options." }), _jsx(CodePlayground, { initialCode: `import { Popover, Button } from '@clarity/chat-components';

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
}

render(<SharePopover />)` }), _jsx("h3", { children: "Color Picker Popover" }), _jsx("p", { children: "Use popovers for inline selectors and pickers." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
import { Popover } from '@clarity/chat-components';
import { CodePlayground } from '@/components/Playground/CodePlayground'

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx("p", { children: "The Popover component includes comprehensive accessibility features:" }), _jsx("h3", { children: "ARIA Attributes" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "role=\"dialog\"" }), " - For interactive popovers"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-haspopup=\"dialog\"" }), " - On trigger element"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-expanded" }), " - Indicates open/closed state"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-controls" }), " - Links trigger to popover content"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-labelledby" }), " - If popover has a title"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-describedby" }), " - Links to popover content"] })] }), _jsx("h3", { children: "Keyboard Navigation" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "Enter" }), " / ", _jsx("kbd", { children: "Space" }), " - Open popover (when trigger is focused)"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Esc" }), " - Close popover"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Tab" }), " - Navigate through focusable elements inside popover"] }), _jsx("li", { children: "Focus is trapped within interactive popovers" }), _jsx("li", { children: "Focus returns to trigger when popover closes" })] }), _jsx("h3", { children: "Focus Management" }), _jsxs("ul", { children: [_jsx("li", { children: "Trigger element is always keyboard accessible" }), _jsx("li", { children: "First focusable element receives focus when popover opens (for interactive content)" }), _jsx("li", { children: "Focus is restored to trigger when popover closes" }), _jsx("li", { children: "Non-interactive popovers (hover) don't trap focus" })] }), _jsxs(Callout, { type: "warning", title: "Interactive Content", children: ["For popovers with interactive content (forms, buttons), use ", _jsx("code", { children: "triggerOn=\"click\"" }), "to ensure keyboard users can access the content. Hover-only popovers should contain only non-interactive information."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Rich contextual information that needs more space than a tooltip" }), _jsx("li", { children: "\u2705 Inline forms and quick actions without navigating away" }), _jsx("li", { children: "\u2705 User profile cards and detailed previews" }), _jsx("li", { children: "\u2705 Color pickers, date pickers, and other inline selectors" }), _jsx("li", { children: "\u2705 Help text with formatting, images, or links" })] }), _jsx("h3", { children: "When Not to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u274C Simple text hints - use Tooltip instead" }), _jsx("li", { children: "\u274C Action menus - use Dropdown instead" }), _jsx("li", { children: "\u274C Content requiring full attention - use Modal instead" }), _jsx("li", { children: "\u274C Primary navigation - use dedicated nav components" }), _jsx("li", { children: "\u274C Critical information - ensure it's also available elsewhere" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep popover content focused and concise" }), _jsxs("li", { children: ["Use appropriate ", _jsx("code", { children: "maxWidth" }), " to prevent overly wide popovers"] }), _jsx("li", { children: "Position popovers to avoid covering important content" }), _jsx("li", { children: "Include a clear way to dismiss (X button, Cancel button, or click outside)" }), _jsx("li", { children: "For forms, include both submit and cancel actions" }), _jsx("li", { children: "Use arrows to visually connect popover to trigger" }), _jsx("li", { children: "Don't nest popovers more than 2 levels deep" }), _jsx("li", { children: "Ensure popover content is readable with sufficient contrast" })] }), _jsx("h3", { children: "Interaction Guidelines" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("code", { children: "triggerOn=\"click\"" }), " for interactive content"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "triggerOn=\"hover\"" }), " for informational content only"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "triggerOn=\"focus\"" }), " for form field help text"] }), _jsx("li", { children: "Don't auto-open popovers on page load" }), _jsx("li", { children: "Allow clicking outside to close for non-critical popovers" }), _jsx("li", { children: "For mobile, consider using Modal instead of Popover" })] }), _jsx(Callout, { type: "info", title: "Mobile Considerations", children: "Popovers may not work well on mobile devices with limited screen space. Consider alternative patterns like bottom sheets, modals, or inline expansion for mobile-first experiences." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("p", { children: "The Popover component is fully typed with TypeScript:" }), _jsx("pre", { children: _jsx("code", { children: `import { ReactNode } from 'react';

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

export default function Popover(props: PopoverProps): JSX.Element;` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/tooltip", children: "Tooltip" }), " - Simple text hints"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/dropdown", children: "Dropdown" }), " - Action menus"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/modal", children: "Modal" }), " - Full-page dialogs"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/drawer", children: "Drawer" }), " - Side panel overlays"] })] })] })] }));
}
//# sourceMappingURL=page.js.map