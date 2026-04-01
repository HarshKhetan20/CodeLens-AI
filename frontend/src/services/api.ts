import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const analyzeCodeApi = async (code: string, language: string = 'python') => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert ${language} code reviewer. Analyze this code and return JUST a raw JSON object (no markdown block wrapper \`\`\`) with this exact structure:
{
  "score": (0-100 integer),
  "detectedLanguage": "${language}",
  "metrics": {
    "readability": "High/Moderate/Low",
    "readabilityDesc": "Short description",
    "complexity": "High/Moderate/Low",
    "complexityDesc": "Short description"
  },
  "issues": [
    { "type": "Issue Title", "line": line_number, "severity": "high/medium/low", "message": "Why this is an issue.", "suggestion": "How to fix it." }
  ],
  "refactored_code": "The fully refactored, optimized code. Improve structure, add helpful comments, maintain existing functionality but strictly follow best practices."
}

Code to analyze:
${code}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
