import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Token Cost Preview Component
 *
 * Enterprise-grade cost estimation with real-time pricing,
 * model comparison, and optimization recommendations
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AdvancedTokenCounter, countTokensWithConfidence, } from '@clarity-chat/token-optimization';
/**
 * Model pricing data
 */
const MODEL_PRICING = {
    'gpt-4': {
        model: 'gpt-4',
        inputCost: 0.03,
        outputCost: 0.06,
        contextWindow: 128000,
        description: 'Most capable GPT model',
    },
    'gpt-3.5': {
        model: 'gpt-3.5',
        inputCost: 0.001,
        outputCost: 0.002,
        contextWindow: 16384,
        description: 'Fast and cost-effective',
    },
    claude: {
        model: 'claude',
        inputCost: 0.008,
        outputCost: 0.024,
        contextWindow: 200000,
        description: 'Advanced reasoning capabilities',
    },
    gemini: {
        model: 'gemini',
        inputCost: 0.0075,
        outputCost: 0.03,
        contextWindow: 128000,
        description: 'Multimodal capabilities',
    },
    generic: {
        model: 'generic',
        inputCost: 0.01,
        outputCost: 0.02,
        contextWindow: 32768,
        description: 'General purpose',
    },
};
/**
 * Advanced Token Cost Preview Component
 */
