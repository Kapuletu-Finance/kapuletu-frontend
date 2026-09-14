export interface TicketMessage {
  message_id: string;
  sender_id: string;
  sender_name?: string;
  message: string;
  created_at: string;
}

export interface TicketRating {
  issue_resolved: boolean;
  satisfaction_level: number;
  response_quality: number | null;
  response_speed: number | null;
  comment: string | null;
  created_at: string;
}

export interface Ticket {
  ticket_id: string;
  user_id?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  sla_deadline?: string | null;
  assigned_admin_id?: string | null;
  has_rating?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends Ticket {
  messages: TicketMessage[];
  rating?: TicketRating | null;
}

export interface TicketCreatePayload {
  subject: string;
  message: string;
  category: string;
  priority: string;
}

export interface TicketReplyPayload {
  message: string;
}

export interface TicketRatingPayload {
  issue_resolved: boolean;
  satisfaction_level: number;
  response_quality?: number | null;
  response_speed?: number | null;
  comment?: string | null;
}
