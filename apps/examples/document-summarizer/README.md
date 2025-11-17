# 📄 Document Summarizer Demo

AI-powered document summarization with multi-document support, key points extraction, and custom
summary lengths.

## ✨ Features

- 📑 **Multi-Document Support** - Summarize multiple documents at once
- 🎯 **Key Points Extraction** - Identify main ideas and takeaways
- 📏 **Custom Length** - Short, medium, or detailed summaries
- 🔍 **Entity Recognition** - Extract people, places, organizations
- 📊 **Sentiment Analysis** - Determine document tone
- 🏷️ **Topic Detection** - Auto-tag documents by topic
- 💬 **Interactive Q&A** - Ask questions about summarized content
- 📥 **Format Support** - PDF, TXT, DOCX, Markdown

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev
```

## 💡 Use Cases

### 1. Research Papers

Summarize academic papers and extract key findings

### 2. Legal Documents

Extract important clauses and obligations from contracts

### 3. Meeting Notes

Convert meeting transcripts into action items

### 4. News Articles

Get quick summaries of current events

### 5. Technical Documentation

Extract key concepts from technical docs

## 🎯 Features Demonstrated

- **Chunking Strategy** - Handle large documents
- **Progressive Summarization** - Multi-level summaries
- **Custom Prompts** - Different summary styles
- **Batch Processing** - Multiple documents
- **Export Options** - JSON, Markdown, PDF

## 📚 Technologies

- Next.js 15
- OpenAI GPT-4 Turbo (128k context)
- React-PDF for file handling
- Tailwind CSS

---

**Status**: 🎯 Production-Ready  
**Use Case**: Document Processing & Knowledge Management  
**Complexity**: Intermediate
