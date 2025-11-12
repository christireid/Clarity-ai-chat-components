import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates about building AI chat interfaces',
}

const blogPosts = [
  {
    title: 'The 7 UX Disasters Killing AI Chat Apps',
    href: '/blog/the-7-ux-disasters-killing-ai-chat-apps',
    description: 'Learn from $200K in mistakes: the most common UX pitfalls and how to avoid them',
    date: '2024',
    category: 'UX Design',
  },
  {
    title: 'AI Chat UX Pain Points and Solutions',
    href: '/blog/ai-chat-ux-pain-points-and-solutions',
    description: 'A comprehensive guide to solving the most frustrating UX problems in AI chat interfaces',
    date: '2024',
    category: 'Tutorial',
  },
  {
    title: 'Viral Strategies Research',
    href: '/blog/viral-strategies-research',
    description: 'Research on viral growth strategies for developer tools and component libraries',
    date: '2024',
    category: 'Research',
  },
]

export default function BlogPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-text-secondary">
            Insights, tutorials, and updates about building AI chat interfaces with Clarity Chat.
          </p>
        </div>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group block p-8 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-text-tertiary flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary">{post.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-text-tertiary group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-text-secondary mb-6">
            Get the latest updates, tutorials, and insights delivered to your inbox.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com/clarity-chat/ui/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Join Discussion
            </a>
            <a
              href="https://discord.gg/clarity-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
