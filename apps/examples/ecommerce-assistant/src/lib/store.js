import { create } from 'zustand';
export const useCart = create((set, get) => ({
    items: [],
    addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
            return {
                items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i),
            };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
    removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
    })),
    updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
    clearCart: () => set({ items: [] }),
    get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
}));
//# sourceMappingURL=store.js.map