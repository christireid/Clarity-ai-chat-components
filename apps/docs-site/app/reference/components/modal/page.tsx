import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Modal Component - Clarity Chat Components',
  description: 'A flexible dialog component for displaying content in an overlay that blocks interaction with the rest of the page.',
};

export default function ModalPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Modal</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A flexible dialog component for displaying content in an overlay that blocks interaction with the rest of the page.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Modal component creates a dialog overlay that captures user focus and requires interaction
          before returning to the main content. Perfect for confirmations, forms, alerts, and any content
          that needs full attention.
        </p>

        <Callout type="info" title="Accessibility Built-in">
          Modals include focus trapping, keyboard navigation (Esc to close), ARIA attributes,
          and automatic focus management for full accessibility compliance.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function BasicModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
      >
        <p>This is a basic modal with a title and content.</p>
        <p className="mt-4 text-sm text-gray-600">
          Press Esc or click outside to close.
        </p>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Modal Props"
          data={[
            {
              prop: 'isOpen',
              type: 'boolean',
              default: 'false',
              description: 'Controls whether the modal is visible'
            },
            {
              prop: 'onClose',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when modal should close (Esc, backdrop click, close button)'
            },
            {
              prop: 'title',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Modal header title'
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Modal content body'
            },
            {
              prop: 'footer',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Custom footer content (typically buttons)'
            },
            {
              prop: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'md'",
              description: 'Modal width (xs=320px, sm=480px, md=640px, lg=800px, xl=1024px, full=90vw)'
            },
            {
              prop: 'closeOnBackdrop',
              type: 'boolean',
              default: 'true',
              description: 'Whether clicking the backdrop closes the modal'
            },
            {
              prop: 'closeOnEsc',
              type: 'boolean',
              default: 'true',
              description: 'Whether pressing Escape closes the modal'
            },
            {
              prop: 'showCloseButton',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show the X close button in header'
            },
            {
              prop: 'centered',
              type: 'boolean',
              default: 'true',
              description: 'Whether to vertically center the modal'
            },
            {
              prop: 'scrollBehavior',
              type: "'inside' | 'outside'",
              default: "'inside'",
              description: "Where scrollbar appears: 'inside' scrolls content only, 'outside' scrolls entire modal"
            },
            {
              prop: 'autoFocus',
              type: 'boolean',
              default: 'true',
              description: 'Whether to automatically focus the first focusable element when opened'
            },
            {
              prop: 'restoreFocus',
              type: 'boolean',
              default: 'true',
              description: 'Whether to restore focus to the trigger element when closed'
            },
            {
              prop: 'preventScroll',
              type: 'boolean',
              default: 'true',
              description: 'Whether to prevent body scroll when modal is open'
            },
            {
              prop: 'motionPreset',
              type: "'slideInBottom' | 'slideInRight' | 'scale' | 'fade' | 'none'",
              default: "'scale'",
              description: 'Animation style when modal opens/closes'
            },
            {
              prop: 'backdrop',
              type: "'blur' | 'transparent' | 'opaque'",
              default: "'opaque'",
              description: 'Backdrop visual style'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes for modal container'
            },
            {
              prop: 'onOpen',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired after modal opens'
            },
            {
              prop: 'onCloseComplete',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired after modal closes and animation completes'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Sizes</h2>
        <p>
          Choose from 6 predefined sizes or use the full-width option for maximum impact.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalSizes() {
  const [size, setSize] = useState(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => setSize('xs')}>
        Extra Small
      </Button>
      <Button size="sm" onClick={() => setSize('sm')}>
        Small
      </Button>
      <Button size="sm" onClick={() => setSize('md')}>
        Medium
      </Button>
      <Button size="sm" onClick={() => setSize('lg')}>
        Large
      </Button>
      <Button size="sm" onClick={() => setSize('xl')}>
        Extra Large
      </Button>
      <Button size="sm" onClick={() => setSize('full')}>
        Full Width
      </Button>

      <Modal
        isOpen={!!size}
        onClose={() => setSize(null)}
        title={\`\${size?.toUpperCase()} Modal\`}
        size={size}
      >
        <p>This is a {size} sized modal.</p>
        <p className="mt-2 text-sm text-gray-600">
          Modal width: {
            size === 'xs' ? '320px' :
            size === 'sm' ? '480px' :
            size === 'md' ? '640px' :
            size === 'lg' ? '800px' :
            size === 'xl' ? '1024px' :
            size === 'full' ? '90vw' : ''
          }
        </p>
      </Modal>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>With Footer Actions</h2>
        <p>
          Add action buttons in the footer for common patterns like confirmation dialogs.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalWithFooter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    alert('Confirmed!');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this item?</p>
        <p className="mt-2 text-sm text-red-600">
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Scroll Behavior</h2>
        <p>
          Control whether long content scrolls inside the modal body or if the entire modal scrolls.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalScrollBehavior() {
  const [scrollBehavior, setScrollBehavior] = useState(null);

  const longContent = Array.from({ length: 20 }, (_, i) => (
    <p key={i} className="mb-4">
      Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  ));

  return (
    <div className="flex gap-3">
      <Button onClick={() => setScrollBehavior('inside')}>
        Scroll Inside
      </Button>
      <Button onClick={() => setScrollBehavior('outside')}>
        Scroll Outside
      </Button>

      <Modal
        isOpen={!!scrollBehavior}
        onClose={() => setScrollBehavior(null)}
        title="Long Content Modal"
        scrollBehavior={scrollBehavior}
        footer={
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setScrollBehavior(null)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="text-sm text-gray-700">
          <p className="mb-4 font-medium">
            Scroll behavior: {scrollBehavior}
          </p>
          {longContent}
        </div>
      </Modal>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Animation Presets</h2>
        <p>
          Choose from different animation styles for opening and closing the modal.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalAnimations() {
  const [preset, setPreset] = useState(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => setPreset('scale')}>
        Scale
      </Button>
      <Button size="sm" onClick={() => setPreset('slideInBottom')}>
        Slide from Bottom
      </Button>
      <Button size="sm" onClick={() => setPreset('slideInRight')}>
        Slide from Right
      </Button>
      <Button size="sm" onClick={() => setPreset('fade')}>
        Fade
      </Button>
      <Button size="sm" onClick={() => setPreset('none')}>
        No Animation
      </Button>

      <Modal
        isOpen={!!preset}
        onClose={() => setPreset(null)}
        title="Animated Modal"
        motionPreset={preset}
      >
        <p>This modal uses the "{preset}" animation preset.</p>
      </Modal>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Backdrop Variants</h2>
        <p>
          Customize the backdrop appearance with blur, transparent, or opaque styles.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalBackdrop() {
  const [backdrop, setBackdrop] = useState(null);

  return (
    <div className="flex gap-3">
      <Button size="sm" onClick={() => setBackdrop('opaque')}>
        Opaque
      </Button>
      <Button size="sm" onClick={() => setBackdrop('blur')}>
        Blur
      </Button>
      <Button size="sm" onClick={() => setBackdrop('transparent')}>
        Transparent
      </Button>

      <Modal
        isOpen={!!backdrop}
        onClose={() => setBackdrop(null)}
        title="Backdrop Variants"
        backdrop={backdrop}
      >
        <p>This modal has a "{backdrop}" backdrop.</p>
        <p className="mt-2 text-sm text-gray-600">
          Look at the background behind the modal.
        </p>
      </Modal>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Prevent Closing</h2>
        <p>
          Disable backdrop click and Escape key to force interaction with modal content.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function ModalPreventClose() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Required Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Important Notice"
        closeOnBackdrop={false}
        closeOnEsc={false}
        showCloseButton={false}
        footer={
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setIsOpen(false)}>
              I Understand
            </Button>
          </div>
        }
      >
        <p className="mb-3">
          You must acknowledge this message before continuing.
        </p>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          ⚠️ Cannot close by clicking outside or pressing Esc.
          You must click the button below.
        </div>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Form Modal</h2>
        <p>
          Use modals for forms with validation and submit/cancel actions.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function FormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Submitted: \${formData.name}, \${formData.email}\`);
    setIsOpen(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Create User
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New User"
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create User
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Nested Modals</h2>
        <p>
          Open modals from within other modals. Each maintains its own focus trap.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function NestedModals() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsFirstOpen(true)}>
        Open First Modal
      </Button>

      <Modal
        isOpen={isFirstOpen}
        onClose={() => setIsFirstOpen(false)}
        title="First Modal"
      >
        <p className="mb-4">This is the first modal.</p>
        <Button onClick={() => setIsSecondOpen(true)}>
          Open Second Modal
        </Button>
      </Modal>

      <Modal
        isOpen={isSecondOpen}
        onClose={() => setIsSecondOpen(false)}
        title="Second Modal"
        size="sm"
      >
        <p>This is the second modal, opened from the first.</p>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Alert Modal</h2>
        <p>
          Create alert dialogs with semantic variants for different message types.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function AlertModal() {
  const [alert, setAlert] = useState(null);

  const alerts = {
    success: {
      title: '✅ Success',
      message: 'Your changes have been saved successfully.',
      color: 'text-green-700 bg-green-50 border-green-200'
    },
    warning: {
      title: '⚠️ Warning',
      message: 'This action may have unintended consequences.',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200'
    },
    error: {
      title: '❌ Error',
      message: 'An error occurred while processing your request.',
      color: 'text-red-700 bg-red-50 border-red-200'
    },
    info: {
      title: 'ℹ️ Information',
      message: 'Your session will expire in 5 minutes.',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="success" onClick={() => setAlert('success')}>
        Success
      </Button>
      <Button size="sm" variant="warning" onClick={() => setAlert('warning')}>
        Warning
      </Button>
      <Button size="sm" variant="danger" onClick={() => setAlert('error')}>
        Error
      </Button>
      <Button size="sm" variant="primary" onClick={() => setAlert('info')}>
        Info
      </Button>

      {alert && (
        <Modal
          isOpen={true}
          onClose={() => setAlert(null)}
          title={alerts[alert].title}
          size="sm"
          footer={
            <Button onClick={() => setAlert(null)}>
              OK
            </Button>
          }
        >
          <div className={\`p-4 rounded-lg border \${alerts[alert].color}\`}>
            {alerts[alert].message}
          </div>
        </Modal>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Multi-Step Modal</h3>
        <p>
          Create wizard-style flows with multiple steps within a single modal.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function MultiStepModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const steps = [
    { title: 'Personal Info', content: 'Enter your name and email' },
    { title: 'Preferences', content: 'Choose your preferences' },
    { title: 'Confirmation', content: 'Review and confirm' }
  ];

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Start Setup Wizard
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={\`Setup Wizard - \${steps[step - 1].title}\`}
        footer={
          <div className="flex gap-3 justify-between w-full">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={\`h-2 w-2 rounded-full \${
                    i + 1 === step ? 'bg-blue-600' : 'bg-gray-300'
                  }\`}
                />
              ))}
            </div>
            {step < steps.length ? (
              <Button onClick={() => setStep(s => s + 1)}>
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={handleClose}>
                Finish
              </Button>
            )}
          </div>
        }
      >
        <div className="py-8 text-center">
          <p className="text-lg">Step {step} of {steps.length}</p>
          <p className="mt-4 text-gray-600">
            {steps[step - 1].content}
          </p>
        </div>
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />

        <h3>Confirmation with Countdown</h3>
        <p>
          Add a countdown timer for critical actions to prevent accidental clicks.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Modal, Button } from '@clarity/chat-components';

export default function CountdownModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  const handleOpen = () => {
    setIsOpen(true);
    setCountdown(5);
  };

  const handleConfirm = () => {
    alert('Dangerous action confirmed!');
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleOpen}>
        Dangerous Action
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="⚠️ Confirm Dangerous Action"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={countdown > 0}
            >
              {countdown > 0 ? \`Confirm (\${countdown}s)\` : 'Confirm'}
            </Button>
          </div>
        }
      >
        <p className="mb-3">
          This action is irreversible and will permanently delete all data.
        </p>
        {countdown > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Please wait {countdown} seconds before confirming...
          </div>
        )}
      </Modal>
    </>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Modal component is built with comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="dialog"</code> - Identifies the modal as a dialog</li>
          <li><code>aria-modal="true"</code> - Indicates modal behavior</li>
          <li><code>aria-labelledby</code> - Links to the modal title</li>
          <li><code>aria-describedby</code> - Links to the modal content</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li><kbd>Esc</kbd> - Close the modal (unless <code>closeOnEsc=false</code>)</li>
          <li><kbd>Tab</kbd> - Navigate forward through focusable elements</li>
          <li><kbd>Shift+Tab</kbd> - Navigate backward through focusable elements</li>
          <li>Focus is trapped within the modal while open</li>
          <li>Focus returns to trigger element when closed (if <code>restoreFocus=true</code>)</li>
        </ul>

        <h3>Focus Management</h3>
        <ul>
          <li>First focusable element is automatically focused when modal opens</li>
          <li>Focus trap prevents tabbing outside the modal</li>
          <li>Focus is restored to the element that opened the modal when closed</li>
          <li>Body scroll is prevented while modal is open</li>
        </ul>

        <Callout type="warning" title="Screen Reader Considerations">
          Always provide a descriptive <code>title</code> for screen reader users.
          For confirmation dialogs, include clear messaging about the action consequences.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Critical confirmations that require user attention</li>
          <li>✅ Forms that need to be completed before returning to the page</li>
          <li>✅ Alerts and important messages that block workflow</li>
          <li>✅ Multi-step wizards and onboarding flows</li>
          <li>✅ Media viewing (images, videos) that needs focus</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Simple tooltips or contextual help - use Tooltip or Popover instead</li>
          <li>❌ Non-critical notifications - use Toast instead</li>
          <li>❌ Dropdown menus - use Dropdown or Select instead</li>
          <li>❌ Frequent interruptions - consider inline alternatives</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Keep modal content focused on a single task or decision</li>
          <li>Use clear, action-oriented button labels (e.g., "Delete" not "OK")</li>
          <li>Place destructive actions on the right with warning colors</li>
          <li>Provide an easy way to cancel or close (X button, Cancel, Esc key)</li>
          <li>For dangerous actions, require explicit confirmation</li>
          <li>Limit modal height to prevent excessive scrolling</li>
          <li>Use appropriate sizes - don't make modals unnecessarily large</li>
        </ul>

        <h3>Mobile Considerations</h3>
        <ul>
          <li>On mobile, full-width modals often work better than centered ones</li>
          <li>Ensure touch targets (buttons, close X) are at least 44x44px</li>
          <li>Consider using slide-from-bottom animation on mobile</li>
          <li>Test scrolling behavior on mobile devices</li>
          <li>Make sure the close button is easily reachable</li>
        </ul>

        <Callout type="info" title="Performance Tip">
          Modals use lazy mounting by default - content is only rendered when <code>isOpen=true</code>.
          This optimizes performance when you have many modals in your app.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Modal component is fully typed with TypeScript:
        </p>
        <pre><code>{`import { ReactNode } from 'react';

interface ModalProps {
  // Control
  isOpen: boolean;
  onClose: () => void;
  
  // Content
  title?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  
  // Appearance
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  backdrop?: 'blur' | 'transparent' | 'opaque';
  motionPreset?: 'slideInBottom' | 'slideInRight' | 'scale' | 'fade' | 'none';
  
  // Behavior
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  autoFocus?: boolean;
  restoreFocus?: boolean;
  preventScroll?: boolean;
  
  // Callbacks
  onOpen?: () => void;
  onCloseComplete?: () => void;
  
  // Styling
  className?: string;
}

export default function Modal(props: ModalProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/drawer">Drawer</a> - Side panel alternative to modals</li>
          <li><a href="/reference/components/popover">Popover</a> - Lightweight contextual overlay</li>
          <li><a href="/reference/components/dialog">Dialog</a> - Alert-style dialogs</li>
          <li><a href="/reference/components/tooltip">Tooltip</a> - Hover information</li>
        </ul>
      </section>
    </div>
  );
}
