export const analyzeCodeApi = async (code: string, language: string = 'python', provider: string = 'gemini', intent?: string) => {
  try {
    // Dynamically route: use Vercel extension in Prod, and laptop IP / localhost in Dev
    const API_BASE = import.meta.env.PROD ? '/_/backend' : `http://${window.location.hostname}:3001`;
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
