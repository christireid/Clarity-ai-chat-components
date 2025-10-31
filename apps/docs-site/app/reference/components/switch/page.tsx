import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';

export const metadata: Metadata = {
  title: 'Switch Component - Clarity Chat Components',
  description: 'A toggle switch component for binary on/off states.',
};

export default function SwitchPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Switch</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A toggle switch component for binary on/off states.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Switch } from '@clarity/chat-components';

export default function BasicSwitch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-3">
      <Switch label="Enable notifications" checked={enabled} onChange={setEnabled} />
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Disabled option" disabled />
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Switch Props"
          data={[
            { prop: 'checked', type: 'boolean', default: 'undefined', description: 'Controlled checked state' },
            { prop: 'defaultChecked', type: 'boolean', default: 'false', description: 'Default checked state' },
            { prop: 'label', type: 'string | ReactNode', default: 'undefined', description: 'Switch label' },
            { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Switch size' },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Whether switch is disabled' },
            { prop: 'onChange', type: '(checked: boolean) => void', default: 'undefined', description: 'Change handler' }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/checkbox">Checkbox</a> - Checkbox input</li>
          <li><a href="/reference/components/radio">Radio</a> - Radio button input</li>
        </ul>
      </section>
    </div>
  );
}
