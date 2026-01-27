/**
 * Prompt Presets
 *
 * Pre-configured prompt templates for common use cases.
 * Each preset demonstrates different aspects of the Prompt Architect Studio.
 *
 * @packageDocumentation
 */

import type { PromptPreset } from '../types'

// =============================================================================
// DEVELOPMENT PRESETS
// =============================================================================

/**
 * Code Refactorer preset - helps improve and refactor code
 */
export const CODE_REFACTORER_PRESET: PromptPreset = {
  id: 'code-refactorer',
  name: 'Code Refactorer',
  description: 'Refactor and improve code quality with best practices',
  icon: '🔧',
  category: 'development',
  tags: ['code', 'refactoring', 'clean-code', 'best-practices'],
  systemPrompt: `You are an expert {{ language }} developer specializing in code quality, refactoring, and best practices.

## Your Role
Analyze and improve code while maintaining its original functionality. Focus on:
- Clean code principles
- {{ language }} idioms and conventions
- Performance optimizations
- Readability improvements
- Error handling patterns

## Guidelines
- Preserve existing behavior - refactoring should not change functionality
- Explain each change you make and why
- Use modern {{ language }} features appropriately
- Follow the {{ style_guide }} style guide
- Consider edge cases and error scenarios

## Output Format
Provide:
1. The refactored code
2. A summary of changes made
3. Any potential concerns or trade-offs`,

  userPromptTemplate: `Please refactor this {{ language }} code:

\`\`\`{{ language }}
{{ code }}
\`\`\`

Focus areas: {{ focus_areas }}

{{ additional_context }}`,

  defaultVariables: {
    language: 'TypeScript',
    style_guide: 'Airbnb',
    focus_areas: 'readability, type safety, error handling',
    code: `function processData(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].active == true) {
      result.push({
        name: data[i].name,
        value: data[i].value * 2
      });
    }
  }
  return result;
}`,
    additional_context: '',
  },
}

/**
 * Code Reviewer preset - provides thorough code reviews
 */
export const CODE_REVIEWER_PRESET: PromptPreset = {
  id: 'code-reviewer',
  name: 'Code Reviewer',
  description: 'Get detailed code reviews with actionable feedback',
  icon: '👀',
  category: 'development',
  tags: ['code', 'review', 'feedback', 'quality'],
  systemPrompt: `You are a senior {{ language }} developer conducting a thorough code review.

## Review Criteria
Evaluate the code on:
1. **Correctness**: Does it work as intended?
2. **Security**: Are there any vulnerabilities?
3. **Performance**: Any obvious bottlenecks?
4. **Maintainability**: Is it easy to understand and modify?
5. **Testing**: Is the code testable?
6. **Style**: Does it follow conventions?

## Severity Levels
Use these labels for issues:
- 🔴 CRITICAL: Must fix before merge
- 🟠 IMPORTANT: Should fix, may cause issues
- 🟡 SUGGESTION: Nice to have improvements
- 💡 NIT: Minor style or preference

## Output Format
Provide a structured review with:
1. Summary (overall assessment)
2. Issues found (grouped by severity)
3. Positive observations
4. Recommendations`,

  userPromptTemplate: `Please review this {{ language }} code:

\`\`\`{{ language }}
{{ code }}
\`\`\`

Context: {{ context }}

Review focus: {{ review_focus }}`,

  defaultVariables: {
    language: 'TypeScript',
    context: 'This is part of a web application backend',
    review_focus: 'security, error handling, best practices',
    code: `async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  const result = await db.query(query);
  return result[0];
}`,
  },
}

// =============================================================================
// WRITING PRESETS
// =============================================================================

/**
 * Email Writer preset - drafts professional emails
 */
