function HistoryList({ entries, onView, onDelete, onFavorite }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No history yet</p>
      </div>
    );
  }

  const typeIcons = {
    translate: (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    analyze: (
      <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    optimize: (
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    explain: (
      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const typeLabels = {
    translate: "Translate",
    analyze: "Analyze",
    optimize: "Optimize",
    explain: "Explain",
  };

  const typeColors = {
    translate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    analyze: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    optimize: "bg-green-500/10 text-green-400 border-green-500/20",
    explain: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry._id}
          onClick={() => onView(entry)}
          className="group flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-gray-700/50
                     hover:border-accent/30 hover:bg-dark-card/80 cursor-pointer transition-all duration-200"
        >
          <div className="shrink-0 w-9 h-9 rounded-lg bg-dark-bg flex items-center justify-center border border-gray-700/50">
            {typeIcons[entry.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColors[entry.type] || "bg-gray-500/10 text-gray-400"}`}>
                {typeLabels[entry.type] || entry.type}
              </span>
              {entry.sourceLanguage && (
                <span className="text-xs text-gray-500 uppercase">{entry.sourceLanguage}</span>
              )}
              {entry.targetLanguage && (
                <>
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-xs text-gray-500 uppercase">{entry.targetLanguage}</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-600 truncate font-mono">{entry.inputCode?.slice(0, 80)}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-gray-600 hidden sm:block">
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
            {onFavorite && (
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite(entry._id); }}
                className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-gray-500 hover:text-yellow-400 transition-all duration-200"
                title={entry.favorite ? "Unfavorite" : "Favorite"}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={entry.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(entry._id); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500
                         hover:text-red-400 transition-all duration-200"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
