export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const token = sessionStorage.getItem('sessionToken');

  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Request failed');
  }

  return response.json();
}