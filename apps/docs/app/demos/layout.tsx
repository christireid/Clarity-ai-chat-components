import { Sidebar } from '@/components/Navigation/Sidebar'
import { demosNavigation } from '@/lib/navigation'

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar navigation={demosNavigation} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
