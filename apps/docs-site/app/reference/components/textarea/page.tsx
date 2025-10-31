import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';

export const metadata: Metadata = {
  title: 'Textarea Component - Clarity Chat Components',
  description: 'A multi-line text input component for longer text entry.',
};

export default function TextareaPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Textarea</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A multi-line text input component for longer text entry.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Textarea } from '@clarity/chat-components';

export default function BasicTextarea() {
  return (
    <Textarea
      placeholder="Enter your message..."
      rows={4}
    />
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Textarea Props"
          data={[
            { prop: 'value', type: 'string', default: 'undefined', description: 'Controlled value' },
            { prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
            { prop: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
            { prop: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Resize behavior' },
            { prop: 'disabled', type: 'boolean', default: 'false', description: 'Whether textarea is disabled' },
            { prop: 'error', type: 'string | boolean', default: 'undefined', description: 'Error state' },
            { prop: 'onChange', type: '(e: ChangeEvent) => void', default: 'undefined', description: 'Change handler' }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/input">Input</a> - Single-line text input</li>
          <li><a href="/reference/components/message-input">MessageInput</a> - Chat message input</li>
        </ul>
      </section>
    </div>
  );
}
