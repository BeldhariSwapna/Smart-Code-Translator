import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import HistoryList from "../components/HistoryList.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  toggleFavorite,
} from "../services/historyService.js";
import { LANGUAGES } from "../constants/languages.js";

const TYPE_CONFIG = {
  translate: {
    label: "Translate",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  analyze: {
    label: "Analyze",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  optimize: {
    label: "Optimize",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  explain: {
    label: "Explain",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
};

function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterLang, setFilterLang] = useState("");
  const [filterFav, setFilterFav] = useState(false);
  const limit = 8;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterType) filters.type = filterType;
      if (filterLang) filters.language = filterLang;
      if (filterFav) filters.favorite = true;
      const result = await getHistory(currentPage, limit, filters);
      setEntries(result.entries);
      setTotalPages(result.pagination.totalPages);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterType, filterLang, filterFav]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleView = (entry) => {
    setSelectedEntry(entry);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success("Deleted");
      if (selectedEntry?._id === id) setSelectedEntry(null);
      fetchHistory();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleFavorite = async (id) => {
    try {
      const updated = await toggleFavorite(id);
      setEntries((prev) => prev.map((e) => (e._id === id ? { ...e, favorite: updated.favorite } : e)));
      if (selectedEntry?._id === id) {
        setSelectedEntry((prev) => ({ ...prev, favorite: updated.favorite }));
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      await clearHistory();
      toast.success("History cleared");
      setSelectedEntry(null);
      fetchHistory();
    } catch {
      toast.error("Failed to clear history");
    }
  };

  const typeConf = TYPE_CONFIG[selectedEntry?.type] || {
    label: selectedEntry?.type || "",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
  };

  return (
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <div className={`w-full md:w-[350px] lg:w-[400px] shrink-0 flex-col md:border-r border-gray-700/50 bg-dark-card ${selectedEntry ? "hidden md:flex" : "flex"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">History</h2>
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/50">
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="flex-1 bg-dark-bg border border-gray-700 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
          >
            <option value="">All types</option>
            <option value="translate">Translate</option>
            <option value="analyze">Analyze</option>
            <option value="optimize">Optimize</option>
            <option value="explain">Explain</option>
          </select>
          <select
            value={filterLang}
            onChange={(e) => { setFilterLang(e.target.value); setCurrentPage(1); }}
            className="flex-1 bg-dark-bg border border-gray-700 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
          >
            <option value="">All languages</option>
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <button
            onClick={() => { setFilterFav((p) => !p); setCurrentPage(1); }}
            className={`p-1.5 rounded-lg transition-all ${filterFav ? "text-yellow-400 bg-yellow-500/10" : "text-gray-500 hover:text-gray-300"}`}
            title="Favorites only"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filterFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin h-6 w-6 text-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <HistoryList entries={entries} onView={handleView} onDelete={handleDelete} onFavorite={handleFavorite} />
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-700/50">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  p === currentPage
                    ? "bg-accent/10 text-accent"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <div className={`flex-1 flex-col bg-dark-bg ${selectedEntry ? "flex" : "hidden md:flex"}`}>
        {selectedEntry ? (
          <>
            <div className="flex items-center justify-between px-5 py-3 bg-dark-card border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-all mr-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeConf.bg} ${typeConf.color} ${typeConf.border || ""}`}>
                  {typeConf.label}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedEntry.createdAt).toLocaleString()}
                </span>
                <span className="text-xs uppercase text-gray-600">{selectedEntry.sourceLanguage}</span>
                {selectedEntry.targetLanguage && (
                  <>
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="text-xs uppercase text-gray-600">{selectedEntry.targetLanguage}</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="hidden md:block p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {/* Input Code */}
              <div className="p-4 border-b border-gray-700/50">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Input Code ({selectedEntry.sourceLanguage})</p>
                <div className="h-48 rounded-xl overflow-hidden border border-gray-700/50">
                  <CodeEditor
                    code={selectedEntry.inputCode}
                    onChange={() => {}}
                    language={selectedEntry.sourceLanguage}
                    readOnly
                  />
                </div>
              </div>

              {/* Output */}
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Output {selectedEntry.targetLanguage ? `(${selectedEntry.targetLanguage})` : ""}
                </p>
                {selectedEntry.type === "translate" && (
                  <div className="h-64 rounded-xl overflow-hidden border border-gray-700/50">
                    <CodeEditor
                      code={selectedEntry.output?.translatedCode || ""}
                      onChange={() => {}}
                      language={selectedEntry.targetLanguage}
                      readOnly
                    />
                  </div>
                )}
                {selectedEntry.type === "analyze" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-dark-card border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Time Complexity</p>
                        <p className="text-xl font-bold font-mono text-yellow-400">{selectedEntry.output?.timeComplexity}</p>
                      </div>
                      <div className="bg-dark-card border border-blue-500/20 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Space Complexity</p>
                        <p className="text-xl font-bold font-mono text-blue-400">{selectedEntry.output?.spaceComplexity}</p>
                      </div>
                    </div>
                    <div className="bg-dark-card border border-gray-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-2">Explanation</p>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEntry.output?.explanation}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.type === "optimize" && (
                  <div className="space-y-3">
                    <div className="h-64 rounded-xl overflow-hidden border border-gray-700/50">
                      <CodeEditor
                        code={selectedEntry.output?.optimizedCode || ""}
                        onChange={() => {}}
                        language={selectedEntry.sourceLanguage}
                        readOnly
                      />
                    </div>
                    <div className="bg-dark-card border border-gray-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-2">Suggestions</p>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEntry.output?.suggestions}</p>
                    </div>
                  </div>
                )}
                {selectedEntry.type === "explain" && (
                  <div className="bg-dark-card border border-gray-700/50 rounded-xl p-5">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEntry.output?.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Select an entry to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
