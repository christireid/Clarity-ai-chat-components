/**
 * Simple Model Router
 *
 * Basic model selection for cost optimization
 */

import { TokenOptimizationError, TokenErrorCode } from '../errors'

export interface ModelPricing {
  id: string
  name: string
  inputCost: number
  outputCost: number
  maxTokens: number
}

export interface RoutingRequest {
  content: string
  maxTokens?: number
  priority?: 'low' | 'medium' | 'high'
}

export interface RoutingDecision {
  modelId: string
  modelName: string
  estimatedCost: number
  estimatedTokens: number
  confidence: number
}

export class SimpleModelRouter {
  private models: Map<string, ModelPricing>

  constructor() {
    this.models = new Map()
    this.initializeModels()
  }

  async routeToOptimalModel(request: RoutingRequest): Promise<RoutingDecision> {
    const availableModels = Array.from(this.models.values()).filter(
      (model) => !request.maxTokens || model.maxTokens >= request.maxTokens
    )

    if (availableModels.length === 0) {
      throw new TokenOptimizationError(
        'No suitable models available for the requested token limit',
        TokenErrorCode.MODEL_NOT_SUPPORTED,
        false,
        { requestedMaxTokens: request.maxTokens }
      )
    }

    // Select cheapest model
    const cheapestModel = availableModels.reduce((cheapest, current) =>
      current.inputCost < cheapest.inputCost ? current : cheapest
    )

    const estimatedTokens = Math.ceil(request.content.length / 4)
    const estimatedCost = estimatedTokens * cheapestModel.inputCost

    return {
      modelId: cheapestModel.id,
      modelName: cheapestModel.name,
      estimatedCost,
      estimatedTokens,
      confidence: 0.8,
    }
  }

  private initializeModels(): void {
    const models: ModelPricing[] = [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        inputCost: 0.0000015,
        outputCost: 0.000002,
        maxTokens: 16385,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        inputCost: 0.00001,
        outputCost: 0.00003,
        maxTokens: 128000,
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        inputCost: 0.00000025,
        outputCost: 0.00000125,
        maxTokens: 200000,
      },
    ]

    models.forEach((model) => {
      this.models.set(model.id, model)
    })
  }
}

/**
 * Route a request to the optimal model based on cost and requirements.
 *
 * Creates a temporary router and selects the cheapest model that
 * meets the token requirements.
 *
 * @param request - The routing request with content and constraints
 * @returns Routing decision with selected model and cost estimate
 *
 * @example
 * ```typescript
 * const decision = await routeToOptimalModel({
 *   content: 'Hello, world!',
 *   maxTokens: 4000,
 *   priority: 'medium'
 * })
 * console.log(`Using ${decision.modelName} at $${decision.estimatedCost}`)
 * ```
 */
export async function routeToOptimalModel(
  request: RoutingRequest
): Promise<RoutingDecision> {
  const router = new SimpleModelRouter()
  return await router.routeToOptimalModel(request)
}

/**
 * Get a comparison of all available models and their pricing.
 *
 * @returns Array of model pricing information
 *
 * @example
 * ```typescript
 * const models = getModelCostComparison()
 * models.forEach(m => console.log(`${m.name}: $${m.inputCost}/token`))
 * ```
 */
export function getModelCostComparison(): ModelPricing[] {
  const router = new SimpleModelRouter()
  return Array.from(router['models'].values())
}
