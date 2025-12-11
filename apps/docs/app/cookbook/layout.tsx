import { DocsLayout } from '@/components/Layout/DocsLayout'
import { cookbookNavigation } from '@/lib/navigation'

export default function CookbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsLayout navigation={cookbookNavigation}>
      {children}
    </DocsLayout>
  )
}
