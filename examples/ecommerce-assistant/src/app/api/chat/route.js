import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchProducts, getProduct, getRecommendations } from '@/lib/products';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Define available functions for the AI
const functions = [
    {
        name: 'search_products',
        description: 'Search for products in the catalog based on customer query, category, or price range',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query (product name, features, or keywords)',
                },
                category: {
                    type: 'string',
                    enum: ['Electronics', 'Clothing', 'Home & Kitchen'],
                    description: 'Product category filter',
                },
                maxPrice: {
                    type: 'number',
                    description: 'Maximum price filter',
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'get_product_details',
        description: 'Get detailed information about a specific product by ID',
        parameters: {
            type: 'object',
            properties: {
                productId: {
                    type: 'string',
                    description: 'The product ID',
                },
            },
            required: ['productId'],
        },
    },
    {
        name: 'get_recommendations',
        description: 'Get personalized product recommendations for the customer',
        parameters: {
            type: 'object',
            properties: {
                preferences: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Customer preferences or interests',
                },
            },
        },
    },
];
export async function POST(req) {
    try {
        const { messages } = await req.json();
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are ShopBot, an enthusiastic and helpful shopping assistant for an e-commerce store. 
Your goal is to help customers find the perfect products by:
- Understanding their needs through conversation
- Searching the product catalog
- Providing personalized recommendations
- Answering product questions
- Helping with comparisons
- Assisting with purchase decisions

Always be friendly, knowledgeable, and customer-focused. Use the available functions to search products and provide recommendations.`,
                },
                ...messages,
            ],
            functions,
            function_call: 'auto',
            temperature: 0.7,
        });
        const message = response.choices[0].message;
        // Handle function calls
        if (message.function_call) {
            const functionName = message.function_call.name;
            const functionArgs = JSON.parse(message.function_call.arguments);
            let functionResult;
            switch (functionName) {
                case 'search_products':
                    const searchResults = searchProducts(functionArgs.query, {
                        category: functionArgs.category,
                        maxPrice: functionArgs.maxPrice,
                    });
                    functionResult = {
                        products: searchResults.map((p) => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            rating: p.rating,
                            inStock: p.inStock,
                        })),
                        count: searchResults.length,
                    };
                    break;
                case 'get_product_details':
                    const product = getProduct(functionArgs.productId);
                    functionResult = product || { error: 'Product not found' };
                    break;
                case 'get_recommendations':
                    const recommendations = getRecommendations({
                        preferences: functionArgs.preferences,
                    });
                    functionResult = {
                        products: recommendations.map((p) => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            rating: p.rating,
                        })),
                    };
                    break;
                default:
                    functionResult = { error: 'Unknown function' };
            }
            // Send function result back to GPT
            const followUpResponse = await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    ...messages,
                    message,
                    {
                        role: 'function',
                        name: functionName,
                        content: JSON.stringify(functionResult),
                    },
                ],
                temperature: 0.7,
            });
            return NextResponse.json({
                message: followUpResponse.choices[0].message.content,
                function_called: functionName,
                products: functionResult.products || [],
            });
        }
        return NextResponse.json({
            message: message.content,
        });
    }
    catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map