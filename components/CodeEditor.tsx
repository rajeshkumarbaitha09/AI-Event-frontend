"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }: any) {
  return (
    <Editor
      height="400px"
      defaultLanguage="cpp"
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value)}
    />
  );
}