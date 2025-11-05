interface CustomerInfo {
    email: string;
    name: string;
    conversationId?: string;
}
interface StoreState {
    customer: CustomerInfo | null;
    setCustomer: (customer: CustomerInfo) => void;
    clearCustomer: () => void;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
export {};
//# sourceMappingURL=store.d.ts.map