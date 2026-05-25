export const SUPPORTED_LANGUAGES = [
  { id: "c", name: "C", extension: ".c" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "csharp", name: "C#", extension: ".cs" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "python", name: "Python", extension: ".py" },
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "typescript", name: "TypeScript", extension: ".ts" },
  { id: "go", name: "Go", extension: ".go" },
  { id: "rust", name: "Rust", extension: ".rs" },
  { id: "swift", name: "Swift", extension: ".swift" },
  { id: "kotlin", name: "Kotlin", extension: ".kt" },
  { id: "ruby", name: "Ruby", extension: ".rb" },
  { id: "php", name: "PHP", extension: ".php" },
  { id: "r", name: "R", extension: ".r" },
  { id: "perl", name: "Perl", extension: ".pl" },
  { id: "dart", name: "Dart", extension: ".dart" },
  { id: "lua", name: "Lua", extension: ".lua" },
  { id: "scala", name: "Scala", extension: ".scala" },
];

export const getLanguageName = (languageId) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
  return lang ? lang.name : languageId;
};
