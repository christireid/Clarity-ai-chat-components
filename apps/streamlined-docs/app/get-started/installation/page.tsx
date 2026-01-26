import { EmptyContentPage } from '@/components/EmptyContentPage'

// ISR Configuration: Tutorial content rarely changes
export const revalidate = 7200

export default function Page() {
  return <EmptyContentPage />
}
