/**
 * CitationCard Interactive Showcase
 *
 * Comprehensive demonstration of citation formatting, hover states,
 * glassmorphism styling, and real-world examples.
 */

import React, { useState } from 'react'
import { CitationCard } from '@clarity-chat/react'
import { SourceCitation } from '@clarity-chat/react'
import type { Citation } from '@clarity-chat/react'
import type { Source } from '@clarity-chat/react'

// Real-world citation examples
const academicCitations: Citation[] = [
  {
    source: 'Nature - Climate Change Impact Study',
    chunkText: 'Recent studies have shown that global temperatures have risen by 1.1°C since pre-industrial times. This warming trend has accelerated significantly in the past four decades, with observable impacts on ecosystems worldwide. The Antarctic ice shelf has shown a 30% reduction in volume, while Arctic sea ice extent has decreased by 13% per decade since 1979.',
    confidence: 0.95,
    url: 'https://nature.com/articles/climate-2024',
    metadata: {
      author: 'Dr. Sarah Chen et al.',
      date: '2024-01-15',
      page: '142-156',
      section: 'Climate Science',
      journal: 'Nature Climate Change',
      doi: '10.1038/nclimate.2024.001'
    }
  },
  {
    source: 'MIT Technology Review - AI Advancements',
    chunkText: 'Large language models have demonstrated unprecedented capabilities in natural language understanding and generation. Recent benchmarks show that state-of-the-art models achieve human-level performance on complex reasoning tasks, with accuracy rates exceeding 95% on standardized tests.',
    confidence: 0.88,
    url: 'https://technologyreview.com/ai-progress-2024',
    metadata: {
      author: 'James Rodriguez',
      date: '2024-02-20',
      section: 'Artificial Intelligence',
      readTime: '8 min'
    }
  },
  {
    source: 'The Lancet - Public Health Research',
    chunkText: 'Longitudinal studies tracking 50,000 participants over 15 years reveal strong correlations between Mediterranean diet adherence and reduced cardiovascular disease risk.',
    confidence: 0.72,
    url: 'https://thelancet.com/health-study-2024',
    metadata: {
      author: 'Public Health Consortium',
      date: '2023-11-30',
      page: '89',
      cohortSize: '50,000 participants'
    }
  }
]

const technicalDocsCitations: Citation[] = [
  {
    source: 'React Documentation - Hooks API',
    chunkText: 'The useState Hook allows you to add React state to function components. When you call useState, you\'re declaring a "state variable". This is a way to preserve values between function calls - normally, variables disappear when the function exits, but state variables are preserved by React.',
    confidence: 0.98,
    url: 'https://react.dev/reference/react/useState',
    metadata: {
      version: 'React 18',
      category: 'Hooks',
      lastUpdated: '2024-01-10'
    }
  },
  {
    source: 'TypeScript Handbook - Advanced Types',
    chunkText: 'Union types are a powerful way to express a value that can be one of several types. A union type describes a value that can be one of several types. We use the vertical bar (|) to separate each type, so number | string | boolean is the type of a value that can be a number, a string, or a boolean.',
    confidence: 0.93,
    url: 'https://typescriptlang.org/docs/handbook/unions',
    metadata: {
      version: 'TypeScript 5.3',
      category: 'Type System'
    }
  }
]

const legalCitations: Citation[] = [
  {
    source: 'GDPR Article 17 - Right to Erasure',
    chunkText: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data without undue delay where specific grounds apply.',
    confidence: 0.99,
    url: 'https://gdpr-info.eu/art-17-gdpr',
    metadata: {
      regulation: 'GDPR',
      article: '17',
      effectiveDate: '2018-05-25',
      jurisdiction: 'European Union'
    }
  }
]

const newsCitations: Citation[] = [
  {
    source: 'The New York Times - Economic Analysis',
    chunkText: 'Federal Reserve officials indicated that interest rates might remain elevated longer than previously anticipated, as inflation continues to show resilience despite aggressive monetary tightening over the past 18 months.',
    confidence: 0.85,
    url: 'https://nytimes.com/economics/fed-rates-2024',
    metadata: {
      author: 'Economics Desk',
      date: '2024-02-15',
      section: 'Business'
    }
  }
]

