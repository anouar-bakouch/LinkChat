import { User } from './User';


export interface UsersState {
    list: User[];  
    loading: boolean;
    error?: string | null;
    token?: string | null;
    username?: string | null;
  }