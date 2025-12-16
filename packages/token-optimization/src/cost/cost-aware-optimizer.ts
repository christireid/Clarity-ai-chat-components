/**
 * Cost-Aware Optimizer
 * 
 * Implements budget-conscious technique selection for maximum cost-effectiveness
 * Selects optimization techniques based on estimated costs and defined budget
 */

import type { SecurityContext } from '../types'

export interface CostAwareConfig {
  totalBudget: number // Total budget in dollars
  enableCostPrediction: boolean
  enableBudgetTracking: boolean
  enableCostOptimization: boolean
  costWeights: {
    tokenCost: number
    processingCost: number
    storageCost: number
    networkCost: number
  }
  budgetAlertThresholds: {
    warning: number // 80% of budget
    critical: number // 95% of budget
    emergency: number // 100% of budget
  }
  enableRealTimeCostTracking: boolean
  enableCostForecasting: boolean
  enableAutomaticOptimization: boolean
  optimizationStrategy: 'maximize_savings' | 'minimize_cost' | 'balanced'
}

export interface CostEstimate {
  technique: string
  estimatedTokens: number
  estimatedCost: number
  processingCost: number
  storageCost: number
  networkCost: number
  totalCost: number
  expectedSavings: number
  costEffectiveness: number // savings per dollar
  riskLevel: 'low' | 'medium' | 'high'
  qualityImpact: number // 0-1 score
  processingTime: number // milliseconds
  resourceRequirements: ResourceRequirements
}

export interface ResourceRequirements {
  memory: number // MB
  cpu: number // CPU cores
  time: number // milliseconds
  cost: number // estimated cost
}

export interface OptimizationStrategy {
  name: string
  techniques: string[]
  totalCost: number
  expectedSavings: number
  costEffectiveness: number
  qualityScore: number
  processingTime: number
  riskLevel: 'low' | 'medium' | 'high'
  budgetUtilization: number
  recommendation: string
}

export interface BudgetStatus {
  totalBudget: number
  usedBudget: number
  remainingBudget: number
  budgetUtilization: number
  budgetStatus: 'healthy' | 'warning' | 'critical' | 'emergency'
  estimatedTimeRemaining: number // hours
  costPerHour: number
  savingsPerHour: number
  efficiency: number // savings per dollar spent
}

/**
 * Cost-Aware Optimizer - Budget-conscious technique selection
 */
export class CostAwareOptimizer {
  private costHistory: CostEstimate[] = []
  private budgetTracking: Map<string, number> = new Map()
  private costPredictions: Map<string, number> = new Map()

  constructor(private config: CostAwareConfig) {
    this.initializeCostPredictions()
  }

  /**
   * Select optimal techniques based on budget and cost-effectiveness
   */
  async selectOptimalTechniques(
    availableTechniques: string[],
    content: string,
    _context?: SecurityContext
  ): Promise<OptimizationStrategy> {
    // Remove unused startTime variable
    try {
      // Estimate costs for all techniques
      const costEstimates = await this.estimateCosts(
        availableTechniques,
        content
      )

      // Filter techniques within budget
      const affordableTechniques = this.filterAffordableTechniques(costEstimates)

      // Generate optimization strategies
      const strategies = this.generateStrategies(affordableTechniques)

      // Select best strategy based on optimization goals
      const optimalStrategy = this.selectBestStrategy(strategies)

      // Update budget tracking
      this.updateBudgetTracking(optimalStrategy)

      // Send cost alerts if necessary
      this.checkBudgetAlerts()

      return optimalStrategy

    } catch (error) {
      // Return fallback strategy on error
      return this.getFallbackStrategy(availableTechniques)
    }
  }

