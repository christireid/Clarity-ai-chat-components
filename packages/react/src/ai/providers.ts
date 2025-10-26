/**
 * AI Providers
 * 
 * Built-in providers for suggestions, moderation, and sentiment analysis
 */

import type {
  SuggestionProvider,
  Suggestion,
  ModerationProvider,
  ModerationResult,
  SentimentAnalyzer,
  SentimentResult,
} from './types'

/**
 * Quick Reply Suggestion Provider
 * 
 * Provides common quick reply suggestions based on context
 */
export function createQuickReplyProvider(
  replies: Array<{
    text: string
    description?: string
    triggers?: string[]
    icon?: React.ReactNode
  }>
): SuggestionProvider {
  return (context) => {
    const input = context.input.toLowerCase().trim()
    
    // Filter relevant replies
    const suggestions: Suggestion[] = replies
      .filter(reply => {
        // If no triggers, always show
        if (!reply.triggers?.length) return true
        
        // Check if any trigger matches
        return reply.triggers.some(trigger =>
          input.includes(trigger.toLowerCase())
        )
      })
      .map((reply, index) => ({
        id: `quick-reply-${index}`,
        type: 'quick-reply' as const,
        text: reply.text,
        description: reply.description,
        icon: reply.icon,
        confidence: reply.triggers?.some(t => input.includes(t.toLowerCase())) ? 0.9 : 0.5,
      }))
    
    return suggestions
  }
}

/**
 * Command Suggestion Provider
 * 
 * Provides command suggestions (e.g., /help, /clear)
 */
export function createCommandProvider(
  commands: Array<{
    command: string
    description: string
    icon?: React.ReactNode
  }>
): SuggestionProvider {
  return (context) => {
    const input = context.input.trim()
    
    // Only show commands if input starts with /
    if (!input.startsWith('/')) return []
    
    const search = input.slice(1).toLowerCase()
    
    return commands
      .filter(cmd => cmd.command.toLowerCase().includes(search))
      .map((cmd, index) => ({
        id: `command-${index}`,
        type: 'command' as const,
        text: `/${cmd.command}`,
        description: cmd.description,
        icon: cmd.icon,
        confidence: cmd.command.toLowerCase().startsWith(search) ? 0.9 : 0.6,
      }))
  }
}

/**
 * Completion Suggestion Provider
 * 
 * Provides text completion suggestions
 */
export function createCompletionProvider(
  completions: Record<string, string[]>
): SuggestionProvider {
  return (context) => {
    const input = context.input.toLowerCase().trim()
    const words = input.split(' ')
    const lastWord = words[words.length - 1]
    
    if (!lastWord || lastWord.length < 2) return []
    
    const suggestions: Suggestion[] = []
    
    // Find matching completions
    Object.entries(completions).forEach(([prefix, suffixes]) => {
      if (lastWord.startsWith(prefix.toLowerCase())) {
        suffixes.forEach((suffix, index) => {
          const completed = input.slice(0, -lastWord.length) + prefix + suffix
          suggestions.push({
            id: `completion-${prefix}-${index}`,
            type: 'completion' as const,
            text: completed,
            description: `Complete with "${prefix}${suffix}"`,
            confidence: 0.7,
          })
        })
      }
    })
    
    return suggestions
  }
}

/**
 * Context-Aware Suggestion Provider
 * 
 * Provides suggestions based on conversation history
 */
export function createContextAwareProvider(): SuggestionProvider {
  return (context) => {
    if (!context.messages?.length) return []
    
    const lastAssistantMessage = context.messages
      .filter(m => m.role === 'assistant')
      .slice(-1)[0]
    
    if (!lastAssistantMessage) return []
    
    const content = lastAssistantMessage.content.toLowerCase()
    const suggestions: Suggestion[] = []
    
    // Question detection
    if (content.includes('?')) {
      suggestions.push({
        id: 'followup-yes',
        type: 'quick-reply',
        text: 'Yes',
        confidence: 0.8,
      })
      suggestions.push({
        id: 'followup-no',
        type: 'quick-reply',
        text: 'No',
        confidence: 0.8,
      })
      suggestions.push({
        id: 'followup-maybe',
        type: 'quick-reply',
        text: 'Maybe',
        confidence: 0.7,
      })
    }
    
    // Offer detection
    if (content.includes('would you like') || content.includes('do you want')) {
      suggestions.push({
        id: 'offer-yes',
        type: 'quick-reply',
        text: 'Yes, please',
        confidence: 0.9,
      })
      suggestions.push({
        id: 'offer-no',
        type: 'quick-reply',
        text: 'No, thanks',
        confidence: 0.9,
      })
    }
    
    // Confirmation detection
    if (content.includes('correct') || content.includes('right')) {
      suggestions.push({
        id: 'confirm-yes',
        type: 'quick-reply',
        text: 'Yes, that\'s correct',
        confidence: 0.85,
      })
      suggestions.push({
        id: 'confirm-no',
        type: 'quick-reply',
        text: 'No, that\'s not right',
        confidence: 0.85,
      })
    }
    
    return suggestions
  }
}

