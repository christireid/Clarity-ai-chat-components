/**
 * Integration Example - Enhanced Prompting System
 *
 * This file demonstrates how to integrate the enhanced prompting system
 * into the existing docs-assistant API endpoint.
 *
 * USAGE:
 * 1. Review this example
 * 2. Adapt patterns to your specific API structure
 * 3. Test thoroughly before deploying
 * 4. Monitor quality metrics
 *
 * @see README.md for detailed documentation
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  classifyQueryEnhanced,
  generateEnhancedSystemPrompt,
  getRecommendedPromptStrategy,
  validateResponse,
  calculateQualityScores,
  qualityMetricsTracker,
  formatValidationReport,
  type PerformanceMetrics,
} from './index'

/**
 * Example: Enhanced Docs Assistant API Route
 *
 * This shows the complete flow from query to validated response with metrics.
 */
export async function enhancedDocsAssistantPOST(request: NextRequest) {
  const startTime = Date.now()
  const queryId = crypto.randomUUID()

  try {
    // Parse request
    const { message, sessionId, userId } = await request.json()

    // STEP 1: Enhanced Query Classification
    console.log('🔍 [Step 1] Classifying query...')
    const classification = classifyQueryEnhanced(message)

    console.log('Classification:', {
      complexity: classification.complexity,
      confidence: (classification.confidence * 100).toFixed(1) + '%',
      reasoning: classification.reasoning,
    })

    // STEP 2: Get Recommended Strategy
    console.log('🎯 [Step 2] Determining strategy...')
    const strategy = getRecommendedPromptStrategy(classification)

    console.log('Strategy:', {
      useCoT: strategy.useCoT,
      useCitations: strategy.useCitations,
      useStrictMode: strategy.useStrictMode,
      explanation: strategy.explanation,
    })

    // STEP 3: Retrieve Sources (if citations needed)
    let sources: any[] = []
    let contextText: string | undefined

    if (strategy.useCitations || classification.requirements.needsCitations) {
      console.log('📚 [Step 3] Retrieving sources...')

      // Use your existing RAG system
      const { ragContext } = await enhanceMessageWithRAG(message, {
        topK: 5,
        minScore: 0.7,
      })

      sources = ragContext.sources
      contextText = sources.map((s) => `[${s.title}]\n${s.content}`).join('\n\n---\n\n')

      console.log(`Retrieved ${sources.length} sources`)
    } else {
      console.log('📚 [Step 3] Skipping source retrieval (not needed)')
    }

    // STEP 4: Generate Enhanced Prompt
    console.log('✍️ [Step 4] Generating enhanced prompt...')
    const prompt = generateEnhancedSystemPrompt(
      message,
      classification.complexity,
      classification.requirements.needsCodeExample,
      sources.length > 0,
      contextText
    )

    console.log('Prompt configuration:', {
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      validationChecks: Object.keys(prompt.validationCriteria).length,
    })

    // STEP 5: Generate Response
    console.log('🤖 [Step 5] Generating response...')

    // Use your existing LLM generation function
    const response = await generateLLMResponse({
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      stopSequences: prompt.stopSequences,
    })

    const generationTime = Date.now() - startTime
    console.log(`Response generated in ${generationTime}ms`)

    // STEP 6: Validate Response
    console.log('✅ [Step 6] Validating response...')
    const validation = validateResponse(
      response,
      prompt.validationCriteria,
      message
    )

    console.log('Validation:', {
      valid: validation.valid,
      score: (validation.score * 100).toFixed(1) + '%',
      passedChecks: validation.passed.length,
      failedChecks: validation.failed.length,
      issues: validation.issues.length,
    })

    // Log detailed validation report in development
    if (process.env.NODE_ENV === 'development' && !validation.valid) {
      console.log('\n' + formatValidationReport(validation))
    }

    // STEP 7: Calculate Quality Metrics
    console.log('📊 [Step 7] Calculating quality metrics...')

    const performance: PerformanceMetrics = {
      responseTimeMs: Date.now() - startTime,
      promptTokens: estimateTokens(prompt.systemPrompt + prompt.userPrompt),
      completionTokens: estimateTokens(response),
      totalTokens:
        estimateTokens(prompt.systemPrompt + prompt.userPrompt) +
        estimateTokens(response),
      model: 'gpt-4-turbo',
      temperature: prompt.temperature,
      cacheHit: false,
    }

    const scores = calculateQualityScores(validation, performance)

    console.log('Quality Scores:', {
      overall: scores.overall,
      accuracy: scores.accuracy,
      completeness: scores.completeness,
      clarity: scores.clarity,
      codeQuality: scores.codeQuality,
      efficiency: scores.efficiency,
    })

    // STEP 8: Track Metrics
    console.log('💾 [Step 8] Tracking metrics...')
    qualityMetricsTracker.log({
      queryId,
      timestamp: Date.now(),
      query: message,
      response,
      classification,
      validation,
      performance,
      scores,
    })

    // STEP 9: Handle Low Quality Responses
    if (!validation.valid && scores.overall < 60) {
      console.warn('⚠️ Low quality response detected (score: ' + scores.overall + '/100)')
      console.warn('Issues:', validation.issues.map((i) => i.message))

      // Option 1: Regenerate with adjusted parameters
      if (scores.overall < 50) {
        console.log('🔄 Regenerating with stricter criteria...')
        return await regenerateWithImprovements(
          message,
          validation.suggestions,
          classification
        )
      }

      // Option 2: Log warning but allow (score 50-60)
      console.warn('Allowing response but flagging for review')
    }

    // STEP 10: Return Response with Metadata
    return NextResponse.json({
      response,
      metadata: {
        queryId,
        complexity: classification.complexity,
        confidence: classification.confidence,
        strategy: {
          useCoT: strategy.useCoT,
          useCitations: strategy.useCitations,
        },
        quality: {
          score: scores.overall,
          validationPassed: validation.valid,
        },
        performance: {
          responseTime: performance.responseTimeMs,
          tokens: performance.totalTokens,
        },
        sources: sources.map((s) => ({
          title: s.title,
          url: s.url,
        })),
      },
    })
  } catch (error) {
    console.error('Error in enhanced docs assistant:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        queryId,
      },
      { status: 500 }
    )
  }
}