  /**
   * Estimate costs for all available techniques
   */
  private async estimateCosts(
    techniques: string[],
    content: string
  ): Promise<CostEstimate[]> {
    const estimates: CostEstimate[] = []

    for (const technique of techniques) {
      try {
        const estimate = await this.estimateTechniqueCost(
          technique,
          content
        )
        estimates.push(estimate)
      } catch (error) {
        console.warn(`Failed to estimate cost for technique ${technique}:`, error)
      }
    }

    return estimates.sort((a, b) => b.costEffectiveness - a.costEffectiveness)
  }

  /**
   * Estimate cost for a specific technique
   */
  private async estimateTechniqueCost(
    technique: string,
    content: string
  ): Promise<CostEstimate> {
    // Base cost calculations
    const baseTokenCost = this.calculateBaseTokenCost(content)
    const processingCost = this.calculateProcessingCost(technique, content)
    const storageCost = this.calculateStorageCost(technique, content)
    const networkCost = this.calculateNetworkCost(technique, content)
    
    const totalCost = baseTokenCost + processingCost + storageCost + networkCost
    
    // Expected savings based on technique
    const expectedSavings = this.calculateExpectedSavings(technique, content)
    
    // Cost effectiveness (savings per dollar)
    const costEffectiveness = totalCost > 0 ? expectedSavings / totalCost : 0
    
    // Risk assessment
    const riskLevel = this.assessRisk(technique, content)
    
    // Quality impact
    const qualityImpact = this.estimateQualityImpact(technique)
    
    // Processing time
    const processingTime = this.estimateProcessingTime(technique, content)
    
    // Resource requirements
    const resourceRequirements = this.estimateResourceRequirements(technique, content)

    return {
      technique,
      estimatedTokens: this.estimateTokenCount(content, technique),
      estimatedCost: totalCost,
      processingCost,
      storageCost,
      networkCost,
      totalCost,
      expectedSavings,
      costEffectiveness,
      riskLevel,
      qualityImpact,
      processingTime,
      resourceRequirements
    }
  }

  /**
   * Filter techniques within budget constraints
   */
  private filterAffordableTechniques(estimates: CostEstimate[]): CostEstimate[] {
    const remainingBudget = this.getRemainingBudget()
    const budgetThreshold = remainingBudget * 0.9 // Use 90% of remaining budget
    
    return estimates.filter(estimate => estimate.totalCost <= budgetThreshold)
  }

  /**
   * Generate optimization strategies
   */
  private generateStrategies(techniques: CostEstimate[]): OptimizationStrategy[] {
    const strategies: OptimizationStrategy[] = []
    
    // Single technique strategies
    for (const technique of techniques) {
      strategies.push(this.createSingleTechniqueStrategy(technique))
    }
    
    // Multi-technique strategies (combinations of 2-3 techniques)
    const multiTechniqueStrategies = this.generateMultiTechniqueStrategies(techniques)
    strategies.push(...multiTechniqueStrategies)
    
    // Sort by cost-effectiveness
    return strategies.sort((a, b) => b.costEffectiveness - a.costEffectiveness)
  }

  /**
   * Create single technique strategy
   */
  private createSingleTechniqueStrategy(technique: CostEstimate): OptimizationStrategy {
    const totalCost = technique.totalCost
    const expectedSavings = technique.expectedSavings
    const costEffectiveness = technique.costEffectiveness
    const qualityScore = technique.qualityImpact
    const processingTime = technique.processingTime
    const budgetUtilization = totalCost / this.config.totalBudget

    return {
      name: `Single_${technique.technique}`,
      techniques: [technique.technique],
      totalCost,
      expectedSavings,
      costEffectiveness,
      qualityScore,
      processingTime,
      riskLevel: technique.riskLevel,
      budgetUtilization,
      recommendation: this.generateRecommendation('single', technique)
    }
  }

  /**
   * Generate multi-technique strategies
   */
  private generateMultiTechniqueStrategies(techniques: CostEstimate[]): OptimizationStrategy[] {
    const strategies: OptimizationStrategy[] = []
    const maxTechniques = Math.min(3, techniques.length)
    
    for (let i = 2; i <= maxTechniques; i++) {
      const combinations = this.generateCombinations(techniques, i)
      
      for (const combination of combinations) {
        const strategy = this.createMultiTechniqueStrategy(combination)
        if (strategy.totalCost <= this.getRemainingBudget()) {
          strategies.push(strategy)
        }
      }
    }
    
    return strategies
  }