export const AdvancedTokenCostPreview = ({ text, models = ['gpt-4', 'gpt-3.5', 'claude'], estimatedOutputRatio = 0.3, showOptimization = true, showComparison = true, enableRealTime = true, onCostUpdate, className, style, }) => {
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [lastCalculation, setLastCalculation] = useState(0);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [costEstimate, setCostEstimate] = useState(null);
    const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
    const _tokenCounter = useMemo(() => new AdvancedTokenCounter(), []);
    /**
     * Calculate cost estimate
     */
    const calculateCostEstimate = useCallback(() => {
        if (!tokenInfo) {
            return {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                inputCost: 0,
                outputCost: 0,
                totalCost: 0,
                confidence: 'exact',
                model: selectedModel,
                optimizationPotential: 0,
            };
        }
        const inputTokens = tokenInfo.count;
        const outputTokens = Math.ceil(inputTokens * estimatedOutputRatio);
        const totalTokens = inputTokens + outputTokens;
        const pricing = MODEL_PRICING[selectedModel];
        const inputCost = (inputTokens / 1000) * pricing.inputCost;
        const outputCost = (outputTokens / 1000) * pricing.outputCost;
        const totalCost = inputCost + outputCost;
        // Calculate optimization potential
        const optimizationPotential = calculateOptimizationPotential(tokenInfo, selectedModel);
        return {
            inputTokens,
            outputTokens,
            totalTokens,
            inputCost,
            outputCost,
            totalCost,
            confidence: tokenInfo.confidence,
            model: selectedModel,
            optimizationPotential,
        };
    }, [tokenInfo, selectedModel, estimatedOutputRatio]);
    /**
     * Count tokens with performance optimization
     */
    const countTokensOptimized = useCallback(async () => {
        if (!text) {
            return {
                count: 0,
                confidence: 'exact',
                contentType: 'unknown',
                model: selectedModel,
            };
        }
        setIsCalculating(true);
        try {
            // Use the advanced counter for accurate results
            const result = countTokensWithConfidence(text, selectedModel, {
                enableCaching: true,
                enableContentDetection: true,
            });
            return result;
        }
        catch (error) {
            console.warn('Token counting failed:', error);
            // Fallback to basic counting
            return {
                count: Math.ceil(text.length / 4),
                confidence: 'approximate',
                contentType: 'unknown',
                model: selectedModel,
            };
        }
        finally {
            setIsCalculating(false);
        }
    }, [text, selectedModel]);
    /**
     * Generate optimization suggestions
     */
    const generateOptimizationSuggestions = useCallback(() => {
        if (!costEstimate || !showOptimization)
            return [];
        const suggestions = [];
        // Model selection optimization
        const optimalModel = findOptimalModel(text, models);
        if (optimalModel !== selectedModel) {
            const potentialSavings = calculateModelSavings(selectedModel, optimalModel, costEstimate);
            suggestions.push({
                type: 'model_selection',
                title: 'Switch to More Cost-Effective Model',
                description: `${MODEL_PRICING[optimalModel].description} could save ~${Math.round(potentialSavings * 100)}% on costs`,
                potentialSavings,
                implementation: 'easy',
                priority: 'high',
            });
        }
        // Compression optimization
        if (costEstimate.totalTokens > 1000) {
            const compressionSavings = calculateCompressionSavings(costEstimate);
            suggestions.push({
                type: 'compression',
                title: 'Enable Smart Compression',
                description: 'Compress repetitive content to reduce token usage by 20-40%',
                potentialSavings: compressionSavings,
                implementation: 'medium',
                priority: 'medium',
            });
        }
        // Caching optimization
        if (text.length > 500) {
            suggestions.push({
                type: 'caching',
                title: 'Implement Response Caching',
                description: 'Cache similar queries to reduce repeated token costs',
                potentialSavings: 0.15,
                implementation: 'medium',
                priority: 'low',
            });
        }
        return suggestions;
    }, [costEstimate, showOptimization, text, models, selectedModel]);
    /**
     * Effect for token counting
     */
    useEffect(() => {
        let cancelled = false;
        const updateTokens = async () => {
            const now = Date.now();
            // Throttle calculations to prevent excessive updates
            if (!enableRealTime || now - lastCalculation < 500)
                return;
            const result = await countTokensOptimized();
            if (!cancelled) {
                setTokenInfo(result);
                setLastCalculation(now);
            }
        };
        updateTokens();
        return () => {
            cancelled = true;
        };
    }, [text, countTokensOptimized, enableRealTime, lastCalculation]);
    /**
     * Effect for cost calculation
     */
    useEffect(() => {
        if (tokenInfo) {
            const estimate = calculateCostEstimate();
            setCostEstimate(estimate);
            if (onCostUpdate) {
                onCostUpdate(estimate);
            }
        }
    }, [tokenInfo, calculateCostEstimate, onCostUpdate]);
    /**
     * Effect for optimization suggestions
     */
    useEffect(() => {
        if (costEstimate) {
            const suggestions = generateOptimizationSuggestions();
            setOptimizationSuggestions(suggestions);
        }
    }, [costEstimate, generateOptimizationSuggestions]);
    /**
     * Format currency
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        }).format(amount);
    };
    /**
     * Format number with commas
     */
    const formatNumber = (num) => {
        return num.toLocaleString();
    };
    return (_jsxs("div", { className: `advanced-token-cost-preview ${className || ''}`, style: style, children: [_jsxs("div", { className: "cost-preview-header", children: [_jsx("h3", { children: "Token Cost Analysis" }), isCalculating && (_jsx("span", { className: "calculating-indicator", children: "Calculating..." }))] }), _jsxs("div", { className: "model-selector", children: [_jsx("label", { children: "Model:" }), _jsx("select", { value: selectedModel, onChange: (e) => setSelectedModel(e.target.value), disabled: isCalculating, children: models.map((model) => (_jsxs("option", { value: model, children: [model.toUpperCase(), " - ", MODEL_PRICING[model].description] }, model))) })] }), tokenInfo && (_jsxs("div", { className: "token-analysis", children: [_jsxs("div", { className: "token-count", children: [_jsx("span", { className: "label", children: "Tokens:" }), _jsx("span", { className: "value", children: formatNumber(tokenInfo.count) }), _jsx("span", { className: `confidence ${tokenInfo.confidence}`, children: tokenInfo.confidence })] }), _jsxs("div", { className: "content-type", children: [_jsx("span", { className: "label", children: "Content Type:" }), _jsx("span", { className: "value", children: tokenInfo.contentType || 'unknown' })] })] })), costEstimate && (_jsxs("div", { className: "cost-breakdown", children: [_jsx("h4", { children: "Cost Estimate" }), _jsxs("div", { className: "cost-details", children: [_jsxs("div", { className: "cost-item", children: [_jsxs("span", { className: "label", children: ["Input (", formatNumber(costEstimate.inputTokens), " tokens):"] }), _jsx("span", { className: "value", children: formatCurrency(costEstimate.inputCost) })] }), _jsxs("div", { className: "cost-item", children: [_jsxs("span", { className: "label", children: ["Output (", formatNumber(costEstimate.outputTokens), " tokens):"] }), _jsx("span", { className: "value", children: formatCurrency(costEstimate.outputCost) })] }), _jsxs("div", { className: "cost-item total", children: [_jsx("span", { className: "label", children: "Total:" }), _jsx("span", { className: "value", children: formatCurrency(costEstimate.totalCost) })] })] }), showComparison && models.length > 1 && (_jsxs("div", { className: "model-comparison", children: [_jsx("h4", { children: "Model Comparison" }), _jsx("div", { className: "comparison-grid", children: models.map((model) => {
                                    const modelCost = calculateModelCost(text, model, estimatedOutputRatio);
                                    const isSelected = model === selectedModel;
                                    const savings = isSelected
                                        ? 0
                                        : (costEstimate.totalCost - modelCost) /
                                            costEstimate.totalCost;
                                    return (_jsxs("div", { className: `model-option ${isSelected ? 'selected' : ''}`, children: [_jsx("div", { className: "model-name", children: model.toUpperCase() }), _jsx("div", { className: "model-cost", children: formatCurrency(modelCost) }), !isSelected && savings > 0.01 && (_jsxs("div", { className: "model-savings", children: ["Save ", Math.round(savings * 100), "%"] }))] }, model));
                                }) })] }))] })), showOptimization && optimizationSuggestions.length > 0 && (_jsxs("div", { className: "optimization-suggestions", children: [_jsx("h4", { children: "Optimization Suggestions" }), optimizationSuggestions.map((suggestion, index) => (_jsxs("div", { className: `suggestion priority-${suggestion.priority}`, children: [_jsxs("div", { className: "suggestion-header", children: [_jsx("span", { className: "suggestion-title", children: suggestion.title }), _jsxs("span", { className: "suggestion-savings", children: ["Save ", Math.round(suggestion.potentialSavings * 100), "%"] })] }), _jsx("div", { className: "suggestion-description", children: suggestion.description }), _jsxs("div", { className: "suggestion-meta", children: [_jsx("span", { className: "implementation", children: suggestion.implementation }), _jsx("span", { className: "priority", children: suggestion.priority })] })] }, index)))] }))] }));
};
/**
 * Calculate optimization potential based on content and model
 */