/**
 * Helper: Regenerate response with improvements
 */
async function regenerateWithImprovements(
  query: string,
  suggestions: string[],
  classification: any
): Promise<NextResponse> {
  console.log('🔄 Regenerating with suggestions:', suggestions)

  // Adjust prompt based on validation suggestions
  const improvedPrompt = generateEnhancedSystemPrompt(
    query,
    classification.complexity,
    true, // Force code examples
    true, // Force citations
    `IMPORTANT: Address these issues from previous attempt:\n${suggestions.join('\n')}`
  )

  // Increase temperature slightly for more creative solutions
  improvedPrompt.temperature = Math.min(improvedPrompt.temperature + 0.1, 1.0)

  // Generate again
  const response = await generateLLMResponse({
    systemPrompt: improvedPrompt.systemPrompt,
    userPrompt: improvedPrompt.userPrompt,
    temperature: improvedPrompt.temperature,
    maxTokens: improvedPrompt.maxTokens,
  })

  // Validate again
  const validation = validateResponse(
    response,
    improvedPrompt.validationCriteria,
    query
  )

  console.log('Regeneration result:', {
    valid: validation.valid,
    score: (validation.score * 100).toFixed(1) + '%',
  })

  return NextResponse.json({
    response,
    metadata: {
      regenerated: true,
      improvedScore: validation.score,
    },
  })
}

/**
 * Helper: Mock RAG enhancement (replace with your actual implementation)
 */
async function enhanceMessageWithRAG(message: string, options: any) {
  // This is a placeholder - use your actual RAG implementation
  return {
    ragContext: {
      sources: [
        {
          title: 'Example Source',
          url: '/example',
          content: 'Example content',
          score: 0.85,
        },
      ],
    },
  }
}

/**
 * Helper: Mock LLM generation (replace with your actual implementation)
 */
async function generateLLMResponse(options: {
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
  stopSequences?: string[]
}): Promise<string> {
  // This is a placeholder - use your actual LLM client
  // Example with OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4-turbo',
  //   messages: [
  //     { role: 'system', content: options.systemPrompt },
  //     { role: 'user', content: options.userPrompt },
  //   ],
  //   temperature: options.temperature,
  //   max_tokens: options.maxTokens,
  //   stop: options.stopSequences,
  // })
  // return response.choices[0].message.content

  return 'Mock response'
}

/**
 * Helper: Estimate token count (simple heuristic)
 */
function estimateTokens(text: string): number {
  // Simple estimation: ~4 characters per token
  // For production, use tiktoken or actual model tokenizer
  return Math.ceil(text.length / 4)
}

/**
 * Example: Metrics Dashboard Endpoint
 *
 * GET /api/quality-metrics
 */
