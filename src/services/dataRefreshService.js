// Frontend Data Refresh Service
// Communicates with backend to fetch latest competitor data from web

const API_BASE_URL = 'http://localhost:3001/api';

export async function refreshAllData() {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
}

export async function getCompetitorUpdates() {
  try {
    const response = await fetch(`${API_BASE_URL}/competitor-updates`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching competitor updates:', error);
    throw error;
  }
}

export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  refreshAllData,
  getCompetitorUpdates,
  checkServerHealth
};
