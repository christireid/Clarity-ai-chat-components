# Search Priority Configuration

**Status**: ✅ Stable
**Version**: 1.0
**Last Updated**: January 28, 2026

## Overview

The search priority configuration system enhances documentation search by intelligently scoring and ranking results based on content type, URL patterns, categories, and query semantics. It is specifically optimized to surface **token optimization content** for cost-related queries.

## Key Features

- **Content Type Weighting**: Cookbooks > Guides > API Reference
- **URL Pattern Scoring**: Token optimization pages receive highest priority
- **Smart Synonym Expansion**: "cost" → "token optimization", "savings" → "cost reduction"
- **Category Boosting**: Prioritizes high-value content categories
- **Freshness Scoring**: Recent content ranked higher
- **Token-Aware Search**: Special handling for cost/optimization queries

## Files

### Core Files

- **`lib/search-config.ts`** - Main configuration and scoring algorithms
- **`lib/search-integration.ts`** - Integration layer for existing search
- **`lib/__tests__/search-config.test.ts`** - Comprehensive test suite (48 tests)

### Related Files

- **`lib/search-data.ts`** - Search index data
- **`lib/search-analytics.ts`** - Search analytics tracking
- **`lib/ai/searchService.ts`** - AI-powered search service

## Architecture

### Scoring Algorithm

```
finalScore = baseScore
           × contentTypeWeight
           × (1 + urlPriorityScore)
           × categoryBoost
           × freshnessScore
```

#### Example Calculation

For `/cookbook/token-optimization` with base score 0.8:

```
finalScore = 0.8           (base relevance)
           × 1.5           (cookbook weight)
           × (1 + 1.0)     (highest URL priority)
           × 1.3           (cookbook category boost)
           × 1.0           (fresh content)
           = 3.12
```

For `/reference/api/types` with same base score:

```
finalScore = 0.8           (base relevance)
           × 1.0           (guide weight)
           × (1 + 0.05)    (low URL priority)
           × 1.0           (reference category)
           × 1.0           (fresh content)
           = 0.84
```

**Result**: Token cookbook scores **3.7x higher** than API reference!

## Configuration Details

### Content Type Weights

Higher weights = more important content type.

```typescript
{
  cookbook: 1.5,      // Practical examples (highest)
  guide: 1.2,         // Conceptual guides
  component: 1.0,     // Component docs
  hook: 1.0,          // Hook docs
  example: 0.9,       // Example code
  concept: 0.8,       // Conceptual content
  deployment: 0.7,    // Deployment guides
  integration: 0.7    // Integration guides
}
```

### URL Priority Scores

URL patterns assigned priority scores (0.0 - 1.0).

#### Token Optimization (0.8 - 1.0)

```typescript
/cookbook/token-optimization     → 1.0   (highest)
/guides/token-optimization       → 0.95
/token-optimization              → 0.9
/components/token-*              → 0.85
/hooks/use-token*                → 0.85
/tools/token-*                   → 0.8
```

#### Cost & Efficiency (0.5 - 0.7)

```typescript
/cookbook/(rate-limiting|caching)  → 0.7
/guides/(performance|caching)      → 0.65
/tools/(roi-calculator)            → 0.6
/components/(performance)          → 0.55
```

#### Core Features (0.3 - 0.4)

```typescript
/cookbook/(streaming|memory)  → 0.4
/guides/(streaming|memory)    → 0.35
/components/(chat|message)    → 0.3
```

#### Reference (0.0 - 0.05)

```typescript
/reference/(api|types)  → 0.05  (lowest)
```

### Synonym Mapping

Query expansion for improved relevance.

```typescript
{
  // Cost synonyms
  cost: ['token optimization', 'pricing', 'expense', 'budget'],
  savings: ['token optimization', 'cost reduction', 'efficiency'],
  budget: ['token optimization', 'cost management', 'quota'],

  // Performance synonyms
  slow: ['performance', 'optimization', 'speed'],
  optimize: ['performance', 'token optimization', 'efficiency'],

  // Rate limiting synonyms
  'rate limit': ['rate limiting', 'quota', 'throttling'],
  throttle: ['rate limiting', 'quota', 'limit'],

  // Token synonyms
  tokens: ['token optimization', 'token counter', 'tokenization'],
  tokenize: ['token counter', 'tokenization', 'token optimization']
}
```

### Category Boosts

Applied after content type and URL priority.

```typescript
{
  cookbook: 1.3,              // Highest boost
  'token-optimization': 1.25,
  performance: 1.2,
  tools: 1.15,
  guides: 1.1,
  learn: 1.05,
  reference: 1.0              // Baseline
}
```

## Usage

### Basic Search with Priority

```typescript
import { enhancedSearch } from '@/lib/search-integration'
import { searchData } from '@/lib/search-data'

const results = enhancedSearch('reduce costs', searchData, {
  limit: 10,
  minScore: 0.1,
  includeScoreBreakdown: true
})

results.forEach(result => {
  console.log(`${result.title}: ${result.score.toFixed(2)}`)
  if (result.scoreBreakdown) {
    console.log('  Breakdown:', result.scoreBreakdown)
  }
})
```

### Token-Aware Search

```typescript
import { tokenOptimizationSearch } from '@/lib/search-integration'

// Automatically detects and boosts token content
const results = tokenOptimizationSearch('save money on API', searchData)

// Token optimization content will appear in top 3 results
```

### Direct Configuration Access

