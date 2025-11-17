'use client'

import { motion } from 'framer-motion'
import { Star, Users, Download, TrendingUp } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  trend?: string
}

function StatItem({ icon, value, label, trend }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="flex items-center justify-center mb-3 text-brand-500">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1 text-text-primary">
        {value}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
      {trend && (
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </motion.div>
  )
}

export function SocialProof() {
  return (
    <section className="py-16 border-y border-border bg-bg-secondary/50">
      <div className="container-docs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem
            icon={<Download className="w-8 h-8" />}
            value="50K+"
            label="NPM Downloads"
            trend="+12% this month"
          />
          <StatItem
            icon={<Star className="w-8 h-8" />}
            value="2.5K+"
            label="GitHub Stars"
            trend="Growing daily"
          />
          <StatItem
            icon={<Users className="w-8 h-8" />}
            value="10K+"
            label="Developers"
            trend="Worldwide"
          />
          <StatItem
            icon={<span className="text-3xl">🏆</span>}
            value="100%"
            label="WCAG AAA"
          />
        </div>
      </div>
    </section>
  )
}
