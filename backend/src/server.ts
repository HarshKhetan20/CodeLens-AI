import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { reviewAgent } from './agents/reviewAgent';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/analyze', async (req, res) => {
  const { code, language, provider = 'gemini', intent } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code prompt is required.' });
  }

  try {
    const analysisResponse = await reviewAgent.orchestrate({
      code,
      language: language || 'python',
      provider,
      intent
    });
    
    return res.json(analysisResponse);
  } catch (error: any) {
    console.error('[Server Error /api/analyze]:', error.message);
    const statusCode = error.message.includes('429') || error.message.includes('rate') ? 429 : 500;
    return res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
  }
});

// Boot validation
app.listen(port, () => {
  console.log(`[CodeLens-AI Backend] Secure API running on http://localhost:${port}`);
  console.log(`----------------------------------------------------------------`);
  console.log(`Checking API Keys: ${process.env.GEMINI_API_KEYS ? 'Present' : 'MISSING'}`);
  console.log(`Checking Local Ollama Binding: ${process.env.OLLAMA_BASE_URL}`);
  console.log(`----------------------------------------------------------------`);
});
