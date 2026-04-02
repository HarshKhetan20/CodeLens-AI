import dotenv from 'dotenv';
dotenv.config();

/**
 * KeyManager handles the rotation of API keys and models to prevent rate-limit exhaustion.
 */
class KeyManager {
  private keys: string[] = [];
  private currentKeyIndex: number = 0;

  /**
   * Models ordered by quality → speed (fallback chain).
   * Only includes text-out models with available quota from the user's API dashboard.
   *
   * Rotation logic:
   * - Try all 3 keys on current model first
   * - If all 3 keys are exhausted → downgrade to next model, reset key index
   *
   * Model API IDs → Display Name (RPM limit / RPD limit):
   *   gemini-2.5-flash        → Gemini 2.5 Flash       (5 RPM / 20 RPD)
   *   gemini-2.0-flash        → Gemini 3 Flash          (5 RPM / 20 RPD)
   *   gemini-2.5-flash-lite-preview-06-17 → Gemini 2.5 Flash Lite (10 RPM / 20 RPD)
   *   gemini-2.0-flash-lite   → Gemini 3.1 Flash Lite  (15 RPM / 500 RPD)  ← best fallback
   *   gemma-3-27b-it          → Gemma 3 27B            (30 RPM / 14.4K RPD) ← emergency
   */
  private models: string[] = [
    'gemini-2.5-flash',               // Best quality — use first
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',               // Gemini 3 Flash equivalent
    'gemini-2.0-flash',
    'gemini-embedding-1', // Lighter 2.5 flash

    'gemini-2.0-flash-lite',          // Highest RPM (15), best rate-limit fallback
    'gemma-3-27b-it',                 // Emergency fallback — 30 RPM, 14.4K RPD
  ];
  private currentModelIndex: number = 0;

  constructor() {
    const keysRaw = process.env.GEMINI_API_KEYS || '';
    this.keys = keysRaw.split(',').map((k) => k.trim()).filter((k) => k.length > 0);

    if (this.keys.length === 0) {
      console.warn("WARNING: No GEMINI_API_KEYS found in environment. Please configure .env");
    }
  }

  /**
   * Retrieves the current active API key.
   */
  public getCurrentKey(): string {
    if (this.keys.length === 0) return '';
    return this.keys[this.currentKeyIndex];
  }

  /**
   * Retrieves the current target model.
   */
  public getCurrentModel(): string {
    return this.models[this.currentModelIndex];
  }

  /**
   * Called when a 429 Too Many Requests or exhaustion error occurs.
   * Rotates the key. If all keys exhaust, rotates the model and restarts the key cycle.
   */
  public reportExhaustion() {
    const exhaustedKey = this.getCurrentKey();
    const exhaustedModel = this.getCurrentModel();
    console.warn(`[KeyManager] ⚠ Exhausted: Key[${this.currentKeyIndex}] ...${exhaustedKey.slice(-6)} on model "${exhaustedModel}"`);

    // Rotate to next key
    this.currentKeyIndex++;

    // If all keys exhausted on this model → try next model with fresh keys
    if (this.currentKeyIndex >= this.keys.length) {
      this.currentKeyIndex = 0;
      this.currentModelIndex++;

      if (this.currentModelIndex >= this.models.length) {
        console.error(`[KeyManager] ✗ FATAL: All ${this.keys.length} keys × ${this.models.length} models exhausted!`);
        this.currentModelIndex = 0; // Reset as last resort
      } else {
        console.warn(`[KeyManager] → Downgrading model to: "${this.getCurrentModel()}" (model ${this.currentModelIndex + 1}/${this.models.length})`);
      }
    } else {
      console.warn(`[KeyManager] → Trying next key[${this.currentKeyIndex}] with same model "${exhaustedModel}"`);
    }
  }
}

export const keyManager = new KeyManager();
