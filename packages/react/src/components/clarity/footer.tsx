'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Separator } from '@clarity-chat/primitives'
import {
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
} from 'lucide-react'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

// Simple footer
interface SimpleFooterProps {
  companyName: string
  links?: FooterLink[]
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
    youtube?: string
    instagram?: string
    facebook?: string
  }
  className?: string
}

export function SimpleFooter({
  companyName,
  links = [],
  socialLinks,
  className,
}: SimpleFooterProps) {
  const year = new Date().getFullYear()

  const socialIcons = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
  }

  return (
    <footer className={cn('border-t border-border bg-background', className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              &copy; {year} {companyName}. All rights reserved.
            </span>
          </div>

          {links.length > 0 && (
            <nav className="flex items-center gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {socialLinks && (
            <div className="flex items-center gap-3">
              {Object.entries(socialLinks).map(([key, url]) => {
                if (!url) return null
                const Icon = socialIcons[key as keyof typeof socialIcons]
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

// Full footer with sections
interface FullFooterProps {
  companyName: string
  description?: string
  logo?: React.ReactNode
  sections: FooterSection[]
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
    youtube?: string
    instagram?: string
    facebook?: string
  }
  newsletter?: {
    title: string
    description?: string
    onSubscribe: (email: string) => void
  }
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
  bottomLinks?: FooterLink[]
  className?: string
}

export function FullFooter({
  companyName,
  description,
  logo,
  sections,
  socialLinks,
  newsletter,
  contact,
  bottomLinks = [],
  className,
}: FullFooterProps) {
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)
  const year = new Date().getFullYear()

  const socialIcons = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && newsletter) {
      newsletter.onSubscribe(email)
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className={cn('border-t border-border bg-background', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Company info */}
          <div className="lg:col-span-2">
            {logo ? (
              <div className="mb-4">{logo}</div>
            ) : (
              <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                {description}
              </p>
            )}
            {socialLinks && (
              <div className="flex items-center gap-3">
                {Object.entries(socialLinks).map(([key, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[key as keyof typeof socialIcons]
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Contact */}
          <div className="lg:col-span-2">
            {newsletter && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">{newsletter.title}</h4>
                {newsletter.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {newsletter.description}
                  </p>
                )}
                {subscribed ? (
                  <p className="text-sm text-green-500">
                    Thanks for subscribing!
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            )}

            {contact && (
              <div className="space-y-2">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {contact.address}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {companyName}. All rights reserved.
          </p>
          {bottomLinks.length > 0 && (
            <nav className="flex items-center gap-6">
              {bottomLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}

// Minimal footer
interface MinimalFooterProps {
  text?: string
  links?: FooterLink[]
  className?: string
}

export function MinimalFooter({
  text,
  links = [],
  className,
}: MinimalFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn('py-6', className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>{text ?? `© ${year} All rights reserved.`}</span>
          {links.length > 0 && (
            <>
              <span className="hidden sm:inline">·</span>
              <nav className="flex items-center gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}

// Built with footer
interface BuiltWithFooterProps {
  builtWith: { name: string; href?: string }[]
  className?: string
}

export function BuiltWithFooter({
  builtWith,
  className,
}: BuiltWithFooterProps) {
  return (
    <footer className={cn('py-6 border-t border-border', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>using</span>
          {builtWith.map((item, i) => (
            <React.Fragment key={item.name}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-accent"
                >
                  {item.name}
                </a>
              ) : (
                <span className="font-medium text-foreground">{item.name}</span>
              )}
              {i < builtWith.length - 1 && <span>,</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  )
}
