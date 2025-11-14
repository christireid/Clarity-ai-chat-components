import { create } from 'zustand'

interface CustomerInfo {
  email: string
  name: string
  conversationId?: string
}

interface StoreState {
  customer: CustomerInfo | null
  setCustomer: (customer: CustomerInfo) => void
  clearCustomer: () => void
}

export const useStore = create<StoreState>((set) => ({
  customer: null,
  setCustomer: (customer) => set({ customer }),
  clearCustomer: () => set({ customer: null }),
}))
