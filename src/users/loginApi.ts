import axios from 'axios';
import { Session } from '../models/Session';
import { CustomError } from '../models/CustomError';

export async function loginUser(
  credentials: { user_id: number; username: string; password: string },
  onSuccess: (session: Session) => void,
  onError: (error: CustomError) => void
) {
  try {
    const response = await axios.post('/api/login', credentials);
    const session: Session = response.data;
    sessionStorage.setItem('token', session.token);
    sessionStorage.setItem('externalId', session.externalId);
    if (session.id) {
      sessionStorage.setItem('id', session.id.toString());
    }
    sessionStorage.setItem('username', session.username || '');
    onSuccess(session);
  } catch (error: any) {
    const customError = new CustomError(error.response?.data?.message || 'Login failed');
    onError(customError);
  }
}