// src/components/CodeEditor.tsx
import React from "react";
import Editor, { loader } from "@monaco-editor/react";

// Register Lua language with Monaco
loader.init().then((monaco) => {
  import("monaco-editor/esm/vs/basic-languages/lua/lua").then((mod) => {
    monaco.languages.register({ id: "lua" });
    monaco.languages.setMonarchTokensProvider("lua", mod.language);
    monaco.languages.setLanguageConfiguration("lua", mod.conf);
  });
});

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "lua",
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
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
      }}
    />
  );
};