function calculateOptimizationPotential(tokenInfo, model) {
    let potential = 0;
    // Content-based optimization
    if (tokenInfo.contentType === 'code') {
        potential += 0.2; // Code can be compressed more effectively
    }
    if (tokenInfo.confidence === 'approximate') {
        potential += 0.15; // Better counting can improve accuracy
    }
    // Model-based optimization
    if (['gpt-4', 'claude'].includes(model)) {
        potential += 0.25; // High-cost models have more optimization potential
    }
    return Math.min(0.5, potential);
}
/**
 * Find optimal model for given text
 */
function findOptimalModel(text, availableModels) {
    const textLength = text.length;
    const complexity = text.split(/[.!?]+/).length / (textLength / 100);
    // Simple heuristics for model selection
    if (textLength < 1000 && complexity < 5) {
        return 'gpt-3.5'; // Simple, short texts
    }
    if (text.includes('code') || text.includes('function')) {
        return 'claude'; // Code-related content
    }
    // Default to most cost-effective available model
    return availableModels.includes('gpt-3.5') ? 'gpt-3.5' : availableModels[0];
}
/**
 * Calculate model switching savings
 */
function calculateModelSavings(currentModel, optimalModel, _currentCost) {
    const currentPricing = MODEL_PRICING[currentModel];
    const optimalPricing = MODEL_PRICING[optimalModel];
    const currentTotalRate = currentPricing.inputCost + currentPricing.outputCost;
    const optimalTotalRate = optimalPricing.inputCost + optimalPricing.outputCost;
    return Math.max(0, (currentTotalRate - optimalTotalRate) / currentTotalRate);
}
/**
 * Calculate compression savings potential
 */
function calculateCompressionSavings(_costEstimate) {
    // Estimate 20-40% compression for typical content
    const compressionRatio = 0.3;
    return compressionRatio * 0.8; // Account for implementation overhead
}
/**
 * Calculate model cost
 */
function calculateModelCost(text, model, outputRatio) {
    const tokenInfo = countTokensWithConfidence(text, model);
    const inputTokens = tokenInfo.count;
    const outputTokens = Math.ceil(inputTokens * outputRatio);
    const pricing = MODEL_PRICING[model];
    const inputCost = (inputTokens / 1000) * pricing.inputCost;
    const outputCost = (outputTokens / 1000) * pricing.outputCost;
    return inputCost + outputCost;
}
//# sourceMappingURL=AdvancedTokenCostPreview.js.map