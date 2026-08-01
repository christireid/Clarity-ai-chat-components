'use client'
import { jsx as _jsx } from 'react/jsx-runtime'
import { ThemingDemo } from '@/components/theming-demo'
import { ErrorBoundary } from '@/components/error-boundary'
export default function Home() {
  return _jsx('main', {
    className: 'min-h-screen bg-background',
    children: _jsx(ErrorBoundary, { children: _jsx(ThemingDemo, {}) }),
  })
}
//# sourceMappingURL=page.js.map