// Source citation examples (for SourceCitation component)
const researchSources: Source[] = [
  {
    url: 'https://arxiv.org/abs/2024.12345',
    title: 'Attention Is All You Need: A Comprehensive Review',
    snippet: 'The Transformer architecture revolutionized natural language processing by introducing the self-attention mechanism, enabling models to capture long-range dependencies without recurrent connections.',
    confidence: 0.96,
    domain: 'arxiv.org',
    date: '2024-01-20',
    author: 'Vaswani et al.',
    metadata: {
      citations: 15000,
      category: 'cs.CL'
    }
  },
  {
    url: 'https://github.com/openai/gpt-4',
    title: 'GPT-4 Technical Report',
    snippet: 'GPT-4 is a large-scale, multimodal model which can accept image and text inputs and produce text outputs. It exhibits human-level performance on various professional and academic benchmarks.',
    confidence: 0.94,
    domain: 'github.com',
    date: '2023-03-14'
  },
  {
    url: 'https://huggingface.co/docs/transformers',
    title: 'Transformers Documentation',
    snippet: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX. Transformers provides APIs and tools to easily download and train state-of-the-art pretrained models.',
    confidence: 0.89,
    domain: 'huggingface.co'
  }
]

type DemoSection = 'formats' | 'variants' | 'interactive' | 'realworld'

