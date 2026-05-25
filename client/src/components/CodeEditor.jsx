import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";

function CodeEditor({ code, onChange, language, readOnly = false }) {
  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      key={language + (readOnly ? "-ro" : "-rw")}
      height="100%"
      language={MONACO_LANGUAGE_MAP[language] || "plaintext"}
      value={code}
      onChange={(v) => onChange(v || "")}
      onMount={handleMount}
      theme="vs-dark"
      loading={
        <div className="h-full flex items-center justify-center bg-dark-bg">
          <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        folding: true,
        renderWhitespace: "selection",
        padding: { top: 12 },
        wordWrap: "off",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
      }}
    />
  );
}

export default CodeEditor;
