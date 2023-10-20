export interface Message {
    id: string
    content: string
    machine: boolean
    failed_responding: boolean
    flagged: boolean
    conversation_id: string
    created_at: number
  }