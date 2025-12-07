/**
 * Sample Product Catalog
 * In production, replace with database or API calls
 */
export const products = [
    // Electronics
    {
        id: 'laptop-001',
        name: 'Dell XPS 15 (2024)',
        category: 'Electronics',
        price: 1899.99,
        description: 'Powerful laptop for content creation with 15.6" 4K OLED display',
        features: [
            'Intel Core i9-13900H',
            '32GB RAM',
            '1TB NVMe SSD',
            'NVIDIA RTX 4060',
            '4K OLED Touchscreen',
        ],
        inStock: true,
        rating: 4.8,
        reviews: 342,
        imageUrl: '/products/laptop-dell-xps.jpg',
        tags: ['video editing', 'content creation', 'gaming', 'professional'],
    },
    {
        id: 'laptop-002',
        name: 'MacBook Pro 14" M3 Pro',
        category: 'Electronics',
        price: 2499.0,
        description: 'Professional-grade laptop for developers and creatives',
        features: [
            'Apple M3 Pro chip',
            '18GB Unified Memory',
            '512GB SSD',
            '14.2" Liquid Retina XDR',
            '18-hour battery life',
        ],
        inStock: true,
        rating: 4.9,
        reviews: 891,
        imageUrl: '/products/macbook-pro.jpg',
        tags: ['development', 'design', 'professional', 'apple'],
    },
    {
        id: 'headphones-001',
        name: 'Sony WH-1000XM5',
        category: 'Electronics',
        price: 399.99,
        description: 'Industry-leading noise canceling wireless headphones',
        features: [
            'Best-in-class noise canceling',
            '30-hour battery life',
            'Speak-to-chat technology',
            'Multipoint connection',
            'Premium sound quality',
        ],
        inStock: true,
        rating: 4.7,
        reviews: 1523,
        imageUrl: '/products/sony-headphones.jpg',
        tags: ['audio', 'wireless', 'noise canceling', 'travel'],
    },
    {
        id: 'phone-001',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 999.0,
        description: 'Titanium design with advanced camera system',
        features: [
            'A17 Pro chip',
            '128GB storage',
            'Pro camera system',
            'Titanium design',
            'Action button',
        ],
        inStock: true,
        rating: 4.6,
        reviews: 2341,
        imageUrl: '/products/iphone-15-pro.jpg',
        tags: ['smartphone', 'apple', 'camera', '5g'],
    },
    // Clothing
    {
        id: 'jacket-001',
        name: 'Patagonia Down Jacket',
        category: 'Clothing',
        price: 299.0,
        description: 'Lightweight, packable down jacket for outdoor adventures',
        features: [
            '800-fill recycled down',
            'Water-resistant finish',
            'Packable into own pocket',
            'Fair Trade Certified',
            'Multiple color options',
        ],
        inStock: true,
        rating: 4.8,
        reviews: 567,
        imageUrl: '/products/patagonia-jacket.jpg',
        tags: ['outdoor', 'winter', 'sustainable', 'travel'],
    },
    // Home & Kitchen
    {
        id: 'coffee-001',
        name: 'Breville Barista Express',
        category: 'Home & Kitchen',
        price: 699.95,
        description: 'All-in-one espresso machine with built-in grinder',
        features: [
            'Built-in conical burr grinder',
            '15 bar Italian pump',
            'Precise espresso extraction',
            'Microfoam milk texturing',
            'Stainless steel construction',
        ],
        inStock: true,
        rating: 4.7,
        reviews: 834,
        imageUrl: '/products/breville-espresso.jpg',
        tags: ['coffee', 'kitchen', 'appliance', 'espresso'],
    },
    // More products...
    {
        id: 'monitor-001',
        name: 'LG 27" 4K Monitor',
        category: 'Electronics',
        price: 449.99,
        description: '4K IPS monitor with HDR10 and USB-C connectivity',
        features: [
            '27" 4K IPS display',
            'HDR10 support',
            'USB-C with 60W power delivery',
            '99% sRGB coverage',
            'AMD FreeSync',
        ],
        inStock: true,
        rating: 4.5,
        reviews: 412,
        imageUrl: '/products/lg-monitor.jpg',
        tags: ['monitor', 'display', '4k', 'productivity'],
    },
    {
        id: 'keyboard-001',
        name: 'Keychron K8 Pro',
        category: 'Electronics',
        price: 109.0,
        description: 'Wireless mechanical keyboard with hot-swappable switches',
        features: [
            'Hot-swappable switches',
            'RGB backlight',
            'Bluetooth 5.1',
            'Mac/Windows compatible',
            'Aluminum frame',
        ],
        inStock: true,
        rating: 4.6,
        reviews: 789,
        imageUrl: '/products/keychron-keyboard.jpg',
        tags: ['keyboard', 'mechanical', 'wireless', 'productivity'],
    },
];
/**
 * Search products by query
 */
export function searchProducts(query, options) {
    const lowerQuery = query.toLowerCase();
    return products.filter((product) => {
        // Text search
        const matchesQuery = product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
            product.features.some((f) => f.toLowerCase().includes(lowerQuery));
        if (!matchesQuery)
            return false;
        // Category filter
        if (options?.category && product.category !== options.category) {
            return false;
        }
        // Price filter
        if (options?.maxPrice && product.price > options.maxPrice) {
            return false;
        }
        // Rating filter
        if (options?.minRating && product.rating < options.minRating) {
            return false;
        }
        return true;
    });
}
/**
 * Get product by ID
 */
export function getProduct(id) {
    return products.find((p) => p.id === id);
}
/**
 * Get personalized recommendations
 */
export function getRecommendations(based_on) {
    // Simple recommendation algorithm
    // In production, use ML-based recommendations
    const { cartItems = [], viewedProducts = [], preferences = [], } = based_on || {};
    const viewed = new Set([...cartItems, ...viewedProducts]);
    const available = products.filter((p) => !viewed.has(p.id));
    // If cart has items, recommend similar products
    if (cartItems.length > 0) {
        const cartProducts = cartItems
            .map((id) => getProduct(id))
            .filter(Boolean);
        const categories = new Set(cartProducts.map((p) => p.category));
        const categoryProducts = available.filter((p) => categories.has(p.category));
        if (categoryProducts.length > 0) {
            return categoryProducts.slice(0, 5);
        }
    }
    // Default: Return top-rated products
    return available.sort((a, b) => b.rating - a.rating).slice(0, 5);
}
//# sourceMappingURL=products.js.map