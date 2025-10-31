import { DocsLayout } from '@/components/Layout/DocsLayout'
import { learnNavigation } from '@/lib/navigation'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout navigation={learnNavigation}>
      {children}
    </DocsLayout>
  )
}
