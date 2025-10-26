/**
 * CitationCard Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CitationCard } from './citation-card'

const meta: Meta<typeof CitationCard> = {
  title: 'Components/CitationCard',
  component: CitationCard,
  parameters: {
    docs: {
      description: {
        component: `
Displays RAG sources and citations with expandable content preview.

## Features
- Source name with icon
- Confidence score badge
- Expandable text preview
- External link button
- Metadata badges (date, page, section)
- Click to expand/collapse
- Dark mode compatible

## Usage

\`\`\`tsx
import { CitationCard } from '@clarity-chat/react'

<CitationCard
  citation={{
    id: 'cite_1',
    source: 'Nature: AI Research 2024',
    chunkText: 'Full citation text here...',
    confidence: 0.92,
    url: 'https://nature.com/article'
  }}
  showConfidence
  onSourceClick={(url) => window.open(url)}
/>
\`\`\`
        `
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CitationCard>

export const HighConfidence: Story = {
  args: {
    citation: {
      id: 'cite_1',
      source: 'Nature: AI Research Advances',
      chunkText:
        'Recent developments in artificial intelligence have demonstrated remarkable progress across various domains. Large language models exhibit emergent capabilities that were not explicitly programmed, suggesting a fundamental shift in how we approach AI systems.',
      confidence: 0.95,
      url: 'https://nature.com/articles/ai-2024',
      metadata: {
        author: 'Dr. Sarah Chen et al.',
        date: '2024-03-15',
        page: '42'
      }
    },
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation with high confidence score (95%)'
      }
    }
  }
}

export const MediumConfidence: Story = {
  args: {
    citation: {
      id: 'cite_2',
      source: 'MIT Technology Review',
      chunkText:
        'Machine learning systems trained on massive datasets can generalize to novel scenarios. However, the exact mechanisms behind this generalization remain poorly understood by researchers.',
      confidence: 0.78,
      url: 'https://technologyreview.com/ml-insights'
    },
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation with medium confidence (78%)'
      }
    }
  }
}

export const LowConfidence: Story = {
  args: {
    citation: {
      id: 'cite_3',
      source: 'Blog Post: AI Trends',
      chunkText: 'Some experts believe that artificial general intelligence may be achieved within the next decade, though this remains highly speculative.',
      confidence: 0.52,
      url: 'https://example.com/blog/ai-trends'
    },
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation with low confidence (52%)'
      }
    }
  }
}

export const LongText: Story = {
  args: {
    citation: {
      id: 'cite_4',
      source: 'Stanford AI Report 2024',
      chunkText:
        'The Stanford Artificial Intelligence Index Report tracks AI development across multiple dimensions including research publications, industry investment, and ethical considerations. This year\'s report highlights several key trends: First, the continued exponential growth in model parameters and training compute. Second, the democratization of AI tools through open-source initiatives. Third, the increasing focus on AI safety and alignment research. Fourth, the expansion of AI applications in healthcare, education, and scientific research. Fifth, the growing importance of data quality over quantity in model training. The report also notes significant challenges including the environmental impact of large-scale model training, concerns about AI-generated misinformation, and the need for robust governance frameworks. Overall, the field continues to advance rapidly while grappling with important societal implications.',
      confidence: 0.89,
      url: 'https://stanford.edu/ai-index-2024',
      metadata: {
        date: '2024-04-01',
        section: 'Executive Summary',
        page: '12'
      }
    },
    showConfidence: true,
    previewLength: 200
  },
  parameters: {
    docs: {
      description: {
        story: 'Long citation text with expand/collapse (click "Show more")'
      }
    }
  }
}

export const Expanded: Story = {
  args: {
    ...LongText.args,
    defaultExpanded: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Expanded by default'
      }
    }
  }
}

export const NoConfidence: Story = {
  args: {
    citation: {
      id: 'cite_5',
      source: 'Internal Documentation',
      chunkText: 'This is a citation from internal documentation without a confidence score.',
      url: 'https://example.com/docs'
    },
    showConfidence: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation without confidence badge'
      }
    }
  }
}

export const NoURL: Story = {
  args: {
    citation: {
      id: 'cite_6',
      source: 'Proprietary Research Database',
      chunkText: 'Some citations may not have external URLs, such as those from internal databases or proprietary sources.',
      confidence: 0.84
    },
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation without external link'
      }
    }
  }
}

export const WithAllMetadata: Story = {
  args: {
    citation: {
      id: 'cite_7',
      source: 'Research Paper: Neural Networks',
      chunkText:
        'Convolutional neural networks have revolutionized computer vision by automatically learning hierarchical feature representations from raw pixel data.',
      confidence: 0.93,
      url: 'https://arxiv.org/paper/12345',
      metadata: {
        author: 'LeCun, Y., Bengio, Y., Hinton, G.',
        date: '2015-05-28',
        page: '436',
        section: 'Deep Learning',
        journal: 'Nature',
        doi: '10.1038/nature14539'
      }
    },
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Citation with rich metadata'
      }
    }
  }
}

export const MultipleInList: Story = {
  render: () => {
    const citations = [
      {
        id: 'cite_a',
        source: 'Nature: AI Breakthroughs',
        chunkText: 'Large language models demonstrate emergent reasoning capabilities.',
        confidence: 0.95,
        url: 'https://nature.com/1'
      },
      {
        id: 'cite_b',
        source: 'Science: Neural Networks',
        chunkText: 'Deep learning architectures continue to advance rapidly.',
        confidence: 0.88,
        url: 'https://science.org/2'
      },
      {
        id: 'cite_c',
        source: 'arXiv: Transformer Models',
        chunkText: 'Attention mechanisms have become fundamental to modern NLP.',
        confidence: 0.91,
        url: 'https://arxiv.org/3'
      }
    ]
    
    return (
      <div className="space-y-3 max-w-2xl">
        {citations.map((citation) => (
          <CitationCard key={citation.id} citation={citation} showConfidence />
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple citations in a list'
      }
    }
  }
}

export const CustomPreviewLength: Story = {
  args: {
    citation: {
      id: 'cite_8',
      source: 'Book: Deep Learning',
      chunkText:
        'Deep learning is a form of machine learning that enables computers to learn from experience and understand the world in terms of a hierarchy of concepts.',
      confidence: 0.87,
      url: 'https://deeplearningbook.org'
    },
    previewLength: 50,
    showConfidence: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom preview length (50 characters)'
      }
    }
  }
}
