import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Dropdown Component - Clarity Chat Components',
  description: 'A versatile dropdown menu component for displaying lists of actions, links, and other interactive elements.',
};

export default function DropdownPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Dropdown</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A versatile dropdown menu component for displaying lists of actions, links, and other interactive elements.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Dropdown component provides a toggleable menu that can contain actions, links, checkboxes,
          radio buttons, dividers, and nested submenus. Perfect for user menus, action menus, filters,
          and navigation.
        </p>

        <Callout type="info" title="Keyboard Navigation">
          Full keyboard support with Arrow keys, Enter/Space, Esc, Tab, and type-ahead search.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function BasicDropdown() {
  const items = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { type: 'separator' },
    { id: 'logout', label: 'Logout', icon: '🚪', variant: 'danger' }
  ];

  const handleSelect = (id) => {
    alert(\`Selected: \${id}\`);
  };

  return (
    <Dropdown
      items={items}
      onSelect={handleSelect}
      trigger={<Button>My Account</Button>}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        
        <ApiTable
          title="Dropdown Props"
          data={[
            {
              prop: 'trigger',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Element that opens the dropdown when clicked'
            },
            {
              prop: 'items',
              type: 'DropdownItem[]',
              default: '[]',
              description: 'Array of menu items (see DropdownItem interface below)'
            },
            {
              prop: 'onSelect',
              type: '(id: string) => void',
              default: 'undefined',
              description: 'Callback when an item is selected'
            },
            {
              prop: 'placement',
              type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'",
              default: "'bottom-start'",
              description: 'Dropdown menu position relative to trigger'
            },
            {
              prop: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description: 'Alignment of dropdown menu'
            },
            {
              prop: 'offset',
              type: 'number',
              default: '8',
              description: 'Distance in pixels between trigger and menu'
            },
            {
              prop: 'closeOnSelect',
              type: 'boolean',
              default: 'true',
              description: 'Whether to close dropdown after selecting an item'
            },
            {
              prop: 'closeOnClickOutside',
              type: 'boolean',
              default: 'true',
              description: 'Whether to close when clicking outside'
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the dropdown is disabled'
            },
            {
              prop: 'isOpen',
              type: 'boolean',
              default: 'undefined',
              description: 'Controlled open state (makes it a controlled component)'
            },
            {
              prop: 'onOpenChange',
              type: '(isOpen: boolean) => void',
              default: 'undefined',
              description: 'Callback when open state changes'
            },
            {
              prop: 'width',
              type: "'auto' | 'trigger' | number",
              default: "'auto'",
              description: "Menu width: 'auto' fits content, 'trigger' matches trigger width, or specific pixel width"
            },
            {
              prop: 'maxHeight',
              type: 'number',
              default: '400',
              description: 'Maximum height of scrollable menu in pixels'
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
              default: 'false',
              description: 'Whether to show an arrow pointing to the trigger'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes for menu container'
            }
          ]}
        />

        <ApiTable
          title="DropdownItem Interface"
          data={[
            {
              prop: 'id',
              type: 'string',
              default: 'undefined',
              description: 'Unique identifier for the item'
            },
            {
              prop: 'type',
              type: "'item' | 'separator' | 'header' | 'checkbox' | 'radio'",
              default: "'item'",
              description: 'Type of menu item'
            },
            {
              prop: 'label',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Item display text or component'
            },
            {
              prop: 'icon',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Icon to display before label'
            },
            {
              prop: 'shortcut',
              type: 'string',
              default: 'undefined',
              description: 'Keyboard shortcut hint (display only)'
            },
            {
              prop: 'variant',
              type: "'default' | 'danger'",
              default: "'default'",
              description: 'Visual style variant'
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the item is disabled'
            },
            {
              prop: 'checked',
              type: 'boolean',
              default: 'undefined',
              description: 'Checked state for checkbox/radio items'
            },
            {
              prop: 'items',
              type: 'DropdownItem[]',
              default: 'undefined',
              description: 'Nested submenu items'
            },
            {
              prop: 'href',
              type: 'string',
              default: 'undefined',
              description: 'Link URL (renders as anchor tag)'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Placement Options</h2>
        <p>
          Position the dropdown menu in 12 different locations around the trigger element.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownPlacement() {
  const items = [
    { id: '1', label: 'First item' },
    { id: '2', label: 'Second item' },
    { id: '3', label: 'Third item' }
  ];

  const placements = [
    'top-start', 'top', 'top-end',
    'bottom-start', 'bottom', 'bottom-end',
    'left-start', 'left', 'left-end',
    'right-start', 'right', 'right-end'
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {placements.map(placement => (
        <Dropdown
          key={placement}
          items={items}
          placement={placement}
          trigger={
            <Button size="sm" variant="secondary">
              {placement}
            </Button>
          }
        />
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Icons and Shortcuts</h2>
        <p>
          Add visual icons and keyboard shortcut hints to menu items.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownWithIcons() {
  const items = [
    { id: 'new', label: 'New File', icon: '📄', shortcut: 'Cmd+N' },
    { id: 'open', label: 'Open', icon: '📂', shortcut: 'Cmd+O' },
    { id: 'save', label: 'Save', icon: '💾', shortcut: 'Cmd+S' },
    { type: 'separator' },
    { id: 'print', label: 'Print', icon: '🖨️', shortcut: 'Cmd+P' },
    { type: 'separator' },
    { id: 'close', label: 'Close Window', icon: '❌', shortcut: 'Cmd+W' }
  ];

  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Action: \${id}\`)}
      trigger={<Button>File Menu</Button>}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Nested Submenus</h2>
        <p>
          Create hierarchical menu structures with nested submenus.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function NestedDropdown() {
  const items = [
    { id: 'new', label: 'New', icon: '📄' },
    {
      id: 'open-recent',
      label: 'Open Recent',
      icon: '🕐',
      items: [
        { id: 'file1', label: 'Document.pdf' },
        { id: 'file2', label: 'Presentation.pptx' },
        { id: 'file3', label: 'Spreadsheet.xlsx' },
        { type: 'separator' },
        { id: 'clear', label: 'Clear Recent', variant: 'danger' }
      ]
    },
    {
      id: 'export',
      label: 'Export As',
      icon: '📤',
      items: [
        { id: 'pdf', label: 'PDF', icon: '📕' },
        { id: 'word', label: 'Word', icon: '📘' },
        { id: 'excel', label: 'Excel', icon: '📗' },
        { id: 'powerpoint', label: 'PowerPoint', icon: '📙' }
      ]
    },
    { type: 'separator' },
    { id: 'save', label: 'Save', icon: '💾' }
  ];

  return (
    <Dropdown
      items={items}
      onSelect={(id) => alert(\`Selected: \${id}\`)}
      trigger={<Button>File Menu</Button>}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Checkbox Items</h2>
        <p>
          Use checkbox items for toggling multiple options independently.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownCheckboxes() {
  const [checked, setChecked] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });

  const items = [
    { type: 'header', label: 'Text Formatting' },
    {
      id: 'bold',
      type: 'checkbox',
      label: 'Bold',
      icon: 'B',
      shortcut: 'Cmd+B',
      checked: checked.bold
    },
    {
      id: 'italic',
      type: 'checkbox',
      label: 'Italic',
      icon: 'I',
      shortcut: 'Cmd+I',
      checked: checked.italic
    },
    {
      id: 'underline',
      type: 'checkbox',
      label: 'Underline',
      icon: 'U',
      shortcut: 'Cmd+U',
      checked: checked.underline
    },
    {
      id: 'strikethrough',
      type: 'checkbox',
      label: 'Strikethrough',
      icon: 'S',
      checked: checked.strikethrough
    }
  ];

  const handleSelect = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <Dropdown
        items={items}
        onSelect={handleSelect}
        closeOnSelect={false}
        trigger={<Button>Format Text</Button>}
      />
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        Active formats: {Object.entries(checked)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', ') || 'None'}
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Radio Items</h2>
        <p>
          Use radio items for selecting a single option from a group.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownRadio() {
  const [selected, setSelected] = useState('medium');

  const items = [
    { type: 'header', label: 'Text Size' },
    {
      id: 'small',
      type: 'radio',
      label: 'Small',
      checked: selected === 'small'
    },
    {
      id: 'medium',
      type: 'radio',
      label: 'Medium',
      checked: selected === 'medium'
    },
    {
      id: 'large',
      type: 'radio',
      label: 'Large',
      checked: selected === 'large'
    },
    {
      id: 'xlarge',
      type: 'radio',
      label: 'Extra Large',
      checked: selected === 'xlarge'
    }
  ];

  return (
    <div>
      <Dropdown
        items={items}
        onSelect={setSelected}
        closeOnSelect={false}
        trigger={<Button>Text Size: {selected}</Button>}
      />
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Disabled Items</h2>
        <p>
          Mark items as disabled to prevent interaction while keeping them visible.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownDisabled() {
  const items = [
    { id: 'copy', label: 'Copy', icon: '📋', shortcut: 'Cmd+C' },
    { id: 'cut', label: 'Cut', icon: '✂️', shortcut: 'Cmd+X', disabled: true },
    { id: 'paste', label: 'Paste', icon: '📄', shortcut: 'Cmd+V', disabled: true },
    { type: 'separator' },
    { id: 'select-all', label: 'Select All', icon: '☑️', shortcut: 'Cmd+A' }
  ];

  return (
    <div>
      <Dropdown
        items={items}
        onSelect={(id) => alert(\`Action: \${id}\`)}
        trigger={<Button>Edit</Button>}
      />
      <p className="mt-3 text-sm text-gray-600">
        Cut and Paste are disabled (no selection)
      </p>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Menu Width</h2>
        <p>
          Control the width of the dropdown menu to match content, trigger, or a specific size.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownWidth() {
  const items = [
    { id: '1', label: 'Short' },
    { id: '2', label: 'Medium length item' },
    { id: '3', label: 'Very long menu item with lots of text' }
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      <Dropdown
        items={items}
        width="auto"
        trigger={<Button size="sm">Auto Width</Button>}
      />
      <Dropdown
        items={items}
        width="trigger"
        trigger={<Button size="sm">Match Trigger</Button>}
      />
      <Dropdown
        items={items}
        width={300}
        trigger={<Button size="sm">300px Fixed</Button>}
      />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Arrow</h2>
        <p>
          Add a visual arrow pointing from the menu to the trigger element.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownWithArrow() {
  const items = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { type: 'separator' },
    { id: 'logout', label: 'Logout', icon: '🚪' }
  ];

  return (
    <Dropdown
      items={items}
      arrow
      trigger={<Button>Account Menu</Button>}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Controlled Dropdown</h2>
        <p>
          Control the open state externally for custom behavior.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Dropdown, Button } from '@clarity/chat-components';

export default function ControlledDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' }
  ];

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Open Menu
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setIsOpen(false)}>
          Close Menu
        </Button>
      </div>

      <Dropdown
        items={items}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSelect={(id) => alert(\`Selected: \${id}\`)}
        trigger={<Button>Controlled Menu</Button>}
      />

      <p className="mt-3 text-sm text-gray-600">
        Menu is {isOpen ? 'open' : 'closed'}
      </p>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Links in Dropdown</h2>
        <p>
          Use the <code>href</code> property to render items as links.
        </p>
        <LiveDemo
          code={`import { Dropdown, Button } from '@clarity/chat-components';

export default function DropdownLinks() {
  const items = [
    { id: 'docs', label: 'Documentation', icon: '📚', href: '/docs' },
    { id: 'api', label: 'API Reference', icon: '🔌', href: '/api' },
    { id: 'github', label: 'GitHub', icon: '💻', href: 'https://github.com' },
    { type: 'separator' },
    { id: 'support', label: 'Support', icon: '💬', href: '/support' }
  ];

  return (
    <Dropdown
      items={items}
      trigger={<Button>Resources</Button>}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>User Profile Menu</h3>
        <p>
          A complete user profile dropdown with avatar, account info, and actions.
        </p>
        <LiveDemo
          code={`import { Dropdown } from '@clarity/chat-components';

export default function UserProfileMenu() {
  const items = [
    {
      id: 'user-info',
      type: 'custom',
      label: (
        <div className="px-2 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-600">john@example.com</div>
            </div>
          </div>
        </div>
      )
    },
    { id: 'profile', label: 'View Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { type: 'separator' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
    { id: 'feedback', label: 'Send Feedback', icon: '💬' },
    { type: 'separator' },
    { id: 'logout', label: 'Logout', icon: '🚪', variant: 'danger' }
  ];

  return (
    <Dropdown
      items={items}
      placement="bottom-end"
      width={280}
      onSelect={(id) => alert(\`Action: \${id}\`)}
      trigger={
        <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium hover:bg-blue-600 transition-colors">
          JD
        </button>
      }
    />
  );
}`}
        />

        <h3>Context Menu Trigger</h3>
        <p>
          Use dropdown as a context menu with right-click or long-press triggers.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Dropdown } from '@clarity/chat-components';

export default function ContextMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const items = [
    { id: 'copy', label: 'Copy', icon: '📋', shortcut: 'Cmd+C' },
    { id: 'cut', label: 'Cut', icon: '✂️', shortcut: 'Cmd+X' },
    { id: 'paste', label: 'Paste', icon: '📄', shortcut: 'Cmd+V' },
    { type: 'separator' },
    { id: 'delete', label: 'Delete', icon: '🗑️', variant: 'danger' }
  ];

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  return (
    <div>
      <div
        onContextMenu={handleContextMenu}
        className="p-8 bg-gray-100 rounded-lg text-center cursor-context-menu"
      >
        Right-click me to open context menu
      </div>

      {isOpen && (
        <div
          style={{ position: 'fixed', left: position.x, top: position.y }}
        >
          <Dropdown
            items={items}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onSelect={(id) => alert(\`Action: \${id}\`)}
            trigger={<div style={{ width: 0, height: 0 }} />}
          />
        </div>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />

        <h3>Multi-Select with Search</h3>
        <p>
          Combine checkboxes with search for filtering large lists.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Dropdown, Button } from '@clarity/chat-components';

export default function SearchableDropdown() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set(['react', 'typescript']));

  const allTags = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js',
    'Vue', 'Angular', 'Svelte', 'Python', 'Django'
  ];

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  const items = [
    {
      id: 'search',
      type: 'custom',
      label: (
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border-b"
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    ...filteredTags.map(tag => ({
      id: tag.toLowerCase(),
      type: 'checkbox',
      label: tag,
      checked: selected.has(tag.toLowerCase())
    }))
  ];

  const handleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <Dropdown
        items={items}
        onSelect={handleSelect}
        closeOnSelect={false}
        width={250}
        trigger={
          <Button>
            Select Tags ({selected.size})
          </Button>
        }
      />
      <div className="mt-3 flex gap-2 flex-wrap">
        {Array.from(selected).map(tag => (
          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            {tag}
          </span>
        ))}
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
          The Dropdown component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="menu"</code> - Identifies the dropdown as a menu</li>
          <li><code>role="menuitem"</code> - Each selectable item</li>
          <li><code>role="menuitemcheckbox"</code> - For checkbox items</li>
          <li><code>role="menuitemradio"</code> - For radio items</li>
          <li><code>role="separator"</code> - For dividers</li>
          <li><code>aria-haspopup="menu"</code> - On the trigger element</li>
          <li><code>aria-expanded</code> - Indicates open/closed state</li>
          <li><code>aria-disabled</code> - For disabled items</li>
          <li><code>aria-checked</code> - For checkbox/radio items</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Open dropdown or select item</li>
          <li><kbd>↓</kbd> - Move to next item</li>
          <li><kbd>↑</kbd> - Move to previous item</li>
          <li><kbd>Home</kbd> - Jump to first item</li>
          <li><kbd>End</kbd> - Jump to last item</li>
          <li><kbd>Esc</kbd> - Close dropdown</li>
          <li><kbd>Tab</kbd> - Close dropdown and move focus forward</li>
          <li><kbd>Shift+Tab</kbd> - Close dropdown and move focus backward</li>
          <li><kbd>→</kbd> - Open submenu (when on item with submenu)</li>
          <li><kbd>←</kbd> - Close submenu and return to parent</li>
          <li>Type-ahead search - Type to jump to matching items</li>
        </ul>

        <h3>Focus Management</h3>
        <ul>
          <li>Focus is automatically moved to the first item when dropdown opens</li>
          <li>Focus is restored to trigger element when closed</li>
          <li>Focus is trapped within open submenus</li>
          <li>Disabled items are skipped during keyboard navigation</li>
        </ul>

        <Callout type="warning" title="Accessibility Note">
          Avoid deeply nested submenus (3+ levels) as they can be difficult to navigate
          with keyboard and screen readers. Consider alternative UI patterns for complex hierarchies.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ User account menus with profile, settings, and logout</li>
          <li>✅ Action menus with multiple operations on an item</li>
          <li>✅ Filter menus with checkboxes or radio options</li>
          <li>✅ Navigation menus with categorized links</li>
          <li>✅ Context menus for right-click actions</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Form input selection - use Select component instead</li>
          <li>❌ Primary navigation - use dedicated nav components</li>
          <li>❌ Very long lists (100+ items) - use searchable Select or data table</li>
          <li>❌ Tooltips or help text - use Tooltip component</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Group related items and use separators to create visual hierarchy</li>
          <li>Place destructive actions (delete, remove) at the bottom with danger variant</li>
          <li>Use icons sparingly - only when they add clear value</li>
          <li>Keep menu item labels concise (1-3 words ideally)</li>
          <li>Use headers to label groups of related items</li>
          <li>Limit submenu depth to 2 levels maximum</li>
          <li>Show keyboard shortcuts for power users</li>
          <li>Disable items that aren't currently available rather than hiding them</li>
        </ul>

        <h3>Performance Tips</h3>
        <ul>
          <li>Dropdown content is lazy-rendered - not in DOM until opened</li>
          <li>For very large lists, consider virtualizing or adding search</li>
          <li>Use <code>closeOnSelect=false</code> for multi-select to prevent re-rendering</li>
          <li>Memoize complex item label components to prevent unnecessary re-renders</li>
        </ul>

        <Callout type="info" title="Mobile Considerations">
          On mobile devices, dropdowns automatically adjust to prevent overflow and position
          themselves optimally. For very large menus on mobile, consider using a Modal or
          Drawer instead for better UX.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Dropdown component is fully typed with TypeScript:
        </p>
        <pre><code>{`import { ReactNode } from 'react';

type DropdownItemType = 'item' | 'separator' | 'header' | 'checkbox' | 'radio' | 'custom';
type DropdownVariant = 'default' | 'danger';
type DropdownPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface DropdownItem {
  id?: string;
  type?: DropdownItemType;
  label?: string | ReactNode;
  icon?: string | ReactNode;
  shortcut?: string;
  variant?: DropdownVariant;
  disabled?: boolean;
  checked?: boolean;
  items?: DropdownItem[];
  href?: string;
}

interface DropdownProps {
  // Trigger
  trigger: ReactNode;
  
  // Items
  items: DropdownItem[];
  onSelect?: (id: string) => void;
  
  // Positioning
  placement?: DropdownPlacement;
  align?: 'start' | 'center' | 'end';
  offset?: number;
  flip?: boolean;
  arrow?: boolean;
  
  // Behavior
  closeOnSelect?: boolean;
  closeOnClickOutside?: boolean;
  disabled?: boolean;
  
  // Controlled
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  
  // Sizing
  width?: 'auto' | 'trigger' | number;
  maxHeight?: number;
  
  // Styling
  className?: string;
}

export default function Dropdown(props: DropdownProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/select">Select</a> - Form input for choosing from options</li>
          <li><a href="/reference/components/context-menu">ContextMenu</a> - Right-click contextual actions</li>
          <li><a href="/reference/components/popover">Popover</a> - More flexible floating content</li>
          <li><a href="/reference/components/menu">Menu</a> - Permanent navigation menus</li>
        </ul>
      </section>
    </div>
  );
}
