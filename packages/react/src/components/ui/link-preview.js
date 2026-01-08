'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card, Badge, cn } from '@clarity-chat/primitives';
import { duration } from '../../animations/constants';
// ============================================================================
// URL Validation & Sanitization (Option B)
// ============================================================================
/** Allowed URL protocols for security */
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
/** Dangerous URL patterns to block */
const DANGEROUS_PATTERNS = [
    /^javascript:/i,
    /^data:/i,
    /^vbscript:/i,
    /^file:/i,
];
/**
 * Validates if a string is a safe HTTP/HTTPS URL
 * @param urlString - The URL string to validate
 * @returns true if the URL is valid and safe
 */
export function isValidUrl(urlString) {
    if (!urlString || typeof urlString !== 'string') {
        return false;
    }
    // Check for dangerous patterns first
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(urlString.trim())) {
            return false;
        }
    }
    try {
        const url = new URL(urlString);
        return ALLOWED_PROTOCOLS.includes(url.protocol);
    }
    catch {
        return false;
    }
}
/**
 * Sanitizes a URL by ensuring it's valid and safe
 * @param urlString - The URL to sanitize
 * @returns The sanitized URL or null if invalid
 */
export function sanitizeUrl(urlString) {
    const trimmed = urlString?.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
        // Safe fallback for invalid or unsafe URLs
        return 'about:blank';
    }
    // Preserve the original string to avoid surprising normalization (e.g. adding trailing '/')
    return trimmed;
}
/**
 * Extracts domain from a URL safely
 */
function getDomain(url) {
    if (!isValidUrl(url)) {
        return url;
    }
    try {
        return new URL(url).hostname.replace('www.', '');
    }
    catch {
        return url;
    }
}
const EMBED_PATTERNS = [
    {
        type: 'youtube',
        patterns: [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        ],
        extractId: (url) => {
            for (const pattern of EMBED_PATTERNS[0].patterns) {
                const match = url.match(pattern);
                if (match)
                    return match[1];
            }
            return null;
        },
    },
    {
        type: 'vimeo',
        patterns: [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/],
        extractId: (url) => {
            const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
            return match ? match[1] : null;
        },
    },
    {
        type: 'twitter',
        patterns: [/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/],
        extractId: (url) => {
            const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
            return match ? match[1] : null;
        },
    },
    {
        type: 'github',
        patterns: [
            /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/,
            /gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/,
        ],
        extractId: (url) => {
            const repoMatch = url.match(/github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/);
            if (repoMatch)
                return repoMatch[1].replace(/\/$/, '');
            const gistMatch = url.match(/gist\.github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9]+)/);
            return gistMatch ? gistMatch[1].replace(/\/$/, '') : null;
        },
    },
    {
        type: 'spotify',
        patterns: [
            /open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/,
        ],
        extractId: (url) => {
            const match = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
            return match ? `${match[1]}/${match[2]}` : null;
        },
    },
];
/**
 * Internal helper: detect embed type + extracted ID from URL.
 */
function detectEmbedDetails(url) {
    if (!isValidUrl(url)) {
        return { type: 'generic', id: null };
    }
    for (const embedPattern of EMBED_PATTERNS) {
        for (const pattern of embedPattern.patterns) {
            if (pattern.test(url)) {
                return {
                    type: embedPattern.type,
                    id: embedPattern.extractId(url),
                };
            }
        }
    }
    return { type: 'generic', id: null };
}
/**
 * Detects the embed type for a URL.
 */
