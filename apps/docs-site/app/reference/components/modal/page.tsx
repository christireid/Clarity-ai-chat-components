import React from 'react';
import { Metadata } from 'next';
import DocPageLayout from '@/components/DocPageLayout';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Modal Component - Clarity Chat Components',
  description: 'Display content in a dialog overlay that requires user interaction.',
};

export default function ModalPage() {
  return (
    <DocPageLayout
      title="Modal"
      description="Display content in a dialog overlay that requires user interaction. Modals focus user attention and prevent interaction with the underlying content."
    >
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          The Modal component creates an overlay dialog that appears on top of the main content.
          It's commonly used for confirmations, forms, alerts, media viewers, and any content
          that requires focused user attention.
        </p>
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>✨</span> Key Features
            </h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Multiple sizes (xs to full-screen)</li>
              <li>• Custom close behaviors</li>
              <li>• Animation variants</li>
              <li>• Nested modals support</li>
              <li>• Focus trap and auto-focus</li>
              <li>• Backdrop customization</li>
            </ul>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>♿</span> Accessibility
            </h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• ARIA dialog role and labels</li>
              <li>• Focus management</li>
              <li>• Keyboard navigation (Esc, Tab)</li>
              <li>• Screen reader announcements</li>
              <li>• Reduced motion support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Import the Modal component and control its visibility with the <code>isOpen</code> prop:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
      >
        <p>This is a simple modal with a title and content.</p>
        <p className="mt-4">Click the close button or press Esc to dismiss.</p>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={300}
        />
      </section>

      {/* Props */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <ApiTable
          data={[
            {
              prop: 'isOpen',
              type: 'boolean',
              required: true,
              description: 'Controls modal visibility.',
            },
            {
              prop: 'onClose',
              type: '() => void',
              required: true,
              description: 'Callback when modal should close.',
            },
            {
              prop: 'title',
              type: 'ReactNode',
              description: 'Modal title content.',
            },
            {
              prop: 'children',
              type: 'ReactNode',
              required: true,
              description: 'Modal body content.',
            },
            {
              prop: 'footer',
              type: 'ReactNode',
              description: 'Optional footer content (buttons, actions).',
            },
            {
              prop: 'size',
              type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"',
              default: '"md"',
              description: 'Modal size variant.',
            },
            {
              prop: 'variant',
              type: '"default" | "centered" | "bottom-sheet" | "side-panel"',
              default: '"default"',
              description: 'Modal display variant.',
            },
            {
              prop: 'animation',
              type: '"fade" | "scale" | "slide-up" | "slide-down" | "slide-left" | "slide-right"',
              default: '"fade"',
              description: 'Entry/exit animation type.',
            },
            {
              prop: 'closeOnBackdropClick',
              type: 'boolean',
              default: 'true',
              description: 'Allow closing by clicking backdrop.',
            },
            {
              prop: 'closeOnEscape',
              type: 'boolean',
              default: 'true',
              description: 'Allow closing with Escape key.',
            },
            {
              prop: 'showCloseButton',
              type: 'boolean',
              default: 'true',
              description: 'Display close button in header.',
            },
            {
              prop: 'preventScroll',
              type: 'boolean',
              default: 'true',
              description: 'Prevent body scroll when open.',
            },
            {
              prop: 'autoFocus',
              type: 'boolean',
              default: 'true',
              description: 'Auto-focus first focusable element.',
            },
            {
              prop: 'restoreFocus',
              type: 'boolean',
              default: 'true',
              description: 'Restore focus to trigger element on close.',
            },
            {
              prop: 'backdropClassName',
              type: 'string',
              description: 'Custom CSS class for backdrop.',
            },
            {
              prop: 'className',
              type: 'string',
              description: 'Custom CSS class for modal content.',
            },
            {
              prop: 'onOpen',
              type: '() => void',
              description: 'Callback when modal opens.',
            },
            {
              prop: 'onAfterOpen',
              type: '() => void',
              description: 'Callback after open animation completes.',
            },
            {
              prop: 'onAfterClose',
              type: '() => void',
              description: 'Callback after close animation completes.',
            },
            {
              prop: 'zIndex',
              type: 'number',
              default: '1000',
              description: 'Z-index for modal and backdrop.',
            },
          ]}
        />
      </section>

      {/* Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Sizes</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Modals come in multiple sizes to accommodate different content amounts:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [size, setSize] = React.useState(null);

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(s => (
        <Button
          key={s}
          onClick={() => setSize(s)}
          size="sm"
          variant="outline"
        >
          {s.toUpperCase()}
        </Button>
      ))}

      <Modal
        isOpen={!!size}
        onClose={() => setSize(null)}
        title={\`\${size?.toUpperCase()} Modal\`}
        size={size}
      >
        <p>This is a {size} sized modal.</p>
        <p className="mt-2 text-sm text-gray-600">
          The modal width adjusts based on the size prop.
        </p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-xs">Content area</p>
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={250}
        />
        <Callout type="info" className="mt-4">
          The <code>full</code> size creates a fullscreen modal that covers the entire viewport,
          useful for immersive experiences like image galleries or complex forms.
        </Callout>
      </section>

      {/* Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Variants</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Different display styles for various use cases:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [variant, setVariant] = React.useState(null);

  const variants = [
    { value: 'default', label: 'Default' },
    { value: 'centered', label: 'Centered' },
    { value: 'bottom-sheet', label: 'Bottom Sheet' },
    { value: 'side-panel', label: 'Side Panel' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map(v => (
        <Button
          key={v.value}
          onClick={() => setVariant(v.value)}
          size="sm"
          variant="outline"
        >
          {v.label}
        </Button>
      ))}

      <Modal
        isOpen={!!variant}
        onClose={() => setVariant(null)}
        title={variant?.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ')}
        variant={variant}
      >
        <p>This is a {variant} variant modal.</p>
        <div className="mt-4 space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={250}
        />
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Default:</strong> Standard centered modal with margin from viewport edges</p>
          <p><strong>Centered:</strong> Perfectly centered, no top margin</p>
          <p><strong>Bottom Sheet:</strong> Slides up from bottom (mobile-friendly)</p>
          <p><strong>Side Panel:</strong> Slides in from right side (navigation, settings)</p>
        </div>
      </section>

      {/* Animations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Animations</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Choose from multiple animation styles for modal entrance and exit:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [animation, setAnimation] = React.useState(null);

  const animations = [
    'fade',
    'scale',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {animations.map(anim => (
        <Button
          key={anim}
          onClick={() => setAnimation(anim)}
          size="sm"
          variant="outline"
        >
          {anim}
        </Button>
      ))}

      <Modal
        isOpen={!!animation}
        onClose={() => setAnimation(null)}
        title="Animation Demo"
        animation={animation}
      >
        <p className="mb-2">
          Animation: <strong>{animation}</strong>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Close and reopen with different animations to see the effect.
        </p>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={250}
        />
        <Callout type="tip" className="mt-4">
          Animations respect the user's <code>prefers-reduced-motion</code> setting for
          accessibility. When enabled, animations are simplified or disabled.
        </Callout>
      </section>

      {/* Footer Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Footer Actions</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Add action buttons to the modal footer for user interactions:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Form Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={350}
        />
      </section>

      {/* Confirmation Dialog */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Confirmation Dialog</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use modals for confirmation dialogs with appropriate styling:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = () => {
    alert('Item deleted!');
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-sm text-red-800 dark:text-red-300">
            ⚠️ This is a permanent action
          </p>
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={300}
        />
      </section>

      {/* Close Behaviors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Close Behaviors</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Customize how users can close the modal:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [config, setConfig] = React.useState(null);

  const configs = [
    {
      label: 'All enabled',
      closeOnBackdropClick: true,
      closeOnEscape: true,
      showCloseButton: true,
    },
    {
      label: 'No backdrop close',
      closeOnBackdropClick: false,
      closeOnEscape: true,
      showCloseButton: true,
    },
    {
      label: 'No escape key',
      closeOnBackdropClick: true,
      closeOnEscape: false,
      showCloseButton: true,
    },
    {
      label: 'Button only',
      closeOnBackdropClick: false,
      closeOnEscape: false,
      showCloseButton: true,
    },
    {
      label: 'No close button',
      closeOnBackdropClick: true,
      closeOnEscape: true,
      showCloseButton: false,
    },
  ];

  return (
    <div className="space-y-2">
      {configs.map((cfg, i) => (
        <Button
          key={i}
          onClick={() => setConfig(cfg)}
          size="sm"
          variant="outline"
          fullWidth
        >
          {cfg.label}
        </Button>
      ))}

      {config && (
        <Modal
          isOpen={true}
          onClose={() => setConfig(null)}
          title="Close Behavior Test"
          closeOnBackdropClick={config.closeOnBackdropClick}
          closeOnEscape={config.closeOnEscape}
          showCloseButton={config.showCloseButton}
          footer={
            <Button onClick={() => setConfig(null)}>
              Close via Footer
            </Button>
          }
        >
          <div className="space-y-2 text-sm">
            <p>Current configuration:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
              <li>Backdrop click: {config.closeOnBackdropClick ? '✓' : '✗'}</li>
              <li>Escape key: {config.closeOnEscape ? '✓' : '✗'}</li>
              <li>Close button: {config.showCloseButton ? '✓' : '✗'}</li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={300}
        />
        <Callout type="warning" className="mt-4">
          Always provide at least one way to close the modal for accessibility. Disabling all
          close methods can trap keyboard users.
        </Callout>
      </section>

      {/* Nested Modals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Nested Modals</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Modals can be stacked for multi-step flows or contextual actions:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [modal1, setModal1] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setModal1(true)}>
        Open First Modal
      </Button>

      <Modal
        isOpen={modal1}
        onClose={() => setModal1(false)}
        title="First Modal"
      >
        <p className="mb-4">This is the first modal.</p>
        <Button onClick={() => setModal2(true)}>
          Open Second Modal
        </Button>

        <Modal
          isOpen={modal2}
          onClose={() => setModal2(false)}
          title="Second Modal"
          size="sm"
          zIndex={1100}
        >
          <p>This modal appears on top of the first one.</p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Each modal has its own backdrop and manages focus independently.
          </p>
        </Modal>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={300}
        />
        <Callout type="tip" className="mt-4">
          Use the <code>zIndex</code> prop to control stacking order. Each nested modal should
          have a higher z-index than its parent (default: 1000, increment by 100).
        </Callout>
      </section>

      {/* Custom Backdrop */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Custom Backdrop</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Customize the backdrop appearance with CSS classes:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [backdrop, setBackdrop] = React.useState(null);

  const backdrops = [
    { label: 'Default', className: '' },
    { label: 'Blur', className: 'backdrop-blur-sm' },
    { label: 'Dark', className: 'bg-black/80' },
    { label: 'Light', className: 'bg-white/80' },
    { label: 'Colorful', className: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {backdrops.map((b, i) => (
        <Button
          key={i}
          onClick={() => setBackdrop(b)}
          size="sm"
          variant="outline"
        >
          {b.label}
        </Button>
      ))}

      {backdrop && (
        <Modal
          isOpen={true}
          onClose={() => setBackdrop(null)}
          title="Backdrop Style"
          backdropClassName={backdrop.className}
        >
          <p>Backdrop style: <strong>{backdrop.label}</strong></p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            The backdrop can be customized with any Tailwind CSS classes.
          </p>
        </Modal>
      )}
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={250}
        />
      </section>

      {/* Focus Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Focus Management</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Control focus behavior for better keyboard navigation:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleAfterOpen = () => {
    // Custom focus logic
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal with Custom Focus
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Focus Management"
        autoFocus={false}
        restoreFocus={true}
        onAfterOpen={handleAfterOpen}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Focus is automatically set to the input field below:
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority Field
            </label>
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="This field gets auto-focused"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Secondary Field
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Second field"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={350}
        />
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>autoFocus:</strong> Automatically focus first focusable element</p>
          <p><strong>restoreFocus:</strong> Return focus to trigger element on close</p>
          <p><strong>onAfterOpen:</strong> Callback for custom focus logic after modal opens</p>
        </div>
      </section>

      {/* Lifecycle Callbacks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Lifecycle Callbacks</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Hook into modal lifecycle events for advanced control:
        </p>
        <LiveDemo
          code={`import { Modal, Button } from '@clarity-ui/components';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);

  const addEvent = (event) => {
    setEvents(prev => [...prev, \`\${new Date().toLocaleTimeString()}: \${event}\`]);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => {
          addEvent('Button clicked');
          setIsOpen(true);
        }}>
          Open Modal
        </Button>
        <Button
          variant="ghost"
          onClick={() => setEvents([])}
          disabled={events.length === 0}
        >
          Clear Log
        </Button>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs h-32 overflow-auto">
        {events.length === 0 ? (
          <p className="text-gray-500">Event log (empty)</p>
        ) : (
          events.map((event, i) => (
            <div key={i} className="text-gray-700 dark:text-gray-300">
              {event}
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          addEvent('onClose called');
          setIsOpen(false);
        }}
        onOpen={() => addEvent('onOpen called')}
        onAfterOpen={() => addEvent('onAfterOpen called')}
        onAfterClose={() => addEvent('onAfterClose called')}
        title="Lifecycle Events"
      >
        <p>Watch the event log below as you interact with this modal.</p>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Events are logged at each stage of the modal lifecycle.
        </p>
      </Modal>
    </div>
  );
}`}
          scope={{ React }}
          previewHeight={400}
        />
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Modal component follows WAI-ARIA dialog pattern guidelines:
        </p>
        <div className="space-y-4">
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">ARIA Attributes</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <code>role="dialog"</code> - Identifies the modal element</li>
              <li>• <code>aria-modal="true"</code> - Indicates modal behavior</li>
              <li>• <code>aria-labelledby</code> - References the modal title</li>
              <li>• <code>aria-describedby</code> - References the modal description</li>
              <li>• <code>aria-hidden</code> - Hides background content from screen readers</li>
            </ul>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <kbd>Esc</kbd> - Close modal (if enabled)</li>
              <li>• <kbd>Tab</kbd> - Move focus to next element</li>
              <li>• <kbd>Shift+Tab</kbd> - Move focus to previous element</li>
              <li>• Focus is trapped within modal (cannot tab to background)</li>
              <li>• Focus returns to trigger element on close (if enabled)</li>
            </ul>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Focus Management</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Focus trap prevents tabbing outside modal</li>
              <li>• Auto-focus on first interactive element or specified element</li>
              <li>• Focus restoration returns focus to trigger on close</li>
              <li>• Visual focus indicators on all interactive elements</li>
            </ul>
          </div>
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Screen Reader Support</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Modal opening is announced to screen readers</li>
              <li>• Title and description are properly associated</li>
              <li>• Background content is hidden with <code>aria-hidden</code></li>
              <li>• Close button has accessible label</li>
            </ul>
          </div>
        </div>
        <Callout type="tip" className="mt-4">
          Always provide a descriptive title for screen reader users. If the modal has complex
          content, consider adding an <code>aria-describedby</code> attribute pointing to a
          summary element.
        </Callout>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Do</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Use modals for focused tasks that require user attention</li>
              <li>• Keep modal content concise and focused on a single purpose</li>
              <li>• Provide clear action buttons (primary action + cancel)</li>
              <li>• Use appropriate sizes based on content amount</li>
              <li>• Ensure at least one way to close the modal is available</li>
              <li>• Use confirmation modals for destructive actions</li>
              <li>• Test keyboard navigation and screen reader compatibility</li>
              <li>• Use appropriate animation for the context (bottom-sheet for mobile)</li>
              <li>• Disable body scroll when modal is open</li>
              <li>• Provide loading states for async operations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">✗ Don't</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Don't use modals for non-essential information</li>
              <li>• Don't stack more than 2-3 modals deep</li>
              <li>• Don't put too much content in a modal (consider side panel or page)</li>
              <li>• Don't disable all close methods (traps keyboard users)</li>
              <li>• Don't use modals for navigation (use links instead)</li>
              <li>• Don't open modals automatically without user action</li>
              <li>• Don't use tiny modals for complex forms</li>
              <li>• Don't forget to handle loading and error states</li>
              <li>• Don't use modals on mobile if bottom-sheet would be better</li>
              <li>• Don't nest forms within modals without proper form management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TypeScript */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">TypeScript</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Full TypeScript definitions for type safety:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{`import { ReactNode } from 'react';

export interface ModalProps {
  // Core
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  
  // Content
  title?: ReactNode;
  footer?: ReactNode;
  
  // Appearance
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'default' | 'centered' | 'bottom-sheet' | 'side-panel';
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  
  // Behavior
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  
  // Focus
  autoFocus?: boolean;
  restoreFocus?: boolean;
  
  // Styling
  backdropClassName?: string;
  className?: string;
  zIndex?: number;
  
  // Callbacks
  onOpen?: () => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

// Usage
import { Modal } from '@clarity-ui/components';

const MyModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="My Modal"
      size="lg"
      animation="slide-up"
    >
      <p>Modal content</p>
    </Modal>
  );
};`}</code>
        </pre>
      </section>

      {/* Related Components */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Related Components</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/reference/components/drawer"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Drawer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Side panel that slides in from edge
            </p>
          </a>
          <a
            href="/reference/components/dialog"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Dialog</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simple confirmation and alert dialogs
            </p>
          </a>
          <a
            href="/reference/components/popover"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Popover</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lightweight popup for contextual content
            </p>
          </a>
          <a
            href="/reference/components/tooltip"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Tooltip</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Brief contextual information on hover
            </p>
          </a>
          <a
            href="/reference/components/button"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Button</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trigger actions in modal footers
            </p>
          </a>
          <a
            href="/reference/hooks/use-keyboard-shortcuts"
            className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">useKeyboardShortcuts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add keyboard shortcuts to modals
            </p>
          </a>
        </div>
      </section>
    </DocPageLayout>
  );
}
