interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
}
interface ProductCardProps {
    product: Product;
    compact?: boolean;
}
export declare function ProductCard({ product, compact }: ProductCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ProductCard.d.ts.map