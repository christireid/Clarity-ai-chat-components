'use client'

import { durations } from '@/lib/animations'
import Link from 'next/link'
import { ExternalLink, BookOpen, Github, Twitter, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'

const footerNavigation = {
  learn: [
    { name: 'Quick Start', href: '/learn/quick-start' },
    { name: 'Installation', href: '/learn/installation' },
    { name: 'Tutorial', href: '/learn/tutorial' },
    { name: 'Core Concepts', href: '/learn/concepts' },
  ],
  reference: [
    { name: 'Components', href: '/reference/components' },
    { name: 'Hooks', href: '/reference/hooks' },
    { name: 'Utilities', href: '/reference/utilities' },
    { name: 'API Reference', href: '/reference/api' },
  ],
  community: [
    {
      name: 'GitHub',
      href: 'https://github.com/christireid/Clarity-ai-chat-components',
    },
    { name: 'Examples', href: '/examples' },
    { name: 'Cookbook', href: '/cookbook' },
  ],
  about: [
    { name: 'About', href: '/about' },
    { name: 'License', href: '/license' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Contributing', href: '/contributing' },
  ],
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/christireid/Clarity-ai-chat-components',
    icon: Github,
  },
]

export function Footer() {
  const footerSections = [
    { title: 'Learn', items: footerNavigation.learn },
    { title: 'Reference', items: footerNavigation.reference },
    { title: 'Community', items: footerNavigation.community },
    { title: 'About', items: footerNavigation.about },
  ]

  return (
    <footer className="relative border-t border-border bg-bg-secondary overflow-hidden">
      {/* Decorative gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="container-docs py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: durations.slow,
                delay: sectionIndex * 0.1,
              }}
            >
              <h3 className="font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: durations.moderate,
                      delay: sectionIndex * 0.1 + itemIndex * 0.05,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1 text-text-secondary hover:text-brand-500 transition-colors text-sm relative"
                      {...(item.href.startsWith('http') && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      <span className="relative">
                        {item.name}
                        <motion.span
                          className="absolute bottom-0 left-0 h-px bg-brand-500"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: durations.normal }}
                        />
                      </span>
                      {item.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.6 }}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Logo & Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.7 }}
            className="flex items-center gap-2 text-text-secondary text-sm"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: durations.slower }}
            >
              <BookOpen className="w-5 h-5 text-brand-500" />
            </motion.div>
            <span>© {new Date().getFullYear()} Clarity Chat. MIT License.</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.7 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-brand-500 transition-colors"
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: durations.moderate,
                    delay: 0.8 + index * 0.1,
                  }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
