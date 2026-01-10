# Competitive Feature Backlog

## Purpose
Track "wow" features mined from competitors and implement improved versions for Clarity.

## Feature Table

| Feature Concept | Source Inspiration | Why It Matters | Proposed Clarity Version | Status | Demo Link |
|-----------------|-------------------|----------------|-------------------------|--------|-----------|
| Command Palette | TypingMind, CopilotKit | Quick actions without leaving context | Command menu + searchable docs + quick inserts | planned | - |
| Prompt Blocks | Prompt-Kit | Composable prompt primitives | Enhanced prompt composer with templates | planned | - |
| Model Selector | TypingMind, NextChat | Provider flexibility | Multi-provider selector with per-demo override | planned | - |
| Streaming UI | ai-sdk, Vercel AI | Real-time response feel | Token-by-token + cancel + partial rendering | planned | - |
| Conversation Threading | LibreChat | Context organization | Thread management with branching | planned | - |
| Inline Tool Results | CopilotKit | Transparent tool use | Expandable tool result cards | planned | - |

## Minimum Shipped Features for "Compelling"
1. Improved command menu
2. Prompt blocks / composer primitives
3. Model/provider selector UI
4. Streaming UI patterns
5. One "pro" interaction (slash commands OR inline tools OR context drawer)

## Feature Details

### 1. Command Palette
**Source:** TypingMind, CopilotKit
**User Value:** Navigate, search, and act without context switching
**Clarity Version:**
- Cmd+K activation
- Search docs
- Quick component inserts
- Action shortcuts
- Recent history

### 2. Prompt Blocks
**Source:** Prompt-Kit
**User Value:** Reusable, composable prompt primitives
**Clarity Version:**
- System prompt blocks
- Context injection blocks
- Template variables
- Block composition UI

### 3. Model Selector
**Source:** TypingMind, NextChat
**User Value:** Use preferred provider without code changes
**Clarity Version:**
- Visual provider picker
- Model dropdown per provider
- Saved preferences
- Demo-specific overrides

### 4. Streaming UI
**Source:** ai-sdk, Vercel AI SDK
**User Value:** Responsive, real-time AI interaction
**Clarity Version:**
- Token-by-token rendering
- Partial markdown rendering
- Cancel button
- Typing indicator
- Smooth scroll-to-bottom

### 5. Threading
**Source:** LibreChat
**User Value:** Organize complex conversations
**Clarity Version:**
- Conversation branches
- Context window indicator
- Thread switching
- Export threads

### 6. Inline Tool Results
**Source:** CopilotKit
**User Value:** Understand what AI is doing
**Clarity Version:**
- Collapsible tool cards
- Input/output display
- Error states
- Retry actions

## Priority Order
1. Streaming UI (essential for demos)
2. Model Selector (essential for multi-provider)
3. Command Palette (DX differentiator)
4. Prompt Blocks (unique value prop)
5. Inline Tools (advanced feature)
6. Threading (nice to have)
