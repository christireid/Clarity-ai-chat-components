'use client'

import { ToastProvider } from '@clarity-chat/react/internal'

export function ClientToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToastProvider>{children}</ToastProvider>
}
