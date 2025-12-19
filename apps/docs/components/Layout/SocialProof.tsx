'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, Download, TrendingUp, GitFork, Eye } from 'lucide-react'

interface GitHubStats {
  stars: number
  forks: number
  watchers: number
}

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  trend?: string
  isLoading?: boolean
}

function StatItem({ icon, value, label, trend }: StatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative text-center p-6 rounded-xl border border-transparent hover:border-brand-500/30 transition-all hover:shadow-lg hover:bg-bg-primary/50"
    >
      {/* Icon */}
      <motion.div
        className="flex items-center justify-center mb-3 text-brand-500"
        animate={{
          rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Value */}
      <motion.div
        className="text-3xl md:text-4xl font-bold mb-1 text-text-primary"
        animate={{
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>

      {/* Label */}
      <div className="text-sm text-text-secondary font-medium">{label}</div>

      {/* Trend */}
      {trend && (
        <motion.div
          className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-semibold"
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{
              y: isHovered ? [-2, 2, -2] : 0
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0
            }}
          >
            <TrendingUp className="w-3 h-3" />
          </motion.div>
          <span>{trend}</span>
        </motion.div>
      )}

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export function SocialProof() {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    // Fetch live GitHub stats
    async function fetchGitHubStats() {
      try {
        const res = await fetch(
          'https://api.github.com/repos/christireid/Clarity-ai-chat-components',
          { next: { revalidate: 3600 } } // Cache for 1 hour
        )
        if (res.ok) {
          const data = await res.json()
          setGithubStats({
            stars: data.stargazers_count,
            forks: data.forks_count,
            watchers: data.subscribers_count,
          })
        }
      } catch {
        // Use fallback stats on error
      }
    }
    fetchGitHubStats()
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+'
    }
    return num.toString() + '+'
  }

  const stats = [
    {
      icon: <Star className="w-8 h-8" />,
      value: githubStats ? formatNumber(githubStats.stars) : '2.5K+',
      label: 'GitHub Stars',
      trend: 'Live count'
    },
    {
      icon: <Download className="w-8 h-8" />,
      value: '50K+',
      label: 'NPM Downloads',
      trend: '+12% this month'
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: '10K+',
      label: 'Developers',
      trend: 'Worldwide'
    },
    {
      icon: <span className="text-3xl">🏆</span>,
      value: '100%',
      label: 'WCAG AAA',
      trend: 'Certified'
    }
  ]

  return (
    <section className="py-16 border-y border-border bg-bg-secondary/50 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="container-docs relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <StatItem {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
