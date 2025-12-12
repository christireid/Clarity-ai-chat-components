'use client'

import { ErrorPage } from '@clarity-chat/example-utils/pages'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorPage error={error} reset={reset} />
}
