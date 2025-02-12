const BASE_URL = '/ip-api';

export const getIpInfo = async (ip: string, lang: string) => {
  try {
    if (lang === 'zh') {
      lang = 'zh-CN';
    } 
    const response = await fetch(`${BASE_URL}/json/${ip}?lang=${lang}`);
    
    if (!response.ok) {
      throw new Error('Error fetching getIpInfo');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};


