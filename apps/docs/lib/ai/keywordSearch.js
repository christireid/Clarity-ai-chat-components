/**
 * Keyword-Based Search for Documentation
 *
 * Provides semantic search without requiring embeddings or API keys.
 * Uses TF-IDF-like scoring with keyword matching.
 */
import fs from 'fs';
import path from 'path';
/**
 * Load documentation index from JSON file
 */
function loadDocumentationIndex() {
    try {
        const indexPath = path.join(process.cwd(), 'lib', 'ai', 'docs-index.json');
        const indexData = fs.readFileSync(indexPath, 'utf-8');
        return JSON.parse(indexData);
    }
    catch (error) {
        console.error('Failed to load documentation index:', error);
        return [];
    }
}
/**
 * Normalize and tokenize text for matching
 */
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ') // Replace punctuation with spaces
        .split(/\s+/)
        .filter(word => word.length > 2); // Filter out very short words
}
/**
 * Calculate keyword match score
 */
function calculateKeywordScore(queryTokens, keywords) {
    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
    let matches = 0;
    for (const token of queryTokens) {
        if (keywordSet.has(token)) {
            matches++;
        }
        else {
            // Check for partial matches
            for (const keyword of keywords) {
                if (keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase())) {
                    matches += 0.5;
                    break;
                }
            }
        }
    }
    return matches;
}
/**
 * Calculate content match score using simple text search
 */
function calculateContentScore(queryTokens, content) {
    const contentLower = content.toLowerCase();
    let score = 0;
    for (const token of queryTokens) {
        // Count occurrences
        const regex = new RegExp(`\\b${token}\\b`, 'gi');
        const matches = (contentLower.match(regex) || []).length;
        // Weight by frequency but with diminishing returns
        score += Math.log(matches + 1);
    }
    return score;
}
/**
 * Calculate title match score (higher weight)
 */
function calculateTitleScore(queryTokens, title) {
    const titleTokens = tokenize(title);
    let exactMatches = 0;
    let partialMatches = 0;
    for (const queryToken of queryTokens) {
        if (titleTokens.some(t => t === queryToken)) {
            exactMatches++;
        }
        else if (titleTokens.some(t => t.includes(queryToken) || queryToken.includes(t))) {
            partialMatches++;
        }
    }
    return exactMatches * 3 + partialMatches * 1.5;
}
/**
 * Calculate heading match score
 */
function calculateHeadingScore(queryTokens, headings = []) {
    let score = 0;
    for (const heading of headings) {
        const headingTokens = tokenize(heading);
        for (const queryToken of queryTokens) {
            if (headingTokens.some(t => t === queryToken || t.includes(queryToken))) {
                score += 1;
            }
        }
    }
    return score;
}
/**
 * Calculate relevance boost based on current path
 */
function calculatePathBoost(chunk, currentPath) {
    if (!currentPath)
        return 0;
    // If user is on the same page, boost significantly
    if (currentPath === chunk.url) {
        return 5;
    }
    // If in same section, small boost
    const pathSegments = currentPath.split('/').filter(Boolean);
    const chunkSegments = chunk.url.split('/').filter(Boolean);
    if (pathSegments.length > 0 && chunkSegments.length > 0 && pathSegments[0] === chunkSegments[0]) {
        return 1;
    }
    return 0;
}
/**
 * Search documentation using keyword matching
 */
export function searchDocumentation(query, options = {}) {
    const { topK = 5, minScore = 0.1, category, currentPath, } = options;
    // Load index
    const allChunks = loadDocumentationIndex();
    if (allChunks.length === 0) {
        console.warn('Documentation index is empty');
        return [];
    }
    // Tokenize query
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
        return [];
    }
    // Calculate scores for all chunks
    const results = [];
    for (const chunk of allChunks) {
        // Filter by category if specified
        if (category && chunk.category !== category) {
            continue;
        }
        // Calculate individual scores
        const titleScore = calculateTitleScore(queryTokens, chunk.title);
        const keywordScore = calculateKeywordScore(queryTokens, chunk.keywords);
        const contentScore = calculateContentScore(queryTokens, chunk.content);
        const headingScore = calculateHeadingScore(queryTokens, chunk.metadata.headings);
        const pathBoost = calculatePathBoost(chunk, currentPath);
        // Weighted total score
        const totalScore = titleScore * 3 + // Title matches are most important
            keywordScore * 2 + // Keywords are very important
            headingScore * 1.5 + // Headings are important
            contentScore * 1 + // Content matches
            pathBoost; // Context boost
        if (totalScore > minScore) {
            results.push({
                chunk,
                score: totalScore,
                matches: {
                    title: titleScore,
                    keywords: keywordScore,
                    content: contentScore,
                    headings: headingScore,
                },
            });
        }
    }
    // Sort by score and return top K
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
}
/**
 * Format search results for RAG context
 */
export function formatSearchResultsForRAG(results) {
    if (results.length === 0) {
        return {
            sources: [],
            context: '',
        };
    }
    const sources = results.map(r => ({
        url: r.chunk.url,
        title: r.chunk.title,
        score: r.score,
    }));
    // Build context from top results
    const contextParts = [];
    for (const result of results) {
        const { chunk } = result;
        let contextPart = `## ${chunk.title}\n\n`;
        // Add category info
        contextPart += `*Category: ${chunk.category}*\n\n`;
        // Add content (truncate if too long)
        const maxContentLength = 500;
        const content = chunk.content.length > maxContentLength
            ? chunk.content.substring(0, maxContentLength) + '...'
            : chunk.content;
        contextPart += content + '\n\n';
        // Add reference
        contextPart += `*Source: ${chunk.url}*\n\n`;
        contextParts.push(contextPart);
    }
    return {
        sources,
        context: contextParts.join('---\n\n'),
    };
}
/**
 * Get related documentation for a specific page
 */
export function getRelatedDocumentation(currentPath, limit = 5) {
    const allChunks = loadDocumentationIndex();
    // Find chunks from same section
    const pathSegments = currentPath.split('/').filter(Boolean);
    const section = pathSegments[0];
    const related = allChunks
        .filter(chunk => {
        const chunkSegments = chunk.url.split('/').filter(Boolean);
        return chunkSegments[0] === section && chunk.url !== currentPath;
    })
        .slice(0, limit);
    return related;
}
//# sourceMappingURL=keywordSearch.js.map