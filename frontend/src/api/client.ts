const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function getDefaultOptions(): RequestInit {
  return {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  };
}

export async function login(username: string, password: string): Promise<{ success: true } | { error: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    ...getDefaultOptions(),
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? 'Login failed' };
  }
  return { success: true };
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    ...getDefaultOptions(),
    method: 'POST',
  });
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
}

export async function getHotels(): Promise<Hotel[]> {
  const url = `${API_BASE}/hotels?_t=${Date.now()}`;
  const res = await fetch(url, getDefaultOptions());
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
}

export async function getHotel(id: number): Promise<Hotel> {
  const url = `${API_BASE}/hotels/${id}?_t=${Date.now()}`;
  const res = await fetch(url, getDefaultOptions());
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) throw new Error('Hotel not found');
  if (!res.ok) throw new Error('Failed to fetch hotel');
  return res.json();
}

export async function createHotel(data: { name: string; address: string }): Promise<Hotel> {
  const res = await fetch(`${API_BASE}/hotels`, {
    ...getDefaultOptions(),
    method: 'POST',
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error((body as { error?: string }).error ?? 'Failed to create hotel');
  return body as Hotel;
}

export async function updateHotel(id: number, data: { name: string; address: string }): Promise<Hotel> {
  const res = await fetch(`${API_BASE}/hotels/${id}`, {
    ...getDefaultOptions(),
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) throw new Error('Hotel not found');
  if (!res.ok) throw new Error((body as { error?: string }).error ?? 'Failed to update hotel');
  return body as Hotel;
}

export async function deleteHotel(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/hotels/${id}`, {
    ...getDefaultOptions(),
    method: 'DELETE',
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 404) throw new Error('Hotel not found');
  if (!res.ok) throw new Error((body as { error?: string }).error ?? 'Failed to delete hotel');
}
