export interface Lead {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  location: string
  score: number
  stage: string
  lastContact: Date
}

export interface Deal {
  id: string
  name: string
  value: number
  stage: string
  probability: number
  leadId: string
  closeDate: Date
}