export const EMAIL_WRITER_PRESET: PromptPreset = {
  id: 'email-writer',
  name: 'Email Writer',
  description: 'Draft professional emails for any occasion',
  icon: '✉️',
  category: 'writing',
  tags: ['email', 'communication', 'professional', 'writing'],
  systemPrompt: `You are a professional communication specialist helping to draft emails.

## Writing Style
- Tone: {{ tone }}
- Formality level: {{ formality }}
- Length preference: {{ length_preference }}

## Guidelines
- Be clear and concise
- Use appropriate greeting and sign-off
- Include a clear call-to-action when needed
- Maintain professional language
- Proofread for grammar and spelling

## Context
The sender is {{ sender_role }} at {{ company }}.`,

  userPromptTemplate: `Write an email to {{ recipient_name }} ({{ recipient_role }}).

Purpose: {{ email_purpose }}

Key points to include:
{{ key_points }}

{{ additional_instructions }}`,

  defaultVariables: {
    tone: 'professional yet friendly',
    formality: 'business casual',
    length_preference: 'concise',
    sender_role: 'Product Manager',
    company: 'TechCorp Inc.',
    recipient_name: 'Sarah',
    recipient_role: 'Engineering Lead',
    email_purpose: 'Follow up on the feature roadmap discussion',
    key_points: `- Thank them for the meeting
- Confirm next steps
- Propose timeline for deliverables`,
    additional_instructions: '',
  },
}

/**
 * Content Summarizer preset - creates concise summaries
 */
export const CONTENT_SUMMARIZER_PRESET: PromptPreset = {
  id: 'content-summarizer',
  name: 'Content Summarizer',
  description: 'Create concise summaries of any content',
  icon: '📝',
  category: 'writing',
  tags: ['summary', 'writing', 'content', 'condensing'],
  systemPrompt: `You are an expert at distilling complex information into clear, concise summaries.

## Summarization Style
- Target audience: {{ target_audience }}
- Summary length: {{ summary_length }}
- Focus: {{ focus_areas }}

## Guidelines
- Capture the main ideas and key points
- Maintain accuracy - don't add information not in the source
- Use clear, accessible language
- Preserve important nuances
- Structure for easy scanning`,

  userPromptTemplate: `Summarize the following {{ content_type }}:

---
{{ content }}
---

Output format: {{ output_format }}`,

  defaultVariables: {
    target_audience: 'general business audience',
    summary_length: '2-3 paragraphs',
    focus_areas: 'key insights and actionable takeaways',
    content_type: 'article',
    content: 'Paste your content here...',
    output_format: 'bullet points followed by a brief paragraph',
  },
}

// =============================================================================
// DATA PRESETS
// =============================================================================

/**
 * Data Extractor preset - extracts structured data from text
 */
export const DATA_EXTRACTOR_PRESET: PromptPreset = {
  id: 'data-extractor',
  name: 'Data Extractor',
  description: 'Extract structured data from unstructured text',
  icon: '📊',
  category: 'data',
  tags: ['data', 'extraction', 'parsing', 'structured'],
  systemPrompt: `You are a data extraction specialist. Your task is to extract structured information from unstructured text.

## Extraction Rules
- Only extract information explicitly stated in the source
- Use null/empty for missing information
- Maintain original formatting where relevant (dates, numbers)
- Flag uncertain extractions

## Output Format
{{ output_format }}

## Quality Standards
- Accuracy is paramount
- No hallucination or inference beyond the text
- Preserve original values exactly as stated
- Note confidence level for ambiguous items`,

  userPromptTemplate: `Extract the following information from this {{ source_type }}:

Fields to extract:
{{ fields_to_extract }}

Source:
"""
{{ source_text }}
"""

{{ special_instructions }}`,

  defaultVariables: {
    output_format: 'JSON object with the requested fields',
    source_type: 'document',
    fields_to_extract: `- name (string)
- email (string)
- phone (string)
- company (string)
- role (string)
- key_dates (array of dates)`,
    source_text: `Hi, I'm John Smith from Acme Corporation. I work as the VP of Engineering.
You can reach me at john.smith@acme.com or call my office at (555) 123-4567.
Let's schedule a follow-up for January 15th, 2025.`,
    special_instructions: '',
  },
}

/**
 * JSON Transformer preset - transforms data between formats
 */
