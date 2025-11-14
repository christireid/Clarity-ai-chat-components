import { DocsLayout } from '@/components/Layout/DocsLayout'
import { examplesNavigation } from '@/lib/navigation'

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout navigation={examplesNavigation}>
      {children}
    </DocsLayout>
  )
}
