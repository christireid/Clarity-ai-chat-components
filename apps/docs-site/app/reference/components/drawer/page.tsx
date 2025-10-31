import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Drawer Component - Clarity Chat Components',
  description: 'A slide-out panel component that overlays content from the side of the screen, perfect for navigation menus, filters, and detailed views.',
};

export default function DrawerPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Drawer</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A slide-out panel component that overlays content from the side of the screen, perfect for navigation menus, filters, and detailed views.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Drawer component creates a panel that slides in from the edge of the screen, overlaying the main
          content. It's ideal for mobile navigation menus, filter panels, shopping carts, user settings,
          and detail views that don't require full page navigation.
        </p>

        <Callout type="info" title="Mobile-First Pattern">
          Drawers are especially effective on mobile devices where screen space is limited.
          They provide a familiar pattern for off-canvas navigation.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function BasicDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Drawer
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Drawer Title"
      >
        <div className="p-4">
          <p>This is the drawer content.</p>
          <p className="mt-2 text-sm text-gray-600">
            Click outside, press Esc, or use the close button to dismiss.
          </p>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Drawer Props"
          data={[
            {
              prop: 'isOpen',
              type: 'boolean',
              default: 'false',
              description: 'Controls whether the drawer is visible'
            },
            {
              prop: 'onClose',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when drawer should close'
            },
            {
              prop: 'title',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Drawer header title'
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Drawer content body'
            },
            {
              prop: 'footer',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Custom footer content'
            },
            {
              prop: 'placement',
              type: "'left' | 'right' | 'top' | 'bottom'",
              default: "'right'",
              description: 'Which edge of the screen the drawer slides from'
            },
            {
              prop: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'md'",
              description: 'Drawer width/height (xs=320px, sm=384px, md=448px, lg=512px, xl=640px, full=100%)'
            },
            {
              prop: 'closeOnBackdrop',
              type: 'boolean',
              default: 'true',
              description: 'Whether clicking the backdrop closes the drawer'
            },
            {
              prop: 'closeOnEsc',
              type: 'boolean',
              default: 'true',
              description: 'Whether pressing Escape closes the drawer'
            },
            {
              prop: 'showCloseButton',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show the X close button in header'
            },
            {
              prop: 'showBackdrop',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show the backdrop overlay'
            },
            {
              prop: 'backdropBlur',
              type: 'boolean',
              default: 'false',
              description: 'Whether to blur the backdrop'
            },
            {
              prop: 'preventScroll',
              type: 'boolean',
              default: 'true',
              description: 'Whether to prevent body scroll when drawer is open'
            },
            {
              prop: 'autoFocus',
              type: 'boolean',
              default: 'true',
              description: 'Whether to automatically focus first focusable element'
            },
            {
              prop: 'restoreFocus',
              type: 'boolean',
              default: 'true',
              description: 'Whether to restore focus to trigger element when closed'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes for drawer container'
            },
            {
              prop: 'onOpen',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired after drawer opens'
            },
            {
              prop: 'onCloseComplete',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired after drawer closes and animation completes'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Placement</h2>
        <p>
          Drawers can slide in from any edge of the screen: left, right, top, or bottom.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function DrawerPlacement() {
  const [placement, setPlacement] = useState(null);

  return (
    <div className="flex gap-3 flex-wrap">
      <Button onClick={() => setPlacement('left')}>
        Left
      </Button>
      <Button onClick={() => setPlacement('right')}>
        Right
      </Button>
      <Button onClick={() => setPlacement('top')}>
        Top
      </Button>
      <Button onClick={() => setPlacement('bottom')}>
        Bottom
      </Button>

      <Drawer
        isOpen={!!placement}
        onClose={() => setPlacement(null)}
        title={\`\${placement?.toUpperCase()} Drawer\`}
        placement={placement}
      >
        <div className="p-4">
          <p>This drawer slides in from the {placement} side.</p>
        </div>
      </Drawer>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Sizes</h2>
        <p>
          Choose from 6 predefined sizes to control the drawer width or height.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function DrawerSizes() {
  const [size, setSize] = useState(null);

  return (
    <div className="flex gap-2 flex-wrap">
      <Button size="sm" onClick={() => setSize('xs')}>XS</Button>
      <Button size="sm" onClick={() => setSize('sm')}>SM</Button>
      <Button size="sm" onClick={() => setSize('md')}>MD</Button>
      <Button size="sm" onClick={() => setSize('lg')}>LG</Button>
      <Button size="sm" onClick={() => setSize('xl')}>XL</Button>
      <Button size="sm" onClick={() => setSize('full')}>Full</Button>

      <Drawer
        isOpen={!!size}
        onClose={() => setSize(null)}
        title={\`\${size?.toUpperCase()} Drawer\`}
        size={size}
      >
        <div className="p-4">
          <p>This is a {size} sized drawer.</p>
          <p className="mt-2 text-sm text-gray-600">
            Size: {
              size === 'xs' ? '320px' :
              size === 'sm' ? '384px' :
              size === 'md' ? '448px' :
              size === 'lg' ? '512px' :
              size === 'xl' ? '640px' :
              size === 'full' ? '100%' : ''
            }
          </p>
        </div>
      </Drawer>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>With Footer</h2>
        <p>
          Add action buttons in the footer for common patterns like forms or confirmations.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function DrawerWithFooter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    alert('Saved!');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit Settings
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        footer={
          <div className="flex gap-3 justify-end p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              defaultValue="johndoe"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Email notifications</span>
            </label>
          </div>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Navigation Drawer</h2>
        <p>
          A common pattern for mobile navigation menus.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function NavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '🏠', label: 'Home', href: '/' },
    { icon: '📚', label: 'Docs', href: '/docs' },
    { icon: '🎨', label: 'Examples', href: '/examples' },
    { icon: '🔌', label: 'API', href: '/api' },
    { icon: '💬', label: 'Support', href: '/support' },
    { icon: '⚙️', label: 'Settings', href: '/settings' }
  ];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        ☰ Menu
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="left"
        size="sm"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-600">john@example.com</div>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t">
            <button className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Filter Drawer</h2>
        <p>
          Use drawers for complex filter interfaces.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    category: [],
    rating: 0
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        🔍 Filters
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter Products"
        size="sm"
        footer={
          <div className="flex gap-3 p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setFilters({ priceRange: [0, 1000], category: [], rating: 0 })}
              fullWidth
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsOpen(false)}
              fullWidth
            >
              Apply Filters
            </Button>
          </div>
        }
      >
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Shopping Cart Drawer</h2>
        <p>
          A practical example of a shopping cart in a drawer.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const cartItems = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, qty: 1, image: '🎧' },
    { id: 2, name: 'Smart Watch', price: 199.99, qty: 1, image: '⌚' },
    { id: 3, name: 'USB-C Cable', price: 12.99, qty: 2, image: '🔌' }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        🛒 Cart ({cartItems.length})
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Shopping Cart"
        footer={
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>\${total.toFixed(2)}</span>
            </div>
            <Button variant="primary" fullWidth>
              Checkout
            </Button>
          </div>
        }
      >
        <div className="divide-y">
          {cartItems.map(item => (
            <div key={item.id} className="p-4 flex gap-4">
              <div className="text-4xl">{item.image}</div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 border rounded">
                    <button className="px-2 py-1 hover:bg-gray-100">-</button>
                    <span className="px-2">{item.qty}</span>
                    <button className="px-2 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <span className="font-medium">\${item.price}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-600">
                🗑️
              </button>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>No Backdrop</h2>
        <p>
          Remove the backdrop for a less intrusive drawer.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function DrawerNoBackdrop() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open (No Backdrop)
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="No Backdrop"
        showBackdrop={false}
      >
        <div className="p-4">
          <p>This drawer has no backdrop.</p>
          <p className="mt-2 text-sm text-gray-600">
            You can still interact with content behind the drawer.
          </p>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Multi-Step Form Drawer</h3>
        <p>
          Create wizard-style forms with multiple steps in a drawer.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function MultiStepDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const steps = ['Personal Info', 'Address', 'Payment'];

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Start Checkout
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        title={\`Checkout - Step \${step} of 3\`}
        footer={
          <div className="flex gap-3 p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(s => s + 1)}
                fullWidth
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleClose}
                fullWidth
              >
                Complete
              </Button>
            )}
          </div>
        }
      >
        <div className="p-4">
          <div className="flex gap-2 mb-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className={\`flex-1 h-2 rounded-full \${
                  i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
                }\`}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">{steps[step - 1]}</h3>
          <p className="text-gray-600">
            Content for {steps[step - 1].toLowerCase()} would go here.
          </p>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />

        <h3>Nested Drawers</h3>
        <p>
          Open drawers from within other drawers.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Drawer, Button } from '@clarity/chat-components';

export default function NestedDrawers() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsFirstOpen(true)}>
        Open First Drawer
      </Button>

      <Drawer
        isOpen={isFirstOpen}
        onClose={() => setIsFirstOpen(false)}
        title="First Drawer"
      >
        <div className="p-4 space-y-4">
          <p>This is the first drawer.</p>
          <Button onClick={() => setIsSecondOpen(true)}>
            Open Second Drawer
          </Button>
        </div>
      </Drawer>

      <Drawer
        isOpen={isSecondOpen}
        onClose={() => setIsSecondOpen(false)}
        title="Second Drawer"
        placement="left"
      >
        <div className="p-4">
          <p>This is the second drawer, opened from the first.</p>
        </div>
      </Drawer>
    </>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Drawer component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="dialog"</code> - Identifies the drawer as a dialog</li>
          <li><code>aria-modal="true"</code> - Indicates modal behavior</li>
          <li><code>aria-labelledby</code> - Links to the drawer title</li>
          <li><code>aria-describedby</code> - Links to the drawer content</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li><kbd>Esc</kbd> - Close the drawer (unless <code>closeOnEsc=false</code>)</li>
          <li><kbd>Tab</kbd> - Navigate forward through focusable elements</li>
          <li><kbd>Shift+Tab</kbd> - Navigate backward through focusable elements</li>
          <li>Focus is trapped within the drawer while open</li>
          <li>Focus returns to trigger element when closed (if <code>restoreFocus=true</code>)</li>
        </ul>

        <h3>Focus Management</h3>
        <ul>
          <li>First focusable element is automatically focused when drawer opens</li>
          <li>Focus trap prevents tabbing outside the drawer</li>
          <li>Focus is restored to the element that opened the drawer when closed</li>
          <li>Body scroll is prevented while drawer is open</li>
        </ul>

        <Callout type="warning" title="Screen Reader Considerations">
          Always provide a descriptive <code>title</code> for screen reader users.
          For navigation drawers, consider adding <code>aria-label</code> to menu items.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Mobile navigation menus and off-canvas navigation</li>
          <li>✅ Shopping carts and basket previews</li>
          <li>✅ Filter panels and advanced search options</li>
          <li>✅ User settings and configuration panels</li>
          <li>✅ Detail views that don't require full page navigation</li>
          <li>✅ Notification panels and activity feeds</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Critical content requiring full attention - use Modal instead</li>
          <li>❌ Simple tooltips - use Tooltip component</li>
          <li>❌ Dropdown menus - use Dropdown component</li>
          <li>❌ Desktop-only applications where side navigation is better</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Use appropriate size - don't make drawers unnecessarily large</li>
          <li>Place important actions in the footer for easy access</li>
          <li>Use left placement for navigation, right for details/actions</li>
          <li>Include a clear close button (X) in the header</li>
          <li>Keep content organized with clear sections and hierarchy</li>
          <li>On mobile, consider full-width drawers for forms</li>
          <li>Limit nested drawers to 2 levels maximum</li>
        </ul>

        <h3>Mobile Considerations</h3>
        <ul>
          <li>Drawers work exceptionally well on mobile devices</li>
          <li>Use full-height drawers on mobile for better UX</li>
          <li>Ensure touch targets are at least 44x44px</li>
          <li>Consider bottom placement for mobile sheets</li>
          <li>Test swipe gestures for closing drawers</li>
        </ul>

        <Callout type="info" title="Performance Tip">
          Drawers use lazy mounting by default - content is only rendered when <code>isOpen=true</code>.
          This optimizes performance when you have many drawers in your app.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Drawer component is fully typed with TypeScript:
        </p>
        <pre><code>{`import { ReactNode } from 'react';

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DrawerProps {
  // Control
  isOpen: boolean;
  onClose: () => void;
  
  // Content
  title?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  
  // Appearance
  placement?: DrawerPlacement;
  size?: DrawerSize;
  showBackdrop?: boolean;
  backdropBlur?: boolean;
  showCloseButton?: boolean;
  
  // Behavior
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  
  // Callbacks
  onOpen?: () => void;
  onCloseComplete?: () => void;
  
  // Styling
  className?: string;
}

export default function Drawer(props: DrawerProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/modal">Modal</a> - Full-page dialog overlays</li>
          <li><a href="/reference/components/popover">Popover</a> - Lightweight contextual overlay</li>
          <li><a href="/reference/components/dropdown">Dropdown</a> - Action menus</li>
          <li><a href="/reference/components/sheet">Sheet</a> - Mobile bottom sheets</li>
        </ul>
      </section>
    </div>
  );
}
