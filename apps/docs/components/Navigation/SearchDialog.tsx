'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Hash, FileText, BookOpen, Wrench, Code2, Sparkles, Rocket, Link2 } from 'lucide-react'
import { CommandPalette, type CommandItem } from '@clarity-chat/react'
import { searchData } from '@/lib/search-data'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter()

  // Transform search data into CommandItem format
  const commandItems = useMemo<CommandItem[]>(() => {
    return searchData.map((item) => ({
      id: item.href,
      label: item.title,
      description: item.description,
      icon: getTypeIcon(item.type),
      category: getCategoryName(item.type),
      onSelect: () => {
        router.push(item.href)
      },
    }))
  }, [router])

  return (
    <CommandPalette
      items={commandItems}
      open={open}
      onClose={onClose}
      placeholder="Search documentation..."
    />
  )
}

// Icon mapping by content type
function getTypeIcon(type: string) {
  const iconClass = "w-4 h-4"

  switch (type) {
    case 'component':
      return <Hash className={`${iconClass} text-brand-500`} />
    case 'hook':
      return <Wrench className={`${iconClass} text-purple-500`} />
    case 'guide':
      return <FileText className={`${iconClass} text-green-500`} />
    case 'example':
      return <Code2 className={`${iconClass} text-orange-500`} />
    case 'cookbook':
      return <BookOpen className={`${iconClass} text-amber-500`} />
    case 'concept':
      return <Sparkles className={`${iconClass} text-blue-500`} />
    case 'deployment':
      return <Rocket className={`${iconClass} text-indigo-500`} />
    case 'integration':
      return <Link2 className={`${iconClass} text-teal-500`} />
    default:
      return <FileText className={`${iconClass} text-gray-500`} />
  }
}

// Category name mapping
function getCategoryName(type: string): string {
  const categoryMap: Record<string, string> = {
    component: 'Components',
    hook: 'Hooks',
    guide: 'Guides',
    example: 'Examples',
    cookbook: 'Cookbook',
    concept: 'Concepts',
    deployment: 'Deployment',
    integration: 'Integrations',
  }

  return categoryMap[type] || 'Documentation'
}
