import React, { useState } from 'react';
import { Settings as SettingsIcon, Monitor, Code } from 'lucide-react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('python');

  return (
    <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3">
        <SettingsIcon className="text-[var(--primary)]" />
        Settings
      </h1>

      <div className="flex flex-col gap-6 md:gap-8">
         <div className="bg-[var(--surface-container)] rounded-2xl p-4 md:p-6 border border-[var(--outline)]/10">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
              <Monitor size={20} className="text-[var(--tertiary)]" />
              Appearance
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-[var(--surface-container-high)] rounded-xl">
               <div className="min-w-0">
                  <div className="font-bold text-sm md:text-base">Theme Mode</div>
                  <div className="text-xs md:text-sm text-[var(--outline)]">Toggle between light and dark variants</div>
               </div>
               <select 
                 value={theme}
                 onChange={e => setTheme(e.target.value)}
                 className="w-full sm:w-auto bg-[var(--surface-container-lowest)] border border-[var(--outline)]/20 rounded-lg px-3 md:px-4 py-2 outline-none focus:border-[var(--primary)] text-sm shrink-0"
               >
                 <option value="dark">Dark Space</option>
                 <option value="light">Light (Coming Soon)</option>
               </select>
            </div>
         </div>

         <div className="bg-[var(--surface-container)] rounded-2xl p-4 md:p-6 border border-[var(--outline)]/10">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
              <Code size={20} className="text-[var(--secondary)]" />
              Analyzer Defaults
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-[var(--surface-container-high)] rounded-xl">
               <div className="min-w-0">
                  <div className="font-bold text-sm md:text-base">Default Language</div>
                  <div className="text-xs md:text-sm text-[var(--outline)]">Primary language for the editor</div>
               </div>
               <select 
                 value={language}
                 onChange={e => setLanguage(e.target.value)}
                 className="w-full sm:w-auto bg-[var(--surface-container-lowest)] border border-[var(--outline)]/20 rounded-lg px-3 md:px-4 py-2 outline-none focus:border-[var(--primary)] text-sm shrink-0"
               >
                 <option value="python">Python</option>
                 <option value="javascript">JavaScript</option>
                 <option value="typescript">TypeScript</option>
               </select>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;