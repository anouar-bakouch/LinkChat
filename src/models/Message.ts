

export interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  image_url?:string;
  timestamp: string;
  sender?: string;
}


