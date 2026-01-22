'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Code2, Play, BookOpen, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  {
    icon: Home,
    label: 'Home',
    href: '/',
  },
  {
    icon: BookOpen,
    label: 'Start',
    href: '/get-started',
  },
  {
    icon: Play,
    label: 'Explore',
    href: '/explore',
  },
  {
    icon: Code2,
    label: 'API',
    href: '/api',
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showNav, setShowNav] = useState(true)

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: showNav ? 0 : 100 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 safe-area-inset-bottom"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[64px] transition-all',
                isActive
                  ? 'text-brand-500'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <span className="relative z-10 text-xs font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </motion.nav>
  )
}
