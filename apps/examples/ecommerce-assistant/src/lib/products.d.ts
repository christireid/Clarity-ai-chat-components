/**
 * Sample Product Catalog
 * In production, replace with database or API calls
 */
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    features: string[];
    inStock: boolean;
    rating: number;
    reviews: number;
    imageUrl: string;
    tags: string[];
}
export declare const products: Product[];
/**
 * Search products by query
 */
export declare function searchProducts(query: string, options?: {
    category?: string;
    maxPrice?: number;
    minRating?: number;
}): Product[];
/**
 * Get product by ID
 */
export declare function getProduct(id: string): Product | undefined;
/**
 * Get personalized recommendations
 */
export declare function getRecommendations(based_on?: {
    cartItems?: string[];
    viewedProducts?: string[];
    preferences?: string[];
}): Product[];
//# sourceMappingURL=products.d.ts.map