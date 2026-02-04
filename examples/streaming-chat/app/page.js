'use client'
import { jsx as _jsx } from 'react/jsx-runtime'
import { StreamingChat } from '@/components/streaming-chat'
import { ErrorBoundary } from '@/components/ErrorBoundary'
export default function Home() {
  return _jsx('main', {
    className: 'min-h-screen bg-background',
    children: _jsx(ErrorBoundary, { children: _jsx(StreamingChat, {}) }),
  })
}
//# sourceMappingURL=page.js.map
