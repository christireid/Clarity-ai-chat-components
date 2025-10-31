import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';

export const metadata: Metadata = {
  title: 'Select Component - Clarity Chat Components',
  description: 'A dropdown selection component for choosing from a list of options.',
};

export default function SelectPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Select</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A dropdown selection component for choosing from a list of options.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Select } from '@clarity/chat-components';

export default function BasicSelect() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  return (
    <Select options={options} placeholder="Select a fruit..." />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Select Props"
          data={[
            { prop: 'options', type: 'Array<{value: string, label: string}>', default: '[]', description: 'Array of options' },
            { prop: 'value', type: 'string', default: 'undefined', description: 'Selected value' },
            { prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
            { prop: 'label', type: 'string', default: 'undefined', description: 'Label for select' },
            { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Select size' },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Whether select is disabled' },
            { prop: 'error', type: 'string | boolean', default: 'undefined', description: 'Error state' },
            { prop: 'onChange', type: '(value: string) => void', default: 'undefined', description: 'Change handler' }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/input">Input</a> - Text input</li>
          <li><a href="/reference/components/dropdown">Dropdown</a> - Menu dropdown</li>
        </ul>
      </section>
    </div>
  );
}
