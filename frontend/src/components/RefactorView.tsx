import React from 'react';
import Editor from '@monaco-editor/react';

interface RefactorViewProps {
  refactoredCode: string;
  language?: string;
}

const RefactorView: React.FC<RefactorViewProps> = ({ refactoredCode, language = 'python' }) => {
  if (!refactoredCode) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--outline)] text-sm p-8 text-center bg-[var(--surface-container)]">
         Run the analyzer to see refactored output here.
      </div>
    );
  }

  // We could use DiffEditor here if we had original code, but standard monaco is specified.
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={refactoredCode}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 64 }, // extra bottom padding for action buttons area
        lineNumbersMinChars: 4,
        overviewRulerLanes: 0,
      }}
    />
  );
};

export default RefactorView;