export function detectEmbedType(url) {
    return detectEmbedDetails(url).type;
}
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_CACHE_SIZE = 100;
class LRUCache {
    cache = new Map();
    maxSize;
    constructor(maxSize = DEFAULT_MAX_CACHE_SIZE) {
        this.maxSize = maxSize;
    }
    get(key) {
        if (!this.cache.has(key))
            return undefined;
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    set(key, value) {
        // Delete if exists to update position
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(key, value);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    get size() {
        return this.cache.size;
    }
    has(key) {
        return this.cache.has(key);
    }
}
function getCachedMetadata(cache, url, cacheDuration) {
    const entry = cache.get(url);
    if (!entry)
        return null;
    const isExpired = Date.now() - entry.timestamp > cacheDuration;
    if (isExpired) {
        cache.delete(url);
        return null;
    }
    return entry.metadata;
}
function setCachedMetadata(cache, url, metadata) {
    cache.set(url, { metadata, timestamp: Date.now() });
}
// ============================================================================
// Metadata Fetcher (Option A - Real Implementation)
// ============================================================================
/**
 * Default metadata fetcher that calls a backend API endpoint
 * The backend should handle CORS and return Open Graph / Twitter Card metadata
 */
export function createMetadataFetcher(config) {
    return async function fetchMetadata(url) {
        if (!isValidUrl(url)) {
            throw new Error('Invalid URL');
        }
        const endpoint = config.apiEndpoint ?? config.endpoint;
        if (!endpoint) {
            throw new Error('Missing apiEndpoint');
        }
        const headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
        if (config.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        const timeoutMs = config.timeout ?? 10000;
        const controller = new AbortController();
        let timeoutId = null;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                controller.abort();
                reject(new Error('Request timed out'));
            }, timeoutMs);
        });
        const fetchPromise = fetch(`${endpoint}?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers,
            signal: controller.signal,
        });
        const response = await Promise.race([fetchPromise, timeoutPromise]).finally(() => {
            if (timeoutId)
                clearTimeout(timeoutId);
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.status}`);
        }
        const data = await response.json();
        // Detect embed type
        const { type: embedType, id: embedId } = detectEmbedDetails(url);
        return {
            url,
            title: data.title || data.og_title,
            description: data.description || data.og_description,
            image: data.image || data.og_image,
            siteName: data.site_name || data.og_site_name,
            favicon: data.favicon,
            type: data.type || 'website',
            embedType: embedType ?? undefined,
            embedId: embedId ?? undefined,
        };
    };
}
/**
 * Fallback metadata extractor for demo/development
 * Uses URL parsing to provide basic metadata
 */