  /**
   * Create multi-technique strategy
   */
  private createMultiTechniqueStrategy(techniques: CostEstimate[]): OptimizationStrategy {
    const totalCost = techniques.reduce((sum, t) => sum + t.totalCost, 0)
    const expectedSavings = techniques.reduce((sum, t) => sum + t.expectedSavings, 0)
    const processingTime = techniques.reduce((sum, t) => sum + t.processingTime, 0)
    const qualityScore = techniques.reduce((sum, t) => sum + t.qualityImpact, 0) / techniques.length
    const costEffectiveness = totalCost > 0 ? expectedSavings / totalCost : 0
    const budgetUtilization = totalCost / this.config.totalBudget
    const riskLevel = this.assessMultiTechniqueRisk(techniques)
    const techniqueNames = techniques.map(t => t.technique)

    return {
      name: `Multi_${techniqueNames.join('_')}`,
      techniques: techniqueNames,
      totalCost,
      expectedSavings,
      costEffectiveness,
      qualityScore,
      processingTime,
      riskLevel,
      budgetUtilization,
      recommendation: this.generateRecommendation('multi', techniques[0])
    }
  }

  /**
   * Select best strategy based on optimization goals
   */
  private selectBestStrategy(strategies: OptimizationStrategy[]): OptimizationStrategy {
    if (strategies.length === 0) {
      return this.getFallbackStrategy([])
    }

    switch (this.config.optimizationStrategy) {
      case 'maximize_savings':
        return strategies.reduce((best, current) => 
          current.expectedSavings > best.expectedSavings ? current : best
        )
      
      case 'minimize_cost':
        return strategies.reduce((best, current) => 
          current.totalCost < best.totalCost ? current : best
        )
      
      case 'balanced':
      default:
        return strategies.reduce((best, current) => {
          const bestRiskWeight = best.riskLevel === 'high' ? 0.3 : best.riskLevel === 'medium' ? 0.2 : 0.1
          const currentRiskWeight = current.riskLevel === 'high' ? 0.3 : current.riskLevel === 'medium' ? 0.2 : 0.1
          
          const bestScore = best.costEffectiveness * 0.4 + best.qualityScore * 0.3 + (1 - bestRiskWeight)
          const currentScore = current.costEffectiveness * 0.4 + current.qualityScore * 0.3 + (1 - currentRiskWeight)
          return currentScore > bestScore ? current : best
        })
    }
  }

  /**
   * Get current budget status
   */
  getBudgetStatus(): BudgetStatus {
    const usedBudget = this.calculateUsedBudget()
    const remainingBudget = this.config.totalBudget - usedBudget
    const budgetUtilization = usedBudget / this.config.totalBudget
    
    let budgetStatus: 'healthy' | 'warning' | 'critical' | 'emergency'
    if (budgetUtilization >= 1) budgetStatus = 'emergency'
    else if (budgetUtilization >= this.config.budgetAlertThresholds.critical) budgetStatus = 'critical'
    else if (budgetUtilization >= this.config.budgetAlertThresholds.warning) budgetStatus = 'warning'
    else budgetStatus = 'healthy'
    
    const costPerHour = this.calculateCostPerHour()
    const savingsPerHour = this.calculateSavingsPerHour()
    const efficiency = costPerHour > 0 ? savingsPerHour / costPerHour : 0
    const estimatedTimeRemaining = remainingBudget > 0 ? remainingBudget / costPerHour : 0

    return {
      totalBudget: this.config.totalBudget,
      usedBudget,
      remainingBudget,
      budgetUtilization,
      budgetStatus,
      estimatedTimeRemaining,
      costPerHour,
      savingsPerHour,
      efficiency
    }
  }

