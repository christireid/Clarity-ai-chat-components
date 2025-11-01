import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Stream Cancellation | Clarity Chat', description: 'Cancel button for active streaming operations.' }
export default function StreamCancellationPage() {
  return (<div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-4xl font-bold mb-4">Stream Cancellation</h1><p className="text-xl text-muted-foreground mb-8">Accessible cancel button for stopping active streams with optional progress indicator.</p><section className="mb-12"><h2 className="text-3xl font-semibold mb-4">Usage</h2><pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code>{`import { StreamCancellation } from '@clarity-chat/react'

<StreamCancellation
  isStreaming={status === 'streaming'}
  onCancel={() => disconnect()}
  showProgress={true}
  progressMessage="Generating response..."
/>`}</code></pre></section></div>)
}