export function createFallbackMetadata(url) {
    if (!isValidUrl(url)) {
        return { url, title: url };
    }
    const { type: embedType, id: embedId } = detectEmbedDetails(url);
    const domain = getDomain(url);
    // Generate reasonable fallback data based on URL
    const siteName = domain.split('.')[0];
    const capitalizedSiteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
    return {
        url,
        title: domain,
        siteName: capitalizedSiteName,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        type: 'website',
        embedType: embedType ?? undefined,
        embedId: embedId ?? undefined,
    };
}
// ============================================================================
// LinkPreviewSkeleton Component
// ============================================================================
export function LinkPreviewSkeleton({ variant = 'card', className, }) {
    if (variant === 'compact') {
        return (_jsxs(Card, { className: cn('p-3 animate-pulse shadow-sm', className), children: [_jsx("span", { className: "sr-only", children: "Loading link preview" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-muted/60 rounded flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [_jsx("div", { className: "h-4 bg-muted/60 rounded w-3/4" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-1/2" })] })] })] }));
    }
    if (variant === 'inline') {
        return (_jsxs("span", { className: cn('inline-flex items-center gap-1.5 animate-pulse', className), children: [_jsx("span", { className: "sr-only", children: "Loading link preview" }), _jsx("span", { className: "w-4 h-4 bg-muted/60 rounded" }), _jsx("span", { className: "h-3.5 bg-muted/60 rounded w-24" })] }));
    }
    // Default card variant with shimmer effect
    return (_jsx(Card, { className: cn('overflow-hidden shadow-sm', className), children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "sr-only", children: "Loading link preview" }), _jsx("div", { className: "absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" }), _jsxs("div", { className: "flex gap-3.5 p-4", children: [_jsx("div", { className: "w-24 h-24 bg-muted/60 rounded flex-shrink-0" }), _jsxs("div", { className: "flex-1 space-y-2.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 bg-muted/60 rounded" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-20" })] }), _jsx("div", { className: "h-4 bg-muted/60 rounded w-3/4" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-full" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-2/3" })] })] })] }) }));
}
LinkPreviewSkeleton.displayName = 'LinkPreviewSkeleton';
// ============================================================================
// LinkPreviewError Component
// ============================================================================
export function LinkPreviewError({ url, error, onRetry, className, }) {
    const domain = getDomain(url);
    const isInvalidUrl = !isValidUrl(url);
    return (_jsx(Card, { className: cn('p-4 border-destructive/20 bg-destructive/5 shadow-sm', className), role: "alert", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded bg-destructive/10 flex items-center justify-center text-destructive", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: isInvalidUrl ? 'Invalid URL' : 'Failed to load preview' }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: domain }), error && _jsx("p", { className: "text-xs text-destructive/80 mt-1", children: error })] }), onRetry && !isInvalidUrl && (_jsx("button", { onClick: onRetry, className: "flex-shrink-0 text-xs text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded", "aria-label": "Retry loading preview", children: "Retry" }))] }) }));
}
LinkPreviewError.displayName = 'LinkPreviewError';
function ExpandableDescription({ description, maxLength = 120, className, }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const needsExpansion = description.length > maxLength;
    const prefersReducedMotion = useReducedMotion();
    const displayText = needsExpansion && !isExpanded
        ? description.slice(0, maxLength).trim() + '...'
        : description;
    return (_jsxs("div", { className: className, children: [_jsx(motion.p, { className: "text-xs text-muted-foreground/90", initial: false, animate: { height: 'auto' }, transition: prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: duration('normal') }, children: displayText }), needsExpansion && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }, className: "text-xs text-primary hover:underline mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded", "aria-expanded": isExpanded, children: isExpanded ? 'Show less' : 'Show more' }))] }));
}
export function LinkPreviewCompact({ metadata, onClick, showFavicon = true, className, }) {
    const [faviconError, setFaviconError] = React.useState(false);
    const domain = getDomain(metadata.url);
    const prefersReducedMotion = useReducedMotion();
    const isValid = isValidUrl(metadata.url);
    const title = metadata.title?.trim() ? metadata.title.trim() : domain;
    const subtitle = metadata.title?.trim() && metadata.title.trim() !== domain ? domain : null;
    const handleKeyDown = (event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
        }
    };
    // Show error state for invalid URLs
    if (!isValid) {
        return (_jsx(LinkPreviewError, { url: metadata.url, error: "Invalid URL format", className: className }));
    }
    const content = (_jsx(Card, { className: cn('p-3 transition-all shadow-sm', onClick &&
            'cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className), onClick: onClick, onKeyDown: handleKeyDown, tabIndex: onClick ? 0 : undefined, role: onClick ? 'link' : undefined, "aria-label": onClick ? `Open link: ${title}` : `Link preview: ${title}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [showFavicon && (_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center", children: metadata.favicon && !faviconError ? (_jsx("img", { src: metadata.favicon, alt: `${domain} favicon`, className: "w-5 h-5", onError: () => setFaviconError(true), loading: "lazy" })) : (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 text-muted-foreground", "aria-hidden": "true", children: [_jsx("path", { d: "M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" }), _jsx("path", { d: "M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" })] })) })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium truncate text-foreground", children: title }), subtitle && (_jsx("p", { className: "text-xs text-muted-foreground truncate", children: subtitle }))] }), metadata.embedType &&
                    metadata.embedType !== 'default' &&
                    metadata.embedType !== 'generic' && (_jsx(Badge, { variant: "secondary", className: "text-[10px] uppercase flex-shrink-0", children: metadata.embedType })), onClick && (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-4 h-4 text-muted-foreground flex-shrink-0", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z", clipRule: "evenodd" }) }))] }) }));
    if (prefersReducedMotion) {
        return content;
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, transition: { duration: duration('fast') }, children: content }));
}
LinkPreviewCompact.displayName = 'LinkPreviewCompact';
/**
 * RichEmbed component (public) - renders an iframe for supported providers,
 * otherwise falls back to a safe link.
 */
export function RichEmbed({ url, embedType, className }) {
    let { id } = detectEmbedDetails(url);
    const safeUrl = sanitizeUrl(url);
    const type = embedType === 'default' ? 'generic' : embedType;
    // Some tests/callers provide non-canonical IDs; fall back to parsing.
    if (!id && isValidUrl(url)) {
        try {
            const parsed = new URL(url);
            if (type === 'youtube') {
                id = parsed.searchParams.get('v');
            }
        }
        catch {
            // ignore
        }
    }
    if (!id || type === 'generic') {
        return (_jsx("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: cn('inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded', className), children: url }));
    }
    switch (type) {
        case 'youtube':
            return (_jsx("iframe", { className: cn('w-full aspect-video rounded-lg', className), src: `https://www.youtube.com/embed/${id}`, title: "YouTube video", role: "presentation", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }));
        case 'vimeo':
            return (_jsx("iframe", { className: cn('w-full aspect-video rounded-lg', className), src: `https://player.vimeo.com/video/${id}`, title: "Vimeo video", role: "presentation", allow: "autoplay; fullscreen; picture-in-picture", allowFullScreen: true }));
        case 'spotify':
            return (_jsx("iframe", { className: cn('w-full rounded-lg', className), src: `https://open.spotify.com/embed/${id}`, title: "Spotify", role: "presentation", allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", loading: "lazy" }));
        default:
            return (_jsx("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: cn('inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded', className), children: url }));
    }
}
// ============================================================================
// LinkPreview Component (Main)
// ============================================================================
export function LinkPreview({ metadata, variant = 'card', onClick, onRemove, loading = false, showImage = true, showFavicon = true, showDomain = true, showDescription = true, expandableDescription = false, fallback, className, 'aria-label': ariaLabel, }) {
    const [imageError, setImageError] = React.useState(false);
    const [faviconError, setFaviconError] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();
    const reduceMotion = prefersReducedMotion ||
        (typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const domain = getDomain(metadata.url);
    const isValid = isValidUrl(metadata.url);
    // Reset image error when metadata changes
    React.useEffect(() => {
        setImageError(false);
        setFaviconError(false);
    }, [metadata.image, metadata.favicon]);
    // Loading state
    if (loading) {
        return _jsx(LinkPreviewSkeleton, { variant: variant, className: className });
    }
    // URL validation - show error for invalid URLs
    if (!isValid && metadata.url) {
        return (_jsx(LinkPreviewError, { url: metadata.url, error: "Invalid or unsafe URL", className: className }));
    }
    // Fallback for missing required data
    if (!metadata.url && fallback) {
        return _jsx(_Fragment, { children: fallback });
    }
    // Compact variant
    if (variant === 'compact') {
        return (_jsx(LinkPreviewCompact, { metadata: metadata, onClick: onClick, showFavicon: showFavicon, className: className }));
    }
    // Inline variant
    if (variant === 'inline') {
        return (_jsxs("a", { href: sanitizeUrl(metadata.url) || 'about:blank', target: "_blank", rel: "noopener noreferrer", className: cn('inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded', className), "aria-label": ariaLabel || `Link to ${metadata.title || domain}`, onClick: (e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
            }, children: [showFavicon && metadata.favicon && !faviconError && (_jsx("img", { src: metadata.favicon, alt: `${domain} favicon`, className: "w-4 h-4", onError: () => setFaviconError(true), loading: "lazy" })), metadata.title || domain, _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-3.5 h-3.5", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z", clipRule: "evenodd" }) })] }));
    }
    // Check for rich embed support
    const inferredEmbedType = metadata.embedType ?? detectEmbedType(metadata.url);
    const hasRichEmbed = inferredEmbedType === 'youtube' ||
        inferredEmbedType === 'vimeo' ||
        inferredEmbedType === 'spotify';
    // Handle keyboard navigation for card
    const handleKeyDown = (event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
        }
    };
    // Card variant (default)
    const cardContent = (_jsxs(Card, { className: cn('group relative overflow-hidden transition-all shadow-sm', onClick &&
            'cursor-pointer hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'), onClick: hasRichEmbed ? undefined : onClick, onKeyDown: hasRichEmbed ? undefined : handleKeyDown, tabIndex: onClick && !hasRichEmbed ? 0 : undefined, role: onClick && !hasRichEmbed ? 'link' : undefined, "aria-label": ariaLabel ||
            (onClick
                ? `Open link: ${metadata.title || domain}`
                : `Link preview: ${metadata.title || domain}`), children: [onRemove && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onRemove();
                }, className: "absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", "aria-label": "Remove link preview", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-3.5 h-3.5", "aria-hidden": "true", children: _jsx("path", { d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" }) }) })), hasRichEmbed && (_jsx("div", { className: "p-4 pb-0", children: _jsx(RichEmbed, { url: metadata.url, embedType: inferredEmbedType }) })), _jsxs("div", { className: "flex gap-3.5 p-4", children: [showImage &&
                        !hasRichEmbed &&
                        (metadata.image && !imageError ? (_jsx("div", { className: "flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted", children: _jsx("img", { src: metadata.image, alt: metadata.title
                                    ? `Preview image for ${metadata.title}`
                                    : 'Link preview image', className: "w-full h-full object-cover", onError: () => setImageError(true), loading: "lazy" }) })) : (_jsx("div", { className: "flex-shrink-0 w-24 h-24 rounded-lg bg-muted flex items-center justify-center", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8 text-muted-foreground/50", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z", clipRule: "evenodd" }) }) }))), _jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [(showFavicon || showDomain) && (_jsxs("div", { className: "flex items-center gap-2", children: [showFavicon && metadata.favicon && !faviconError && (_jsx("img", { src: metadata.favicon, alt: `${domain} favicon`, className: "w-4 h-4 flex-shrink-0", onError: () => setFaviconError(true), loading: "lazy" })), _jsx("p", { className: "text-xs text-muted-foreground/90 truncate", children: metadata.siteName || domain }), inferredEmbedType &&
                                        inferredEmbedType !== 'default' &&
                                        inferredEmbedType !== 'generic' && (_jsx(Badge, { variant: "secondary", className: "text-[10px] uppercase", children: inferredEmbedType }))] })), metadata.title && (_jsx("h4", { className: "font-semibold text-sm line-clamp-2 leading-tight text-foreground", children: metadata.title })), showDescription &&
                                metadata.description &&
                                (expandableDescription ? (_jsx(ExpandableDescription, { description: metadata.description })) : (_jsx("p", { className: "text-xs text-muted-foreground/90 line-clamp-2", children: metadata.description.length > 160
                                        ? metadata.description.slice(0, 160).trim() + '...'
                                        : metadata.description }))), showDomain && metadata.siteName && metadata.siteName !== domain && (_jsx("div", { className: "flex items-center gap-2 pt-1", children: _jsxs(Badge, { variant: "outline", className: "text-xs max-w-full", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-3 h-3 mr-1 flex-shrink-0", "aria-hidden": "true", children: [_jsx("path", { d: "M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" }), _jsx("path", { d: "M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" })] }), _jsx("span", { className: "truncate", children: domain })] }) }))] })] }), onClick && !reduceMotion && !hasRichEmbed && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200", "aria-hidden": "true" }))] }));
    // Wrap with motion if animations are enabled
    if (reduceMotion) {
        return _jsx("div", { className: className, children: cardContent });
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: duration('normal') }, className: className, children: cardContent }));
}
LinkPreview.displayName = 'LinkPreview';
// ============================================================================
// useLinkPreview Hook
// ============================================================================
export function useLinkPreview(options = {}) {
    const { cacheDuration = DEFAULT_CACHE_DURATION, maxCacheSize = DEFAULT_MAX_CACHE_SIZE, fetchFn, apiEndpoint, timeout = 10000, } = options;
    const [loading, setLoading] = React.useState(false);
    const [metadata, setMetadata] = React.useState(null);
    const [error, setError] = React.useState(null);
    const cacheRef = React.useRef(null);
    if (!cacheRef.current) {
        cacheRef.current = new LRUCache(maxCacheSize);
    }
    // Track in-flight requests to prevent duplicate fetches
    const pendingRequests = React.useRef(new Map());
    const fetchMetadata = React.useCallback(async (url) => {
        // Validate URL first
        if (!isValidUrl(url)) {
            const errorMsg = 'Invalid or unsafe URL';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
        // Check cache first
        const cached = getCachedMetadata(cacheRef.current, url, cacheDuration);
        if (cached) {
            setMetadata(cached);
            setError(null);
            return cached;
        }
        // Check for pending request
        const pending = pendingRequests.current.get(url);
        if (pending) {
            const result = await pending;
            setMetadata(result);
            return result;
        }
        setLoading(true);
        setError(null);
        const fetchPromise = (async () => {
            try {
                // Ensure `loading` can be observed before completion (esp. fallback path).
                await Promise.resolve();
                let result;
                if (fetchFn) {
                    // Use custom fetch function
                    result = await fetchFn(url);
                }
                else if (apiEndpoint) {
                    // Use provided API endpoint
                    const fetcher = createMetadataFetcher({
                        apiEndpoint,
                        timeout,
                    });
                    result = await fetcher(url);
                }
                else {
                    // Use fallback metadata (extracts from URL)
                    result = createFallbackMetadata(url);
                }
                // Ensure embed detection is done
                if (!result.embedType) {
                    const { type, id } = detectEmbedDetails(url);
                    result.embedType = type;
                    result.embedId = id || undefined;
                }
                setCachedMetadata(cacheRef.current, url, result);
                setMetadata(result);
                return result;
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch link metadata';
                setError(errorMsg);
                throw err;
            }
            finally {
                setLoading(false);
                pendingRequests.current.delete(url);
            }
        })();
        pendingRequests.current.set(url, fetchPromise);
        return fetchPromise;
    }, [cacheDuration, fetchFn, apiEndpoint, timeout]);
    const reset = React.useCallback(() => {
        setMetadata(null);
        setError(null);
        setLoading(false);
    }, []);
    const clearCache = React.useCallback(() => {
        cacheRef.current?.clear();
    }, []);
    return {
        loading,
        metadata,
        error,
        fetchMetadata,
        reset,
        clearCache,
    };
}
export function InlineLink({ url, onPreview, children, className, showHoverPreview = true, }) {
    const [showPreview, setShowPreview] = React.useState(false);
    const { metadata, loading, error, fetchMetadata } = useLinkPreview();
    const timeoutRef = React.useRef(null);
    const prefersReducedMotion = useReducedMotion();
    const isValid = isValidUrl(url);
    const handleMouseEnter = () => {
        if (!showHoverPreview || !isValid)
            return;
        // Debounce the preview fetch
        timeoutRef.current = setTimeout(() => {
            if (!metadata && !loading && !error) {
                fetchMetadata(url);
            }
            setShowPreview(true);
        }, 300);
    };
    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShowPreview(false);
    };
    const handleFocus = () => {
        if (showHoverPreview && isValid && !metadata && !loading && !error) {
            fetchMetadata(url);
        }
    };
    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    // For invalid URLs, show a warning style
    if (!isValid) {
        return (_jsx("span", { className: cn('text-destructive/70 cursor-not-allowed', className), title: "Invalid URL", children: children || url }));
    }
    return (_jsxs("span", { className: "relative inline-block", children: [_jsx("a", { href: sanitizeUrl(url) || 'about:blank', target: "_blank", rel: "noopener noreferrer", className: cn('text-primary hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded', className), onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onFocus: handleFocus, onClick: (e) => {
                    if (onPreview) {
                        e.preventDefault();
                        onPreview(url);
                    }
                }, "aria-describedby": showPreview && metadata
                    ? `preview-${url.replace(/[^a-z0-9]/gi, '-')}`
                    : undefined, children: children || url }), showHoverPreview && (_jsx(AnimatePresence, { children: showPreview && (metadata || loading) && (_jsx(motion.div, { id: `preview-${url.replace(/[^a-z0-9]/gi, '-')}`, role: "tooltip", initial: prefersReducedMotion ? {} : { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: prefersReducedMotion ? {} : { opacity: 0, y: 10 }, transition: { duration: duration('fast') }, className: "absolute bottom-full left-0 mb-2 w-80 z-50", onMouseEnter: () => setShowPreview(true), onMouseLeave: handleMouseLeave, children: loading ? (_jsx(LinkPreviewSkeleton, { variant: "card" })) : metadata ? (_jsx(LinkPreview, { metadata: metadata, onClick: () => window.open(sanitizeUrl(url) || url, '_blank', 'noopener,noreferrer') })) : null })) }))] }));
}
InlineLink.displayName = 'InlineLink';
export function SmartLinkPreview({ url, variant = 'card', onClick, onRemove, onLoad, onError, showImage = true, showFavicon = true, showDomain = true, showDescription = true, expandableDescription = false, fallback, className, fetchFn, apiEndpoint, }) {
    const { metadata, loading, error, fetchMetadata } = useLinkPreview({
        fetchFn,
        apiEndpoint,
    });
    // Validate URL immediately
    const isValid = isValidUrl(url);
    // Fetch metadata on mount
    React.useEffect(() => {
        if (!isValid) {
            onError?.(new Error('Invalid or unsafe URL'));
            return;
        }
        fetchMetadata(url)
            .then((data) => onLoad?.(data))
            .catch((err) => onError?.(err instanceof Error ? err : new Error(String(err))));
    }, [url, fetchMetadata, onLoad, onError, isValid]);
    // Invalid URL state
    if (!isValid) {
        if (fallback) {
            return _jsx(_Fragment, { children: fallback });
        }
        return (_jsx(LinkPreviewError, { url: url, error: "Invalid or unsafe URL", className: className }));
    }
    // Error state
    if (error && !loading) {
        if (fallback) {
            return _jsx(_Fragment, { children: fallback });
        }
        return (_jsx(LinkPreviewError, { url: url, error: error, onRetry: () => fetchMetadata(url), className: className }));
    }
    // Loading or success state
    return (_jsx(LinkPreview, { metadata: metadata || { url }, variant: variant, onClick: onClick ||
            (() => window.open(sanitizeUrl(url) || url, '_blank', 'noopener,noreferrer')), onRemove: onRemove, loading: loading, showImage: showImage, showFavicon: showFavicon, showDomain: showDomain, showDescription: showDescription, expandableDescription: expandableDescription, className: className }));
}
SmartLinkPreview.displayName = 'SmartLinkPreview';
//# sourceMappingURL=link-preview.js.map