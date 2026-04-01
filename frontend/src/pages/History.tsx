import React, { useEffect, useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Edit2, Trash2, Check, X } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import RefactorView from '../components/RefactorView';

const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('codelens_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const saveHistory = (newHistory: any[]) => {
    setHistory(newHistory);
    localStorage.setItem('codelens_history', JSON.stringify(newHistory));
  };

  const handleDelete = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    saveHistory(newHistory);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleRename = (index: number, newTitle: string) => {
    const newHistory = [...history];
    newHistory[index].title = newTitle;
    saveHistory(newHistory);
    setEditingIndex(null);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3">
        <Clock className="text-[var(--primary)]" />
        Analysis History
      </h1>

      {history.length === 0 ? (
        <div className="glass-card p-6 md:p-12 text-center text-[var(--outline)] text-sm md:text-base">
          No history found. Try running an analysis in the Analyzer!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item, idx) => (
            <div key={idx} className="bg-[var(--surface-container)] rounded-2xl border border-[var(--outline)]/10 flex flex-col hover:bg-[var(--surface-container-high)] transition-all overflow-hidden">
               <div 
                 className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3"
                 onClick={(e) => {
                   // Only expand if we are not clicking the action buttons
                   if ((e.target as HTMLElement).closest('.action-buttons') || editingIndex === idx) return;
                   setExpandedIndex(expandedIndex === idx ? null : idx);
                 }}
               >
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       {editingIndex === idx ? (
                         <div className="flex items-center gap-2">
                           <input 
                             type="text" 
                             value={editTitle}
                             onChange={(e) => setEditTitle(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') handleRename(idx, editTitle);
                               if (e.key === 'Escape') setEditingIndex(null);
                             }}
                             autoFocus
                             className="bg-[var(--surface-dim)] border border-[var(--primary)] text-white rounded px-2 py-1 text-lg font-bold w-64 outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                           />
                           <button onClick={() => handleRename(idx, editTitle)} className="text-green-400 hover:text-green-300 transition-colors bg-[var(--surface-dim)] p-1.5 rounded p">
                             <Check size={16} />
                           </button>
                           <button onClick={() => setEditingIndex(null)} className="text-red-400 hover:text-red-300 transition-colors bg-[var(--surface-dim)] p-1.5 rounded">
                             <X size={16} />
                           </button>
                         </div>
                       ) : (
                         <h3 className="text-lg md:text-xl font-bold flex items-center gap-3 text-[var(--on-surface)]">
                           {item.title || `Analysis - ${new Date(item.timestamp).toLocaleDateString()}`}
                         </h3>
                       )}
                    </div>
                    <div className="text-xs md:text-sm font-mono text-[var(--outline)] flex items-center gap-3 flex-wrap">
                      <span>{new Date(item.timestamp).toLocaleString()} &bull; {item.language || 'python'}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--outline)]/50"></span>
                      <span>Score: <strong className={item.results.score >= 80 ? 'text-green-400' : 'text-yellow-400'}>{item.results.score}</strong></span>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 sm:gap-4 action-buttons shrink-0">
                   <div className="flex items-center space-x-1 sm:space-x-2">
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setEditTitle(item.title || `Analysis - ${new Date(item.timestamp).toLocaleDateString()}`);
                         setEditingIndex(idx);
                       }} 
                       className="p-2 text-[var(--outline)] hover:text-white hover:bg-[var(--surface-dim)] rounded-full transition-all"
                       title="Rename"
                     >
                        <Edit2 size={16} />
                     </button>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         if (window.confirm("Are you sure you want to delete this analysis record?")) handleDelete(idx);
                       }} 
                       className="p-2 text-[var(--outline)] hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                       title="Delete"
                     >
                        <Trash2 size={16} />
                     </button>
                   </div>
                   <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--surface-container-highest)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all text-[var(--outline)] pointer-events-none">
                     {expandedIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                   </div>
                 </div>
               </div>
               
               {/* Expanded View */}
               {expandedIndex === idx && (
                 <div className="border-t border-[var(--border)] p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4 bg-[var(--surface-dim)]">
                   <div className="flex-1 rounded-xl overflow-hidden border border-[var(--border)] flex flex-col relative min-h-[250px] md:min-h-[450px]">
                     <div className="px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--outline)] uppercase tracking-wider">Original Code</div>
                     <div className="flex-1 relative">
                       <CodeEditor code={item.originalCode || item.codePreview} onChange={() => {}} language={item.language} />
                     </div>
                   </div>
                   <div className="flex-1 rounded-xl overflow-hidden border border-[var(--border)] flex flex-col relative min-h-[250px] md:min-h-[450px]">
                     <div className="px-4 py-2 border-b border-[var(--border)] text-xs font-bold text-[var(--tertiary)] uppercase tracking-wider">Refactored Output</div>
                     <div className="flex-1 relative">
                       <RefactorView refactoredCode={item.results.refactored_code || ''} language={item.language} />
                     </div>
                   </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;