import { useState } from 'react';
import { analyzeCodeApi } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';

export const useAnalyzer = () => {
  const [code, setCode] = useState<string | undefined>("def process_user_data(data):\n    results = []\n    for item in data:\n        # Complex nested logic needs review\n        if item.get('active'):\n            val = item['value'] * 2\n            results.append(val)\n    return results\n\ndef fetch_and_store(url):\n    response = requests.get(url)\n    data = response.json()");
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'gemini' | 'ollama'>('ollama'); // Defaulted to Ollama for local
  const [intent, setIntent] = useState<string>(''); // For RAG Agent Isolation
  const { addNotification } = useNotifications();

  const analyzeCode = async (language: string = 'python') => {
    if (!code) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await analyzeCodeApi(code, language, provider, intent);
      setResults(data);
      addNotification(`Analysis complete for ${language}. Found ${data.issues?.length || 0} issues.`);
      
      // Save to history
      const historyStr = localStorage.getItem('codelens_history');
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift({
        title: `Analysis - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: new Date().toISOString(),
        score: data.score,
        language: language,
        originalCode: code,
        codePreview: code.substring(0, 100),
        results: data
      });
      localStorage.setItem('codelens_history', JSON.stringify(history.slice(0, 50))); // Keep last 50
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Ensure your code is valid and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyRefactor = () => {
    if (results?.refactored_code) {
      setCode(results.refactored_code);
      addNotification('Refactored code applied to editor!');
    }
  };

  return {
    code,
    setCode,
    results,
    loading,
    error,
    provider,
    setProvider,
    intent,
    setIntent,
    analyzeCode,
    applyRefactor
  };
};
