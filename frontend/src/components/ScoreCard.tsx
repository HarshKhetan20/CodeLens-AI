import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  value: string | number;
  desc: string;
  icon: 'sparkles' | 'brain';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, value, desc, icon }) => {
  return (
    <div className="p-4 rounded-3xl bg-[var(--surface-container-high)] border border-[var(--outline)]/10 flex flex-col justify-between">
       <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[var(--outline)]">
         {icon === 'sparkles' ? <Sparkles className="text-[var(--tertiary)]" size={16} /> : <Brain className="text-[var(--secondary)]" size={16} />}
         {title}
       </div>
       <div className="mb-2">
         <span className="text-3xl font-bold font-sans tracking-tighter text-white">{value}</span>
       </div>
       <p className="text-xs text-[var(--tertiary-foreground)] leading-tight">{desc}</p>
    </div>
  );
};

export default ScoreCard;