'use client'

import React, { useState } from 'react'
import { ToolApproval, ToolApprovalStatus } from '@/components/AI/ToolApproval'

export default function ToolApprovalPage() {
  const [status, setStatus] = useState<ToolApprovalStatus>('approval_required')

  const handleApprove = () => {
    setStatus('executing')
    setTimeout(() => setStatus('completed'), 2000)
  }

  const handleReject = () => {
    setStatus('rejected')
  }

  const resetDemo = () => {
    setStatus('approval_required')
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Reference</span>
          <span>/</span>
          <span>Components</span>
          <span>/</span>
          <span className="text-foreground">ToolApproval</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">ToolApproval</h1>
        <p className="text-xl text-muted-foreground">
          Human-in-the-loop approval interface for AI tool executions with risk
          visualization.
        </p>
      </div>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <ToolApproval
            tool={{
              name: 'send_email',
              description:
                'Send an email notification to the customer about their order status.',
              args: {
                to: 'customer@example.com',
                subject: 'Order Status Update',
                body: 'Your order has been shipped...',
              },
              riskLevel: 'medium',
            }}
            status={status}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <div className="flex justify-center">
            <button
              onClick={resetDemo}
              className="px-4 py-2 text-sm text-primary hover:underline"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">CLI Installation</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code>npx clarity-chat add tool-approval</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`import { ToolApproval } from '@clarity/react';

function ToolExecutionUI({ toolCall }) {
  const [status, setStatus] = useState('approval_required');

  const handleApprove = async () => {
    setStatus('executing');
    try {
      await executeTool(toolCall);
      setStatus('completed');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <ToolApproval
      tool={{
        name: toolCall.name,
        description: toolCall.description,
        args: toolCall.arguments,
        riskLevel: toolCall.riskLevel,
      }}
      status={status}
      onApprove={handleApprove}
      onReject={() => setStatus('rejected')}
    />
  );
}`}</code>
        </pre>
      </section>

      {/* Status States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Status States</h2>
        <div className="space-y-4">
          {(
            [
              'pending',
              'approval_required',
              'approved',
              'executing',
              'completed',
              'rejected',
              'error',
            ] as ToolApprovalStatus[]
          ).map((s) => (
            <ToolApproval
              key={s}
              tool={{
                name: 'example_tool',
                description: `Example tool in ${s} state`,
                riskLevel: s === 'error' ? 'high' : 'low',
              }}
              status={s}
              errorMessage={
                s === 'error'
                  ? 'Connection timeout. Please try again.'
                  : undefined
              }
              showArgs={false}
            />
          ))}
        </div>
      </section>

      {/* Props Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>tool</code>
                </td>
                <td className="py-3 px-4">
                  <code>ToolInfo</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">Tool information object</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>status</code>
                </td>
                <td className="py-3 px-4">
                  <code>ToolApprovalStatus</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">Current approval/execution status</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onApprove</code>
                </td>
                <td className="py-3 px-4">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Callback when user approves</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onReject</code>
                </td>
                <td className="py-3 px-4">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Callback when user rejects</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onModify</code>
                </td>
                <td className="py-3 px-4">
                  <code>(args) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">
                  Callback to modify args before approval
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>errorMessage</code>
                </td>
                <td className="py-3 px-4">
                  <code>string</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Error message for error status</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>autoApproveIn</code>
                </td>
                <td className="py-3 px-4">
                  <code>number</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Seconds until auto-approval</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>showArgs</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>true</code>
                </td>
                <td className="py-3 px-4">Show expandable arguments section</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ToolInfo Interface */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">ToolInfo Interface</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`interface ToolInfo {
  /** Tool identifier */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Tool arguments/parameters */
  args?: Record<string, unknown>;
  /** Risk level for visual indicator */
  riskLevel?: 'low' | 'medium' | 'high';
}`}</code>
        </pre>
      </section>

      {/* Risk Levels */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Risk Levels</h2>
        <div className="space-y-4">
          <ToolApproval
            tool={{
              name: 'read_file',
              description: 'Read contents of a configuration file.',
              riskLevel: 'low',
            }}
            status="approval_required"
            showArgs={false}
          />
          <ToolApproval
            tool={{
              name: 'update_database',
              description: 'Update user preferences in the database.',
              riskLevel: 'medium',
            }}
            status="approval_required"
            showArgs={false}
          />
          <ToolApproval
            tool={{
              name: 'delete_all_records',
              description:
                'Permanently delete all user records from the system.',
              riskLevel: 'high',
            }}
            status="approval_required"
            showArgs={false}
          />
        </div>
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>

        <h3 className="text-lg font-medium mb-3">WCAG Compliance</h3>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Standard</th>
              <th className="text-left py-2 px-4">Level</th>
              <th className="text-left py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">WCAG 2.2</td>
              <td className="py-2 px-4">AA</td>
              <td className="py-2 px-4">✅ Compliant</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-medium mb-3">Keyboard Navigation</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Key</th>
              <th className="text-left py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Tab</kbd>
              </td>
              <td className="py-2 px-4">Navigate between actions</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Enter</kbd>
              </td>
              <td className="py-2 px-4">Activate focused action</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Space</kbd>
              </td>
              <td className="py-2 px-4">Toggle parameters section</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/reference/components/generative-ui"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">GenerativeUI</h3>
            <p className="text-sm text-muted-foreground">
              Render dynamic UI for tool results.
            </p>
          </a>
          <a
            href="/guides/tools"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Tool Calling Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to implement tool calling with approval flows.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
