import { Message } from "./Message";
import { User } from "./User";


export interface ChatState {
    users: User[];
    messages: Message[];
    currentUser: User | null;
    loading: boolean;
    error?: string | null;
  }