import { aiRouter, ANALYSIS_SCHEMA } from '../services/aiRouter';

export interface AgentContext {
  code: string;
  language: string;
  intent?: string;
  provider: 'gemini' | 'ollama';
}

export class ReviewAgent {
  /**
   * Both Gemini and Ollama now use single-shot mode.
   * 
   * WHY: On free tier, Gemini's RPD limit is 20.
   * The old 3-phase pipeline (RAG + Core + QA) consumed 3 RPD per analysis,
   * meaning only ~7 analyses per day. Single-shot = 1 RPD = ~20 analyses per day.
   * 
   * The responseSchema on Gemini already enforces identical JSON structure
   * to Ollama's format:'json', so multi-phase is not needed for quality.
   */
  public async orchestrate(context: AgentContext) {
    const { code, language, intent, provider } = context;
    const intentLabel = intent?.trim() || 'Reduce time complexity and optimize performance';

    console.log(`\n[ReviewAgent] ══════════════════════════════`);
    console.log(`[ReviewAgent] Provider: ${provider.toUpperCase()} | Lang: ${language}`);
    console.log(`[ReviewAgent] Intent: "${intentLabel}"`);
    console.log(`[ReviewAgent] ══════════════════════════════`);

    const prompt = `You are an expert ${language} code reviewer. Analyze this code and return JUST a raw JSON object with this exact structure:
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
  "refactored_code": "The optimized code with ONLY the necessary changes. Keep it concise — do not add excessive comments or rewrite unchanged parts."
}

IMPORTANT: Keep refactored_code SHORT. Only modify lines that need fixing. Do NOT pad with unnecessary comments or rewrite code that is already fine.

User Intent: ${intentLabel}
Code to analyze:
${code}`;

    const result = await aiRouter.generateJSON(prompt, provider, ANALYSIS_SCHEMA);
    console.log(`[ReviewAgent] ✓ Score: ${result.score} | Issues: ${result.issues?.length ?? 0}`);
    console.log(`[ReviewAgent] ══ Pipeline complete ══\n`);
    return result;
  }
}

export const reviewAgent = new ReviewAgent();