  /**
   * Calculate base token cost
   */
  private calculateBaseTokenCost(content: string): number {
    const tokenCount = this.estimateTokenCount(content, 'base')
    const costPerToken = 0.001 // $0.001 per token (example rate)
    return tokenCount * costPerToken
  }

  /**
   * Calculate processing cost
   */
  private calculateProcessingCost(technique: string, content: string): number {
    const baseCost = 0.01 // Base processing cost
    const complexityMultiplier = this.getComplexityMultiplier(technique)
    const contentSizeMultiplier = content.length / 1000 // Cost scales with content size
    
    return baseCost * complexityMultiplier * contentSizeMultiplier
  }

  /**
   * Calculate storage cost
   */
  private calculateStorageCost(technique: string, content: string): number {
    const storageMultiplier = this.getStorageMultiplier(technique)
    const storageSize = content.length * storageMultiplier
    const storageRate = 0.0001 // $0.0001 per KB per hour
    
    return storageSize * storageRate
  }

  /**
   * Calculate network cost
   */
  private calculateNetworkCost(technique: string, content: string): number {
    const networkMultiplier = this.getNetworkMultiplier(technique)
    const dataSize = content.length * networkMultiplier
    const networkRate = 0.0005 // $0.0005 per KB
    
    return dataSize * networkRate
  }

  /**
   * Calculate expected savings
   */
  private calculateExpectedSavings(technique: string, content: string): number {
    const savingsRates: Record<string, number> = {
      'semantic_caching': 0.9,
      'context_caching': 0.85,
      'llmlingua_compression': 0.8,
      'dynamic_compression': 0.75,
      'intelligent_routing': 0.4,
      'token_counting': 0.1,
      'basic_compression': 0.6
    }
    
    const baseCost = this.calculateBaseTokenCost(content)
    const savingsRate = savingsRates[technique] || 0.1
    
    return baseCost * savingsRate
  }

  /**
   * Assess risk level
   */
  private assessRisk(technique: string, _content: string): 'low' | 'medium' | 'high' {
    const riskFactors: Record<string, number> = {
      'semantic_caching': 0.2,
      'context_caching': 0.1,
      'llmlingua_compression': 0.7,
      'dynamic_compression': 0.5,
      'intelligent_routing': 0.3,
      'token_counting': 0.1,
      'basic_compression': 0.3
    }
    
    const riskScore = riskFactors[technique] || 0.5
    
    if (riskScore < 0.3) return 'low'
    if (riskScore < 0.6) return 'medium'
    return 'high'
  }

  /**
   * Estimate quality impact
   */
  private estimateQualityImpact(technique: string): number {
    const qualityImpacts: Record<string, number> = {
      'semantic_caching': 0.95,
      'context_caching': 0.98,
      'llmlingua_compression': 0.85,
      'dynamic_compression': 0.9,
      'intelligent_routing': 0.95,
      'token_counting': 0.99,
      'basic_compression': 0.92
    }
    
    return qualityImpacts[technique] || 0.9
  }

  /**
   * Estimate processing time
   */
  private estimateProcessingTime(technique: string, content: string): number {
    const baseTime = 10 // Base 10ms
    const complexityMultipliers: Record<string, number> = {
      'semantic_caching': 2.0,
      'context_caching': 1.5,
      'llmlingua_compression': 5.0,
      'dynamic_compression': 3.0,
      'intelligent_routing': 2.5,
      'token_counting': 1.0,
      'basic_compression': 1.8
    }
    
    const complexityMultiplier = complexityMultipliers[technique] || 2.0
    const contentSizeMultiplier = content.length / 1000
    
    return baseTime * complexityMultiplier * contentSizeMultiplier
  }

