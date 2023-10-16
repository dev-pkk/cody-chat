export interface Bot {
  id: string;
  name: string;
  description: string;
  model: string;
  created_at: number;
}

export interface Conversation {
  id: string;
  name: string;
  bot_id: string;
  created_at: number;
}

export interface Message {
    id: string
    content: string
    machine: boolean
    failed_responding: boolean
    flagged: boolean
    conversation_id: string
    created_at: number
  }