import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { keyManager } from './KeyManager';
import { Ollama } from 'ollama';

// ─── Schema Definitions ───────────────────────────────────────────────────────
// These lock Gemini's output to the exact same structure that Ollama produces.
// Gemini's responseSchema = Ollama's format:'json' — strict field enforcement.

export const ANALYSIS_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.INTEGER, description: "Overall code health score 0-100" },
    detectedLanguage: { type: SchemaType.STRING },
    metrics: {
      type: SchemaType.OBJECT,
      properties: {
        readability: { type: SchemaType.STRING, description: "High, Moderate, or Low" },
        readabilityDesc: { type: SchemaType.STRING },
        complexity: { type: SchemaType.STRING, description: "High, Moderate, or Low" },
        complexityDesc: { type: SchemaType.STRING },
      },
      required: ['readability', 'readabilityDesc', 'complexity', 'complexityDesc'],
    },
    issues: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          line: { type: SchemaType.INTEGER },
          severity: { type: SchemaType.STRING, description: "high, medium, or low" },
          message: { type: SchemaType.STRING },
          suggestion: { type: SchemaType.STRING },
        },
        required: ['type', 'line', 'severity', 'message', 'suggestion'],
      },
    },
    refactored_code: { type: SchemaType.STRING, description: "Complete refactored source code" },
  },
  required: ['score', 'detectedLanguage', 'metrics', 'issues', 'refactored_code'],
};

export const RAG_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    target_code: { type: SchemaType.STRING },
    extracted_symbols: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    token_savings_pct: { type: SchemaType.INTEGER },
  },
  required: ['target_code', 'extracted_symbols', 'token_savings_pct'],
};

export const QA_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    approved: { type: SchemaType.BOOLEAN },
    corrections_made: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    final_code: { type: SchemaType.STRING },
  },
  required: ['approved', 'corrections_made', 'final_code'],
};

// ─── AI Router ────────────────────────────────────────────────────────────────

export class AIRouter {
  private ollama: Ollama;

  // System instruction — makes Gemini behave as a coding specialist
  private readonly SYSTEM_INSTRUCTION = `You are CodeLens AI, an expert multilingual code analysis and refactoring system.
You produce CONCISE output. Your refactored code only changes lines that need fixing — never rewrite unchanged code.
You strictly follow the provided JSON schema — never omit required fields.
Keep issue descriptions under 20 words each. Keep metric descriptions under 15 words.
All severity values must be exactly: "high", "medium", or "low".
All readability/complexity values must be exactly: "High", "Moderate", or "Low".
Do NOT add excessive inline comments to refactored_code.`;

  constructor() {
    this.ollama = new Ollama({ host: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434' });
  }

  /**
   * Gemini call with key/model rotation + responseSchema (strict field enforcement)
   * This is the equivalent of Ollama's format:'json' — locks every field type and name.
   */
  private async executeGemini(prompt: string, schema: Schema, maxRetries = 15): Promise<string> {
    let attempts = 0;
    while (attempts < maxRetries) {
      const currentKey = keyManager.getCurrentKey();
      const currentModel = keyManager.getCurrentModel();

      if (!currentKey) throw new Error("No Gemini API keys found in backend/.env");

      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({
        model: currentModel,
        systemInstruction: this.SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,        // ← THE KEY: forces exact field structure
          temperature: 0.1,             // Very low = consistent, deterministic output
          topP: 0.8,
          maxOutputTokens: 4096,         // Safe cap — conciseness enforced by prompts, not truncation
        } as any,
      });

      try {
        console.log(`[Gemini] → ${currentModel} | Key ...${currentKey.slice(-6)}`);
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`[Gemini] ✓ Response: ${text.length} chars`);
        return text;
      } catch (err: any) {
        const shouldRotate =
          err.status === 429 ||
          err.status === 503 ||
          err.status === 404 ||
          err.status === 400 ||
          err.message?.includes('RESOURCE_EXHAUSTED') ||
          err.message?.includes('quota') ||
          err.message?.includes('exhausted') ||
          err.message?.includes('not found') ||
          err.message?.includes('not supported') ||
          err.message?.includes('high demand') ||
          err.message?.includes('Service Unavailable');

        if (shouldRotate) {
          const reason = err.status === 429 ? 'Rate limited' 
            : err.status === 503 ? 'Service unavailable'
            : err.status === 404 ? 'Model not found'
            : 'Error';
          console.warn(`[Gemini] ⚠ ${reason} on ...${currentKey.slice(-6)} / ${currentModel}. Rotating...`);
          keyManager.reportExhaustion();
          attempts++;
        } else {
          throw err;
        }
      }
    }
    throw new Error(`All ${maxRetries} Gemini retries exhausted across keys/models.`);
  }

  /**
   * Ollama call with native JSON enforcement
   */
  private async executeOllama(prompt: string): Promise<string> {
    const model = process.env.OLLAMA_DEFAULT_MODEL || 'qwen2.5-coder:7b';
    console.log(`[Ollama] → ${model}`);
    try {
      const response = await this.ollama.generate({
        model,
        prompt,
        stream: false,
        format: 'json',
        options: { temperature: 0.1, top_p: 0.8, num_predict: 8192 },
      });
      console.log(`[Ollama] ✓ Response: ${response.response.length} chars`);
      return response.response;
    } catch (err: any) {
      throw new Error(`Ollama failed: ${err.message}. Is the Ollama daemon running?`);
    }
  }

  /**
   * Public method — routes to correct provider with schema enforcement
   * schema only applies to Gemini (Ollama uses its own format:'json')
   */
  public async generateJSON(
    prompt: string,
    provider: 'gemini' | 'ollama',
    schema: Schema = ANALYSIS_SCHEMA
  ): Promise<any> {
    let raw = '';

    if (provider === 'gemini') {
      raw = await this.executeGemini(prompt, schema);
    } else {
      raw = await this.executeOllama(prompt);
    }

    // Safety strip — shouldn't be needed with schema enforcement, but belt-and-suspenders
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      return JSON.parse(raw);
    } catch {
      console.error('[AIRouter] JSON parse failed. Sample:', raw.substring(0, 400));
      throw new Error('AI returned malformed JSON. Check server logs.');
    }
  }
}

export const aiRouter = new AIRouter();
