import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Clarity Chat',
  description: 'Insights, tutorials, and best practices for building AI chat interfaces.',
}

const blogPosts = [
  {
    title: 'The 7 UX Disasters Killing Your AI Chat App',
    slug: 'the-7-ux-disasters-killing-ai-chat-apps',
    description: 'Look, I\'ve shipped a lot of AI chat interfaces. Some good, most... not so much. Here\'s what I learned the hard way.',
    date: '2024-12-15',
    readTime: '15 min',
  },
  {
    title: 'AI Chat UX Pain Points and Solutions',
    slug: 'ai-chat-ux-pain-points-and-solutions',
    description: 'I\'ve spent the last three years building AI chat interfaces. Here are the mistakes that cost me $200K.',
    date: '2024-12-10',
    readTime: '12 min',
  },
  {
    title: 'Viral Technical Blog Post Strategies',
    slug: 'viral-strategies-research',
    description: 'Research notes on what makes technical blog posts go viral.',
    date: '2024-12-05',
    readTime: '5 min',
  },
]

export default function BlogPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Blog</span>
        <h1>Blog</h1>
        <p className="docs-lead">
          Insights, tutorials, and best practices for building AI chat interfaces.
        </p>
      </div>

      <div className="grid gap-8 mt-12">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 border border-border rounded-xl hover:border-brand-500 hover:bg-bg-secondary transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-text-primary">{post.title}</h2>
              <span className="text-sm text-text-secondary whitespace-nowrap ml-4">
                {post.readTime}
              </span>
            </div>
            <p className="text-text-secondary mb-4">{post.description}</p>
            <time className="text-sm text-text-tertiary">{post.date}</time>
          </Link>
        ))}
      </div>
    </div>
  )
}
