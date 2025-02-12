const BASE_URL = '/api/tool-daily-top';

export const getAllDailyTop = async (lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/?lang=${lang}`);
    
    if (!response.ok) {
      throw new Error('Error fetching getAllToolStatic');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
