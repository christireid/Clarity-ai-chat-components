import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Upload, List, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Document Summarizer Example',
  description: 'Upload and summarize documents with AI-powered analysis',
}

export default function DocumentSummarizerPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Document Summarizer</h1>
            <p className="text-xl text-text-secondary">
              Upload documents and get AI-powered summaries, Q&A, and insights
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
            Advanced
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-sm">
            Document Processing
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Document Upload</strong> - PDF, DOCX, TXT, MD files
            </li>
            <li>
              <strong>Smart Summaries</strong> - Key points extraction
            </li>
            <li>
              <strong>Q&A</strong> - Ask questions about document content
            </li>
            <li>
              <strong>Entity Extraction</strong> - Find names, dates, locations
            </li>
            <li>
              <strong>Key Insights</strong> - Important findings highlighted
            </li>
            <li>
              <strong>Multi-Document Analysis</strong> - Compare multiple
              documents
            </li>
            <li>
              <strong>Export Summaries</strong> - Save as PDF or Markdown
            </li>
          </ul>

          <h2>💬 Example Workflow</h2>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">📄 Step 1: Upload</p>
                <p className="text-text-secondary">
                  Upload "Q4_Financial_Report.pdf" (47 pages)
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">⚙️ Step 2: Processing</p>
                <p className="text-text-secondary">
                  AI extracts text, identifies sections, analyzes content
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">📝 Step 3: Summary</p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded mt-2">
                  <p className="font-medium">
                    Executive Summary (Auto-generated)
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-text-secondary">
                    <li>• Revenue: $12.5M (↑15% YoY)</li>
                    <li>• Profit Margin: 23% (target: 20%)</li>
                    <li>• Key Risk: Supply chain delays</li>
                    <li>• Recommendation: Diversify suppliers</li>
                  </ul>
                </div>
              </div>
              <div>
                <p className="font-medium mb-1">💬 Step 4: Q&A</p>
                <p className="text-text-secondary">
                  Ask: "What were the top 3 expenses?" → Get instant answers
                </p>
              </div>
            </div>
          </div>

          <h2>🎯 Supported Document Types</h2>
          <div className="grid md:grid-cols-3 gap-3 not-prose my-6">
            {[
              { type: 'PDF', icon: '📄', ext: '.pdf' },
              { type: 'Word', icon: '📝', ext: '.docx, .doc' },
              { type: 'Text', icon: '📃', ext: '.txt, .md' },
              { type: 'PowerPoint', icon: '📊', ext: '.pptx' },
              { type: 'Excel', icon: '📈', ext: '.xlsx' },
              { type: 'CSV', icon: '📋', ext: '.csv' },
            ].map((doc) => (
              <div
                key={doc.type}
                className="p-3 border border-border rounded-lg text-center"
              >
                <div className="text-3xl mb-1">{doc.icon}</div>
                <div className="font-medium text-sm">{doc.type}</div>
                <div className="text-xs text-text-secondary">{doc.ext}</div>
              </div>
            ))}
          </div>

          <h2>📊 Analysis Capabilities</h2>
          <ul>
            <li>
              <strong>Extractive Summary</strong> - Pull key sentences
            </li>
            <li>
              <strong>Abstractive Summary</strong> - Generate new summary text
            </li>
            <li>
              <strong>Entity Recognition</strong> - Names, organizations,
              locations, dates
            </li>
            <li>
              <strong>Sentiment Analysis</strong> - Overall tone and sentiment
            </li>
            <li>
              <strong>Topic Modeling</strong> - Main themes and topics
            </li>
            <li>
              <strong>Citation Tracking</strong> - References and sources
            </li>
          </ul>

          <h2>🔗 Related Examples</h2>
          <ul>
            <li>
              <Link
                href="/guides/rag"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                RAG Guide
              </Link>{' '}
              - For document Q&A
            </li>
            <li>
              <Link
                href="/reference/components/file-upload"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                File Upload
              </Link>{' '}
              - Upload component
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
