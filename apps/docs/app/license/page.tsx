import { Metadata } from 'next'
import Link from 'next/link'
import { Scale, Heart, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'License - MIT',
  description: 'Clarity Chat is open source and released under the MIT License',
}

export default function LicensePage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">MIT License</h1>
        <p className="text-xl text-text-secondary mb-12">
          Clarity Chat is free and open source software released under the MIT
          License.
        </p>

        {/* What This Means Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">What This Means For You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-border rounded-xl">
              <Scale className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Use Freely</h3>
              <p className="text-text-secondary">
                Use Clarity Chat in any project—personal, commercial, or
                enterprise—without restrictions.
              </p>
            </div>
            <div className="p-6 border border-border rounded-xl">
              <Code className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Modify Freely</h3>
              <p className="text-text-secondary">
                Fork, modify, and customize the code to fit your needs. It's
                your code now.
              </p>
            </div>
            <div className="p-6 border border-border rounded-xl">
              <Heart className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Distribute Freely</h3>
              <p className="text-text-secondary">
                Share, redistribute, and even sell products built with Clarity
                Chat. No royalties required.
              </p>
            </div>
          </div>
        </section>

        {/* License Text */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Full License Text</h2>
          </div>
          <div className="p-8 bg-bg-secondary rounded-xl border border-border font-mono text-sm">
            <pre className="whitespace-pre-wrap text-text-secondary">
              {`MIT License

Copyright (c) 2024 Christi Reid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </pre>
          </div>
        </section>

        {/* Attribution Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Attribution</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed">
              While not required by the license, we appreciate attribution! If
              you use Clarity Chat in your project, consider:
            </p>
            <ul className="text-text-secondary space-y-2 mt-4">
              <li>Adding a "Built with Clarity Chat" badge to your project</li>
              <li>Starring our GitHub repository</li>
              <li>Sharing your project in our showcase</li>
              <li>Contributing improvements back to the community</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-text-secondary mb-6">
            Need clarification on licensing or commercial use? We're here to
            help.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Ask on GitHub
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
