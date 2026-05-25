import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { LANGUAGES, STARTER_CODE, detectLanguage } from "../constants/languages.js";
import {
  translateCode,
  analyzeComplexity,
  optimizeCode,
  explainCode,
} from "../services/codeService.js";
import { useCodeContext } from "../context/CodeContext.jsx";

const ACTIONS = [
  { id: "translate", label: "Translate", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { id: "analyze", label: "Analyze", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "optimize", label: "Optimize", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "explain", label: "Explain", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const ACTION_COLORS = {
  translate: { active: "text-blue-400 border-blue-400", bg: "bg-blue-500/10" },
  analyze: { active: "text-yellow-400 border-yellow-400", bg: "bg-yellow-500/10" },
  optimize: { active: "text-green-400 border-green-400", bg: "bg-green-500/10" },
  explain: { active: "text-purple-400 border-purple-400", bg: "bg-purple-500/10" },
};

function HomePage() {
  const [code, setCode] = useState(STARTER_CODE.python);
  const [sourceLanguage, setSourceLanguage] = useState("python");
  const { setCodeContext } = useCodeContext();

  useEffect(() => {
    setCodeContext({ code, language: sourceLanguage });
  }, [code, sourceLanguage, setCodeContext]);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [activeAction, setActiveAction] = useState("translate");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSourceChange = (langId) => {
    setSourceLanguage(langId);
    setCode(STARTER_CODE[langId] || code);
    setResult(null);
  };

  const handleSwap = () => {
    if (activeAction !== "translate") return;
    const newCode = result?.translatedCode || code;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setCode(newCode);
    setResult(null);
  };

  const getFileExtension = () => {
    const lang = LANGUAGES.find((l) => l.id === (activeAction === "translate" ? targetLanguage : sourceLanguage));
    const extensions = { c: ".c", cpp: ".cpp", csharp: ".cs", java: ".java", python: ".py", javascript: ".js", typescript: ".ts", go: ".go", rust: ".rs", swift: ".swift", kotlin: ".kt", ruby: ".rb", php: ".php", r: ".r", perl: ".pl", dart: ".dart", lua: ".lua", scala: ".scala" };
    return extensions[lang?.id] || ".txt";
  };

  const handleDownload = () => {
    if (!result) return;
    let content = "";
    let filename = `code${getFileExtension()}`;
    if (activeAction === "translate") content = result.translatedCode || "";
    else if (activeAction === "optimize") content = result.optimizedCode || "";
    else return toast.error("Nothing to download");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const handleUseInEditor = (newCode, newLanguage) => {
    setCode(newCode);
    if (newLanguage) setSourceLanguage(newLanguage);
    setResult(null);
    toast.success("Code moved to editor");
  };

  const handleCopy = async () => {
    if (!result) return;
    let text = "";
    if (activeAction === "translate") text = result.translatedCode || "";
    else if (activeAction === "optimize") text = result.optimizedCode || "";
    else if (activeAction === "explain") text = result.explanation || "";
    else if (activeAction === "analyze")
      text = `Time: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n\n${result.explanation || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleRunRef = useRef(null);
  const handleRun = async () => {
    if (!code.trim()) return toast.error("Please write some code first.");
    if (!sourceLanguage) return toast.error("Select a source language.");
    if (activeAction === "translate" && !targetLanguage)
      return toast.error("Select a target language.");

    setLoading(true);
    setResult(null);
    try {
      const fns = {
        translate: () => translateCode(code, sourceLanguage, targetLanguage),
        analyze: () => analyzeComplexity(code, sourceLanguage),
        optimize: () => optimizeCode(code, sourceLanguage),
        explain: () => explainCode(code, sourceLanguage),
      };
      const data = await fns[activeAction]();
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  handleRunRef.current = handleRun;

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const color = ACTION_COLORS[activeAction];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-gray-700/50">
        <div className="flex items-center gap-1">
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => { setActiveAction(a.id); setResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeAction === a.id
                  ? `${color.bg} ${color.active}`
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
              </svg>
              {a.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {result && (activeAction === "translate" || activeAction === "optimize") && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400
                         hover:text-accent hover:bg-accent/10 transition-all"
              title="Download file"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-600">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-700 bg-dark-bg text-gray-500 font-mono text-[10px]">Ctrl</kbd>
            <span className="text-gray-600">+</span>
            <kbd className="px-1.5 py-0.5 rounded border border-gray-700 bg-dark-bg text-gray-500 font-mono text-[10px]">Enter</kbd>
          </span>
          <button
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-accent text-white text-sm font-medium
                       hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {loading ? "Processing..." : "Run"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Source panel */}
        <div className="flex-1 flex flex-col min-w-0 lg:border-r border-gray-700/50">
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-card border-b border-gray-700/50">
            <LanguageSelector value={sourceLanguage} onChange={handleSourceChange} />
            <button
              onClick={() => {
                const detected = detectLanguage(code);
                if (detected) {
                  setSourceLanguage(detected);
                  toast.success(`Detected: ${LANGUAGES.find((l) => l.id === detected)?.name}`);
                } else {
                  toast.error("Could not detect language");
                }
              }}
              className="text-xs px-2 py-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-all"
              title="Auto-detect language"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={sourceLanguage}
            />
          </div>
        </div>

        {/* Swap / Arrow */}
        <div className="hidden lg:flex items-center justify-center w-10 shrink-0 bg-dark-card border-r border-gray-700/50">
          {activeAction === "translate" ? (
            <button
              onClick={handleSwap}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-accent transition-all"
              title="Swap languages"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </div>
        {/* Mobile swap button */}
        {activeAction === "translate" && (
          <div className="flex lg:hidden items-center justify-center py-2 bg-dark-card border-b border-gray-700/50">
            <button
              onClick={handleSwap}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-accent text-xs transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swap languages
            </button>
          </div>
        )}

        {/* Output panel */}
        <div className="flex-1 flex flex-col min-w-0 border-t lg:border-t-0 border-gray-700/50">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              {activeAction === "translate" ? (
                <LanguageSelector value={targetLanguage} onChange={(v) => { setTargetLanguage(v); setResult(null); }} />
              ) : (
                <span className={`text-xs font-semibold uppercase tracking-wider ${color.active}`}>
                  {ACTIONS.find((a) => a.id === activeAction)?.label}
                </span>
              )}
            </div>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400
                           hover:text-accent hover:bg-accent/10 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0 bg-dark-bg">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-gray-500">AI is thinking...</p>
                </div>
              </div>
            ) : (
              <OutputPanel result={result} action={activeAction} targetLanguage={targetLanguage} sourceCode={code} sourceLanguage={sourceLanguage} onUseInEditor={handleUseInEditor} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
