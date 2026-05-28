import { useState } from "react";
import CodeEditor from "./CodeEditor.jsx";

function InfoCard({ label, value, color }) {
  return (
    <div className="bg-dark-card border border-gray-700 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}

function OutputPanel({ result, action, targetLanguage, sourceCode, sourceLanguage, onUseInEditor }) {
  const [viewTab, setViewTab] = useState("optimized");
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
        <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <p className="text-sm">Write code, pick an action, and hit <span className="text-accent font-semibold">Run</span></p>
      </div>
    );
  }

  if (action === "translate") {
    return (
      <div className="h-full flex flex-col">
        {onUseInEditor && (
          <div className="flex justify-end px-4 py-1.5 bg-dark-card border-b border-gray-700/50">
            <button
              onClick={() => onUseInEditor(result.translatedCode || "", targetLanguage)}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Use in Editor
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0">
          <CodeEditor code={result.translatedCode || ""} onChange={() => {}} language={targetLanguage} readOnly />
        </div>
      </div>
    );
  }

  if (action === "analyze") {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard label="Time Complexity" value={result.timeComplexity} color="text-yellow-400" />
          <InfoCard label="Space Complexity" value={result.spaceComplexity} color="text-blue-400" />
        </div>
        <div className="bg-dark-card border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Explanation</p>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
        </div>
      </div>
    );
  }

  if (action === "optimize") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            {["optimized", "comparison"].map((tab) => (
              <button
                key={tab}
                onClick={() => setViewTab(tab)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  viewTab === tab
                    ? "bg-accent/10 text-accent"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "optimized" ? "Optimized" : "Diff View"}
              </button>
            ))}
          </div>
          {onUseInEditor && (
            <button
              onClick={() => onUseInEditor(result.optimizedCode || "", sourceLanguage)}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Use in Editor
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0">
          {viewTab === "optimized" ? (
            <CodeEditor
              code={result.optimizedCode || ""}
              onChange={() => {}}
              language={sourceLanguage}
              readOnly
            />
          ) : (
            <div className="h-full grid grid-cols-1 md:grid-cols-2 border-r border-gray-700/50">
              <div className="flex flex-col min-h-0 border-r border-gray-700/30">
                <div className="text-xs text-gray-600 uppercase tracking-wider px-3 py-1.5 bg-dark-card border-b border-gray-700/50">Original</div>
                <div className="flex-1 min-h-0">
                  <CodeEditor code={sourceCode || ""} onChange={() => {}} language={sourceLanguage} readOnly />
                </div>
              </div>
              <div className="flex flex-col min-h-0">
                <div className="text-xs text-green-400 uppercase tracking-wider px-3 py-1.5 bg-dark-card border-b border-gray-700/50">Optimized</div>
                <div className="flex-1 min-h-0">
                  <CodeEditor code={result.optimizedCode || ""} onChange={() => {}} language={sourceLanguage} readOnly />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-dark-card border-t border-gray-700 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Suggestions</p>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.suggestions}</p>
        </div>
      </div>
    );
  }

  if (action === "explain") {
    return (
      <div className="p-6 overflow-y-auto">
        <div className="bg-dark-card border border-gray-700 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Explanation</p>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default OutputPanel;