export async function GET() {
  // Get last 7 days of metrics
  const metrics = qualityMetricsTracker.getAggregateMetrics(7)

  return NextResponse.json({
    status: 'ok',
    metrics: {
      period: metrics.period,
      totalQueries: metrics.totalQueries,
      averageQuality: metrics.averageScores.overall,
      validationPassRate: (metrics.validationPassRate * 100).toFixed(1) + '%',
      cacheHitRate: (metrics.cacheHitRate * 100).toFixed(1) + '%',
      averageResponseTime: Math.round(metrics.averageResponseTime) + 'ms',
      scoresByComplexity: {
        simple: metrics.scoresByComplexity.simple.overall,
        moderate: metrics.scoresByComplexity.moderate.overall,
        complex: metrics.scoresByComplexity.complex.overall,
      },
      userFeedback:
        metrics.feedbackCount > 0
          ? {
              count: metrics.feedbackCount,
              averageRating: metrics.averageRating?.toFixed(1),
              helpfulRate: ((metrics.helpfulRate || 0) * 100).toFixed(1) + '%',
            }
          : null,
      topIssues: metrics.commonValidationIssues.slice(0, 5),
    },
  })
}

/**
 * Example: User Feedback Endpoint
 *
 * POST /api/feedback
 */
export async function submitFeedback(request: NextRequest) {
  const { queryId, rating, helpful, comment, issues } = await request.json()

  // Find the metric by queryId and update it
  // (In production, you'd store this in a database)

  console.log('User feedback received:', {
    queryId,
    rating,
    helpful,
  })

  // Update metrics with feedback
  // qualityMetricsTracker.updateFeedback(queryId, { rating, helpful, ... })

  return NextResponse.json({ success: true })
}

/**
 * Example: Export Metrics
 *
 * GET /api/export-metrics?days=30
 */
export async function exportMetrics(request: NextRequest) {
  const url = new URL(request.url)
  const days = parseInt(url.searchParams.get('days') || '7', 10)

  const exportData = qualityMetricsTracker.exportMetrics(days)

  return new NextResponse(exportData, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="quality-metrics-${days}d.json"`,
    },
  })
}

/**
 * Example: Weekly Quality Report (Cron Job)
 *
 * Run this weekly to generate quality reports
 */
export async function generateWeeklyReport() {
  const metrics = qualityMetricsTracker.getAggregateMetrics(7)

  const report = `
# Weekly Quality Report

**Period**: ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}

## Overview
- Total Queries: ${metrics.totalQueries}
- Average Quality: ${metrics.averageScores.overall}/100
- Validation Pass Rate: ${(metrics.validationPassRate * 100).toFixed(1)}%

## Quality by Complexity
- Simple: ${metrics.scoresByComplexity.simple.overall}/100 (${Math.round(metrics.scoresByComplexity.simple.overall / metrics.totalQueries * 100)}% of queries)
- Moderate: ${metrics.scoresByComplexity.moderate.overall}/100
- Complex: ${metrics.scoresByComplexity.complex.overall}/100

## Performance
- Average Response Time: ${Math.round(metrics.averageResponseTime)}ms
- Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%

## User Satisfaction
${metrics.feedbackCount > 0 ? `
- Feedback Count: ${metrics.feedbackCount}
- Average Rating: ${metrics.averageRating?.toFixed(1)}/5
- Helpful Rate: ${((metrics.helpfulRate || 0) * 100).toFixed(1)}%
` : 'No feedback received this week'}

## Top Issues
${metrics.commonValidationIssues.slice(0, 5).map((issue, i) => `${i + 1}. ${issue.category}: ${issue.count} occurrences`).join('\n')}

## Recommendations
${getRecommendations(metrics).join('\n')}
`

  // Send to Slack, email, or save to file
  console.log(report)

  return report
}

/**
 * Helper: Generate recommendations based on metrics
 */
function getRecommendations(metrics: any): string[] {
  const recommendations: string[] = []

  if (metrics.averageScores.overall < 80) {
    recommendations.push(
      '- ⚠️ Average quality below target (80). Review low-performing queries.'
    )
  }

  if (metrics.validationPassRate < 0.85) {
    recommendations.push(
      '- ⚠️ Validation pass rate below target (85%). Check common validation issues.'
    )
  }

  if (metrics.scoresByComplexity.complex.overall < 75) {
    recommendations.push(
      '- ⚠️ Complex query quality needs improvement. Consider more examples or better prompts.'
    )
  }

  if (metrics.cacheHitRate < 0.3) {
    recommendations.push(
      '- 💡 Low cache hit rate. Consider implementing better caching strategies.'
    )
  }

  if (metrics.averageResponseTime > 3000) {
    recommendations.push(
      '- 💡 Average response time above 3s. Consider optimizing model selection or prompt size.'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push('- ✅ All metrics look good! Keep up the great work.')
  }

  return recommendations
}
