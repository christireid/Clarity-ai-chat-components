import { EmptyContentPage } from '@/components/EmptyContentPage'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

export default function Page() {
  return <EmptyContentPage />
}
