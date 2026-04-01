import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string | undefined;
  onChange: (value: string | undefined) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language = 'python' }) => {
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 4,
        overviewRulerLanes: 0,
        renderLineHighlight: 'all',
      }}
      loading={<div className="flex bg-[var(--surface-container)] w-full h-full items-center justify-center text-[var(--outline)]">Loading Editor...</div>}
    />
  );
};

export default CodeEditor;