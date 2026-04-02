import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import ScoreCard from '../components/ScoreCard';
import IssueList from '../components/IssueList';
import RefactorView from '../components/RefactorView';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { Zap, Cpu, Cloud, AlertCircle } from 'lucide-react';

const Analyzer: React.FC = () => {
  const { code, setCode, results, loading, error, analyzeCode, applyRefactor, provider, setProvider, intent, setIntent } = useAnalyzer();
  const [language, setLanguage] = useState('python');

  // Auto-update language if the analyzer detected a different one
  useEffect(() => {
    if (results?.detectedLanguage && results.detectedLanguage !== language) {
      setLanguage(results.detectedLanguage);
    }
  }, [results?.detectedLanguage]);

  const highIssuesCount = results?.issues?.filter((i: any) => i.severity === 'high' || i.severity === 'critical').length || 0;
  const mediumIssuesCount = results?.issues?.filter((i: any) => i.severity === 'medium').length || 0;
  const lowIssuesCount = results?.issues?.filter((i: any) => i.severity === 'low').length || 0;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-2 md:p-4 gap-2 md:gap-4 lg:h-[calc(100vh-73px)]">
      {/* Left Column: Editor */}
      <div className="flex flex-col bg-[var(--surface-container)] rounded-2xl border border-[var(--border)] overflow-hidden h-[50vh] sm:h-[60vh] lg:h-auto lg:flex-1">
        <div className="h-12 border-b border-[var(--border)] flex items-center justify-between px-3 md:px-4 shrink-0">
          <div className="text-xs font-mono text-[var(--outline)] flex items-center gap-2">
            <span className="text-[var(--tertiary)]">&lt;&gt;</span> MAIN.PY
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 md:px-3 py-1 rounded-full bg-[var(--surface-container-high)] text-xs text-[var(--outline)] border border-[var(--border)] outline-none cursor-pointer hover:bg-[var(--surface-bright)] transition-colors focus:ring-1 focus:ring-[var(--primary)] text-inherit"
            >
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
        <div className="flex-1 relative">
           <CodeEditor code={code} onChange={setCode} language={language} />
        </div>
      </div>

      {/* Middle Column: Analysis */}
      <div className="w-full lg:w-[380px] xl:w-[400px] flex flex-col gap-4 md:gap-6 overflow-y-auto lg:pr-2 custom-scrollbar pb-4 lg:pb-28 relative shrink-0">
        <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight pt-2">Analysis Overview</h2>

        {/* Provider Toggle */}
        <div className="flex items-center gap-2 bg-[var(--surface-container-high)] rounded-xl p-1 border border-[var(--border)]">
          <button
            onClick={() => setProvider('ollama')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              provider === 'ollama'
                ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30'
                : 'text-[var(--outline)] hover:text-white'
            }`}
          >
            <Cpu size={12} /> Local (Ollama)
          </button>
          <button
            onClick={() => setProvider('gemini')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              provider === 'gemini'
                ? 'bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]/30'
                : 'text-[var(--outline)] hover:text-white'
            }`}
          >
            <Cloud size={12} /> Cloud (Gemini)
          </button>
        </div>

        {/* Intent / RAG Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--outline)] font-semibold uppercase tracking-wider">Intent (optional RAG filter)</label>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="e.g. optimize database queries, fix memory leaks..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--surface-container-high)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--outline)]/60 outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/20 transition-all"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
           {/* Main Health Score */}
           <div className="col-span-1 row-span-2 relative group p-[2px] rounded-3xl overflow-hidden glass-card !border-0 object-cover self-stretch flex items-stretch">
               {/* Gradient Border Approximator */}
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/50 via-transparent to-transparent opacity-50 z-0 pointer-events-none"></div>
               <div className="bg-[var(--surface-container-highest)] rounded-[calc(2rem-2px)] p-4 md:p-6 z-10 w-full flex flex-col justify-center items-center">
                  <div className="text-3xl md:text-5xl font-bold text-yellow-500 mb-2 font-mono">
                    {results?.score || '--'}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-yellow-500/80 font-bold text-center">Health<br/>Score</div>
                  {/* Small progress indicator */}
                  <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[78%] rounded-full"></div>
                  </div>
               </div>
           </div>

           <ScoreCard 
              title="Readability" 
              value={results?.metrics?.readability || '--'} 
              desc={results?.metrics?.readabilityDesc || "Awaiting analysis..."}
              icon="sparkles"
           />
           <ScoreCard 
              title="Complexity" 
              value={results?.metrics?.complexity || '--'} 
              desc={results?.metrics?.complexityDesc || "Awaiting analysis..."}
              icon="brain"
           />
        </div>

        <div className="flex items-center justify-between mt-2 md:mt-4 flex-wrap gap-2">
           <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">Detected Issues ({results?.issues?.length || 0})</h3>
           <div className="flex gap-2 flex-wrap">
             {highIssuesCount > 0 && <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">High: {highIssuesCount}</span>}
             {mediumIssuesCount > 0 && <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Medium: {mediumIssuesCount}</span>}
             {lowIssuesCount > 0 && <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Low: {lowIssuesCount}</span>}
             {results && highIssuesCount === 0 && mediumIssuesCount === 0 && lowIssuesCount === 0 && <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">All Clear</span>}
           </div>
        </div>

        <IssueList issues={results?.issues || []} />

        {/* Analyze Button — floating on desktop, inline on mobile */}
        <div className="lg:absolute lg:bottom-4 lg:left-0 lg:right-0 flex justify-center lg:pointer-events-none mt-2 lg:mt-0">
           <div className="lg:pointer-events-auto w-full lg:px-2">
             <button 
                onClick={() => analyzeCode(language)}
                disabled={loading}
                className="w-full bg-[var(--surface-bright)]/80 backdrop-blur-xl border border-[var(--primary)]/30 rounded-full py-3 md:py-4 flex items-center justify-center gap-2 text-white font-semibold hover:bg-[var(--surface-bright)] transition-all group shadow-[0_10px_40px_-10px_rgba(137,172,255,0.3)] disabled:opacity-50"
             >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <Zap className="text-[var(--primary)] group-hover:scale-110 transition-transform" size={20} />
                )}
                <span>{loading ? 'Analyzing...' : 'Analyze Code'}</span>
                <span className="text-[var(--outline)] text-xs ml-2 font-mono bg-white/5 px-2 py-1 rounded-md opacity-70 hidden sm:inline">⌘ ENTER</span>
             </button>
           </div>
        </div>
      </div>

      {/* Right Column: Refactor View */}
      <div className="flex flex-col bg-[var(--surface-container)] rounded-2xl border border-[var(--border)] overflow-hidden relative h-[50vh] sm:h-[60vh] lg:h-auto lg:flex-1">
         <div className="h-12 border-b border-[var(--border)] flex items-center justify-between px-3 md:px-4 shrink-0">
           <div className="text-xs font-bold text-[var(--outline)] tracking-widest uppercase">
             Refactored Output
           </div>
           <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-[var(--tertiary)] border border-[var(--tertiary)]/20 bg-[var(--tertiary)]/5">
             Optimal
           </div>
         </div>
         
         <div className="flex-1 overflow-hidden relative p-0 m-0">
           <RefactorView refactoredCode={results?.refactored_code || ''} language={language} />
         </div>

         {/* Refactor Actions */}
         <div className="p-3 md:p-4 border-t border-[var(--border)] shrink-0 bg-[var(--surface-container-high)] z-10">
            <button 
               onClick={applyRefactor}
               disabled={!results?.refactored_code}
               className="w-full bg-gradient-to-r from-[var(--primary-fixed)] to-[#c5d5ff] text-[var(--on-primary-fixed)] font-bold py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:grayscale transition-all hover:shadow-[0_0_30px_rgba(115,158,255,0.4)] text-sm md:text-base"
            >
               <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs">✓</span>
               Apply Refactor
            </button>
         </div>
      </div>
    </div>
  );
};

export default Analyzer;