  /**
   * Estimate resource requirements
   */
  private estimateResourceRequirements(technique: string, content: string): ResourceRequirements {
    const baseRequirements = {
      memory: 10, // MB
      cpu: 0.1,   // CPU cores
      time: 100,  // milliseconds
      cost: 0.01  // estimated cost
    }
    
    const complexityMultipliers: Record<string, {memory: number, cpu: number, time: number, cost: number}> = {
      'semantic_caching': {memory: 2, cpu: 1.5, time: 2, cost: 1.5},
      'context_caching': {memory: 1.5, cpu: 1.2, time: 1.5, cost: 1.2},
      'llmlingua_compression': {memory: 4, cpu: 3, time: 5, cost: 3},
      'dynamic_compression': {memory: 3, cpu: 2.5, time: 3, cost: 2.5},
      'intelligent_routing': {memory: 2.5, cpu: 2, time: 2.5, cost: 2},
      'token_counting': {memory: 1, cpu: 1, time: 1, cost: 1},
      'basic_compression': {memory: 1.8, cpu: 1.5, time: 1.8, cost: 1.5}
    }
    
    const multipliers = complexityMultipliers[technique] || {memory: 2, cpu: 1.5, time: 2, cost: 1.5}
    const contentSizeMultiplier = content.length / 1000
    
    return {
      memory: baseRequirements.memory * multipliers.memory * contentSizeMultiplier,
      cpu: baseRequirements.cpu * multipliers.cpu,
      time: baseRequirements.time * multipliers.time * contentSizeMultiplier,
      cost: baseRequirements.cost * multipliers.cost * contentSizeMultiplier
    }
  }

  /**
   * Estimate token count
   */
  private estimateTokenCount(content: string, technique: string): number {
    const baseTokens = Math.ceil(content.length / 4) // Rough estimate: 4 chars per token
    const techniqueMultipliers: Record<string, number> = {
      'semantic_caching': 0.1,  // 90% reduction
      'context_caching': 0.15,  // 85% reduction
      'llmlingua_compression': 0.2,  // 80% reduction
      'dynamic_compression': 0.25,  // 75% reduction
      'intelligent_routing': 0.6,  // 40% reduction
      'token_counting': 0.9,  // 10% reduction
      'basic_compression': 0.4  // 60% reduction
    }
    
    const multiplier = techniqueMultipliers[technique] || 0.9
    return Math.ceil(baseTokens * multiplier)
  }

  /**
   * Get complexity multiplier
   */
  private getComplexityMultiplier(technique: string): number {
    const multipliers: Record<string, number> = {
      'semantic_caching': 2.0,
      'context_caching': 1.5,
      'llmlingua_compression': 4.0,
      'dynamic_compression': 3.0,
      'intelligent_routing': 2.5,
      'token_counting': 1.0,
      'basic_compression': 1.8
    }
    
    return multipliers[technique] || 2.0
  }

  /**
   * Get storage multiplier
   */
  private getStorageMultiplier(technique: string): number {
    const multipliers: Record<string, number> = {
      'semantic_caching': 0.2,
      'context_caching': 0.3,
      'llmlingua_compression': 0.1,
      'dynamic_compression': 0.15,
      'intelligent_routing': 0.05,
      'token_counting': 0.02,
      'basic_compression': 0.1
    }
    
    return multipliers[technique] || 0.1
  }

  /**
   * Get network multiplier
   */
  private getNetworkMultiplier(technique: string): number {
    const multipliers: Record<string, number> = {
      'semantic_caching': 0.1,
      'context_caching': 0.2,
      'llmlingua_compression': 0.05,
      'dynamic_compression': 0.1,
      'intelligent_routing': 0.3,
      'token_counting': 0.01,
      'basic_compression': 0.08
    }
    
    return multipliers[technique] || 0.1
  }

  /**
   * Assess risk for multiple techniques
   */
  private assessMultiTechniqueRisk(techniques: CostEstimate[]): 'low' | 'medium' | 'high' {
    const maxRisk = techniques.reduce((max, t) => {
      const riskScore = t.riskLevel === 'high' ? 0.8 : t.riskLevel === 'medium' ? 0.5 : 0.2
      return Math.max(max, riskScore)
    }, 0)
    
    if (maxRisk >= 0.7) return 'high'
    if (maxRisk >= 0.4) return 'medium'
    return 'low'
  }

