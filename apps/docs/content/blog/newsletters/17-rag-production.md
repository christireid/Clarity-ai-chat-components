# Why Your RAG Demo Fails in Production

_Newsletter version of: RAG in Production_

---

Your RAG demo works beautifully. Your production RAG returns garbage.

I've seen this story a dozen times. Developer follows a tutorial, builds a prototype that impresses
stakeholders, ships to production... and users get irrelevant results or hallucinated answers.

## Demo vs Production

**Demo conditions:**

- Clean, curated documents
- Known good queries
- No edge cases

**Production reality:**

- Messy, inconsistent documents
- Misspelled queries ("can i get my money back lol")
- Users actively trying to break it

## The #1 Mistake: Fixed-Size Chunking

Splitting documents into 500-token chunks creates fragments that:

- Split mid-sentence
- Separate questions from answers
- Break code blocks
- Lose all context

## What Actually Works

**1. Semantic Chunking**

Split on natural boundaries—headers, paragraphs, sentence endings. Respect document structure.

```typescript
const config = {
  minSize: 100,
  maxSize: 800,
  splitOn: ['## ', '\n\n', '. '],
}
```

**2. Hybrid Search**

Pure vector search misses keyword matches. "What's the cancellation policy?" might not match
"Refunds available within 30 days" semantically.

Combine vector similarity (70% weight) with keyword matching (30% weight).

**3. Know When to Say "I Don't Know"**

Filter by confidence scores. If retrieval scores are low, admit uncertainty:

```typescript
if (avgScore < 0.5) {
  return "I found some potentially relevant info, but I'm not confident..."
}
```

Better to say "I'm not sure" than hallucinate confidently.

## Key Takeaway

The gap between RAG demo and production is enormous. Don't ship a demo. The failure modes will
embarrass you.

---

**Read the full post** for hierarchical chunking, reranking implementation, debug UI patterns, and
scaling considerations.

[Read full post →]

---

_Building production RAG? Check out our vector store components with built-in debugging._
