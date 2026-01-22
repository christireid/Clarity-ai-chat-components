import { DocsLayout } from '@/components/Layout/DocsLayout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
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
