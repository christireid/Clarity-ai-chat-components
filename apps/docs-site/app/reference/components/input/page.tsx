import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Input Component - Clarity Chat Components',
  description: 'A text input component for collecting user text input in forms and interfaces.',
};

export default function InputPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Input</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A text input component for collecting user text input in forms and interfaces.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Input component provides a flexible text input field with support for various types,
          sizes, states, and validation. Essential for forms, search bars, chat inputs, and any
          text entry interface.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Input } from '@clarity/chat-components';

export default function BasicInput() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter text..." />
      <Input placeholder="With label" label="Username" />
      <Input placeholder="With helper text" helperText="Enter your email address" />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Input Props"
          data={[
            { prop: 'type', type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'", default: "'text'", description: 'Input type' },
            { prop: 'value', type: 'string', default: 'undefined', description: 'Controlled value' },
            { prop: 'defaultValue', type: 'string', default: 'undefined', description: 'Uncontrolled default value' },
            { prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
            { prop: 'label', type: 'string', default: 'undefined', description: 'Input label' },
            { prop: 'helperText', type: 'string', default: 'undefined', description: 'Helper text below input' },
            { prop: 'error', type: 'string | boolean', default: 'undefined', description: 'Error message or state' },
            { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
            { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Whether input spans full width' },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Whether input is disabled' },
            { prop: 'readOnly', type: 'boolean', default: 'false', description: 'Whether input is read-only' },
            { prop: 'required', type: 'boolean', default: 'false', description: 'Whether input is required' },
            { prop: 'leftIcon', type: 'ReactNode', default: 'undefined', description: 'Icon on the left side' },
            { prop: 'rightIcon', type: 'ReactNode', default: 'undefined', description: 'Icon on the right side' },
            { prop: 'onChange', type: '(e: ChangeEvent) => void', default: 'undefined', description: 'Change handler' },
            { prop: 'onFocus', type: '(e: FocusEvent) => void', default: 'undefined', description: 'Focus handler' },
            { prop: 'onBlur', type: '(e: FocusEvent) => void', default: 'undefined', description: 'Blur handler' },
            { prop: 'className', type: 'string', default: 'undefined', description: 'Additional CSS classes' }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Sizes</h2>
        <LiveDemo
          code={`import { Input } from '@clarity/chat-components';

export default function InputSizes() {
  return (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Icons</h2>
        <LiveDemo
          code={`import { Input } from '@clarity/chat-components';

export default function InputWithIcons() {
  return (
    <div className="space-y-4">
      <Input placeholder="Search..." leftIcon={<span>🔍</span>} />
      <Input placeholder="Email" type="email" leftIcon={<span>📧</span>} />
      <Input placeholder="Password" type="password" rightIcon={<span>👁️</span>} />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Validation States</h2>
        <LiveDemo
          code={`import { Input } from '@clarity/chat-components';

export default function InputValidation() {
  return (
    <div className="space-y-4">
      <Input placeholder="Valid input" helperText="Looks good!" />
      <Input placeholder="Invalid input" error="This field is required" />
      <Input placeholder="With warning" helperText="Please check your input" />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Controlled Input</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Input } from '@clarity/chat-components';

export default function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-4">
      <Input
        label="Controlled Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p className="text-sm text-gray-600">Value: {value}</p>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Input(props: InputProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/textarea">Textarea</a> - Multi-line text input</li>
          <li><a href="/reference/components/select">Select</a> - Dropdown selection</li>
          <li><a href="/reference/components/message-input">MessageInput</a> - Chat message input</li>
        </ul>
      </section>
    </div>
  );
}