/**
 * Basic Profanity Filter
 * 
 * Simple client-side profanity detection
 */
export function createProfanityFilter(
  bannedWords: string[] = []
): ModerationProvider {
  const defaultBannedWords = [
    // Add common profanity here
    // This is a placeholder - in production, use a comprehensive list
  ]
  
  const allBannedWords = [...defaultBannedWords, ...bannedWords]
  const pattern = new RegExp(`\\b(${allBannedWords.join('|')})\\b`, 'gi')
  
  return (content) => {
    const matches = content.match(pattern)
    const flagged = !!matches
    
    return {
      flagged,
      reasons: flagged ? ['profanity'] : [],
      scores: {
        profanity: matches ? matches.length / content.split(' ').length : 0,
      },
      action: flagged ? 'warn' : 'allow',
      details: {
        matches: matches || [],
      },
    }
  }
}

/**
 * PII (Personally Identifiable Information) Detector
 * 
 * Detects potential PII in content
 */
export function createPIIDetector(): ModerationProvider {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  const ssnPattern = /\d{3}-\d{2}-\d{4}/g
  const creditCardPattern = /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g
  
  return (content) => {
    const reasons: string[] = []
    const details: Record<string, any> = {}
    
    const emailMatches = content.match(emailPattern)
    if (emailMatches) {
      reasons.push('email_address')
      details.emails = emailMatches.length
    }
    
    const phoneMatches = content.match(phonePattern)
    if (phoneMatches) {
      reasons.push('phone_number')
      details.phones = phoneMatches.length
    }
    
    const ssnMatches = content.match(ssnPattern)
    if (ssnMatches) {
      reasons.push('ssn')
      details.ssns = ssnMatches.length
    }
    
    const ccMatches = content.match(creditCardPattern)
    if (ccMatches) {
      reasons.push('credit_card')
      details.credit_cards = ccMatches.length
    }
    
    const flagged = reasons.length > 0
    
    return {
      flagged,
      reasons,
      scores: {
        pii: flagged ? 1 : 0,
      },
      action: flagged ? 'warn' : 'allow',
      details,
    }
  }
}

/**
 * Simple Sentiment Analyzer
 * 
 * Basic rule-based sentiment analysis
 */
export function createSimpleSentimentAnalyzer(): SentimentAnalyzer {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied', 'perfect',
    'awesome', 'brilliant', 'outstanding', 'superb', 'terrific',
  ]
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing',
    'hate', 'dislike', 'angry', 'frustrated', 'annoyed', 'upset',
    'worst', 'useless', 'broken', 'failed', 'error', 'problem',
  ]
  
  return (text) => {
    const words = text.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })
    
    const total = positiveCount + negativeCount
    const positive = total > 0 ? positiveCount / total : 0
    const negative = total > 0 ? negativeCount / total : 0
    const neutral = 1 - positive - negative
    
    let sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
    let confidence: number
    
    if (total === 0) {
      sentiment = 'neutral'
      confidence = 0.5
    } else if (positiveCount > negativeCount * 2) {
      sentiment = 'positive'
      confidence = positive
    } else if (negativeCount > positiveCount * 2) {
      sentiment = 'negative'
      confidence = negative
    } else if (positiveCount > 0 && negativeCount > 0) {
      sentiment = 'mixed'
      confidence = 0.5
    } else {
      sentiment = 'neutral'
      confidence = neutral
    }
    
    return {
      sentiment,
      confidence,
      scores: {
        positive,
        negative,
        neutral,
      },
    }
  }
}

/**
 * Combine Multiple Moderation Providers
 * 
 * Run multiple moderation checks and combine results
 */
export function combineModerationProviders(
  providers: ModerationProvider[]
): ModerationProvider {
  return async (content, context) => {
    const results = await Promise.all(
      providers.map(provider => provider(content, context))
    )
    
    const flagged = results.some(r => r.flagged)
    const reasons = [...new Set(results.flatMap(r => r.reasons))]
    
    // Combine scores
    const scores: Record<string, number> = {}
    results.forEach(result => {
      if (result.scores) {
        Object.entries(result.scores).forEach(([key, value]) => {
          scores[key] = Math.max(scores[key] || 0, value || 0)
        })
      }
    })
    
    // Determine action (most restrictive wins)
    let action: 'allow' | 'warn' | 'block' = 'allow'
    if (results.some(r => r.action === 'block')) {
      action = 'block'
    } else if (results.some(r => r.action === 'warn')) {
      action = 'warn'
    }
    
    return {
      flagged,
      reasons,
      scores,
      action,
      details: {
        individual_results: results,
      },
    }
  }
}
