export const analyzeCodeApi = async (code: string, language: string = 'python', provider: string = 'gemini', intent?: string) => {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        provider,
        intent
      }),
    });

    if (!response.ok) {
      let errText = "Unknown Server Error";
      const clonedResponse = response.clone();
      try {
        const errJson = await response.json();
        errText = errJson.error || JSON.stringify(errJson);
      } catch (e) {
        errText = await clonedResponse.text();
      }
      throw new Error(errText);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Router Error:', error);
    throw error;
  }
};
