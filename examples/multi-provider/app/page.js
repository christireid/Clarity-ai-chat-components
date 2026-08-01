'use client'
import { jsx as _jsx } from 'react/jsx-runtime'
import { MultiProviderChat } from '@/components/multi-provider-chat'
import { ErrorBoundary } from '@/components/error-boundary'
export default function Home() {
  return _jsx('main', {
    className: 'min-h-screen bg-background',
    children: _jsx(ErrorBoundary, { children: _jsx(MultiProviderChat, {}) }),
  })
}
//# sourceMappingURL=page.js.map
