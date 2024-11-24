

export interface Messagegrp {
    message_id: number;
    sender_id: number;
    receiver_id: number;
    sender_name: string;
    content: string;
    image_url?:string;
    timestamp: string;
  }