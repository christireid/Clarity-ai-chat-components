# 🛍️ E-Commerce Shopping Assistant Demo

AI-powered shopping assistant that helps customers find products, provides recommendations, and
assists with purchases.

## ✨ Features

- 🛒 **Product Recommendations** - AI suggests products based on customer needs
- 🔍 **Smart Search** - Natural language product search
- 💬 **Conversational Shopping** - Ask questions, get personalized advice
- 🏷️ **Price Comparison** - Compare similar products
- 📦 **Order Tracking** - Check order status via chat
- 🎯 **Cart Management** - Add/remove items through conversation
- 💰 **Deal Alerts** - Notify about sales and discounts
- ⭐ **Review Summaries** - AI-generated product review insights

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- OpenAI API key

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your OpenAI API key
echo "OPENAI_API_KEY=sk-..." >> .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Product Catalog

```typescript
interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  features: string[]
  inStock: boolean
  rating: number
  reviews: number
  imageUrl: string
}
```

### AI Functions

The assistant uses **OpenAI Function Calling** to interact with the product catalog:

```typescript
const functions = [
  {
    name: 'search_products',
    description: 'Search for products based on customer query',
    parameters: {
      query: 'string',
      category: 'optional string',
      maxPrice: 'optional number',
    },
  },
  {
    name: 'get_product_details',
    description: 'Get detailed information about a specific product',
    parameters: {
      productId: 'string',
    },
  },
  {
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart',
    parameters: {
      productId: 'string',
      quantity: 'number',
    },
  },
  {
    name: 'get_recommendations',
    description: 'Get personalized product recommendations',
    parameters: {
      based_on: 'customer preferences or cart items',
    },
  },
]
```

## 💡 Use Cases

### 1. Product Discovery

**Customer**: "I need a laptop for video editing"  
**Assistant**: _Searches products, analyzes requirements_  
**Assistant**: "I found 3 laptops perfect for video editing. The Dell XPS 15 has excellent specs..."

### 2. Price Comparison

**Customer**: "What's the difference between the iPhone 15 and 15 Pro?"  
**Assistant**: _Compares products_  
**Assistant**: "Here's a detailed comparison: Camera, battery, features..."

### 3. Cart Management

**Customer**: "Add the blue wireless headphones to my cart"  
**Assistant**: _Calls add_to_cart function_  
**Assistant**: "Added Sony WH-1000XM5 Blue to your cart! Total: $399"

### 4. Order Tracking

**Customer**: "Where's my order #12345?"  
**Assistant**: _Calls check_order_status function_  
**Assistant**: "Your order is out for delivery, expected today by 5 PM"

## 🎯 Key Features Demonstrated

### Function Calling (Tools)

- Product search with filters
- Cart operations (add, remove, update)
- Order status checking
- Recommendation engine

### Context Management

- Remembers customer preferences
- Maintains shopping session
- Tracks conversation history

### Enhanced UI

- Product cards with images
- Cart preview
- Price display
- Stock indicators
- Rating stars

## 📊 Sample Product Catalog

The demo includes a sample catalog with:

- 50+ products across electronics, clothing, home goods
- Realistic prices and descriptions
- Stock availability
- Customer ratings
- Product images

## 🔧 Customization

### Add Your Product Catalog

```typescript
// src/lib/products.ts
export const products: Product[] = [
  {
    id: 'prod_123',
    name: 'Your Product',
    category: 'Electronics',
    price: 299.99,
    description: 'Product description',
    features: ['Feature 1', 'Feature 2'],
    inStock: true,
    rating: 4.5,
    reviews: 150,
    imageUrl: '/products/your-product.jpg',
  },
]
```

### Connect to Real Database

```typescript
// Replace in-memory catalog with database queries
import { db } from '@/lib/database'

async function searchProducts(query: string) {
  return await db.products.search({
    where: { name: { contains: query } },
    take: 10,
  })
}
```

### Integrate Payment Processing

```typescript
// Add Stripe or other payment processor
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function createCheckout(cartItems) {
  const session = await stripe.checkout.sessions.create({
    line_items: cartItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
  })
  return session.url
}
```

## 🚀 Production Considerations

### 1. Real Product Data

- Connect to your e-commerce platform API (Shopify, WooCommerce, etc.)
- Sync product availability in real-time
- Update prices dynamically

### 2. Authentication

- Add user authentication (NextAuth.js, Clerk, etc.)
- Link chat history to user accounts
- Secure cart operations

### 3. Analytics

- Track product impressions from AI recommendations
- Measure conversion rate from chat
- A/B test different recommendation strategies

### 4. Performance

- Cache product data with Redis
- Use CDN for product images
- Implement rate limiting

### 5. Security

- Validate all function calls
- Sanitize user input
- Implement cart security (prevent price manipulation)

## 📚 Technologies Used

- **Next.js 15** - React framework with App Router
- **OpenAI GPT-4** - Function calling for product operations
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Zod** - Runtime validation

## 🔗 Related Examples

- [AI Assistant](../ai-assistant) - TanStack Query patterns
- [RAG Workbench](../rag-workbench-demo) - Document search
- [Model Comparison](../model-comparison-demo) - Multi-model comparison

## 📖 Learn More

- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [E-Commerce AI Best Practices](https://www.freshworks.com/conversational-ai/usecases/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📝 License

MIT

---

**Status**: 🎯 Production-Ready  
**Use Case**: E-commerce & Retail  
**Complexity**: Intermediate  
**AI Provider**: OpenAI (GPT-4 with function calling)
