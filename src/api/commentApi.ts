const BASE_URL = '/api/comments';


export const addComment = async (commentData: any, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/add?lang=${lang}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error('Error adding comment');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getComments = async (toolPath: string, page: number, size: number, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/list?toolPath=${toolPath}&page=${page}&size=${size}&lang=${lang}`);
    
    if (!response.ok) {
      throw new Error('Error fetching comments');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getSubComments = async (parentId: number, page: number, size: number, lang: string) => {
    try {
      const response = await fetch(`${BASE_URL}/sublist?parentId=${parentId}&page=${page}&size=${size}&lang=${lang}`);
      
      if (!response.ok) {
        throw new Error('Error fetching sub comments');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

export const likeComment = async (id: number, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/like/${id}?lang=${lang}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error('Error liking comment');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const reportComment = async (id: number, lang: string) => {
  try {
    const response = await fetch(`${BASE_URL}/report/${id}?lang=${lang}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error('Error reporting comment');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
