// src/components/CodeEditor.tsx
import React from "react";
import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  height = "100%",
}) => {
  return (
    <Editor
      value={value}
      onChange={(val) => onChange(val ?? "")}
      language={language}
      theme="vs-dark"
      height={height}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};
