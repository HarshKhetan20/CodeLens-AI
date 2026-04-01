import React from 'react';
import { AlertTriangle, Info, ChevronDown } from 'lucide-react';

interface Issue {
  type: string;
  line?: number;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

interface IssueListProps {
  issues: Issue[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="p-6 text-center text-[var(--outline)] text-sm border border-[var(--outline)]/10 rounded-2xl bg-[var(--surface-container-high)]">
        No issues detected. Code is looking good!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {issues.map((issue, idx) => (
        <div key={idx} className="bg-[var(--surface-container-high)] border border-[var(--outline)]/10 rounded-2xl p-4 transition-all hover:bg-[var(--surface-container-highest)]">
           <div className="flex gap-4">
              <div className="mt-1">
                {issue.severity === 'high' ? (
                   <AlertTriangle className="text-red-400" size={20} />
                ) : issue.severity === 'medium' ? (
                   <AlertTriangle className="text-yellow-400" size={20} />
                ) : (
                   <Info className="text-blue-400" size={20} />
                )}
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                   <h4 className="font-bold text-sm tracking-wide text-white">{issue.type}</h4>
                   <ChevronDown className="text-[var(--outline)]" size={16} />
                 </div>
                 <p className="text-xs text-[var(--outline)] mb-4 leading-relaxed">{issue.message}</p>
                 
                 <div className="bg-[var(--surface-container-lowest)] p-3 rounded-xl border border-[var(--outline)]/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--tertiary)] tracking-wider mb-2">
                       <span className="w-4 h-4 rounded-full bg-[var(--tertiary)]/20 flex items-center justify-center">✓</span>
                       AI RECOMMENDATION
                    </div>
                    <p className="text-xs text-[var(--foreground)] leading-relaxed">
                      {issue.suggestion}
                    </p>
                    <button className="text-[10px] text-[var(--primary)] font-bold mt-3 flex items-center gap-1 hover:text-[var(--primary-fixed)] transition-colors">
                       View Suggestion &rarr;
                    </button>
                 </div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};

export default IssueList;