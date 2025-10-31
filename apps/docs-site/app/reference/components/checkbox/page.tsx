import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';

export const metadata: Metadata = {
  title: 'Checkbox Component - Clarity Chat Components',
  description: 'A checkbox input component for binary choices and multiple selections.',
};

export default function CheckboxPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Checkbox</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A checkbox input component for binary choices and multiple selections.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Checkbox } from '@clarity/chat-components';

export default function BasicCheckbox() {
  return (
    <div className="space-y-3">
      <Checkbox label="Accept terms and conditions" />
      <Checkbox label="Subscribe to newsletter" defaultChecked />
      <Checkbox label="Disabled option" disabled />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Checkbox Props"
          data={[
            { prop: 'checked', type: 'boolean', default: 'undefined', description: 'Controlled checked state' },
            { prop: 'defaultChecked', type: 'boolean', default: 'false', description: 'Default checked state' },
            { prop: 'label', type: 'string | ReactNode', default: 'undefined', description: 'Checkbox label' },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Whether checkbox is disabled' },
            { prop: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate state' },
            { prop: 'onChange', type: '(checked: boolean) => void', default: 'undefined', description: 'Change handler' }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/radio">Radio</a> - Single selection from group</li>
          <li><a href="/reference/components/switch">Switch</a> - Toggle switch</li>
        </ul>
      </section>
    </div>
  );
}