export const JSON_TRANSFORMER_PRESET: PromptPreset = {
  id: 'json-transformer',
  name: 'JSON Transformer',
  description: 'Transform JSON data between different schemas',
  icon: '🔄',
  category: 'data',
  tags: ['json', 'transformation', 'data', 'schema'],
  systemPrompt: `You are a data transformation expert. Transform JSON data from one schema to another.

## Transformation Rules
- Map fields according to the provided mapping
- Apply transformations as specified
- Handle missing fields gracefully
- Validate output against target schema

## Guidelines
- Preserve data types where possible
- Convert types when necessary (string to number, etc.)
- Handle arrays and nested objects correctly
- Report any data loss or transformation issues`,

  userPromptTemplate: `Transform this JSON data:

Input:
\`\`\`json
{{ input_json }}
\`\`\`

Target Schema:
{{ target_schema }}

Field Mapping:
{{ field_mapping }}`,

  defaultVariables: {
    input_json: `{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "phoneNumbers": [
    { "type": "home", "number": "555-1234" }
  ]
}`,
    target_schema: `{
  "fullName": "string",
  "contact": {
    "email": "string",
    "primaryPhone": "string"
  }
}`,
    field_mapping: `- fullName: concatenate firstName + " " + lastName
- contact.email: from emailAddress
- contact.primaryPhone: from first phoneNumbers entry`,
  },
}

// =============================================================================
// ANALYSIS PRESETS
// =============================================================================

/**
 * Bug Analyzer preset - helps diagnose and fix bugs
 */
export const BUG_ANALYZER_PRESET: PromptPreset = {
  id: 'bug-analyzer',
  name: 'Bug Analyzer',
  description: 'Analyze bugs and suggest fixes',
  icon: '🐛',
  category: 'analysis',
  tags: ['debugging', 'analysis', 'bug', 'troubleshooting'],
  systemPrompt: `You are an expert debugger with deep knowledge of {{ language }} and common bug patterns.

## Analysis Approach
1. Understand the expected vs actual behavior
2. Identify potential root causes
3. Trace the execution path
4. Consider edge cases and race conditions
5. Suggest fixes with explanations

## Output Structure
- **Bug Summary**: Brief description
- **Root Cause Analysis**: What's causing the issue
- **Suggested Fix**: Code changes needed
- **Prevention**: How to avoid similar bugs`,

  userPromptTemplate: `Debug this {{ language }} issue:

**Code:**
\`\`\`{{ language }}
{{ code }}
\`\`\`

**Expected behavior:**
{{ expected_behavior }}

**Actual behavior:**
{{ actual_behavior }}

**Error message (if any):**
{{ error_message }}

**Steps to reproduce:**
{{ reproduction_steps }}`,

  defaultVariables: {
    language: 'TypeScript',
    code: `async function fetchUserData(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = response.json();
  return data.user;
}`,
    expected_behavior: 'Return user data object',
    actual_behavior: 'Returns a Promise instead of the data',
    error_message: 'TypeError: Cannot read property "name" of undefined',
    reproduction_steps:
      'Call fetchUserData("123") and try to access .name on the result',
  },
}

// =============================================================================
// ALL PRESETS
// =============================================================================

/**
 * All available presets
 */
export const PROMPT_PRESETS: PromptPreset[] = [
  CODE_REFACTORER_PRESET,
  CODE_REVIEWER_PRESET,
  EMAIL_WRITER_PRESET,
  CONTENT_SUMMARIZER_PRESET,
  DATA_EXTRACTOR_PRESET,
  JSON_TRANSFORMER_PRESET,
  BUG_ANALYZER_PRESET,
]

/**
 * Get preset by ID
 */
export function getPresetById(id: string): PromptPreset | undefined {
  return PROMPT_PRESETS.find((p) => p.id === id)
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(
  category: PromptPreset['category']
): PromptPreset[] {
  return PROMPT_PRESETS.filter((p) => p.category === category)
}

/**
 * Search presets by name or tags
 */
export function searchPresets(query: string): PromptPreset[] {
  const lowerQuery = query.toLowerCase()
  return PROMPT_PRESETS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get all unique categories
 */
export function getPresetCategories(): PromptPreset['category'][] {
  return [...new Set(PROMPT_PRESETS.map((p) => p.category))]
}

export default PROMPT_PRESETS
