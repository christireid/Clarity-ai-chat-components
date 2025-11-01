import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'use-undo-redo | Clarity Chat', description: 'React hook for undo-redo functionality.' }
export default function Use-undo-redoPage() {
  return (<div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-4xl font-bold mb-4">use-undo-redo</h1><p className="text-xl text-muted-foreground mb-8">React hook providing undo-redo functionality.</p><section className="mb-12"><h2 className="text-3xl font-semibold mb-4">Usage</h2><pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code>{`import { use_undo_redo } from '@clarity-chat/react'\n\nconst result = use_undo_redo()`}</code></pre></section></div>)
}
