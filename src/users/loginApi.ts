import { AppDispatch } from '../store';
import { setAuthToken } from '../features/auth/authSlice';

interface LoginCredentials {
  username: string;
  password: string;
}

export const loginUser = (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token); // Store the token in local storage
    dispatch(setAuthToken(data.token)); // Dispatch the setAuthToken action
    return data;
  } catch (error) {
    throw new Error((error as any).message);
  }
};