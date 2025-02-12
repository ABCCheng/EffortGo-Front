const BASE_URL = '/api/tool-static';

export const getAllToolStatic = async (lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/alltools?lang=${lang}`);
    
    if (!response.ok) {
      throw new Error('Error fetching getAllToolStatic');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getToolStatic = async (toolPath: string, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${toolPath}?lang=${lang}`);
    
    if (!response.ok) {
      throw new Error('Error fetching getToolStatic');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const favorite = async (toolPath: string, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/favorite/${toolPath}?lang=${lang}`, { method: 'POST'});
    if (!response.ok) {
      throw new Error('Error fetch favorite');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const unfavorite = async (toolPath: string, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/unfavorite/${toolPath}?lang=${lang}`, { method: 'POST'});
    if (!response.ok) {
      throw new Error('Error fetch unfavorite');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const reportError = async (toolPath: string, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/report-error/${toolPath}?lang=${lang}`, { method: 'POST'});
    if (!response.ok) {
      throw new Error('Error fetch reportError');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