  /**
   * Generate combinations
   */
  private generateCombinations<T>(array: T[], size: number): T[][] {
    if (size > array.length) return []
    if (size === 1) return array.map(item => [item])
    
    const combinations: T[][] = []
    
    for (let i = 0; i <= array.length - size; i++) {
      const head = array[i]
      const tailCombinations = this.generateCombinations(array.slice(i + 1), size - 1)
      
      for (const tail of tailCombinations) {
        combinations.push([head, ...tail])
      }
    }
    
    return combinations
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(type: 'single' | 'multi', technique: CostEstimate): string {
    if (type === 'single') {
      return `Use ${technique.technique} for ${technique.riskLevel} risk and ${Math.round(technique.costEffectiveness * 100)}% cost effectiveness`
    } else {
      return `Multi-technique approach for balanced optimization`
    }
  }

  /**
   * Get remaining budget
   */
  private getRemainingBudget(): number {
    return this.config.totalBudget - this.calculateUsedBudget()
  }

  /**
   * Calculate used budget
   */
  private calculateUsedBudget(): number {
    return Array.from(this.budgetTracking.values()).reduce((sum, cost) => sum + cost, 0)
  }

  /**
   * Update budget tracking
   */
  private updateBudgetTracking(strategy: OptimizationStrategy): void {
    strategy.techniques.forEach(technique => {
      const currentCost = this.budgetTracking.get(technique) || 0
      const techniqueCost = strategy.totalCost / strategy.techniques.length
      this.budgetTracking.set(technique, currentCost + techniqueCost)
    })
  }

  /**
   * Check budget alerts
   */
  private checkBudgetAlerts(): void {
    const budgetStatus = this.getBudgetStatus()
    
    if (budgetStatus.budgetStatus === 'warning') {
      console.warn('[COST WARNING] Budget utilization at 80%')
    } else if (budgetStatus.budgetStatus === 'critical') {
      console.error('[COST CRITICAL] Budget utilization at 95%')
    } else if (budgetStatus.budgetStatus === 'emergency') {
      console.error('[COST EMERGENCY] Budget exhausted')
    }
  }

  /**
   * Calculate cost per hour
   */
  private calculateCostPerHour(): number {
    const usedBudget = this.calculateUsedBudget()
    const timeWindow = 24 // 24 hours
    return usedBudget / timeWindow
  }

  /**
   * Calculate savings per hour
   */
  private calculateSavingsPerHour(): number {
    const recentEstimates = this.costHistory.slice(-100)
    const totalSavings = recentEstimates.reduce((sum, estimate) => sum + estimate.expectedSavings, 0)
    const timeWindow = 24 // 24 hours
    return totalSavings / timeWindow
  }

  /**
   * Get fallback strategy
   */
  private getFallbackStrategy(_techniques: string[]): OptimizationStrategy {
    return {
      name: 'Fallback_No_Optimization',
      techniques: [],
      totalCost: 0,
      expectedSavings: 0,
      costEffectiveness: 0,
      qualityScore: 1.0,
      processingTime: 0,
      riskLevel: 'low',
      budgetUtilization: 0,
      recommendation: 'No optimization due to budget constraints'
    }
  }

  /**
   * Initialize cost predictions
   */
  private initializeCostPredictions(): void {
    this.costPredictions.set('semantic_caching', 0.05)
    this.costPredictions.set('context_caching', 0.03)
    this.costPredictions.set('llmlingua_compression', 0.15)
    this.costPredictions.set('dynamic_compression', 0.08)
    this.costPredictions.set('intelligent_routing', 0.06)
    this.costPredictions.set('token_counting', 0.01)
    this.costPredictions.set('basic_compression', 0.04)
  }
}