/**
 * Simple Model Router
 *
 * Basic model selection for cost optimization
 */
export class SimpleModelRouter {
    models;
    constructor() {
        this.models = new Map();
        this.initializeModels();
    }
    async routeToOptimalModel(request) {
        const availableModels = Array.from(this.models.values())
            .filter(model => !request.maxTokens || model.maxTokens >= request.maxTokens);
        if (availableModels.length === 0) {
            throw new Error('No suitable models available');
        }
        // Select cheapest model
        const cheapestModel = availableModels.reduce((cheapest, current) => current.inputCost < cheapest.inputCost ? current : cheapest);
        const estimatedTokens = Math.ceil(request.content.length / 4);
        const estimatedCost = estimatedTokens * cheapestModel.inputCost;
        return {
            modelId: cheapestModel.id,
            modelName: cheapestModel.name,
            estimatedCost,
            estimatedTokens,
            confidence: 0.8
        };
    }
    initializeModels() {
        const models = [
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                inputCost: 0.0000015,
                outputCost: 0.000002,
                maxTokens: 16385
            },
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                inputCost: 0.00001,
                outputCost: 0.00003,
                maxTokens: 128000
            },
            {
                id: 'claude-3-haiku',
                name: 'Claude 3 Haiku',
                inputCost: 0.00000025,
                outputCost: 0.00000125,
                maxTokens: 200000
            }
        ];
        models.forEach(model => {
            this.models.set(model.id, model);
        });
    }
}
export async function routeToOptimalModel(request) {
    const router = new SimpleModelRouter();
    return await router.routeToOptimalModel(request);
}
export function getModelCostComparison() {
    const router = new SimpleModelRouter();
    return Array.from(router['models'].values());
}
//# sourceMappingURL=simple-router.js.map