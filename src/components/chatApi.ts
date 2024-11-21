import { fetchWithAuth } from '../utils/fetchWithAuth';
import { User} from '../models/User';
import { Message } from '../models/Message';

export async function fetchUsersApi(): Promise<User[]> {
  return await fetchWithAuth('/api/users');
}

export async function fetchMessagesApi(userId: string): Promise<Message[]> {
  return await fetchWithAuth(`/api/messages/${userId}`);
}