import { create } from 'zustand';
export const useStore = create((set) => ({
    customer: null,
    setCustomer: (customer) => set({ customer }),
    clearCustomer: () => set({ customer: null }),
}));
//# sourceMappingURL=store.js.map