import { DocsLayout } from '@/components/Layout/DocsLayout'
import { referenceNavigation } from '@/lib/navigation'

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout navigation={referenceNavigation}>
      {children}
    </DocsLayout>
  )
}
