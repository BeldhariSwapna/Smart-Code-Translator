import { LANGUAGES } from "../constants/languages.js";

function LanguageSelector({ value, onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="bg-dark-card border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">Select language</option>
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
