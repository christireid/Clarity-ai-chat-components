import { redirect } from 'next/navigation'

// Redirect /demos to /examples (combined page)
export default function DemosPage() {
  redirect('/examples')
}
