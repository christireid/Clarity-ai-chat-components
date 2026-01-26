import { redirect } from 'next/navigation'

// ISR Configuration
export const revalidate = 3600

// Redirect to the API reference section (primary reference location)
export default function ReferencePage() {
  redirect('/api/reference')
}
