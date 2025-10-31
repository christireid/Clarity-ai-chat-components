import Link from 'next/link'
import { Github, Twitter, Youtube, BookOpen } from 'lucide-react'

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
    { name: 'GitHub', href: 'https://github.com/clarity-chat/ui' },
    { name: 'Storybook', href: 'https://storybook.clarity-chat.dev' },
    { name: 'Examples', href: '/examples' },
    { name: 'Blog', href: '/blog' },
  ],
  about: [
    { name: 'About', href: '/about' },
    { name: 'License', href: '/license' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Contributing', href: '/contributing' },
  ],
}

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/clarity-chat/ui', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/claritychat', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/@claritychat', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="container-docs py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Learn */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Learn</h3>
            <ul className="space-y-3">
              {footerNavigation.learn.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-brand-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reference */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Reference</h3>
            <ul className="space-y-3">
              {footerNavigation.reference.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-brand-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Community</h3>
            <ul className="space-y-3">
              {footerNavigation.community.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-brand-500 transition-colors text-sm"
                    {...(item.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">About</h3>
            <ul className="space-y-3">
              {footerNavigation.about.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-brand-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <span>© {new Date().getFullYear()} Clarity Chat. MIT License.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-brand-500 transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
