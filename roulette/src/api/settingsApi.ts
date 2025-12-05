export interface Settings {
  id: number;
  dudCount: number;
  prizes: string[];
  donationAmount: number;
}

const API_BASE_URL = 'http://localhost:3000';

export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

export async function updateSettings(settings: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
  return response.json();
}
