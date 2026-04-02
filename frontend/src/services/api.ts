export const analyzeCodeApi = async (code: string, language: string = 'python', provider: string = 'gemini', intent?: string) => {
  try {
    const response = await fetch('http://localhost:3001/api/analyze', {
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
      try {
        const errJson = await response.json();
        errText = errJson.error;
      } catch (e) {
        errText = await response.text();
      }
      throw new Error(errText);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Router Error:', error);
    throw error;
  }
};
