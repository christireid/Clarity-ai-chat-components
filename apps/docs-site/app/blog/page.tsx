import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - Clarity Chat',
  description: 'Insights, tutorials, and updates about building AI chat interfaces',
}

// Blog post metadata
const blogPosts = [
  {
    slug: 'ai-chat-ux-pain-points-and-solutions',
    title: 'I Built 20 AI Chat Interfaces. Here Are The 7 Mistakes That Cost Me $200K',
    excerpt: 'Spoiler: You\'re probably making all of them right now. Learn from my $200K mistake and avoid the common pitfalls.',
    date: '2024-01-15',
    readTime: '12 min read',
  },
  {
    slug: 'the-7-ux-disasters-killing-ai-chat-apps-v2',
    title: 'The 7 UX Disasters Killing AI Chat Apps (V2)',
    excerpt: 'Updated analysis of the most common UX mistakes that kill AI chat applications.',
    date: '2024-02-01',
    readTime: '10 min read',
  },
  {
    slug: 'the-7-ux-disasters-killing-ai-chat-apps',
    title: 'The 7 UX Disasters Killing AI Chat Apps',
    excerpt: 'The fundamental UX mistakes that determine whether users love your product or abandon it.',
    date: '2023-12-10',
    readTime: '8 min read',
  },
  {
    slug: 'viral-strategies-research',
    title: 'Viral Strategies Research',
    excerpt: 'Research and insights on creating viral AI chat experiences.',
    date: '2024-01-20',
    readTime: '15 min read',
  },
]

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs />
      
      <div className="docs-content">
        <div className="docs-header">
          <span className="docs-badge">Blog</span>
          <h1>Clarity Chat Blog</h1>
          <p className="docs-lead">
            Insights, tutorials, and updates about building beautiful, accessible AI chat interfaces.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group border border-border rounded-lg p-6 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold group-hover:text-brand-500 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
              </div>

              <p className="text-text-secondary mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 mt-4 text-brand-500 hover:text-brand-600 font-medium group/link"
              >
                Read more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 p-6 bg-bg-secondary rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-2">Interactive Demos</h3>
          <p className="text-text-secondary mb-4">
            Check out our interactive HTML demos showcasing animations and UX improvements:
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog/demos/animations"
              className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-md text-sm font-medium transition-colors"
            >
              Animation Demos
            </Link>
            <Link
              href="/blog/demos/assets"
              className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-md text-sm font-medium transition-colors"
            >
              Asset Demos
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