```typescript
import {
  getUrlPriorityScore,
  expandQueryWithSynonyms,
  calculateSearchScore
} from '@/lib/search-config'

// Get URL priority
const score = getUrlPriorityScore('/cookbook/token-optimization')
// → 1.0

// Expand query
const expanded = expandQueryWithSynonyms('cost')
// → ['cost', 'token optimization', 'pricing', 'expense', 'budget']

// Calculate full score
const result = calculateSearchScore(
  0.8,                              // base score
  '/cookbook/token-optimization',   // URL
  'cookbook',                       // type
  'token-optimization',             // category
  new Date().toISOString()          // lastUpdated
)
// → { baseScore: 0.8, priorityScore: 1.0, ... finalScore: 3.12 }
```

## Validation & Testing

### Test Coverage

**48 tests** covering all aspects:

- ✅ URL Priority Scoring (7 tests)
- ✅ Content Type Weighting (5 tests)
- ✅ Category Boosting (5 tests)
- ✅ Freshness Scoring (4 tests)
- ✅ Query Synonym Expansion (7 tests)
- ✅ Complete Search Scoring (5 tests)
- ✅ Token Query Detection (7 tests)
- ✅ Configuration Validation (4 tests)
- ✅ Real-World Scenarios (4 tests)

### Run Tests

```bash
# Run search config tests
npm test -- lib/__tests__/search-config.test.ts

# Run with coverage
npm test -- --coverage lib/__tests__/search-config.test.ts
```

### Validation Results

**Requirement**: Token optimization content in top 3 results for relevant queries

**Test Results**:

| Query | Top Result | Token Content in Top 3? |
|-------|-----------|-------------------------|
| "reduce API costs" | Token Optimization Cookbook | ✅ Yes (#1) |
| "save money" | Token Optimization Guide | ✅ Yes (#1) |
| "token budget" | Token Budget Bar Component | ✅ Yes (#1) |
| "pricing" | Token Optimization Cookbook | ✅ Yes (#1) |
| "cost savings" | Token Optimization Guide | ✅ Yes (#2) |
| "optimize tokens" | Token Optimization Dashboard | ✅ Yes (#1) |

**All requirements met!** ✅

## Configuration Tuning

### Adjust Content Type Weights

```typescript
// In search-config.ts
export const searchPriorityConfig = {
  contentTypeWeights: {
    cookbook: 1.5,  // Increase to boost cookbooks more
    guide: 1.2,     // Decrease if guides rank too high
    // ...
  }
}
```

### Add New URL Patterns

```typescript
urlPriorities: [
  {
    pattern: /\/new-feature/,
    score: 0.9,
    description: 'New feature pages'
  },
  // ...
]
```

### Extend Synonyms

```typescript
synonyms: {
  'new-term': ['synonym1', 'synonym2', 'related-term'],
  // ...
}
```

### Modify Category Boosts

```typescript
categoryBoosts: {
  'new-category': 1.2,  // Boost new category
  // ...
}
```

## Performance Considerations

### Memory Usage

- **Configuration**: ~10 KB
- **Search Index**: ~60 KB (384 items)
- **Total Runtime**: ~70 KB

### Search Performance

- **Cold Search**: 5-10ms (includes synonym expansion)
- **Cached Search**: <1ms
- **Index Size**: 384 items
- **Typical Query**: Processes all items, returns top 10

### Optimization Tips

1. **Use caching**: Results cached for 5 minutes
2. **Limit results**: Default limit=10 is optimal
3. **Minimum score**: Set minScore=0.1 to filter low-quality matches
4. **Score breakdown**: Disable in production (includeScoreBreakdown=false)

## Analytics Integration

Track search performance with built-in analytics:

```typescript
import { trackSearchQuery, trackSearchClick } from '@/lib/search-analytics'

// Track search
trackSearchQuery('reduce costs', results.length)

// Track click
trackSearchClick(
  'reduce costs',
  result.href,
  result.title,
  0  // position in results
)
```

View analytics:

```typescript
import { getAnalyticsSummary } from '@/lib/search-analytics'

const summary = getAnalyticsSummary()
console.log('Top queries:', summary.topQueries)
console.log('Click-through rate:', summary.overallCtr)
```

## Maintenance

### Regular Updates

1. **Monthly**: Review top queries and add new synonyms
2. **Quarterly**: Adjust category boosts based on content priorities
3. **After Major Releases**: Update URL patterns for new content

### Monitoring

Monitor these metrics:

- **Click-through rate** (target: >30%)
- **No results rate** (target: <5%)
- **Average click position** (target: <3)
- **Time to click** (target: <5 seconds)

### Troubleshooting

**Issue**: Token content not ranking high enough

```typescript
// Solution: Increase URL priority
{
  pattern: /\/token-/,
  score: 1.0,  // Increase from 0.85
}
```

**Issue**: Too many results

```typescript
// Solution: Increase minimum score
const results = enhancedSearch(query, items, {
  minScore: 0.3  // Increase from 0.1
})
```

**Issue**: Missing synonyms

```typescript
// Solution: Add new synonym mappings
synonyms: {
  'new-term': ['related-term1', 'related-term2']
}
```

## Future Enhancements

### Planned Features

- [ ] Machine learning-based relevance tuning
- [ ] User preference learning
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Fuzzy matching improvements
- [ ] Search result previews
- [ ] Voice search optimization

### Experimental Features

- Query intent detection (navigational vs informational)
- Personalized ranking based on user history
- Context-aware search (time of day, device type)
- Advanced NLP for query understanding

## Support & Contribution

### Questions?

- Check test suite for usage examples
- Review inline code documentation
- See integration examples in `search-integration.ts`

### Found a Bug?

1. Add a failing test in `search-config.test.ts`
2. Fix the issue
3. Verify all tests pass
4. Submit PR with test + fix

### Want to Contribute?

Contributions welcome! Focus areas:

- Additional synonym mappings
- New URL priority patterns
- Performance optimizations
- Better test coverage
- Documentation improvements

---

**Documentation Version**: 1.0
**Last Updated**: January 28, 2026
**Maintained By**: Clarity AI Chat Components Team