export function CitationCardShowcase() {
  const [activeSection, setActiveSection] = useState<DemoSection>('formats')
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set())
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  const [sourceVariant, setSourceVariant] = useState<'inline' | 'card' | 'list'>('card')

  const toggleExpanded = (index: number) => {
    setExpandedCitations((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="citation-showcase">
      {/* Header */}
      <div className="showcase-section-header">
        <h2>Citation Card Demonstrations</h2>
        <p>Explore various citation formats, interactive states, and real-world examples</p>
      </div>

      {/* Navigation */}
      <nav className="showcase-nav-tabs">
        <button
          className={activeSection === 'formats' ? 'active' : ''}
          onClick={() => setActiveSection('formats')}
        >
          📋 Citation Formats
        </button>
        <button
          className={activeSection === 'variants' ? 'active' : ''}
          onClick={() => setActiveSection('variants')}
        >
          🎨 Display Variants
        </button>
        <button
          className={activeSection === 'interactive' ? 'active' : ''}
          onClick={() => setActiveSection('interactive')}
        >
          ⚡ Interactive States
        </button>
        <button
          className={activeSection === 'realworld' ? 'active' : ''}
          onClick={() => setActiveSection('realworld')}
        >
          🌍 Real-World Examples
        </button>
      </nav>

      {/* Content */}
      <div className="showcase-content">
        {/* Citation Formats */}
        {activeSection === 'formats' && (
          <div className="demo-section">
            <div className="demo-header">
              <h3>Citation Card Formats</h3>
              <p>CitationCard component with various confidence levels and metadata</p>
            </div>

            <div className="demo-grid">
              {/* High Confidence */}
              <div className="demo-item">
                <span className="demo-label">High Confidence (95%)</span>
                <CitationCard
                  citation={academicCitations[0]}
                  showConfidence
                  onSourceClick={(url) => console.log('Opening:', url)}
                />
              </div>

              {/* Medium Confidence */}
              <div className="demo-item">
                <span className="demo-label">Medium Confidence (88%)</span>
                <CitationCard
                  citation={academicCitations[1]}
                  showConfidence
                  defaultExpanded
                />
              </div>

              {/* Low Confidence */}
              <div className="demo-item">
                <span className="demo-label">Lower Confidence (72%)</span>
                <CitationCard
                  citation={academicCitations[2]}
                  showConfidence
                  previewLength={100}
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Variants */}
        {activeSection === 'variants' && (
          <div className="demo-section">
            <div className="demo-header">
              <h3>SourceCitation Display Variants</h3>
              <p>Multiple ways to display source citations</p>

              <div className="variant-controls">
                <label>
                  <input
                    type="radio"
                    checked={sourceVariant === 'inline'}
                    onChange={() => setSourceVariant('inline')}
                  />
                  Inline
                </label>
                <label>
                  <input
                    type="radio"
                    checked={sourceVariant === 'card'}
                    onChange={() => setSourceVariant('card')}
                  />
                  Card
                </label>
                <label>
                  <input
                    type="radio"
                    checked={sourceVariant === 'list'}
                    onChange={() => setSourceVariant('list')}
                  />
                  List
                </label>
              </div>
            </div>

            <div className="variant-demo">
              <div className="variant-preview">
                <h4>Research Sources</h4>
                <SourceCitation
                  sources={researchSources}
                  variant={sourceVariant}
                  size="md"
                  showConfidence
                  showDomain
                  showFavicons
                  expandOnHover
                  title={sourceVariant === 'inline' ? 'Sources' : undefined}
                  onSourceClick={(source, index) => {
                    console.log('Clicked source:', source.title, 'at index:', index)
                  }}
                />
              </div>

              {/* Grouped Display */}
              <div className="variant-preview">
                <h4>Grouped by Domain</h4>
                <SourceCitation
                  sources={researchSources}
                  variant="card"
                  size="md"
                  groupByDomain
                  showConfidence
                />
              </div>
            </div>
          </div>
        )}

        {/* Interactive States */}
        {activeSection === 'interactive' && (
          <div className="demo-section">
            <div className="demo-header">
              <h3>Interactive Hover & Click States</h3>
              <p>Experience glassmorphism effects and smooth transitions</p>
            </div>

            <div className="interactive-grid">
              {/* Hover Effects */}
              <div className="interactive-demo">
                <h4>Hover Effects</h4>
                <p className="demo-note">Hover over cards to see glassmorphism styling</p>
                <div className="citation-stack">
                  {technicalDocsCitations.map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                      className="hover-demo-card"
                    />
                  ))}
                </div>
              </div>

              {/* Click to Expand */}
              <div className="interactive-demo">
                <h4>Click to Expand</h4>
                <p className="demo-note">Click cards to toggle expanded view</p>
                <div className="citation-stack">
                  {academicCitations.slice(0, 2).map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                      defaultExpanded={expandedCitations.has(index)}
                      onClick={() => {
                        toggleExpanded(index)
                        setSelectedCitation(citation)
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Source Preview on Hover */}
              <div className="interactive-demo">
                <h4>Inline with Hover Previews</h4>
                <p className="demo-note">Hover over inline citations for previews</p>
                <div className="inline-demo-container">
                  <p className="demo-text">
                    According to recent research
                    <span className="inline-citation-wrapper">
                      <SourceCitation
                        sources={researchSources.slice(0, 2)}
                        variant="inline"
                        size="sm"
                        showFavicons
                        expandOnHover
                      />
                    </span>
                    the transformer architecture has become the foundation for modern NLP.
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Citation Details */}
            {selectedCitation && (
              <div className="selected-citation-panel">
                <h4>Selected Citation Details</h4>
                <div className="citation-details">
                  <div className="detail-row">
                    <span className="detail-label">Source:</span>
                    <span className="detail-value">{selectedCitation.source}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Confidence:</span>
                    <span className="detail-value">
                      {((selectedCitation.confidence || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  {selectedCitation.url && (
                    <div className="detail-row">
                      <span className="detail-label">URL:</span>
                      <a
                        href={selectedCitation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-link"
                      >
                        {selectedCitation.url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real-World Examples */}
        {activeSection === 'realworld' && (
          <div className="demo-section">
            <div className="demo-header">
              <h3>Real-World Citation Examples</h3>
              <p>Citations from various domains and use cases</p>
            </div>

            <div className="realworld-examples">
              {/* Academic Research */}
              <div className="example-category">
                <h4>🎓 Academic Research</h4>
                <div className="example-grid">
                  {academicCitations.map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                      onSourceClick={(url) => window.open(url, '_blank')}
                    />
                  ))}
                </div>
              </div>

              {/* Technical Documentation */}
              <div className="example-category">
                <h4>📚 Technical Documentation</h4>
                <div className="example-grid">
                  {technicalDocsCitations.map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                    />
                  ))}
                </div>
              </div>

              {/* Legal Documents */}
              <div className="example-category">
                <h4>⚖️ Legal Documents</h4>
                <div className="example-grid">
                  {legalCitations.map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                      defaultExpanded
                    />
                  ))}
                </div>
              </div>

              {/* News Articles */}
              <div className="example-category">
                <h4>📰 News & Media</h4>
                <div className="example-grid">
                  {newsCitations.map((citation, index) => (
                    <CitationCard
                      key={index}
                      citation={citation}
                      showConfidence
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="code-examples-section">
        <h3>Usage Examples</h3>
        <div className="code-tabs">
          <div className="code-example">
            <h4>Basic CitationCard</h4>
            <pre>
              <code>{`<CitationCard
  citation={{
    source: 'Nature Climate Change',
    chunkText: 'Research findings...',
    confidence: 0.95,
    url: 'https://nature.com/article',
    metadata: {
      author: 'Dr. Smith',
      date: '2024-01-15'
    }
  }}
  showConfidence
  onSourceClick={(url) => window.open(url)}
/>`}</code>
            </pre>
          </div>

          <div className="code-example">
            <h4>SourceCitation with Variants</h4>
            <pre>
              <code>{`<SourceCitation
  sources={[
    {
      url: 'https://example.com',
      title: 'Example Source',
      snippet: 'Content preview...',
      confidence: 0.9
    }
  ]}
  variant="card"
  showConfidence
  showDomain
  expandOnHover
/>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
