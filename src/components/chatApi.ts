import { User } from '../models/User';
import { Message } from '../models/Message';

export async function fetchUsersApi(): Promise<User[]> {
  const token = localStorage.getItem('authToken');
  const headers = new Headers();

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers,
    });

    console.log("Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const users = await response.json();
    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function fetchMessagesApi(conversationId: string): Promise<Message[]> {
  const token = localStorage.getItem('authToken');
  const headers = new Headers();

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`/api/messages?conversationId=${conversationId}`, {
      method: 'GET',
      headers,
    });

    console.log("Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const messages = await response.json();
    console.log('Fetched messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}